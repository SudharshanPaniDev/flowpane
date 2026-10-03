import { useEffect, useState, type ReactNode } from "react";
import { useRouter } from "../lib/router";
import { Footer } from "./Footer";
import { Header } from "./Header";
import { Sidebar } from "./Sidebar";

export function DocsLayout({ children }: { children: ReactNode }) {
  const [menuOpen, setMenuOpen] = useState(false);
  const { path } = useRouter();

  useEffect(() => setMenuOpen(false), [path]);

  return (
    <>
      <Header onMenuClick={() => setMenuOpen((open) => !open)} menuOpen={menuOpen} />
      <div className="docs-shell">
        <aside id="docs-sidebar" className={menuOpen ? "docs-sidebar docs-sidebar--open" : "docs-sidebar"}>
          <Sidebar onNavigate={() => setMenuOpen(false)} />
        </aside>
        <main id="main" className="docs-main">
          {children}
          <Footer />
        </main>
      </div>
    </>
  );
}
