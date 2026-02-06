---
id: architecture
title: Architecture Overview
sidebar_position: 4
---

# Architecture Overview

Understanding how ElysMusicEngine works under the hood.

---

## 🎯 High-Level Design

ElysMusicEngine uses a **priority-based layer stack** managed by a single **GameInstanceSubsystem**.

```
┌────────────────────────────────────────────────────────┐
│                 Your Game (Blueprint/C++)              │
│  ┌──────────────────────────────────────────────────┐ │
│  │  • Push Music Layer (combat starts)              │ │
│  │  • Pop Music Layer (combat ends)                 │ │
│  │  • Apply Music Config (enter dungeon)            │ │
│  │  • Play Stinger (achievement unlocked)           │ │
│  └──────────────────────────────────────────────────┘ │
└────────────────────────────────────────────────────────┘
                        │
                        ▼
┌────────────────────────────────────────────────────────┐
│         UERP_MusicSubsystem (GameInstanceSubsystem)    │
│  ┌──────────────────────────────────────────────────┐ │
│  │  • Active Layers (TArray, sorted by priority)    │ │
│  │  • Audio Component Pool                          │ │
│  │  • Stinger Component                             │ │
│  │  • Master Volume State                           │ │
│  │  • Ducking State                                 │ │
│  └──────────────────────────────────────────────────┘ │
└────────────────────────────────────────────────────────┘
                        │
                        ▼
┌────────────────────────────────────────────────────────┐
│              Active Music Layers (Runtime)             │
│  ┌──────────────────────────────────────────────────┐ │
│  │  Boss Music      [Priority 15] Replace  PLAYING  │ │
│  │  Combat Music    [Priority 10] Replace           │ │
│  │  Tension Layer   [Priority 5]  Additive          │ │
│  │  Exploration     [Priority 0]  Replace           │ │
│  └──────────────────────────────────────────────────┘ │
└────────────────────────────────────────────────────────┘
                        │
                        ▼
┌────────────────────────────────────────────────────────┐
│                  Unreal Audio System                   │
│  ┌──────────────────────────────────────────────────┐ │
│  │  UAudioComponent (playing Boss Music)            │ │
│  │  UAudioComponent (pooled, inactive)              │ │
│  │  UAudioComponent (pooled, inactive)              │ │
│  └──────────────────────────────────────────────────┘ │
└────────────────────────────────────────────────────────┘
```

---

## 🏗️ Core Components

### 1. Music Subsystem (UERP_MusicSubsystem)

**Type:** `UGameInstanceSubsystem`  
**Lifetime:** Created on GameInstance init, destroyed on shutdown  
**Purpose:** Central music manager

**Responsibilities:**
- Maintain stack of active music layers
- Sort layers by priority
- Determine which layers should play
- Crossfade between tracks
- Manage audio component pool
- Handle stingers and ducking
- Persist across level transitions

**Key:**
- **Single instance** per game
- Always accessible via `GetGameInstance()-&gt;GetSubsystem&lt;UERP_MusicSubsystem&gt;()`
- **Thread-safe** (all calls on game thread)

### 2. Music Layer (FERP_MusicLayer)

**Type:** `USTRUCT` (Blueprint-exposed struct)  
**Purpose:** Define a single music track with metadata

**Fields:**
```cpp
FName LayerName;                    // Unique identifier
TSoftObjectPtr&lt;USoundBase&gt; Music;   // The music asset (lazy-loaded)
int32 Priority;                     // 0-100 (higher = more important)
ERP_EMusicLayerMode LayerMode;      // Replace or Additive
float VolumeMultiplier;             // 0.0-1.0
float FadeInTime;                   // Seconds
float FadeOutTime;                  // Seconds
bool bLooping;                      // Loop music?
bool bPersistAcrossLevels;          // Keep across level loads?
```

### 3. Active Music Layer (FERP_ActiveMusicLayer)

**Type:** Internal struct (not exposed)  
**Purpose:** Runtime state for a playing layer

**Fields:**
```cpp
FERP_MusicLayer LayerData;          // Original layer definition
UAudioComponent* AudioComponent;    // Playing audio component
bool bIsFadingOut;                  // Currently fading out?
```

### 4. Music Layer Config (UERP_MusicLayerConfig)

**Type:** `UDataAsset`  
**Purpose:** Reusable preset with multiple layers

**Fields:**
```cpp
FString ConfigName;                 // Descriptive name
TArray&lt;FERP_MusicLayer&gt; Layers;     // All layers in this config
float DefaultFadeTime;              // Default fade duration
```

**Use Cases:**
- Menu music setup
- Dungeon ambiance (base + wind + tension)
- Boss encounter (multiple phases)

### 5. Music Zone (UERP_MusicZoneComponent / AERP_MusicZone)

**Type:** `UBoxComponent` / `AActor`  
**Purpose:** Level-placed trigger for automatic music

**Behavior:**
- On **Begin Overlap** → Push music layer
- On **End Overlap** → Pop music layer
- Optional: Filter by actor tag
- Optional: Trigger once

