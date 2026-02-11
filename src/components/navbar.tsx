"use client";

import React from "react";
import Link from "next/link";
import Image from "next/image";
import { usePathname, useRouter } from "next/navigation";

import {
  Navbar as MTNavbar,
  Collapse,
  Button,
  IconButton,
  Typography,
  Menu,
  MenuHandler,
  MenuList,
  MenuItem,
} from "@material-tailwind/react";

import {
  RectangleStackIcon,
  XMarkIcon,
  Bars3Icon,
  BookOpenIcon,
  UsersIcon,
  WrenchScrewdriverIcon,
  PhoneIcon,
  InformationCircleIcon,
  ShieldCheckIcon,
  UserCircleIcon,
  ArrowRightOnRectangleIcon,
} from "@heroicons/react/24/solid";

const NAV_MENU = [
  { name: "Home", icon: RectangleStackIcon, href: "/" },
  { name: "Books", icon: BookOpenIcon, href: "/books" },
  { name: "Authors", icon: UsersIcon, href: "/authors" },
  { name: "Services", icon: WrenchScrewdriverIcon, href: "/services" },
  { name: "Contact", icon: PhoneIcon, href: "/contact" },
  { name: "About", icon: InformationCircleIcon, href: "/about" },
  { name: "Policies", icon: ShieldCheckIcon, href: "/policies" },
];

interface NavItemProps {
  children: React.ReactNode;
  href?: string;
  active?: boolean;
   onClick?: () => void;
}

function NavItem({ children, href, active, onClick }: NavItemProps) {
  if (!href) return null;

  return (
    <li>
      <Link href={href} onClick={onClick}>
        <Typography
          as="span"
          variant="paragraph"
          className={`flex items-center gap-2 font-medium cursor-pointer transition ${
            active ? "text-gray-900" : "text-gray-700"
          }`}
        >
          {children}
        </Typography>

        <div
          className={`h-[2px] rounded-full transition ${
            active ? "bg-gray-900 w-full" : "bg-transparent w-0"
          }`}
        />
      </Link>
    </li>
  );
}


