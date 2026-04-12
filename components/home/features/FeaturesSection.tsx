import WhyChooseUsHeader from "./FeaturesHeader";
import WhyChooseUsCard from "./FeatureCard";

async function FeaturesSection() {
  return (
    <section className="py-20 bg-card">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <WhyChooseUsHeader />

        <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
          {/* Feature 1 */}
          <WhyChooseUsCard
            title="features.easySearch.title"
            description="features.easySearch.description"
            icon=" fa-magnifying-glass text-primary"
            parentIconClasses="bg-primary/10"
          />

          {/* Feature 2 */}
          <WhyChooseUsCard
            title="features.topCompanies.title"
            description="features.topCompanies.description"
            icon=" fa-building text-success"
            parentIconClasses="bg-success/10"
          />

          {/* Feature 3 */}
          <WhyChooseUsCard
            title="features.fastApply.title"
            description="features.fastApply.description"
            icon=" fa-rocket text-warning"
            parentIconClasses="bg-warning/10"
          />
        </div>
      </div>
    </section>
  );
}

export default FeaturesSection;
