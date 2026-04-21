---
layout: page
title: Mod
include_in_header: true
include_in_mod_header: true
include_in_footer: false
---

# Fallout FISSION Modding: Quick Start Guide  
> Get Your First Mod Running in About 10 Minutes

## 1. What is FISSION?

FISSION is a new engine for Fallout 2 that lets you add new content **without editing original game files**. You simply add your files inside a mod folder (or `.dat` archive) inside the `mods/` directory.

**Key Benefits:**
- No original file editing – just add new files
- Automatic, stable ID assignment – no manual number wrangling
- Built‑in testing reports – see exactly what the game loaded
- Works with vanilla saves – your mods are optional

## 2. Your First 'Location' Mod in 4 Steps

### Before You Start: Pick a Mod Name
Choose a short, unique name. Example: `mytown`  
This name goes in **all** your filenames. It will be used to generate unique, stable IDs for your mod’s assets.

### Step 1: Create Your Map
1. **Put FISSION** in your game directory and run it once – this creates the `mods/` folder.
2. **Open Mapper.exe** (original Fallout 2 location).
3. **Create a new map** or use a simple test map.
4. **Save it** with a name **8 characters or less** (e.g., `mytown1.map`).  
   ***Critical***: Map names longer than 8 characters will fail to load.
5. **Create a mod folder** inside `mods/` called `mod_mytown` (or `mod_mytown.dat` if you prefer a single archive).
6. **Export the `.map` file** to:  
   `mods/mod_mytown/data/MAPS/mytown1.map`  
   *(The `MAPS` folder must be uppercase.)*

### Step 2: Create These 4 Essential Files

#### File 1: `mods/mod_mytown/data/city_mytown.txt`

*(Defines your new location on the world map)*
```
[Area 0]
area_name = MYTOWN # UPPERCASE, globally unique name
world_pos = 400,300 # Where it appears on world map (x,y)
start_state = on # on, off
size = medium # small, medium, large (lowercase)
entrance_0 = on,100,200,MYMAP,-1,-1,0
```

**`entrance_0` field format (comma‑separated, in order):**

1. **`state`** – `on` or `off` (whether this entrance is available). Example: `on`
2. **`x`** – X coordinate of the entrance button on the town map (in pixels). Example: `100`
3. **`y`** – Y coordinate of the entrance button on the town map (in pixels). Example: `200`
4. **`lookup_name`** – Must match a `lookup_name` in your `maps_<modname>.txt` file. Example: `MYMAP`
5. **`elevation`** – Which map elevation to use (`-1` = any, or `0`, `1`, `2`). Example: `-1`
6. **`tile`** – Starting tile on the map (`-1` = random valid start point). Example: `-1`
7. **`rotation`** – Facing direction when entering (`0` = north, `2` = east, `4` = south, `6` = west). Example: `0`

#### File 2: `mods/mod_mytown/data/maps_mytown.txt` 

*(Defines your actual game map)*
```
[Map 0]
lookup_name = MYMAP # Matches entrance_0 above
map_name = mytown1 # Must match .map filename (no extension)
saved = yes # yes or no (lowercase)
automap = yes # yes or no (lowercase)
music = fs_grand # Optional: music track name
```

**Connection:** `entrance_0` in `city_mytown.txt` references `lookup_name` in `maps_mytown.txt`.

#### File 3: `mods/mod_mytown/text/english/game/map_mytown.msg`

*(Map elevation names + area name)*
```
# Map elevation names (3 per map, sequential)
{0}{}{Town Gate}
{1}{}{Town Interior}
{2}{}{Town Basement}

# Area name (starts at 1500)
{1500}{}{My Town}
```

***Important***: Each map uses **three consecutive IDs** (elevations 0,1,2).  
If you add a second map, its elevations start at `{3}{}{...}`, `{4}{}{...}`, `{5}{}{...}`.

#### File 4: `mods/mod_mytown/text/english/game/worldmap_mytown.msg`

*(Town map entrance labels – one per entrance)*
```
{0}{}{My Town - Main Gate}
```

Each `entrance_X` gets one label, in the same order as defined in `city_mytown.txt`.

---

## 3. Where to Put All Files

Your mod folder (or `.dat` archive) must mirror the game’s original structure:

```
Fallout 2/
└─ mods/
    └─ mod_mytown.dat/ <- can be a folder or actual .dat file
        ├─ data/
        │   ├─ city_mytown.txt
        │   ├─ maps_mytown.txt
        │   └─ MAPS/
        │       └─ mytown1.map
        └─ text/
            └─ english/
                └─ game/
                    ├─ map_mytown.msg
                    └─ worldmap_mytown.msg
```

**Notes:**
- The `mods/` folder is created automatically the first time you run FISSION.
- Your mod folder **must** start with `mod_` (e.g., `mod_mytown`).
- It can be a normal folder (for easy editing) or a `.dat` archive (for distribution).

---

## 3.5 (Optional) Add Mod Metadata & an Icon

FISSION can display your mod in an in‑game **Loaded Mods** mod list (accessible from the main menu FISSION icon). To give your mod a name, description, author credit, and an icon, create a simple configuration file.

### Step A: Create `mods/mod_mytown/data/mod_mytown.cfg`

```
[mod_info]
name = mytown
description = Adds a new settlement called My Town with custom quests.
author = YourName
dependencies = anothermod, thirdmod
```

