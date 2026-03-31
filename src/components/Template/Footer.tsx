export default function Footer() {
  return (
    <footer className="site-footer">
      <p className="footer-copy">
        &copy; {new Date().getFullYear()} Baojia Chen. All rights reserved.
        Based on the{' '}
        <a
          href="https://github.com/mldangelo/personal-site"
          target="_blank"
          rel="noopener noreferrer"
        >
          personal-site
        </a>{' '}
        template by Michael D&apos;Angelo. Visual design adapted by{' '}
        <a
          href="https://github.com/leo-leung04/leo-leung04.github.io"
          target="_blank"
          rel="noopener noreferrer"
        >
          Jingcheng Liang
        </a>
        .
      </p>
    </footer>
  );
}
