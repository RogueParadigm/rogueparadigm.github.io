# MetaSound Guide - Advanced Music Features

This guide shows how to use **MetaSounds** with ElysMusicEngine for advanced features like intro→loop transitions, dynamic parameters, and more.

---

## 🎵 Why MetaSounds?

**USoundBase** (Sound Cues, Sound Waves) = Simple playback  
**MetaSound Source** = Advanced features:
- Intro → Loop → Outro transitions
- Dynamic parameters (intensity, filter, pitch)
- Crossfade between sections
- Beat-synced transitions
- Complex audio graphs

**Good news:** ElysMusicEngine already supports MetaSounds! (UMetaSoundSource inherits from USoundBase)

---

## 📦 Setup: Using MetaSound with a Layer

### 1. Create Your MetaSound Source

1. **Content Browser** → Right-click → **Sounds → MetaSound Source**
2. Name it (e.g., `MSS_CombatMusic`)
3. Open it and build your graph

### 2. Push the Layer (Same as Before!)

```blueprint
Event BeginPlay
  ↓
Push Music Layer
  ├─ Layer Name: "Combat"
  ├─ Music: MSS_CombatMusic ✅ (MetaSound Source works!)
  ├─ Priority: 10
  └─ ...other settings
```

**That's it!** MetaSound Sources work exactly like Sound Cues.

---

## 🎛️ Controlling MetaSound Parameters

### Get the Audio Component

To change parameters at runtime, you need the **AudioComponent**:

```blueprint
Event (e.g., Player Low Health)
  ↓
Get Layer Audio Component
  └─ Layer Name: "Combat"
  ↓
Is Valid?
  └─ YES:
      Set Float Parameter
        ├─ Target: (Audio Component from above)
        ├─ Name: "Intensity"  ← Parameter name from MetaSound
        └─ Float: 0.8
```

### Example: Dynamic Intensity

**MetaSound Graph:**
```
[Float Parameter: "Intensity" (0.0-1.0)]
  ↓
[Select between Low/Med/High intensity stems]
  ↓
[Output]
```

**Blueprint:**
```blueprint
Event Tick
  ↓
Get Player Health Percentage
  ↓
Normalize to 0.0-1.0
  ↓
Get Layer Audio Component ("Combat")
  ↓
Set Float Parameter
  ├─ Name: "Intensity"
  └─ Value: (Health percentage)
```

Result: Music intensity changes smoothly with player health!

---

## 🔄 Intro → Loop Pattern

### MetaSound Setup

**Classic pattern for seamless looping:**

```
MetaSound Graph:

[Wave Player: "Intro" (Play Once)]
  ↓
[On Finished] → Trigger
  ↓
[Wave Player: "Loop" (Loop Forever)]
  ↓
[Output]
```

**Or with parameters:**

```
[Bool Parameter: "HasPlayed Intro" = false]
  ↓
[Branch]
  ├─ FALSE: Play Intro → Set "HasPlayedIntro" = true
  └─ TRUE: Play Loop (looping)
  ↓
[Output]
```

### Blueprint Usage

```blueprint
Push Music Layer
  ├─ Music: MSS_IntroLoopMusic
  ├─ FadeIn: 0.0  ← No fade, intro handles it
  └─ Looping: TRUE ← MetaSound handles internal loop

// Later, to restart from intro:
Pop Music Layer ("Combat")
Push Music Layer ("Combat") ← Restarts, plays intro again
```

---

## 🎚️ Common MetaSound Parameters

### Float Parameters
```cpp
"Intensity" (0.0-1.0) - Mix between calm/intense stems
"FilterCutoff" (20-20000) - Dynamic EQ
"ReverbAmount" (0.0-1.0) - Add space dynamically
"Pitch" (0.5-2.0) - Speed up/slow down
```

### Bool Parameters
```cpp
"IsInCombat" (true/false) - Toggle combat stems
"IsBossPhase" (true/false) - Enable boss layer
"PlayerLowHealth" (true/false) - Trigger danger music
```

### Trigger Parameters
```cpp
"TransitionNow" - Force transition to next section
"Hit" - Play hit stinger
"Victory" - Trigger victory flourish
```

---

## 📋 Complete Example: Boss Fight Music

### MetaSound: `MSS_BossFight`

