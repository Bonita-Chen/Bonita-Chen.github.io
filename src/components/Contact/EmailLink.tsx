import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';

import { emailContact } from '@/data/contact';

export default function EmailLink() {
  if (!emailContact) {
    return null;
  }

  return (
    <div className="contact-email-container">
      <a
        href={emailContact.link}
        className="contact-email-link"
        aria-label="Send an email"
      >
        <FontAwesomeIcon icon={emailContact.icon} className="size-5" />
      </a>
    </div>
  );
}
