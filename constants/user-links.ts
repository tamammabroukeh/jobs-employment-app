import { BarChart3, Radio, User } from "lucide-react";
export const userLinks: MenuItem[] = [
  {
    icon: BarChart3,
    // icon: React.createElement(Radio, { size: 25 }),
    title: "لوحة التحكم",
    href: "/dashboard",
  },
  {
    icon: Radio,
    title: "الشكاوي التي قدمتها",
    href: "/complaints",
  },
  {
    icon: User,
    title: "الملف الشخصي",
    href: "/profile",
  },
];