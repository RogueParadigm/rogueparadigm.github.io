# Examples and Usage Patterns

Common implementation patterns for Elys Music Engine.

---

## Example 1: Basic Level Music

Play background music when a level loads.

```
Level Blueprint → Event BeginPlay
    ↓
Push Music Layer
    ├─ Layer Name: "LevelMusic"
    ├─ Music: LevelTheme_Sound
    ├─ Priority: 0
    ├─ Fade In: 3.0
    └─ Volume: 0.6
```

---

## Example 2: Combat Music System

Switch to combat music when enemies are nearby.

```
Character Blueprint:

Event Tick
    ↓
Get Nearby Enemies (Sphere Overlap)
    ↓
Branch (Enemies Found AND Not In Combat)
    True:
        ↓
    Set In Combat = True
        ↓
    Push Music Layer
        ├─ Layer Name: "Combat"
        ├─ Music: Combat Theme
        ├─ Priority: 10
        ├─ Layer Mode: Replace
        └─ Fade In: 0.5
    
    False:
        ↓
    Branch (In Combat AND No Enemies)
        True:
            ↓
        Set In Combat = False
            ↓
        Pop Music Layer
            └─ Layer Name: "Combat"
            ↓
        (Exploration music automatically returns)
```

---

## Example 3: Menu Music

Play music in the main menu with automatic looping.

```
Main Menu Widget → Event Construct
    ↓
Push Music Layer
    ├─ Layer Name: "MenuMusic"
    ├─ Music: MenuTheme_Sound
    ├─ Priority: 0
    ├─ Fade In: 1.0
    └─ Volume: 0.4
    
Main Menu Widget → Event Destruct
    ↓
Pop Music Layer
    └─ Layer Name: "MenuMusic"
```

---

## Example 4: Dialogue Ducking

Automatically lower music volume during dialogue.

```
On Dialogue Start
    ↓
Spawn Sound 2D (Dialogue Audio)
    ↓ [Audio Component output]
Enable Dialogue Ducking
    ├─ Dialogue Component: [from above]
    ├─ Duck Volume: 0.3
    └─ Fade Time: 0.5

(Music automatically restores when dialogue finishes)
```

---

## Example 5: Persistent Music Across Levels

Keep music playing during level transitions.

```
Level Blueprint → Event BeginPlay
    ↓
Push Music Layer
    ├─ Layer Name: "GameMusic"
    ├─ Music: Game Theme
    ├─ Priority: 0
    ├─ Fade In: 2.0
    ├─ Volume: 0.5
    └─ Persist Across Levels: true

(Music continues when loading new levels)
```

---

## Example 6: Music Zones

Use music zones for area-based music (easiest method).

```
Level Editor:
1. Place Actor: Add → ERP_MusicZone
2. Resize box to cover area
3. Configure:
   ├─ Layer Name: "DungeonMusic"
   ├─ Music: Dungeon_Ambiance
   ├─ Priority: 5
   └─ Layer Mode: Replace

(Music plays automatically when player enters zone)
(Music stops when player exits zone)
```

---

## Example 7: Additive Tension Layer

Add tension music on top of base exploration music.

```
// Base exploration already playing at Priority 0

Event OnEnemyNearby
    ↓
Push Music Layer
    ├─ Layer Name: "Tension"
    ├─ Music: Tension_Strings
    ├─ Priority: 5
    ├─ Layer Mode: Additive    ← Adds on top!
    └─ Volume: 0.7

// Now BOTH exploration + tension play together

Event OnEnemyLeft
    ↓
Pop Music Layer
    └─ Layer Name: "Tension"
```

---

## Example 8: Boss Fight Music

Special music for boss encounters with phase transitions.

