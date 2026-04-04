"use client"
import ThemeSwitcher from "@/components/ThemeSwitcher";
import LocaleSwitcher from "@/components/LocaleSwitcher";
import { ReusableButton } from "@/components/Reusable-Components";
import { useRouter } from "next/navigation";
import ROUTES from "@/constants/routes";

function NavbarActions() {
  const router = useRouter();
  return (
    <div className="flex items-center gap-4">
      <ThemeSwitcher />
      <LocaleSwitcher />
      <ReusableButton
        btnText="Login"
        onClick={() => router.push(ROUTES.AUTH.LOGIN)}
        variant="default"
      />
      
      <ReusableButton
        btnText="Register"
        onClick={() => router.push(ROUTES.AUTH.REGISTER)}
        variant="primary"
      />
    </div>
  );
}

export default NavbarActions;
