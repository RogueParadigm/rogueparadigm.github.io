---
id: how-it-works
title: How It Works
sidebar_position: 5
---

# How ElysMusicEngine Works - Complete Guide

Clear explanations of every core concept with practical examples.

---

## 🎯 The Big Picture

**One simple rule:** The system plays the **highest priority** layer that is **Replace** mode, plus any **Additive** layers with priority ≥ that Replace layer.

```
Think of it like a radio with background effects:
• Replace = Changing the radio station
• Additive = Adding rain/wind sounds on top
• Priority = Which station gets to play
```

---

## 📚 Core Concepts

### What is a Layer?

A **layer** is a single music track with settings:

```cpp
Layer "Exploration"
  ├─ Music: Exploration_Music.wav
  ├─ Priority: 0 (base level)
  ├─ Mode: Replace (main music)
  ├─ Volume: 1.0 (100%)
  ├─ Fade In: 1.0 seconds
  ├─ Fade Out: 1.0 seconds
  ├─ Looping: true
  └─ Persist: true (keeps playing between levels)
```

**Key point:** Each layer has a **unique name** that you use to add/remove it.

---

## ➕ Adding Layers (Push)

### What Happens When You Push a Layer?

```blueprint
Push Music Layer ("Combat", Priority: 10, Replace)
```

**Step-by-step:**

1. **Check if exists** - Layer name "Combat" already active?
   - YES → Ignored (already playing)
   - NO → Continue

2. **Add to stack** - Add "Combat" to the internal layer list

3. **Sort by priority** - Highest priority first:
   ```
   [Combat: 10]
   [Exploration: 0]
   ```

4. **Determine what plays**:
   - Find highest **Replace** layer = Combat (10)
   - Play Combat
   - Stop Exploration (lower Replace)

5. **Crossfade** - Fade out old, fade in new (smooth transition)

### Important Rules

✅ **Same name twice?** → Second Push ignored  
✅ **No priority conflict?** → Both can coexist if different modes  
✅ **Automatic cleanup?** → Yes, when you Pop a layer  

---

## ⚖️ Priority System Explained

### How Priorities Work

**Rule:** Higher number = more important = plays over lower numbers.

```
Priority Scale (0-100):
┌─────────────────────────────────────┐
│ 15+ : Boss, Cutscenes (critical)   │ 🔴
│ 10-14: Combat, Action (important)  │ 🟠
│ 5-9  : Zones, Events (medium)      │ 🟡
│ 0-4  : Exploration, Menu (base)    │ 🟢
└─────────────────────────────────────┘
```

### Example 1: Simple Override

```
Stack:
  Exploration [0] Replace → PLAYING

Push Combat [10] Replace:
  Combat [10] Replace     → PLAYING ✅
  Exploration [0] Replace → STOPPED (lower priority)

Result: Only Combat plays
```

### Example 2: Multiple Layers

```
Stack:
  Exploration [0] Replace → PLAYING

Push Tension [5] Additive:
  Tension [5] Additive    → PLAYING ✅ (adds on top)
  Exploration [0] Replace → PLAYING ✅ (base music)

Result: Both play together
```

### Example 3: Complex Scenario

```
Initial:
  Exploration [0] Replace → PLAYING

Push Tension [5] Additive:
  Tension [5] Additive    → PLAYING
  Exploration [0] Replace → PLAYING

Push Combat [10] Replace:
  Combat [10] Replace     → PLAYING ✅ (highest Replace)
  Tension [5] Additive    → STOPPED (5 &lt; 10)
  Exploration [0] Replace → STOPPED (lower Replace)

Result: Only Combat plays
```

**Why did Tension stop?** Because its priority (5) is **less than** the new Replace layer (10).

### Priority Rule Summary

| Situation | Result |
|-----------|--------|
| **Replace vs Replace** | Only highest priority plays |
| **Additive + Replace** | Additive plays if priority ≥ Replace |
| **Multiple Additive** | All with priority ≥ Replace play |
| **Same priority** | Both can play (if different modes) |
| **Push high priority Replace** | Lower Additive layers STOP |
| **Pop high priority Replace** | Lower Additive layers RESTART |

---

## 🔄 Replace vs Additive

### Replace Mode (Main Music)

**Use for:** Changing the main music completely

**Behavior:**
- Stops ALL **lower priority** Replace layers
- Stops **Additive** layers with priority &lt; this Replace
- Only ONE Replace layer plays at a time

**Examples:**
- Exploration → Combat (replace exploration)
- Combat → Boss Fight (replace combat)
- Menu → Gameplay (replace menu)

```
Before: Exploration [0] playing
Push:   Combat [10] Replace
After:  Combat [10] playing (Exploration stopped)
```

