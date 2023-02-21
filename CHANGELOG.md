# Sentinel Changelog

All notable changes to this project will be documented in this file.

The format is based on [Keep a Changelog][kac], and this project adheres to
[Semantic Versioning][semver].

[kac]: https://keepachangelog.com/en/1.1.0/
[semver]: https://semver.org/spec/v2.0.0.html

## [Unreleased]

### Added

- A basic baseplate level with empty terrain
- Centralized remote event and function creation/access
- Tracked ID attributes between client/server
  - The server uses `serverEntityId`
  - The client uses `clientEntityId`
  - Otherwise `unknownEntityId` is used
- A component system along with component types
- Spawning for tagged components based on a set of tags bound to their
  associated components
- The ECS global state
- Replication handling
  - No replication is currently performed. This will come later with a
    replication system.
- Systems loading and hot reloading
  - Systems will automatically load in their correct environments
  - They will hot reload in a live synced game as they're updated
- Initialization for the matter ECS
- Core ECS systems
  - `updateIdAttribute`
  - `removeMissingModels`
  - `updateTransforms`
  - `replication`
