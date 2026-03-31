import Link from 'next/link';

import ContactIcons from '@/components/Contact/ContactIcons';
import { footerContacts } from '@/data/contact';
import routes from '@/data/routes';

const footerRoutes = routes.filter((route) => !route.index);

export default function Footer() {
  return (
    <footer className="site-footer">
      <div className="footer-grid">
        <div className="footer-column footer-column--copyright">
          <p className="footer-copy">
            &copy; 2026 Bonita Chen. All rights reserved.
          </p>
          <p className="footer-credit">
            Built on{' '}
            <a
              href="https://github.com/mldangelo/personal-site"
              target="_blank"
              rel="noopener noreferrer"
            >
              Michael D&apos;Angelo&apos;s personal-site
            </a>{' '}
            open-source framework, with visual direction informed by{' '}
            <a
              href="https://github.com/leo-leung04/leo-leung04.github.io"
              target="_blank"
              rel="noopener noreferrer"
            >
              Leo Leung&apos;s leo-leung04.github.io
            </a>
            .
          </p>
        </div>

        <div className="footer-column">
          <p className="footer-heading">Explore</p>
          <nav className="footer-nav" aria-label="Footer navigation">
            {footerRoutes.map((route) => (
              <Link key={route.path} href={route.path}>
                {route.label}
              </Link>
            ))}
          </nav>
        </div>

        <div className="footer-column">
          <p className="footer-heading">Connect</p>
          <ContactIcons
            items={footerContacts}
            className="footer-icons"
            ariaLabel="Footer social links"
          />
        </div>
      </div>
    </footer>
  );
}
