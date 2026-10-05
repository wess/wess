# Artwork

The profile is a SNES Zelda forest overworld with a Spy Hunter highway and restrained
1980s neon accents. All profile images are stored locally in `assets/`; no stats services,
remote fonts, or externally hosted artwork are required.

`bun run art` rebuilds the eight SVG assets. Their lettering is drawn from a 5-by-7
pixel alphabet, so it renders without font dependencies. Edit project copy in
`scripts/art.ts` and the corresponding image descriptions in `README.md` together.

`bun run preview` renders the README through GitHub's Markdown API and serves it at
http://127.0.0.1:4173 using approximate GitHub light and dark styling. Requires an
authenticated `gh` CLI. The preview's HTML is ignored by git.

The overworld banner was made with the built-in image generation tool. Final prompt:

> Create a wide 3:1 authentic SNES Zelda A Link to the Past pixel-art title screen
> for Wess Cope, with a subtle Spy Hunter arcade crossover and 1980s neon details.
> Hard, clean pixels; detailed overhead forest tiles; restricted color ramps.
> A spacious dark navy dialogue panel with stepped gold double border dominates
> the center. Large gold title: WESS COPE. Ivory subtitle: ENGINEER / BUILDER /
> EXPLORER. Three red hearts and a gold triangle relic above. Mint dialogue:
> IT'S DANGEROUS TO BUILD ALONE. Left: a green-capped sword-bearing hero, chest,
> stone path, purple wildflowers, turquoise pond. Right: a vertical two-lane Spy
> Hunter highway, white sports car, small red enemy car, magenta roadside accents.
> Emerald, teal, navy, golden ochre, ivory, restrained magenta and red. Thin dark
> ornamental border; subtle CRT texture; no blur or photorealism.

To publish, add the README and assets to the public `wess/wess` repository's default
branch. GitHub displays the root `README.md` on the profile automatically.
