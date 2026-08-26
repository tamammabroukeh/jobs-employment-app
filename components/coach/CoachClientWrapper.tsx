"use client";

import dynamic from "next/dynamic";
import { Spin } from "antd";

// Load CoachClient without SSR to prevent hydration issues with timestamps
const CoachClient = dynamic(() => import("./CoachClient"), {
  ssr: false,
  loading: () => (
    <div className="flex h-full w-full items-center justify-center bg-background">
      <Spin size="large" />
    </div>
  ),
});

export default function CoachClientWrapper() {
  return <CoachClient />;
}
