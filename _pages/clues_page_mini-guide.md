---
layout: modpage
title: Clues System Mini-guide
include_in_header: false
include_in_footer: false
---

# FISSION Clues System Mini-Guide  
> Add Readable Articles, Images, and Cross?Links to the Pip?Boy

This guide assumes you have a working mod folder (e.g., `mods/mod_mytown.dat/` from the Quick Start Guide). You’ll add articles that appear under the **CLUES** tab in the Pip?Boy.

---

## 1. What You Need

Your existing mod folder: `mods/mod_mytown.dat/`. (a folder for development, later compressed into a `.dat` file for release).

You will create **one or more `.txt` files** – each file is a separate article. Optionally, you can also add **FRM images** to display inside articles.

---

## 2. Creating a Clues Article File

**File location:** `mods/mod_mytown/text/english/clues/` (or `text/<language>/clues/` for other languages).

**Naming:** Any filename ending with `.txt` (e.g., `my_note.txt`, `secret_plans.txt`). Duplicate titles are ignored.

**Format:**
- **First line:** The article title (max 255 characters).
- **Following lines:** The article content (plain text with optional markup, see below).

**Example – `my_note.txt`:**

```
A Mysterious Note
I found this note behind the old safe. It reads:

The combination is 42-17-36.

I should check the [[Security Terminal]] for more clues.
```

---

## 3. Formatting and Markup

Your article content supports the following markup:

| Markup | Effect |
|--------|--------|
| `*text*` | **Bold** text (rendered in a lighter green). |
| `_text_` | <u>Underlined</u> text. |
| `[[Target Title]]` | A clickable link to another article. The target must match the title of another article (case?insensitive; spaces and punctuation are preserved). |
| `[img:filename]` | Inserts an image. `filename` is the name of a `.frm` file (without extension) placed in `art/clues/`. The image will be scaled to fit the Pip?Boy screen and rendered with a green CRT effect. |

**Combining markup:** You can use bold and underline together (e.g., `*_important_*`). Links cannot be nested inside bold/underline – they are detected separately.

**Example with all markup:**

```
The Vault Door
[img:vault_door]

The door is sealed with a high?security lock.
I found a note saying: the code is 42-17-36.

Maybe [[The Security Terminal]] has more info.
```

---

## 4. Where to Put Everything

```
mods/mod_mytown/
?? art/
?   ?? clues/
?       ?? vault_door.frm
?       ?? terminal.frm
?? text/
    ?? english/
        ?? clues/
            ?? my_note.txt
            ?? security_terminal.txt
            ?? ...
```

- **Article files** go in `text/<language>/clues/` (e.g., `text/english/clues/`).
- **Images** go in `art/clues/` and must be Fallout FRM files (palette?indexed). The system will convert them to green shades automatically.

**Language fallback:** If the current game language is not English and the `clues/` folder for that language is missing, the system falls back to `text/english/clues/`.

---

## 5. Testing Your Clues

1. Run the game with your mod loaded.
2. Open the Pip?Boy (`P` key) and click the **CLUES** tab (the one with the journal icon).
3. Your article titles should appear in the list.
4. Click an article to read it – links will be clickable and images will be rendered.

If something goes wrong, check `data/lists/clues_list.txt` – it lists every loaded article with its title and file path.

---

## 6. Important Notes

- **Title uniqueness:** Articles with duplicate titles are ignored (only the first one loaded is kept). Titles are case?insensitive for duplicate checking and link matching.
- **Link resolution:** Links (`[[Target Title]]`) are resolved at runtime. If the target is not found, the link will still be drawn but will not be clickable.
- **Page breaks:** Articles are automatically paginated – the system inserts page breaks when the content exceeds the screen height. You do not need to add manual page markers.
- **Image rendering:** Images are displayed in the center of the screen, with a retro scanline effect and contrast?stretched green palette. The `blackThreshold` (currently 4) skips very dark pixels to preserve the Pip?Boy background.
- **Performance:** For large images, keep them under 350×410 pixels (the content area size). Larger images are clipped.

---

## 7. Quick Troubleshooting

| Problem | Likely Fix |
|---------|-------------|
| Article not in list | Ensure the `.txt` file is in the correct `clues/` folder and has a first line (title). Check `clues_list.txt` for errors. |
| Title shows “Error!” | The file is missing or the first line is empty. |
| Links don’t work | The target title does not match exactly (case and spaces count). Use the exact title as it appears in the target file. |
| Image not showing | Image file (`.frm`) must be in `art/clues/`. The filename in `[img:filename]` must match exactly (no extension). |
| Image appears all dark | The image might have low contrast. The system stretches contrast automatically, but if the image is mostly black, it will be dark. Try using brighter FRMs. |
| “Hash collision” popup | Not applicable – clues do not use hash?based IDs. If you see it, it’s from another system (e.g., items or holodisks). |

---

## 8. Advanced: Customizing the Green Palette

The green rendering uses a hardcoded palette array in the code (`greenPalettes[]`). If you want to change the shades, you would need to modify the source and recompile. This is not recommended for most modders – the default palette works well for typical FRM images.

If you find the images too dark or too bright, you can adjust the contrast by editing the `blackThreshold` value (currently `4`) in `cluesRenderImage` – but again, that’s a code change.