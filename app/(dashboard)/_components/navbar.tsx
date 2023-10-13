"use client";

import { Menu } from "lucide-react";
import { Sheet, SheetContent, SheetTrigger } from "@/components/ui/sheet";
import Sidebar from "./sidebar";
import { usePathname } from "next/navigation";
import { LogOut } from "lucide-react";
import { Button } from "@/components/ui/button";
import Link from "next/link";
import { UserButton } from "@clerk/nextjs";

const Navbar = () => {
  const pathname = usePathname();

  const isTeacherPage = pathname?.startsWith("/teacher");
  const isStudentPage = pathname?.startsWith("/courses");

  return (
    <div className="p-3 border-b bg-white h-full flex items-center justify-between shadow-sm">
      {/* MobileSidebar */}
      <Sheet>
        <SheetTrigger className="md:hidden pr-4 hover:text-primary transition">
          <Menu />
        </SheetTrigger>
        <SheetContent side="left" className="w-[300px] p-0">
          <Sidebar />
        </SheetContent>
      </Sheet>
      {/* Navbar routes */}
      <div className="flex gap-x-3 ml-auto">
        {isTeacherPage || isStudentPage ? (
          <Button size="sm">
            <LogOut />
            LogOut
          </Button>
        ) : (
          <Link href="/teacher">
            <Button size="sm">Teacher mode</Button>
          </Link>
        )}
        <UserButton afterSignOutUrl="/" />
      </div>
    </div>
  );
};

export default Navbar;
