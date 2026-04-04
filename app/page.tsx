import Navbar from '@/components/navbar/Navbar';
import HeroSection from '@/components/home/hero/HeroSection';

export default function Home() {

  return (
    <div className="min-h-screen bg-background">
      {/* Header */}
      <Navbar />

      {/* Hero Section */}
      <HeroSection />

      {/* Features Section */}
      <section className="py-20 bg-card">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center mb-12">
            <h2 className="text-3xl font-bold text-foreground mb-4">Why Choose Us?</h2>
            <p className="text-muted-foreground max-w-2xl mx-auto">
              We provide the best platform for job seekers and employers to connect.
            </p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
            {/* Feature 1 */}
            <div className="auth-card p-6 text-center">
              <div className="w-14 h-14 bg-primary/10 rounded-2xl flex items-center justify-center mx-auto mb-4">
                <i className="fa-solid fa-magnifying-glass text-2xl text-primary" />
              </div>
              <h3 className="text-xl font-semibold text-foreground mb-2">Easy Search</h3>
              <p className="text-muted-foreground">
                Find jobs that match your skills with our advanced search filters.
              </p>
            </div>

            {/* Feature 2 */}
            <div className="auth-card p-6 text-center">
              <div className="w-14 h-14 bg-success/10 rounded-2xl flex items-center justify-center mx-auto mb-4">
                <i className="fa-solid fa-building text-2xl text-success" />
              </div>
              <h3 className="text-xl font-semibold text-foreground mb-2">Top Companies</h3>
              <p className="text-muted-foreground">Connect with leading companies looking for talented individuals.</p>
            </div>

            {/* Feature 3 */}
            <div className="auth-card p-6 text-center">
              <div className="w-14 h-14 bg-warning/10 rounded-2xl flex items-center justify-center mx-auto mb-4">
                <i className="fa-solid fa-rocket text-2xl text-warning" />
              </div>
              <h3 className="text-xl font-semibold text-foreground mb-2">Fast Apply</h3>
              <p className="text-muted-foreground">Apply to multiple jobs with just one click using your profile.</p>
            </div>
          </div>
        </div>
      </section>

      {/* Footer */}
      <footer className="border-t border-border py-8 bg-background">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex flex-col md:flex-row justify-between items-center gap-4">
            <div className="flex items-center gap-2">
              <div className="w-8 h-8 bg-primary rounded-lg flex items-center justify-center">
                <i className="fa-solid fa-briefcase text-white text-sm" />
              </div>
              <span className="font-semibold text-foreground">JobsPortal</span>
            </div>
            <p className="text-muted-foreground text-sm">© 2024 JobsPortal. All rights reserved.</p>
          </div>
        </div>
      </footer>
    </div>
  );
}
