# BoxSheet — how to publish

Everything here is ready to host. You need three accounts: a code host (free), a Google Play developer account ($25 once), and nothing else.

## 1. Host it (30 minutes)

The whole app is static files, so any static host works. Cloudflare Pages or GitHub Pages are both free.

**GitHub Pages**
1. Create a public repository, e.g. `boxsheet`.
2. Upload every file in this folder, keeping the folder structure.
3. Settings → Pages → Source: `main`, folder `/root`. Save.
4. Your app is at `https://[your-name].github.io/boxsheet/`. Open it on your phone and check that it installs (Chrome menu → Add to home screen).

The app must be served over https for the offline cache and the installable app to work. Both hosts do this for you.

## 2. Check it as an app (15 minutes)

On an Android phone, open the URL in Chrome and add it to the home screen. Then:
- Turn on aeroplane mode and open it again. It should work.
- Make a drawing and download the PDF.
- Take a backup, clear the app data, restore the backup.

## 3. Package it for Play (1 hour)

1. Go to pwabuilder.com, paste your URL, and let it generate the Android package.
2. Download the package. It contains an `.aab` file, a signing key and `assetlinks.json`.
3. Upload `assetlinks.json` to your site at `/.well-known/assetlinks.json`. This is what removes the browser address bar inside the app. Do not skip it.
4. Keep the signing key file and its password somewhere safe. Lose it and you can never update the app.

## 4. Play Console

1. Create a developer account, $25 once. A personal account needs a closed test with at least 12 testers who stay opted in for 14 days before you can go public, so start that early.
2. Create the app, upload the `.aab` to a closed test track, and add your 12 testers by email. Plant staff, packaging vendors and friends all count.
3. Fill in the listing from `store-listing.md`, upload the icon (`icons/icon-512.png`) and screenshots.
4. Host `privacy.html` and give Play its URL. Fill in the Data safety form using the answers in `store-listing.md`.
5. After 14 days of closed testing, apply for production.

## 5. Before you press publish

- Put your email in `privacy.html`.
- Decide the final name and change it in `manifest.json`, `store-listing.md` and the `<title>` of `index.html`.
- Calibrate: cost 5 to 10 boxes you already buy, and compare with your quotes and any lab reports you have. Fix the defaults in the rate master before anyone else uses it.

## Files
- `index.html` — the whole app
- `vendor/jspdf.umd.min.js` — PDF library, bundled so the app works offline
- `manifest.json`, `sw.js`, `icons/` — what makes it installable and offline
- `privacy.html` — required by Play
- `store-listing.md` — listing text and Data safety answers
