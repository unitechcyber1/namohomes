# React + Vite

This template provides a minimal setup to get React working in Vite with HMR and some ESLint rules.

## Deploying on Vercel

The project is configured for Vercel with `vercel.json`:

- **Build**: `npm run build` (output in `build/`)
- **SPA routing**: All routes rewrite to `index.html` so client-side routing works (e.g. `/property-details`, `/property-listings`)

**Steps:**

1. Push the repo to GitHub/GitLab/Bitbucket (if not already).
2. Go to [vercel.com](https://vercel.com) → **Add New Project** → Import your repository.
3. Leave **Build Command** and **Output Directory** as-is (they use the values from `vercel.json`).
4. Click **Deploy**. Optional: add [Environment Variables](https://vercel.com/docs/projects/environment-variables) in Project Settings if you introduce env-based config later.

Currently, two official plugins are available:

- [@vitejs/plugin-react](https://github.com/vitejs/vite-plugin-react/blob/main/packages/plugin-react) uses [Babel](https://babeljs.io/) (or [oxc](https://oxc.rs) when used in [rolldown-vite](https://vite.dev/guide/rolldown)) for Fast Refresh
- [@vitejs/plugin-react-swc](https://github.com/vitejs/vite-plugin-react/blob/main/packages/plugin-react-swc) uses [SWC](https://swc.rs/) for Fast Refresh

## React Compiler

The React Compiler is not enabled on this template because of its impact on dev & build performances. To add it, see [this documentation](https://react.dev/learn/react-compiler/installation).

## Expanding the ESLint configuration

If you are developing a production application, we recommend using TypeScript with type-aware lint rules enabled. Check out the [TS template](https://github.com/vitejs/vite/tree/main/packages/create-vite/template-react-ts) for information on how to integrate TypeScript and [`typescript-eslint`](https://typescript-eslint.io) in your project.
