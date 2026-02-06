---
id: troubleshooting
title: Troubleshooting
sidebar_position: 8
---

# Troubleshooting Guide

Solutions to common issues with ElysMusicEngine.

---

## 🔍 General Debugging

### Step 1: Use Console Commands

Open console (`~` key) and try:

```
music.debug
```

This shows:
- All active layers
- Their priorities
- Which ones are playing
- Current master volume

### Step 2: Check Output Log

**Window → Developer Tools → Output Log**

Look for:
- `ERP Music Subsystem Initialized` (plugin loaded)
- `Pushed music layer: LayerName` (layer added)
- `Started playing layer: LayerName` (music started)
- Warnings about missing assets or invalid states

---

## 🚫 Music Not Playing

### Symptom

You call `Push Music Layer` but hear nothing.

### Solutions

#### 1. Check Plugin Enabled

**Edit → Plugins → Search "Elys Music Engine"**
- ✅ Must be enabled
- Restart editor if you just enabled it

#### 2. Verify Music Asset

- Double-click music asset in Content Browser
- Does it play?
- If not → Reimport or use different asset

#### 3. Check Layer Already Active

```blueprint
Branch: Is Layer Active("YourLayerName")
  If TRUE: Layer already playing (Push ignored)
  If FALSE: Should work
```

**Fix:** Pop the layer first, or use different name.

#### 4. Check Master Volume

Console: `music.debug`

Look for `Master Volume: 0.0` → That's your problem!

**Fix:**
```blueprint
Set Master Music Volume
  - Volume: 1.0
```

#### 5. Check Layer Volume

When pushing layer:
- Volume Multiplier: Should be `1.0` (not `0.0`)

#### 6. Check Audio Settings

**Edit → Project Settings → Audio**
- Master Volume: Should be > 0
- Audio Device: Should be valid

---

## 🔇 Music Stops Abruptly

### Symptom

Music cuts off suddenly instead of fading.

### Solutions

#### 1. Increase Fade Times

When pushing layer:
- **Fade Out Time:** Increase to `1.5` or `2.0` seconds
- **Fade In Time:** Match the fade out time

#### 2. Check Pop Timing

If you Pop a layer immediately after Push:
- The fade might not complete
- Add delay or check if already active first

#### 3. Check Clear All Layers

`Clear All Music Layers` stops everything immediately:
- Use `Pop Music Layer` for graceful fadeout

---

## 🎵 Wrong Music Playing

### Symptom

Different music plays than expected.

### Solutions

#### 1. Check Priorities

Console: `music.debug`

Higher priority **wins**. Example:
```
Combat [10] Replace   ← This plays
Exploration [0]       ← This doesn't (lower priority)
```

**Fix:** Adjust priorities when pushing layers.

#### 2. Check Layer Mode

**Replace:** Stops lower priority music  
**Additive:** Adds on top (both may play)

If you want **only** combat music:
- Mode: `Replace`
- Priority: Higher than exploration (e.g., 10 vs 0)

#### 3. Check Layer Names

Case-sensitive! These are different:
- `"Combat"`
- `"combat"`
- `"Combat "` (trailing space)

**Fix:** Use consistent naming.

---

## 🔁 Music Won't Stop

### Symptom

Pop Music Layer doesn't stop the music.

### Solutions

#### 1. Check Layer Name Matches

```blueprint
Push Music Layer
  - Layer Name: "Combat"  ← Must match exactly
  
Pop Music Layer
  - Layer Name: "Combat"  ← Same name!
```

**Common mistake:**
```blueprint
Push: "Combat"
Pop: "combat"  ← Wrong! Case-sensitive
```

#### 2. Check Fade Out Time

Music **does** fade out, it just takes time:
- Default: 1.0 seconds
- Wait for fade to complete

Console: `music.debug` will show `(FADING OUT)` status.

#### 3. Force Stop

If stuck, use:
```blueprint
Clear All Music Layers
```

This immediately stops everything.

---

## 📦 Music Zones Not Triggering

### Symptom

