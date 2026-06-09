"use client";
import Link from "next/link";
import { usePathname } from "next/navigation";

export default function Navbar() {
  const pathname = usePathname();

  const links = [
    { name: "Docs", path: "/docs" },
    { name: "Installer", path: "/installer" },
    { name: "Tools", path: "/tools" },
  ];

  return (
    <div className="w-full flex justify-center fixed top-0 z-50 pointer-events-none">
      <nav className="w-full max-w-7xl flex justify-between items-center p-6 border-b border-nothing-border backdrop-blur-md bg-black/10 pointer-events-auto">
        
        {/* Логотип залишаємо без змін */}
        <Link href="/" className="font-dot text-2xl tracking-widest text-nothing-text hover:text-white transition-colors">
          KURUMACHI<span className="text-nothing-red">.</span>
        </Link>

        {/* Центральні лінки: збільшено з text-xs до text-sm */}
        <div className="hidden md:flex items-center gap-8 font-dot text-sm tracking-widest uppercase">
          {links.map((link) => (
            <Link
              key={link.path}
              href={link.path}
              className={`transition-colors duration-300 ${
                pathname === link.path ? "text-nothing-red" : "text-nothing-text/50 hover:text-white"
              }`}
            >
              {link.name}
            </Link>
          ))}
        </div>

        {/* Кнопка: збільшено з text-sm до text-base */}
        <Link 
          href="/installer"
          className="text-base font-dot uppercase tracking-widest border border-nothing-border px-5 py-2 hover:bg-white hover:text-black transition-colors duration-300"
        >
          Connect Device
        </Link>
      </nav>
    </div>
  );
}