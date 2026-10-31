<!-- LOVABLE:BEGIN -->
> [!IMPORTANT]
> This project is connected to [Lovable](https://lovable.dev). Avoid rewriting
> published git history — force pushing, or rebasing/amending/squashing commits
> that are already pushed — as it rewrites history on Lovable's side and the
> user will likely lose their project history.
>
> Commits you push to the connected branch sync back to Lovable and show up in
> the editor, so keep the branch in a working state.
<!-- LOVABLE:END -->

- Keep the game in its static HTML iframe; make game-behavior fixes there rather than recreating it in React.
- Keep About Us in an independent viewport-sized landscape overlay with native overflow scrolling, so it never inherits the game's scaled stage.
- Reveal About Us synchronously on creeper activation and start the unchanged music asset at its audible offset, avoiding delayed home exposure and silent lead-in.
