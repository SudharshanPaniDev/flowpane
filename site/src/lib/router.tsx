import { createContext, useContext, useEffect, useState, type AnchorHTMLAttributes, type MouseEvent, type ReactNode } from "react";

// A deliberately tiny client-side router: the site only needs a handful of static paths.

// The site can be served from a sub-path (e.g. GitHub Pages at /flowpane/). Routes are written
// without it ("/docs/theming"); it's added to URLs and stripped when reading the location.
const BASE = import.meta.env.BASE_URL.replace(/\/$/, "");

export const withBase = (to: string) => (to.startsWith("/") ? `${BASE}${to}` : to);

const stripBase = (pathname: string) =>
  BASE && pathname.startsWith(BASE) ? pathname.slice(BASE.length) || "/" : pathname;

const RouterContext = createContext<{ path: string; navigate: (to: string) => void }>({
  path: "/",
  navigate: () => {}
});

export function RouterProvider({ children }: { children: ReactNode }) {
  const [path, setPath] = useState(() => stripBase(window.location.pathname));

  useEffect(() => {
    const onPop = () => setPath(stripBase(window.location.pathname));
    window.addEventListener("popstate", onPop);
    return () => window.removeEventListener("popstate", onPop);
  }, []);

  const navigate = (to: string) => {
    const href = withBase(to);
    const url = new URL(href, window.location.origin);
    if (url.pathname === window.location.pathname && url.hash) {
      window.history.pushState(null, "", href);
      document.getElementById(url.hash.slice(1))?.scrollIntoView();
      return;
    }
    window.history.pushState(null, "", href);
    setPath(stripBase(url.pathname));
    window.scrollTo(0, 0);
  };

  return <RouterContext.Provider value={{ path, navigate }}>{children}</RouterContext.Provider>;
}

export function useRouter() {
  return useContext(RouterContext);
}

interface LinkProps extends AnchorHTMLAttributes<HTMLAnchorElement> {
  to: string;
}

/** Internal link: client-side navigation with normal browser behaviour for modified clicks. */
export function Link({ to, onClick, ...rest }: LinkProps) {
  const { path, navigate } = useRouter();
  const handleClick = (event: MouseEvent<HTMLAnchorElement>) => {
    onClick?.(event);
    if (event.defaultPrevented || event.button !== 0 || event.metaKey || event.ctrlKey || event.shiftKey || event.altKey) return;
    event.preventDefault();
    navigate(to);
  };
  return (
    <a
      href={withBase(to)}
      aria-current={path === to.split("#")[0] ? "page" : undefined}
      onClick={handleClick}
      {...rest}
    />
  );
}
