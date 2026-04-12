import HeroActions from "./hero-actions";
import HeroSearch from "./HeroSearch";
import { Typography } from "@/components/Reusable-Components";

function HeroSection() {
  return (
    <section className="auth-bg py-20 lg:py-32">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="text-center max-w-3xl mx-auto">
          <Typography variant="h1" className="text-foreground mb-6">
            Find Your Dream Job <span className="text-primary">Today</span>
          </Typography>
          <Typography variant="p" className="text-xl text-muted-foreground mb-8">
            Connect with top employers and discover opportunities that match
            your skills and aspirations.
          </Typography>
          
          {/* Search Component */}
          <div className="mb-8">
            <HeroSearch />
          </div>
          
          <HeroActions />
        </div>
      </div>
    </section>
  );
}

export default HeroSection;
