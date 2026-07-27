import { useState } from "react";
import { Menu } from "lucide-react";
import Logo from "./Logo";
import MobileMenu from "./MobileMenu";

const navLinks = ["Vault", "Plans", "Install", "News", "Help"];

export default function Navbar() {
  const [mobileOpen, setMobileOpen] = useState(false);

  return (
    <>
      <nav className="relative z-10 px-5 sm:px-8 py-4 sm:py-5" style={{ maxWidth: 1280, margin: "0 auto" }}>
        <div className="flex items-center justify-between">
          <Logo />

          <div className="hidden md:flex items-center gap-8">
            {navLinks.map((label) => (
              <a
                key={label}
                href="#"
                className="text-sm font-medium transition-opacity hover:opacity-70"
                style={{ color: "var(--color-text)" }}
              >
                {label}
              </a>
            ))}
          </div>

          <div className="hidden md:flex items-center gap-3">
            <button
              className="text-sm font-semibold px-5 py-2.5 rounded-full text-white transition-all active:scale-95 hover:brightness-110"
              style={{ background: "#7342E2" }}
            >
              Start For Free
            </button>
            <button
              className="text-sm font-semibold px-5 py-2.5 rounded-full transition-all active:scale-95"
              style={{ background: "#F2F2EE", color: "var(--color-text)" }}
            >
              Sign In
            </button>
          </div>

          <button
            className="md:hidden flex items-center justify-center"
            onClick={() => setMobileOpen(true)}
            aria-label="Open menu"
          >
            <Menu size={24} color="#192837" />
          </button>
        </div>
      </nav>

      <MobileMenu open={mobileOpen} onClose={() => setMobileOpen(false)} />
    </>
  );
}