### Additive Mode (Layer On Top)

**Use for:** Adding atmosphere/effects without changing main music

**Behavior:**
- **Does NOT stop** the Replace layer
- Plays **on top** of current music
- Multiple Additive layers can play together
- **CRITICAL RULE:** Only plays if **priority ≥ current Replace layer**
  - If Replace priority goes higher than Additive → Additive stops
  - If Replace priority goes lower → Additive restarts automatically

**Examples:**
- Add tension strings during stealth
- Add wind sounds in outdoor areas
- Add crowd noise in cities

```
Before: Exploration [0] playing
Push:   Wind [3] Additive
After:  Exploration [0] + Wind [3] both playing
```

### Additive Priority Rules in Detail

**Example: Tension Layer (Priority 5)**

```
1. Push Exploration [0] Replace → Exploration plays

2. Push Tension [5] Additive → Tension plays (5 ≥ 0) ✅
   Result: Exploration + Tension

3. Push Combat [10] Replace → Combat plays, Tension STOPS (5 < 10) ❌
   Result: Only Combat

4. Pop Combat → Exploration returns, Tension RESTARTS (5 ≥ 0) ✅
   Result: Exploration + Tension again!
```

**Key insight:** Additive layers automatically stop/start based on current Replace priority!

### Visual Comparison

```
REPLACE MODE:
════════════════════════════════════════
Exploration [0] 🎵────────────────────
                     ↓ Push Combat [10]
Combat [10]          🎵───────────────→
                     (Exploration stops)

ADDITIVE MODE:
════════════════════════════════════════
Exploration [0] 🎵────────────────────
                     ↓ Push Wind [3]
Exploration [0] 🎵─────────────────────
Wind [3]             🎵───────────────→
                     (Both play together)
```

---

## ➖ Removing Layers (Pop)

### What Happens When You Pop a Layer?

```blueprint
Pop Music Layer ("Combat")
```

**Step-by-step:**

1. **Find layer** - Search for "Combat" in active layers
   - NOT FOUND → Warning logged, nothing happens
   - FOUND → Continue

2. **Fade out** - Combat fades out over FadeOutTime (e.g., 1 second)

3. **Remove from stack** - After fade completes, remove "Combat"

4. **Re-evaluate** - What should play now?
   ```
   Stack after Pop:
   [Exploration: 0]
   
   New highest Replace = Exploration
   → Fade in Exploration
   ```

5. **Automatic return** - Previous music automatically resumes!

### Important: Automatic Music Return

**This is powerful:** You don't manually "restore" old music.

```
1. Exploration playing
2. Push Combat → Combat plays
3. Pop Combat → Exploration automatically returns!
```

---

## 💾 Persistence Between Levels

### What is Persistence?

**Persistence** = Music keeps playing when you change levels/maps.

### When to Use Persistence

✅ **Menu music** - Continues during loading  
✅ **World ambiance** - Seamless between areas  
✅ **Background music** - Never interrupted  

❌ **Combat music** - Specific to that fight  
❌ **Zone music** - Specific to that location  
❌ **Event music** - Tied to a specific moment  

### How to Enable

```blueprint
Push Music Layer
  - Layer Name: "Menu"
  - Music: MenuTheme
  - Priority: 0
  - Persist Across Levels: ✅ TRUE  ← Enable here
```

### What Happens During Level Load?

**Without Persistence:**
```
Level 1:           Level Load:       Level 2:
Music playing  →   Music STOPS   →   Silence (must restart)
```

**With Persistence:**
```
Level 1:           Level Load:       Level 2:
Music playing  →   Music CONTINUES → Still playing!
```

### Technical Details

The **Subsystem** (UERP_MusicSubsystem) is a **GameInstanceSubsystem**:
- Lives for entire game session
- Survives level transitions
- Keeps track of all active layers

Persistent audio components marked with:
```cpp
AudioComponent-&gt;bIsMusic = true
```
This tells Unreal's audio system: "Don't stop this during level loads!"

### Example: Menu to Gameplay

```blueprint
// Main Menu Level
Event BeginPlay
  ↓
Push Music Layer
  - Layer Name: "MenuMusic"
  - Priority: 0
  - Persist: TRUE
  ↓
// Player clicks "Play"
Open Level "Gameplay"
  ↓
// Gameplay Level loads
// MenuMusic STILL PLAYING
  ↓
// Now switch to gameplay music
Pop Music Layer ("MenuMusic")
Push Music Layer
  - Layer Name: "Exploration"
  - Priority: 0
  - Persist: TRUE
```

---

## 🎮 Common Scenarios Explained

### Scenario 1: Combat System

