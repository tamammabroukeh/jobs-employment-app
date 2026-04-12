import { getFooterTranslations } from '@/lib/get-translations';
import { FOOTER_SECTIONS } from '@/constants/footer-links';
import FooterBrand from './FooterBrand';
import FooterLinkSection from './FooterLinkSection';
import FooterBottom from './FooterBottom';

export default async function Footer() {
  const t = await getFooterTranslations();
  const currentYear = new Date().getFullYear();

  // Helper function to safely get translations with fallback
  const getTranslation = (key: string, values?: Record<string, string | number>): string => {
    try {
      // eslint-disable-next-line @typescript-eslint/no-explicit-any
      return t(key as any, values);
    } catch {
      console.warn(`Translation missing for key: ${key}`);
      return key;
    }
  };

  return (
    <footer className="border-t border-border">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        {/* Main Footer Content */}
        <div className="py-12 grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-8">
          {/* Brand Section */}
          <FooterBrand
            brand={getTranslation('brand')}
            description={getTranslation('brandDescription')}
          />

          {/* Dynamic Link Sections */}
          {FOOTER_SECTIONS.map((section) => (
            <FooterLinkSection
              key={section.titleKey}
              section={section}
              getTranslation={getTranslation}
            />
          ))}
        </div>

        {/* Bottom Bar */}
        <FooterBottom
          copyright={getTranslation('copyright', { year: currentYear })}
          getTranslation={getTranslation}
        />
      </div>
    </footer>
  );
}
