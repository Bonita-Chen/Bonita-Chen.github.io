export const aboutMarkdown = `# Intro

Hi everyone! I'm an Economics major with a Statistics minor at the University of Minnesota, graduating in May 2026. My work sits at the intersection of analytics, operations, and cross-functional decision-making.

Throughout my experience, I keep returning to the same approach: start with a problem that has room for improvement, build a lightweight prototype, and turn it into something reusable, whether a dashboard, tool, pipeline, or SOP. But before I build anything, I spend time getting oriented: reading whatever materials already exist (past reports, prior analyses, raw data exports), talking with my mentor or supervisor early to align on context, and defining the scope clearly so I know what's in and what's out.

From there, I think about the architecture: not just what solves the immediate ask, but what the work will look like after I hand it off. Only then do I start prototyping. Once people are using what I've built, their feedback becomes the strongest signal for refinement, and I keep iterating from there.

At [Goat Consulting](/resume/#goat-consulting), my mentor handed me a one-month return analysis for an Amazon client, but I saw a recurring monthly workflow beneath it and built a browser-based return audit tool that the agency now runs across other seller accounts, on any account, without me.

At the [Heller Hurwicz Economics Institute](/resume/#heller-hurwicz-economics-institute-umn), my supervisor asked me to look into Multiplan; I went further to architect a human-in-the-loop curation workflow, where automated fuzzy matching exports structured review workbooks, human decisions get replayed and saved as versioned milestones, and each quarterly refresh inherits prior decisions instead of restarting, keeping the project running long after I graduate.

At [Bio-Techne](/resume/#bio-techne), what started as cleaning customer master data became a Power BI buildout that scaled from U.S. to EMEA coverage across 70K+ invoices and 48K+ customers, and I built the reports so the credit team could run them on their own, which is why they still rely on those reports a year after my internship ended.

This is the kind of work I want to keep doing, which is why I'm drawn to roles across the analyst spectrum: business analyst, business intelligence analyst, data analyst, product analyst, customer insights, and revenue or GTM operations. The scope and tech stack vary, but the core loop is the same: frame the problem, build something useful, and improve it through iteration.

What carries across these roles is the craft of turning a business question into a system that holds up over time, because dashboards, pipelines, and reporting systems only become more valuable as they earn trust, and maintaining that trust is a craft in itself.
`;

export const aboutAvatarPath = '/images/me.jpg';

export const aboutCards: ReadonlyArray<{
  title: string;
  emoji: string;
  description: string;
}> = [];
