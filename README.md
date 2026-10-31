# Creeper Memory Game

Build a preview host app for a single-file HTML game.

1) Download https://raw.githubusercontent.com/albasbasm4-cmd/creeper-memory-moment/main/public/app.html (the complete game file, about 593 KB) and save it verbatim as public/app.html. Do not modify, reformat, or re-encode app.html in any way — it must be served byte-for-byte exactly as downloaded.

2) The root route must render the game fullscreen: an iframe pointing at /app.html with className "fixed inset-0 h-screen w-screen border-0", title "شاشة البداية", and allow="autoplay", so the game runs exactly as it does in the original project.

3) app.html references two binary assets at these exact paths:
   - /__l5e/assets-v1/e80a0aef-4a65-4a0b-b7f1-821176eb4b28/about-photo.jpg
   - /__l5e/assets-v1/7f448ce5-82c5-4f18-b710-9249ec9b92f9/careless-whisper.mp3
   The real files (about-photo.jpg, careless-whisper.mp3) will be attached later as uploads. When they arrive, place them as static files at exactly those two paths so app.html keeps working unchanged. Until then, leave the paths as they are; do not edit app.html or change its asset URLs.

This project was built with [Lovable](https://lovable.dev).

## Build with Lovable

Continue developing this project in the [Lovable editor](https://lovable.dev/projects/0191fc4a-73e1-4743-b7da-2906e17d379c).

- **Ship faster**: describe what you want to build and Lovable handles the code.
- **Stay in sync**: every change made in Lovable is committed straight to this repository.
- **Full ownership**: this code is yours. Push to `main` on GitHub and your changes sync back into Lovable, ready for your next prompt.

## Development

Prefer working locally? You need Node.js and npm — [install with nvm](https://github.com/nvm-sh/nvm#installing-and-updating).

```sh
git clone <this-repository-url>
cd <repository-name>
npm i
npm run dev
```
