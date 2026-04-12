import { Typography } from '@/components/Reusable-Components';
import ServerLink from '@/components/Reusable-Components/Reusable-ServerLink';
import { SOCIAL_LINKS } from '@/constants/footer-links';

interface FooterBrandProps {
  brand: string;
  description: string;
}

export default function FooterBrand({ brand, description }: FooterBrandProps) {
  return (
    <div className="space-y-4">
      <div className="flex items-center gap-2">
        <div className="w-10 h-10 bg-primary rounded-lg flex items-center justify-center">
          <i className="fa-solid fa-briefcase text-white text-lg" />
        </div>
        <Typography variant="h4" weight="bold" className="text-foreground">
          {brand}
        </Typography>
      </div>
      <Typography variant="small" className="text-muted-foreground">
        {description}
      </Typography>
      {/* Social Media Links */}
      <div className="flex gap-3 pt-2">
        {SOCIAL_LINKS.map((social) => (
          <ServerLink
            key={social.name}
            href={social.href}
            ariaLabel={social.ariaLabel}
            external
            className="w-9 h-9 rounded-lg bg-background hover:bg-primary hover:text-white transition-colors flex items-center justify-center text-muted-foreground p-0"
          >
            <i className={social.icon} />
          </ServerLink>
        ))}
      </div>
    </div>
  );
}
