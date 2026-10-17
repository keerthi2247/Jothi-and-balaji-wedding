# Jotheeswari & Balaji Wedding Invitation

A responsive React + Vite wedding invitation website, styled with a romantic editorial photo-cover design and a gallery using the uploaded photos.

## Run locally
1. Install Node.js (LTS).
2. In this folder, run `npm install`.
3. Run `npm run dev` and open the local URL printed in the terminal.

## Build
Run `npm run build`. Vite outputs the deployable site in `dist/`.

## Deploy on Vercel
Import this project/repository into Vercel. Framework preset: Vite. Build command: `npm run build`. Output directory: `dist`.

## Personalization
- Wedding: 15 November 2026
- Reception: 14 November 2026
- Venue buttons open the direct Google Maps search for Selvam Mahal, 116 Radha Nagar Main Road, Chromepet, Chennai, Tamil Nadu 600044.
- No event timings are shown.
- Photos are stored under `public/photos/`.

## Background music
The music button plays `/public/bgm.mp3` if you add a royalty-free or licensed MP3 file with that exact name. Browsers require a visitor to tap Play Music before audio can start. The project does not bundle copyrighted music.

## Recent requested updates
- Replaced all six gallery/feature images with the latest supplied photos.
- Kept the romantic pose photo upright (it should not be rotated).
- Added bride and groom parent names in the invitation details.
- Added a two-column siblings page before the final thank-you page.
- Removed the duplicate cover date so the scratch card is the date reveal.
