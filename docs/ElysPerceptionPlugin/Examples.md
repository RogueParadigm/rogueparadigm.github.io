# Examples

Practical examples demonstrating common use cases and custom implementations for ElysPerceptionPlugin.

## Table of Contents
- [Example 1: Basic Target Lock System](#example-1-basic-target-lock-system)
- [Example 2: Interaction System with UI Prompts](#example-2-interaction-system-with-ui-prompts)
- [Example 3: Multi-Channel Setup](#example-3-multi-channel-setup)
- [Example 4: Custom Scorer - Health Priority](#example-4-custom-scorer---health-priority)
- [Example 5: Custom Filter - Line of Sight](#example-5-custom-filter---line-of-sight)
- [Example 6: Advanced Scoring - Weighted Combination](#example-6-advanced-scoring---weighted-combination)

---

## Example 1: Basic Target Lock System

A simple target lock system for third-person combat.

### Requirements
- Detect enemies within range
- Lock onto closest enemy
- Show UI indicator for locked target
- Toggle lock on/off

### Blueprint Implementation

#### 1. Setup Perception Component

**PlayerController BP:**
- Add `ERPPerceptionComponent` component

**Component Configuration:**
- **Focus Range**: 3000
- **Target Pipeline:**
  - Channel Id: `Target`
  - Sampler: `ERPSphereOverlapSampler`
    - Trace Channel: `ECC_Pawn`
    - Actor Class: `ACharacter`
  - Filters: `ERPTargetableFilter`
  - Scorers: `ERPDistanceScorer`
    - Normalize By Range: ✓
  - Aggregator: `ERPIdentityAggregator`
  - Resolver: `ERPLowestScoreResolver`

#### 2. Enemy Setup

**Enemy BP (Character):**
- Implement Interface: `ERPTargetable`
- Override `Can Be Targeted By`:
  ```
  Branch: Is Alive
    True → Return True
    False → Return False
  ```

#### 3. Input Handling

**Input Actions:**
- `IA_ToggleLock` (Action)
- `IA_Target` (Action, Hold)

**Event Graph:**

```blueprint
// BeginPlay: Bind events
Event BeginPlay
  → Get Component: PerceptionComponent
  → Bind Event to OnTargetAcquired
    → Custom Event: HandleTargetAcquired
  → Bind Event to OnTargetLost
    → Custom Event: HandleTargetLost

// Handle target acquired
Custom Event: HandleTargetAcquired (Target, HasFocus)
  → Branch: HasFocus?
    True:
      → Get HUD
      → Show Target Indicator (Target)
      → Print: "Target Acquired"

// Handle target lost
Custom Event: HandleTargetLost (Target, HadFocus)
  → Branch: HadFocus?
    True:
      → Get HUD
      → Hide Target Indicator
      → Print: "Target Lost"

// Toggle lock
Input Action: IA_ToggleLock
  → PerceptionComponent → Is Target Locked?
    True:
      → Unlock Target
      → Print: "Target Unlocked"
    False:
      → Get Primary Target
      → Is Valid?
        True:
          → Lock Target
          → Print: "Target Locked"
        False:
          → Print: "No Target"
```

#### 4. HUD Widget

**WBP_TargetIndicator:**
- Image: Crosshair/Reticle
- Text: Target Name
- Progress Bar: Target Health

**Widget Logic:**

```blueprint
Event Construct
  → Get Owning Player
  → Get Component: PerceptionComponent
  → Set Variable: PerceptionComp

Event Tick
  → PerceptionComp → Get Primary Target
  → Is Valid?
    True:
      → Update Position (Project To Screen)
      → Set Visibility: Visible
      → Get Target Health
      → Update Health Bar
    False:
      → Set Visibility: Hidden
```

### C++ Implementation

**YourPlayerController.h:**

```cpp
#pragma once

#include "CoreMinimal.h"
#include "GameFramework/PlayerController.h"
#include "Core/ERPPerceptionComponent.h"
#include "YourPlayerController.generated.h"

UCLASS()
class YOURPROJECT_API AYourPlayerController : public APlayerController
{
    GENERATED_BODY()

public:
    AYourPlayerController();

protected:
    virtual void BeginPlay() override;
    virtual void SetupInputComponent() override;

    UPROPERTY(VisibleAnywhere, BlueprintReadOnly, Category = "Perception")
    UERPPerceptionComponent* PerceptionComponent;

private:
    UFUNCTION()
    void OnTargetAcquired(AActor* Target, bool bHasCurrentFocus);

    UFUNCTION()
    void OnTargetLost(AActor* Target, bool bHadCurrentFocus);

    void ToggleTargetLock();

    UPROPERTY()
    AActor* CurrentTarget;
};
```

**YourPlayerController.cpp:**

```cpp
#include "YourPlayerController.h"
#include "Pipeline/Defaults/ERPSphereOverlapSampler.h"
#include "Pipeline/Defaults/ERPTargetableFilter.h"
#include "Pipeline/Defaults/ERPDistanceScorer.h"
#include "Pipeline/Defaults/ERPIdentityAggregator.h"
#include "Pipeline/Defaults/ERPLowestScoreResolver.h"

AYourPlayerController::AYourPlayerController()
{
    PerceptionComponent = CreateDefaultSubobject<UERPPerceptionComponent>(TEXT("PerceptionComponent"));
}

void AYourPlayerController::BeginPlay()
{
    Super::BeginPlay();

    // Configure pipeline
    FERPChannelPipeline& TP = PerceptionComponent->TargetPipeline;
    TP.ChannelId = FName("Target");
    
    auto* Sampler = NewObject<UERPSphereOverlapSampler>(this);
    Sampler->TraceChannel = ECC_Pawn;
    Sampler->ActorClass = ACharacter::StaticClass();
    TP.Sampler = Sampler;

    TP.Filters.Add(NewObject<UERPTargetableFilter>(this));
    
    auto* Scorer = NewObject<UERPDistanceScorer>(this);
    Scorer->bNormalizeByRange = true;
    TP.Scorers.Add(Scorer);

    TP.Aggregator = NewObject<UERPIdentityAggregator>(this);
    TP.Resolver = NewObject<UERPLowestScoreResolver>(this);

    // Bind events
    PerceptionComponent->OnTargetAcquired.AddDynamic(this, &AYourPlayerController::OnTargetAcquired);
    PerceptionComponent->OnTargetLost.AddDynamic(this, &AYourPlayerController::OnTargetLost);
}

void AYourPlayerController::SetupInputComponent()
{
    Super::SetupInputComponent();
    InputComponent->BindAction("ToggleLock", IE_Pressed, this, &AYourPlayerController::ToggleTargetLock);
}

void AYourPlayerController::OnTargetAcquired(AActor* Target, bool bHasCurrentFocus)
{
    if (bHasCurrentFocus)
    {
        CurrentTarget = Target;
        UE_LOG(LogTemp, Log, TEXT("Target Acquired: %s"), *Target->GetName());
        // Update HUD here
    }
}

void AYourPlayerController::OnTargetLost(AActor* Target, bool bHadCurrentFocus)
{
    if (bHadCurrentFocus)
    {
        CurrentTarget = nullptr;
        UE_LOG(LogTemp, Log, TEXT("Target Lost: %s"), *Target->GetName());
        // Update HUD here
    }
}

void AYourPlayerController::ToggleTargetLock()
{
    if (PerceptionComponent->IsTargetLocked())
    {
        PerceptionComponent->UnlockTarget();
    }
    else if (AActor* Target = PerceptionComponent->GetPrimaryTarget())
    {
        PerceptionComponent->LockTarget(Target);
    }
}
```

---

## Example 2: Interaction System with UI Prompts

Interaction system that shows context-sensitive UI prompts.

### Requirements
- Detect interactable objects (doors, items, NPCs)
- Show "Press E to interact" prompt
- Prioritize closest interactable
- Hide prompt when out of range

### Blueprint Implementation

#### 1. Setup Interaction Pipeline

**PlayerController BP:**

**Component Configuration:**
- **Focus Range**: 300
- **Interaction Pipeline:**
  - Channel Id: `Interaction`
  - Sampler: `ERPSphereOverlapSampler`
    - Trace Channel: `ECC_Visibility`
    - Actor Class: `AActor`
  - Filters: `ERPInteractableFilter`
  - Scorers: `ERPDistanceScorer`
  - Aggregator: `ERPIdentityAggregator`
  - Resolver: `ERPLowestScoreResolver`

#### 2. Interactable Objects

**BP_Door (Actor):**
- Implement Interface: `ERPInteractable`
- Variable: `bIsLocked` (Boolean)
- Override `Can Interact`:
  ```
  Branch: Is Locked
    True → Return False
    False → Return True
  ```

**BP_Pickup (Actor):**
- Implement Interface: `ERPInteractable`
- Override `Can Interact`:
  ```
  Return True
  ```

#### 3. Event Handling

**Event Graph:**

```blueprint
// BeginPlay: Setup
Event BeginPlay
  → Get Component: PerceptionComponent
  → Bind Event to OnInteractableFound
    → Custom Event: ShowInteractionPrompt
  → Bind Event to OnInteractableLost
    → Custom Event: HideInteractionPrompt

// Show prompt
Custom Event: ShowInteractionPrompt (Interactable, HasFocus)
  → Branch: HasFocus?
    True:
      → Get HUD Widget
      → Show Interaction Prompt (Interactable)
      → Set Current Interactable

// Hide prompt
Custom Event: HideInteractionPrompt (Interactable, HadFocus)
  → Branch: HadFocus?
    True:
      → Get HUD Widget
      → Hide Interaction Prompt
      → Clear Current Interactable

// Execute interaction
Input Action: IA_Interact
  → Get Component: PerceptionComponent
  → Get Current Interactable
  → Is Valid?
    True:
      → Cast To Interactable Interface
      → Call Custom Interact Function
```

#### 4. Interaction Prompt Widget

**WBP_InteractionPrompt:**
- Background Panel
- Text: "Press [E] to {Action}"
- Icon (optional)

**Widget Update:**

```blueprint
// Update prompt text based on interactable type
Function: Update Prompt (Interactable Actor)
  → Switch on Class:
    → Door: Set Text "Press [E] to Open"
    → Item: Set Text "Press [E] to Pick Up"
    → NPC: Set Text "Press [E] to Talk"
    → Default: Set Text "Press [E] to Interact"
```

### C++ Implementation

**Interactable Object Header:**

```cpp
#pragma once

#include "CoreMinimal.h"
#include "GameFramework/Actor.h"
#include "Core/ERPInteractable.h"
#include "InteractableObject.generated.h"

UCLASS()
class YOURPROJECT_API AInteractableObject : public AActor, public IERPInteractable
{
    GENERATED_BODY()

public:
    AInteractableObject();

    // IERPInteractable Interface
    virtual bool CanInteract_Implementation(AActor* InteractingActor) const override;

    // Called when player interacts
    UFUNCTION(BlueprintNativeEvent, Category = "Interaction")
    void OnInteract(AActor* Instigator);

protected:
    UPROPERTY(EditAnywhere, BlueprintReadWrite, Category = "Interaction")
    FText InteractionText = FText::FromString("Interact");

    UPROPERTY(EditAnywhere, BlueprintReadWrite, Category = "Interaction")
    bool bCanBeInteracted = true;
};
```

**Interactable Object Implementation:**

```cpp
#include "InteractableObject.h"

AInteractableObject::AInteractableObject()
{
    PrimaryActorTick.bCanEverTick = false;
}

bool AInteractableObject::CanInteract_Implementation(AActor* InteractingActor) const
{
    return bCanBeInteracted;
}

void AInteractableObject::OnInteract_Implementation(AActor* Instigator)
{
    // Override in child classes (Door, Item, etc.)
    UE_LOG(LogTemp, Log, TEXT("Interacted with %s"), *GetName());
}
```

---

## Example 3: Multi-Channel Setup

Using multiple channels simultaneously: Target, Interaction, and HealTarget.

### Requirements
- Target enemies for combat
- Interact with objects
- Target allies for healing
- Each channel prioritizes differently

### Blueprint Implementation

#### Setup Three Pipelines

**PlayerController BP:**

**1. Target Pipeline (Enemies):**
```
Channel Id: Target
Sampler: ERPSphereOverlapSampler (Range: 3000)
Filters: 
  - ERPTargetableFilter
  - Custom: EnemyTeamFilter
Scorers:
  - ERPDistanceScorer
  - ERPConeScorer (10 degrees)
Aggregator: ERPAdditiveAggregator
Resolver: ERPLowestScoreResolver
```

**2. Interaction Pipeline (Objects):**
```
Channel Id: Interaction
Sampler: ERPSphereOverlapSampler (Range: 300)
Filters:
  - ERPInteractableFilter
Scorers:
  - ERPDistanceScorer
Aggregator: ERPIdentityAggregator
Resolver: ERPLowestScoreResolver
```

**3. HealTarget Pipeline (Allies):**
```
Channel Id: HealTarget
Sampler: ERPSphereOverlapSampler (Range: 2000)
Filters:
  - Custom: AllyTeamFilter
  - Custom: InjuredFilter (health < 100%)
Scorers:
  - Custom: HealthPercentScorer (lower health = better)
  - ERPDistanceScorer
Aggregator: ERPAdditiveAggregator (50% health, 50% distance)
Resolver: ERPLowestScoreResolver
```

#### Custom Team Filter

**BP_TeamFilter (derived from ERPFilterBase):**

```blueprint
Event: Passes (Context, Candidate)
  → Cast To Character (Candidate)
  → Get Team ID
  → Branch: Team ID matches expected?
    True → Return True
    False → Return False
```

#### Event Handling

```blueprint
// Switch behavior based on mode
Variable: CurrentMode (Enum: Combat, Heal, Interact)

Event BeginPlay
  → Bind to all three channel events

// Mode switching
Input: SwitchToHealMode
  → Set CurrentMode = Heal
  → Print: "Healing Mode"

Input: SwitchToCombatMode
  → Set CurrentMode = Combat
  → Print: "Combat Mode"

// Handle events based on mode
Event: OnTargetAcquired (Target, HasFocus)
  → Branch: CurrentMode == Combat AND HasFocus?
    True:
      → Show Combat Reticle (Red)

Event: OnInteractableFound (Interactable, HasFocus)
  → Branch: HasFocus?
    True:
      → Show Interaction Prompt

// Custom Event: OnHealTargetAcquired
// (Implement similar pattern for heal target channel)
```

### C++ Implementation

**Adding Custom Channel:**

```cpp
// In your custom perception component
UPROPERTY(EditAnywhere, BlueprintReadWrite, Category = "Perception|Pipelines")
FERPChannelPipeline HealTargetPipeline;

// Configure in BeginPlay
void ConfigureHealPipeline()
{
    FERPChannelPipeline& HP = HealTargetPipeline;
    HP.ChannelId = FName("HealTarget");
    
    auto* Sampler = NewObject<UERPSphereOverlapSampler>(this);
    Sampler->TraceChannel = ECC_Pawn;
    HP.Sampler = Sampler;

    // Custom filters
    HP.Filters.Add(NewObject<UAllyTeamFilter>(this));
    HP.Filters.Add(NewObject<UInjuredFilter>(this));

    // Custom scorer for health
    HP.Scorers.Add(NewObject<UHealthPercentScorer>(this));
    HP.Scorers.Add(NewObject<UERPDistanceScorer>(this));

    HP.Aggregator = NewObject<UERPAdditiveAggregator>(this);
    HP.Resolver = NewObject<UERPLowestScoreResolver>(this);
}
```

---

## Example 4: Custom Scorer - Health Priority

A custom scorer that prioritizes low-health targets for healing or finishing blows.

### C++ Implementation

**HealthPriorityScorer.h:**

```cpp
#pragma once

#include "CoreMinimal.h"
#include "Pipeline/ERPScorerBase.h"
#include "HealthPriorityScorer.generated.h"

UCLASS(BlueprintType, Blueprintable, EditInlineNew, DefaultToInstanced, meta = (DisplayName = "Health Priority Scorer"))
class YOURPROJECT_API UHealthPriorityScorer : public UERPScorerBase
{
    GENERATED_BODY()

public:
    /** If true, lower health gets lower score (better). If false, higher health gets lower score. */
    UPROPERTY(EditAnywhere, BlueprintReadWrite, Category = "Scorer")
    bool bPrioritizeLowHealth = true;

    /** If true, only consider actors below this health threshold */
    UPROPERTY(EditAnywhere, BlueprintReadWrite, Category = "Scorer")
    bool bUseHealthThreshold = false;

    /** Health threshold percentage (0.0 - 1.0) */
    UPROPERTY(EditAnywhere, BlueprintReadWrite, Category = "Scorer", meta = (EditCondition = "bUseHealthThreshold", ClampMin = "0.0", ClampMax = "1.0"))
    float HealthThreshold = 0.5f;

    virtual float Score_Implementation(const FERPPerceptionContext& Context, AActor* Candidate) const override;
};
```

**HealthPriorityScorer.cpp:**

```cpp
#include "HealthPriorityScorer.h"
#include "Components/HealthComponent.h" // Your health component

float UHealthPriorityScorer::Score_Implementation(const FERPPerceptionContext& Context, AActor* Candidate) const
{
    if (!Candidate)
        return 1.0f; // Neutral/worst score

    // Get health component (adjust based on your architecture)
    UHealthComponent* HealthComp = Candidate->FindComponentByClass<UHealthComponent>();
    if (!HealthComp)
        return 1.0f; // No health component, neutral score

    float HealthPercent = HealthComp->GetHealthPercent(); // 0.0 = dead, 1.0 = full health

    // Check threshold if enabled
    if (bUseHealthThreshold && HealthPercent > HealthThreshold)
        return -1.0f; // Reject (above threshold)

    // Score based on priority
    if (bPrioritizeLowHealth)
    {
        // Lower health = lower score = better
        return HealthPercent;
    }
    else
    {
        // Higher health = lower score = better
        return 1.0f - HealthPercent;
    }
}
```

### Usage Example

**For Healing System:**

```cpp
// Prioritize allies with low health
FERPChannelPipeline HealPipeline;
HealPipeline.ChannelId = "HealTarget";
HealPipeline.Sampler = NewObject<UERPSphereOverlapSampler>(this);
HealPipeline.Filters.Add(NewObject<UAllyFilter>(this));

auto* HealthScorer = NewObject<UHealthPriorityScorer>(this);
HealthScorer->bPrioritizeLowHealth = true;  // Lower health = higher priority
HealthScorer->bUseHealthThreshold = true;   // Only consider injured allies
HealthScorer->HealthThreshold = 1.0f;       // Below 100% health
HealPipeline.Scorers.Add(HealthScorer);

HealPipeline.Aggregator = NewObject<UERPIdentityAggregator>(this);
HealPipeline.Resolver = NewObject<UERPLowestScoreResolver>(this);
```

**For Execute/Finish System:**

```cpp
// Target low-health enemies for finishing
auto* FinishScorer = NewObject<UHealthPriorityScorer>(this);
FinishScorer->bPrioritizeLowHealth = true;  // Low health = high priority
FinishScorer->bUseHealthThreshold = true;   // Only consider below threshold
FinishScorer->HealthThreshold = 0.3f;       // Below 30% health
TargetPipeline.Scorers.Add(FinishScorer);
```

### Blueprint Implementation

**BP_HealthScorer (derived from ERPScorerBase):**

```blueprint
Event: Score (Context, Candidate)
  → Cast To Character (Candidate)
  → Get Component: HealthComponent
  → Is Valid?
    True:
      → Get Health Percent
      → Branch: Prioritize Low Health?
        True:
          → Return Health Percent (0.0 = critical, 1.0 = full)
        False:
          → Return (1.0 - Health Percent)
    False:
      → Return 1.0 (neutral score)
```

---

## Example 5: Custom Filter - Line of Sight

A filter that rejects candidates not in line of sight.

### C++ Implementation

**LineOfSightFilter.h:**

```cpp
#pragma once

#include "CoreMinimal.h"
#include "Pipeline/ERPFilterBase.h"
#include "LineOfSightFilter.generated.h"

UCLASS(BlueprintType, Blueprintable, EditInlineNew, DefaultToInstanced, meta = (DisplayName = "Line of Sight Filter"))
class YOURPROJECT_API ULineOfSightFilter : public UERPFilterBase
{
    GENERATED_BODY()

public:
    /** Collision channel for line traces */
    UPROPERTY(EditAnywhere, BlueprintReadWrite, Category = "Filter")
    TEnumAsByte<ECollisionChannel> TraceChannel = ECC_Visibility;

    /** If true, uses complex collision for traces */
    UPROPERTY(EditAnywhere, BlueprintReadWrite, Category = "Filter")
    bool bTraceComplex = false;

    /** Offset from candidate location for trace end (useful for hitting center mass) */
    UPROPERTY(EditAnywhere, BlueprintReadWrite, Category = "Filter")
    FVector TargetLocationOffset = FVector(0.f, 0.f, 50.f);

    virtual bool Passes_Implementation(const FERPPerceptionContext& Context, AActor* Candidate) const override;
};
```

**LineOfSightFilter.cpp:**

```cpp
#include "LineOfSightFilter.h"
#include "Engine/World.h"
#include "CollisionQueryParams.h"

bool ULineOfSightFilter::Passes_Implementation(const FERPPerceptionContext& Context, AActor* Candidate) const
{
    if (!Candidate || !Context.ContextActor)
        return false;

    UWorld* World = Context.ContextActor->GetWorld();
    if (!World)
        return false;

    FVector Start = Context.Origin;
    FVector End = Candidate->GetActorLocation() + TargetLocationOffset;

    FHitResult HitResult;
    FCollisionQueryParams Params;
    Params.AddIgnoredActor(Context.ContextActor);
    Params.bTraceComplex = bTraceComplex;

    bool bHit = World->LineTraceSingleByChannel(
        HitResult,
        Start,
        End,
        TraceChannel,
        Params
    );

    // Pass if we hit the candidate directly, or if we didn't hit anything
    if (!bHit)
        return true; // Clear line of sight

    // Check if we hit the candidate itself (or one of its components)
    return HitResult.GetActor() == Candidate;
}
```

### Advanced: Multi-Point Line of Sight

Check multiple points on the target for partial visibility.

**MultiPointLOSFilter.cpp:**

```cpp
bool UMultiPointLOSFilter::Passes_Implementation(const FERPPerceptionContext& Context, AActor* Candidate) const
{
    if (!Candidate || !Context.ContextActor)
        return false;

    UWorld* World = Context.ContextActor->GetWorld();
    if (!World)
        return false;

    FVector Start = Context.Origin;
    FVector CandidateLocation = Candidate->GetActorLocation();

    // Test multiple points (center, head, feet)
    TArray<FVector> TestPoints = {
        CandidateLocation + FVector(0, 0, 0),    // Center
        CandidateLocation + FVector(0, 0, 80),   // Head
        CandidateLocation + FVector(0, 0, -40)   // Feet
    };

    int32 VisiblePoints = 0;

    for (const FVector& TestPoint : TestPoints)
    {
        FHitResult HitResult;
        FCollisionQueryParams Params;
        Params.AddIgnoredActor(Context.ContextActor);

        bool bHit = World->LineTraceSingleByChannel(
            HitResult, Start, TestPoint, TraceChannel, Params
        );

        if (!bHit || HitResult.GetActor() == Candidate)
        {
            VisiblePoints++;
        }
    }

    // Pass if at least MinVisiblePoints are visible
    return VisiblePoints >= MinVisiblePoints;
}
```

### Blueprint Implementation

**BP_LineOfSightFilter (derived from ERPFilterBase):**

```blueprint
Event: Passes (Context, Candidate)
  → Line Trace By Channel
    → Start: Context.Origin
    → End: Candidate.GetActorLocation + (0, 0, 50)
    → Channel: Visibility
    → Ignore: Context.ContextActor
  → Branch: Hit?
    True:
      → Get Hit Actor
      → Equals: Candidate?
        True → Return True (hit candidate itself)
        False → Return False (blocked)
    False:
      → Return True (clear line of sight)
```

---

## Example 6: Advanced Scoring - Weighted Combination

Combining multiple scoring factors with custom weights.

### Use Case

Target selection that considers:
- Distance (40% weight)
- Angle from center (30% weight)
- Health/Threat level (30% weight)

### C++ Implementation

**WeightedAggregator.h:**

```cpp
#pragma once

#include "CoreMinimal.h"
#include "Pipeline/ERPAggregatorBase.h"
#include "WeightedAggregator.generated.h"

UCLASS(BlueprintType, Blueprintable, EditInlineNew, DefaultToInstanced, meta = (DisplayName = "Weighted Aggregator"))
class YOURPROJECT_API UWeightedAggregator : public UERPAggregatorBase
{
    GENERATED_BODY()

public:
    /** Weights for each scorer (must match number of scorers) */
    UPROPERTY(EditAnywhere, BlueprintReadWrite, Category = "Aggregator")
    TArray<float> Weights = {1.0f};

    /** If true, normalizes weights to sum to 1.0 */
    UPROPERTY(EditAnywhere, BlueprintReadWrite, Category = "Aggregator")
    bool bNormalizeWeights = true;

    virtual float Aggregate_Implementation(const TArray<float>& Scores) const override;
};
```

**WeightedAggregator.cpp:**

```cpp
#include "WeightedAggregator.h"

float UWeightedAggregator::Aggregate_Implementation(const TArray<float>& Scores) const
{
    if (Scores.Num() == 0)
        return 0.0f;

    // Calculate total weight
    float TotalWeight = 0.0f;
    for (int32 i = 0; i < Scores.Num(); ++i)
    {
        float Weight = (i < Weights.Num()) ? Weights[i] : 1.0f;
        TotalWeight += Weight;
    }

    if (TotalWeight == 0.0f)
        return 0.0f;

    // Calculate weighted sum
    float WeightedSum = 0.0f;
    for (int32 i = 0; i < Scores.Num(); ++i)
    {
        float Weight = (i < Weights.Num()) ? Weights[i] : 1.0f;
        
        if (bNormalizeWeights)
        {
            Weight /= TotalWeight; // Normalize to sum to 1.0
        }

        WeightedSum += Scores[i] * Weight;
    }

    return WeightedSum;
}
```

### Usage Example

**Setup Multi-Factor Pipeline:**

```cpp
void SetupAdvancedTargetPipeline()
{
    FERPChannelPipeline& TP = TargetPipeline;
    TP.ChannelId = FName("Target");

    // Sampler and filters
    TP.Sampler = NewObject<UERPSphereOverlapSampler>(this);
    TP.Filters.Add(NewObject<UERPTargetableFilter>(this));
    TP.Filters.Add(NewObject<ULineOfSightFilter>(this));

    // Multiple scorers
    auto* DistanceScorer = NewObject<UERPDistanceScorer>(this);
    DistanceScorer->bNormalizeByRange = true;
    TP.Scorers.Add(DistanceScorer);

    auto* AngleScorer = NewObject<UERPConeScorer>(this);
    AngleScorer->ConeHalfAngleDegrees = 45.0f;
    TP.Scorers.Add(AngleScorer);

    auto* ThreatScorer = NewObject<UThreatLevelScorer>(this); // Custom
    TP.Scorers.Add(ThreatScorer);

    // Weighted aggregation: 40% distance, 30% angle, 30% threat
    auto* Aggregator = NewObject<UWeightedAggregator>(this);
    Aggregator->Weights = {0.4f, 0.3f, 0.3f};
    Aggregator->bNormalizeWeights = false; // Already normalized
    TP.Aggregator = Aggregator;

    TP.Resolver = NewObject<UERPLowestScoreResolver>(this);
}
```

### Alternative: Non-Linear Aggregation

**ExponentialAggregator.cpp:**

```cpp
// Scores are combined exponentially, emphasizing extremes
float UExponentialAggregator::Aggregate_Implementation(const TArray<float>& Scores) const
{
    if (Scores.Num() == 0)
        return 0.0f;

    float Product = 1.0f;
    for (float Score : Scores)
    {
        // Exponential scaling
        Product *= FMath::Pow(Score, Exponent);
    }

    return Product;
}
```

### Blueprint Implementation

**BP_WeightedAggregator:**

```blueprint
Event: Aggregate (Scores Array)
  → Variable: TotalWeight = 0
  → Variable: WeightedSum = 0
  → ForEachLoop: Index, Score in Scores
    → Get Weight (Index) from Weights Array
    → Add to TotalWeight
    → Multiply: Score * Weight
    → Add to WeightedSum
  → Divide: WeightedSum / TotalWeight
  → Return Result
```

### Complete Example Configuration

**Comprehensive Target Selection:**

```cpp
// Pipeline with all factors
TargetPipeline.Scorers = {
    DistanceScorer,     // Weight: 0.4 (most important)
    ConeScorer,         // Weight: 0.3 (important)
    HealthScorer,       // Weight: 0.2 (consideration)
    ThreatScorer        // Weight: 0.1 (minor factor)
};

WeightedAggregator->Weights = {0.4f, 0.3f, 0.2f, 0.1f};
```

This allows fine-tuned control over target selection priorities, balancing multiple gameplay factors.

---

## Summary

These examples demonstrate:

✅ **Basic Patterns** - Target lock and interaction systems  
✅ **Multi-Channel** - Running multiple pipelines simultaneously  
✅ **Custom Scorers** - Gameplay-specific scoring logic  
✅ **Custom Filters** - Advanced candidate rejection  
✅ **Advanced Aggregation** - Weighted multi-factor scoring  

For more details on architecture, see [Pipeline-Architecture.md](Pipeline-Architecture.md).  
For API reference, see [API-Reference.md](API-Reference.md).
