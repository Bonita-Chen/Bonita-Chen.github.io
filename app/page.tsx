import type { Metadata } from 'next';
import { PersonSchema } from '@/components/Schema';
import Hero from '@/components/Template/Hero';
import PageWrapper from '@/components/Template/PageWrapper';

export const metadata: Metadata = {
  description:
    'Bonita Chen is an Economics B.S. student with a Statistics minor at the University of Minnesota, Twin Cities, sharing research, internships, projects, and writing.',
};

export default function HomePage() {
  return (
    <PageWrapper>
      <PersonSchema />
      <Hero />
    </PageWrapper>
  );
}
