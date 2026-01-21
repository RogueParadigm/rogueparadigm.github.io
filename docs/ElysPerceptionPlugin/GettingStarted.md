# Getting Started with ElysPerceptionPlugin

This guide will help you install, configure, and use the ElysPerceptionPlugin in your Unreal Engine project.

## Table of Contents
- [Installation](#installation)
- [Quick Start](#quick-start)
- [First Pipeline Setup](#first-pipeline-setup)
- [Blueprint Example](#blueprint-example)
- [C++ Example](#c-example)
- [Testing Your Setup](#testing-your-setup)
- [Common Pitfalls & Troubleshooting](#common-pitfalls--troubleshooting)

---

## Installation

### Prerequisites
- Unreal Engine 5.0 or later
- Basic understanding of Unreal Engine components and actors

### Steps

1. **Copy the Plugin**
   ```
   YourProject/
   └── Plugins/
       └── ElysPerceptionPlugin/
   ```
   Copy the `ElysPerceptionPlugin` folder into your project's `Plugins` directory.

2. **Enable the Plugin**
   - Open your project in Unreal Editor
   - Go to **Edit → Plugins**
   - Search for "Elys Perception Plugin"
   - Check the box to enable it
   - Restart the editor when prompted

3. **Verify Installation**
   - In the Content Browser, enable "Show Plugin Content"
   - You should see the ElysPerceptionPlugin folder

4. **Update Build Configuration (C++ Projects)**
   If you're using C++, add the module to your project's `.Build.cs` file:
   ```csharp
   PublicDependencyModuleNames.AddRange(new string[] { 
       "Core", 
       "CoreUObject", 
       "Engine", 
       "ElysPerceptionPlugin"  // Add this line
   });
   ```

---

## Quick Start

The fastest way to get perception working:

1. **Add the Component**
   - Select your PlayerController or Pawn
   - Add a `ERPPerceptionComponent` component

2. **Configure a Basic Target Pipeline**
   - In the component details, expand **Perception | Pipelines → Target Pipeline**
   - Set **Channel Id** to `Target`
   - Add a **Sampler**: `ERPSphereOverlapSampler`
   - Add a **Filter**: `ERPTargetableFilter`
   - Add a **Scorer**: `ERPDistanceScorer`
   - Add a **Resolver**: `ERPLowestScoreResolver`

3. **Implement Target Interface**
   On actors you want to target (e.g., enemies):
   - Add interface: `ERPTargetable` (Blueprint Interfaces section)
   - Implement `CanBeTargetedBy` → return `true`

4. **Listen for Events**
   - Bind to `OnTargetAcquired` event on the perception component
   - You'll receive the target actor when detected

That's it! The perception component will now detect targetable actors in range.

---

## First Pipeline Setup

Let's create a complete targeting pipeline step-by-step.

### Understanding the Pipeline

A pipeline consists of five stages:
1. **Sampler** - Collects candidate actors
2. **Filter** - Eliminates invalid candidates
3. **Scorer** - Assigns scores to candidates
4. **Aggregator** - Combines multiple scores (optional)
5. **Resolver** - Selects the winner

### Step-by-Step Configuration

#### 1. Add the Perception Component

In your PlayerController or Pawn Blueprint:
- Click **Add Component**
- Search for `ERPPerceptionComponent`
- Name it "PerceptionComponent"

#### 2. Configure the Target Pipeline

In the component details panel:

**Basic Settings:**
- **Focus Range**: 2000.0 (detection radius in cm)
- **Focus Trace Channel**: Visibility

**Target Pipeline:**
- **Channel Id**: `Target`

**Pipeline Stages:**

1. **Sampler** (click + to add):
   - Type: `ERPSphereOverlapSampler`
   - **Trace Channel**: Visibility
   - **Actor Class**: AActor
   - **Ignore Context Actor**: ✓

2. **Filters** (click + to add):
   - Type: `ERPTargetableFilter`
   - (This filters out actors that don't implement IERPTargetable)

3. **Scorers** (click + to add):
   - Type: `ERPDistanceScorer`
   - **Normalize By Range**: ✓
   - **Reject Beyond Max Distance**: ✗

4. **Aggregator**:
   - Type: `ERPIdentityAggregator`
   - (Since we only have one scorer, this passes through the score)

5. **Resolver**:
   - Type: `ERPLowestScoreResolver`
   - (Lower scores = closer targets = better)

#### 3. Make Actors Targetable

On your enemy/target actor Blueprint:

1. **Implement Interface:**
   - Class Settings → Interfaces → Add `ERPTargetable`

2. **Override Function:**
   - In the Event Graph, implement `Can Be Targeted By`
   - Return `true` (or add custom logic)

#### 4. Bind to Events

In your PlayerController or UI:

```
Event BeginPlay
  → Get Component (PerceptionComponent)
  → Bind Event to OnTargetAcquired
    → Print String: "Target Acquired: {Target}"
```

---

## Blueprint Example

### Complete Target Lock System

This example shows a full targeting system with lock functionality.

#### 1. Setup (PlayerController)

**Add Component:**
- `ERPPerceptionComponent` (configured as above)

**Variables:**
- `bIsTargeting` (Boolean) - whether targeting mode is active
- `LockedTarget` (Actor) - currently locked target

**Event Graph:**

```
// Toggle targeting mode
Event Input: HoldTargetButton
  → Set IsTargeting = True

Event Input: ReleaseTargetButton
  → Set IsTargeting = False
  → PerceptionComponent → UnlockTarget

// Handle target acquisition
Event: OnTargetAcquired (Target, HasFocus)
  → Branch: IsTargeting?
    True:
      → Print: "Target Detected: {Target}"
      → (Update UI widget to show target indicator)
    False:
      → (Do nothing)

// Lock target on button press
Event Input: LockTargetButton
  → PerceptionComponent → GetPrimaryTarget
  → IsValid?
    True:
      → PerceptionComponent → LockTarget(Target)
      → Set LockedTarget = Target
      → Print: "Target Locked: {Target}"
    False:
      → Print: "No target to lock"

// Handle target lost
Event: OnTargetLost (Target, HadFocus)
  → Print: "Target Lost: {Target}"
  → (Remove UI indicator)
```

#### 2. Setup (Enemy Actor)

**Implement Interface:**
- Add `ERPTargetable` interface

**Event Graph:**

```
// Basic implementation
Function: CanBeTargetedBy (TargetingActor)
  → Branch: Is Alive?
    True: → Return True
    False: → Return False
```

---

## C++ Example

### Setting Up Perception in C++

#### 1. Create the Component

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
};
```

**YourPlayerController.cpp:**
```cpp
#include "YourPlayerController.h"
#include "Pipeline/ERPChannelPipeline.h"
#include "Pipeline/Defaults/ERPSphereOverlapSampler.h"
#include "Pipeline/Defaults/ERPTargetableFilter.h"
#include "Pipeline/Defaults/ERPDistanceScorer.h"
#include "Pipeline/Defaults/ERPIdentityAggregator.h"
#include "Pipeline/Defaults/ERPLowestScoreResolver.h"

AYourPlayerController::AYourPlayerController()
{
    // Create the perception component
    PerceptionComponent = CreateDefaultSubobject<UERPPerceptionComponent>(TEXT("PerceptionComponent"));
}

void AYourPlayerController::BeginPlay()
{
    Super::BeginPlay();

    // Configure the Target Pipeline at runtime
    FERPChannelPipeline& TargetPipeline = PerceptionComponent->TargetPipeline;
    TargetPipeline.ChannelId = FName("Target");

    // Create and configure Sampler
    UERPSphereOverlapSampler* Sampler = NewObject<UERPSphereOverlapSampler>(this);
    Sampler->TraceChannel = ECC_Visibility;
    Sampler->bIgnoreContextActor = true;
    TargetPipeline.Sampler = Sampler;

    // Add Filter
    UERPTargetableFilter* Filter = NewObject<UERPTargetableFilter>(this);
    TargetPipeline.Filters.Add(Filter);

    // Add Scorer
    UERPDistanceScorer* Scorer = NewObject<UERPDistanceScorer>(this);
    Scorer->bNormalizeByRange = true;
    TargetPipeline.Scorers.Add(Scorer);

    // Set Aggregator
    UERPIdentityAggregator* Aggregator = NewObject<UERPIdentityAggregator>(this);
    TargetPipeline.Aggregator = Aggregator;

    // Set Resolver
    UERPLowestScoreResolver* Resolver = NewObject<UERPLowestScoreResolver>(this);
    TargetPipeline.Resolver = Resolver;

    // Bind to events
    PerceptionComponent->OnTargetAcquired.AddDynamic(this, &AYourPlayerController::OnTargetAcquired);
    PerceptionComponent->OnTargetLost.AddDynamic(this, &AYourPlayerController::OnTargetLost);
}

void AYourPlayerController::SetupInputComponent()
{
    Super::SetupInputComponent();

    // Bind input action
    InputComponent->BindAction("LockTarget", IE_Pressed, this, &AYourPlayerController::ToggleTargetLock);
}

void AYourPlayerController::OnTargetAcquired(AActor* Target, bool bHasCurrentFocus)
{
    if (bHasCurrentFocus)
    {
        UE_LOG(LogTemp, Log, TEXT("Target acquired: %s"), *Target->GetName());
        // Update UI
    }
}

void AYourPlayerController::OnTargetLost(AActor* Target, bool bHadCurrentFocus)
{
    if (bHadCurrentFocus)
    {
        UE_LOG(LogTemp, Log, TEXT("Target lost: %s"), *Target->GetName());
        // Update UI
    }
}

void AYourPlayerController::ToggleTargetLock()
{
    if (PerceptionComponent->IsTargetLocked())
    {
        PerceptionComponent->UnlockTarget();
    }
    else
    {
        AActor* CurrentTarget = PerceptionComponent->GetPrimaryTarget();
        if (CurrentTarget)
        {
            PerceptionComponent->LockTarget(CurrentTarget);
        }
    }
}
```

#### 2. Implement Targetable Interface

**YourEnemy.h:**
```cpp
#pragma once

#include "CoreMinimal.h"
#include "GameFramework/Character.h"
#include "Core/ERPTargetable.h"
#include "YourEnemy.generated.h"

UCLASS()
class YOURPROJECT_API AYourEnemy : public ACharacter, public IERPTargetable
{
    GENERATED_BODY()

public:
    // IERPTargetable Interface
    virtual bool CanBeTargetedBy_Implementation(AActor* TargetingActor) const override;

protected:
    UPROPERTY(EditAnywhere, BlueprintReadWrite, Category = "Combat")
    bool bIsAlive = true;
};
```

**YourEnemy.cpp:**
```cpp
#include "YourEnemy.h"

bool AYourEnemy::CanBeTargetedBy_Implementation(AActor* TargetingActor) const
{
    // Only allow targeting if alive
    return bIsAlive;
}
```

---

## Testing Your Setup

### Verification Checklist

1. **Component Setup**
   - [ ] Perception component added to PlayerController/Pawn
   - [ ] Pipeline configured with all required stages
   - [ ] Focus Range set appropriately (e.g., 2000)

2. **Target Actors**
   - [ ] Target actors implement IERPTargetable
   - [ ] CanBeTargetedBy returns true
   - [ ] Actors are within Focus Range

3. **Events**
   - [ ] OnTargetAcquired bound and firing
   - [ ] Console/logs show target detection

### Debug Visualization

Enable debug drawing:
- **bDebugFocus**: ✓
- **DebugDrawTime**: 2.0

This will draw:
- Green lines for successful traces
- Red lines for hits
- Debug info on screen

### Console Commands

Use these commands for debugging:
```
showdebug PERCEPTION  // Show perception debug info
stat GAME            // Show game stats including component tick times
```

---

## Common Pitfalls & Troubleshooting

### Target Not Detected

**Problem:** Targets aren't being detected even when in range.

**Solutions:**
1. **Check Interface Implementation**
   - Verify target actors implement `IERPTargetable`
   - Verify `CanBeTargetedBy` returns `true`

2. **Check Pipeline Configuration**
   - Sampler must be set
   - Resolver must be set
   - If using filters, ensure they're not rejecting all candidates

3. **Check Range**
   - Increase `FocusRange` in perception component
   - Verify actors are within range (enable debug drawing)

4. **Check Collision**
   - Verify `TraceChannel` in Sampler matches actor collision settings
   - Actors must have collision enabled

### Pipeline Not Executing

**Problem:** Pipeline doesn't seem to run at all.

**Solutions:**
1. **Component Ticking**
   - Verify component is set to tick
   - Check `PrimaryComponentTick.bCanEverTick = true`

2. **Owner Validity**
   - Component owner must be valid
   - Owner must have a valid location

3. **Pipeline Validity**
   - `ChannelId` must be set
   - Both Sampler and Resolver are required

### Events Not Firing

**Problem:** Events bound but not receiving callbacks.

**Solutions:**
1. **Bind at Right Time**
   - Bind in `BeginPlay`, not constructor
   - Use `AddDynamic` for dynamic delegates

2. **Check Focus State**
   - Events include `bHasCurrentFocus` parameter
   - Only one channel has focus at a time
   - Filter events based on this flag if needed

3. **Verify Candidate Changes**
   - Events fire when best candidate changes
   - If same target stays best, no new events fire

### Performance Issues

**Problem:** Frame rate drops with perception enabled.

**Solutions:**
1. **Reduce Range**
   - Lower `FocusRange` to minimum needed
   - Use smaller detection radius

2. **Optimize Sampler**
   - Use tighter Actor Class filter
   - Consider custom sampler for specific needs

3. **Adjust Tick Rate**
   - Reduce component tick frequency if real-time isn't needed
   - Use `PrimaryComponentTick.TickInterval`

4. **Limit Candidates**
   - Add filters early in pipeline
   - Use spatial partitioning for large worlds

### Null Reference Errors

**Problem:** Crashes or errors related to null pointers.

**Solutions:**
1. **Validate Pipeline Objects**
   - Ensure Sampler, Resolver are not null
   - Check filter/scorer arrays for null entries

2. **Check Context Validity**
   - Verify owner actor is valid
   - Ensure context build doesn't fail

3. **Blueprint vs C++**
   - In BP, instanced objects auto-create
   - In C++, must use `NewObject` to create pipeline components

---

## Next Steps

Now that you have a basic setup working:

1. **Read the Architecture Guide** - Understand how pipelines work under the hood
   → [Pipeline-Architecture.md](Pipeline-Architecture.md)

2. **Explore Examples** - See more complex setups and custom components
   → [Examples.md](Examples.md)

3. **Check API Reference** - Detailed documentation of all classes
   → [API-Reference.md](API-Reference.md)

4. **Build Custom Components** - Create your own scorers, filters, etc.
   → [Pipeline-Architecture.md#extensibility](Pipeline-Architecture.md#extensibility)
