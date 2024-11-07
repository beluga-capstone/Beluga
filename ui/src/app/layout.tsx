import type { Metadata } from "next";
import "./globals.css";

import SideNavbar from "@/components/SideNavbar";
import TopNavbar from "@/components/TopNavbar";
import PageWrapper from "@/components/PageWrapper";
import MarginWidthWrapper from "@/components/MarginWidthWrapper";

export const metadata: Metadata = {
  title: "BELUGA",
  description: "Bode Raymond, Deric Le, Jeffrey Li, Drew Pusey, Nitesh Duraivel"
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en">
      <body>
        <div className="flex">
          <SideNavbar />
          <main className="flex-1 w-full">
            <MarginWidthWrapper>
              <TopNavbar />
              <PageWrapper>{children}</PageWrapper>
            </MarginWidthWrapper>
          </main>
        </div>
      </body>
    </html>
  );
}
