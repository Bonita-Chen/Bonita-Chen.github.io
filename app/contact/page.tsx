import type { Metadata } from 'next';

import ContactIcons from '@/components/Contact/ContactIcons';
import EmailLink from '@/components/Contact/EmailLink';

import PageWrapper from '@/components/Template/PageWrapper';
import { createPageMetadata } from '@/lib/metadata';

export const metadata: Metadata = createPageMetadata({
  title: 'Contact',
  description: 'Contact Baojia Chen via email, LinkedIn, or GitHub.',
  path: '/contact/',
});

export default function ContactPage() {
  return (
    <PageWrapper>
      <section className="contact-page">
        <header className="contact-header fade-in">
          <h1 className="page-title">Let&apos;s Connect</h1>
          <p className="page-subtitle">
            If you come across a role that feels like a fit, a research
            opportunity worth exploring, or a project you&apos;d want to build
            together, please reach out. I&apos;m always happy to connect with
            thoughtful people and new friends too.
          </p>
        </header>

        <div className="contact-card fade-in stagger-1">
          <div className="contact-card-glow" aria-hidden="true" />
          <div className="contact-card-inner">
            <div className="contact-email-block">
              <p className="contact-label">Send me an email</p>
              <EmailLink />
              <p className="contact-hint">Usually respond within 24 hours</p>
            </div>

            <div className="contact-divider">
              <span>or find me on</span>
            </div>

            <ContactIcons />
          </div>
        </div>
      </section>
    </PageWrapper>
  );
}
