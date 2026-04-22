---
layout: modpage
title: Companions Mini-guide
include_in_header: false
include_in_footer: false
---

# FISSION Companion Mini‑Guide  
> Add Custom Followers That Level Up with the Player

This guide assumes you have a working mod folder (e.g., `mods/mod_mytown.dat/` from the Quick Start Guide). You’ll add a new NPC who can join the player’s party, gain levels, and have configurable combat preferences.

---

## 1. What Are FISSION Companions?

Companions are critters that can be recruited into the player’s party. They:

- Follow the player and fight alongside them.
- **Level up** when the player gains enough levels (based on `level_up_every`).
- Can have **multiple stages** (different prototypes for different levels).
- Support **AI behaviour preferences** (aggression, weapon choice, distance, etc.).
- Are saved with the game and persist across sessions.

**Vanilla companions** are defined in `data/party.txt`.  
**Mod companions** are defined in `data/party_<modname>.txt` (e.g., `party_mytown.txt`).

---

## 2. What You Need

Your existing mod folder: `mods/mod_mytown.dat/`. (a folder for development, compress into actual .dat for release)

You will create **one new file**:

- `data/party_mytown.txt` – defines your companion(s)

Plus the **prototypes** (`.pro` files) for each level stage (optional – you can reuse the same prototype).

---

## 3. Create the Companion Definition File

**File:** `mods/mod_mytown/data/party_mytown.txt`

```
[Party Member 0]
party_member_pid = 0x1002000
level_up_every = 3
level_minimum = 3
level_pids = 0x1002000, 0x1002001, 0x1002002
area_attack_mode = be_sure, sometimes
attack_who = strongest, closest
best_weapon = ranged_over_melee
chem_use = stims_when_hurt_little
distance = stay_close
run_away_mode = bleeding
disposition = aggressive
```

**Explanation of fields:**

| Field | Meaning |
|-------|---------|
| `party_member_pid` | The PID of the companion’s prototype (e.g., from `proto_list.txt`). |
| `level_up_every` | How many player levels the companion needs to gain one level (e.g., `3` = every 3 player levels). |
| `level_minimum` | Minimum player level required for the companion to start leveling. |
| `level_pids` | Comma‑separated list of prototype PIDs for each companion level (stage 0, stage 1, …). The first is the starting prototype. |
| `area_attack_mode` | Comma‑separated list of allowed area attack modes: `always`, `sometimes`, `be_sure`, `be_careful`, `be_absolutely_sure`. |
| `attack_who` | Target selection: `whomever_attacking_me`, `strongest`, `weakest`, `whomever`, `closest`. |
| `best_weapon` | Weapon preference: `no_pref`, `melee`, `melee_over_ranged`, `ranged_over_melee`, `ranged`, `unarmed`, `unarmed_over_thrown`, `random`. |
| `chem_use` | Drug usage: `clean`, `stims_when_hurt_little`, `stims_when_hurt_lots`, `sometimes`, `anytime`, `always`. |
| `distance` | Combat distance: `stay_close`, `charge`, `snipe`, `on_your_own`, `stay`. |
| `run_away_mode` | When to flee: `none`, `coward`, `finger_hurts`, `bleeding`, `not_feeling_good`, `tourniquet`, `never`. |
| `disposition` | Personality: `none`, `custom`, `coward`, `defensive`, `aggressive`, `berserk`. |

**All fields are optional** except `party_member_pid`. If omitted, the companion will use default values.

---

## 4. Creating the Companion Prototypes

You need at least one prototype for the companion (the starting one). If you want level‑up progression, create additional prototypes (e.g., `companion1.pro`, `companion2.pro`, etc.) and list them in `level_pids` in order.

- Use the **Item/Critter Mini‑Guides** to create the prototypes.
- Place the `.pro` files in your mod’s `proto/critters/` folder and list them in `critters_mytown.lst` (see [Critter Mini‑Guide](https://cambragol.github.io/fallout-fission/npc_mini-guide)).

---

## 5. Making the Companion Join the Party

In your **global script** or **map script**, use the `party_member_add` function when the player recruits the NPC:

```
// In a dialog or map script
procedure recruit_npc begin
    variable npc;
    npc := self_obj;   // the NPC object the player is talking to
    party_member_add(npc);
end
```

You can also create the NPC on the fly:

```
variable npc;
npc := create_object_sid(PID_MY_COMPANION, tile, elevation, SCRIPT_MyCompanion);
party_member_add(npc);
```

After adding, the NPC will follow the player, fight with them, and level up automatically.

---

## 6. Testing Your Companion

1. Create the companion prototype(s) and the `party_mytown.txt` file.
2. Place the companion on a map (or spawn via script).
3. Talk to the companion and use `party_member_add(self_obj)`.
4. Gain player levels (e.g., via `set_global_var(GVAR_PLAYER_LEVEL, ...)` or kill enemies).
5. Observe the companion’s level‑up messages and improved stats.

Check `data/lists/party_list.txt` (if generated) to verify your companion was loaded.

---

## 7. Important Notes

- **Stable IDs** – Mod companions are assigned a stable hash based on the mod name and section name (`Party Member 0`). This ensures save compatibility.
- **Collisions** – If two mods define a companion with the same hash, a popup appears and the second is skipped. Change your mod name or section name to resolve.
- **No message list** – Level‑up messages are read from `misc.msg` using the formula above. You can add them to your mod’s `misc_mytown.msg` if you load it as an extra message list.
- **Level‑up prototypes** – The prototypes in `level_pids` must be valid PIDs. The companion’s appearance, stats, skills, and hit points are replaced with the new prototype’s values.
- **Saving** – Companions are saved with the game. If you remove a mod companion from a save, it will be missing on load (gracefully ignored).

---

## 8. Quick Troubleshooting

| Problem | Likely Fix |
|---------|-------------|
| Companion doesn’t join | Ensure you call `party_member_add` with a valid object (not the player). |
| Companion doesn’t follow | Check that the object is not dead or hidden. |
| No level‑up messages | Add the messages to `misc.msg` (or your extra message list) with the correct IDs. |
| Companion stats don’t improve | The `level_pids` list must have at least one prototype. Check that the PIDs exist. |
| “Hash collision” popup | Another mod uses the same companion slot. Rename your mod or section. |