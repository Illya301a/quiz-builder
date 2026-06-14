"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";

const navigation = [
  { href: "/quizzes", label: "Quizzes" },
  { href: "/create", label: "Create quiz" },
];

export function AppHeader() {
  const pathname = usePathname();

  return (
    <header className="site-header">
      <div className="site-header__inner">
        <Link className="brand" href="/quizzes">
          Quiz Builder
        </Link>

        <nav className="site-nav" aria-label="Main navigation">
          {navigation.map((item) => {
            const isActive =
              item.href === "/quizzes"
                ? pathname.startsWith("/quizzes")
                : pathname === item.href;

            return (
              <Link
                key={item.href}
                href={item.href}
                aria-current={isActive ? "page" : undefined}
              >
                {item.label}
              </Link>
            );
          })}
        </nav>
      </div>
    </header>
  );
}
