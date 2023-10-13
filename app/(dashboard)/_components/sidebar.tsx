"use client";

import Image from "next/image";
import { usePathname } from "next/navigation";
import { BarChart, CalendarDays, Layout, List, Search } from "lucide-react";
import SidebarRoutes from "./sidebar-routes";

const studentRoutes = [
  {
    icon: Layout,
    label: "Dashboard",
    href: "/",
  },
  {
    icon: CalendarDays,
    label: "Schedule",
    href: "/schedule",
  },
  {
    icon: Search,
    label: "Search",
    href: "/search",
  },
];

const teacherRoutes = [
  {
    icon: List,
    label: "Courses",
    href: "/teacher/courses",
  },
  {
    icon: BarChart,
    label: "Analytics",
    href: "/teacher/analytics",
  },
];

const Sidebar = () => {
  const pathname = usePathname();
  const isTeacherPage = pathname?.includes("/teacher");
  const routes = isTeacherPage ? teacherRoutes : studentRoutes;

  return (
    <div className="h-full border-r flex flex-col overflow-y-auto bg-white shadow-md">
      <div className="flex items-center justify-center gap-2 p-8">
        <Image src="/logo.svg" alt="logo" width={40} height={40} />
        <p className="font-bold text-lg xl:text-xl text-orange-600">NgaIELTS</p>
      </div>
      <div className="flex flex-col w-full">
        {routes.map((route) => (
          <SidebarRoutes
            key={route.href}
            icon={route.icon}
            label={route.label}
            href={route.href}
          />
        ))}
      </div>
    </div>
  );
};

export default Sidebar;
