import Link from "next/link";
import { Globe } from "lucide-react";
import { Typography } from "./ui/typography";

export function Footer() {
  const currentYear = new Date().getFullYear();

  return (
    <footer className="bg-[#141414] border-t border-[#1A1A1A] mt-auto">
      <div className="container mx-auto px-4 py-8">
        <div className="flex flex-col md:flex-row items-center justify-between gap-6">
          {/* Logo and Brand */}
          <div className="flex items-center gap-3">
            <div className="w-8 h-8 bg-[#141414] rounded-lg flex items-center justify-center shadow-lg border border-[#FFF282]/30">
              <Globe className="w-4 h-4 text-[#FFF282]" />
            </div>
            <Link href="/">
              <Typography variant="h4" className="triggerx-logo">
                <span
                  className="text-lg text-[#FFFFFF] hover:text-[#FFF282] transition-all duration-300 cursor-pointer"
                  style={{
                    fontFamily: "var(--font-family-actay-regular)",
                    fontWeight: "bold",
                  }}
                >
                  OrbitChain
                </span>
              </Typography>
            </Link>
          </div>

          {/* Copyright */}
          <div className="text-center md:text-right">
            <p
              className="text-sm text-[#A2A2A2]  transition-colors duration-300"
              style={{
                fontFamily: "var(--font-family-actay-regular)",
              }}
            >
              © {currentYear} TriggerX OrbitChain. All rights reserved.
            </p>
          </div>
        </div>

        {/* Bottom Border */}
        <div className="mt-6 pt-6 border-t border-[#1A1A1A]">
          <div className="flex flex-col md:flex-row items-center justify-between gap-4 text-xs text-[#A2A2A2]">
            <div className="flex items-center gap-6">
              <Link
                href="/dashboard"
                className="hover:text-[#FFF282] transition-colors duration-300"
                style={{ fontFamily: "var(--font-family-actay-regular)" }}
              >
                Dashboard
              </Link>
              <Link
                href="/create"
                className="hover:text-[#FFF282] transition-colors duration-300"
                style={{ fontFamily: "var(--font-family-actay-regular)" }}
              >
                Deploy Chain
              </Link>
            </div>
          </div>
        </div>
      </div>
    </footer>
  );
}
