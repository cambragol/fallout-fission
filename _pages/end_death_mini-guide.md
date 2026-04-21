---
layout: modpage
title: End Death Mini-guide
include_in_header: false
include_in_footer: false
---

# FISSION Death Ending Mini‑Guide  
> Add Custom Death Endings (Slideshow + Voice Over)

This guide assumes you have a working mod folder (e.g., `mods/mod_mytown.dat/` from the Quick Start Guide). You’ll add new death endings that play when the player dies under specific conditions.

---

## 1. What You Need

Your existing mod folder: `mods/mod_mytown.dat/` (a folder for development, compress into actual .dat for release)

You will create **one new file**:

- `data/enddeath_mytown.txt` – defines the death ending(s)

Plus optional art (`.frm`) and voice‑over (`.acm` / `.wav`) files.

---

## 2. Create the Death Ending Definition File

**File:** `mods/mod_mytown/data/enddeath_mytown.txt`

Format: GVAR, Value, AreaKnown, AreaNotKnown, MinLevel, Percentage, VoiceOverBase

```
79, 1, -1, -1, 0, 30, nar_mytown_death
```

**Fields explained:**

| Field | Example | Meaning |
|-------|---------|---------|
| `GVAR` | `79` | Global variable that must be **less than** `Value` for this ending to be eligible. Use `-1` to ignore. |
| `Value` | `1` | Threshold – if `GVAR < Value` the ending is eligible. |
| `AreaKnown` | `-1` | Worldmap area index that **must be known** (visited). Use `-1` to ignore. |
| `AreaNotKnown` | `-1` | Worldmap area index that **must NOT be known**. Use `-1` to ignore. |
| `MinLevel` | `0` | Minimum player level required. |
| `Percentage` | `30` | Weighted chance (0‑100) when multiple endings are eligible. |
| `VoiceOverBase` | `nar_mytown_death` | Base filename of the narrator audio (no extension). |

If multiple endings are eligible, one is chosen randomly based on their `Percentage` weights.

---

## 3. Where to Put the Files

```
mods/mod_mytown/
        ├─ data/
        │   └─ enddeath_mytown.txt
        ├─ art/
        │   └─ intrface/
        │       └─ mydeath.frm (optional – custom slide art)
        └─ narrator/
            ├─ nar_mytown_death.acm (or .wav)
            └─ (optional language subfolder)
```

**Note:** The art used for death endings is **hardcoded** (the game shows the static, iconic, “YOU HAVE DIED” screen). Your custom death endings only affect the **voice‑over** that plays, (and subtitles), not the visual. The `VoiceOverBase` determines which audio file plays after death.

---

## 4. How It Works

- When the player dies, the game evaluates all death endings.
- An ending is eligible if:
  - `GVAR < Value` (or `GVAR == -1` skip)
  - `AreaKnown` is visited (or `-1`)
  - `AreaNotKnown` is **not** visited (or `-1`)
  - Player level ≥ `MinLevel`
- Among eligible endings, one is picked randomly using the `Percentage` as weight.
- The game then plays the audio file `narrator/<VoiceOverBase>.<ext>` (`.acm` or `.wav`).

---

## 5. Triggering a Death Ending from Scripts

Set the relevant GVAR(s) before the player dies. For example, to enable a special death ending:

```
set_global_var(79, 0);   // GVAR must be less than 1
```

If you want an ending that requires the player to have visited a certain area, set that area’s visited state via worldmap functions or by actually visiting it.

---

## 6. Test Your Death Ending

Run the game and trigger the conditions (e.g., set GVAR, reach required level, visit required area).

Kill the player (e.g., with kill_self debug command or in combat).

Listen for your custom voice‑over.

If the default death voice‑over plays instead, check data/lists/enddeath_list.txt to verify your ending loaded correctly.

---

## 7. Important Notes

No custom art – Death endings only change the audio. The “YOU HAVE DIED” screen is fixed.

Audio format – Use .acm (Interplay’s compression) or .wav. Place in narrator/ or narrator/<language>/ for localization.

Stable IDs – The game does not assign IDs to death endings; they are processed in file order.

Collisions – There is no hash collision system; multiple mods can add endings, and all are evaluated. Ensure your VoiceOverBase names are unique to avoid conflicts.

---

## 8. Quick Troubleshooting

| Problem | Likely Fix |
|---------|-------------|
| Ending not played | Check `data/lists/enddeath_list.txt` – your entry should appear. Verify conditions (GVAR, area, level). |
| Wrong audio plays | Another ending with higher weight was chosen. Adjust `Percentage` or make conditions stricter. |
| No audio at all | Audio file missing or wrong format. Place `.acm` in `narrator/` with correct base name. |
| Ending plays but conditions not met | Your `GVAR` or `Value` logic is reversed. Remember: `GVAR < Value` enables the ending. |