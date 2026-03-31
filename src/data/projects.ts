export interface Project {
  slug: string;
  title: string;
  subtitle?: string;
  link?: string;
  image?: string;
  emoji?: string;
  date: string;
  desc: string;
  tech?: string[];
  featured?: boolean;
}

const data: Project[] = [
  {
    slug: 'ai-adoption-healthcare-panel',
    title: 'AI Adoption in Healthcare Panel',
    subtitle: 'Research infrastructure for hospital-system analysis',
    emoji: '🧬',
    date: '2026-03-01',
    desc: 'Built and documented a research workflow for tracking AI adoption timing across roughly 900 hospital systems.',
    tech: ['Python', 'Stata', 'Entity Resolution', 'Documentation'],
    featured: true,
  },
  {
    slug: 'power-bi-ar-dashboards',
    title: 'Power BI AR Dashboards',
    subtitle: 'Bio-Techne internship project',
    emoji: '📊',
    date: '2025-08-01',
    desc: 'Scaled AR and credit dashboards from U.S. coverage to EMEA, connecting invoice-level aging to customer-level reporting.',
    tech: ['Power BI', 'DAX', 'Data Modeling'],
    featured: true,
  },
  {
    slug: 'reevaluating-bmi-standards',
    title: 'Reevaluating BMI Standards for Health Equity',
    subtitle: 'UMN Public Health Equity Data Challenge',
    emoji: '🏥',
    date: '2024-11-01',
    desc: 'Led a team using R, logistic regression, and Chi-Square analysis to demonstrate that BMI thresholds for hypertension and diabetes screening vary significantly across racial groups.',
    tech: [
      'R',
      'Logistic Regression',
      'Chi-Square Test',
      'ggplot2',
      'Public Health',
    ],
    featured: true,
  },
  {
    slug: 'college-fed-challenge-gdp-projections',
    title: 'College Fed Challenge GDP Projections',
    subtitle: 'Team presentation and policy defense',
    emoji: '🏦',
    date: '2025-10-01',
    desc: 'Produced GDP projections with time-series and regression analysis, then defended the policy implications in a judged Q&A.',
    tech: ['Time Series', 'FRED', 'Presentation'],
  },
  {
    slug: 'ai-hardware-vc-strategy',
    title: 'AI Hardware VC Strategy',
    subtitle: 'Carlson Ventures Enterprise',
    emoji: '🤖',
    date: '2025-12-01',
    desc: 'Synthesized partnership histories, pilot patterns, and venture deal structures into strategic recommendations for a startup client.',
    tech: ['Market Research', 'Strategy', 'Venture Analysis'],
  },
  {
    slug: 'vr-self-defense-training-proposal',
    title: 'VR Self-Defense Training Proposal',
    subtitle: 'Girls Who Code at UMN',
    emoji: '🕶️',
    date: '2025-12-01',
    desc: 'Co-led user research, project planning, and weekly coordination for a seven-person concept team using an Excel Gantt workflow.',
    tech: ['Project Management', 'User Research', 'Planning'],
  },
];

export default data;