```
Boss Actor Blueprint:

Event OnBossStart
    ↓
Push Music Layer
    ├─ Layer Name: "BossFight"
    ├─ Music: Boss_Phase1_Music
    ├─ Priority: 15
    └─ Layer Mode: Replace

Event OnPhase2Start (Health &lt; 50%)
    ↓
Pop Music Layer ("BossFight")
    ↓
Push Music Layer
    ├─ Layer Name: "BossPhase2"
    ├─ Music: Boss_Phase2_Music
    ├─ Priority: 15
    └─ Fade In: 0.5

Event Death
    ↓
Pop Music Layer ("BossPhase2")
    ↓
Play Stinger
    ├─ Stinger Sound: Victory_Fanfare
    └─ Duck Music: true
```

---

## Example 9: Stinger on Achievement

Play a musical accent when player unlocks an achievement.

```
Event OnAchievementUnlocked
    ↓
Play Stinger
    ├─ Stinger Sound: Achievement_Fanfare
    ├─ Duck Music: true       ← Lowers background music
    ├─ Duck Volume: 0.3       ← 30% volume during stinger
    ├─ Duck Fade Time: 0.2
    └─ Restore Fade Time: 0.5

(Music automatically restores after stinger finishes)
```

---

## Example 10: Music Configuration Asset

Use reusable configs for complex multi-layer setups.

```
Content Browser:
1. Right-click → Miscellaneous → Data Asset
2. Select: UERP_MusicLayerConfig
3. Name: MC_DungeonAmbiance

Configure in asset:
Config Name: "Dungeon Ambiance"
Layers:
  [0] Dungeon Base
      ├─ Layer Name: "DungeonBase"
      ├─ Music: Dungeon_Base_Loop
      ├─ Priority: 0
      └─ Mode: Replace
      
  [1] Wind Layer
      ├─ Layer Name: "DungeonWind"
      ├─ Music: Wind_Layer
      ├─ Priority: 2
      ├─ Mode: Additive
      └─ Volume: 0.6

Use in Blueprint:
Event OnEnterDungeon
    ↓
Apply Music Config
    ├─ Config: MC_DungeonAmbiance
    └─ Clear Existing: true
    ↓
(All layers from config now playing)
```

---

## Example 11: Day/Night Music Cycle

Switch music based on time of day.

```
Time of Day Manager:

Event OnDayStart
    ↓
Pop Music Layer ("NightMusic")
    ↓
Push Music Layer
    ├─ Layer Name: "DayMusic"
    ├─ Music: Day_Ambiance
    ├─ Priority: 0
    └─ Fade In: 5.0

Event OnNightStart
    ↓
Pop Music Layer ("DayMusic")
    ↓
Push Music Layer
    ├─ Layer Name: "NightMusic"
    ├─ Music: Night_Ambiance
    ├─ Priority: 0
    └─ Fade In: 5.0
```

---

## Example 12: Master Volume Control

Adjust music volume from settings menu.

```
Settings Menu Widget:

Event OnMusicVolumeSliderChanged
    ↓
Set Master Music Volume
    ├─ Volume: [Slider Value 0.0-1.0]
    └─ Fade Time: 0.5
```

---

## Example 13: Check Active Layers (Debugging)

Query which layers are currently playing.

```
Debug Blueprint:

Event OnKeyPress (F1)
    ↓
Get Active Layer Names
    ↓
For Each Loop (Array of Names)
    ↓
Print String
    ├─ Text: [Current Layer Name]
    └─ Duration: 5.0
```

---

## Tips for Each Pattern

- **Level Music**: Use long fade-ins (2-5s) for smooth entry
- **Combat Music**: Higher priority (10) replaces exploration (0)
- **Menu Music**: Lower volume (0.3-0.5) to not overwhelm UI
- **Dialogue**: Use Enable Dialogue Ducking for automatic control
- **Persistence**: Enable for music that should span level transitions
- **Music Zones**: Easiest way to handle area-based music
- **Additive Layers**: Perfect for subtle atmosphere (wind, tension)
- **Boss Fight**: Use priority 15+ for critical music
- **Stingers**: Keep short (&lt;3 seconds) and punchy
- **Configs**: Reuse setups across multiple levels
- **Day/Night**: Use smooth fade transitions (5+ seconds)
- **Volume**: Provide user control via settings
- **Debugging**: Use Get Active Layer Names during development
