# ElysPerceptionPlugin

![Version](https://img.shields.io/badge/version-1.0-blue.svg)
![Unreal Engine](https://img.shields.io/badge/Unreal%20Engine-5.0+-blue.svg)
Proprietary licence

A powerful, modular Unreal Engine plugin for **player-side perception and evaluation** using a flexible Pipeline architecture.

## Table of Contents
- [Overview](#overview)
- [Pipeline System](#pipeline-system)
- [Features](#features)
- [Quick Start](#quick-start)
- [Documentation](#documentation)
- [Default Implementations](#default-implementations)
- [Example Configuration](#example-configuration)
- [Installation](#installation)
- [Use Cases](#use-cases)
- [Contributing](#contributing)

---

## Overview

ElysPerceptionPlugin provides a **modular, data-driven perception system** for Unreal Engine games. Instead of hardcoded targeting logic, the plugin uses a configurable Pipeline architecture that can be customized to fit any gameplay scenario.

### What It Does

- **Detects** candidates (actors) in the game world
- **Filters** them based on configurable rules
- **Scores** them using multiple factors
- **Selects** the best candidate per channel
- **Notifies** your game code via events

### What It Doesn't Do

The plugin is **perception only**. It never:
- Executes gameplay actions
- Interprets player intent
- Triggers UI or visuals
- Owns gameplay authority

All gameplay decisions (targeting, locking, interaction execution) remain in your control.

---

## Pipeline System

The core of the plugin is the **Pipeline architecture**, a modular system with five configurable stages:

```
┌─────────────┐
│  1. SAMPLER │  → Collects candidate actors from world
└──────┬──────┘
       ▼
┌─────────────┐
│ 2. FILTERS  │  → Eliminates invalid candidates
└──────┬──────┘
       ▼
┌─────────────┐
│ 3. SCORERS  │  → Assigns scores to each candidate
└──────┬──────┘
       ▼
┌─────────────┐
│4. AGGREGATOR│  → Combines multiple scores into one
└──────┬──────┘
       ▼
┌─────────────┐
│ 5. RESOLVER │  → Selects the winning candidate
└─────────────┘
```

### Why Pipelines?

✅ **Modular** - Each stage has one job  
✅ **Configurable** - Mix and match components  
✅ **Extensible** - Add custom logic without modifying core code  
✅ **Reusable** - Same components work across channels  
✅ **Designer-Friendly** - Configure in editor, no C++ required  

### Multi-Channel Support

Run multiple independent pipelines simultaneously:
- **Target Channel** - Combat targeting, enemy lock-on
- **Interaction Channel** - Door/item interaction, UI prompts
- **Custom Channels** - Healing targets, quest objectives, etc.

Each channel maintains its own best candidate and fires independent events.

---

## Features

### Core Features

- **Pipeline Architecture** - Modular, configurable perception system
- **Multi-Channel Evaluation** - Target, Interaction, and custom channels
- **Context-Based** - Immutable context shared across all stages
- **Event-Driven** - Subscribe to acquisition, loss, and focus change events
- **Target Locking** - Optional lock mechanism for combat targeting
- **Symmetric Focus** - Automatic priority between competing channels
- **Debug Visualization** - Built-in debug drawing for development

### Extensibility

- **Blueprint Support** - Create custom pipeline components in BP
- **C++ Support** - Full C++ API for custom implementations
- **Interface-Based** - Opt-in system using `IERPTargetable` and `IERPInteractable`
- **Permission Hooks** - Override initiator-side logic in BP or C++

### Performance

- **Efficient** - Single perception pass shared across channels
- **Configurable** - Adjust range, tick rate, and filtering
- **Optimized** - Early rejection via filters, minimal allocations

---

## Quick Start

### 1. Add the Component

Add `ERPPerceptionComponent` to your PlayerController or Pawn.

### 2. Configure a Pipeline

In the component details:

```
Target Pipeline:
  ├─ Channel Id: "Target"
  ├─ Sampler: ERPSphereOverlapSampler
  ├─ Filters: ERPTargetableFilter
  ├─ Scorers: ERPDistanceScorer
  ├─ Aggregator: ERPIdentityAggregator
  └─ Resolver: ERPLowestScoreResolver
```

### 3. Implement Interface

On target actors (enemies, NPCs):

```cpp
// C++
class AMyEnemy : public ACharacter, public IERPTargetable
{
    virtual bool CanBeTargetedBy_Implementation(AActor* TargetingActor) const override
    {
        return bIsAlive;
    }
};
```

**Blueprint:** Add `ERPTargetable` interface, implement `Can Be Targeted By` → return `true`.

### 4. Listen for Events

```cpp
// C++
PerceptionComponent->OnTargetAcquired.AddDynamic(this, &AMyController::OnTargetAcquired);

void AMyController::OnTargetAcquired(AActor* Target, bool bHasCurrentFocus)
{
    if (bHasCurrentFocus)
    {
        // Update UI, show target indicator
    }
}
```

**Blueprint:** Bind to `OnTargetAcquired` event in Event Graph.

---

## Documentation

📚 **[Complete Documentation](Documentation/README.md)**

### Documentation Files

| Document | Description |
|----------|-------------|
| **[Getting Started](Documentation/GettingStarted.md)** | Installation, setup, and first pipeline |
| **[Pipeline Architecture](Documentation/Pipeline-Architecture.md)** | In-depth system explanation |
| **[API Reference](Documentation/API-Reference.md)** | Complete API documentation |
| **[Examples](Documentation/Examples.md)** | Practical examples and patterns |

### Documentation Website

The documentation is also available as a beautiful, searchable static website built with **Docusaurus** 🦕 (the dinosaur-named documentation framework!).

**🌐 [View Live Documentation](https://rogueparadigm.github.io/ElysPerceptionPlugin/)**

**To build and preview the documentation website locally:**

```bash
# Navigate to website directory
cd website

# Install dependencies (first time only)
npm install

# Preview locally with live reload
npm start

# Build static site
npm run build

# Deploy to GitHub Pages
npm run deploy
```

**Features:**
- 🎨 Modern, responsive design with dark/light mode
- 🔍 Full-text search
- 📱 Mobile-friendly
- 🚀 Easy to deploy (GitHub Pages, any static host)
- 🔗 Easy to integrate into existing websites
- 🦕 Built with Docusaurus

---

## Default Implementations

The plugin includes ready-to-use implementations for all pipeline stages:

### Samplers

| Class | Description |
|-------|-------------|
| `UERPSphereOverlapSampler` | Sphere overlap query around origin |

### Filters

| Class | Description |
|-------|-------------|
| `UERPTargetableFilter` | Requires `IERPTargetable` interface |
| `UERPInteractableFilter` | Requires `IERPInteractable` interface |
| `UERPImplementsInterfaceFilter` | Generic interface check |

### Scorers

| Class | Description |
|-------|-------------|
| `UERPDistanceScorer` | Score by distance from origin |
| `UERPConeScorer` | Score by angle from forward vector |
| `UERPViewportEllipseScorer` | Score by screen position (viewport) |

### Aggregators

| Class | Description |
|-------|-------------|
| `UERPIdentityAggregator` | Pass through single score (no combination) |
| `UERPAdditiveAggregator` | Sum all scores together |
| `UERPMultiplicativeAggregator` | Multiply all scores together |

### Resolvers

| Class | Description |
|-------|-------------|
| `UERPLowestScoreResolver` | Select candidate with lowest score |
| `UERPHighestScoreResolver` | Select candidate with highest score |

---

## Example Configuration

### Basic Target Lock System

```cpp
// Configure pipeline for closest enemy targeting
FERPChannelPipeline TargetPipeline;
TargetPipeline.ChannelId = FName("Target");

// Sample enemies within 3000 units
auto* Sampler = NewObject<UERPSphereOverlapSampler>(this);
Sampler->TraceChannel = ECC_Pawn;
TargetPipeline.Sampler = Sampler;

// Filter to only targetable actors
TargetPipeline.Filters.Add(NewObject<UERPTargetableFilter>(this));

// Score by distance (closer = better)
auto* DistanceScorer = NewObject<UERPDistanceScorer>(this);
DistanceScorer->bNormalizeByRange = true;
TargetPipeline.Scorers.Add(DistanceScorer);

// No aggregation needed (single scorer)
TargetPipeline.Aggregator = NewObject<UERPIdentityAggregator>(this);

// Select closest (lowest score)
TargetPipeline.Resolver = NewObject<UERPLowestScoreResolver>(this);
```

### Advanced Multi-Factor Scoring

```cpp
// Score by distance (40%), angle (30%), and threat (30%)
TargetPipeline.Scorers.Add(NewObject<UERPDistanceScorer>(this));
TargetPipeline.Scorers.Add(NewObject<UERPConeScorer>(this));
TargetPipeline.Scorers.Add(NewObject<UMyThreatScorer>(this)); // Custom

// Combine with weights
auto* Aggregator = NewObject<UWeightedAggregator>(this);
Aggregator->Weights = {0.4f, 0.3f, 0.3f};
TargetPipeline.Aggregator = Aggregator;
```

See **[Examples Documentation](Documentation/Examples.md)** for more configurations.

---

## Installation

### 1. Copy Plugin

```
YourProject/
└── Plugins/
    └── ElysPerceptionPlugin/
```

### 2. Enable in Editor

1. Open your project
2. **Edit → Plugins**
3. Search for "Elys Perception Plugin"
4. Enable and restart

### 3. Add to Build (C++ Projects)

In your `.Build.cs` file:

```csharp
PublicDependencyModuleNames.AddRange(new string[] { 
    "Core", 
    "CoreUObject", 
    "Engine", 
    "ElysPerceptionPlugin"  // Add this
});
```

### 4. Verify Installation

- Content Browser → Show Plugin Content
- You should see `ElysPerceptionPlugin` folder

---

## Use Cases

### Target Lock Systems

Perfect for action games with lock-on targeting:
- Third-person combat (Dark Souls style)
- First-person targeting (Doom Eternal style)
- Vehicle targeting (flight combat)

**[See Example →](Documentation/Examples.md#example-1-basic-target-lock-system)**

### Interaction Systems

Ideal for context-sensitive interactions:
- Door/lever interaction prompts
- Item pickup detection
- NPC dialogue triggers
- Quest objective highlighting

**[See Example →](Documentation/Examples.md#example-2-interaction-system-with-ui-prompts)**

### Healing/Support Systems

Great for team-based games:
- Prioritize low-health allies
- Healing target selection
- Buff/support targeting

**[See Example →](Documentation/Examples.md#example-4-custom-scorer---health-priority)**

### AI Perception

Useful for AI target selection:
- Enemy threat assessment
- Cover point evaluation
- Squad coordination

---

## Architecture

### Component Ownership

Attach to:
- **PlayerController** - For player perception
- **Pawn** - For player or AI perception
- **Custom Actor** - For special cases

### Data Flow

```
UERPPerceptionComponent (tick)
  → Build FERPPerceptionContext (once per tick)
  → Execute Each Channel Pipeline:
      → Sampler (collect candidates)
      → Filters (reject invalid)
      → Scorers (assign scores)
      → Aggregator (combine scores)
      → Resolver (select best)
  → Determine Focus Winner
  → Fire Events (acquired/lost/focus-changed)
```

### Interfaces

**Target-Side Opt-In:**
- `IERPTargetable` - Actor can be targeted
- `IERPInteractable` - Actor can be interacted with

**Context Provider:**
- `IERPPerceptionContextProvider` - Custom context building

---

## Performance Considerations

- **Range**: Smaller `FocusRange` = fewer candidates = better performance
- **Tick Rate**: Adjust `PrimaryComponentTick.TickInterval` if real-time isn't needed
- **Filters**: Add filters early to reject candidates quickly
- **Scorers**: Keep scoring logic lightweight; avoid expensive operations

---

## Roadmap

Future improvements being considered:
- Async pipeline execution for large candidate sets
- Blueprint-friendly aggregator weights
- More default scorer implementations
- Performance profiling tools
- Additional debug visualizations

---

## Contributing

Contributions are welcome! Whether it's:
- Bug reports
- Feature requests
- Documentation improvements
- Code contributions

Please follow Unreal Engine coding standards and include tests where applicable.

---

## License

MIT License - See LICENSE file for details.

---

## Credits

**Created by:** Elys  
**Plugin Category:** Elys' Plugins  
**Version:** 1.0  
**Unreal Engine:** 5.0+

---

## Support

- **Documentation:** [Documentation/README.md](Documentation/README.md)
- **Examples:** [Documentation/Examples.md](Documentation/Examples.md)
- **Issues:** Report via GitHub Issues

---

**Located in:** `Plugins/ElysPerceptionPlugin`