---

## 🔄 Music Layer Lifecycle

### Push Layer

```
User calls: Push Music Layer("Combat", Priority=10, Replace)
     │
     ▼
┌────────────────────────────────────────┐
│  1. Check if layer already exists      │
│     → If yes: Ignore (already playing) │
└────────────────────────────────────────┘
     │
     ▼
┌────────────────────────────────────────┐
│  2. Create FERP_ActiveMusicLayer       │
│     → Copy layer data                  │
│     → AudioComponent = nullptr         │
└────────────────────────────────────────┘
     │
     ▼
┌────────────────────────────────────────┐
│  3. Add to ActiveLayers array          │
└────────────────────────────────────────┘
     │
     ▼
┌────────────────────────────────────────┐
│  4. Sort ActiveLayers by Priority      │
│     (Descending: highest first)        │
└────────────────────────────────────────┘
     │
     ▼
┌────────────────────────────────────────┐
│  5. UpdatePlayingLayers()              │
│     → Determine what should play       │
│     → Start/stop audio components      │
└────────────────────────────────────────┘
```

### Pop Layer

```
User calls: Pop Music Layer("Combat")
     │
     ▼
┌────────────────────────────────────────┐
│  1. Find layer by name in ActiveLayers │
│     → If not found: Warning, return    │
└────────────────────────────────────────┘
     │
     ▼
┌────────────────────────────────────────┐
│  2. Fade out audio component           │
│     → FadeOut(FadeOutTime)             │
│     → Mark bIsFadingOut = true         │
└────────────────────────────────────────┘
     │
     ▼
┌────────────────────────────────────────┐
│  3. UpdatePlayingLayers()              │
│     → New music may start playing      │
└────────────────────────────────────────┘
     │
     ▼
┌────────────────────────────────────────┐
│  4. Layer removal (on next update)     │
│     → After fade completes             │
│     → RemoveFadedOutLayers()           │
└────────────────────────────────────────┘
```

### Update Playing Layers (Core Logic)

```
UpdatePlayingLayers()
     │
     ▼
┌────────────────────────────────────────┐
│  1. Remove fully faded out layers      │
└────────────────────────────────────────┘
     │
     ▼
┌────────────────────────────────────────┐
│  2. Find highest priority Replace layer│
│     → TopReplacePriority               │
└────────────────────────────────────────┘
     │
     ▼
┌────────────────────────────────────────┐
│  3. For each layer:                    │
│     If Replace:                        │
│       → Play if this is top Replace    │
│     If Additive:                       │
│       → Play if priority &gt;= TopReplace │
└────────────────────────────────────────┘
     │
     ▼
┌────────────────────────────────────────┐
│  4. Start/stop audio components        │
│     → GetOrCreateAudioComponent()      │
│     → SetSound(), Play(), FadeIn()     │
└────────────────────────────────────────┘
```

---

## 🎚️ Layer Selection Logic

### Replace Mode

**Rule:** Only the **highest priority** Replace layer plays.

**Example:**
```
Active Layers:
  Combat [10] Replace      ← PLAYS (highest Replace)
  Exploration [0] Replace  ← STOPS (lower priority)
```

**Reason:** Replace means "this is the main music now."

### Additive Mode

**Rule:** Additive layers play if their priority is ≥ current Replace layer.

**Example:**
```
Active Layers:
  Combat [10] Replace      ← PLAYS (highest Replace)
  Tension [5] Additive     ← STOPS (5 &lt; 10)
  Rain [12] Additive       ← PLAYS (12 &gt;= 10, adds on top)
```

**Result:** Combat music + Rain layer play together.

### Complex Example

```
Stack:
  Boss [15] Replace        → PLAYS
  Combat [10] Replace      → Ignored (lower Replace)
  Tension [12] Additive    → STOPS (12 &lt; 15)
  Wind [16] Additive       → PLAYS (16 &gt;= 15, adds on top)
  Exploration [0] Replace  → Ignored (lower Replace)

Playing: Boss Music + Wind Layer
```

---

## 🔊 Audio Component Pooling

### Why Pooling?

Creating/destroying `UAudioComponent` is expensive. We reuse them.

### Pool Size

- **Dynamic:** Grows as needed
- Typical: 2-4 components
- Max observed: 10-15 (with many layers)

### Algorithm

```
GetOrCreateAudioComponent():
  For each component in pool:
    If not playing:
      Return component (reuse)
  
  // All busy, create new
  NewComponent = NewObject&lt;UAudioComponent&gt;()
  Add to pool
  Return NewComponent
```

### Cleanup

Components are **not** destroyed until subsystem shutdown:
- Stopped components sit in pool
- Reused when next layer needs one
- Minimal memory footprint

---

## 🎺 Stingers & Ducking

### Stinger Flow

