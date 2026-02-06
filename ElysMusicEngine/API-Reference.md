# API Reference

Complete reference for Elys Music Engine Blueprint functions and components.

---

## Blueprint Function Library: UERP_MusicHelper

Blueprint-callable functions for controlling the music system. No actor placement needed - functions automatically access the GameInstanceSubsystem.

---

## Layer Control

### Push Music Layer

```cpp
Push Music Layer(WorldContext, LayerName, Music, Priority, LayerMode, VolumeMultiplier, FadeInTime, FadeOutTime, bLooping, bPersistAcrossLevels)
```

**Description:** Adds a new music layer to the stack. If a layer with the same name exists, the call is ignored.

**Parameters:**
- `World Context Object` (Object) - World context (automatic in Blueprint)
- `Layer Name` (Name) - Unique identifier for this layer (e.g., "Combat", "Menu")
- `Music` (Sound Base) - The music asset to play (Sound Wave or Sound Cue)
- `Priority` (Integer) - Layer priority, 0-100 (default: 0, higher = more important)
- `Layer Mode` (Enum) - Replace or Additive (default: Replace)
- `Volume Multiplier` (Float) - Volume 0.0 to 1.0 (default: 1.0)
- `Fade In Time` (Float) - Fade in duration in seconds (default: 1.0)
- `Fade Out Time` (Float) - Fade out duration in seconds (default: 1.0)
- `bLooping` (Boolean) - Loop the music (default: true)
- `bPersist Across Levels` (Boolean) - Keep playing across level transitions (default: false)

**Usage Example:**
```
Event BeginPlay
    ↓
Push Music Layer
    ├─ Layer Name: "Exploration"
    ├─ Music: Exploration_Music
    ├─ Priority: 0
    ├─ Layer Mode: Replace
    ├─ Volume Multiplier: 1.0
    ├─ Fade In Time: 2.0
    └─ Persist Across Levels: true
```

---

### Pop Music Layer

```cpp
Pop Music Layer(WorldContext, LayerName)
```

**Description:** Removes a music layer by name. The layer fades out using its FadeOutTime before being removed.

**Parameters:**
- `World Context Object` (Object) - World context (automatic in Blueprint)
- `Layer Name` (Name) - Name of the layer to remove

**Usage Example:**
```
Event OnCombatEnd
    ↓
Pop Music Layer
    └─ Layer Name: "Combat"
```

---

### Push Music Layer Advanced

```cpp
Push Music Layer Advanced(WorldContext, Layer)
```

**Description:** Push a music layer using a full FERP_MusicLayer struct. Useful when passing layer data from configs or variables.

**Parameters:**
- `World Context Object` (Object) - World context (automatic in Blueprint)
- `Layer` (FERP_MusicLayer) - Complete layer struct with all settings

---

### Clear All Music Layers

```cpp
Clear All Music Layers(WorldContext)
```

**Description:** Immediately stops and removes all active music layers. Use for hard transitions or cleanup.

**Parameters:**
- `World Context Object` (Object) - World context (automatic in Blueprint)

**Usage Example:**
```
Event OnReturnToMainMenu
    ↓
Clear All Music Layers
```

---

## Configuration

### Apply Music Config

```cpp
Apply Music Config(WorldContext, Config, bClearExisting)
```

**Description:** Applies a reusable music configuration asset, which can contain multiple layers.

**Parameters:**
- `World Context Object` (Object) - World context (automatic in Blueprint)
- `Config` (UERP_MusicLayerConfig) - The configuration asset to apply
- `bClear Existing` (Boolean) - Clear all layers before applying config (default: true)

**Usage Example:**
```
Event OnEnterDungeon
    ↓
Apply Music Config
    ├─ Config: MC_DungeonAmbiance
    └─ Clear Existing: true
```

---

## Query Functions

### Is Layer Active

```cpp
Is Layer Active(WorldContext, LayerName) → Boolean
```

**Description:** Checks if a specific layer is currently active in the stack.

**Parameters:**
- `World Context Object` (Object) - World context (automatic in Blueprint)
- `Layer Name` (Name) - Name of the layer to check

**Returns:** True if layer exists in the active stack, false otherwise.

**Usage Example:**
```
Branch (Is Layer Active "Combat")
    True → Continue Combat Logic
    False → Start Combat Music
```

---

### Get Active Layer Names

```cpp
Get Active Layer Names(WorldContext) → Array&lt;Name&gt;
```

