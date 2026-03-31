import { IconDefinition } from '@fortawesome/fontawesome-svg-core';
import { faGithub } from '@fortawesome/free-brands-svg-icons/faGithub';
import { faInstagram } from '@fortawesome/free-brands-svg-icons/faInstagram';
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
    link: 'https://github.com/Bonita-Chen',
    label: 'GitHub',
    icon: faGithub,
  },
  {
    link: 'mailto:bonitachen910@gmail.com',
    label: 'Email',
    icon: faEnvelope,
  },
  {
    link: 'https://www.instagram.com/bonita_chen_?igsh=MTJrcTV1ZTE4ZTR6dQ%3D%3D&utm_source=qr',
    label: 'Instagram',
    icon: faInstagram,
  },
];

export default data;
