# Sparky Changelog

All notable changes to the Sparky app. Updated automatically on deploy (or manually when needed).

---

## 2026‑03‑22
### Added
- **Discord task‑bot workflows** – GitHub Actions: posts to Discord on `tasks.md` changes (`tasks‑discord.yml`) and manual summary (`tasks‑summary.yml`)
- **Discord bot setup guide** – `DISCORD‑BOT‑SETUP.md` with webhook instructions
- **SPRINT.md** – weekly sprint board (wins/blockers/priorities)
- **CalculatorDisclaimer** wired into all 11 calculator components (commit `3e9c9c0`)

### Fixed
- **Wire Sizing calculator** – bug fixed (was returning #1 AWG for 20A load; now correct #12)
- **Circuit‑size toggle** added to Voltage Drop calculator (Load vs Circuit with 80% rule)
- **Field Mode** removed entirely (UI simplified)
- **ToS/Privacy links** added to More tab

### Changed
- **Rebrand** – kept “Sparky” as user‑facing name; “SparkyOnsite” used only in legal pages

## 2026‑03‑21
### Added
- **DisclaimerModal** – first‑use acknowledgment modal (commit `d601075`)
- **Terms of Service page** – California‑jurisdiction ToS (commit `fb0608f`)
- **Privacy Policy page** – CCPA‑compliant privacy policy (commit `c2a38e4`)
- **Safety disclaimer guidance** added to Ask Sparky system prompt (commit `042d19a`)

## 2026‑03‑18
### Added
- **Design system v2** – colors: #09090b bg, #18181b surface, #27272a border, #f97316 accent
- **Conduit bending calculator** – full rebuild with realistic SVGs, 7 bend types, 4 brands
- **Interactive draggable visualization** – for offset, 90°, 3‑/4‑pt saddles
- **NEC library** – expanded to 20 articles with enhanced search UI
- **Material Takeoff calculator** – NEC‑accurate quantities
- **Panel Schedule Builder** – visual schedule with phase balance
- **Job‑detail view** – full‑page job view with photo upload
- **Share‑card component** – 1080×1080 PNG cards via html2canvas

### Fixed
- **Sparky/Profile tab mapping** – corrected navigation
- **Dark‑mode toggle** – fixed CSS vars
- **Home tab** – credentials removed, jobs section added

---

## How to Update This File

Agents should append entries when deploying significant changes.

**Format:**
```
## YYYY‑MM‑DD
### Added|Fixed|Changed|Removed
- **Brief title** – description (optional commit hash)
```

**When to update:**
- New feature deployed
- Critical bug fix
- Design/system change
- Infrastructure update (Supabase, Vercel, Stripe)

**Automation goal:** Agent auto‑updates on successful Vercel deploy (future).

---

**Last updated:** 2026‑03‑22 (manual)  
**Next update:** On next deploy