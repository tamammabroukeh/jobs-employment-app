import { Typography } from '@/components/Reusable-Components';
import ServerLink from '@/components/Reusable-Components/Reusable-ServerLink';
import type { FooterSection } from '@/constants/footer-links';

interface FooterLinkSectionProps {
  section: FooterSection;
  getTranslation: (key: string) => string;
}

export default function FooterLinkSection({ section, getTranslation }: FooterLinkSectionProps) {
  return (
    <div>
      <Typography variant="h5" weight="semibold" className="text-foreground mb-4">
        {getTranslation(section.titleKey)}
      </Typography>
      <ul className="space-y-3">
        {section.links.map((link) => (
          <li key={link.labelKey}>
            <ServerLink href={link.href}>
              {getTranslation(link.labelKey)}
            </ServerLink>
          </li>
        ))}
      </ul>
    </div>
  );
}
