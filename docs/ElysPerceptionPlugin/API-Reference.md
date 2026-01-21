# API Reference

Complete reference for all public classes, interfaces, and events in ElysPerceptionPlugin.

## Table of Contents
- [Core Components](#core-components)
- [Interfaces](#interfaces)
- [Pipeline Base Classes](#pipeline-base-classes)
- [Default Implementations](#default-implementations)
- [Events](#events)
- [Data Structures](#data-structures)

---

## Core Components

### UERPPerceptionComponent

The main perception component that manages pipeline execution and maintains channel state.

**Header:** `Core/ERPPerceptionComponent.h`

#### Properties

| Property | Type | Description |
|----------|------|-------------|
| `FocusRange` | `float` | Maximum detection range in cm. Default: 2000.0 |
| `FocusTraceChannel` | `ECollisionChannel` | Collision channel for queries. Default: ECC_Visibility |
| `FocusZoneCenter` | `FVector2D` | Viewport center for ellipse (0-1 normalized). Default: (0.5, 0.5) |
| `FocusZoneHalfWidth` | `float` | Half-width of focus ellipse (normalized). Default: 0.05 |
| `FocusZoneHalfHeight` | `float` | Half-height of focus ellipse (normalized). Default: 0.05 |
| `FocusLoseDeadzoneMultiplier` | `float` | Hysteresis multiplier for losing focus. Default: 3.0 |
| `bUseViewportProjectionWhenAvailable` | `bool` | Use screen-space ellipse if available. Default: false |
| `AimConeHalfAngleDegrees` | `float` | World-space cone angle when viewport unavailable. Default: 10.0 |
| `bDebugFocus` | `bool` | Enable debug visualization. Default: false |
| `TargetPipeline` | `FERPChannelPipeline` | Configuration for target channel |
| `InteractionPipeline` | `FERPChannelPipeline` | Configuration for interaction channel |

#### Methods

**Targeting API:**

```cpp
// Lock the specified target (freezes target channel evaluation)
UFUNCTION(BlueprintCallable, Category = "Targeting")
void LockTarget(AActor* NewTarget);

// Unlock the current target (resumes normal evaluation)
UFUNCTION(BlueprintCallable, Category = "Targeting")
void UnlockTarget();

// Get the current primary target (locked or best candidate)
UFUNCTION(BlueprintCallable, Category = "Targeting")
AActor* GetPrimaryTarget() const;

// Check if a target is currently locked
UFUNCTION(BlueprintCallable, Category = "Targeting")
bool IsTargetLocked() const;
```

**Interaction API:**

```cpp
// Get the current best interactable candidate
UFUNCTION(BlueprintCallable, Category = "Interaction")
AActor* GetCurrentInteractable() const;
```

**Evaluation API:**

```cpp
// Manually trigger focus evaluation (normally happens on tick)
UFUNCTION(BlueprintCallable, Category = "Perception")
FERPFocusEvaluationResult EvaluateFocus() const;

// Get the current winner code (0=none, 1=target, 2=interaction)
UFUNCTION(BlueprintCallable, Category = "Perception")
int32 GetCurrentWinnerCode() const;
```

**Permission Hooks:**

```cpp
// Initiator-side permission check for targeting (override in BP/C++)
UFUNCTION(BlueprintCallable, BlueprintNativeEvent, Category = "Targeting|Permissions")
bool CanTargetActor(AActor* TargetActor) const;

// Initiator-side permission check for interaction (override in BP/C++)
UFUNCTION(BlueprintCallable, BlueprintNativeEvent, Category = "Interaction|Permissions")
bool CanInteractWithActor(AActor* TargetActor) const;
```

**Context Provider:**

```cpp
// Get the current perception context (can be overridden)
UFUNCTION(BlueprintCallable, BlueprintNativeEvent, Category = "Perception|Source")
FERPPerceptionContext GetPerceptionContext() const;

// Get aim ray origin and direction (can be overridden for custom cameras)
UFUNCTION(BlueprintCallable, BlueprintNativeEvent, Category = "Perception|Source")
void GetPerceptionAimRay(FVector& OutOrigin, FVector& OutDirection) const;
```

#### Events

See [Events](#events) section for detailed event signatures.

---

## Interfaces

### IERPTargetable

Target-side opt-in interface for actors that can be targeted.

**Header:** `Core/ERPTargetable.h`

```cpp
UINTERFACE(BlueprintType)
class UERPTargetable : public UInterface
{
    GENERATED_BODY()
};

class IERPTargetable
{
    GENERATED_BODY()

public:
    // Returns whether this actor accepts being targeted by the specified actor
    UFUNCTION(BlueprintCallable, BlueprintNativeEvent, Category = "Targeting|Permissions")
    bool CanBeTargetedBy(AActor* TargetingActor) const;
};
```

**Usage:**

**Blueprint:**
1. Class Settings → Interfaces → Add `ERPTargetable`
2. Implement `Can Be Targeted By` function
3. Return `true` to allow targeting

**C++:**
```cpp
class AMyEnemy : public ACharacter, public IERPTargetable
{
    virtual bool CanBeTargetedBy_Implementation(AActor* TargetingActor) const override
    {
        return bIsAlive;
    }
};
```

---

### IERPInteractable

Target-side opt-in interface for objects that can be interacted with.

**Header:** `Core/ERPInteractable.h`

```cpp
UINTERFACE(BlueprintType)
class UERPInteractable : public UInterface
{
    GENERATED_BODY()
};

class IERPInteractable
{
    GENERATED_BODY()

public:
    // Returns whether interaction is currently allowed
    UFUNCTION(BlueprintCallable, BlueprintNativeEvent, Category = "Interaction")
    bool CanInteract(AActor* InteractingActor) const;
};
```

**Usage:**

**Blueprint:**
1. Class Settings → Interfaces → Add `ERPInteractable`
2. Implement `Can Interact` function
3. Return `true` to allow interaction

**C++:**
```cpp
class AMyDoor : public AActor, public IERPInteractable
{
    virtual bool CanInteract_Implementation(AActor* InteractingActor) const override
    {
        return !bIsLocked;
    }
};
```

---

### IERPPerceptionContextProvider

Interface for providing custom perception context.

**Header:** `Core/IERPPerceptionContextProvider.h`

```cpp
UINTERFACE(BlueprintType)
class UERPPerceptionContextProvider : public UInterface
{
    GENERATED_BODY()
};

class IERPPerceptionContextProvider
{
    GENERATED_BODY()

public:
    UFUNCTION(BlueprintCallable, BlueprintNativeEvent, Category = "Perception")
    FERPPerceptionContext GetPerceptionContext() const;
};
```

**Note:** `UERPPerceptionComponent` already implements this interface. Override `GetPerceptionContext` for custom behavior.

---

## Pipeline Base Classes

### UERPSamplerBase

Base class for candidate sampling implementations.

**Header:** `Pipeline/ERPSamplerBase.h`

```cpp
UCLASS(Abstract, BlueprintType, Blueprintable, EditInlineNew, DefaultToInstanced)
class UERPSamplerBase : public UObject
{
    GENERATED_BODY()

public:
    // Collect candidate actors from the world
    UFUNCTION(BlueprintNativeEvent, Category = "ElysPerception|Pipeline")
    void Sample(const FERPPerceptionContext& Context, float Range, TArray<AActor*>& OutCandidates) const;
};
```

**Parameters:**
- `Context` - Perception context (origin, forward, etc.)
- `Range` - Maximum detection range
- `OutCandidates` - Output array to populate with candidates

**Return:** None (populates output array)

---

### UERPFilterBase

Base class for candidate filtering implementations.

**Header:** `Pipeline/ERPFilterBase.h`

```cpp
UCLASS(Abstract, BlueprintType, Blueprintable, EditInlineNew, DefaultToInstanced)
class UERPFilterBase : public UObject
{
    GENERATED_BODY()

public:
    // Test if a candidate should pass the filter
    UFUNCTION(BlueprintNativeEvent, Category = "ElysPerception|Pipeline")
    bool Passes(const FERPPerceptionContext& Context, AActor* Candidate) const;
};
```

**Parameters:**
- `Context` - Perception context
- `Candidate` - Actor to test

**Return:** `true` if candidate passes, `false` if rejected

---

### UERPScorerBase

Base class for candidate scoring implementations.

**Header:** `Pipeline/ERPScorerBase.h`

```cpp
UCLASS(Abstract, BlueprintType, Blueprintable, EditInlineNew, DefaultToInstanced)
class UERPScorerBase : public UObject
{
    GENERATED_BODY()

public:
    // Calculate score for a candidate
    UFUNCTION(BlueprintNativeEvent, Category = "ElysPerception|Pipeline")
    float Score(const FERPPerceptionContext& Context, AActor* Candidate) const;
};
```

**Parameters:**
- `Context` - Perception context
- `Candidate` - Actor to score

**Return:** `float` score (typically 0.0-1.0, but any range allowed)

---

### UERPAggregatorBase

Base class for score aggregation implementations.

**Header:** `Pipeline/ERPAggregatorBase.h`

```cpp
UCLASS(Abstract, BlueprintType, Blueprintable, EditInlineNew, DefaultToInstanced)
class UERPAggregatorBase : public UObject
{
    GENERATED_BODY()

public:
    // Combine multiple scores into a single value
    UFUNCTION(BlueprintNativeEvent, Category = "ElysPerception|Pipeline")
    float Aggregate(const TArray<float>& Scores) const;
};
```

**Parameters:**
- `Scores` - Array of scores from all scorers for one candidate

**Return:** `float` aggregated score

---

### UERPResolverBase

Base class for winner resolution implementations.

**Header:** `Pipeline/ERPResolverBase.h`

```cpp
UCLASS(Abstract, BlueprintType, Blueprintable, EditInlineNew, DefaultToInstanced)
class UERPResolverBase : public UObject
{
    GENERATED_BODY()

public:
    // Select the best candidate from all scored candidates
    UFUNCTION(BlueprintNativeEvent, Category = "ElysPerception|Pipeline")
    bool Resolve(const TArray<FERPPipelineScoredCandidate>& ScoredCandidates, FERPPipelineScoredCandidate& OutBest) const;
};
```

**Parameters:**
- `ScoredCandidates` - All candidates with their final scores
- `OutBest` - Output parameter for the winning candidate

**Return:** `true` if a winner was found, `false` if no valid candidates

---

## Default Implementations

### Samplers

#### UERPSphereOverlapSampler

Samples candidates using sphere overlap query.

**Header:** `Pipeline/Defaults/ERPSphereOverlapSampler.h`

| Property | Type | Default | Description |
|----------|------|---------|-------------|
| `TraceChannel` | `ECollisionChannel` | ECC_Visibility | Collision channel for overlap query |
| `ActorClass` | `TSubclassOf<AActor>` | AActor | Filter by actor class |
| `bIgnoreContextActor` | `bool` | true | Exclude the perception owner from results |

**Algorithm:**
1. Performs `SphereOverlapActors` at context origin
2. Filters by collision channel and actor class
3. Optionally removes context actor

**Use Cases:**
- General purpose detection
- Finding actors within range
- Combat targeting
- Interaction detection

---

### Filters

#### UERPTargetableFilter

Filters candidates that implement `IERPTargetable` interface.

**Header:** `Pipeline/Defaults/ERPTargetableFilter.h`

**Algorithm:**
1. Checks if candidate implements `IERPTargetable`
2. Calls `CanBeTargetedBy(ContextActor)`
3. Returns result

**Use Cases:**
- Target channel pipelines
- Ensuring only targetable actors pass

#### UERPInteractableFilter

Filters candidates that implement `IERPInteractable` interface.

**Header:** `Pipeline/Defaults/ERPInteractableFilter.h`

**Algorithm:**
1. Checks if candidate implements `IERPInteractable`
2. Calls `CanInteract(ContextActor)`
3. Returns result

**Use Cases:**
- Interaction channel pipelines
- Ensuring only interactable objects pass

#### UERPImplementsInterfaceFilter

Generic filter for checking interface implementation.

**Header:** `Pipeline/Defaults/ERPImplementsInterfaceFilter.h`

| Property | Type | Description |
|----------|------|-------------|
| `InterfaceClass` | `TSubclassOf<UInterface>` | The interface to check for |

**Algorithm:**
1. Checks if candidate implements specified interface
2. Does NOT call interface methods

**Use Cases:**
- Custom channel pipelines
- Filtering by any interface type
- Quick interface-based rejection

---

### Scorers

#### UERPDistanceScorer

Scores candidates based on distance from origin.

**Header:** `Pipeline/Defaults/ERPDistanceScorer.h`

| Property | Type | Default | Description |
|----------|------|---------|-------------|
| `bNormalizeByRange` | `bool` | true | Normalize distance to 0-1 range |
| `bRejectBeyondMaxDistance` | `bool` | false | Return negative score (rejection) beyond max |
| `MaxDistance` | `float` | 1000.0 | Maximum distance for rejection |

**Algorithm:**
```
Distance = |Candidate.Location - Context.Origin|
If (bRejectBeyondMaxDistance && Distance > MaxDistance):
    Return -1.0
If (bNormalizeByRange):
    Return Distance / Range  // 0.0 = at origin, 1.0 = at range
Else:
    Return Distance  // Raw distance
```

**Score Meaning:**
- Lower score = closer = better (use with `LowestScoreResolver`)
- 0.0 = at origin
- 1.0 = at max range (when normalized)
- Negative = rejected

**Use Cases:**
- Prioritize closest targets
- Distance-based sorting
- Combined with other scorers

#### UERPConeScorer

Scores candidates based on angle from forward vector.

**Header:** `Pipeline/Defaults/ERPConeScorer.h`

| Property | Type | Default | Description |
|----------|------|---------|-------------|
| `ConeHalfAngleDegrees` | `float` | 10.0 | Half-angle of acceptance cone (0-89) |
| `bRejectOutsideCone` | `bool` | true | Reject candidates outside cone |

**Algorithm:**
```
Direction = Normalize(Candidate.Location - Context.Origin)
DotProduct = Dot(Direction, Context.Forward)
Angle = Acos(DotProduct)

If (bRejectOutsideCone && Angle > ConeHalfAngle):
    Return -1.0  // Reject

// Normalize angle to 0-1
Return Angle / ConeHalfAngle
```

**Score Meaning:**
- Lower score = more centered = better
- 0.0 = directly ahead
- 1.0 = at cone edge
- Negative = outside cone (rejected)

**Use Cases:**
- Forward-facing targeting
- Field of view filtering
- Camera-relative scoring

#### UERPViewportEllipseScorer

Scores candidates based on screen-space ellipse distance.

**Header:** `Pipeline/Defaults/ERPViewportEllipseScorer.h`

**Algorithm:**
```
If (!Context.bHasViewportProjection):
    Return 1.0  // Neutral score

ScreenPos = ProjectToScreen(Candidate.Location)
EllipseNormalizedDist = CalculateEllipseDistance(ScreenPos, Center, HalfWidth, HalfHeight)

Return EllipseNormalizedDist  // 0.0 = at center, 1.0 = at ellipse edge
```

**Score Meaning:**
- Lower score = closer to screen center = better
- 0.0 = at viewport center
- 1.0 = at ellipse boundary
- >1.0 = outside ellipse

**Use Cases:**
- Screen-center targeting (crosshair)
- UI-driven selection
- Controller-friendly targeting

---

### Aggregators

#### UERPIdentityAggregator

Passes through the first score unchanged. Use with single scorer.

**Header:** `Pipeline/Defaults/ERPIdentityAggregator.h`

**Algorithm:**
```
If (Scores.Num() > 0):
    Return Scores[0]
Else:
    Return 0.0
```

**Use Cases:**
- Single scorer pipelines
- No score combination needed
- Performance optimization

#### UERPAdditiveAggregator

Sums all scores together.

**Header:** `Pipeline/Defaults/ERPAdditiveAggregator.h`

**Algorithm:**
```
Sum = 0.0
For each Score in Scores:
    Sum += Score
Return Sum
```

**Score Meaning:**
- Each scorer contributes additively
- Distance penalty + angle penalty = total penalty

**Use Cases:**
- Combining independent penalties
- Accumulating multiple factors
- Weighted sum (use weights in scorers)

**Example:**
```
DistanceScore = 0.5  (50% of max range)
AngleScore = 0.3     (30% off center)
Total = 0.8          (combined penalty)
```

#### UERPMultiplicativeAggregator

Multiplies all scores together.

**Header:** `Pipeline/Defaults/ERPMultiplicativeAggregator.h`

**Algorithm:**
```
Product = 1.0
For each Score in Scores:
    Product *= Score
Return Product
```

**Score Meaning:**
- Each scorer acts as a multiplier/modifier
- One zero score makes total zero
- All scores affect final result

**Use Cases:**
- Weighted modifiers
- Confidence scaling
- Probability combination

**Example:**
```
BaseScore = 0.5      (base priority)
VisibilityMod = 0.8  (80% visible)
AngleMod = 0.9       (good angle)
Total = 0.36         (0.5 * 0.8 * 0.9)
```

---

### Resolvers

#### UERPLowestScoreResolver

Selects the candidate with the lowest score.

**Header:** `Pipeline/Defaults/ERPLowestScoreResolver.h`

**Algorithm:**
```
If (ScoredCandidates.Num() == 0):
    Return false

Best = ScoredCandidates[0]
For each Candidate in ScoredCandidates:
    If (Candidate.Score < Best.Score):
        Best = Candidate

OutBest = Best
Return true
```

**Use Cases:**
- Distance-based targeting (closest wins)
- Penalty-based scoring (lowest penalty wins)
- Most default pipelines

#### UERPHighestScoreResolver

Selects the candidate with the highest score.

**Header:** `Pipeline/Defaults/ERPHighestScoreResolver.h`

**Algorithm:**
```
If (ScoredCandidates.Num() == 0):
    Return false

Best = ScoredCandidates[0]
For each Candidate in ScoredCandidates:
    If (Candidate.Score > Best.Score):
        Best = Candidate

OutBest = Best
Return true
```

**Use Cases:**
- Priority-based targeting (highest priority wins)
- Threat level scoring (most threatening wins)
- Affinity systems (best match wins)

---

## Events

### Target Channel Events

#### OnTargetAcquired

Fired when a new target is acquired (best target changed to a new actor).

```cpp
DECLARE_DYNAMIC_MULTICAST_DELEGATE_TwoParams(
    FERPOnTargetAcquiredSignature, 
    AActor*, Target,           // The newly acquired target
    bool, bHasCurrentFocus     // True if this channel has focus
);
```

**When it fires:**
- Best target changes from none to an actor
- Best target changes from one actor to a different actor

**Parameters:**
- `Target` - The actor that was acquired
- `bHasCurrentFocus` - Whether this channel currently has focus (WinnerCode == 1)

**Example Usage:**
```cpp
PerceptionComponent->OnTargetAcquired.AddDynamic(this, &AMyController::HandleTargetAcquired);

void AMyController::HandleTargetAcquired(AActor* Target, bool bHasCurrentFocus)
{
    if (bHasCurrentFocus)
    {
        // Show target indicator on HUD
        HUD->ShowTargetIndicator(Target);
    }
}
```

#### OnTargetLost

Fired when the current target is lost (best target changed away from an actor).

```cpp
DECLARE_DYNAMIC_MULTICAST_DELEGATE_TwoParams(
    FERPOnTargetLostSignature,
    AActor*, Target,           // The target that was lost
    bool, bHadCurrentFocus     // True if this channel had focus when lost
);
```

**When it fires:**
- Best target changes from an actor to none
- Best target changes from one actor to a different actor (old actor lost)

**Parameters:**
- `Target` - The actor that was lost
- `bHadCurrentFocus` - Whether this channel had focus when the target was lost

**Example Usage:**
```cpp
void AMyController::HandleTargetLost(AActor* Target, bool bHadCurrentFocus)
{
    if (bHadCurrentFocus)
    {
        // Hide target indicator
        HUD->HideTargetIndicator();
    }
}
```

#### OnTargetFocusStatusChanged

Fired when focus status changes without the target changing.

```cpp
DECLARE_DYNAMIC_MULTICAST_DELEGATE_TwoParams(
    FERPOnTargetFocusStatusChangedSignature,
    AActor*, Target,           // The current target
    bool, bHasCurrentFocus     // New focus status
);
```

**When it fires:**
- Winner code changes between 1 ↔ 2
- Target actor remains the same

**Use Case:**
- Update UI to show target became primary/secondary
- Change indicator style based on focus

**Example:**
```cpp
void AMyController::HandleTargetFocusChanged(AActor* Target, bool bHasCurrentFocus)
{
    // Change indicator color based on focus
    if (bHasCurrentFocus)
        HUD->SetTargetIndicatorColor(FLinearColor::Red);
    else
        HUD->SetTargetIndicatorColor(FLinearColor::Gray);
}
```

---

### Interaction Channel Events

#### OnInteractableFound

Fired when a new interactable is found (best interactable changed to a new actor).

```cpp
DECLARE_DYNAMIC_MULTICAST_DELEGATE_TwoParams(
    FERPOnInteractableFoundSignature,
    AActor*, Interactable,     // The newly found interactable
    bool, bHasCurrentFocus     // True if this channel has focus
);
```

**When it fires:**
- Best interactable changes from none to an actor
- Best interactable changes from one actor to a different actor

**Parameters:**
- `Interactable` - The actor that was found
- `bHasCurrentFocus` - Whether this channel currently has focus (WinnerCode == 2)

**Example Usage:**
```cpp
void AMyController::HandleInteractableFound(AActor* Interactable, bool bHasCurrentFocus)
{
    if (bHasCurrentFocus)
    {
        // Show "Press E to interact" UI
        HUD->ShowInteractionPrompt(Interactable);
    }
}
```

#### OnInteractableLost

Fired when the current interactable is lost.

```cpp
DECLARE_DYNAMIC_MULTICAST_DELEGATE_TwoParams(
    FERPOnInteractableLostSignature,
    AActor*, Interactable,     // The interactable that was lost
    bool, bHadCurrentFocus     // True if this channel had focus when lost
);
```

**Example Usage:**
```cpp
void AMyController::HandleInteractableLost(AActor* Interactable, bool bHadCurrentFocus)
{
    if (bHadCurrentFocus)
    {
        // Hide interaction prompt
        HUD->HideInteractionPrompt();
    }
}
```

#### OnInteractableFocusStatusChanged

Fired when interaction focus status changes without the interactable changing.

```cpp
DECLARE_DYNAMIC_MULTICAST_DELEGATE_TwoParams(
    FERPOnInteractableFocusStatusChangedSignature,
    AActor*, Interactable,     // The current interactable
    bool, bHasCurrentFocus     // New focus status
);
```

**Use Case:**
- Dim interaction prompt when target gets focus
- Show both indicators simultaneously

---

## Data Structures

### FERPChannelPipeline

Defines a complete perception pipeline for one channel.

**Header:** `Pipeline/ERPChannelPipeline.h`

```cpp
USTRUCT(BlueprintType)
struct FERPChannelPipeline
{
    GENERATED_BODY()

    UPROPERTY(EditAnywhere, BlueprintReadWrite)
    FName ChannelId = NAME_None;

    UPROPERTY(EditAnywhere, BlueprintReadWrite, Instanced)
    TObjectPtr<UERPSamplerBase> Sampler = nullptr;

    UPROPERTY(EditAnywhere, BlueprintReadWrite, Instanced)
    TArray<TObjectPtr<UERPFilterBase>> Filters;

    UPROPERTY(EditAnywhere, BlueprintReadWrite, Instanced)
    TArray<TObjectPtr<UERPScorerBase>> Scorers;

    UPROPERTY(EditAnywhere, BlueprintReadWrite, Instanced)
    TObjectPtr<UERPAggregatorBase> Aggregator = nullptr;

    UPROPERTY(EditAnywhere, BlueprintReadWrite, Instanced)
    TObjectPtr<UERPResolverBase> Resolver = nullptr;
};
```

### FERPPerceptionContext

Immutable perception context passed to all pipeline stages.

**Header:** `Core/ERPPerceptionContext.h`

```cpp
USTRUCT(BlueprintType)
struct FERPPerceptionContext
{
    GENERATED_BODY()

    UPROPERTY(BlueprintReadOnly)
    TObjectPtr<AActor> ContextActor = nullptr;

    UPROPERTY(BlueprintReadOnly)
    FVector Origin = FVector::ZeroVector;

    UPROPERTY(BlueprintReadOnly)
    FVector Forward = FVector::ForwardVector;

    UPROPERTY(BlueprintReadOnly)
    bool bHasAimRay = false;

    UPROPERTY(BlueprintReadOnly)
    FVector AimOrigin = FVector::ZeroVector;

    UPROPERTY(BlueprintReadOnly)
    FVector AimDirection = FVector::ForwardVector;

    UPROPERTY(BlueprintReadOnly)
    bool bHasViewportProjection = false;

    UPROPERTY(BlueprintReadOnly)
    FVector2D ViewportCenterPx = FVector2D::ZeroVector;

    UPROPERTY(BlueprintReadOnly)
    float ViewportEllipseHalfWidthPx = 0.f;

    UPROPERTY(BlueprintReadOnly)
    float ViewportEllipseHalfHeightPx = 0.f;
};
```

### FERPTargetCandidate

Result structure for a single candidate.

**Header:** `Core/ERPPerceptionComponent.h`

```cpp
USTRUCT(BlueprintType)
struct FERPTargetCandidate
{
    GENERATED_BODY()

    UPROPERTY(BlueprintReadOnly)
    TObjectPtr<AActor> Actor = nullptr;

    UPROPERTY(BlueprintReadOnly)
    float Score = 0.f;  // Lower = better
};
```

### FERPFocusEvaluationResult

Complete evaluation result for both channels.

```cpp
USTRUCT(BlueprintType)
struct FERPFocusEvaluationResult
{
    GENERATED_BODY()

    UPROPERTY(BlueprintReadOnly)
    FERPTargetCandidate BestTargetCandidate;

    UPROPERTY(BlueprintReadOnly)
    FERPTargetCandidate BestInteractionCandidate;

    UPROPERTY(BlueprintReadOnly)
    int32 WinnerCode = 0;  // 0=none, 1=target, 2=interaction
};
```

### FERPPipelineCandidate

Basic candidate in pipeline (before scoring).

**Header:** `Pipeline/ERPPerceptionPipelineTypes.h`

```cpp
USTRUCT(BlueprintType)
struct FERPPipelineCandidate
{
    GENERATED_BODY()

    UPROPERTY(BlueprintReadOnly)
    TObjectPtr<AActor> Actor = nullptr;
};
```

### FERPPipelineScoredCandidate

Scored candidate after aggregation.

```cpp
USTRUCT(BlueprintType)
struct FERPPipelineScoredCandidate
{
    GENERATED_BODY()

    UPROPERTY(BlueprintReadOnly)
    TObjectPtr<AActor> Actor = nullptr;

    UPROPERTY(BlueprintReadOnly)
    float Score = 0.f;
};
```

---

## Usage Patterns

### Minimal Target Pipeline

```cpp
Pipeline.ChannelId = "Target";
Pipeline.Sampler = NewObject<UERPSphereOverlapSampler>();
Pipeline.Filters = { NewObject<UERPTargetableFilter>() };
Pipeline.Scorers = { NewObject<UERPDistanceScorer>() };
Pipeline.Aggregator = NewObject<UERPIdentityAggregator>();
Pipeline.Resolver = NewObject<UERPLowestScoreResolver>();
```

### Multi-Scorer Pipeline

```cpp
Pipeline.Scorers = {
    NewObject<UERPDistanceScorer>(),  // Factor 1: Distance
    NewObject<UERPConeScorer>()       // Factor 2: Angle
};
Pipeline.Aggregator = NewObject<UERPAdditiveAggregator>();  // Combine
```

### Custom Filter Pipeline

```cpp
Pipeline.Filters = {
    NewObject<UERPTargetableFilter>(),    // Must be targetable
    NewObject<UMyLineOfSightFilter>(),    // Must be visible
    NewObject<UMyTeamFilter>()            // Must be enemy
};
```

---

For practical examples, see [Examples.md](Examples.md).  
For architecture details, see [Pipeline-Architecture.md](Pipeline-Architecture.md).
