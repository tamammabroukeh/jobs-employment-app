/**
 * ReusableLink Component - Usage Examples
 * 
 * This file demonstrates all the different ways to use the ReusableLink component
 */

import { ReusableLink } from '@/components/Reusable-Components';

export function ReusableLinkExamples() {
  return (
    <div className="space-y-8 p-8">
      {/* Basic Usage */}
      <section>
        <h3 className="text-lg font-semibold mb-4">Basic Usage</h3>
        <div className="space-y-2">
          <ReusableLink href="/dashboard">Go to Dashboard</ReusableLink>
          <br />
          <ReusableLink href="/profile" linkText="View Profile" />
        </div>
      </section>

      {/* Variants */}
      <section>
        <h3 className="text-lg font-semibold mb-4">Variants</h3>
        <div className="space-y-2">
          <ReusableLink href="/home" variant="default">Default Link</ReusableLink>
          <br />
          <ReusableLink href="/home" variant="primary">Primary Link</ReusableLink>
          <br />
          <ReusableLink href="/home" variant="secondary">Secondary Link</ReusableLink>
          <br />
          <ReusableLink href="/home" variant="muted">Muted Link</ReusableLink>
          <br />
          <ReusableLink href="/home" variant="underline">Underlined Link</ReusableLink>
          <br />
          <ReusableLink href="/home" variant="button">Button Style Link</ReusableLink>
        </div>
      </section>

      {/* Sizes */}
      <section>
        <h3 className="text-lg font-semibold mb-4">Sizes</h3>
        <div className="space-y-2">
          <ReusableLink href="/home" size="sm">Small Link</ReusableLink>
          <br />
          <ReusableLink href="/home" size="md">Medium Link</ReusableLink>
          <br />
          <ReusableLink href="/home" size="lg">Large Link</ReusableLink>
        </div>
      </section>

      {/* Button Variant with Sizes */}
      <section>
        <h3 className="text-lg font-semibold mb-4">Button Variant Sizes</h3>
        <div className="flex gap-4">
          <ReusableLink href="/action" variant="button" size="sm">Small Button</ReusableLink>
          <ReusableLink href="/action" variant="button" size="md">Medium Button</ReusableLink>
          <ReusableLink href="/action" variant="button" size="lg">Large Button</ReusableLink>
        </div>
      </section>

      {/* With Icons */}
      <section>
        <h3 className="text-lg font-semibold mb-4">With Icons</h3>
        <div className="space-y-2">
          <ReusableLink 
            href="/settings" 
            icon={<i className="fa-solid fa-gear" />}
            iconPosition="left"
          >
            Settings
          </ReusableLink>
          <br />
          <ReusableLink 
            href="/next" 
            icon={<i className="fa-solid fa-arrow-right" />}
            iconPosition="right"
          >
            Next Page
          </ReusableLink>
          <br />
          <ReusableLink 
            href="/download" 
            variant="button"
            icon={<i className="fa-solid fa-download" />}
            iconPosition="left"
          >
            Download
          </ReusableLink>
        </div>
      </section>

      {/* External Links */}
      <section>
        <h3 className="text-lg font-semibold mb-4">External Links</h3>
        <div className="space-y-2">
          <ReusableLink href="https://google.com" external>
            Google (Auto-detected)
          </ReusableLink>
          <br />
          <ReusableLink 
            href="https://github.com" 
            target="_blank"
            icon={<i className="fa-solid fa-external-link" />}
            iconPosition="right"
          >
            GitHub
          </ReusableLink>
        </div>
      </section>

      {/* Disabled State */}
      <section>
        <h3 className="text-lg font-semibold mb-4">Disabled State</h3>
        <div className="space-y-2">
          <ReusableLink href="/disabled" disabled>Disabled Link</ReusableLink>
          <br />
          <ReusableLink href="/disabled" variant="button" disabled>
            Disabled Button
          </ReusableLink>
        </div>
      </section>

      {/* With onClick Handler */}
      <section>
        <h3 className="text-lg font-semibold mb-4">With onClick Handler</h3>
        <ReusableLink 
          href="/action"
          onClick={(e) => {
            console.log('Link clicked!');
            // You can add custom logic here
          }}
        >
          Click Me (Check Console)
        </ReusableLink>
      </section>

      {/* Custom Styling */}
      <section>
        <h3 className="text-lg font-semibold mb-4">Custom Styling</h3>
        <div className="space-y-2">
          <ReusableLink 
            href="/custom" 
            className="font-bold text-red-500 hover:text-red-700"
          >
            Custom Red Link
          </ReusableLink>
          <br />
          <ReusableLink 
            href="/custom" 
            variant="button"
            className="bg-green-500 hover:bg-green-600"
          >
            Custom Green Button
          </ReusableLink>
        </div>
      </section>

      {/* Navigation Links (Common Use Case) */}
      <section>
        <h3 className="text-lg font-semibold mb-4">Navigation Menu Example</h3>
        <nav className="flex gap-6">
          <ReusableLink href="/" variant="primary">Home</ReusableLink>
          <ReusableLink href="/about">About</ReusableLink>
          <ReusableLink href="/services">Services</ReusableLink>
          <ReusableLink href="/contact">Contact</ReusableLink>
        </nav>
      </section>

      {/* Footer Links Example */}
      <section>
        <h3 className="text-lg font-semibold mb-4">Footer Links Example</h3>
        <div className="flex gap-4">
          <ReusableLink href="/privacy" variant="muted" size="sm">
            Privacy Policy
          </ReusableLink>
          <ReusableLink href="/terms" variant="muted" size="sm">
            Terms of Service
          </ReusableLink>
          <ReusableLink href="/cookies" variant="muted" size="sm">
            Cookie Policy
          </ReusableLink>
        </div>
      </section>

      {/* Call-to-Action Links */}
      <section>
        <h3 className="text-lg font-semibold mb-4">Call-to-Action Example</h3>
        <div className="flex gap-4">
          <ReusableLink 
            href="/signup" 
            variant="button" 
            size="lg"
            icon={<i className="fa-solid fa-user-plus" />}
          >
            Sign Up Now
          </ReusableLink>
          <ReusableLink 
            href="/learn-more" 
            variant="underline"
            size="lg"
          >
            Learn More
          </ReusableLink>
        </div>
      </section>
    </div>
  );
}
