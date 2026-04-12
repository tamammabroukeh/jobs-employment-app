/**
 * ReusableBadge Component Examples
 * 
 * This file demonstrates various use cases for the ReusableBadge component.
 * Delete this file if not needed.
 */

import ReusableBadge from "./Reusable-Badge";

export function BadgeExamples() {
  return (
    <div className="space-y-6 p-6">
      {/* Variants */}
      <div>
        <h3 className="text-lg font-semibold mb-3">Variants</h3>
        <div className="flex flex-wrap gap-2">
          <ReusableBadge variant="primary">Primary</ReusableBadge>
          <ReusableBadge variant="success">Success</ReusableBadge>
          <ReusableBadge variant="warning">Warning</ReusableBadge>
          <ReusableBadge variant="danger">Danger</ReusableBadge>
          <ReusableBadge variant="info">Info</ReusableBadge>
          <ReusableBadge variant="default">Default</ReusableBadge>
        </div>
      </div>

      {/* Sizes */}
      <div>
        <h3 className="text-lg font-semibold mb-3">Sizes</h3>
        <div className="flex flex-wrap items-center gap-2">
          <ReusableBadge variant="primary" size="sm">Small</ReusableBadge>
          <ReusableBadge variant="primary" size="md">Medium</ReusableBadge>
          <ReusableBadge variant="primary" size="lg">Large</ReusableBadge>
        </div>
      </div>

      {/* Use Cases */}
      <div>
        <h3 className="text-lg font-semibold mb-3">Use Cases</h3>
        
        {/* Status Badges */}
        <div className="mb-4">
          <h4 className="text-sm font-medium mb-2">Status Indicators</h4>
          <div className="flex flex-wrap gap-2">
            <ReusableBadge variant="success">Active</ReusableBadge>
            <ReusableBadge variant="warning">Pending</ReusableBadge>
            <ReusableBadge variant="danger">Inactive</ReusableBadge>
          </div>
        </div>

        {/* Job Tags */}
        <div className="mb-4">
          <h4 className="text-sm font-medium mb-2">Job Tags</h4>
          <div className="flex flex-wrap gap-2">
            <ReusableBadge variant="primary">Full-time</ReusableBadge>
            <ReusableBadge variant="success">Remote</ReusableBadge>
            <ReusableBadge variant="warning">Senior Level</ReusableBadge>
          </div>
        </div>

        {/* Counts */}
        <div className="mb-4">
          <h4 className="text-sm font-medium mb-2">Notification Counts</h4>
          <div className="flex flex-wrap gap-4">
            <div className="flex items-center gap-2">
              <span>Messages</span>
              <ReusableBadge variant="danger" size="sm">5</ReusableBadge>
            </div>
            <div className="flex items-center gap-2">
              <span>Notifications</span>
              <ReusableBadge variant="primary" size="sm">12</ReusableBadge>
            </div>
          </div>
        </div>

        {/* With Icons */}
        <div className="mb-4">
          <h4 className="text-sm font-medium mb-2">With Icons</h4>
          <div className="flex flex-wrap gap-2">
            <ReusableBadge variant="success">
              <i className="fa-solid fa-check mr-1" />
              Verified
            </ReusableBadge>
            <ReusableBadge variant="warning">
              <i className="fa-solid fa-clock mr-1" />
              Pending
            </ReusableBadge>
            <ReusableBadge variant="danger">
              <i className="fa-solid fa-xmark mr-1" />
              Rejected
            </ReusableBadge>
          </div>
        </div>
      </div>

      {/* Custom Styling */}
      <div>
        <h3 className="text-lg font-semibold mb-3">Custom Styling</h3>
        <div className="flex flex-wrap gap-2">
          <ReusableBadge variant="primary" className="uppercase font-bold">
            Custom
          </ReusableBadge>
          <ReusableBadge variant="success" className="italic">
            Italic Style
          </ReusableBadge>
        </div>
      </div>
    </div>
  );
}
