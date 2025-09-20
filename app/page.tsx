import { Header } from "@/components/header";
import { HomePage } from "@/components/homepage";
import { Metadata } from "next";

export const metadata: Metadata = {
  title: "TriggerX | Orbit Chain",
  description: "Deploy and manage your custom blockchain with TriggerX",
  openGraph: {
    title: "TriggerX | Orbit Chain",
    description: "Deploy and manage your custom blockchain with TriggerX",
    url: `https://app.triggerx.network`,
    siteName: "TriggerX",
    images: [
      {
        url: `https://app.triggerx.network/OGImages/homepage.png`,
        width: 1200,
        height: 630,
        alt: "TriggerX homepage showing custom blockchain features",
        type: "image/png",
      },
    ],
    type: "website",
  },
  // alternates: {
  //   canonical: `https://app.triggerx.network/create`,
  // },
};

export default function Page() {
  return (
    <div className="min-h-screen ">
      <HomePage />
    </div>
  );
}