**Description:** Returns the names of all currently active music layers.

**Parameters:**
- `World Context Object` (Object) - World context (automatic in Blueprint)

**Returns:** Array of layer names currently in the stack.

**Usage Example:**
```
Get Active Layer Names
    ↓
For Each Loop (Array)
    ↓
Print String (Current Layer Name)
```

---

## Stingers

### Play Stinger

```cpp
Play Stinger(WorldContext, StingerSound, bDuckMusic, DuckVolume, DuckFadeTime, RestoreFadeTime)
```

**Description:** Plays a short musical accent (stinger) without interrupting background music. Optionally ducks (lowers) music volume during playback.

**Parameters:**
- `World Context Object` (Object) - World context (automatic in Blueprint)
- `Stinger Sound` (Sound Base) - The stinger audio to play (usually short, &lt;3 seconds)
- `bDuck Music` (Boolean) - Lower background music during stinger (default: true)
- `Duck Volume` (Float) - Music volume during stinger, 0.0 to 1.0 (default: 0.3)
- `Duck Fade Time` (Float) - Time to fade music down (default: 0.2)
- `Restore Fade Time` (Float) - Time to restore music after stinger (default: 0.5)

**Usage Example:**
```
Event OnAchievementUnlocked
    ↓
Play Stinger
    ├─ Stinger Sound: Achievement_Fanfare
    ├─ Duck Music: true
    ├─ Duck Volume: 0.3
    ├─ Duck Fade Time: 0.2
    └─ Restore Fade Time: 0.5
```

---

### Play Stinger Advanced

```cpp
Play Stinger Advanced(WorldContext, Params)
```

**Description:** Play a stinger using a full FERP_StingerParams struct.

**Parameters:**
- `World Context Object` (Object) - World context (automatic in Blueprint)
- `Params` (FERP_StingerParams) - Complete stinger parameters struct

---

## Dialogue Ducking

### Enable Dialogue Ducking

```cpp
Enable Dialogue Ducking(WorldContext, DialogueComponent, DuckVolume, FadeTime)
```

**Description:** Automatically lowers music volume while dialogue plays, then restores it when dialogue finishes. Binds to the AudioComponent's OnAudioFinished event.

**Parameters:**
- `World Context Object` (Object) - World context (automatic in Blueprint)
- `Dialogue Component` (Audio Component) - The audio component playing dialogue
- `Duck Volume` (Float) - Music volume during dialogue, 0.0 to 1.0 (default: 0.4)
- `Fade Time` (Float) - Fade duration for ducking and restoration (default: 0.3)

**Usage Example:**
```
Event OnDialogueStart
    ↓
Spawn Sound 2D (Dialogue Audio)
    ↓ [Audio Component output]
Enable Dialogue Ducking
    ├─ Dialogue Component: [from above]
    ├─ Duck Volume: 0.4
    └─ Fade Time: 0.3
```

---

## Volume Control

### Set Master Music Volume

```cpp
Set Master Music Volume(WorldContext, Volume, FadeTime)
```

**Description:** Sets the master volume for all music layers. Affects all active and future layers.

**Parameters:**
- `World Context Object` (Object) - World context (automatic in Blueprint)
- `Volume` (Float) - Master volume 0.0 to 1.0
- `Fade Time` (Float) - Fade duration in seconds (default: 0.5)

**Usage Example:**
```
Event OnSettingsChanged
    ↓
Set Master Music Volume
    ├─ Volume: 0.5
    └─ Fade Time: 1.0
```

---

### Get Master Music Volume

```cpp
Get Master Music Volume(WorldContext) → Float
```

**Description:** Returns the current master music volume.

**Parameters:**
- `World Context Object` (Object) - World context (automatic in Blueprint)

**Returns:** Current master volume (0.0 to 1.0).

---

## Data Structures

### FERP_MusicLayer

Defines a single music layer with all its properties.

**Fields:**
- `Layer Name` (Name) - Unique identifier for this layer
- `Music` (Soft Object Ptr&lt;Sound Base&gt;) - Music asset reference (lazy-loaded)
- `Priority` (int32) - Layer priority 0-100 (higher plays first)
- `Layer Mode` (ERP_EMusicLayerMode) - Replace or Additive
- `Volume Multiplier` (float) - Volume 0.0 to 1.0
- `Fade In Time` (float) - Fade in duration in seconds
- `Fade Out Time` (float) - Fade out duration in seconds
- `bLooping` (bool) - Loop the music
- `bPersist Across Levels` (bool) - Keep playing during level transitions

