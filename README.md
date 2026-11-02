# JUICITO – website concept

React + Vite, GSAP (ScrollTrigger) and Lenis smooth scrolling.

## Run it

```bash
npm install
npm run dev      # local dev server
npm run build    # production build in /dist (deploy to Vercel / Netlify)
```

## What to edit

Everything the owner will want to change is in `src/data.js`:

- `PHONE` / `TEL` – the UAN number
- `INFO.addressLines`, `INFO.hours`, social links
- `MENU` – categories and items (add `p: 'Rs. 250'` to any item to show a price)

## Still to replace before pitching / launching

- Branch address and opening hours (placeholders in `data.js`)
- Real food photos: the two "photo here" tiles live in `src/components/Definition.jsx`
- Map: swap the illustrated map in `src/components/Visit.jsx` for a Google Maps embed
- Social links (Instagram / Facebook / foodpanda) in `data.js`
- Check menu item names and add prices from the printed menu

## Sections

Loader → Hero → Ribbons → Definition → Juice builder (pinned) → Menu rail (horizontal scroll) → Flavors marquee → Statement → Hours → Find us → Footer
