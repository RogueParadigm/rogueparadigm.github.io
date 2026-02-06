# API Reference

Complete reference for Elys Music Engine Blueprint functions and components.

---

## Blueprint Function Library: ERP_BPF_MusicHelper

Helper functions for controlling music playback.

### Play Music

```cpp
Play Music(Sound Wave Music, Float Fade In Time, Float Volume)
```

**Description:** Starts playing a music track with optional fade-in.

**Parameters:**
- `Music` (Sound Wave) - The music asset to play
- `Fade In Time` (Float) - Duration of fade-in effect in seconds (default: 0.0)
- `Volume` (Float) - Playback volume 0.0 to 1.0 (default: 1.0)

**Usage Example:**
```
Event BeginPlay
    ↓
Play Music
    ├─ Music: MainTheme_Sound
    ├─ Fade In: 2.0
    └─ Volume: 0.8
```

---

### Stop Music

```cpp
Stop Music(Float Fade Out Time)
```

**Description:** Stops the currently playing music with optional fade-out.

**Parameters:**
- `Fade Out Time` (Float) - Duration of fade-out effect in seconds (default: 0.0)

---

### Set Music Volume

```cpp
Set Music Volume(Float Volume, Float Fade Time)
```

**Description:** Changes the volume of currently playing music.

**Parameters:**
- `Volume` (Float) - Target volume 0.0 to 1.0
- `Fade Time` (Float) - Duration to reach target volume (default: 0.0)

---

### Is Music Playing

```cpp
Is Music Playing() → Boolean
```

**Description:** Checks if music is currently playing.

**Returns:** True if music is playing, false otherwise.

---

## Blueprint Actor: ERP_MusicManager

The central music management system.

### Properties

- **Default Volume** (Float) - Starting volume for music playback
- **Allow Overlap** (Boolean) - Whether multiple tracks can play simultaneously
- **Max Concurrent Tracks** (Integer) - Maximum number of simultaneous music tracks

### Functions

#### Get Current Track

```cpp
Get Current Track() → Sound Wave
```

**Returns:** Reference to the currently playing music track, or null if none.

#### Get Music State

```cpp
Get Music State() → Enum
```

**Returns:** Current state of the music system (Playing, Stopped, Fading, etc.)

---

## Data Structure: ERP_Music_Structure

Defines music track data and playback parameters.

### Fields

- **Music Track** (Sound Wave) - Reference to the audio asset
- **Loop Start** (Float) - Loop start point in seconds
- **Loop End** (Float) - Loop end point in seconds (0 = end of track)
- **Fade In Time** (Float) - Default fade-in duration
- **Fade Out Time** (Float) - Default fade-out duration
- **Volume** (Float) - Default volume level
- **Priority** (Integer) - Playback priority (higher = more important)
- **Track Name** (String) - Descriptive name for debugging

---

## Interface: ERP_MusicStateInterface

Interface for actors that need to communicate with the music system.

### Functions to Implement

#### Get Current Music State

```cpp
Get Current Music State() → Name
```

**Description:** Returns the current music state identifier (e.g., "Combat", "Exploration", "Menu").

**Implementation Example:**
```
Get Current Music State
    ↓
Branch (Is In Combat)
    True → Return "Combat"
    False → Return "Exploration"
```

#### On Music State Changed

```cpp
On Music State Changed(Name New State)
```

**Description:** Called when music state changes. Implement to react to state transitions.

**Parameters:**
- `New State` (Name) - The new music state identifier

---

## MetaSound Source: ERP_MSS_MusicPlayer

Advanced music player with looping and crossfade support.

### Inputs

- **Music** (Audio) - Audio input
- **Loop Start** (Float) - Loop point start in seconds
- **Loop End** (Float) - Loop point end in seconds
- **Volume** (Float) - Output volume multiplier
- **Enabled** (Boolean) - Enable/disable playback

### Outputs

- **Audio** (Audio) - Processed audio output
- **Is Playing** (Boolean) - Current playback state
- **Current Time** (Float) - Current playback position

---

## MetaSound Source: MSS_LoopingMusic

Simple looping music player.

### Inputs

- **Music** (Audio) - Audio input
- **Volume** (Float) - Output volume
- **Loop** (Boolean) - Enable looping

### Outputs

- **Audio** (Audio) - Audio output

---

## Usage Patterns

### Pattern 1: Basic Music Playback

```
Level BeginPlay
    ↓
Get Music Manager
    ↓
Play Music
    ├─ Music: BackgroundMusic
    └─ Volume: 0.5
```

### Pattern 2: State-Based Music

```
On Game State Changed
    ↓
Switch (New State)
    ├─ Combat → Play Combat Music
    ├─ Exploration → Play Ambient Music
    └─ Menu → Stop Music
```

### Pattern 3: Crossfade Between Tracks

```
Crossfade
    ↓
Stop Current Music (Fade Out: 1.0)
    ↓
Delay 0.5 seconds
    ↓
Play New Music (Fade In: 1.0)
```

---

## Best Practices

1. **Always use fade transitions** - Prevents audio clicks and pops
2. **Manage music globally** - Use Game Instance for persistent music
3. **Use compressed formats** - OGG for smaller file sizes
4. **Set appropriate loop points** - For seamless music loops
5. **Implement Music State Interface** - For dynamic music systems
6. **Cache references** - Store Music Manager reference instead of finding repeatedly

---

## Performance Considerations

- Maximum recommended concurrent tracks: 2-3
- Use audio streaming for long tracks (>2 minutes)
- Compressed formats (OGG) use less memory
- Crossfades briefly use 2x memory during transition
