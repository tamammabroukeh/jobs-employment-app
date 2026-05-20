"use client"
import ThemeSwitcher from "@/components/ThemeSwitcher";
import LocaleSwitcher from "@/components/LocaleSwitcher";
import LogoutButton from "@/components/LogoutButton";
import { ReusableButton } from "@/components/Reusable-Components";
import { useRouter, usePathname } from "next/navigation";
import ROUTES, { NAVBAR_LINKS } from "@/constants/routes";
import Link from "next/link";
import { useAuth } from "@/hooks/useAuth";

function NavbarActions() {
  const router = useRouter();
  const { isAuthenticated } = useAuth()
  const pathname = usePathname();
  return (
    <div className="flex items-center gap-6 w-full">
      {/* Navigation Links - Left Side */}
      <nav className="flex items-center gap-6 flex-1">
        {NAVBAR_LINKS.filter(link => link.showInNavbar).map((link) => (
          <Link
            key={link.href}
            href={link.href}
            className={`text-sm font-medium transition-colors hover:text-primary ${
              pathname === link.href
                ? 'text-primary'
                : 'text-foreground'
            }`}
          >
            {link.label}
          </Link>
        ))}
      </nav>

      {/* Right Side Actions */}
      <div className="flex items-center gap-4">
        <ThemeSwitcher />
        <LocaleSwitcher />
        
        {isAuthenticated ? (
          // Show logout button when user is logged in
          <>
            <LogoutButton />
          </>
        ) : (
          // Show login/register buttons when user is not logged in
          <>
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
          </>
        )}
      </div>
    </div>
  );
}

export default NavbarActions;
