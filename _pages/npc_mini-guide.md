---
layout: page
title: NPC Mini-guide
include_in_header: false
include_in_footer: false
---

# FISSION Proto Modding Mini-Guide: NPC Creation  
> Add a Custom Critter (NPC, Creature, or Enemy)

This guide assumes you have a working mod folder (e.g., `mods/mod_mytown/`). You’ll add a new NPC that can be placed on maps, fight, talk, or follow the player.

---

## 1. What You Need

Your existing mod folder: `mods/mod_mytown/` (or `.dat`).  
You will create **two new files** for your critter:

- `proto/critters/critters_mytown.lst` – lists your custom critter file(s)
- `text/english/game/pro_crit_mytown.msg` – provides name and description

Plus the actual **`.pro` file** (binary prototype) – you can export it from the **Mapper** or copy and modify an existing one.

---

## 2. Create the Proto Definition File

**File:** `mods/mod_mytown/proto/critters/critters_mytown.lst`

```
myguard.pro
```

Each line is the name of a `.pro` file (without path). You can add multiple lines for several critters.

### Optional Overrides

After the filename, you can add `key=value` pairs to override certain fields:

```
myguard.pro fid=450 ai=3 script=12
```

| Override | Example | Meaning |
|----------|---------|---------|
| `fid` | `450` | Replace the creature’s appearance (art frame index) |
| `ai` | `3` | Override AI packet index (1?based, from `ai.txt`) |
| `script` | `12` | Override script index (1?based, from `scripts.lst`) |

> **Why overrides?** They let you reuse a base `.pro` file (e.g., a “human guard” template) but give it a unique look, AI, or behavior without duplicating the entire prototype.

---

## 3. Create the Message File

**File:** `mods/mod_mytown/text/english/game/pro_crit_mytown.msg`

Each critter gets **two consecutive entries**: name then description.

```
{0}{}{Town Guard}
{1}{}{A well?armed protector of the settlement.}
{2}{}{Bandit Leader}
{3}{}{The ruthless boss of a raider gang.}
```

- The first critter (`myguard.pro`) will use offsets `0` (name) and `1` (description).
- The second critter (second line in `.lst`) would use offsets `2` and `3`, etc.

> **Note:** The base ID for these messages is generated automatically from your mod name (`mytown`) and the type (`crit`). You don’t need to calculate anything.

---

## 4. Where to Put the `.pro` File

The `.pro` file must be placed in the **same folder** as the `.lst` file:

```
mods/mod_mytown/
?? proto/
?? critters/
?? critters_mytown.lst
?? myguard.pro
```

**How to get a `.pro` file:**
- **Option A:** Use the **Mapper** ? open the Proto Editor, create a new critter, save it as `myguard.pro` in the mod’s `proto/critters/` folder.
- **Option B:** Copy an existing vanilla `.pro` (e.g., from `proto/critters/`) into your mod folder and rename it. The PID inside the `.pro` file is **ignored** – FISSION generates its own stable PID from the mod name and filename.

---

## 5. Test Your Critter

1. Run the game once (or reload if already running).
2. Check `data/lists/proto_list.txt` – your critter should appear under “CRITTER MOD PROTOS”.
3. Find the generated PID (e.g., `33686018`). You can now use it in scripts:

```
variable npc_pid;
npc_pid := 33686018;   // use the number from proto_list.txt
create_object(npc_pid, tile, elevation);
```

Or place it directly in the Mapper using the PID from the report.

---

## 6. Important Notes
PID generation is stable – the same mod name + proto name always produce the same PID. You can safely hardcode the PID from proto_list.txt in your scripts.

The PID inside the .pro file is ignored – do not worry about what number it shows.

Hash collisions – if two different mods accidentally generate the same PID, a warning message box appears and the second critter is skipped. Rename your mod or proto to resolve.

Message IDs – each critter uses two consecutive IDs (name, description). The base ID is allocated per mod, so you never need to assign numbers manually.

AI packets – Standard AI packets are defined in ai.txt (vanilla: 0 = none, 1 = coward, 2 = aggressive, etc.). You can also add custom AI packets via modding.

---

## 7. Quick Troubleshooting

| Problem | Likely Fix |
|---------|-------------|
| Critter not in `proto_list.txt` | Check `.lst` filename matches `critters_mytown.lst` (with your mod name). |
| Name shows “Error!” | The `.msg` file is missing or offsets are wrong. Use `{0}` for first critter’s name, `{1}` for its description. |
| “Hash collision” popup | Another mod uses the same PID. Change your mod name or rename the proto file. |
| Art doesn’t show | Override `fid` to a valid FRM index, or make sure the art file exists. |
| NPC doesn’t fight | Check the `ai` override or the AI packet set in the `.pro` file. |
