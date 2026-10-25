import { Footer } from "@/components/Footer";
import { Navbar } from "@/components/Navbar";
import { QuoteDrawer } from "@/components/QuoteDrawer";
import { getMegaMenu } from "@/lib/nav";

export function SiteChrome({ children }: { children: React.ReactNode }) {
  const columns = getMegaMenu();

  return (
    <>
      <Navbar columns={columns} />
      <main>{children}</main>
      <Footer />
      <QuoteDrawer />
    </>
  );
}
