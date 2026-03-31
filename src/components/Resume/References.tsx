import Link from 'next/link';

export default function References() {
  return (
    <div className="references">
      <div className="link-to" id="references" />
      <p className="references-text">
        References available upon request.{' '}
        <Link href="/contact" className="references-link">
          Get in touch →
        </Link>
      </p>
    </div>
  );
}
