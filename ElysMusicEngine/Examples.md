# Examples and Usage Patterns

Common implementation patterns for Elys Music Engine.

---

## Example 1: Basic Level Music

Play background music when a level loads.

```
Level Blueprint → Event BeginPlay
    ↓
Play Music (Music Helper)
    ├─ Music: LevelTheme_Sound
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
    Stop Music (Fade Out: 1.0)
        ↓
    Delay 1.0
        ↓
    Play Music (Combat Theme, Fade In: 0.5)
    
    False:
        ↓
    Branch (In Combat AND No Enemies)
        True:
            ↓
        Set In Combat = False
            ↓
        Stop Music (Fade Out: 2.0)
            ↓
        Delay 2.0
            ↓
        Play Music (Exploration Theme, Fade In: 3.0)
```

---

## Example 3: Menu Music

Play music in the main menu with automatic looping.

```
Main Menu Widget → Event Construct
    ↓
Get Music Manager
    ↓
Play Music
    ├─ Music: MenuTheme_Sound
    ├─ Fade In: 1.0
    └─ Volume: 0.4
    
Main Menu Widget → Event Destruct
    ↓
Stop Music (Fade Out: 1.0)
```

---

## Example 4: Dynamic Volume Control

Adjust music volume based on gameplay events (e.g., during dialogue).

```
On Dialogue Start
    ↓
Get Music Manager
    ↓
Set Music Volume
    ├─ Volume: 0.2
    └─ Fade Time: 0.5

On Dialogue End
    ↓
Get Music Manager
    ↓
Set Music Volume
    ├─ Volume: 0.6
    └─ Fade Time: 1.0
```

---

## Example 5: Persistent Music Across Levels

Use Game Instance to keep music playing during level transitions.

```
Game Instance Blueprint:

Event Init
    ↓
Spawn Actor (ERP_MusicManager)
    ↓
Set Music Manager (Store Reference)

Function: Play Persistent Music
    ↓
Get Music Manager
    ↓
Is Music Playing?
    False:
        ↓
    Play Music
        ├─ Music: Game Theme
        ├─ Fade In: 2.0
        └─ Volume: 0.5
```

Call this function from each level's BeginPlay:
```
Level Blueprint → Event BeginPlay
    ↓
Get Game Instance
    ↓
Cast to YourGameInstance
    ↓
Play Persistent Music
```

---

## Example 6: Music Playlist System

Cycle through multiple music tracks.

```
Game Mode Blueprint:

Variables:
- Music Playlist (Array of Sound Waves)
- Current Track Index (Integer) = 0

Function: Play Next Track
    ↓
Stop Music (Fade Out: 2.0)
    ↓
Delay 2.0
    ↓
Get from Array (Music Playlist, Current Track Index)
    ↓
Play Music (Retrieved Sound, Fade In: 2.0)
    ↓
Increment Track Index
    ↓
Branch (Index >= Array Length)
    True: Set Index = 0
    False: Continue

Event BeginPlay
    ↓
Play Next Track
    ↓
Set Timer by Event (Play Next Track, 180.0 seconds, Looping: True)
```

---

## Example 7: Ambient + Music Layers

Play ambient sounds alongside music.

```
Level Blueprint:

Event BeginPlay
    ↓
[Branch 1] Play Music
    ├─ Music: Music Layer
    └─ Volume: 0.5
    
[Branch 2] Spawn Sound 2D
    ├─ Sound: Ambient Loop
    └─ Volume: 0.3
```

---

## Example 8: Boss Fight Music

Trigger special music for boss encounters with health-based intensity.

```
Boss Actor Blueprint:

Event Take Damage
    ↓
Get Health Percentage
    ↓
Branch (Health < 0.3 AND Not Playing Phase 2 Music)
    True:
        ↓
    Stop Music (Fade Out: 0.5)
        ↓
    Delay 0.5
        ↓
    Play Music (Boss Phase 2 Theme, Fade In: 0.5, Volume: 0.7)
        ↓
    Set Playing Phase 2 = True

Event Death
    ↓
Stop Music (Fade Out: 3.0)
    ↓
Delay 3.0
    ↓
Play Music (Victory Theme, Fade In: 1.0)
```

---

## Example 9: Area-Based Music

Change music when entering different areas.

```
Trigger Volume Blueprint:

Event ActorBeginOverlap (Other Actor = Player)
    ↓
Stop Music (Fade Out: 2.0)
    ↓
Delay 2.0
    ↓
Play Music
    ├─ Music: Area Specific Theme
    ├─ Fade In: 3.0
    └─ Volume: 0.6
```

---

## Example 10: Stinger System

Play short musical stings without interrupting main music.

```
Function: Play Stinger

Input: Stinger Sound (Sound Wave)
    ↓
Get Music Manager
    ↓
Get Current Volume
    ↓
Set Music Volume (Volume * 0.3, Fade: 0.2)
    ↓
Play Sound 2D (Stinger Sound)
    ↓
Delay (Stinger Duration + 0.5)
    ↓
Set Music Volume (Original Volume, Fade: 1.0)
```

Usage:
```
On Achievement Unlocked
    ↓
Play Stinger (Achievement Stinger Sound)
```

---

## Tips for Each Pattern

- **Level Music**: Use long fade-ins for smooth entry
- **Combat Music**: Keep fade-outs short for responsive feel
- **Menu Music**: Use lower volume to not overwhelm UI
- **Dialogue**: Automate volume reduction to avoid manual control
- **Persistent Music**: Check if already playing to avoid restart
- **Playlist**: Add randomization for variety
- **Layers**: Balance volumes carefully
- **Boss Fight**: Use dramatic timing for phase transitions
- **Area Music**: Use longer fades for smoother transitions
- **Stingers**: Keep them short (&lt;3 seconds) and punchy
