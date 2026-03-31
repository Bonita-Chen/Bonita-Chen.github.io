import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';

import { type ContactItem, socialContacts } from '@/data/contact';

interface ContactIconsProps {
  items?: ContactItem[];
  className?: string;
  ariaLabel?: string;
}

export default function ContactIcons({
  items = socialContacts,
  className = '',
  ariaLabel,
}: ContactIconsProps) {
  return (
    <ul
      className={['icons', className].filter(Boolean).join(' ')}
      aria-label={ariaLabel}
    >
      {items.map((s) => {
        const isMailto = s.link.startsWith('mailto:');

        return (
          <li key={s.label}>
            <a
              href={s.link}
              aria-label={
                isMailto ? 'Send an email' : `${s.label} (opens in new tab)`
              }
              target={isMailto ? undefined : '_blank'}
              rel={isMailto ? undefined : 'noopener noreferrer'}
            >
              <FontAwesomeIcon icon={s.icon} className="size-5" />
            </a>
          </li>
        );
      })}
    </ul>
  );
}
