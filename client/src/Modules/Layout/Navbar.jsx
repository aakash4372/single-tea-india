import React, { useState, useEffect } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { HiX } from "react-icons/hi";
import { TbMenuDeep } from "react-icons/tb";
import { Link, useLocation } from "react-router-dom";

const Navbar = () => {
  const [open, setOpen] = useState(false);
  const [active, setActive] = useState("Home");
  const location = useLocation();

  const navLinks = [
    { name: "Home", path: "/" },
    { name: "Menu", path: "/menu" },
    { name: "Franchise", path: "/franchise" },
    { name: "Contact", path: "/contact" },
  ];

  // Sync active link with current route
  useEffect(() => {
    const current = navLinks.find((link) => link.path === location.pathname);
    if (current) {
      setActive(current.name);
    }
  }, [location.pathname]);

  return (
    <div className="fixed top-0 left-0 w-full z-50">
      <div className="w-full px-4 sm:px-6 md:px-8 mt-4">
        <header className="w-full max-w-4xl mx-auto flex items-center justify-between py-4 bg-white border border-gray-200 shadow-sm rounded-full px-6">
          {/* Left: Logo */}
          <Link to="/" className="flex-shrink-0">
            <img
              src="https://raw.githubusercontent.com/prebuiltui/prebuiltui/main/assets/dummyLogo/prebuiltuiDummyLogo.svg"
              alt="Logo"
              className="h-8"
            />
          </Link>

          {/* Right: Nav Links (Desktop) */}
          <nav className="hidden md:flex items-center gap-8">
            {navLinks.map((link) => (
              <Link
                key={link.name}
                to={link.path}
                className={`relative font-medium transition-colors duration-300 ${
                  active === link.name
                    ? "text-black font-semibold"
                    : "text-gray-700 hover:text-black"
                }`}
              >
                {link.name}
                <span
                  className={`absolute -bottom-1 left-0 h-[2px] w-full transform scale-x-0 transition-transform duration-300 ${
                    active === link.name
                      ? "scale-x-100 bg-black"
                      : "group-hover:scale-x-100 bg-gray-800"
                  }`}
                />
              </Link>
            ))}
          </nav>

          {/* Mobile Menu Button */}
          <motion.button
            onClick={() => setOpen(!open)}
            className="md:hidden text-2xl text-gray-700 relative w-8 h-8 flex items-center justify-center"
            whileTap={{ scale: 0.85, rotate: 10 }}
            transition={{ type: "spring", stiffness: 300, damping: 20 }}
          >
            <AnimatePresence mode="wait" initial={false}>
              {!open ? (
                <motion.div
                  key="menu"
                  initial={{ opacity: 0, rotate: -90 }}
                  animate={{ opacity: 1, rotate: 0 }}
                  exit={{ opacity: 0, rotate: 90 }}
                  transition={{ duration: 0.25 }}
                  className="absolute"
                >
                  <TbMenuDeep />
                </motion.div>
              ) : (
                <motion.div
                  key="close"
                  initial={{ opacity: 0, rotate: 90 }}
                  animate={{ opacity: 1, rotate: 0 }}
                  exit={{ opacity: 0, rotate: -90 }}
                  transition={{ duration: 0.25 }}
                  className="absolute"
                >
                  <HiX />
                </motion.div>
              )}
            </AnimatePresence>
          </motion.button>
          {/* Offcanvas Menu */}
          <AnimatePresence>
            {open && (
              <motion.div
                initial={{ x: "100%" }}
                animate={{ x: 0 }}
                exit={{ x: "100%" }}
                transition={{ duration: 0.35, ease: "easeInOut" }}
                className="fixed top-0 right-0 h-full w-full bg-white border-l border-gray-200 shadow-2xl z-50 flex flex-col p-6 md:hidden"
              >
                {/* Close button inside offcanvas */}
                <button
                  onClick={() => setOpen(false)}
                  className="absolute top-4 right-4 text-3xl text-gray-700 hover:text-black"
                >
                  <HiX />
                </button>

                {/* Mobile Nav Links */}
                <nav className="flex flex-col items-center justify-center flex-1 gap-8">
                  {navLinks.map((link) => (
                    <Link
                      key={link.name}
                      to={link.path}
                      onClick={() => setOpen(false)}
                      className={`text-2xl font-semibold transition-colors duration-300 ${
                        active === link.name
                          ? "text-black"
                          : "text-gray-800 hover:text-black"
                      }`}
                    >
                      {link.name}
                    </Link>
                  ))}
                </nav>
              </motion.div>
            )}
          </AnimatePresence>
        </header>
      </div>
    </div>
  );
};

export default Navbar;
