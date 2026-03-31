'use client';

import Link from 'next/link';
import { useSearchParams } from 'next/navigation';
import { Suspense } from 'react';

interface BackLinkProps {
  defaultHref: string;
  defaultLabel: string;
  className?: string;
}

const fromMap: Record<string, { href: string; label: string }> = {
  interests: { href: '/interests', label: '\u2190 Back to Interests' },
};

function BackLinkInner({
  defaultHref,
  defaultLabel,
  className,
}: BackLinkProps) {
  const searchParams = useSearchParams();
  const from = searchParams.get('from');
  const override = from ? fromMap[from] : null;

  return (
    <Link href={override?.href ?? defaultHref} className={className}>
      {override?.label ?? defaultLabel}
    </Link>
  );
}

export default function BackLink(props: BackLinkProps) {
  return (
    <Suspense
      fallback={
        <Link href={props.defaultHref} className={props.className}>
          {props.defaultLabel}
        </Link>
      }
    >
      <BackLinkInner {...props} />
    </Suspense>
  );
}
