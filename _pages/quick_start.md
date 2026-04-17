---
layout: page
title: Quick Start OFF
include_in_header: false
include_in_footer: false
---


# Fallout FISSION Modding: Quick Start Guide  
## Get Your First Mod Running in About 10 Minutes

---

## 1\. What is FISSION?

FISSION is a modding system for Fallout 2 that lets you add new content **without editing original game files**. You simply add your files inside a mod folder (or `.dat` archive) inside the `mods/` directory.

**Key Benefits:**
- No original file editing – just add new files
- Automatic, stable ID assignment – no manual number wrangling
- Built‑in testing reports – see exactly what the game loaded
- Works with vanilla saves – your mods are optional

---

## 2. Your First 'Location' Mod in 4 Steps

### Before You Start: Pick a Mod Name
Choose a short, unique name. Example: `mytown`  
This name goes in **all** your filenames. It will be used to generate unique, stable IDs for your mod’s assets.

### Step 1: Create Your Map
1. **Put FISSION** in your game directory and run it once – this creates the `mods/` folder.
2. **Open Mapper.exe** (original Fallout 2 location).
3. **Create a new map** or use a simple test map.
4. **Save it** with a name **8 characters or less** (e.g., `mytown1.map`).  
   ⚠️ **Critical**: Map names longer than 8 characters will fail to load.
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

- `entrance_0` fields:  
  `state` (on/off), `x`, `y` (town map button position), `lookup_name` (matches `lookup_name` in maps file), `elevation` (‑1 = any), `tile` (‑1 = random start), `rotation`.

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

⚠️ **Important**: Each map uses **three consecutive IDs** (elevations 0,1,2).  
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

## 4. Test Your Mod

### Test 1: Check the Reports

Run the game once, then look in `data/lists/` (inside the game’s root folder – **not** inside your mod):

- **`area_list.txt`** – Your area “MYTOWN” should be listed.
- **`maps_list.txt`** – Your map “MYMAP” should be listed.

If both appear, your mod loaded successfully!

### Test 2: Play Your Mod

1. Start a new game or load a save.
2. Open the world map (press `M`).
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

### Add More Content Types

Once your basic area works, you can add:

- **Quests** – `quests_<modname>.txt` + `quests_<modname>.msg`
- **Holodisks** – `holodisk_<modname>.txt`
- **Scripts** – `scripts/scripts_<modname>.lst` + `.int` files
- **Art** – `art/intrface/mod_<modname>.lst` + `.frm` files
- **Items** – `proto/items/items_<modname>.lst` + `.pro` files

### Use Generated IDs

Check the reports in `data/lists/` to find your mod’s IDs:

- Quest IDs for `op_set_quest(ID, state)`
- Message IDs for `display_msg(ID)`

---

## 7. Final Notes

- **Mod name stability:** If you change your mod’s name after starting a game, saved games will no longer recognise your mod’s content. Choose a name once and keep it. Hashed IDs will also be changed, breaking some of your content.
- **`lookup_name` uniqueness:** Avoid using common names like “VAULT13”. Use a prefix like `MYTOWN_MAP1` to prevent accidental overrides with other mods.
- **No manual ID assignment:** FISSION calculates stable IDs automatically from your mod’s name and the order of items in your files.

Happy modding!