```
🟢 Exploration [0] Replace, Persist=true
  → Player wanders, exploring

🔴 Enemy spotted!
Push "Combat" [10] Replace, Persist=false
  → Combat music plays (Exploration stops)

🔴 Combat ends
Pop "Combat"
  → Exploration automatically returns!
```

**Why no Persist on Combat?** Combat is temporary, specific to that fight.

### Scenario 2: Zone Music

```
🟢 World Music [0] Replace, Persist=true
  → Background music

🟡 Enter Dungeon Zone
Push "Dungeon" [5] Replace, Persist=false
  → Dungeon music plays (World stops)

🟡 Exit Dungeon
Pop "Dungeon"
  → World music returns!
```

**How?** Use `AERP_MusicZone` actor - automatic Push on enter, Pop on exit.

### Scenario 3: Boss Fight with Phases

```
🟢 Exploration [0] playing

🔴 Boss room entered
Push "BossPhase1" [15] Replace
  → Boss phase 1 music

🔴 Boss health &lt; 50%
Pop "BossPhase1"
Push "BossPhase2" [15] Replace
  → Boss phase 2 music (more intense)

🔴 Boss defeated
Pop "BossPhase2"
  → Exploration returns!
```

### Scenario 4: Additive Tension

```
🟢 Exploration [0] Replace playing

🟡 Enemy nearby (not in combat yet)
Push "Tension" [5] Additive
  → Exploration + Tension both play (suspenseful)

🟡 Enemy lost
Pop "Tension"
  → Back to just Exploration

🔴 Or if enemy spotted:
Push "Combat" [10] Replace
  → Combat plays (Tension AND Exploration stop)
```

### Scenario 5: Multiple Zones Nested

```
🟢 World [0] playing

🟡 Enter Forest zone
Push "Forest" [3] Replace
  → Forest music (World stops)

🟡 Enter Cave inside Forest
Push "Cave" [5] Replace
  → Cave music (Forest stops, higher priority)

🟡 Exit Cave
Pop "Cave"
  → Forest music returns!

🟡 Exit Forest
Pop "Forest"
  → World music returns!
```

**Stack at each step:**
```
1. [World: 0]
2. [Forest: 3, World: 0]        → Forest plays
3. [Cave: 5, Forest: 3, World: 0] → Cave plays (highest)
4. [Forest: 3, World: 0]        → Forest plays
5. [World: 0]                   → World plays
```

---

## 🔊 Volume & Ducking

### Master Volume

Affects **all music layers** globally:

```blueprint
Set Master Music Volume
  - Volume: 0.5  (50%)
  - Fade Time: 1.0 seconds
```

All playing layers fade to 50% volume.

### Per-Layer Volume

Set when pushing:

```blueprint
Push Music Layer
  - Volume Multiplier: 0.8  (80% of master)
```

**Final volume = Layer Volume × Master Volume**

Example:
- Master: 1.0 (100%)
- Layer: 0.8 (80%)
- **Result:** 0.8 × 1.0 = 0.8 (80%)

### Ducking (Lowering Music)

**Use case:** Lower music during dialogue or stingers.

**Automatic ducking:**
```blueprint
// Dialogue
Spawn Sound 2D (DialogueAudio)
  ↓ (AudioComponent output)
Enable Dialogue Ducking
  - Component: [from above]
  - Duck Volume: 0.4  (music at 40%)
  ↓
// Dialogue plays...
// When finished, music auto-restores to 100%
```

**Stinger ducking:**
```blueprint
Play Stinger
  - Stinger Sound: Fanfare
  - Duck Music: true
  - Duck Volume: 0.3  (music at 30% during stinger)
  ↓
// Stinger plays, music ducked
// When stinger ends, music auto-restores
```

---

## ⚠️ Common Mistakes & Solutions

### Mistake 1: Layer Won't Play

**Problem:** Push a layer but hear nothing.

**Cause:** Layer name already exists (second Push ignored).

**Solution:**
```blueprint
// Before pushing, check:
Branch: Is Layer Active("Combat")
  If TRUE: Already playing (don't push again)
  If FALSE: Push layer
```

### Mistake 2: Wrong Music Playing

**Problem:** Expected Combat but Exploration plays.

**Cause:** Priority too low.

**Solution:**
- Combat priority: 10
- Exploration priority: 0
- Combat **must** be higher to override!

### Mistake 3: Music Doesn't Stop

**Problem:** Pop doesn't stop the music.

**Cause:** Layer name mismatch (typo, case-sensitive).

**Solution:**
```blueprint
Push: "Combat"  ← Must match exactly
Pop:  "Combat"  ← Same name, same case
```

### Mistake 4: Music Stops Between Levels

**Problem:** Music stops when loading new level.

**Cause:** Persist Across Levels = false.

**Solution:**
```blueprint
Push Music Layer
  - Persist Across Levels: ✅ TRUE
```

