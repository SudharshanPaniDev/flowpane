import { createContext, useContext, useEffect, useState, type AnchorHTMLAttributes, type MouseEvent, type ReactNode } from "react";

// A deliberately tiny client-side router: the site only needs a handful of static paths.

const RouterContext = createContext<{ path: string; navigate: (to: string) => void }>({
  path: "/",
  navigate: () => {}
});

export function RouterProvider({ children }: { children: ReactNode }) {
  const [path, setPath] = useState(() => window.location.pathname);

  useEffect(() => {
    const onPop = () => setPath(window.location.pathname);
    window.addEventListener("popstate", onPop);
    return () => window.removeEventListener("popstate", onPop);
  }, []);

  const navigate = (to: string) => {
    const url = new URL(to, window.location.origin);
    if (url.pathname === window.location.pathname && url.hash) {
      window.history.pushState(null, "", to);
      document.getElementById(url.hash.slice(1))?.scrollIntoView();
      return;
    }
    window.history.pushState(null, "", to);
    setPath(url.pathname);
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
      href={to}
      aria-current={path === to.split("#")[0] ? "page" : undefined}
      onClick={handleClick}
      {...rest}
    />
  );
}
