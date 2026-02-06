---
id: quick-reference
title: Quick Reference
sidebar_position: 2
---

# Quick Reference - ElysMusicEngine

**Print this page for quick reference while working!** 🖨️

---

## 🎯 Core Concepts (30 seconds)

| Concept | What It Means |
|---------|---------------|
| **Layer** | A single music track in the system |
| **Replace** | New music replaces lower priority (combat → exploration) |
| **Additive** | Music adds on top (tension layer + exploration) |
| **Priority** | 0-100, higher = more important |
| **Push** | Add a music layer to the stack |
| **Pop** | Remove a music layer from the stack |

---

## 🏗️ Architecture (1 minute)

```
Your Blueprint
     │
     ▼
┌──────────────────────────────────┐
│   ERP Music Subsystem            │  ← Auto-created, always exists
│   (GameInstanceSubsystem)        │     Manages everything
└──────────────────────────────────┘
     │
     ▼
┌──────────────────────────────────┐
│   Active Layers (sorted)         │
│   • Boss [15] Replace   PLAYING  │  ← Highest priority plays
│   • Combat [10] Replace          │
│   • Tension [5] Additive         │
│   • Exploration [0] Replace      │
└──────────────────────────────────┘
```

**Rule:** Highest priority **Replace** layer plays. **Additive** layers with priority ≥ current replace also play.

---

## 🎚️ Priority Quick Guide

```
🔴 15+ : Boss fights, cutscenes, critical moments
🟠 10-14: Combat, action sequences
🟡 5-9  : Zones, areas, light events
🟢 0-4  : Base ambiance (exploration, menu)
```

---

## 🎮 Common Patterns (2 minutes)

### Combat Music
```blueprint
// Enemy spotted
Push Music Layer
  - Name: "Combat"
  - Priority: 10
  - Mode: Replace
  
// Combat ends
Pop Music Layer
  - Name: "Combat"
```

### Music Zone (Easiest!)
1. Add Actor → **ERP_MusicZone**
2. Resize box
3. Set music, priority
4. Done! Auto-triggers

### Stinger (Achievement)
```blueprint
Play Stinger
  - Sound: FanfareSound
  - Duck Music: true
  - Duck Volume: 0.3
```

### Tension Layer (Additive)
```blueprint
// Enemy nearby
Push Music Layer
  - Name: "Tension"
  - Priority: 5
  - Mode: Additive  ← Adds on top!
  
// Enemy gone
Pop Music Layer
  - Name: "Tension"
```

### Dialogue Ducking
```blueprint
Spawn Sound 2D (dialogue)
  ↓ (AudioComponent)
Enable Dialogue Ducking
  - Component: [from above]
  - Duck Volume: 0.4
```

---

## 📋 Blueprint Nodes (Category: "ERP Music")

### Layer Control
- **Push Music Layer** - Add music with priority
- **Pop Music Layer** - Remove music by name
- **Clear All Music Layers** - Stop everything

### Configuration
- **Apply Music Config** - Load preset (DataAsset)

### Query
- **Is Layer Active** - Check if layer playing
- **Get Active Layer Names** - List all active

### Effects
- **Play Stinger** - Short musical accent
- **Enable Dialogue Ducking** - Auto-duck for speech

### Volume
- **Set Master Music Volume** - Global volume control
- **Get Master Music Volume** - Current volume

---

## 🐛 Debug Commands

Open console (`~` key):

| Command | What It Does |
|---------|--------------|
| `music.debug` | Show active layers visually |
| `music.push LayerName 10` | Test push layer |
| `music.pop LayerName` | Test pop layer |
| `music.clear` | Stop all music |

---

## ⚙️ Key Parameters

### When Pushing Layer

| Parameter | Values | Default | Notes |
|-----------|--------|---------|-------|
| **Layer Name** | Any name | - | Use clear names: "Combat", "Boss" |
| **Music** | SoundBase | - | Your music asset |
| **Priority** | 0-100 | 0 | Higher = more important |
| **Layer Mode** | Replace / Additive | Replace | Replace or add? |
| **Volume** | 0.0-1.0 | 1.0 | Volume multiplier |
| **Fade In** | Seconds | 1.0 | Fade in duration |
| **Fade Out** | Seconds | 1.0 | Fade out duration |
| **Looping** | true/false | true | Loop music? |
| **Persist** | true/false | false | Continue across levels? |

---

## 🎯 Replace vs Additive

### Replace Mode (Main Music)

**Use for:** Exploration, combat, boss, menu

**Behavior:**
- Stops all **lower** priority music
- Only ONE replace layer plays at a time
- Automatically crossfades

**Example:**
```
Exploration (0, Replace) PLAYING
  → Push Combat (10, Replace)
  → Combat PLAYS, Exploration STOPS
```

### Additive Mode (Layers)

**Use for:** Tension, atmosphere, weather

**Behavior:**
- Adds **on top** of current music
- Multiple additive layers can play together
- Only plays if priority ≥ current replace layer

**Example:**
```
Exploration (0, Replace) PLAYING
  → Push Tension (5, Additive)
  → BOTH play together
  
Then push Combat (10, Replace)
  → Combat PLAYS, Tension STOPS (lower priority)
```

---

## 🚨 Common Mistakes

| Mistake | Solution |
|---------|----------|
| ❌ Music abruptly stops | Check Fade Out time (increase it) |
| ❌ Combat doesn't override | Set higher priority (10 vs 0) |
| ❌ Layer doesn't add | Use Additive mode (not Replace) |
| ❌ Same layer plays twice | Check if already active first |
| ❌ Music stops between levels | Enable "Persist Across Levels" |
| ❌ Zone doesn't trigger | Check collision/overlap settings |

---

## 🔧 Quick Troubleshooting

### Music Not Playing?
1. Use `music.debug` console command
2. Check layer isn't already active
3. Verify music asset loaded
4. Check master volume not zero

### Wrong Music Playing?
1. Check priorities (higher wins)
2. Verify layer mode (Replace/Additive)
3. Use `music.debug` to see stack

### Music Not Stopping?
1. Ensure you Pop the correct layer name
2. Check layer wasn't set to loop forever
3. Use `music.clear` to reset

---

## 📦 Components Quick Map

| Component | What It Is | Where Used |
|-----------|------------|------------|
| **ERP Music Subsystem** | Main manager | Auto-exists (GameInstance) |
| **ERP Music Zone** | Level trigger | Place in world |
| **ERP Music Layer Config** | Preset asset | Content Browser → Data Asset |
| **ERP Music Helper** | Functions | Blueprint nodes |

---

## 🎓 Setup Checklist

- [ ] Plugin enabled in editor
- [ ] Import music assets (WAV/MP3/OGG)
- [ ] Test: Push layer in Level Blueprint
- [ ] Music plays? ✅ Good to go!

---

## 📚 Next Steps

| If You Want... | Read This... |
|----------------|--------------|
| First music setup | [Setup Guide](SetupGuide.md) |
| Combat music tutorial | [Quick Start](QuickStart.md) |
| Understand how it works | [Architecture](Architecture.md) |
| Copy working examples | [Examples](Examples.md) |
| Fix issues | [Troubleshooting](Troubleshooting.md) |
| All Blueprint functions | [API Reference](API-Reference.md) |

---

**🖨️ Keep this page open or print it for quick reference!**
