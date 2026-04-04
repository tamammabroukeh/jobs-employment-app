import { ForwardRefExoticComponent, RefAttributes } from "react";
import { Home, Layers, LucideProps, PhoneForwarded } from "lucide-react";
import { Routes } from "./enums";

export interface NavigationLink {
  href?: string;
  title: string;
  icon?: ForwardRefExoticComponent<
    Omit<LucideProps, "ref"> & RefAttributes<SVGSVGElement>
  >;
  children?: NavigationLink[];
}
export const navigationLinks: NavigationLink[] = [
  {
    title: "محافظة ريف دمشق",
    href: Routes.HOME,
    icon: Home,
  },
  {
    title: "تقديم شكوى",
    href: Routes.COMPLAINTS,
    icon: Layers,
    // children: [
    //   { title: "الشكاوي", href: `${Routes.HOME}${Routes.COMPLAINTS}` },
    //   {
    //     title: "البحث عن شكوى",
    //     href: `/${Routes.COMPLAINTS}?${ComplaintsTabs.search}`,
    //   },
    // ],
  },
  // {
  //   title: "الخدمات",
  //   // href: `${Routes.HOME}/${Routes.SERVICES}`,
  //   icon: Layers,
  //   children: [
  //     { title: "الشكاوي", href: `${Routes.HOME}${Routes.COMPLAINTS}` },
  //     {
  //       title: "البحث عن شكوى",
  //       href: `/${Routes.COMPLAINTS}?${ComplaintsTabs.search}`,
  //     },
  //   ],
  // },
  // {
  //   title: "عن المحافظة",
  //   icon: BadgeAlert,
  //   children: [
  //     { title: "الهيكل الإداري", href: "/about/structure" },
  //     { title: "المناطق", href: "/about/regions" },
  //   ],
  // },
  {
    title: "تواصل معنا",
    icon: PhoneForwarded,
    href: `${Routes.HOME}${Routes.CONTACT}`,
  },
];
