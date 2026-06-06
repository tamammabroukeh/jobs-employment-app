import TopCompaniesCarousel from "./TopCompaniesCarousel";
import { ReusableButton, Typography } from "@/components/Reusable-Components";
import { getHomeTranslations } from "@/lib/get-translations";
import { companiesRepository } from "@/apis/services/companies";
import Link from "next/link";

export default async function TopCompaniesSection({
  showHeader = true,
  showViewAllCompanies = true,
}: {
  showHeader?: boolean;
  showViewAllCompanies?: boolean;
}) {
  const t = await getHomeTranslations();

  // Fetch top companies from API
  let companies: Array<{ id: string; name: string; logo: string }> = [];

  try {
    const response = await companiesRepository.getTopCompanies();
    companies = response.data.map((company) => ({
      id: company.id,
      name: company.name,
      logo: company.logo,
    }));
  } catch (error) {
    console.error("Failed to fetch top companies:", error);
    // Fallback to empty array if API fails
    companies = [];
  }

  return (
    <section className="py-20 bg-background">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        {/* Section Header */}
        {showHeader && (
          <div className="text-center mb-12">
            <Typography variant="h2" className="text-foreground mb-4">
              {t("topCompanies.title")}
            </Typography>
            <Typography
              variant="p"
              className="text-muted-foreground max-w-2xl mx-auto"
            >
              {t("topCompanies.description")}
            </Typography>
          </div>
        )}

        {/* Companies Carousel */}
        {companies.length > 0 ? (
          <div className="mb-12">
            <TopCompaniesCarousel companies={companies} />
          </div>
        ) : (
          <div className="text-center py-12">
            <Typography variant="p" className="text-muted-foreground">
              No companies available at the moment.
            </Typography>
          </div>
        )}

        {/* View All Button */}
        {showViewAllCompanies && companies.length > 0 && (
          <div className="text-center">
            <Link href="/companies">
              <ReusableButton variant="primary" size="large" className="px-8">
                {t("topCompanies.viewAll")}
                <i className="fa-solid fa-arrow-right ml-2" />
              </ReusableButton>
            </Link>
          </div>
        )}
      </div>
    </section>
  );
}
