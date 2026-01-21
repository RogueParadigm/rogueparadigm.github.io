# ElysPerceptionPlugin — Internal Plugin State

> **Note:** This is an internal technical state document for plugin developers and maintainers. For user-facing documentation, see the [Documentation README](README.md).

Date: 2026-01-15

This document is a snapshot of the plugin's **current architecture, features, and file roles**.

---

## 1) Current source layout

Root: `Plugins/ElysPerceptionPlugin/Source/ElysPerceptionPlugin`

### Public
- `Public/ElysPerceptionPlugin.h`
- `Public/Core/ERPPerceptionComponent.h`
- `Public/Core/ERPTargetable.h`
- `Public/Core/ERPInteractable.h`

### Private
- `Private/ElysPerceptionPlugin.cpp`
- `Private/Core/ERPPerceptionComponent.cpp`

Notes:
- Targeting/Interaction folders were removed to keep a minimal API surface.
- Initiator interfaces were intentionally removed. Initiator-side rules are now **overridable functions on the perception component**.
- `ERPHelpers` was removed (dead code).

---

## 2) File-by-file responsibilities

### `Public/ElysPerceptionPlugin.h`
- Declares the Unreal module interface `FElysPerceptionPluginModule`.
- No gameplay logic.

### `Private/ElysPerceptionPlugin.cpp`
- Implements module startup/shutdown.
- No gameplay logic.

### `Public/Core/ERPTargetable.h`
**Target-side opt-in interface** for being considered a *Target* (combat/lock channel).
- Contract: if an Actor does **not** implement this interface → it is **not targetable**.
- Must return `true` to allow targeting.

### `Public/Core/ERPInteractable.h`
**Target-side opt-in interface** for being considered an *Interactable* (interaction/UI channel).
- Contract: if an Actor does **not** implement this interface → it is **not interactable**.
- Must return `true` to allow interaction detection.

### `Public/Core/ERPPerceptionComponent.h`
Defines:
- `UERPPerceptionComponent` — the main runtime system.
- Result structs:
  - `FERPTargetCandidate { Actor, Score }`
  - `FERPFocusEvaluationResult { BestTargetCandidate, BestInteractionCandidate, WinnerCode }`

Exposes:
- **Initiator-side permission hooks** (BlueprintNativeEvent):
  - `CanTargetActor(TargetActor)` (default `true`)
  - `CanInteractWithActor(TargetActor)` (default `true`)
- Targeting API:
  - `LockTarget`, `UnlockTarget`, `GetPrimaryTarget`, `IsTargetLocked`
- Interaction API:
  - `GetCurrentInteractable`
- Perception API:
  - `EvaluateFocus`, `GetCurrentWinnerCode`

Events (symmetric focus semantics):
- Target channel:
  - `OnTargetAcquired(Target, bHasCurrentFocus)`
  - `OnTargetLost(Target, bHadCurrentFocus)`
  - `OnTargetFocusStatusChanged(Target, bHasCurrentFocus)`
- Interaction channel:
  - `OnInteractableFound(Interactable, bHasCurrentFocus)`
  - `OnInteractableLost(Interactable, bHadCurrentFocus)`
  - `OnInteractableFocusStatusChanged(Interactable, bHasCurrentFocus)`

Where:
- `bHasCurrentFocus / bHadCurrentFocus` means this channel was (or is) the **current winner**.
- Focus is symmetric: if Target has focus, Interaction is secondary, and vice-versa.

### `Private/Core/ERPPerceptionComponent.cpp`
Implements the runtime behavior:
- Continuous evaluation (tick)
- Candidate collection via `SphereOverlapActors`
- Screen-space ellipse filtering
- Best candidate selection per channel
- Winner selection and focus switching
- Event emission (acquired/lost/focus-status-changed)

Also contains:
- Default implementations:
  - `CanTargetActor_Implementation(...) -> true`
  - `CanInteractWithActor_Implementation(...) -> true`
- Guard against division by zero when ellipse halves are 0.

---

## 3) Architecture overview

### Core concept: Passive Perception, two channels
A single component (`UERPPerceptionComponent`) produces, every tick:
- A **best Target candidate** (combat/lock channel)
- A **best Interactable candidate** (interaction/UI channel)
- A **WinnerCode** that indicates which channel currently has focus

This enables:
- One shared "perception pass" (overlap + ellipse + scoring)
- Two independent query channels evaluated from the same input

### Winner code
`WinnerCode` values:
- `0` = none
- `1` = Target has current focus
- `2` = Interactable has current focus

Symmetry:
- If `WinnerCode == 1`, Target is the current focus and Interaction is secondary.
- If `WinnerCode == 2`, Interaction is the current focus and Target is secondary.

### Focus switching
When not locked:
- The component's `PrimaryTarget` is driven by the **current focus winner**.
When locked:
- Target candidate is frozen to the locked one.
- Interaction continues to evaluate normally.

---

## 4) Candidate selection (runtime details)

### Candidate pool
- Uses `UKismetSystemLibrary::SphereOverlapActors` around the owner character.

### Screen-space filtering
- Each candidate is projected to screen.
- The candidate is kept only if it lies inside the configured ellipse.

### Scoring
- Score is the candidate's ellipse normalized distance (`EllipseDistNorm`).
- Lower score is better.

### Channel allow-list (target-side)
Target channel:
- Actor must implement `ERPTargetable`.
- `CanBeTargetedBy(TargetingActor)` must be `true`.

Interaction channel:
- Actor must implement `ERPInteractable`.
- `CanInteract(InteractingActor)` must be `true`.

### Initiator-side permissions (component hooks)
If a target-side interface passes, the component applies:
- `CanTargetActor(Actor)` for Target channel
- `CanInteractWithActor(Actor)` for Interaction channel

Defaults are `true`. Users override in BP or derived component classes.

---

## 5) Events: rules and expectations

### Acquired/Found and Lost
- A channel emits **Acquired/Found** when its best candidate changes to a new actor.
- A channel emits **Lost** when its previous best candidate is replaced (or becomes none).

Each event includes whether that actor **has/had current focus**.

### Focus-status-changed (without Lost)
Case handled explicitly:
- Winner changes (1 ↔ 2)
- But the candidate did not change (actor is still the channel's candidate)

Then the component emits:
- `OnTargetFocusStatusChanged(Target, bHasCurrentFocus)`
- `OnInteractableFocusStatusChanged(Interactable, bHasCurrentFocus)`

This is used to update UI/logic when a candidate becomes secondary/primary without disappearing.

---

## 6) Feature set recap

### Targeting (combat / lock)
- Primary target state + optional lock
- Events: acquired/lost + focus-status-changed
- No gameplay actions are executed by the plugin

### Interaction (UI)
- Best interactable tracking
- Events: found/lost + focus-status-changed
- No interaction is executed by the plugin

### Extensibility
- Override `CanTargetActor` and `CanInteractWithActor` (BP or derived component)
- Implement `ERPTargetable` / `ERPInteractable` on actors to opt-in

---

## 7) Non-goals (intentionally excluded)
- No UI prompts
- No input binding
- No gameplay orchestration
- No GAS dependencies
- No extra editor settings for permissions
