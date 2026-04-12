import ROUTES from './routes';

export interface FooterLink {
  labelKey: string;
  href: string;
}

export interface FooterSection {
  titleKey: string;
  links: FooterLink[];
}

export const FOOTER_SECTIONS: FooterSection[] = [
  {
    titleKey: 'forJobSeekers.title',
    links: [
      { labelKey: 'forJobSeekers.browseJobs', href: ROUTES.JOB.LIST },
      { labelKey: 'forJobSeekers.browseCompanies', href: ROUTES.COMPANIES.LIST },
      { labelKey: 'forJobSeekers.savedJobs', href: ROUTES.DASHBOARD.BOOKMARKS },
      { labelKey: 'forJobSeekers.myApplications', href: ROUTES.DASHBOARD.ACTIVITIES },
      { labelKey: 'forJobSeekers.profileSettings', href: ROUTES.DASHBOARD.SETTINGS },
    ],
  },
  {
    titleKey: 'forEmployers.title',
    links: [
      { labelKey: 'forEmployers.postJob', href: ROUTES.DASHBOARD.JOBS },
      { labelKey: 'forEmployers.manageJobs', href: ROUTES.DASHBOARD.JOBS },
      { labelKey: 'forEmployers.viewCandidates', href: ROUTES.DASHBOARD.ANALYTICS },
      { labelKey: 'forEmployers.pricing', href: '#' },
      { labelKey: 'forEmployers.resources', href: '#' },
    ],
  },
  {
    titleKey: 'company.title',
    links: [
      { labelKey: 'company.about', href: '#' },
      { labelKey: 'company.contact', href: '#' },
      { labelKey: 'company.help', href: ROUTES.DASHBOARD.HELP },
      { labelKey: 'company.privacy', href: '#' },
      { labelKey: 'company.terms', href: '#' },
    ],
  },
];

export interface SocialLink {
  name: string;
  icon: string;
  href: string;
  ariaLabel: string;
}

export const SOCIAL_LINKS: SocialLink[] = [
  {
    name: 'facebook',
    icon: 'fa-brands fa-facebook-f',
    href: '#',
    ariaLabel: 'Facebook',
  },
  {
    name: 'twitter',
    icon: 'fa-brands fa-twitter',
    href: '#',
    ariaLabel: 'Twitter',
  },
  {
    name: 'linkedin',
    icon: 'fa-brands fa-linkedin-in',
    href: '#',
    ariaLabel: 'LinkedIn',
  },
  {
    name: 'instagram',
    icon: 'fa-brands fa-instagram',
    href: '#',
    ariaLabel: 'Instagram',
  },
];

export const BOTTOM_LINKS: FooterLink[] = [
  { labelKey: 'privacy', href: '#' },
  { labelKey: 'terms', href: '#' },
  { labelKey: 'cookies', href: '#' },
];
