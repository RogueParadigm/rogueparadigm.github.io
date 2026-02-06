---
id: index
title: ElysMusicEngine
slug: /intro
sidebar_position: 1
---

![Version](https://img.shields.io/badge/version-1.0.0-blue.svg)
![Unreal Engine](https://img.shields.io/badge/Unreal%20Engine-5.0+-blue.svg)
![License](https://img.shields.io/badge/license-Proprietary-red.svg)

A powerful, layer-based music system for Unreal Engine 5 that makes dynamic music simple for indie developers and hobbyists.

## 🎯 What is ElysMusicEngine?

ElysMusicEngine provides **dynamic music management** for Unreal Engine games:
- **Layer System** - Mix multiple music tracks with Replace/Additive modes
- **Priority-Based** - High priority music automatically takes over
- **Music Zones** - Drop volumes in levels, music changes automatically
- **Stingers** - Musical accents with auto-ducking
- **Dialogue Ducking** - Music auto-lowers during dialogues
- **Persistence** - Music continues across level transitions
- **Blueprint-First** - No coding required, full designer control

## 🚀 Quick Navigation

### Getting Started
- **[Setup Guide](SetupGuide.md)** - Installation and first music setup (5 minutes)
- **[Quick Start](QuickStart.md)** - Combat music in 5 minutes
- **[Quick Reference](Quick-Reference.md)** - 1-page cheat sheet (print it!)

### Core Concepts
- **[How It Works](HowItWorks.md)** - Complete explanation of layers, priorities, persistence
- **[Architecture Overview](Architecture.md)** - Technical deep dive

### Guides
- **[Examples](Examples.md)** - Combat, zones, stingers, day/night
- **[Troubleshooting](Troubleshooting.md)** - Common issues and solutions

### Reference
- **[API Reference](API-Reference.md)** - Complete Blueprint function documentation

---

## 🏗️ Architecture Overview

ElysMusicEngine uses a **priority-based layer system** for dynamic music:

```
┌─────────────────────────────────────────────────────────────┐
│                    Your Game                                │
│  ┌──────────────────────────────────────────────────────┐  │
│  │         Blueprint / C++ Gameplay Code                │  │
│  │  • Push Music Layer (combat starts)                  │  │
│  │  • Pop Music Layer (combat ends)                     │  │
│  │  • Apply Music Config (enter dungeon)                │  │
│  └──────────────────────────────────────────────────────┘  │
└─────────────────────────────────────────────────────────────┘
                            │
                            ▼
┌─────────────────────────────────────────────────────────────┐
│         ERP Music Subsystem (Auto-Created)                  │
│  • Manages active music layers                              │
│  • Sorts by priority                                        │
│  • Crossfades between tracks                                │
│  • Persists across levels                                   │
└─────────────────────────────────────────────────────────────┘
                            │
                            ▼
┌─────────────────────────────────────────────────────────────┐
│              Active Music Layers (Stack)                    │
│  ┌────────────────────────────────────────────────────┐    │
│  │  Boss Music      [Priority 15] Replace → PLAYING   │    │
│  │  Combat Music    [Priority 10] Replace             │    │
│  │  Tension Layer   [Priority 5]  Additive            │    │
│  │  Exploration     [Priority 0]  Replace             │    │
│  └────────────────────────────────────────────────────┘    │
└─────────────────────────────────────────────────────────────┘
```

### How It Works

1. **Push Layer** → Add music to the stack with priority
2. **Subsystem** → Sorts layers, plays highest priority
3. **Replace Mode** → Stops all lower priority music
4. **Additive Mode** → Plays on top of current music
5. **Pop Layer** → Remove from stack, previous music returns

---

## 🎮 Common Use Cases

| Use Case | How to Implement |
|----------|------------------|
| **Combat Music** | Push layer (Priority 10, Replace) on combat start&lt;br/&gt;Pop layer on combat end |
| **Boss Music** | Push layer (Priority 15, Replace) in boss room |
| **Music Zones** | Place `ERP_MusicZone` actor in level&lt;br/&gt;Auto-triggers on player overlap |
| **Tension Layers** | Push layer (Priority 5, Additive) when enemy nearby |
| **Stingers** | Call `Play Stinger` on achievement/discovery |
| **Dialogue** | Call `Enable Dialogue Ducking` when NPC talks |
| **Day/Night** | Push/Pop layers based on time of day |
| **Menu Music** | Create `ERP_MusicLayerConfig` asset, apply on menu load |

---

## 💡 Key Features Explained

### Layer Modes

**Replace Mode:**
- Replaces all lower priority music
- Use for main music states (exploration, combat, boss)
- Only ONE replace layer plays at a time

**Additive Mode:**
- Adds on top of existing music
- Use for atmosphere (tension, wind, rain)
- Multiple additive layers can play together

### Priority System (0-100)

```
🔴 Boss Music      [15] ← Always on top (critical moments)
🟠 Combat          [10] ← Important gameplay states
🟡 Special Zones   [5]  ← Areas and events
🟢 Exploration     [0]  ← Base/default music
```

Higher number = more important = plays over lower priority.

### Persistence

Enable `Persist Across Levels: true` to keep music playing during:
- Level streaming
- Level transitions
- Map loads

Perfect for menu music or world ambiance.

---

## 🎯 Design Philosophy

### For Indies & Hobbyists

This plugin is designed for **ease of use** without sacrificing power:
- Setup combat music in **5 minutes**, not 5 hours
- No complex state machines or graphs
- Drop music zones in levels, no scripting needed

### Blueprint-First

Everything accessible via Blueprints:
- C++ is there for performance, not gatekeeping
- Full designer control
- No coding required

### No Over-Engineering

- Simple priority system, not complex FSM
- Additive layers, not 20-channel mixers
- Clear concepts: Replace or Add, that's it

---

## 🎓 Learning Path

### Beginner (5-15 minutes)

1. **[Setup Guide](SetupGuide.md)** - Install plugin, play first music
2. **[Quick Start](QuickStart.md)** - Combat music tutorial
3. **[Quick Reference](Quick-Reference.md)** - Print this cheat sheet

### Intermediate (30 minutes)

4. **[Architecture Overview](Architecture.md)** - Understand how it works
5. **[Examples](Examples.md)** - Copy common patterns

### Advanced (1+ hour)

6. **[API Reference](API-Reference.md)** - All Blueprint functions
7. Create reusable configs for your game

---

## 🆘 Need Help?

**Quick answers:**
- Check **[Troubleshooting](Troubleshooting.md)** for common issues
- Use console command: `music.debug` to see active layers

**Still stuck?**
- Read the **[Setup Guide](SetupGuide.md)** step-by-step
- Review **[Examples](Examples.md)** for working patterns

---

## 📦 What's Included

**Core Components:**
- `UERP_MusicSubsystem` - Main music manager (auto-created)
- `UERP_MusicZone` - Actor for level-based music
- `UERP_MusicLayerConfig` - Reusable DataAsset presets
- `UERP_MusicHelper` - Blueprint function library

**Features:**
- Layer stacking with priorities
- Replace/Additive modes
- Crossfading transitions
- Stingers with ducking
- Dialogue ducking
- Music zones
- Level persistence
- Audio component pooling

---

## 🎵 Ready to Start?

👉 **[Setup Guide](SetupGuide.md)** - Get your first music playing in 5 minutes!

👉 **[Quick Reference](Quick-Reference.md)** - Keep this open while working!
