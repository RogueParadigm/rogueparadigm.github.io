# ERP Music Engine - Quick Start Guide

## 🎯 What is this?

A layer-based music system for Unreal Engine with:
- **Replace layers**: Combat replaces exploration music
- **Additive layers**: Tension layers add on top of base music  
- **Stingers**: Short musical accents (achievements, discoveries)
- **Dialogue ducking**: Auto-lowers music during dialogues
- **Music zones**: Drop volumes in your level - music changes automatically
- **Configurations**: Reusable presets (menu music, dungeon setup, etc.)
- **Persistence**: Music continues across level transitions

---

## 🚀 Quick Setup (5 minutes)

### 1. Enable the Plugin
- Edit → Plugins
- Search "Elys Music Engine"
- Check enabled → Restart editor

### 2. Import Your Music
- Import your music files (WAV, MP3, OGG)
- Or use Sound Cues for more control

### 3. First Test (Blueprint)

```blueprint
Event BeginPlay
  ↓
Push Music Layer
  - Layer Name: "Menu"
  - Music: [Your Music Asset]
  - Priority: 0
  - Layer Mode: Replace
  - Volume: 1.0
  - Fade In: 1.0
```

**Done!** Your music is playing.

---

## 🎮 Common Use Cases

### Combat Music System

```blueprint
// When enemy spotted
Event OnEnemySpotted
  ↓
Push Music Layer
  - Layer Name: "Combat"
  - Music: CombatMusic_Asset
  - Priority: 10           ← Higher priority
  - Layer Mode: Replace    ← Replaces exploration
  - Fade In: 1.5

// When combat ends
Event OnAllEnemiesDead
  ↓
Pop Music Layer
  - Layer Name: "Combat"
  ↓
// Exploration music automatically returns!
```

### Music Zones (Easiest!)

1. **Place Actor:**
   - Add Actor → ERP Music Zone
   - Position and resize box

2. **Configure:**
   - Layer Name: "Dungeon"
   - Music: Dungeon_Music
   - Priority: 5
   - Layer Mode: Replace

3. **Done!**  
   When player enters → Dungeon music  
   When player exits → Previous music returns

### Stingers (Musical Accents)

```blueprint
Event OnTreasureFound
  ↓
Play Stinger
  - Stinger Sound: Achievement_Fanfare
  - Duck Music: true       ← Lowers background music
  - Duck Volume: 0.3       ← 30% volume during stinger
  - Restore Time: 0.5      ← Fades back after
```

### Dialogue Ducking

```blueprint
Event OnDialogueStart
  ↓
Spawn Sound 2D (dialogue audio)
  ↓ (Audio Component output)
Enable Dialogue Ducking
  - Dialogue Component: [from above]
  - Duck Volume: 0.4       ← Music at 40%
  - Fade Time: 0.3
  ↓
// Music auto-restores when dialogue finishes!
```

### Additive Layers (Tension)

```blueprint
// Base exploration music playing (Priority 0)

Event OnEnemyNearby
  ↓
Push Music Layer
  - Layer Name: "Tension"
  - Music: Tension_Strings
  - Priority: 5
  - Layer Mode: Additive    ← Adds on top!
  - Volume: 0.7

// Now BOTH exploration + tension play together

Event OnEnemyLeft
  ↓
Pop Music Layer
  - Layer Name: "Tension"
```

---

## 📦 Reusable Configurations

### Create a Music Config Asset

1. **Content Browser** → Right-click
2. **Miscellaneous** → Data Asset
3. **Choose:** `ERP_MusicLayerConfig`
4. **Name:** `MC_DungeonAmbiance`

### Configure Multiple Layers

Open the asset:
```
Config Name: "Dungeon Ambiance"

Layers:
  [0] Base Ambiance
      - Layer Name: "DungeonBase"
      - Music: Dungeon_Base_Loop
      - Priority: 0
      - Mode: Replace
      
  [1] Wind Layer
      - Layer Name: "DungeonWind"
      - Music: Dungeon_Wind_Layer
      - Priority: 2
      - Mode: Additive
      - Volume: 0.6
```

### Use the Config

```blueprint
Event BeginPlay
  ↓
Apply Music Config
  - Config: MC_DungeonAmbiance
  - Clear Existing: true
  ↓
// All layers from config are now active!
```