```
User calls: Play Stinger(FanfareSound, bDuck=true, DuckVolume=0.3)
     │
     ▼
┌────────────────────────────────────────┐
│  1. If bDuckMusic:                     │
│     → PreDuckVolume = MasterVolume     │
│     → FadeAllLayersToVolume(0.3)       │
└────────────────────────────────────────┘
     │
     ▼
┌────────────────────────────────────────┐
│  2. Play stinger on dedicated component│
│     → StingerComponent-&gt;SetSound()     │
│     → StingerComponent-&gt;Play()         │
│     → Bind OnAudioFinished callback    │
└────────────────────────────────────────┘
     │
     ▼
┌────────────────────────────────────────┐
│  3. Wait for stinger to finish...      │
└────────────────────────────────────────┘
     │
     ▼
┌────────────────────────────────────────┐
│  4. OnStingerFinished callback         │
│     → Restore PreDuckVolume            │
│     → FadeAllLayersToVolume(1.0)       │
└────────────────────────────────────────┘
```

### Dialogue Ducking

Similar to stinger, but binds to **user's** `UAudioComponent`:

```
EnableDialogueDucking(DialogueComponent, DuckVolume=0.4)
     │
     ▼
┌────────────────────────────────────────┐
│  1. Duck music to 0.4 volume           │
└────────────────────────────────────────┘
     │
     ▼
┌────────────────────────────────────────┐
│  2. Bind to DialogueComponent's        │
│     OnAudioFinished                    │
└────────────────────────────────────────┘
     │
     ▼
┌────────────────────────────────────────┐
│  3. Dialogue plays...                  │
└────────────────────────────────────────┘
     │
     ▼
┌────────────────────────────────────────┐
│  4. Dialogue finishes → callback       │
│     → Restore music volume             │
└────────────────────────────────────────┘
```

---

## 💾 Persistence Across Levels

### How It Works

1. Layer has `bPersistAcrossLevels = true`
2. Audio component marked with `bIsMusic = true`
3. Unreal's audio system keeps it alive during:
   - Level streaming
   - Map transitions
   - Level loads

### Subsystem Persistence

`UERP_MusicSubsystem` is a **GameInstanceSubsystem**:
- Lives for entire game session
- Not destroyed on level change
- Keeps `ActiveLayers` array intact

### Result

Music **continues seamlessly** when changing levels!

---

## 🧵 Thread Safety

### Game Thread Only

All public functions **must** be called from game thread:
- Blueprint nodes → Always game thread ✅
- C++ → Ensure you're on game thread

### Audio System

Audio playback happens on **audio render thread**:
- Managed by Unreal's `AudioMixer`
- We only control from game thread via `UAudioComponent`

### No Locks Needed

Single-threaded design = no mutexes or locks.

---

## 📊 Performance Characteristics

### CPU Cost

| Operation | Cost | Notes |
|-----------|------|-------|
| Push Layer | Low | Array add + sort |
| Pop Layer | Low | Array search + fade |
| Update Layers | Medium | Per-frame check (only on changes) |
| Stinger | Low | Single audio component |
| Audio Playback | Low | Handled by AudioMixer |

### Memory

| Item | Size | Count |
|------|------|-------|
| Subsystem | ~1 KB | 1 |
| Active Layer | ~100 bytes | 2-10 typical |
| Audio Component | ~500 bytes | 3-15 typical |
| Music Asset | Varies | Loaded on-demand |

**Total:** ~10-50 KB overhead (negligible)

### Scalability

- ✅ **2-5 layers:** Optimal
- ✅ **10 layers:** Fine
- ⚠️ **20+ layers:** Consider consolidation

---

## 🎓 Design Decisions

### Why GameInstanceSubsystem?

- ✅ Singleton pattern (one instance)
- ✅ Auto-created by engine
- ✅ Persists across levels
- ✅ Blueprint-accessible

### Why Priority-Based?

**vs State Machine:**
- ✅ Simpler mental model
- ✅ Easy layer stacking
- ✅ No complex transitions
- ✅ Indie-friendly

### Why Soft Object Pointers?

`TSoftObjectPtr&lt;USoundBase&gt;` allows:
- ✅ Lazy loading (only load when needed)
- ✅ Smaller config assets
- ✅ Async loading possible (future)

### Why Audio Component Pool?

- ✅ Avoid create/destroy churn
- ✅ Better performance
- ✅ Transparent to user

---

## 🔮 Future Extensions (Possible)

### Beat Synchronization
- Add BPM field to `FERP_MusicLayer`
- Wait for beat before transition
- Quantize stingers to beat

### Music Layers (Stems)
- Multiple audio files per layer (drums, melody, bass)
- Dynamic mixing via volume

### Advanced Crossfade
- Custom crossfade curves
- EQU-based transitions
- Musical stingers on transition

### Analytics
- Track which music plays when
- Player preference learning
- A/B testing support

---

## 📚 Related Documentation

- **[Setup Guide](SetupGuide.md)** - Getting started
- **[Quick Reference](Quick-Reference.md)** - Quick lookup
- **[API Reference](API-Reference.md)** - All functions
- **[Examples](Examples.md)** - Working patterns

---

**Now you understand how ElysMusicEngine works!** 🎵
