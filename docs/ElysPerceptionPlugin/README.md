# ElysPerceptionPlugin Documentation

> 🌐 **For the best viewing experience, visit our [Docusaurus documentation website](https://rogueparadigm.github.io/ElysPerceptionPlugin/)** with search, navigation, and responsive design! 🦕

Welcome to the ElysPerceptionPlugin documentation. This guide will help you understand and use the plugin's Pipeline-based perception system.

## 📚 Documentation Overview

### For New Users

Start here if you're new to the plugin:

1. **[Getting Started](GettingStarted.md)** - Installation, quick start, and first pipeline setup
2. **[Examples](Examples.md)** - Practical examples and common patterns

### For Understanding the System

Learn how the plugin works under the hood:

3. **[Pipeline Architecture](Pipeline-Architecture.md)** - Detailed explanation of the Pipeline system, context, and extensibility

### Reference Materials

Detailed API documentation:

4. **[API Reference](API-Reference.md)** - Complete reference for all classes, interfaces, and events

### For Plugin Developers

Internal technical documentation:

5. **[Internal Plugin State](Internal-PluginState.md)** - Technical snapshot for plugin maintainers (internal use)

---

## 🚀 Quick Navigation

### I want to...

**Get started quickly**
→ [Getting Started - Quick Start](GettingStarted.md#quick-start)

**Understand how pipelines work**
→ [Pipeline Architecture - Overview](Pipeline-Architecture.md#overview)

**See working examples**
→ [Examples](Examples.md)

**Look up a specific class**
→ [API Reference](API-Reference.md)

**Create a custom scorer**
→ [Pipeline Architecture - Extensibility](Pipeline-Architecture.md#extensibility)  
→ [Example 4: Custom Scorer](Examples.md#example-4-custom-scorer---health-priority)

**Set up multi-channel perception**
→ [Example 3: Multi-Channel Setup](Examples.md#example-3-multi-channel-setup)

**Troubleshoot issues**
→ [Getting Started - Troubleshooting](GettingStarted.md#common-pitfalls--troubleshooting)

---

## 📖 Documentation Files

| File | Description | Audience |
|------|-------------|----------|
| [GettingStarted.md](GettingStarted.md) | Installation, setup, and first pipeline configuration | Beginners, all users |
| [Pipeline-Architecture.md](Pipeline-Architecture.md) | In-depth explanation of the Pipeline system | Intermediate users, developers |
| [API-Reference.md](API-Reference.md) | Complete API documentation for all classes | All users, reference |
| [Examples.md](Examples.md) | Practical examples and code samples | All users, implementers |
| [Internal-PluginState.md](Internal-PluginState.md) | Technical state document for maintainers | Plugin developers only |

---

## 🎯 Suggested Reading Order

### For Blueprint Users

1. [Getting Started](GettingStarted.md) - Focus on Blueprint sections
2. [Examples - Basic Target Lock](Examples.md#example-1-basic-target-lock-system) - Blueprint implementation
3. [Examples - Interaction System](Examples.md#example-2-interaction-system-with-ui-prompts) - Blueprint implementation
4. [API Reference](API-Reference.md) - Reference as needed

### For C++ Developers

1. [Getting Started - C++ Example](GettingStarted.md#c-example)
2. [Pipeline Architecture](Pipeline-Architecture.md) - Complete understanding
3. [Examples - Custom Components](Examples.md#example-4-custom-scorer---health-priority) - C++ custom implementations
4. [API Reference](API-Reference.md) - Complete API details

### For Advanced Users

1. [Pipeline Architecture](Pipeline-Architecture.md) - Full architecture knowledge
2. [Pipeline Architecture - Extensibility](Pipeline-Architecture.md#extensibility) - Creating custom components
3. [Examples - Advanced Scoring](Examples.md#example-6-advanced-scoring---weighted-combination) - Complex setups
4. [API Reference](API-Reference.md) - Deep API knowledge

---

## 🔑 Key Concepts

### Pipeline System

The plugin uses a **modular Pipeline architecture** with five stages:

1. **Sampler** - Collects candidate actors from the world
2. **Filter** - Eliminates invalid candidates (ALL must pass)
3. **Scorer** - Assigns scores to each candidate
4. **Aggregator** - Combines multiple scores into one
5. **Resolver** - Selects the winning candidate

Each stage is pluggable and can be customized or replaced.

### Multi-Channel

The plugin supports **multiple independent channels**:
- **Target Channel** - Combat targeting, lock-on
- **Interaction Channel** - UI prompts, object interaction
- **Custom Channels** - Add your own (healing targets, etc.)

Each channel runs its own pipeline and maintains its own best candidate.

### Context-Driven

All pipeline stages receive an **immutable context** containing:
- Origin and forward direction
- Optional aim ray
- Optional viewport projection data

This ensures consistent evaluation across all stages.

### Opt-In Interfaces

Actors opt into perception by implementing interfaces:
- `IERPTargetable` - Can be targeted
- `IERPInteractable` - Can be interacted with

This gives target-side actors control over their detectability.

---

## 🛠️ Common Use Cases

| Use Case | Documentation | Example |
|----------|---------------|---------|
| Basic target lock system | [Getting Started](GettingStarted.md) | [Example 1](Examples.md#example-1-basic-target-lock-system) |
| Interaction prompts | [Getting Started - Blueprint](GettingStarted.md#blueprint-example) | [Example 2](Examples.md#example-2-interaction-system-with-ui-prompts) |
| Priority-based targeting | [Pipeline Architecture](Pipeline-Architecture.md) | [Example 4](Examples.md#example-4-custom-scorer---health-priority) |
| Line-of-sight filtering | [Custom Filters](Pipeline-Architecture.md#custom-filter) | [Example 5](Examples.md#example-5-custom-filter---line-of-sight) |
| Multi-factor scoring | [Custom Aggregators](Pipeline-Architecture.md#custom-aggregator) | [Example 6](Examples.md#example-6-advanced-scoring---weighted-combination) |
| Multiple target types | [Multi-Channel](Pipeline-Architecture.md#multi-channel-support) | [Example 3](Examples.md#example-3-multi-channel-setup) |

---

## 💡 Tips

- **Start Simple**: Begin with default implementations before creating custom components
- **Use Debug Visualization**: Enable `bDebugFocus` to see what the system is detecting
- **Normalize Scores**: Keep scores in 0.0-1.0 range for easier combination
- **Filter Early**: Use filters to reject candidates quickly before expensive scoring
- **Test Independently**: Test custom pipeline components in isolation first

---

## 🐛 Troubleshooting

Having issues? Check the [Troubleshooting section](GettingStarted.md#common-pitfalls--troubleshooting) in Getting Started.

Common issues:
- **Targets not detected** → Check interface implementation and filters
- **Events not firing** → Verify event binding and focus state
- **Performance issues** → Reduce range, optimize filters, adjust tick rate
- **Null references** → Validate pipeline objects are not null

---

## 📝 Contributing

Found an error in the documentation? Want to add examples?

This documentation is maintained as part of the ElysPerceptionPlugin repository. Contributions and feedback are welcome.

---

## 📜 Version

**Plugin Version:** 1.0  
**Documentation Updated:** January 2026  
**Compatible With:** Unreal Engine 5.0+

---

**Need Help?** Start with [Getting Started](GettingStarted.md) and work through the examples!