Walk into `ERP_MusicZone` but music doesn't change.

### Solutions

#### 1. Check Collision Settings

Select the `ERP_MusicZone` actor:

**Details Panel:**
- Collision Enabled: ✅ Query and Physics
- Generate Overlap Events: ✅ True

#### 2. Check Player Collision

Your player character:
- Must have collision enabled
- Must generate overlap events

#### 3. Check Required Actor Tag

If `Required Actor Tag` is set:
- Player **must** have that tag
- **Fix:** Add tag to player or leave field empty

#### 4. Check Trigger Once

If `Trigger Once: true`:
- Zone only triggers first time
- **Fix:** Set to `false` or reset (re-enter level)

#### 5. Visualize Zone

Select zone → **Show → Collision**
- Should see the box bounds
- Make sure it's large enough to actually hit

#### 6. Check Output Log

Look for:
```
Music Zone: Pushed layer 'ZoneName'
```

If not there → Zone not triggering overlap.

---

## 🌍 Music Stops Between Levels

### Symptom

Music stops when loading new level.

### Solutions

#### 1. Enable Persistence

When pushing layer:
```blueprint
Push Music Layer
  - Persist Across Levels: ✅ TRUE
```

#### 2. Check Level Streaming

If using **Level Streaming**:
- Persistence should work automatically
- If not, check Audio settings (Master Volume reset?)

#### 3. Re-Push After Load

Alternative if persistence doesn't work:
```blueprint
Event BeginPlay (new level)
  ↓
Check: Is Layer Active("MenuMusic")
  If FALSE:
    Push Music Layer("MenuMusic", ...)
```

---

## 🎺 Stingers Not Working

### Symptom

Call `Play Stinger` but nothing happens.

### Solutions

#### 1. Check Stinger Asset

- Verify sound asset is valid
- Double-click to preview
- Should be **short** (1-5 seconds typical)

#### 2. Check Music Ducking

If `bDuckMusic: true` but music too loud:
- Increase `Duck Volume` (e.g., `0.2` = very quiet)

#### 3. Check Stinger Volume

Stinger itself might be too quiet:
- Check asset volume
- Increase in Sound Cue/Wave settings

#### 4. Check Simultaneous Stingers

Only **one stinger at a time**:
- If already playing, new stinger ignored
- **Future:** Queue system

---

## 💬 Dialogue Ducking Not Working

### Symptom

Music doesn't lower during dialogue.

### Solutions

#### 1. Check Audio Component Valid

```blueprint
Spawn Sound 2D (dialogue)
  ↓ Audio Component pin
Branch: Is Valid?
  If Valid:
    Enable Dialogue Ducking
```

#### 2. Check Duck Volume

- `0.0` = complete silence
- `0.5` = half volume
- `1.0` = no ducking (no effect!)

**Fix:** Use `0.3` - `0.5` for best results.

#### 3. Check Dialogue Finishes

Ducking **restores** when audio finishes:
- If dialogue loops forever → Music stays ducked
- If dialogue component destroyed → No restore callback

**Fix:** Use non-looping dialogue or manually restore:
```blueprint
Set Master Music Volume
  - Volume: 1.0
```

---

## ⚙️ Performance Issues

### Symptom

FPS drop or stuttering when music changes.

### Solutions

#### 1. Use Smaller Audio Files

- Large uncompressed WAV: Slow loading
- **Fix:** Use compressed formats (OGG Vorbis)
- Or compress in Sound Wave settings

#### 2. Reduce Layer Count

- 10+ active layers: Check if all needed
- **Fix:** Consolidate layers or Pop unused

#### 3. Check Asset Streaming

Large music files:
- Enable **Streaming** in Sound Wave asset settings
- Reduces memory, improves load times

#### 4. Preload Critical Music

In Level Blueprint:
```blueprint
Event BeginPlay
  ↓
Load Asset (async)
  - Asset: Your Music Asset
  ↓
(Cache in variable for later use)
```

---

## 🐛 Plugin Not Loading

### Symptom

Plugin missing in menus or nodes not available.

### Solutions

