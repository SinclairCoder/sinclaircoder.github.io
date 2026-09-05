# Homepage deployment

The approved V13 static website lives in `website/` and is served at
https://sinclaircoder.github.io/ (without a `/v13/` prefix).

Edit files in `website/`, then push to `main`. The **Deploy homepage** workflow
checks local links, assets, and JavaScript syntax before publishing that directory
to `gh-pages`. GitHub Pages must keep its existing branch source: `gh-pages`, `/`.
No Jekyll build or external hosting service is needed for the new homepage.

The deployment overlays the new pages without deleting existing blog/news pages
or their assets. The former Jekyll source remains at the repository root as an
archive; changing it no longer rebuilds the public website. Old Jekyll-specific
maintenance workflows are retained for that archive and are not required to
publish `website/`. The formatting workflow checks the active static website,
its deployment workflows, and this guide; it does not reformat the archived
Jekyll content.

## Check and preview

```sh
python3 _scripts/check-website.py
node --check website/script.js
python3 -m http.server 8200 --directory website
```

The portrait uses the complete original UAE photo, with its original 3:4 aspect
ratio. The latest research iceberg is `research-roadmap-iceberg-v13-r3.png`.
Design prompts and earlier draft images are excluded from the release directory.

## Rollback

The last original source commit was
`f13b772f4b3696933665dc62e17ed94bedf3c9aa`; the last original published branch
commit was `62620fb1e6bf8a1b77b09038be413521fe12c691`.
Revert the V13 source/deployment commit and run the restored **Deploy site**
workflow to rebuild and publish the former Jekyll website. Both branch histories
are preserved; no force push is used.