export default function Navbar() {
  const pathname = usePathname();
  const router = useRouter();

  // ✅ Hide navbar on admin + author dashboard pages
  if (pathname.startsWith("/admin") || pathname.startsWith("/author/dashboard")) {
    return null;
  }

  const [open, setOpen] = React.useState(false);

  // ✅ Auth state
  const [loadingAuth, setLoadingAuth] = React.useState(true);
  const [isLoggedIn, setIsLoggedIn] = React.useState(false);
  const [userName, setUserName] = React.useState("User");

  // ✅ UPDATED: include admin
  const [role, setRole] = React.useState<"user" | "author" | "admin">("user");

  function handleOpen() {
    setOpen((cur) => !cur);
  }

  React.useEffect(() => {
    const onResize = () => window.innerWidth >= 960 && setOpen(false);
    window.addEventListener("resize", onResize);
    return () => window.removeEventListener("resize", onResize);
  }, []);

  // ✅ Load auth status from /api/auth/me
  async function loadMe() {
    try {
      setLoadingAuth(true);

      const res = await fetch("/api/auth/me", { cache: "no-store" });
      const data = await res.json();

      setIsLoggedIn(!!data?.isLoggedIn);
      setUserName(data?.userName || "User");

      // ✅ UPDATED: role set properly (admin/author/user)
      if (data?.role === "admin") setRole("admin");
      else if (data?.role === "author") setRole("author");
      else setRole("user");
    } catch (e) {
      setIsLoggedIn(false);
      setUserName("User");
      setRole("user");
    } finally {
      setLoadingAuth(false);
    }
  }

  React.useEffect(() => {
    loadMe();
  }, [pathname]);

  async function logout() {
    await fetch("/api/auth/logout", { method: "POST" });

    // ✅ instant UI update
    setIsLoggedIn(false);
    setUserName("User");
    setRole("user");

    // ✅ replace history so back button doesn't show protected pages
    router.replace("/");
    router.refresh();
  }

  // ✅ Profile always goes to profile page
  const profileLink = "/account";

  return (
    <MTNavbar
      shadow={false}
      fullWidth
      className="border-0 fixed top-0 left-0 right-0 z-50 bg-white"
    >
      <div className="container mx-auto flex items-center justify-between">
        {/* ✅ Logo */}
        <Link href="/" className="flex items-center gap-3 group">
          <div className="h-12 w-12 overflow-hidden rounded-xl border border-gray-200 bg-white shadow-sm">
            <Image
              src="/logo.jpg"
              alt="Dan Aliph Logo"
              width={48}
              height={48}
              priority
              className="h-12 w-12 object-cover group-hover:scale-105 transition"
            />
          </div>

          <div className="flex flex-col leading-none">
            <Typography color="blue-gray" className="text-lg font-bold">
              Dan Aliph
            </Typography>
            <Typography className="text-xs font-medium text-gray-500">
              Book Publication Platform
            </Typography>
          </div>
        </Link>

        {/* ✅ Desktop Menu */}
        <ul className="ml-10 hidden items-center gap-8 lg:flex">
          {NAV_MENU.map(({ name, icon: Icon, href }) => (
            <NavItem
              key={name}
              href={href}
              active={pathname === href || pathname.startsWith(`${href}/`)}
            >
              <Icon className="h-5 w-5" />
              {name}
            </NavItem>
          ))}
        </ul>

        {/* ✅ Desktop Right Side */}
        <div className="hidden items-center gap-2 lg:flex">
          {loadingAuth ? null : !isLoggedIn ? (
            <>
              <Link href="/login">
                <Button variant="text">Log in</Button>
              </Link>

              <Link href="/register">
                <Button color="gray">Register</Button>
              </Link>
            </>
          ) : (
            <Menu placement="bottom-end">
              <MenuHandler>
                <Button variant="text" className="flex items-center gap-2 px-2">
                  <div className="flex items-center gap-2 rounded-full border border-gray-200 bg-white px-2 py-1 shadow-sm">
                    <UserCircleIcon className="h-8 w-8 text-gray-800" />
                    <span className="text-sm font-semibold">{userName}</span>
                  </div>
                </Button>
              </MenuHandler>

              <MenuList className="rounded-xl">
                {/* ✅ Profile */}
                <Link href={profileLink}>
                  <MenuItem className="flex items-center gap-2">
                    <UserCircleIcon className="h-5 w-5" />
                    Profile
                  </MenuItem>
                </Link>

                {/* ✅ Admin Dashboard */}
                {role === "admin" && (
                  <Link href="/admin">
                    <MenuItem className="flex items-center gap-2">
                      <RectangleStackIcon className="h-5 w-5" />
                      Admin Dashboard
                    </MenuItem>
                  </Link>
                )}

                {/* ✅ Author Dashboard */}
                {role === "author" && (
                  <Link href="/author/dashboard">
                    <MenuItem className="flex items-center gap-2">
                      <RectangleStackIcon className="h-5 w-5" />
                      Author Dashboard
                    </MenuItem>
                  </Link>
                )}

                {/* ✅ Logout */}
                <MenuItem
                  onClick={logout}
                  className="flex items-center gap-2 text-red-600"
                >
                  <ArrowRightOnRectangleIcon className="h-5 w-5" />
                  Logout
                </MenuItem>
              </MenuList>
            </Menu>
          )}
        </div>

        {/* ✅ Mobile menu icon */}
        <IconButton
          variant="text"
          color="gray"
          onClick={handleOpen}
          className="ml-auto inline-block lg:hidden"
        >
          {open ? (
            <XMarkIcon strokeWidth={2} className="h-6 w-6" />
          ) : (
            <Bars3Icon strokeWidth={2} className="h-6 w-6" />
          )}
        </IconButton>
      </div>

      {/* ✅ Mobile Menu */}
      <Collapse open={open}>
        <div className="container mx-auto mt-3 border-t border-gray-200 px-2 pt-4">
          <ul className="flex flex-col gap-4">
            {NAV_MENU.map(({ name, icon: Icon, href }) => (
              <NavItem
                key={name}
                href={href}
                active={pathname === href || pathname.startsWith(`${href}/`)}
                  onClick={() => setOpen(false)}
              >
                <Icon className="h-5 w-5" />
                {name}
              </NavItem>
            ))}
          </ul>

          <div className="mt-6 mb-4 flex items-center gap-2">
            {loadingAuth ? null : !isLoggedIn ? (
              <>
                <Link href="/login" className="w-1/2">
                  <Button variant="text" fullWidth>
                    Log in
                  </Button>
                </Link>

                <Link href="/register" className="w-1/2">
                  <Button color="gray" fullWidth>
                    Register
                  </Button>
                </Link>
              </>
            ) : (
              <>
                {/* ✅ Profile always */}
                <Link href="/account" className="w-1/2">
                  <Button fullWidth color="gray">
                    Profile
                  </Button>
                </Link>

                {/* ✅ Dashboard buttons based on role */}
                {role === "admin" && (
                  <Link href="/admin" className="w-1/2">
                    <Button fullWidth color="gray">
                      Admin Dashboard
                    </Button>
                  </Link>
                )}

                {role === "author" && (
                  <Link href="/author/dashboard" className="w-1/2">
                    <Button fullWidth color="gray">
                      Author Dashboard
                    </Button>
                  </Link>
                )}

                <Button color="red" fullWidth onClick={logout}>
                  Logout
                </Button>
              </>
            )}
          </div>
        </div>
      </Collapse>
    </MTNavbar>
  );
}
