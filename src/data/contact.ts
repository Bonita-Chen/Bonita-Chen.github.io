import { IconDefinition } from '@fortawesome/fontawesome-svg-core';
import { faGithub } from '@fortawesome/free-brands-svg-icons/faGithub';
import { faInstagram } from '@fortawesome/free-brands-svg-icons/faInstagram';
import { faLinkedinIn } from '@fortawesome/free-brands-svg-icons/faLinkedinIn';
import { faEnvelope } from '@fortawesome/free-regular-svg-icons/faEnvelope';

export interface ContactItem {
  link: string;
  label: string;
  icon: IconDefinition;
  showInHero?: boolean;
  showInFooter?: boolean;
  showInContact?: boolean;
}

const data: ContactItem[] = [
  {
    link: 'https://www.linkedin.com/in/baojia-bonita-chen',
    label: 'LinkedIn',
    icon: faLinkedinIn,
    showInHero: true,
    showInFooter: true,
    showInContact: true,
  },
  {
    link: 'https://github.com/Bonita-Chen',
    label: 'GitHub',
    icon: faGithub,
    showInHero: true,
    showInFooter: true,
    showInContact: true,
  },
  {
    link: 'mailto:bonitachen910@gmail.com',
    label: 'Email',
    icon: faEnvelope,
    showInFooter: true,
  },
  {
    link: 'https://www.instagram.com/bonita_chen_?igsh=MTJrcTV1ZTE4ZTR6dQ%3D%3D&utm_source=qr',
    label: 'Instagram',
    icon: faInstagram,
    showInHero: true,
    showInFooter: true,
    showInContact: true,
  },
];

export const heroContacts = data.filter((item) => item.showInHero);
export const footerContacts = data.filter((item) => item.showInFooter);
export const socialContacts = data.filter((item) => item.showInContact);
export const emailContact = data.find((item) => item.label === 'Email');

export default data;