```
Inputs:
  - Float "Intensity" (0.0-1.0)
  - Bool "IsPhase2"
  - Trigger "Hit"

Graph:
[Wave: "BossIntro"] → [Play Once]
  ↓
[Wave: "BossLoop_Phase1"]
  ↓
[Branch on "IsPhase2"]
  ├─ TRUE: [Wave: "BossLoop_Phase2"]
  └─ FALSE: Continue Phase1
  ↓
[Mix with intensity parameter]
  ↓
[On "Hit" trigger: Add drum hit]
  ↓
[Output]
```

### Blueprint: Boss Actor

```blueprint
// Start boss music
Event BeginPlay
  ↓
Push Music Layer
  ├─ Layer Name: "BossFight"
  ├─ Music: MSS_BossFight
  ├─ Priority: 15
  └─ FadeIn: 0.0  ← Intro handles fade

// Update intensity based on boss health
Event Tick
  ↓
Get Boss Health (%)
  ↓
Inverse (1.0 - Health%) → More intense as health decreases
  ↓
Get Layer Audio Component ("BossFight")
  ↓
Set Float Parameter
  ├─ Name: "Intensity"
  └─ Value: (Inverted health)

// Phase 2 transition
Event OnHealthBelow50%
  ↓
Get Layer Audio Component ("BossFight")
  ↓
Set Bool Parameter
  ├─ Name: "IsPhase2"
  └─ Value: TRUE

// Hit reaction
Event OnPlayerHitBoss
  ↓
Get Layer Audio Component ("BossFight")
  ↓
Set Trigger Parameter
  └─ Name: "Hit"

// Boss defeated
Event OnBossDeath
  ↓
Pop Music Layer ("BossFight")
  ↓
Push Music Layer
  ├─ Layer Name: "Victory"
  ├─ Music: MSS_VictoryStinger
  └─ Priority: 20
```

---

## 🔍 Debugging MetaSound Layers

### Check if Layer is Playing

```blueprint
Get Layer Info
  └─ Layer Name: "Combat"
  ↓
Break Active Music Layer
  ├─ Is Valid?
  ├─ Audio Component → Is Playing?
  ├─ Priority
  └─ Is Fading Out?
```

### List All Active Layers

```blueprint
Get Active Layers
  ↓
ForEach Loop
  ↓
Print String
  └─ "Layer: {Name}, Priority: {Priority}, Playing: {IsPlaying}"
```

---

## 💡 Best Practices

### 1. **Parameter Names**
- Use clear names: `"Intensity"` not `"Val1"`
- Document your parameters in MetaSound comments
- Keep names consistent across MetaSounds

### 2. **Intro→Loop**
- Use MetaSound's internal logic (cleaner than Blueprint)
- Don't rely on Blueprint timers for music transitions
- Test loop points carefully (avoid pops/clicks)

### 3. **Performance**
- Don't call `Set Parameter` every tick unless necessary
- Cache Audio Component reference if setting multiple parameters
- Use `Set Trigger Parameter` for one-shot events

### 4. **Organization**
- Prefix MetaSounds: `MSS_` (MetaSound Source)
- Group by category: `MSS_Combat_`, `MSS_Ambient_`, `MSS_Boss_`
- Create templates for common patterns (intro→loop, dynamic intensity)

---

## 🎯 Quick Reference

### Blueprint Functions

```cpp
// Get audio component for parameter control
UAudioComponent* = Get Layer Audio Component(Layer Name)

// Get layer data
FERP_ActiveMusicLayer = Get Layer Info(Layer Name)

// Get all active layers
TArray<FERP_ActiveMusicLayer> = Get Active Layers()
```

### Audio Component Functions (Standard Unreal)

```cpp
// Float parameter
Set Float Parameter(Name, Value)

// Bool parameter
Set Bool Parameter(Name, Value)

// Trigger parameter
Set Trigger Parameter(Name)

// Check if playing
bool = Is Playing()

// Get playback time
float = Get Playback Position()
```

---

## 🚀 Next Steps

1. **Create your first MetaSound** with intro→loop
2. **Test with Get Layer Audio Component** in Blueprint
3. **Add dynamic parameters** (intensity, filter, etc.)
4. **Check Examples.md** for more combat/boss music patterns

**MetaSounds + ElysMusicEngine = Extremely powerful!** 🎵

