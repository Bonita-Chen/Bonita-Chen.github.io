export interface Route {
  label: string;
  path: string;
  index?: boolean;
}

const routes: Route[] = [
  {
    index: true,
    label: 'Bonita Chen',
    path: '/',
  },
  {
    label: 'About',
    path: '/about',
  },
  {
    label: 'Resume',
    path: '/resume',
  },
  {
    label: 'Projects',
    path: '/projects',
  },
  {
    label: 'Blogs',
    path: '/blogs',
  },
  {
    label: 'Interests',
    path: '/interests',
  },
  {
    label: 'Contact',
    path: '/contact',
  },
];

export default routes;
