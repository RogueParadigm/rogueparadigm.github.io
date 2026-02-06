---
id: setup-guide
title: Setup Guide
sidebar_position: 3
---

# Setup Guide - First Music in 5 Minutes

Configure ElysMusicEngine and play your first music.

---

## Prerequisites

- ✅ Plugin installed in your project (from FAB or manual ZIP)
- ✅ Unreal Engine 5.0 or later
- ✅ Music files (WAV, MP3, OGG, or Sound Cues)

---

## Step 1: Enable Plugin

1. Open your project in Unreal Editor
2. **Edit → Plugins**
3. Search **"Elys Music Engine"**
4. ✅ Check **Enabled**
5. Click **Restart Now**

💡 **Note:** If already enabled, skip to Step 2.

---

## Step 2: Import Music

### Quick Test Music

1. **Content Browser** → Right-click
2. **Import to /Game/...**
3. Select your music file (`.wav`, `.mp3`, `.ogg`)
4. Import settings → OK

💡 **Tip:** Use **looping** music for best results.

---

## Step 3: Test Basic Music

### Level Blueprint Setup

1. Open your level (or create test map)
2. **Blueprints → Open Level Blueprint**
3. Add this simple setup:

```
┌─────────────────────────────────┐
│  Event BeginPlay                │
└─────────────────────────────────┘
          │
          ▼
┌─────────────────────────────────┐
│  Push Music Layer               │
│  ├─ Layer Name: "TestMusic"     │
│  ├─ Music: [Your Music Asset]   │
│  ├─ Priority: 0                 │
│  ├─ Layer Mode: Replace         │
│  ├─ Volume: 1.0                 │
│  ├─ Fade In: 1.0                │
│  └─ Persist Across Levels: true │
└─────────────────────────────────┘
```

### Blueprint Nodes

1. **Event BeginPlay** (already there)
2. Drag off execute → Search **"Push Music Layer"**
3. **Fill in:**
   - Layer Name: `"TestMusic"`
   - Music: Select your imported music
   - Priority: `0`
   - Layer Mode: `Replace`
   - Volume: `1.0`
   - Fade In Time: `1.0`
   - Persist Across Levels: ✅ (if you want)

### Test!

1. **Click Play** ▶️
2. **Music should start playing!** 🎵

---

## Step 5: Test Stop Music

### Add Stop Logic

```
┌─────────────────────────────────┐
│  Event (e.g., Key Press 'M')    │
└─────────────────────────────────┘
          │
          ▼
┌─────────────────────────────────┐
│  Pop Music Layer                │
│  └─ Layer Name: "TestMusic"     │
└─────────────────────────────────┘
```

**Or clear all:**

```
┌─────────────────────────────────┐
│  Event (e.g., Key Press 'N')    │
└─────────────────────────────────┘
          │
          ▼
┌─────────────────────────────────┐
│  Clear All Music Layers         │
└─────────────────────────────────┘
```

---

## ✅ Verification

### Music Playing?

1. Press **Play** ▶️
2. You should hear your music
3. Open console (`~`) → Type: `music.debug`
4. Should show: `[TestMusic] Priority: 0 (PLAYING)`

### Not Working?

