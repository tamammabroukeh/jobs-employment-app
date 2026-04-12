import { Typography } from '@/components/Reusable-Components';
import ServerLink from '@/components/Reusable-Components/Reusable-ServerLink';
import { BOTTOM_LINKS } from '@/constants/footer-links';

interface FooterBottomProps {
  copyright: string;
  getTranslation: (key: string) => string;
}

export default function FooterBottom({ copyright, getTranslation }: FooterBottomProps) {
  return (
    <div className="border-t border-border py-6">
      <div className="flex flex-col md:flex-row justify-between items-center gap-4">
        <Typography variant="small" className="text-muted-foreground text-center md:text-left">
          {copyright}
        </Typography>
        <div className="flex gap-6">
          {BOTTOM_LINKS.map((link) => (
            <ServerLink key={link.labelKey} href={link.href}>
              {getTranslation(link.labelKey)}
            </ServerLink>
          ))}
        </div>
      </div>
    </div>
  );
}
