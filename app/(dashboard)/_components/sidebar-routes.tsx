"use client";

import { LucideIcon } from "lucide-react";
import { usePathname, useRouter } from "next/navigation";
import { cn } from "@/lib/utils";

import {
  Accordion,
  AccordionContent,
  AccordionItem,
  AccordionTrigger,
} from "@/components/ui/accordion";
interface SidebarRoutesProps {
  icon: LucideIcon;
  label: string;
  href: string;
}

const SidebarRoutes = ({ icon: Icon, label, href }: SidebarRoutesProps) => {
  const pathname = usePathname();
  const router = useRouter();

  const isActive =
    (pathname === "/" && href === "/") ||
    pathname === href ||
    pathname?.startsWith(`${href}/`);

  const courseList = [
    { band: "IELTS 5" },
    { band: "IELTS 6.5" },
    { band: "IELTS 7.5" },
  ];

  return (
    <div className="px-2">
      {label === "Dashboard" ? (
        <Accordion type="single" collapsible className="w-full">
          <AccordionItem value="item-1">
            <AccordionTrigger>
              <button
                type="button"
                className={cn(
                  "flex items-center w-full gap-x-2 font-medium text-slate-800 text-sm pl-6 transition-all hover:text-sky-700",
                  isActive && "text-sky-700"
                )}
              >
                <div className="flex items-center justify-center gap-x-2 py-4 text-[16px]">
                  <Icon />
                  {label}
                </div>
              </button>
            </AccordionTrigger>
            <AccordionContent>
              <div className="flex flex-col items-center gap-4 font-medium">
                {courseList.map((course) => (
                  <div key={course.band} className="hover:text-sky-600">
                    <a href="#">{course.band}</a>
                  </div>
                ))}
              </div>
            </AccordionContent>
          </AccordionItem>
        </Accordion>
      ) : (
        <button
          type="button"
          className={cn(
            "flex items-center w-full gap-x-2 font-medium text-slate-800 text-sm pl-6 transition-all hover:text-sky-700",
            isActive && "text-sky-700"
          )}
        >
          <div className="flex items-center gap-x-2 py-4 text-[16px]">
            <Icon size={22} />
            {label}
          </div>
        </button>
      )}
    </div>
  );
};

export default SidebarRoutes;
