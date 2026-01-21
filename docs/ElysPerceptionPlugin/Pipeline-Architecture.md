# Pipeline Architecture

This document provides an in-depth explanation of the ElysPerceptionPlugin's Pipeline architecture.

## Table of Contents
- [Overview](#overview)
- [Architecture Diagram](#architecture-diagram)
- [Pipeline Flow](#pipeline-flow)
- [Context System](#context-system)
- [Multi-Channel Support](#multi-channel-support)
- [Extensibility](#extensibility)

---

## Overview

### What is the Pipeline System?

The Pipeline system is a **modular, data-driven architecture** for evaluating perception candidates. Instead of hardcoded perception logic, the system uses a configurable series of stages that can be mixed and matched to create custom behavior.

### Why Does It Exist?

**Problems with traditional perception systems:**
- Monolithic code that's hard to customize
- Mixing concerns (sampling, filtering, scoring)
- Difficult to extend without modifying engine code
- One-size-fits-all approach doesn't fit all use cases

**Pipeline system benefits:**
- **Separation of Concerns**: Each stage has one job
- **Composability**: Mix default and custom components
- **Reusability**: Same components work across channels
- **Extensibility**: Add custom logic without touching core code
- **Configuration**: Designers can tweak in editor without C++

### Design Philosophy

1. **Data Over Code**: Behavior is configured, not coded
2. **Immutable Context**: All stages read from same snapshot
3. **Pure Functions**: Stages don't modify state, only evaluate
4. **Independence**: Multiple channels run in parallel
5. **Opt-In**: Targets choose to participate

---

## Architecture Diagram

```
┌─────────────────────────────────────────────────────────────┐
│                   UERPPerceptionComponent                    │
│                                                               │
│  ┌──────────────────────┐      ┌──────────────────────┐    │
│  │   Target Pipeline    │      │ Interaction Pipeline │    │
│  │   (Channel: Target)  │      │ (Channel: Interact)  │    │
│  └──────────────────────┘      └──────────────────────┘    │
│              │                            │                  │
│              └──────────┬─────────────────┘                  │
│                         │                                    │
│                         ▼                                    │
│              ┌────────────────────┐                         │
│              │ FERPPerceptionContext │                        │
│              │  • Origin            │                        │
│              │  • Forward           │                        │
│              │  • AimRay            │                        │
│              │  • Viewport          │                        │
│              └────────────────────┘                         │
└─────────────────────────────────────────────────────────────┘

Each Pipeline Executes:

  ┌─────────────┐
  │  1. SAMPLER │  Collects candidate actors from world
  └──────┬──────┘
         │ Outputs: TArray<AActor*>
         ▼
  ┌─────────────┐
  │ 2. FILTERS  │  Eliminates invalid candidates (ALL must pass)
  └──────┬──────┘
         │ Outputs: TArray<AActor*> (filtered)
         ▼
  ┌─────────────┐
  │ 3. SCORERS  │  Assigns scores to each candidate
  └──────┬──────┘
         │ Outputs: TArray<TArray<float>> (scores per candidate)
         ▼
  ┌─────────────┐
  │4. AGGREGATOR│  Combines multiple scores into one per candidate
  └──────┬──────┘
         │ Outputs: TArray<FERPPipelineScoredCandidate>
         ▼
  ┌─────────────┐
  │ 5. RESOLVER │  Selects the winning candidate
  └──────┬──────┘
         │ Outputs: FERPPipelineScoredCandidate (winner)
         ▼
  ┌─────────────┐
  │   RESULT    │  Best candidate for this channel
  └─────────────┘
```

---

## Pipeline Flow

### Stage 1: Sampler

**Purpose:** Collect potential candidate actors from the world.

**Input:**
- `FERPPerceptionContext` - Perception context
- `float Range` - Maximum detection range

**Output:**
- `TArray<AActor*>` - All candidate actors

**Signature:**
```cpp
UFUNCTION(BlueprintNativeEvent, Category = "ElysPerception|Pipeline")
void Sample(const FERPPerceptionContext& Context, float Range, TArray<AActor*>& OutCandidates) const;
```

**Responsibility:**
- Query the world for actors (overlap, ray cast, etc.)
- Return raw list without filtering
- Should be fast and broad

**Example Logic:**
- Sphere overlap around origin
- Line trace in forward direction
- Query spatial hash/octree
- Get actors from GameState

**Default Implementation:**
- `UERPSphereOverlapSampler` - Sphere overlap query

---

### Stage 2: Filters

**Purpose:** Eliminate invalid candidates. ALL filters must pass for a candidate to proceed.

**Input:**
- `FERPPerceptionContext` - Perception context
- `AActor* Candidate` - Single candidate to test

**Output:**
- `bool` - True if candidate passes, false if rejected

**Signature:**
```cpp
UFUNCTION(BlueprintNativeEvent, Category = "ElysPerception|Pipeline")
bool Passes(const FERPPerceptionContext& Context, AActor* Candidate) const;
```

**Responsibility:**
- Fast rejection of invalid candidates
- Binary decision (pass/fail)
- No scoring, just validation

**Example Logic:**
- Check if actor implements required interface
- Verify actor is alive
- Check line of sight
- Validate actor state
- Range check

**Default Implementations:**
- `UERPTargetableFilter` - Requires IERPTargetable interface
- `UERPInteractableFilter` - Requires IERPInteractable interface
- `UERPImplementsInterfaceFilter` - Generic interface check

**Execution:**
Filters run in **sequence**. If any filter returns false, the candidate is rejected immediately (short-circuit evaluation).

---

### Stage 3: Scorers

**Purpose:** Assign numerical scores to candidates. Multiple scorers can evaluate different aspects.

**Input:**
- `FERPPerceptionContext` - Perception context
- `AActor* Candidate` - Candidate to score

**Output:**
- `float` - Normalized score (typically 0.0-1.0, but can be any range)

**Signature:**
```cpp
UFUNCTION(BlueprintNativeEvent, Category = "ElysPerception|Pipeline")
float Score(const FERPPerceptionContext& Context, AActor* Candidate) const;
```

**Responsibility:**
- Evaluate one aspect of the candidate
- Return normalized score where possible
- Should not eliminate candidates (use Filters for that)
- Can return negative values if needed

**Example Logic:**
- Distance from origin
- Angle from forward vector
- Screen position (viewport ellipse)
- Dot product with aim ray
- Custom gameplay metrics (health, threat level)

**Default Implementations:**
- `UERPDistanceScorer` - Scores based on distance (lower = closer = better)
- `UERPConeScorer` - Scores based on angle from forward (0 = directly ahead)
- `UERPViewportEllipseScorer` - Scores based on screen position

**Execution:**
All scorers run for each candidate, producing an array of scores per candidate.

---

### Stage 4: Aggregator

**Purpose:** Combine multiple scores into a single final score per candidate.

**Input:**
- `TArray<float> Scores` - All scores for one candidate

**Output:**
- `float` - Single aggregated score

**Signature:**
```cpp
UFUNCTION(BlueprintNativeEvent, Category = "ElysPerception|Pipeline")
float Aggregate(const TArray<float>& Scores) const;
```

**Responsibility:**
- Reduce multiple scores to one value
- Handle empty arrays (return default)
- Define how scores combine

**Example Logic:**
- Pass through single score
- Sum scores (additive)
- Multiply scores (multiplicative)
- Weighted average
- Min/max of scores

**Default Implementations:**
- `UERPIdentityAggregator` - Returns first score (for single scorer)
- `UERPAdditiveAggregator` - Sums all scores
- `UERPMultiplicativeAggregator` - Multiplies all scores

**Note:** If you have only one scorer, use `UERPIdentityAggregator` for efficiency.

---

### Stage 5: Resolver

**Purpose:** Select the winning candidate from all scored candidates.

**Input:**
- `TArray<FERPPipelineScoredCandidate>` - All candidates with final scores

**Output:**
- `bool` - True if a winner was found
- `FERPPipelineScoredCandidate& OutBest` - The winning candidate

**Signature:**
```cpp
UFUNCTION(BlueprintNativeEvent, Category = "ElysPerception|Pipeline")
bool Resolve(const TArray<FERPPipelineScoredCandidate>& ScoredCandidates, FERPPipelineScoredCandidate& OutBest) const;
```

**Responsibility:**
- Determine which candidate wins
- Handle empty arrays (return false)
- Define "better" (lowest vs highest score)

**Example Logic:**
- Lowest score wins (distance-based)
- Highest score wins (priority-based)
- Closest to target value
- Random selection

**Default Implementations:**
- `UERPLowestScoreResolver` - Selects candidate with lowest score
- `UERPHighestScoreResolver` - Selects candidate with highest score

**Execution:**
Resolver runs once per channel with all scored candidates.

---

## Context System

### FERPPerceptionContext

The context is an **immutable snapshot** of perception data, built once per tick and shared across all channels.

**Purpose:**
- Provide consistent data to all pipeline stages
- Avoid repeated queries (GetActorLocation, etc.)
- Decouple perception from specific owner types

**Contents:**

```cpp
struct FERPPerceptionContext
{
    // Origin of perception (typically owner location)
    AActor* ContextActor;
    FVector Origin;
    FVector Forward;

    // Optional aim ray (from camera or weapon)
    bool bHasAimRay;
    FVector AimOrigin;
    FVector AimDirection;

    // Optional viewport projection (for screen-space scoring)
    bool bHasViewportProjection;
    FVector2D ViewportCenterPx;
    float ViewportEllipseHalfWidthPx;
    float ViewportEllipseHalfHeightPx;
};
```

### Context Building

The perception component builds the context each tick:

1. **Get Owner Actor** - The component's owner (PlayerController, Pawn)
2. **Get View Point** - Location and rotation for perception
3. **Extract Aim Ray** - Optional camera or weapon aim
4. **Calculate Viewport Data** - For screen-space scoring (PlayerController only)

### Context Provider Interface

Components implement `IERPPerceptionContextProvider`:

```cpp
class IERPPerceptionContextProvider
{
    UFUNCTION(BlueprintNativeEvent)
    FERPPerceptionContext GetPerceptionContext() const;
};
```

This allows custom context building for specific use cases.

### Why Immutable?

**Benefits:**
- Thread-safe (if needed in future)
- Predictable behavior across stages
- No hidden state changes
- Easy to debug and test

**Implications:**
- Pipeline stages cannot modify context
- All stages see identical data
- Context is rebuilt each tick

---

## Multi-Channel Support

### Channel Independence

Each channel runs its own complete pipeline:
- Has its own sampler, filters, scorers, aggregator, resolver
- Maintains its own best candidate
- Fires its own events
- Independent configuration

**Example Configuration:**

```cpp
// Target Channel: Combat targeting
TargetPipeline.ChannelId = "Target";
TargetPipeline.Sampler = SphereOverlapSampler;
TargetPipeline.Filters = { TargetableFilter };
TargetPipeline.Scorers = { DistanceScorer, ConeScorer };
TargetPipeline.Aggregator = AdditiveAggregator;
TargetPipeline.Resolver = LowestScoreResolver;

// Interaction Channel: Door/pickup interactions
InteractionPipeline.ChannelId = "Interaction";
InteractionPipeline.Sampler = SphereOverlapSampler;
InteractionPipeline.Filters = { InteractableFilter };
InteractionPipeline.Scorers = { DistanceScorer };
InteractionPipeline.Aggregator = IdentityAggregator;
InteractionPipeline.Resolver = LowestScoreResolver;
```

### Shared Context

While channels are independent, they **share the same context**:
- Same origin point
- Same forward direction
- Same viewport data
- Built once, used by all

This ensures consistency and performance.

### Focus Winner

The perception component determines a **focus winner** each tick:

```cpp
// Winner codes
0 = No winner (no valid candidates)
1 = Target channel has focus
2 = Interaction channel has focus
```

**Rules:**
- Only one channel has focus at a time
- Target channel priority is configurable
- Events include `bHasCurrentFocus` flag
- UI/gameplay can respond to focus changes

### Adding Custom Channels

You can add more channels beyond Target and Interaction:

```cpp
// Healing Target Channel
UPROPERTY(EditAnywhere, BlueprintReadWrite, Category = "Perception|Pipelines")
FERPChannelPipeline HealTargetPipeline;

// Custom Filter: Only friendly low-health actors
// Custom Scorer: Prioritize lowest health
```

The system supports unlimited channels, though 2-3 is typical for performance.

---

## Extensibility

### Creating Custom Pipeline Components

The Pipeline system is designed for extension. You can create custom implementations of any stage.

### Custom Sampler

**Use Cases:**
- Query gameplay systems instead of world
- Use navmesh for AI awareness
- Implement predictive sampling

**Example: Query GameState for all pawns**

```cpp
UCLASS()
class UMyGameStateSampler : public UERPSamplerBase
{
    GENERATED_BODY()

public:
    virtual void Sample_Implementation(const FERPPerceptionContext& Context, float Range, TArray<AActor*>& OutCandidates) const override
    {
        UWorld* World = Context.ContextActor->GetWorld();
        AGameStateBase* GameState = World->GetGameState();
        
        // Get all pawns from game state
        for (APlayerState* PS : GameState->PlayerArray)
        {
            if (APawn* Pawn = PS->GetPawn())
            {
                if (Pawn != Context.ContextActor)
                {
                    float Dist = FVector::Distance(Context.Origin, Pawn->GetActorLocation());
                    if (Dist <= Range)
                    {
                        OutCandidates.Add(Pawn);
                    }
                }
            }
        }
    }
};
```

### Custom Filter

**Use Cases:**
- Line of sight checks
- Team/faction filtering
- State validation (alive, active)
- Permission checks

**Example: Line of Sight Filter**

```cpp
UCLASS()
class UMyLineOfSightFilter : public UERPFilterBase
{
    GENERATED_BODY()

public:
    UPROPERTY(EditAnywhere, Category = "Filter")
    TEnumAsByte<ECollisionChannel> TraceChannel = ECC_Visibility;

    virtual bool Passes_Implementation(const FERPPerceptionContext& Context, AActor* Candidate) const override
    {
        if (!Candidate || !Context.ContextActor)
            return false;

        FVector Start = Context.Origin;
        FVector End = Candidate->GetActorLocation();

        FHitResult HitResult;
        FCollisionQueryParams Params;
        Params.AddIgnoredActor(Context.ContextActor);

        bool bHit = Context.ContextActor->GetWorld()->LineTraceSingleByChannel(
            HitResult, Start, End, TraceChannel, Params
        );

        // Pass if we hit the candidate or nothing
        return !bHit || HitResult.GetActor() == Candidate;
    }
};
```

### Custom Scorer

**Use Cases:**
- Gameplay-specific scoring (health, threat)
- Weighted multi-factor scoring
- Time-based scoring
- Player preference weighting

**Example: Health Priority Scorer**

```cpp
UCLASS()
class UMyHealthPriorityScorer : public UERPScorerBase
{
    GENERATED_BODY()

public:
    UPROPERTY(EditAnywhere, Category = "Scorer")
    bool bPrioritizeLowHealth = true;

    virtual float Score_Implementation(const FERPPerceptionContext& Context, AActor* Candidate) const override
    {
        // Assuming candidates have a health component
        UHealthComponent* HealthComp = Candidate->FindComponentByClass<UHealthComponent>();
        if (!HealthComp)
            return 1.0f; // Neutral score

        float HealthPercent = HealthComp->GetHealthPercent();

        // Lower health = lower score (better)
        if (bPrioritizeLowHealth)
            return HealthPercent; // 0.0 (critical) to 1.0 (full health)
        else
            return 1.0f - HealthPercent; // Prioritize high health
    }
};
```

### Custom Aggregator

**Use Cases:**
- Weighted averaging
- Non-linear combinations
- Min/max selection
- Custom math formulas

**Example: Weighted Average Aggregator**

```cpp
UCLASS()
class UMyWeightedAggregator : public UERPAggregatorBase
{
    GENERATED_BODY()

public:
    UPROPERTY(EditAnywhere, Category = "Aggregator")
    TArray<float> Weights = {1.0f};

    virtual float Aggregate_Implementation(const TArray<float>& Scores) const override
    {
        if (Scores.Num() == 0)
            return 0.0f;

        float WeightedSum = 0.0f;
        float TotalWeight = 0.0f;

        for (int32 i = 0; i < Scores.Num(); ++i)
        {
            float Weight = (i < Weights.Num()) ? Weights[i] : 1.0f;
            WeightedSum += Scores[i] * Weight;
            TotalWeight += Weight;
        }

        return (TotalWeight > 0.0f) ? (WeightedSum / TotalWeight) : 0.0f;
    }
};
```

### Custom Resolver

**Use Cases:**
- Sticky targeting (prefer current target)
- Random selection
- Round-robin
- Priority tiers

**Example: Sticky Target Resolver**

```cpp
UCLASS()
class UMyStickyResolver : public UERPResolverBase
{
    GENERATED_BODY()

public:
    UPROPERTY(EditAnywhere, Category = "Resolver")
    float StickyBias = 0.1f; // 10% score advantage for current target

    UPROPERTY()
    AActor* LastWinner = nullptr;

    virtual bool Resolve_Implementation(const TArray<FERPPipelineScoredCandidate>& ScoredCandidates, FERPPipelineScoredCandidate& OutBest) const override
    {
        if (ScoredCandidates.Num() == 0)
            return false;

        OutBest = ScoredCandidates[0];

        for (const FERPPipelineScoredCandidate& Candidate : ScoredCandidates)
        {
            float AdjustedScore = Candidate.Score;

            // Give current target a score bonus
            if (Candidate.Actor == LastWinner)
                AdjustedScore -= StickyBias;

            if (AdjustedScore < OutBest.Score)
                OutBest = Candidate;
        }

        // Remember winner for next frame
        const_cast<UMyStickyResolver*>(this)->LastWinner = OutBest.Actor;
        return true;
    }
};
```

### Blueprint Custom Components

You can also create custom pipeline components in **Blueprint**:

1. **Create Blueprint Class** derived from:
   - `ERPSamplerBase`
   - `ERPFilterBase`
   - `ERPScorerBase`
   - `ERPAggregatorBase`
   - `ERPResolverBase`

2. **Override Event:**
   - `Sample`
   - `Passes`
   - `Score`
   - `Aggregate`
   - `Resolve`

3. **Implement Logic** using Blueprint nodes

4. **Use in Pipeline** by selecting your BP class

**Example: Blueprint Scorer for checking actor tags**

```
Event Score
  → Get Actor Tags (Candidate)
  → Contains: "Priority"
    True: → Return 0.0 (highest priority)
    False: → Return 1.0 (normal priority)
```

### Best Practices for Custom Components

1. **Keep Stages Pure**
   - Don't modify candidates or context
   - Only read and evaluate

2. **Optimize for Performance**
   - Filters run per-candidate, keep them fast
   - Cache expensive calculations
   - Avoid allocations in hot path

3. **Normalize Scores**
   - Use 0.0-1.0 range when possible
   - Document expected ranges
   - Make combinable with other scorers

4. **Handle Edge Cases**
   - Null checks
   - Empty arrays
   - Invalid context

5. **Document Parameters**
   - Use `UPROPERTY` meta tags
   - Add tooltips
   - Provide sensible defaults

6. **Test Independently**
   - Unit test each component
   - Test with empty inputs
   - Verify with different contexts

---

## Summary

The Pipeline architecture provides:

✅ **Modularity** - Mix and match components  
✅ **Flexibility** - Configure without code  
✅ **Extensibility** - Add custom logic easily  
✅ **Performance** - Optimize individual stages  
✅ **Clarity** - Clear separation of concerns  
✅ **Reusability** - Share components across channels  

For practical examples, see [Examples.md](Examples.md).  
For API details, see [API-Reference.md](API-Reference.md).
