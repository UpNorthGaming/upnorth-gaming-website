---
name: javascript-rules
description: Conventions for the site's vanilla page scripts
globs: ["scripts/*.js"]
---

Every file in `scripts/` must be wrapped in an IIFE to avoid polluting the global scope:

```javascript
(function () {
    // all code indented inside
})();
```

Since the site uses plain `<script>` tags (no ES modules), the IIFE is the only scope boundary. All top-level variables and functions must live inside it.

- Use `var` and `function` declarations, four-space indents, and single quotes.
- No dependencies, modules, or build steps.
- Wrap every `localStorage` read and write in `try`/`catch`: storage throws in private modes and with blocked site data.
- Feature-detect rather than sniff user agents.
- Scripted scrolling honors `prefers-reduced-motion: reduce` (use `behavior: 'auto'`).
- `dark-mode.js`'s two theme colors must equal the theme sheets' `--bg` values.

See `scripts/AGENTS.md`.
