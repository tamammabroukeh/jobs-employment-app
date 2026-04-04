import { Flex } from "@/components/Reusable-Components";
import LocaleSwitcher from "@/components/LocaleSwitcher";
import ThemeSwitcher from "@/components/ThemeSwitcher";
import LoginForm from "@/components/auth/LoginForm";
export default function LoginPage() {
  return (
    <div className="min-h-screen auth-bg">
      {/* Header with switchers */}
      <div className="absolute top-4 right-4 flex items-center gap-3">
        <ThemeSwitcher />
        <LocaleSwitcher />
      </div>

      <Flex classes="min-h-screen px-4">
        <div className="w-full max-w-md">
          {/* Logo/Brand */}
          <div className="text-center mb-8">
            <div className="w-16 h-16 bg-primary rounded-2xl flex items-center justify-center mx-auto mb-4 shadow-lg">
              <i className="fa-solid fa-briefcase text-2xl text-white" />
            </div>
            <h1 className="text-2xl font-bold text-foreground">JobsPortal</h1>
          </div>
          <LoginForm />
        </div>
      </Flex>
    </div>
  );
}
