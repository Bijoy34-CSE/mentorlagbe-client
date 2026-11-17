import { Footer } from "@/components/footer";
import { Navbar } from "@/components/navbar";

// Layout for all public pages
export default function SiteLayout({ children }: { children: React.ReactNode }) {
  return (
    <div className="flex min-h-screen flex-col">
      <Navbar />
      <main className="flex-1">{children}</main>
      <Footer />
    </div>
  );
}