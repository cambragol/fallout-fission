---
layout: page
title: Install
include_in_header: true
include_in_footer: true
---

# Install Fallout: F.I.S.S.I.O.N.

## Prerequisites
You must own **Fallout 2** (GOG, Steam, or Epic Games version) and have it fully installed. F.I.S.S.I.O.N. is a drop-in replacement for `Fallout2.exe` and requires the complete game data.

**Supported base installations:**
- **Vanilla Fallout 2** - The classic game
- **Fallout: Nevada** - Russian total conversion mod
- **Fallout: Sonora** - Russian total conversion mod

## Quick Installation
1. **Ensure you have a working vanilla Fallout 2 installation**
2. **Download** the latest <a class="pill" href="https://github.com/cambragol/fallout-fission-release/releases/tag/0.9">F.I.S.S.I.O.N. release</a>
3. **Extract** the F.I.S.S.I.O.N. files into your Fallout 2 folder
4. **Run** `fallout-fission.exe` (Windows) or `fallout-fission.app` (macOS) instead of the original executable

That's it! F.I.S.S.I.O.N. automatically loads all existing content and adds its enhanced modding capabilities.

## Platform-Specific Instructions

### macOS

```
# Example: Using a GOG Fallout 2 installation
# 1. Right-click Fallout2.app → "Show Package Contents"
# 2. Navigate to Contents/Resources/Data/
# 3. Extract F.I.S.S.I.O.N. files here
# 4. Run fallout-fission.app
```

### Windows (limited support)

```
# Example: Installing into a Steam Fallout 2 installation
# 1\. Navigate to your Fallout 2 folder (typically):
cd "C:\Program Files (x86)\Steam\steamapps\common\Fallout 2"
# 2\. Extract F.I.S.S.I.O.N. files here
# 3\. Run fallout-fission.exe
```

### Linux (limited support)

```
# Example: Using a Wine Fallout 2 installation
# 1. Navigate to your Fallout 2 Wine prefix
cd ~/.wine/drive_c/Program\ Files/Fallout\ 2/
# 2. Extract F.I.S.S.I.O.N. files
# 3. Run with: wine fallout-fission.exe
```

## Expected Folder Structure

After installation, your Fallout 2 folder should contain:

```
Fallout 2/
├── fallout-fission.exe       # F.I.S.S.I.O.N. executable (Windows)
├── fallout-fission.app       # F.I.S.S.I.O.N. application (macOS)
├── fission.dat               # Engine data file
├── master.dat                # Original game data
├── critter.dat               # Original game data
├── patch000.dat              # Patch data (if present)
├── data/                     # Game data folder
│   ├── proto/                # Proto files (vanilla + mods)
│   ├── text/                 # Text files (vanilla + mods)
│   ├── maps/                 # Map files
│   └── data/lists/           # Auto-generated mod reports (created on first run)
```

## Important Notes

-   F.I.S.S.I.O.N. does NOT include game data - you must own Fallout 2

-   Your existing saves will work - F.I.S.S.I.O.N. maintains full compatibility

-   No configuration needed for basic use - just replace the executable

---

## Configuration

Use the in-game 'preferences' screen for 'graphics' configuration.

Other configuration can be done fia the fallout2.cfg file.

For advanced tweaks, use the [sfall] sections in 'fallout2.cfg' (Sfall):

```
[sfall-misc]
WorldMapTravelMarkers=1
GaplessMusic=1
EnhancedBarter=1
```
---

## Mod/Game Compatibility

**Fully supported**:
- Fallout 2
- Fallout: Nevada
- Fallout: Sonora

**Not supported yet, maybe never**:
- Fallout 1
- Fallout Nevada or Sonora 'repacks'
- Restoration Project
- Fallout: Et Tu
- Olympus 2207
- Resurrection, Yesterday (untested)

(For full Fallout 1 support see [Fallout1-CE](https://github.com/alexbatalov/fallout1-ce).)

---
