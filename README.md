# Tactile Arena

A public catalog for exploring and comparing **robot tactile sensors** — vision-based fingertips, pressure arrays, force/torque, and more.

## Live site

https://commissure-inc.github.io/Tactile-Arena/

Deployed from `main` by [GitHub Actions](.github/workflows/deploy.yml) to GitHub Pages.

## Repository contents

| Path | Description |
|------|-------------|
| [`src/`](src/) | Astro + React catalog UI |
| [`src/data/sensors.json`](src/data/sensors.json) | Catalog data (CC BY 4.0) |

## Contributing

We welcome new sensor submissions and corrections.

- Open an issue or pull request against [`src/data/sensors.json`](src/data/sensors.json)
- Every entry needs at least one source URL and a last-reviewed date
- Run `npm run validate` before submitting

All submissions are reviewed before publication.

## Local development

```bash
npm install
npm run dev
```

| Command | Description |
|---------|-------------|
| `npm run dev` | Development server with HMR |
| `npm run build` | Static build to `dist/` |
| `npm run preview` | Preview production build |
| `npm run validate` | Validate `src/data/sensors.json` schema |

## License

| Scope | License |
|-------|---------|
| Code | [MIT](LICENSE) |
| Catalog data (`src/data/sensors.json`) | [CC BY 4.0](LICENSE-DATA.md) |

## Citation

If you use the catalog data, please follow the attribution example in [LICENSE-DATA.md](LICENSE-DATA.md).

## Maintainer

[commissure, inc.](https://commissure.co.jp/)
