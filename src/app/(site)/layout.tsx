import { Suspense } from "react";
import { Footer } from "@/components/footer";
import { Navbar } from "@/components/navbar";

// Empty bar with the same height, shown for a moment while the navbar loads
function NavbarFallback() {
  return <header className="sticky top-0 z-50 h-16 border-b bg-background/80 backdrop-blur" />;
}

// Layout for all public pages
export default function SiteLayout({ children }: { children: React.ReactNode }) {
  return (
    <div className="flex min-h-screen flex-col">
      <Suspense fallback={<NavbarFallback />}>
        <Navbar />
      </Suspense>
      <main className="flex-1">{children}</main>
      <Footer />
    </div>
  );
}