# Gallery of Things

Photography portfolio built with Next.js and Sanity CMS.

## Setup

### 1. Install Dependencies
```bash
npm install
```

### 2. Configure Sanity Studio

Copy the schemas from `sanity/schemas/` to your Sanity Studio project:
- `siteSettings.ts`
- `project.ts`
- `highlightsPage.ts`
- `aboutPage.ts`

Then import them in your Sanity schema index:
```ts
import siteSettings from './siteSettings';
import project from './project';
import highlightsPage from './highlightsPage';
import aboutPage from './aboutPage';

export const schemaTypes = [siteSettings, project, highlightsPage, aboutPage];
```

### 3. Add Content in Sanity
1. Create a **Site Settings** document (set title, contact email, theme)
2. Create **Project** documents with images
3. Create a **Highlights Page** document
4. Create an **About Page** document

### 4. Run Development Server
```bash
npm run dev
```

## Deployment to Vercel

1. Push to GitHub
2. Import project in Vercel
3. Add environment variables:
   - `NEXT_PUBLIC_SANITY_PROJECT_ID`: n2p9wnnu
   - `NEXT_PUBLIC_SANITY_DATASET`: production

## Environment Variables

Create `.env.local` for local development:
```
NEXT_PUBLIC_SANITY_PROJECT_ID=n2p9wnnu
NEXT_PUBLIC_SANITY_DATASET=production
```

