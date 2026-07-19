# The Sunday Sunrise Liturgy — WKHR 91.5

A static web app that plays and compares David Noeth's weekly opening on WKHR 91.5 (Bainbridge, OH).
No build step, no framework. Three moving parts:

```
index.html      the app (HTML + CSS + JS) — rarely changes
data.js         all week data: transcripts, timings, slots, audio paths
audio/*.mp3     one trimmed spoken-intro clip per week
```

`data.js` is loaded as a plain script that sets `window.WKHR`, so the page works both
by double-clicking `index.html` locally **and** when served on the web. No server needed to preview.

## Deploy (GitHub + Vercel)

1. Create a new GitHub repo and push this folder to it:
   ```bash
   git init && git add . && git commit -m "WKHR liturgy"
   git branch -M main
   git remote add origin git@github.com:<you>/wkhr-liturgy.git
   git push -u origin main
   ```
2. In Vercel: **Add New → Project → Import** the repo.
   Framework preset: **Other**. Build command: none. Output dir: `./`. Click **Deploy**.
3. Every `git push` to `main` redeploys automatically. Branch pushes get preview URLs.

Custom domain (optional): Vercel project → **Settings → Domains** → add e.g. `wkhr.jbf.com`,
then add the CNAME it gives you at your DNS. GitHub Pages works too if you'd rather — this is
plain static files.

## Add a new Sunday

1. Drop the trimmed spoken-intro clip in `audio/`, e.g. `audio/jul19.mp3`.
2. Add one entry to `window.WKHR` in `data.js`. Add the key to `order` and add its object under `weeks`:
   ```js
   "jul19": {
     "label": "July 19", "sub": "Third Sunday of July", "captured": "full",
     "slots": { "time":"7:05", "temp":"66\u00b0", "sunrise":"6:07", "sunset":"8:57",
                "length":"14h 50m", "delta":"9 min shorter", "deltaDir":"down", "ref":"last week",
                "feature":"..." },
     "lengthMin": 890,
     "lines": [ [0.0,"...",[]], [12.0,"It is currently ... 7:05 ...",["time","date"]], ... ],
     "audio": "./audio/jul19.mp3"
   }
   ```
   - `lines` = `[seconds, text, [slotKeys]]`. `seconds` is the local time in that clip where the
     line starts (drives the karaoke highlight). `slotKeys` are which chips light up on that line:
     any of `time date temp sunrise sunset length delta feature`.
   - `deltaDir` is `"up"` (green ▲) or `"down"` (red ▼). `captured` is `"full"`, `"nogreet"`, or `"partial"`.
3. Commit and push. Done.

## Producing a clip + entry from a raw recording

The clips here were trimmed to David's spoken opening (before the first song) and transcribed
with Whisper, then hand-corrected. To do it yourself:

```bash
# trim the spoken intro (adjust start/duration) to mono MP3
ffmpeg -ss <start_sec> -i raw.m4a -t <dur_sec> -ac 1 -b:a 32k audio/jul19.mp3
# transcribe with timings
pip install faster-whisper
python3 -c "from faster_whisper import WhisperModel as M; \
m=M('small.en',compute_type='int8'); \
[print(round(s.start,2), s.text) for s in m.transcribe('audio/jul19.mp3',word_timestamps=True)[0]]"
```

Then clean the text and fill in the slots by hand. (Or hand the raw file to Claude and get the
`data.js` entry + trimmed mp3 back ready to paste.)
