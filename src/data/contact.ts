import { IconDefinition } from '@fortawesome/fontawesome-svg-core';
import { faLinkedinIn } from '@fortawesome/free-brands-svg-icons/faLinkedinIn';
import { faEnvelope } from '@fortawesome/free-regular-svg-icons/faEnvelope';

export interface ContactItem {
  link: string;
  label: string;
  icon: IconDefinition;
}

const data: ContactItem[] = [
  {
    link: 'https://www.linkedin.com/in/baojia-bonita-chen',
    label: 'LinkedIn',
    icon: faLinkedinIn,
  },
  {
    link: 'mailto:bonitachen910@gmail.com',
    label: 'Email',
    icon: faEnvelope,
  },
];

export default data;
