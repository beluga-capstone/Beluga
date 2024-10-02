import type { Metadata } from "next";
import "./globals.css";
import SideNavbar from "./components/SideNavbar";
import TopNavbar from "./components/TopNavbar";

export const metadata: Metadata = {
  title: "BELUGA",
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en">
      <body>
        <TopNavbar />
        <div className="flex">
          <SideNavbar />
          <div>{children}</div>
        </div>
      </body>
    </html>
  );
}
