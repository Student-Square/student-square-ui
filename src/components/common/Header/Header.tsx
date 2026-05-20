"use client";
import Link from "next/link";
import Image from "next/image";
import { usePathname } from "next/navigation";
import { useEffect, useState, useCallback, useRef } from "react";
import { useTheme } from "next-themes";
import { Search, Sun, Moon, X, Heart, ChevronDown, Menu, Languages } from "lucide-react";
import { motion, AnimatePresence } from "motion/react";
import { Oswald } from "next/font/google";
import menuData from "./menuData";

const oswald = Oswald({
  subsets: ["latin"],
  weight: ["400", "500", "600", "700"],
});

const Header = () => {
  const [navbarOpen, setNavbarOpen] = useState(false);
  const [sticky, setSticky] = useState(false);
  const [openIndex, setOpenIndex] = useState(-1);
  const [openSubIndex, setOpenSubIndex] = useState(-1);
  const { theme, setTheme, resolvedTheme } = useTheme();
  const [mounted, setMounted] = useState(false);
  const [donateRipple, setDonateRipple] = useState(false);
  const [scrollProgress, setScrollProgress] = useState(0);
  const [languageMenuOpen, setLanguageMenuOpen] = useState(false);
  const [language, setLanguage] = useState<"EN" | "BN">("EN");
  const languageMenuRef = useRef<HTMLDivElement>(null);
  const pathname = usePathname();

  // Close language dropdown when clicking outside
  useEffect(() => {
    if (!languageMenuOpen) return;
    const handleClickOutside = (e: MouseEvent | TouchEvent) => {
      if (languageMenuRef.current && !languageMenuRef.current.contains(e.target as Node)) {
        setLanguageMenuOpen(false);
      }
    };
    document.addEventListener("mousedown", handleClickOutside);
    document.addEventListener("touchstart", handleClickOutside);
    return () => {
      document.removeEventListener("mousedown", handleClickOutside);
      document.removeEventListener("touchstart", handleClickOutside);
    };
  }, [languageMenuOpen]);

  useEffect(() => {
    try {
      const saved = window.localStorage.getItem("ss_language");
      if (saved === "EN" || saved === "BN") setLanguage(saved);
    } catch {
      // ignore
    }
  }, []);

  const handleStickyNavbar = useCallback(() => {
    const scrollTop = window.scrollY || document.documentElement.scrollTop;
    const scrollableHeight = document.documentElement.scrollHeight - window.innerHeight;

    setSticky(scrollTop >= 80);

    if (pathname === "/") {
      const progress = scrollableHeight > 0 ? (scrollTop / scrollableHeight) * 100 : 0;
      setScrollProgress(Math.min(100, Math.max(0, progress)));
      return;
    }

    setScrollProgress(0);
  }, [pathname]);

  useEffect(() => {
    window.addEventListener("scroll", handleStickyNavbar);
    window.addEventListener("resize", handleStickyNavbar);
    handleStickyNavbar();

    return () => {
      window.removeEventListener("scroll", handleStickyNavbar);
      window.removeEventListener("resize", handleStickyNavbar);
    };
  }, [handleStickyNavbar]);

  useEffect(() => {
    setMounted(true);
  }, []);

  // Close navbar on route change
  useEffect(() => {
    setNavbarOpen(false);
    setOpenIndex(-1);
    setOpenSubIndex(-1);
    setLanguageMenuOpen(false);
  }, [pathname]);

  // Prevent body scroll when mobile menu is open
  useEffect(() => {
    if (navbarOpen) {
      document.body.style.overflow = "hidden";
    } else {
      document.body.style.overflow = "";
    }
    return () => {
      document.body.style.overflow = "";
    };
  }, [navbarOpen]);

  const toggleTheme = () => setTheme(resolvedTheme === "dark" ? "light" : "dark");

  const handleSubmenu = (index: number) => {
    setOpenIndex(openIndex === index ? -1 : index);
    setOpenSubIndex(-1);
  };

  const handleSubSubmenu = (subIndex: number) => {
    setOpenSubIndex(openSubIndex === subIndex ? -1 : subIndex);
  };

  const currentTheme = mounted ? resolvedTheme : "light";

  return (
    <header
      className={`fixed top-0 left-0 z-50 w-full transition-all duration-500 ease-out ${
        sticky
          ? "bg-background/80 backdrop-blur-xl shadow-sm border-b border-border/50"
          : "bg-transparent"
      }`}
    >
      <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8 2xl:max-w-[1600px] 3xl:max-w-[1800px] 4xl:max-w-[2000px]">
        <div className="flex h-12 items-center justify-between sm:h-14 lg:h-16 2xl:h-20 3xl:h-24 4xl:h-28">
          {/* Logo */}
          <Link href="/" className="relative z-50 flex items-center">
            <motion.div
              whileHover={{ scale: 1.02 }}
              whileTap={{ scale: 0.98 }}
              className="flex items-center"
            >
              <Image
                src="/images/ss-logo.png"
                alt="Student Square Logo"
                width={160}
                height={44}
                className="h-8 w-auto sm:h-10 lg:h-11 2xl:h-14 3xl:h-16 4xl:h-20"
                priority
              />
            </motion.div>
          </Link>

          {/* Desktop Navigation */}
          <nav className="hidden lg:flex lg:items-center lg:gap-1">
            {menuData.map((menuItem, index) => (
              <div key={menuItem.id} className="relative">
                {!menuItem.submenu ? (
                  <Link
                    href={menuItem.path || "/"}
                    className={`group relative px-4 py-2 font-medium uppercase tracking-wide transition-colors text-[16px] ${oswald.className} 2xl:text-lg 2xl:px-5 3xl:text-xl 3xl:px-6 4xl:text-2xl 4xl:px-8 ${
                      pathname === menuItem.path
                        ? "text-primary"
                        : "text-muted-foreground hover:text-foreground"
                    }`}
                  >
                    {menuItem.title}
                    <span className="absolute bottom-0 left-1/2 h-0.5 w-0 -translate-x-1/2 bg-primary transition-all duration-300 group-hover:w-full" />
                  </Link>
                ) : (
                  <div
                    className="group"
                    onMouseEnter={() => setOpenIndex(index)}
                    onMouseLeave={() => {
                      setOpenIndex(-1);
                      setOpenSubIndex(-1);
                    }}
                  >
                    {menuItem.path ? (
                      <Link
                        href={menuItem.path}
                        className={`flex items-center gap-1.5 px-4 py-2 font-medium uppercase tracking-wide transition-colors text-[16px] ${oswald.className} 2xl:text-lg 2xl:px-5 3xl:text-xl 3xl:px-6 4xl:text-2xl 4xl:px-8 ${
                          pathname.startsWith(menuItem.path)
                            ? "text-primary"
                            : "text-muted-foreground hover:text-foreground"
                        }`}
                      >
                        {menuItem.title}
                        <ChevronDown
                          className={`h-4 w-4 text-red-500 transition-transform duration-300 ${
                            openIndex === index ? "rotate-180" : ""
                          }`}
                        />
                      </Link>
                    ) : (
                    <button
                      type="button"
                      className={`flex items-center gap-1.5 px-4 py-2 font-medium uppercase tracking-wide text-muted-foreground transition-colors hover:text-foreground text-[16px] ${oswald.className} 2xl:text-lg 2xl:px-5 3xl:text-xl 3xl:px-6 4xl:text-2xl 4xl:px-8`}
                    >
                      {menuItem.title}
                      <ChevronDown
                        className={`h-4 w-4 text-red-500 transition-transform duration-300 ${
                          openIndex === index ? "rotate-180" : ""
                        }`}
                      />
                    </button>
                    )}

                    {/* Mega Menu Dropdown */}
                    <AnimatePresence>
                      {openIndex === index && menuItem.submenu && (
                        <motion.div
                          initial={{ opacity: 0, y: 10, scale: 0.95 }}
                          animate={{ opacity: 1, y: 0, scale: 1 }}
                          exit={{ opacity: 0, y: 10, scale: 0.95 }}
                          transition={{ duration: 0.2, ease: "easeOut" }}
                          className="absolute left-0 top-full mt-2 w-72 origin-top-left"
                        >
                          <div className="rounded-2xl border border-border/50 bg-popover/95 p-2 shadow-xl backdrop-blur-xl">
                            {menuItem.submenu.map((submenuItem, subIndex) => (
                              <div key={submenuItem.id}>
                                {submenuItem.submenu ? (
                                  <div
                                    className="relative"
                                    onMouseEnter={() => setOpenSubIndex(subIndex)}
                                    onMouseLeave={() => setOpenSubIndex(-1)}
                                  >
                                    <button
                                      type="button"
                                      className="flex w-full items-center justify-between gap-3 rounded-xl px-4 py-3 text-sm text-popover-foreground transition-colors hover:bg-accent"
                                    >
                                      <span className="flex items-center gap-3">
                                        {submenuItem.icon && (
                                          <submenuItem.icon className="h-4 w-4 text-muted-foreground" />
                                        )}
                                        {submenuItem.title}
                                      </span>
                                      <ChevronDown className="h-4 w-4 -rotate-90 text-red-500" />
                                    </button>

                                    {/* Sub-submenu */}
                                    <AnimatePresence>
                                      {openSubIndex === subIndex && (
                                        <motion.div
                                          initial={{ opacity: 0, x: -10 }}
                                          animate={{ opacity: 1, x: 0 }}
                                          exit={{ opacity: 0, x: -10 }}
                                          transition={{ duration: 0.15 }}
                                          className="absolute left-full top-0 w-64"
                                        >
                                          <div className="overflow-hidden rounded-2xl border border-border/50 bg-popover/95 p-2 shadow-xl backdrop-blur-xl">
                                            {submenuItem.submenu.map((subSubItem) => (
                                              <Link
                                                key={subSubItem.id}
                                                href={subSubItem.path || "#"}
                                                className="flex items-center gap-3 rounded-xl px-4 py-3 text-sm text-popover-foreground transition-colors hover:bg-accent"
                                              >
                                                {subSubItem.icon && (
                                                  <subSubItem.icon className="h-4 w-4 text-muted-foreground" />
                                                )}
                                                {subSubItem.title}
                                              </Link>
                                            ))}
                                          </div>
                                        </motion.div>
                                      )}
                                    </AnimatePresence>
                                  </div>
                                ) : (
                                  <Link
                                    href={submenuItem.path || "#"}
                                    className="flex items-center gap-3 rounded-xl px-4 py-3 text-sm text-popover-foreground transition-colors hover:bg-accent"
                                  >
                                    {submenuItem.icon && (
                                      <submenuItem.icon className="h-4 w-4 text-muted-foreground" />
                                    )}
                                    {submenuItem.title}
                                  </Link>
                                )}
                              </div>
                            ))}
                          </div>
                        </motion.div>
                      )}
                    </AnimatePresence>
                  </div>
                )}
              </div>
            ))}
          </nav>

          {/* Right Side Actions */}
          <div className="flex items-center gap-2">
            {/* Search Button - Hidden on small mobile */}
            <motion.button
              whileHover={{ scale: 1.05 }}
              whileTap={{ scale: 0.95 }}
              className="hidden h-9 w-9 items-center justify-center rounded-lg border border-border/50 bg-transparent text-muted-foreground transition-colors hover:bg-accent/20 hover:text-foreground sm:flex sm:h-10 sm:w-10 sm:rounded-xl 2xl:h-12 2xl:w-12 3xl:h-14 3xl:w-14 4xl:h-16 4xl:w-16"
              aria-label="Search"
            >
              <Search className="h-4 w-4" />
            </motion.button>

            {/* Theme Toggle - Always visible */}
            {mounted && (
              <motion.button
                whileHover={{ scale: 1.05 }}
                whileTap={{ scale: 0.95 }}
                onClick={toggleTheme}
                className="flex h-9 w-9 items-center justify-center rounded-lg border border-border/50 bg-transparent text-muted-foreground transition-colors hover:bg-accent/20 hover:text-foreground sm:h-10 sm:w-10 sm:rounded-xl 2xl:h-12 2xl:w-12 3xl:h-14 3xl:w-14 4xl:h-16 4xl:w-16"
                aria-label={`Switch to ${currentTheme === "dark" ? "light" : "dark"} mode`}
              >
                <AnimatePresence mode="wait">
                  {currentTheme === "dark" ? (
                    <motion.div
                      key="moon"
                      initial={{ rotate: -90, opacity: 0 }}
                      animate={{ rotate: 0, opacity: 1 }}
                      exit={{ rotate: 90, opacity: 0 }}
                      transition={{ duration: 0.2 }}
                    >
                      <Moon className="h-4 w-4" />
                    </motion.div>
                  ) : (
                    <motion.div
                      key="sun"
                      initial={{ rotate: 90, opacity: 0 }}
                      animate={{ rotate: 0, opacity: 1 }}
                      exit={{ rotate: -90, opacity: 0 }}
                      transition={{ duration: 0.2 }}
                    >
                      <Sun className="h-4 w-4" />
                    </motion.div>
                  )}
                </AnimatePresence>
              </motion.button>
            )}

            {/* Calendar button hidden for now */}

            {/* Language - compact text pill, minimal style */}
            <div ref={languageMenuRef} className="relative hidden sm:block">
              <motion.button
                whileHover={{ scale: 1.02 }}
                whileTap={{ scale: 0.98 }}
                onClick={() => setLanguageMenuOpen((v) => !v)}
                className="flex h-9 items-center gap-1 rounded-lg px-2.5 text-sm font-medium text-muted-foreground transition-colors hover:text-foreground sm:h-10 sm:px-3"
                aria-label="Language"
              >
                <Languages className="h-3.5 w-3.5" />
                <span>{language}</span>
                <ChevronDown className={`h-3.5 w-3.5 transition-transform ${languageMenuOpen ? "rotate-180" : ""}`} />
              </motion.button>
              <AnimatePresence>
                {languageMenuOpen && (
                  <motion.div
                    initial={{ opacity: 0, y: 6, scale: 0.98 }}
                    animate={{ opacity: 1, y: 0, scale: 1 }}
                    exit={{ opacity: 0, y: 6, scale: 0.98 }}
                    transition={{ duration: 0.15 }}
                    className="absolute right-0 top-full z-50 mt-2 w-28 overflow-hidden rounded-xl border border-border/50 bg-popover/95 shadow-xl backdrop-blur-xl"
                  >
                    {(["EN", "BN"] as const).map((lng) => (
                      <button
                        key={lng}
                        type="button"
                        onClick={() => {
                          setLanguage(lng);
                          setLanguageMenuOpen(false);
                          try {
                            window.localStorage.setItem("ss_language", lng);
                          } catch {}
                        }}
                        className={`flex w-full items-center justify-between px-3 py-2.5 text-sm transition-colors hover:bg-accent ${
                          language === lng ? "font-semibold text-foreground" : "text-muted-foreground"
                        }`}
                      >
                        <span>{lng}</span>
                        {language === lng && <span className="text-emerald-500">✓</span>}
                      </button>
                    ))}
                  </motion.div>
                )}
              </AnimatePresence>
            </div>

            {/* Login - outlined CTA, stands out before Donate */}
            <Link
              href="/login"
              className="hidden h-8 items-center rounded-full border-2 border-emerald-500/70 px-3 text-xs font-semibold text-emerald-600 transition-all duration-300 hover:bg-emerald-500/15 hover:border-emerald-500 dark:text-emerald-400 dark:hover:bg-emerald-500/20 sm:inline-flex sm:h-9 sm:px-4 sm:text-sm"
            >
              Login
            </Link>

          {/* Donate Button - Hidden on small mobile, show on tablet and above */}
          <div className="hidden md:flex ml-2 mr-2 lg:mr-3 xl:ml-3 xl:mr-0 2xl:ml-4 relative z-30">
            <Link
              href="/donate"
              className="donate-animated relative flex items-center justify-center rounded-full 
                         px-2.5 py-1.5 md:px-4 lg:px-4 xl:px-5 2xl:px-3.5 h-8 md:h-9
                         shadow-lg text-xs md:text-sm
                         font-semibold tracking-wide 
                         transition-all duration-300 hover:scale-105 
                         group overflow-hidden text-white
                         bg-gradient-to-r from-emerald-500 to-emerald-600 
                         hover:from-emerald-600 hover:to-emerald-700"
              onClick={() => {
                setDonateRipple(true);
                setTimeout(() => setDonateRipple(false), 450);
              }}
            >
              {/* Glow Effect */}
              <span className="absolute inset-0 opacity-0 group-hover:opacity-20 blur-2xl transition duration-500 bg-emerald-400" />

              {/* Text */}
              <span className="relative z-10 donate-heart font-oswald">
                DONATE
              </span>

              {/* Separator Line */}
              <span className="mx-1 h-3 w-px bg-white/40 group-hover:bg-white/70 transition-colors duration-300 lg:h-4 xl:h-5 2xl:h-3.5" />

              {/* Icon */}
              <span className="relative flex items-center justify-center">
                {donateRipple && (
                  <span className="absolute h-3 w-3 md:h-3.5 md:w-3.5 lg:h-4 lg:w-4 xl:h-5 xl:w-5 2xl:h-3 2xl:w-3
                                   rounded-full bg-emerald-400/50 animate-ping" />
                )}
                <Heart
                  className="relative z-10 h-3 w-3 md:h-3.5 md:w-3.5 lg:h-4 lg:w-4 xl:h-5 xl:w-5 2xl:h-3 2xl:w-3
                             fill-white group-hover:fill-emerald-200 
                             transition-transform duration-300 group-hover:scale-125 
                             animate-pulse"
                />
              </span>
            </Link>
          </div>



            {/* Mobile Menu Button */}
            <motion.button
              whileHover={{ scale: 1.05 }}
              whileTap={{ scale: 0.95 }}
              onClick={() => setNavbarOpen(!navbarOpen)}
              className="relative z-50 flex h-9 w-9 items-center justify-center rounded-lg border border-border/50 bg-background/50 text-foreground sm:h-10 sm:w-10 sm:rounded-xl lg:hidden"
              aria-label="Toggle menu"
            >
              <AnimatePresence mode="wait">
                {navbarOpen ? (
                  <motion.div
                    key="close"
                    initial={{ rotate: -90, opacity: 0 }}
                    animate={{ rotate: 0, opacity: 1 }}
                    exit={{ rotate: 90, opacity: 0 }}
                    transition={{ duration: 0.2 }}
                  >
                    <X className="h-5 w-5" />
                  </motion.div>
                ) : (
                  <motion.div
                    key="menu"
                    initial={{ rotate: 90, opacity: 0 }}
                    animate={{ rotate: 0, opacity: 1 }}
                    exit={{ rotate: -90, opacity: 0 }}
                    transition={{ duration: 0.2 }}
                  >
                    <Menu className="h-5 w-5" />
                  </motion.div>
                )}
              </AnimatePresence>
            </motion.button>
          </div>
        </div>
      </div>
      {pathname === "/" && (
        <div className="pointer-events-none absolute bottom-0 left-0 h-[2px] w-full bg-transparent">
          <div
            className="h-full bg-black dark:bg-gray-400 transition-[width] duration-150 ease-out"
            style={{ width: `${scrollProgress}%` }}
          />
        </div>
      )}

      {/* Mobile Menu Overlay */}
      <AnimatePresence>
        {navbarOpen && (
          <>
            <motion.div
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
              transition={{ duration: 0.3 }}
              className="fixed inset-0 top-0 left-0 z-[9998] bg-background/80 backdrop-blur-sm lg:hidden"
              style={{ position: 'fixed' }}
              onClick={() => setNavbarOpen(false)}
            />
            <motion.nav
              initial={{ x: "100%" }}
              animate={{ x: 0 }}
              exit={{ x: "100%" }}
              transition={{ type: "spring", damping: 30, stiffness: 300 }}
              className="fixed right-0 top-0 z-[9999] flex h-screen w-full max-w-sm flex-col border-l border-border/50 bg-background shadow-2xl lg:hidden"
              style={{ position: 'fixed', height: '100dvh' }}
            >
              {/* Mobile Menu Header */}
              <div className="flex h-12 shrink-0 items-center justify-between border-b border-border/50 px-4 sm:h-14">
                <span className="text-lg font-semibold">Menu</span>
                <motion.button
                  whileHover={{ scale: 1.05 }}
                  whileTap={{ scale: 0.95 }}
                  onClick={() => setNavbarOpen(false)}
                  className="flex h-9 w-9 items-center justify-center rounded-lg border border-border/50 bg-background/50 text-foreground sm:h-10 sm:w-10"
                  aria-label="Close menu"
                >
                  <X className="h-5 w-5" />
                </motion.button>
              </div>

              {/* Scrollable Menu Content */}
              <div className="flex-1 overflow-y-auto overscroll-contain p-4" style={{ WebkitOverflowScrolling: 'touch' }}>
                <div className="flex flex-col gap-1">
                  {menuData.map((menuItem, index) => (
                    <div key={menuItem.id}>
                      {!menuItem.submenu ? (
                        <Link
                          href={menuItem.path || "/"}
                          className={`block rounded-xl px-4 py-3 text-sm font-medium uppercase transition-colors ${
                            pathname === menuItem.path
                              ? "bg-accent text-accent-foreground"
                              : "text-muted-foreground hover:bg-accent hover:text-foreground"
                          }`}
                        >
                          {menuItem.title}
                        </Link>
                      ) : (
                        <div>
                          <div className="flex items-center rounded-xl overflow-hidden">
                            {menuItem.path ? (
                              <Link
                                href={menuItem.path}
                                className={`flex-1 px-4 py-3 text-sm font-medium uppercase transition-colors ${
                                  pathname.startsWith(menuItem.path)
                                    ? "text-accent-foreground"
                                    : "text-muted-foreground hover:text-foreground"
                                }`}
                              >
                                {menuItem.title}
                              </Link>
                            ) : (
                              <span className="flex-1 px-4 py-3 text-sm font-medium uppercase text-muted-foreground">
                                {menuItem.title}
                              </span>
                            )}
                            <button
                              type="button"
                              onClick={() => handleSubmenu(index)}
                              className="px-3 py-3 text-muted-foreground transition-colors hover:bg-accent hover:text-foreground"
                            >
                              <ChevronDown
                                className={`h-4 w-4 text-red-500 transition-transform duration-300 ${
                                  openIndex === index ? "rotate-180" : ""
                                }`}
                              />
                            </button>
                          </div>

                          <AnimatePresence>
                            {openIndex === index && menuItem.submenu && (
                              <motion.div
                                initial={{ height: 0, opacity: 0 }}
                                animate={{ height: "auto", opacity: 1 }}
                                exit={{ height: 0, opacity: 0 }}
                                transition={{ duration: 0.3 }}
                                className="overflow-hidden"
                              >
                                <div className="ml-4 mt-1 flex flex-col gap-1 border-l-2 border-border pl-4">
                                  {menuItem.submenu.map((submenuItem, subIndex) => (
                                    <div key={submenuItem.id}>
                                      {submenuItem.submenu ? (
                                        <>
                                          <button
                                            type="button"
                                            onClick={() => handleSubSubmenu(subIndex)}
                                            className="flex w-full items-center justify-between rounded-lg px-3 py-2 text-sm text-muted-foreground transition-colors hover:text-foreground"
                                          >
                                            <span className="flex items-center gap-2">
                                              {submenuItem.icon && (
                                                <submenuItem.icon className="h-4 w-4" />
                                              )}
                                              {submenuItem.title}
                                            </span>
                                            <ChevronDown
                                              className={`h-3 w-3 text-red-500 transition-transform ${
                                                openSubIndex === subIndex ? "rotate-180" : ""
                                              }`}
                                            />
                                          </button>
                                          <AnimatePresence>
                                            {openSubIndex === subIndex && (
                                              <motion.div
                                                initial={{ height: 0, opacity: 0 }}
                                                animate={{ height: "auto", opacity: 1 }}
                                                exit={{ height: 0, opacity: 0 }}
                                                className="ml-4 flex flex-col gap-1 overflow-hidden border-l border-border/50 pl-3"
                                              >
                                                {submenuItem.submenu.map((subSubItem) => (
                                                  <Link
                                                    key={subSubItem.id}
                                                    href={subSubItem.path || "#"}
                                                    className="flex items-center gap-2 rounded-lg px-3 py-2 text-sm text-muted-foreground transition-colors hover:text-foreground"
                                                  >
                                                    {subSubItem.icon && (
                                                      <subSubItem.icon className="h-3 w-3" />
                                                    )}
                                                    {subSubItem.title}
                                                  </Link>
                                                ))}
                                              </motion.div>
                                            )}
                                          </AnimatePresence>
                                        </>
                                      ) : (
                                        <Link
                                          href={submenuItem.path || "#"}
                                          className="flex items-center gap-2 rounded-lg px-3 py-2 text-sm text-muted-foreground transition-colors hover:text-foreground"
                                        >
                                          {submenuItem.icon && (
                                            <submenuItem.icon className="h-4 w-4" />
                                          )}
                                          {submenuItem.title}
                                        </Link>
                                      )}
                                    </div>
                                  ))}
                                </div>
                              </motion.div>
                            )}
                          </AnimatePresence>
                        </div>
                      )}
                    </div>
                  ))}
                </div>
              </div>

              {/* Mobile Menu Footer */}
              <div className="border-t border-border/50 p-4">
                <div className="mb-3 flex gap-2">
                  {/* Calendar button hidden for now */}
                  <button
                    type="button"
                    onClick={() => {
                      const next = language === "EN" ? "BN" : "EN";
                      setLanguage(next);
                      try {
                        window.localStorage.setItem("ss_language", next);
                      } catch {}
                    }}
                    className="flex flex-1 items-center justify-center gap-1.5 rounded-lg px-3 py-2.5 text-sm font-medium text-muted-foreground transition-colors hover:text-foreground"
                  >
                    <Languages className="h-4 w-4" />
                    <span>{language}</span>
                  </button>
                  <Link
                    href="/login"
                    onClick={() => setNavbarOpen(false)}
                    className="flex flex-1 items-center justify-center rounded-full border-2 border-emerald-500/70 py-2 text-sm font-semibold text-emerald-600 transition-colors hover:bg-emerald-500/15 dark:text-emerald-400"
                  >
                    Login
                  </Link>
                </div>
                <Link
                  href="/donate"
                  onClick={() => setNavbarOpen(false)}
                  className="flex h-12 w-full items-center justify-center gap-2 rounded-xl bg-emerald-600 text-sm font-semibold text-white shadow-lg transition-colors hover:bg-emerald-700"
                >
                  <Heart className="h-4 w-4" />
                  <span>Donate Now</span>
                </Link>
              </div>
            </motion.nav>
          </>
        )}
      </AnimatePresence>
    </header>
  );
};

export default Header;