### Mistake 5: Additive Layer Doesn't Add

**Problem:** Pushed Additive but it doesn't play.

**Cause:** Additive priority &lt; current Replace priority.

**Solution:**
```
Replace layer: Combat [10]
Additive layer: Tension [5]  ← 5 &lt; 10, won't play!

Fix: Tension [12] → Now plays (12 &gt;= 10)
```

---

## 🎓 Best Practices

### Priority Guidelines

```
Use these ranges:
  0-4   : Base ambiance (exploration, menu, world)
  5-9   : Zones, areas, light events
  10-14 : Combat, action sequences
  15+   : Boss fights, cutscenes, critical moments
```

**Why?** Leaves room for additions without reorganizing all priorities.

### Naming Conventions

✅ **Clear, descriptive names:**
- "Combat", "BossMusic", "ExplorationDay"

❌ **Avoid:**
- "Music1", "Track2", "Sound"
- Spaces: "Combat Music" (use "CombatMusic")
- Special chars: "Combat_Music!" (use "Combat_Music")

### Persistence Strategy

**Persist = true:**
- Menu music
- World/ambient music
- Background themes

**Persist = false:**
- Combat music
- Zone-specific music
- Event/temporary music

### Always Pop What You Push

```blueprint
✅ Good:
Push "Combat"
// ... gameplay ...
Pop "Combat"

❌ Bad:
Push "Combat"
// ... never Pop → memory leak, layer stuck
```

### Use Music Zones for Areas

Instead of manual Push/Pop in Blueprints:

```
✅ Good:
Place AERP_MusicZone actor → Configure → Done!

❌ Tedious:
Overlap Begin → Push
Overlap End → Pop
(repetitive Blueprint code everywhere)
```

---

## 🔍 Debugging Tips

### Console Commands

```
music.debug      → Show all active layers visually
music.push Name 10 → Test push a layer
music.pop Name   → Test pop a layer
music.clear      → Stop all music immediately
```

### Reading music.debug Output

```
Active Layers:
[Combat] Priority: 10 Mode: Replace PLAYING ✅
[Tension] Priority: 5 Mode: Additive (Stopped, priority &lt; 10)
[Exploration] Priority: 0 Mode: Replace (Lower priority Replace)
Master Volume: 1.0
```

This tells you:
- Combat is playing (highest Replace)
- Tension isn't playing (5 &lt; 10)
- Exploration isn't playing (lower Replace)

### Output Log

Look for:
```
LogTemp: ERP Music Subsystem Initialized
LogTemp: Pushed music layer: Combat (Priority: 10, Mode: Replace)
LogTemp: Started playing layer: Combat
LogTemp: Popped music layer: Combat
```

If you don't see these → Plugin not initializing properly.

---

## 📚 Quick Reference

| Action | Effect | When Used |
|--------|--------|-----------|
| **Push Replace [High]** | Stops lower music, plays this | Main music changes |
| **Push Additive [≥Current]** | Adds on top of music | Atmosphere layers |
| **Pop Layer** | Removes layer, previous returns | End event/zone |
| **Persist = true** | Music survives level load | Menu, world music |
| **Persist = false** | Music stops on level load | Combat, zones |
| **Priority 0-4** | Base/ambient music | Exploration, menu |
| **Priority 10+** | Important music | Combat, bosses |

---

## 🎯 Summary

### The Golden Rules

1. **Higher priority wins** (for Replace layers)
2. **Additive plays if priority ≥ current Replace**
3. **Additive STOPS when Replace priority goes above it**
4. **Additive RESTARTS when Replace priority goes below it**
5. **Pop automatically returns previous music (and Additive layers!)**
6. **Persist = keep playing between levels**
7. **One Replace at a time, multiple Additives OK**
8. **Each layer needs a unique name**

### Mental Model

Think of it like:
- **Replace** = Changing channels on a TV
- **Additive** = Adding subtitles/effects on top
- **Priority** = Channel number (higher = more important)
- **Additive Rule** = Subtitles only show if channel number allows it
- **Persist** = TV stays on when you leave the room

### Common Questions

**Q: My Additive layer stopped playing, why?**  
A: A Replace layer with higher priority was pushed. The Additive will restart when that Replace is popped.

**Q: Can I have multiple Additive layers?**  
A: Yes! All Additive layers with priority ≥ current Replace play simultaneously.

**Q: Do I need different names for each layer?**  
A: Yes! Pushing the same name twice is ignored. Use unique names like "Combat_Drums", "Combat_Strings".

**Q: How do I remove an Additive layer?**  
A: Use `Pop Music Layer` with its name, just like Replace layers.

---

**Now you understand exactly how ElysMusicEngine works!** 🎵
