import { useEffect, useMemo, useRef, useState, type KeyboardEvent } from "react";
import { Dialog } from "flowpane";
import { components, guides } from "../docs";
import { useRouter } from "../lib/router";

interface Entry {
  title: string;
  section: string;
  to: string;
  keywords: string;
}

const entries: Entry[] = [
  ...guides.map((g) => ({ title: g.title, section: "Guides", to: `/docs/${g.slug}`, keywords: g.title })),
  ...components.map((c) => ({ title: c.name, section: c.category, to: `/components/${c.slug}`, keywords: `${c.name} ${c.summary}` }))
];

export function SearchDialog({ open, onOpenChange }: { open: boolean; onOpenChange: (open: boolean) => void }) {
  const { navigate } = useRouter();
  const [query, setQuery] = useState("");
  const [active, setActive] = useState(0);
  const inputRef = useRef<HTMLInputElement>(null);

  const results = useMemo(() => {
    const q = query.trim().toLowerCase();
    return q ? entries.filter((e) => e.keywords.toLowerCase().includes(q)) : entries;
  }, [query]);

  useEffect(() => {
    if (!open) setQuery("");
    setActive(0);
  }, [open, query]);

  const go = (entry: Entry | undefined) => {
    if (!entry) return;
    onOpenChange(false);
    navigate(entry.to);
  };

  // Combobox pattern: focus stays in the input; arrows move the active option.
  const onKeyDown = (event: KeyboardEvent<HTMLInputElement>) => {
    if (event.key === "ArrowDown") {
      event.preventDefault();
      setActive((i) => Math.min(results.length - 1, i + 1));
    } else if (event.key === "ArrowUp") {
      event.preventDefault();
      setActive((i) => Math.max(0, i - 1));
    } else if (event.key === "Enter") {
      event.preventDefault();
      go(results[active]);
    }
  };

  return (
    <Dialog open={open} onOpenChange={onOpenChange} title="Search docs" showCloseButton={false} initialFocusRef={inputRef} className="docs-search">
      <input
        ref={inputRef}
        className="fp-input"
        type="text"
        role="combobox"
        aria-label="Search components and guides"
        aria-expanded="true"
        aria-controls="docs-search-results"
        aria-activedescendant={results[active] ? `docs-search-${results[active]!.to}` : undefined}
        aria-autocomplete="list"
        placeholder="Search components and guides…"
        value={query}
        onChange={(event) => setQuery(event.target.value)}
        onKeyDown={onKeyDown}
      />
      <ul id="docs-search-results" role="listbox" aria-label="Results" className="docs-search__results">
        {results.length === 0 && <li className="docs-search__empty">No results for “{query}”</li>}
        {results.map((entry, i) => (
          <li
            key={entry.to}
            id={`docs-search-${entry.to}`}
            role="option"
            aria-selected={i === active}
            className="docs-search__option"
            onMouseEnter={() => setActive(i)}
            onClick={() => go(entry)}
          >
            <span>{entry.title}</span>
            <span className="docs-search__section">{entry.section}</span>
          </li>
        ))}
      </ul>
      <p className="docs-search__hint" aria-hidden="true">
        <kbd>↑</kbd> <kbd>↓</kbd> to navigate · <kbd>Enter</kbd> to open · <kbd>Esc</kbd> to close
      </p>
    </Dialog>
  );
}
