import type { Metadata } from "next";
import "./globals.css";
import SideNavbar from "@/components/SideNavbar";
import TopNavbar from "@/components/TopNavbar";
import PageWrapper from "@/components/PageWrapper";
import MarginWidthWrapper from "@/components/MarginWidthWrapper";

export const metadata: Metadata = {
  title: "BELUGA",
};

const userRole = "student";

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en">
      <body className={`bg-white`}>
        <div className="flex">
          <SideNavbar role={userRole} />
          <main className="flex-1">
            <MarginWidthWrapper>
              <TopNavbar role={userRole} />
              <PageWrapper>{children}</PageWrapper>
            </MarginWidthWrapper>
          </main>
        </div>
      </body>
    </html>
  );
}