- **`name`** – Internal name of your mod. **Must be the same as your mod folder name without the `mod_` prefix** (e.g., `mytown`). No spaces or special characters. This is used to generate a stable ID for the mod icon.
- **`description`** – Short description (shown when the mod is selected in the list).
- **`author`** – Your name or alias.
- **`dependencies`** – (Optional) Comma‑separated list of other mod **internal names** that your mod works with or requires. This is **informational only** – it tells players which other mods they should install. The engine does not enforce this list.

> **How to actually check for another mod in your scripts:**  
> Use the `art_exists` opcode with the other mod’s icon FID. The icon FID is generated from the mod’s internal name (the same as the `name` field above). For example, to check if `anothermod` is installed:
> ```
> variable fid;
> fid := build_fid(OBJ_TYPE_INTERFACE, art_get_stable_index("anothermod"), 0, 0, 0);
> if (art_exists(fid)) then
>     // anothermod is present – enable cross‑mod features
> endif
> ```
> This allows your mod to conditionally add content that relies on another mod’s assets.

### Step B: Add the Icon to the Interface Art List

Create an art list file for the interface category:

**File:** `mods/mod_mytown/art/intrface/intrface_mytown.lst`

```
mytown.frm
```

Each line is the filename of an interface `.frm` file (one per line). The name must match the `name` field from your `.cfg` file.

### Step C: Place the Icon File

Put your custom icon `.frm` file in the same folder as the `.lst` file:

```
mods/mod_mytown/art/intrface/mytown.frm
```

- Recommended size: **140×116** pixels (same size as perk/trait/karma fallout boy images).
- The icon appears next to your mod in the mod list.

If you omit the icon, it will be blank.

**That’s it!** Your mod will now appear with proper metadata and an icon in the mod list, making it easier for players to identify and manage.

---

## 4. Test Your Mod

### Test 1: Check the Reports

Run the game once, then look in `data/lists/` (inside the game’s root folder – **not** inside your mod):

- **`area_list.txt`** – Your area “MYTOWN” should be listed.
- **`maps_list.txt`** – Your map “MYMAP” should be listed.

If both appear, your mod loaded successfully!

### Test 2: Play Your Mod

1. Start a new game or load a save.
2. Enter the world map.
3. Travel to coordinates **400,300**.
4. You should see a circle labelled “My Town”.
5. Click the circle to enter – you’ll load into `mytown1.map`.
6. The location name should show “Town Gate” (elevation 0).

If you can walk around your map, your mod is working!

---

## 5. Common Mistakes & Troubleshooting

| Problem | Likely Fix |
|---------|-------------|
| “Cannot load map” error | `map_name` in `maps_mytown.txt` must exactly match the `.map` filename (no extension, ≤8 chars). |
| Area not on world map | Check `area_list.txt`. If missing, your `city_mytown.txt` has a syntax error. |
| Can’t enter area | Verify `entrance_0` references the correct `lookup_name`. |
| Map name shows “Error!” | Your `map_mytown.msg` elevation offsets are wrong (must be 0,1,2 for first map). |
| No reports generated | The game didn’t load your mod – check that your mod folder is named `mod_xxx` and is inside `mods/`. |

**Remember:** All text values are case‑insensitive, but it’s safest to use **lowercase** for `on`/`off`, `yes`/`no`, `small`/`medium`/`large`.

---

## 6. What’s Next?

### Add a Second Map to the Same Area

Add another entrance in `city_mytown.txt`:

```
entrance_1 = on,200,200,MYMAP2,-1,-1,0
```

Add a new map definition in `maps_mytown.txt`:

```
[Map 1]
lookup_name = MYMAP2
map_name = mytown2
saved = yes
automap = yes
```

Extend `map_mytown.msg` with the three elevation names for the second map (offsets 3,4,5):

```
{3}{}{Underground Entrance}
{4}{}{Underground Tunnels}
{5}{}{Hidden Vault}
```

---

## 7. Final Notes

- **Mod name stability:** If you change your mod’s name after starting a game, saved games will no longer recognise your mod’s content. Choose a name once and keep it. Hashed IDs will also be changed, breaking some of your content.
- **`lookup_name` uniqueness:** Avoid using common names like “VAULT13”. Use a prefix like `MYTOWN_MAP1` to prevent accidental overrides with other mods.
- **No manual ID assignment:** FISSION calculates and assigns stable IDs automatically from your mod’s name and the order of items in your files.

---

## 8. What's Next?

Once your basic location mod is working, expand it with these additional features:

| Topic | Guide | Description |
|-------|-------|-------------|
| **Quests** | [Quest Mini‑Guide](https://cambragol.github.io/fallout-fission/quest_mini-guide) | Add Pip‑Boy tracked quests to your location |
| **Global Variables (GVARs)** | [Using GVARs](#) | Manage persistent flags and quest states |
| **Scripts** | Scripting Guide | Add custom behavior with `.int` scripts |
| **Proto Items** | [Item Mini-Guide](https://cambragol.github.io/fallout-fission/item_mini-guide) | Create new weapons, armor, or misc items |
| **Proto Critters** | [NPC Mini-Guide](https://cambragol.github.io/fallout-fission/npc_mini-guide) | Design custom NPCs with unique stats and looks |
| **Holodisks** | Holodisk Guide | Add readable text entries to the Pip‑Boy |
| **Art & FRMs** | Art Guide | Import custom interface graphics and sprites |
