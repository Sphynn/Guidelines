# Making RedFynn videos (team guide)

You don't need any API keys, accounts or special settings. Everything is in this repo.

## Make a video
1. Open Claude Code (web or desktop) on this repo and start a session on the branch you're working on.
2. Say what you want in plain words, for example:
   - "Make a 6-second vertical announcement: 'We just hit 1,000 partners.'"
   - "Make the Inc. 5000 celebration video for 2027 with these numbers: ..."
   Give Claude the real facts (numbers, quotes, names) or paste the press release. It will only use facts you give it.
3. Claude uses the `redfynn-video` skill (with the `redfynn-brand` skill for colors, logo and type), renders an MP4 into `videos/`, checks frames, and sends you the file.
4. Ask for changes the same way ("shorter headline", "square version", "silent version").

## What exists today
| Composition | Size | Length | Use |
|---|---|---|---|
| `Vertical` / `Landscape` / `Square` | 1080x1920 / 1920x1080 / 1080x1080 | 6s | Short text announcement on the brand gradient |
| `Celebration` | 1080x1920 | 28s | Milestone story: cartoon yacht party, count-up numbers, quote, end card, with a generated music track |

Examples are in `videos/`.

## Footage, photos and music
- **Your own footage is best.** The brand guide asks for warm, candid photos of real small-business owners and partners.
- **Stock:** download from a licensed source yourself (Adobe Stock, Shutterstock, Storyblocks, Envato, or free Pixabay/Pexels). Commercial license only. Not "editorial use". Prefer clips with model releases.
- Put files in `assets/stock/` and add a line to `assets/stock/LICENSES.md` (source link, creator, license, who added it). No license line means the clip isn't approved.
- Avoid AI-generated people and popular songs.
- The built-in music is a generated placeholder. Swap in a licensed track (28s, MP3/WAV) before posting if you want something more polished.
- Please don't share or commit API keys. If you want Claude to search a stock library, ask the admin.

## Known gaps (ask the brand owner or designer)
- **Font:** TWK Everett is licensed and not in the repo. Videos use Hanken Grotesk as a stand-in.
- **Logo:** the logo files have white backgrounds, so the logo always sits on a white area, never on the gradient. We need transparent or reversed logos from the designer for logo-on-gradient.
- **Logo animation:** the logo is always static. The old 2015 guide forbids animating it, and the 2024 guide doesn't say. Check with the brand owner before adding a logo reveal.
- **Gradient:** generated in code, not the real brand artwork or animated gradients.
- **Skin tones and sunset tints** in the cartoon scene are outside the brand palette. A designer should review.
- **Old files in this repo** (`Style-Guide.html`, `RedFynn*.png`, and so on) are the 2015 guidelines. Don't use them for new work.

## Before you post
Watch the full video with sound. Check every number and quote against the source. Have the brand owner approve anything public.

## If something breaks
Tell Claude what you saw. The skill notes the usual environment problems (Chrome download blocked, fonts, first render slow).
