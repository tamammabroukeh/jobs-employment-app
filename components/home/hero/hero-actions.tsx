"use client"
import { ReusableButton } from "@/components/Reusable-Components";
import ROUTES from "@/constants/routes";
import { useRouter } from "next/navigation";

function HeroActions() {
    const router = useRouter()
  return (
    <div className="flex flex-col sm:flex-row gap-4 justify-center">
      <ReusableButton
        btnText="Get Started"
        onClick={() => router.push(ROUTES.AUTH.LOGIN)}
        variant="primary"
        className="h-12 px-8 text-lg"
      />
      <ReusableButton
        btnText="Browse Jobs"
        onClick={() => router.push(ROUTES.JOB.LIST)}
        variant="default"
        className="h-12 px-8 text-lg"
      />
    </div>
  );
}

export default HeroActions;
