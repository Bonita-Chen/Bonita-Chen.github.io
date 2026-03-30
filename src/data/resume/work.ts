/**
 * Conforms to https://jsonresume.org/schema/
 */
export interface Position {
  name: string;
  position: string;
  url: string;
  startDate: string;
  endDate?: string;
  summary?: string;
  highlights?: string[];
}

const work: Position[] = [
  {
    name: 'Goat Consulting',
    position: 'Marketing Analytics Intern',
    url: 'https://goatconsulting.com/',
    startDate: '2026-01-01',
    summary:
      'Support Amazon marketplace strategy by connecting keyword research, content optimization, ad execution, and performance reporting.',
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
    summary:
      'Work with Professor Anran Li on healthcare and administrative-data projects that require careful documentation, cleaning, and reproducible analysis pipelines.',
    highlights: [
      'Built reproducible Python and Stata pipelines for approximately 2.5 million administrative records, including string standardization, entity resolution, and quality diagnostics.',
      'Compiled AI adoption panel data for roughly 900 hospital systems with structured source validation and timing variables for downstream analysis.',
      'Created identifier crosswalks that supported consistent merges across BoardEx, Citeline, and SSR datasets.',
    ],
  },
  {
    name: 'Carlson Ventures Enterprise, UMN',
    position: 'Venture Capital Project Consultant',
    url: 'https://carlsonschool.umn.edu/',
    startDate: '2025-09-01',
    endDate: '2025-12-01',
    summary:
      'Evaluated strategic partnership and financing pathways for an AI hardware startup in a client-facing venture project course.',
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
    summary:
      'Worked at Bio-Techne’s global headquarters on cross-entity customer data standardization and self-serve AR reporting.',
    highlights: [
      'Cleaned and standardized customer master data for more than 48,000 customers across 17 entities to improve reporting consistency.',
      'Designed Power BI dashboards that scaled from U.S. coverage to EMEA, tracking credit balance and aging KPIs across more than 70,000 invoices.',
      'Consolidated recurring AR outputs into self-serve visualizations that sped up cross-region reporting and decision-making.',
    ],
  },
];

export default work;