Check **[Troubleshooting](#troubleshooting)** below.

---

## Step 4: Next Steps

Now that basic music works, try:

### 🎮 Combat Music (5 min)

See **[Quick Start Guide](QuickStart.md)** for a complete combat music tutorial.

### 📦 Music Zones (2 min)

1. **Add Actor** → `ERP_MusicZone`
2. Resize box to cover area
3. Configure:
   - Layer Name: `"ZoneMusic"`
   - Music: Your music asset
   - Priority: `5`
4. Walk into zone → Music changes!

### 🎺 Stingers (1 min)

```blueprint
Event OnPlayerAction
  ↓
Play Stinger
  - Stinger Sound: [Achievement Sound]
  - Duck Music: true
  - Duck Volume: 0.3
```

---

## Common Setups

### Menu Music

**Level Blueprint (Main Menu level):**

```blueprint
Event BeginPlay
  ↓
Push Music Layer
  - Layer Name: "MenuMusic"
  - Music: Menu_Theme
  - Priority: 0
  - Layer Mode: Replace
  - Persist Across Levels: true  ← Keep during load
```

### Exploration Music

**GameMode BeginPlay or Level Blueprint:**

```blueprint
Event BeginPlay
  ↓
Push Music Layer
  - Layer Name: "Exploration"
  - Music: Exploration_Music
  - Priority: 0
  - Layer Mode: Replace
  - Persist Across Levels: true  ← Continue between areas
```

### Day/Night Cycle

```blueprint
// Day starts
Push Music Layer ("DayMusic", Priority: 0, Replace)

// Night starts
Pop Music Layer ("DayMusic")
Push Music Layer ("NightMusic", Priority: 0, Replace)
```

---

## Troubleshooting

### Music Not Playing

**Check 1: Plugin Enabled?**
- Edit → Plugins → Search "Elys Music Engine" → Enabled?

**Check 2: Music Asset Valid?**
- Verify music imported correctly
- Try playing it directly (double-click in Content Browser)

**Check 3: Volume?**
- Check Layer Volume parameter (should be 1.0)
- Check Master Volume: `music.debug` console command

**Check 4: Already Playing?**
- Use `music.debug` console command
- If layer already active, Push is ignored

### Music Abruptly Stops

**Increase Fade Times:**
- Set **Fade Out Time** to 1.5 or 2.0 seconds
- Set **Fade In Time** to match

### Music Doesn't Persist Between Levels

**Enable Persistence:**
- Set **Persist Across Levels: true** when pushing layer

### Zone Not Triggering

**Check Collision:**
1. Select `ERP_MusicZone` actor
2. Details → Collision → Enabled?
3. Overlap events enabled?

**Check Player:**
- Does player have collision?
- Is player actually entering the volume?

**Check Tag (if set):**
- If **Required Actor Tag** is set, player must have that tag

---

## Console Commands

Open console (`~` key) and type:

| Command | Purpose |
|---------|---------|
| `music.debug` | Show all active layers |
| `music.push TestLayer 10` | Test push a layer |
| `music.pop TestLayer` | Test pop a layer |
| `music.clear` | Stop all music immediately |

---

## Configuration Assets (Optional)

### Create Reusable Music Config

Perfect for complex setups (dungeons, boss rooms).

1. **Content Browser** → Right-click
2. **Miscellaneous → Data Asset**
3. Select **`ERP_MusicLayerConfig`**
4. Name: `MC_DungeonMusic` (MC = Music Config)

### Configure Layers

Open the asset:

```
Config Name: "Dungeon Music Setup"

Layers:
  [0] Dungeon Base
      Layer Name: "DungeonBase"
      Music: Dungeon_Ambiance
      Priority: 0
      Mode: Replace
      
  [1] Dungeon Wind
      Layer Name: "DungeonWind"
      Music: Wind_Layer
      Priority: 2
      Mode: Additive
      Volume: 0.5
```

### Use in Blueprint

```blueprint
Event OnEnterDungeon
  ↓
Apply Music Config
  - Config: MC_DungeonMusic
  - Clear Existing: true
```

---

## Performance Notes

### Audio Component Pooling

The subsystem automatically pools audio components:
- **No manual management needed**
- Components reused when music stops
- Minimal memory overhead

### Typical Usage

- **2-4 layers active:** Very efficient
- **10+ layers:** Still fine, but consider consolidation

### Persistence Cost

Enabling **Persist Across Levels** has minimal cost:
- Music marked as persistent
- Continues during level load
- No additional streaming

---

## Next Steps

✅ **Music working?** Great! Now learn:

1. **[Quick Start](QuickStart.md)** - Combat music tutorial
2. **[Quick Reference](Quick-Reference.md)** - Cheat sheet (print it!)
3. **[Examples](Examples.md)** - Copy working patterns
4. **[Architecture](Architecture.md)** - Understand the system

---

## Still Need Help?

- **[Troubleshooting](Troubleshooting.md)** - Detailed solutions
- **[API Reference](API-Reference.md)** - All Blueprint functions
- **GitHub Issues** - Report bugs or ask questions

🎵 **Enjoy dynamic music in your game!**
