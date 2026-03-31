# Baojia Chen Personal Site

Personal website for Baojia "Bonita" Chen, adapted from [`mldangelo/personal-site`](https://github.com/mldangelo/personal-site) and visually aligned to the local [`index.html`](./index.html) reference.

[![CI](https://img.shields.io/github/actions/workflow/status/Bonita-Chen/Bonita-Chen.github.io/node.js.yml?branch=main&label=ci&style=flat-square)](https://github.com/Bonita-Chen/Bonita-Chen.github.io/actions)
[![License](https://img.shields.io/badge/license-MIT-43638C?style=flat-square)](./LICENSE)

## What This Site Includes

- About page with profile chips and narrative sections
- Resume page with experience, education, skills, courses, and references
- Blogs with markdown posts, tags, collections, and cover images
- Interests page with a timeline and linked detail cards
- Projects page
- Contact page
- `/admin` editing studio for About, Blogs, and Interests

## Tech Stack

- Next.js App Router
- React
- TypeScript
- Tailwind CSS v4
- NextAuth (GitHub login for `/admin`)
- GitHub Git Data API for server-side content saves

## Visual Direction

The visual source of truth is the local [`index.html`](./index.html).

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
- Resume courses: `src/data/resume/courses.ts`
- Interests timeline: `src/data/interests.ts`
- Projects: `src/data/projects.ts`
- Contact links: `src/data/contact.ts`
- Blog collections and tag labels: `src/data/blogs.ts`
- Blog markdown: `content/blogs/*.md`
- Hero content: `src/components/Template/Hero.tsx`
- Footer / copyright: `src/components/Template/Footer.tsx`

## Admin Studio

`/admin` now supports authenticated online saves.

What it does:

- sign in with GitHub
- restrict writes to allowlisted GitHub usernames
- save About, Blogs, Interests, markdown, and uploaded assets back to the repository
- create a real Git commit through the GitHub API

What it needs:

- `AUTH_SECRET`
- `AUTH_GITHUB_ID`
- `AUTH_GITHUB_SECRET`
- `GITHUB_REPO_WRITE_TOKEN`
- `GITHUB_ADMIN_LOGINS`
- `NEXT_PUBLIC_GITHUB_REPO_SLUG`
- `NEXT_PUBLIC_GITHUB_REPO_BRANCH`

See [`.env.example`](./.env.example).

## Deployment

Because `/admin` now depends on auth and server routes, this project is no longer a pure static GitHub Pages export.

Use a server-capable host such as:

- Vercel
- a Node server
- any platform that can run Next.js route handlers

Recommended production setup:

1. Deploy the Next.js app to Vercel
2. Add the environment variables from `.env.example`
3. Configure a GitHub OAuth app with the deployed `/api/auth/callback/github` URL
4. Set `GITHUB_REPO_WRITE_TOKEN` to a token with repository write access
5. Sign in through `/admin` and save changes directly to the repo

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