#### 1. Check Plugin Enabled

**Edit → Plugins → Search "Elys Music Engine"**

If not found:
- Plugin not in `Plugins/` folder
- Check file structure: `Plugins/ElysMusicEngine/...`

#### 2. Regenerate Project Files

Right-click `.uproject` → **Generate Visual Studio project files**

#### 3. Rebuild Project

- Close editor
- Build in Visual Studio (Development Editor configuration)
- Reopen editor

#### 4. Check Engine Version

Plugin requires **Unreal Engine 5.0+**:
- Check `.uplugin` file: `"EngineVersion": "5.0.0"`
- If older engine → Update or modify plugin for UE4

---

## 🔊 Audio Crackling / Distortion

### Symptom

Music sounds distorted or crackly.

### Solutions

#### 1. Check Audio Device Settings

**Edit → Project Settings → Platforms → Windows → Audio**
- Buffer Size: Increase if too low
- Sample Rate: Match your music files

#### 2. Check CPU Load

- Too many layers playing?
- Other systems causing hitches?

**Fix:** Reduce layer count or optimize other systems.

#### 3. Check Music Asset Quality

- Bitrate too low?
- Compression artifacts?

**Fix:** Use higher quality source or adjust compression.

---

## 📝 Config Assets Not Working

### Symptom

`Apply Music Config` doesn't play music.

### Solutions

#### 1. Check Config Asset Valid

Open `ERP_MusicLayerConfig` asset:
- At least one layer defined?
- Music assets assigned?
- Layer names set?

#### 2. Check Clear Existing

```blueprint
Apply Music Config
  - Clear Existing: TRUE   ← Stops all current music
  - Clear Existing: FALSE  ← Adds on top of current
```

Choose based on your needs.

#### 3. Check Layer Priorities

Config layers still subject to priority rules:
- Higher priority config layers play first
- Lower priority may be overridden by active layers

---

## 🔧 Blueprint Node Missing

### Symptom

Can't find "Push Music Layer" or other nodes.

### Solutions

#### 1. Check Context-Sensitivity

Blueprint search is context-aware:
- **Disable** "Context Sensitive" checkbox in search
- Type: `Push Music Layer`

#### 2. Check Category

All nodes in category: **"ERP Music"**

Search: `category:ERP` or `category:Music`

#### 3. Refresh Nodes

- Save and close Blueprint
- Reopen
- Try searching again

#### 4. Check Plugin Compiled

If nodes missing after adding plugin:
- Close editor
- Rebuild project
- Reopen editor

---

## ⚠️ Common Mistakes

| Mistake | Problem | Solution |
|---------|---------|----------|
| Layer name typo | Pop doesn't work | Use exact same name (case-sensitive) |
| Priority too low | Combat doesn't override | Set combat priority higher (10 vs 0) |
| Replace vs Additive | Music behavior wrong | Use Replace for main, Additive for layers |
| Forget to Pop | Music plays forever | Always Pop when done |
| No Persist flag | Music stops on level load | Enable "Persist Across Levels" |
| Zone collision off | Zone doesn't trigger | Enable collision + overlap events |

---

## 🆘 Still Need Help?

### Check Other Documentation

- **[Setup Guide](SetupGuide.md)** - Step-by-step setup
- **[Quick Reference](Quick-Reference.md)** - Quick lookup
- **[Architecture](Architecture.md)** - How it works
- **[Examples](Examples.md)** - Working patterns

### Debug Checklist

- [ ] Console command: `music.debug`
- [ ] Output Log for errors
- [ ] Plugin enabled and compiled
- [ ] Music assets valid and play directly
- [ ] Layer names match exactly
- [ ] Priorities make sense
- [ ] Fade times reasonable
- [ ] Persistence flag set if needed

### Report a Bug

If you found a real bug:
1. Check GitHub issues first
2. Provide:
   - Unreal version
   - Plugin version
   - Minimal repro steps
   - Output log excerpt
3. Open new issue on GitHub

---

**Most issues are simple configuration problems. Use `music.debug` first!** 🔍
