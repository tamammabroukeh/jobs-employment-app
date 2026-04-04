export const siteConfig = {
    name: "محافظة ريف دمــشــــق",
    shortName: "ريف دمشق",
    domain: process.env.NEXT_PUBLIC_SITE_URL || "https://reefdamascus.com/", 
    locale: "ar-SA",
    defaultTheme: "system",
  };

export const homepage = {
    title: `${siteConfig.name}`,
    description: `محافظة ريف دمشق هي إحدى المحافظات السورية التي تحيط بالعاصمة دمشق من جهات متعددة. تتميز المحافظة بموقعها الاستراتيجي وتنوعها الجغرافي والاقتصادي.`,
    keywords: [
      "محافظة ريف دمشق",
      "السياحة في ريف دمشق",
      "خدمات حكومية ريف دمشق",
      "التنمية المحلية",
    ],
    alternates: {
        canonical: `${siteConfig.domain}`,
    },
};
export const aboutUs = {
  title: "من نحن",
};