---

## 🎚️ Priority System

Higher number = more important

```
Boss Music     [Priority 15] ← Always on top
Combat Music   [Priority 10]
Special Zone   [Priority 5]
Exploration    [Priority 0]  ← Base layer
```

### Replace vs Additive with Priorities

**Replace Mode:**
- Stops all LOWER priority layers
- Only ONE replace layer plays at a time

**Additive Mode:**  
- Plays on top of the current replace layer
- Multiple additive layers can play together
- Only plays if priority >= current replace layer

**Example:**
```
Active Layers:
  Exploration (Replace, Priority 0) ← PLAYING
  + Tension (Additive, Priority 5)  ← PLAYING (adds on top)
  + Rain (Additive, Priority 3)     ← PLAYING (adds on top)

Then combat starts:
  Combat (Replace, Priority 10)     ← PLAYING (replaces all)
  Tension (Priority 5)              ← STOPS (lower than combat)
  Rain (Priority 3)                 ← STOPS (lower than combat)
```

---

## 🔊 Volume Control

### Master Volume

```blueprint
Set Master Music Volume
  - Volume: 0.5    ← 50%
  - Fade Time: 1.0
```

### Per-Layer Volume

Set when pushing:
```blueprint
Push Music Layer
  - Volume Multiplier: 0.8  ← 80% of master
```

---

## 💾 Persistence Across Levels

Enable on any layer:
```blueprint
Push Music Layer
  - Persist Across Levels: true
```

The music **continues playing** when you load a new level!

---

## 🐛 Debug Commands

Open console (`~` key):

```
music.push LayerName 10          # Test push a layer
music.pop LayerName              # Test pop a layer
music.debug                       # Show active layers
music.clear                       # Stop all music
```

---

## 🎯 Best Practices

### Do's ✅
- Use **priority 0-10** for normal gameplay
- Reserve **priority 15+** for special events (boss, cutscenes)
- Use **Replace** for main music changes
- Use **Additive** for subtle atmosphere layers
- Name layers clearly: "Combat", "BossFight", "TensionLayer"
- Always **Pop** layers when done (cleanup)

### Don'ts ❌
- Don't push the same layer name twice (it's ignored)
- Don't forget to pop layers (memory leak)
- Don't use Replace mode for subtle layers
- Don't set very long fade times (>5s feels unresponsive)

---

## 📝 Example: Full Combat System

```blueprint
// ===== EXPLORATION (Base) =====
Event BeginPlay
  ↓
Push Music Layer
  - Layer Name: "Exploration"
  - Music: Exploration_Music
  - Priority: 0
  - Layer Mode: Replace
  - Persist Across Levels: true

// ===== ENEMY NEARBY (Additive Tension) =====
Event OnEnemyInRange
  ↓
Push Music Layer
  - Layer Name: "Tension"
  - Music: Tension_Strings
  - Priority: 5
  - Layer Mode: Additive
  - Volume: 0.6

// ===== COMBAT START (Replace) =====
Event OnCombatStart
  ↓
Pop Music Layer ("Tension")  ← Remove tension
  ↓
Push Music Layer
  - Layer Name: "Combat"
  - Music: Combat_Music
  - Priority: 10
  - Layer Mode: Replace
  - Fade In: 2.0

// ===== COMBAT END =====
Event OnCombatEnd
  ↓
Pop Music Layer ("Combat")
  ↓
// Exploration music auto-returns!
```

---

## 🆘 Troubleshooting

**Music not playing?**
- Check the layer name isn't already active
- Verify music asset is loaded
- Check master volume isn't 0
- Use `music.debug` console command

**Music not fading?**
- Fade times are in the layer struct
- Check FadeInTime / FadeOutTime values

**Layers not layering?**
- Check Layer Mode (Replace vs Additive)
- Verify priorities are correct
- Use `music.debug` to see active layers

**Music stops between levels?**
- Set `Persist Across Levels: true` on the layer

---

## 🎓 Next Steps

1. Create a few music configs for different areas
2. Place music zones in your levels
3. Implement combat music system
4. Add stingers for player achievements
5. Configure dialogue ducking

**Questions? Check the full documentation or examples!**
