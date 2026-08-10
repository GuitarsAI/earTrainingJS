# index.html — two changes

---

## Change 1 — Add the `?` Help button to the header

Find this block (around line 20):

```html
      <button class="about-btn" id="aboutBtn" aria-label="About The Sound Travels">ℹ</button>
    </div>
```

Replace with:

```html
      <button class="about-btn" id="aboutBtn" aria-label="About The Sound Travels">ℹ</button>
      <button class="about-btn" id="helpBtn"  aria-label="Help">?</button>
    </div>
```

---

## Change 2 — Add the `helpView` div and script tags

Find this block (around line 174):

```html
  <!-- About view — shown when ⓘ is clicked, hidden otherwise -->
  <div id="aboutView" style="display:none">
```

Add the helpView div immediately BEFORE that block:

```html
  <!-- Help view — shown when ? is clicked, hidden otherwise -->
  <div id="helpView" style="display:none"></div>

  <!-- About view — shown when ⓘ is clicked, hidden otherwise -->
  <div id="aboutView" style="display:none">
```

---

Then find the script tags near the bottom:

```html
<script src="js/modes/about-mode.js"></script>
```

Replace with:

```html
<script src="js/modes/help-content.js"></script>
<script src="js/modes/help-mode.js"></script>
<script src="js/modes/about-mode.js"></script>
```

(`help-content.js` must load before `help-mode.js`; both before `about-mode.js` so the mutual-exclusion patch fires after About's listener is registered.)
