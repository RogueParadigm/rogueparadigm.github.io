# Getting Started with Elys Music Engine

This guide will walk you through setting up and using the Elys Music Engine plugin in your Unreal Engine project.

## Prerequisites

- Unreal Engine 5.0 or later
- MetaSound plugin enabled (default in UE5)
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

### Step 2: Add Music Manager to Your Level

**Method A: Level Actor**
1. Open your level
2. Drag **ERP_MusicManager** into the level from Content Browser
3. Place it anywhere (it doesn't have a visible mesh)

**Method B: Game Instance (Persistent)**
1. Create or open your Game Instance Blueprint
2. In the **BeginPlay** event, spawn **ERP_MusicManager**
3. Store the reference in a variable

---

## Your First Music Implementation (15 minutes)

### Step 1: Prepare Your Music

1. Import your music files (WAV, OGG, etc.) into the Content Browser
2. Create a folder structure:
   ```
   Content/
   └── Audio/
       └── Music/
           ├── MainTheme.uasset
           ├── CombatMusic.uasset
           └── AmbientMusic.uasset
   ```

### Step 2: Create a Music Structure

1. Right-click in Content Browser → **Blueprint → Structure**
2. Name it `MusicData`
3. Add fields based on **ERP_Music_Structure**:
   - **MusicTrack** (Sound Wave reference)
   - **LoopStart** (Float - seconds)
   - **LoopEnd** (Float - seconds)
   - **FadeInTime** (Float - seconds)
   - **FadeOutTime** (Float - seconds)

### Step 3: Play Music in Blueprint

In your Game Mode, Player Controller, or Level Blueprint:

```
Event BeginPlay
    ↓
Get Music Manager
    ↓
Play Music (ERP_BPF_MusicHelper)
    ├─ Music: [Your Sound Wave]
    ├─ Fade In: 2.0
    └─ Volume: 0.5
```

---

## Common Use Cases

### Switching Music States

```
On Enter Combat
    ↓
Stop Current Music (Fade Out: 1.0)
    ↓
Wait 1 second
    ↓
Play Combat Music (Fade In: 0.5)
```

### Looping Background Music

1. Use **MSS_LoopingMusic** MetaSound Source
2. Set loop points in your music structure
3. The system handles seamless looping automatically

### Volume Control

```
Get Music Manager
    ↓
Set Volume
    ├─ Volume: 0.3
    └─ Fade Time: 2.0
```

---

## Troubleshooting

### Music doesn't play
- Ensure Music Manager is spawned and active
- Check that your sound asset is valid
- Verify MetaSound plugin is enabled

### No looping or cuts off
- Check loop points in your music structure
- Use MSS_LoopingMusic instead of regular sound source
- Ensure your audio file supports seeking

### Crackling or performance issues
- Reduce simultaneous music tracks
- Use compressed audio formats (OGG)
- Check audio buffer settings in Project Settings

---

## Next Steps

- Read the [API Reference](API-Reference.md) for detailed function documentation
- Check out [Examples](Examples.md) for advanced patterns

---

## Need Help?

- Review example content in `Content/` folder
- Open an issue on GitHub