---

### FERP_StingerParams

Parameters for playing a stinger.

**Fields:**
- `Stinger Sound` (Sound Base*) - The stinger audio asset
- `bDuck Music` (bool) - Lower background music during stinger
- `Duck Volume` (float) - Music volume during stinger (0.0-1.0)
- `Duck Fade Time` (float) - Fade time for ducking
- `Restore Fade Time` (float) - Fade time for restoration

---

## Enums

### ERP_EMusicLayerMode

Defines how a layer interacts with others.

**Values:**
- `Replace` - Replaces all lower-priority layers. Only one Replace layer plays at a time.
- `Additive` - Adds on top of the current Replace layer if priority is high enough.

---

## Data Assets

### UERP_MusicLayerConfig

Reusable configuration containing multiple music layers.

**Fields:**
- `Config Name` (String) - Descriptive name for this configuration
- `Layers` (Array&lt;FERP_MusicLayer&gt;) - All layers in this configuration
- `Default Fade Time` (float) - Default fade time for layers without explicit values

**Usage:** Create in Content Browser → Right-click → Miscellaneous → Data Asset → UERP_MusicLayerConfig

---

## Actors & Components

### AERP_MusicZone

Level-placed trigger volume that automatically pushes/pops music layers based on player overlap.

**Properties:**
- `Layer Name` (Name) - Name of the layer to push when entering
- `Music` (Sound Base) - Music to play in this zone
- `Priority` (int32) - Layer priority
- `Layer Mode` (ERP_EMusicLayerMode) - Replace or Additive
- `Volume Multiplier` (float) - Volume 0.0 to 1.0
- `Fade In Time` (float) - Fade in duration
- `Fade Out Time` (float) - Fade out duration
- `bPersist Across Levels` (bool) - Keep layer when leaving zone and changing levels
- `Required Actor Tag` (Name) - Optional tag filter (only trigger for actors with this tag)
- `bTrigger Once` (bool) - Only trigger the first time

**Usage:** Place actor in level, resize box, configure properties. Music plays automatically when player enters.

---

### UERP_MusicZoneComponent

Component version of music zone. Attach to any actor to make it a music trigger.

**Same properties as AERP_MusicZone.**

---

## Subsystem

### UERP_MusicSubsystem

GameInstanceSubsystem that manages all music layers. Automatically created by Unreal Engine - no manual setup needed.

**Lifetime:** Created on game start, persists across levels, destroyed on game shutdown.

**Access:** All UERP_MusicHelper functions internally use this subsystem. Direct access not needed in Blueprint.

---

## Usage Patterns

### Pattern 1: Basic Music Playback

```
Level BeginPlay
    ↓
Push Music Layer
    ├─ Layer Name: "Background"
    ├─ Music: BackgroundMusic
    └─ Priority: 0
```

### Pattern 2: Combat Music System

```
On Enter Combat
    ↓
Push Music Layer
    ├─ Layer Name: "Combat"
    ├─ Priority: 10
    └─ Layer Mode: Replace

On Exit Combat
    ↓
Pop Music Layer
    └─ Layer Name: "Combat"
```

### Pattern 3: Additive Tension Layer

```
Base exploration playing at Priority 0
    ↓
On Enemy Nearby
    ↓
Push Music Layer
    ├─ Layer Name: "Tension"
    ├─ Priority: 5
    ├─ Layer Mode: Additive
    └─ Volume: 0.7
```

---

## Best Practices

1. **Use descriptive layer names** - "Combat", "BossFight", "TensionLayer" are clear
2. **Reserve priority 15+** for special events (bosses, cutscenes)
3. **Always Pop layers** - Prevents memory leaks and layer stack bloat
4. **Use Replace for main music** - Combat, exploration, menu themes
5. **Use Additive for atmospheres** - Tension layers, weather, environmental sounds
6. **Enable persistence sparingly** - Only for music that should span level loads
7. **Set appropriate fade times** - 1-2 seconds for smooth transitions, avoid &gt;5 seconds

---

## Performance Considerations

- System is lightweight: ~10-50 KB memory overhead
- Audio component pooling: automatic, no management needed
- Typical usage: 2-5 active layers (optimal)
- 10+ layers: still fine, consider consolidation if more
- Music assets loaded on-demand via soft references
