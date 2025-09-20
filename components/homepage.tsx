import Link from "next/link";
import { Button } from "@/components/ui/button";
import {
  Card,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { ArrowRight, Zap, Shield, Globe } from "lucide-react";
import { connect } from "http2";

export function HomePage() {
  return (
    <main className="container mx-auto px-4 py-20">
      <div className="text-center mb-20">
        <h1
          className="text-5xl md:text-7xl mb-8 text-balance leading-tight"
          style={{
            fontFamily: "var(--font-family-sharp-grotesk)",
            fontWeight: "bold",
          }}
        >
          Deploy Your Own
          <span className="bg-gradient-to-r from-[#82FBD0] to-[#fbf197] bg-clip-text text-transparent block mt-2">
            Orbit Chain
          </span>
        </h1>
        <p
          className="text-lg text-[#A2A2A2] mb-12  max-w-3xl mx-auto leading-relaxed"
          style={{ fontFamily: "var(--font-family-actay-regular)" }}
        >
          Launch a custom blockchain in minutes with enterprise-grade security,
          scalability, and full control over your network parameters.
        </p>
        <div className="flex flex-col sm:flex-row gap-6 justify-center">
          <div className="relative">
            <Link href="/create">
              <button className="relative  text-[#000000] px-6 py-2 sm:px-8 sm:py-3  lg:px-6 xl:px-8 rounded-lg group transition-transform">
                <span className="absolute inset-0 bg-[#222222] border border-[#FFFFFF80]/50 rounded-full scale-100 translate-y-0 transition-all duration-300 ease-out group-hover:translate-y-2"></span>
                <span className="absolute inset-0 bg-[#F8FF7C] rounded-full scale-100 translate-y-0 group-hover:translate-y-0"></span>
                <span className="font-actayRegular relative z-10 px-0 py-3 sm:px-3 md:px-6 lg:px-0 rounded-full translate-y-2 group-hover:translate-y-0 transition-all duration-300 ease-out text-xs sm:text-base">
                  Deploy Chain
                </span>
              </button>
            </Link>
          </div>
          <div className="relative">
            <Link href="/dashboard">
              <button className="relative  text-[#000000] px-6 py-2 sm:px-8 sm:py-3  lg:px-6 xl:px-8 rounded-lg group transition-transform">
                <span className="absolute inset-0 bg-[#222222] border border-[#FFFFFF80]/50 rounded-full scale-100 translate-y-0 transition-all duration-300 ease-out group-hover:translate-y-2"></span>
                <span className="absolute inset-0 bg-[#F8FF7C] rounded-full scale-100 translate-y-0 group-hover:translate-y-0"></span>

                <span className="font-actayRegular relative z-10 px-0 py-3 sm:px-3 md:px-6 lg:px-0 rounded-full translate-y-2 group-hover:translate-y-0 transition-all duration-300 ease-out text-xs sm:text-base">
                  View Dashboard
                </span>
              </button>
            </Link>
          </div>
        </div>
      </div>

      <div className="grid md:grid-cols-3 gap-8 mb-20">
        <Card className="text-center bg-[#141414] border-[#82FBD0]/20 hover:border-[#82FBD0]/40 transition-all duration-300 hover:scale-105 group">
          <CardHeader className="p-8">
            <div className="w-16 h-16 bg-gradient-to-br from-[#82FBD0]/20 to-[#82FBD0]/10 rounded-2xl flex items-center justify-center mx-auto mb-6 group-hover:from-[#82FBD0]/30 group-hover:to-[#82FBD0]/20 transition-all duration-300">
              <Zap className="w-8 h-8 text-[#82FBD0]" />
            </div>
            <CardTitle
              className="text-xl mb-4 text-[#FFFFFF]"
              style={{
                fontFamily: "var(--font-family-actay-wide-bold)",
                fontWeight: "bold",
              }}
            >
              Lightning Fast
            </CardTitle>
            <CardDescription
              className="text-[#FFFFFF]/80 leading-relaxed"
              style={{ fontFamily: "var(--font-family-actay-regular)" }}
            >
              Deploy in under 5 minutes with optimized configurations
            </CardDescription>
          </CardHeader>
        </Card>

        <Card className="text-center bg-[#141414] border-[#82FBD0]/20 hover:border-[#82FBD0]/40 transition-all duration-300 hover:scale-105 group">
          <CardHeader className="p-8">
            <div className="w-16 h-16 bg-gradient-to-br from-[#82FBD0]/20 to-[#82FBD0]/10 rounded-2xl flex items-center justify-center mx-auto mb-6 group-hover:from-[#82FBD0]/30 group-hover:to-[#82FBD0]/20 transition-all duration-300">
              <Shield className="w-8 h-8 text-[#82FBD0]" />
            </div>
            <CardTitle
              className="text-xl mb-4 text-[#FFFFFF]"
              style={{
                fontFamily: "var(--font-family-actay-wide-bold)",
                fontWeight: "bold",
              }}
            >
              Enterprise Security
            </CardTitle>
            <CardDescription
              className="text-[#FFFFFF]/80 leading-relaxed"
              style={{ fontFamily: "var(--font-family-actay-regular)" }}
            >
              Built-in monitoring, fraud detection, and 99.9% uptime SLA
            </CardDescription>
          </CardHeader>
        </Card>

        <Card className="text-center bg-[#141414] border-[#82FBD0]/20 hover:border-[#82FBD0]/40 transition-all duration-300 hover:scale-105 group">
          <CardHeader className="p-8">
            <div className="w-16 h-16 bg-gradient-to-br from-[#82FBD0]/20 to-[#82FBD0]/10 rounded-2xl flex items-center justify-center mx-auto mb-6 group-hover:from-[#82FBD0]/30 group-hover:to-[#82FBD0]/20 transition-all duration-300">
              <Globe className="w-8 h-8 text-[#82FBD0]" />
            </div>
            <CardTitle
              className="text-xl mb-4 text-[#FFFFFF]"
              style={{
                fontFamily: "var(--font-family-actay-wide-bold)",
                fontWeight: "bold",
              }}
            >
              Full Control
            </CardTitle>
            <CardDescription
              className="text-[#FFFFFF]/80 leading-relaxed"
              style={{ fontFamily: "var(--font-family-actay-regular)" }}
            >
              Customize gas limits, settlement layers, and data availability
            </CardDescription>
          </CardHeader>
        </Card>
      </div>
    </main>
  );
}
