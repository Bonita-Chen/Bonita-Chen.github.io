/**
 * Conforms to https://jsonresume.org/schema/
 */
export interface Position {
  name: string;
  position: string;
  url?: string;
  startDate: string;
  endDate?: string;
  subtitleSuffix?: string;
  subtitleUrl?: string;
  supervisorName?: string;
  supervisorUrl?: string;
  summary?: string;
  highlights?: string[];
}

const work: Position[] = [
  {
    name: 'Goat Consulting',
    position: 'Account Manager Intern',
    url: 'https://goatconsulting.com/',
    startDate: '2026-01-01',
    subtitleSuffix: 'Minneapolis, MN',
    highlights: [
      'Built and optimized Amazon product listings across titles, bullets, descriptions, and A+ Content using keyword research and marketplace best practices.',
      'Supported campaign setup, optimization, and weekly reporting for Amazon Ads, helping account managers turn metrics into concrete next steps.',
      'Maintained internal reporting workflows and surfaced actionable takeaways for clients through recurring performance analysis.',
    ],
  },
  {
    name: 'Heller-Hurwicz Economics Institute, UMN',
    position: 'Research Assistant',
    url: 'https://cla.umn.edu/heller-hurwicz',
    startDate: '2025-06-01',
    subtitleSuffix: 'Minneapolis, MN',
    supervisorName: 'Anran Li, Ph.D.',
    supervisorUrl: 'https://sites.google.com/view/anranli/home',
    highlights: [
      'Built an end-to-end Python pipeline merging 10 quarterly federal No Surprises Act IDR public-use files (2023 Q1–2025 Q2) into a longitudinal panel of approximately 5.25 million out-of-network emergency dispute records for healthcare-policy research.',
      'Designed an iterative human-in-the-loop curation workflow with versioned milestones, where automated fuzzy scoring exports structured review workbooks and a finalize step replays manual decisions so every mapping is auditable and reversible across quarterly refreshes.',
      'Lifted row-level match rate to roughly 91% across repeated review cycles, collapsed about 19,000 raw payer names into a standardized issuer dictionary, and reached full coverage across all major issuer families.',
      'Engineered three analytical universes (~500K rows) using a dual-evidence rule on issuer-name tokens and email domains, producing about 35 IDRE-compensation–weighted descriptive charts by quarter, year, and CPT/HCPCS code.',
      'Embedded reproducibility through per-step audit sheets logging input lineage, filter logic, and row-count deltas, plus a self-refreshing Word onboarding document that re-reads the latest outputs on each build to eliminate stale figures.',
    ],
  },
  {
    name: 'Carlson Ventures Enterprise, UMN',
    position: 'Venture Capital Project Consultant',
    url: 'https://carlsonschool.umn.edu/experience/experiential-learning/enterprise-programs/ventures/',
    startDate: '2025-09-01',
    endDate: '2025-12-01',
    subtitleSuffix: 'Carlson School of Management · Minneapolis, MN',
    subtitleUrl: 'https://carlsonschool.umn.edu/',
    highlights: [
      'Evaluated partnership and market-entry opportunities for an AI hardware startup and translated research into client-facing investment theses.',
      'Compiled a structured database of historical partnership models, pilots, and venture relationships across three public technology companies.',
      'Delivered three company-specific strategic decks outlining adoption pathways, partnership models, and long-term value creation ideas.',
    ],
  },
  {
    name: 'Bio-Techne',
    position: 'Accounts Receivable & Credit Intern',
    url: 'https://www.bio-techne.com/',
    startDate: '2025-06-01',
    endDate: '2025-08-01',
    subtitleSuffix: 'Global Headquarters · Minneapolis, MN',
    highlights: [
      'Cleaned and standardized customer master data for more than 48,000 customers across 17 entities to improve reporting consistency.',
      'Designed Power BI dashboards that scaled from U.S. coverage to EMEA, tracking credit balance and aging KPIs across more than 70,000 invoices.',
      'Consolidated recurring AR outputs into self-serve visualizations that sped up cross-region reporting and decision-making.',
    ],
  },
  {
    name: 'The Gunnar Laboratory for Developmental Psychobiology Research, UMN',
    position: 'Research Assistant',
    url: 'https://innovation.umn.edu/gunnar-lab',
    startDate: '2025-02-01',
    endDate: '2025-03-01',
    subtitleSuffix: 'Remote',
    highlights: [
      'Accurately transcribed Cantonese-language parent-child interactions from video recordings.',
      'Maintained transcription accuracy and adhered to research protocols for studying early life experiences and stress.',
      'Assisted in preparing transcription data for analysis while handling sensitive data responsibly and following ethical guidelines.',
    ],
  },
  {
    name: 'Superpowers',
    position: 'Research Intern — Startup, Venture Capital, AI',
    url: '',
    startDate: '2024-12-01',
    endDate: '2025-01-01',
    subtitleSuffix: 'Minneapolis, MN · Remote',
    highlights: [
      'Conducted in-depth research on digital marketing, data management, and artificial intelligence for a startup focused on innovative technologies.',
      'Developed content benchmarks, identified target markets, and sourced data to support AI development projects.',
      'Explored AI models, tools, and trends to drive business growth and innovation.',
    ],
  },
  {
    name: 'Deloitte China',
    position: 'Financial Advisory Department Intern',
    url: 'https://www.deloitte.com/cn/en.html',
    startDate: '2023-07-01',
    endDate: '2023-09-01',
    subtitleSuffix: 'Guangzhou, China',
    highlights: [
      'Conducted financial analysis for over six A-listed companies by reviewing annual reports and bank statements to assess financial health and identify discrepancies critical for restructuring decisions.',
      'Streamlined financial advisory processes by compiling essential data into Factsheets, auditing company credits, and preparing for the first creditors\u2019 meeting to facilitate informed discussions on restructuring plans.',
    ],
  },
];

export default work;
