# Getting Started with Elys Music Engine

This guide will walk you through setting up and using the Elys Music Engine plugin in your Unreal Engine project.

## Prerequisites

- Unreal Engine 5.0 or later
- Basic understanding of Blueprints

---

## Installation

### Option 1: As Git Submodule (Recommended)

```bash
cd YourProject/Plugins
git submodule add https://github.com/RogueParadigm/ElysMusicEngine.git
git submodule update --init --recursive
```

### Option 2: Manual Installation

1. Download the plugin
2. Copy to `YourProject/Plugins/ElysMusicEngine`
3. Regenerate project files (right-click .uproject → Generate Visual Studio project files)
4. Compile your project

---

## Basic Setup (5 minutes)

### Step 1: Enable the Plugin

1. Open your project
2. Go to **Edit → Plugins**
3. Search for "Elys Music Engine"
4. Check the **Enabled** checkbox
5. Restart the editor

### Step 2: Prepare Your Music

1. Import your music files (WAV, OGG, MP3, etc.) into the Content Browser
2. Create a folder structure:
   ```
   Content/
   └── Audio/
       └── Music/
           ├── MainTheme.uasset
           ├── CombatMusic.uasset
           └── AmbientMusic.uasset
   ```

---

## Your First Music Implementation (5 minutes)

**No actor placement needed!** The music system is a GameInstanceSubsystem - it's automatically created and always available.

### Play Music in Blueprint

In your Game Mode, Player Controller, or Level Blueprint:

```
Event BeginPlay
    ↓
Push Music Layer
    ├─ Layer Name: "Background"
    ├─ Music: [Your Sound Wave]
    ├─ Priority: 0
    ├─ Layer Mode: Replace
    ├─ Volume Multiplier: 0.5
    ├─ Fade In Time: 2.0
    └─ Persist Across Levels: false
```

**That's it!** Your music is now playing.

---

## Common Use Cases

### Switching Music States

```
On Enter Combat
    ↓
Push Music Layer
    ├─ Layer Name: "Combat"
    ├─ Music: Combat Music
    ├─ Priority: 10           ← Higher priority
    ├─ Layer Mode: Replace    ← Replaces lower priority layers
    └─ Fade In Time: 1.5

On Exit Combat
    ↓
Pop Music Layer
    └─ Layer Name: "Combat"
    ↓
(Previous music automatically returns!)
```

### Additive Atmosphere Layers

```
// Base exploration music playing at Priority 0

On Enemy Nearby
    ↓
Push Music Layer
    ├─ Layer Name: "Tension"
    ├─ Music: Tension Strings
    ├─ Priority: 5
    ├─ Layer Mode: Additive    ← Plays on top!
    └─ Volume Multiplier: 0.7

// Both exploration + tension play together

On Enemy Left
    ↓
Pop Music Layer
    └─ Layer Name: "Tension"
```

### Volume Control

```
Set Master Music Volume
    ├─ Volume: 0.3
    └─ Fade Time: 2.0
```

---

## Music Zones (Easiest Method!)

Place music triggers in your level:

1. **Add Actor** → Search "ERP_MusicZone"
2. Resize the box to cover the area
3. Configure in Details panel:
   - **Layer Name**: "ZoneMusic"
   - **Music**: Select your music asset
   - **Priority**: 5
   - **Layer Mode**: Replace

Music automatically plays when player enters, and stops when they leave!

---

## Using Stingers

Play short musical accents without interrupting music:

```
Event OnAchievementUnlocked
    ↓
Play Stinger
    ├─ Stinger Sound: Achievement Fanfare
    ├─ Duck Music: true       ← Lowers background music
    ├─ Duck Volume: 0.3       ← Music at 30% during stinger
    └─ Restore Fade Time: 0.5
```

---

## Dialogue Ducking

Automatically lower music during dialogue:

```
On Dialogue Start
    ↓
Spawn Sound 2D (Dialogue Audio)
    ↓ [Audio Component output]
Enable Dialogue Ducking
    ├─ Dialogue Component: [from above]
    ├─ Duck Volume: 0.4
    └─ Fade Time: 0.3
    ↓
(Music auto-restores when dialogue finishes!)
```

---

## Troubleshooting

### Music doesn't play
- Check that your music asset is valid
- Verify the plugin is enabled (Edit → Plugins)
- Use console command `music.debug` to see active layers
- Ensure you're not pushing a layer name that already exists

### Music cuts off abruptly
- Increase **Fade Out Time** parameter
- Check if layer is being popped unexpectedly

### No looping
- Ensure **bLooping** parameter is set to **true**
- Check your audio asset import settings

### Music doesn't persist between levels
- Set **Persist Across Levels** to **true** when pushing the layer

---

## Console Commands

Open console (`~` key) for debugging:

| Command | Purpose |
|---------|---------|
| `music.debug` | Show all active layers with priorities |
| `music.push TestLayer 10` | Test push a layer (priority 10) |
| `music.pop TestLayer` | Test pop a layer |
| `music.clear` | Stop all music immediately |

---

## Key Concepts

### Layers
- Music is organized in **layers** (e.g., "Combat", "Exploration", "Tension")
- Each layer has a unique **name** and **priority**
- Push layers to start music, pop layers to stop

### Priority System
- Higher priority = more important
- Priority 0: Base music (exploration, ambient)
- Priority 10: Combat music
- Priority 15+: Boss fights, cutscenes

### Layer Modes
- **Replace**: Stops all lower-priority layers (use for main music)
- **Additive**: Plays on top of current music (use for atmosphere)

### Subsystem
- Music system is a **GameInstanceSubsystem**
- Automatically created on game start
- No manual setup or actor placement needed
- Persists across level transitions

---

## Next Steps

- Read the [Quick Start Guide](QuickStart.md) for a combat music tutorial
- Check out [Examples](Examples.md) for common patterns
- See [API Reference](API-Reference.md) for all available functions
- Review [Architecture](Architecture.md) to understand how it works

---

## Need Help?

- Review example content in `Content/` folder
- Use `music.debug` console command
- Check [Troubleshooting](Troubleshooting.md) for detailed solutions
- Open an issue on GitHub
