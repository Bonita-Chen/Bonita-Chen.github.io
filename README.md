# Baojia Chen Personal Site

Personal website for Baojia "Bonita" Chen, adapted from [`mldangelo/personal-site`](https://github.com/mldangelo/personal-site) and maintained as a Next.js source repository.

[![CI](https://img.shields.io/github/actions/workflow/status/Bonita-Chen/Bonita-Chen.github.io/node.js.yml?branch=main&label=ci&style=flat-square)](https://github.com/Bonita-Chen/Bonita-Chen.github.io/actions)
[![License](https://img.shields.io/badge/license-MIT-43638C?style=flat-square)](./LICENSE)

## What This Site Includes

- About page with profile chips and narrative sections
- Resume page with experience, education, skills, and jump navigation
- Blogs with markdown posts, simplified tags, and cover images
- Interests page with a timeline and linked detail cards
- Projects page
- Contact page
- `/admin` editing studio for About, Blogs, and Interests

## Tech Stack

- Next.js App Router
- React
- TypeScript
- Tailwind CSS v4

## Visual Direction

The visual direction follows the refined blue theme and template-inspired layout that power the live site.

Theme palette:

- `#DDE7F3`
- `#ADD1F3`
- `#7189A5`
- `#43638C`
- `#223C5B`

Key rules:

- preserve the `Playfair Display + Plus Jakarta Sans` pairing
- keep layout spacing and heading scale close to the template
- keep motion subtle and elegant
- avoid low-contrast text against the page background

## Local Development

```bash
npm install
npm run dev
```

Open [http://localhost:3000](http://localhost:3000).

## Common Commands

```bash
npm run dev
npm run build
npm run type-check
npm run lint
npm run format
npm test
```

## Content Locations

- About copy: `src/data/about.ts`
- Resume experience: `src/data/resume/work.ts`
- Resume education: `src/data/resume/degrees.ts`
- Resume skills: `src/data/resume/skills.ts`
- Interests timeline: `src/data/interests.ts`
- Projects: `src/data/projects.ts`
- Contact links: `src/data/contact.ts`
- Blog tag labels: `src/data/blogs.ts`
- Blog markdown: `content/blogs/*.md`
- Hero content: `src/components/Template/Hero.tsx`
- Footer / copyright: `src/components/Template/Footer.tsx`

## Admin Studio

`/admin` is a static visual editor designed for GitHub Pages.

What it does:

- edits About, Blogs, and Interests in the browser
- supports avatar replacement, blog covers, inline blog images, tag editing, and interest entry editing
- stores draft state in local storage
- exports snapshot JSON and generated source snippets
- links you to the matching GitHub files for final handoff

It does not save directly to the live site. The publish flow is still:

1. edit in `/admin`
2. copy or download the generated content
3. update the repository files
4. push to `main`

## Deployment

This project is configured for GitHub Pages static export through GitHub Actions.

Recommended setup:

1. Keep the repository name as `Bonita-Chen.github.io`
2. Set GitHub Pages source to `GitHub Actions`
3. Push to `main`
4. Wait for the `CI` and `Deploy to GitHub Pages` workflows to pass
5. Open `https://bonita-chen.github.io/`

## Repository Metadata

Expected repository slug:

```text
Bonita-Chen/Bonita-Chen.github.io
```

Default branch:

```text
main
```

## Credits

- Based on Michael D'Angelo's [`personal-site`](https://github.com/mldangelo/personal-site)
- Customized for Baojia Chen

## License

[MIT](./LICENSE)
