export function Accessibility() {
  return (
    <>
      <p className="docs-eyebrow">Getting started</p>
      <h1>Accessibility</h1>
      <p className="docs-lead">
        Accessibility is part of each component's design, not a later audit. Here's what Flowpane handles for you, and
        what's still up to you.
      </p>

      <h2 className="docs-h2">What Flowpane handles</h2>
      <ul className="docs-list">
        <li>
          <strong>Semantics.</strong> Native elements first, plus WAI-ARIA roles and states where native HTML falls short
          (tabs, dialogs, live regions).
        </li>
        <li>
          <strong>Keyboard support.</strong> Everything works without a mouse. Each component page documents its keys.
        </li>
        <li>
          <strong>Focus management.</strong> Dialogs move focus in, trap it, and return it to the trigger; tabs use a roving
          tabindex; loading buttons stay focusable.
        </li>
        <li>
          <strong>Announcements.</strong> Toasts, table search results, and sort changes are announced through live
          regions.
        </li>
        <li>
          <strong>Contrast.</strong> All default colour pairs meet WCAG 2.2 AA (4.5:1) in both themes.
        </li>
        <li>
          <strong>Reduced motion.</strong> Entrance animations are disabled when the user prefers reduced motion.
        </li>
      </ul>

      <h2 className="docs-h2">How it's tested</h2>
      <ul className="docs-list">
        <li>Unit tests for keyboard behaviour, focus, and ARIA state using Testing Library and user-event.</li>
        <li>An axe-core check in every component's test suite.</li>
        <li>
          Every Storybook story is audited with axe in a real browser in both light and dark themes, which also covers
          colour contrast.
        </li>
      </ul>

      <h2 className="docs-h2">What's up to you</h2>
      <ul className="docs-list">
        <li>Give every field a meaningful label, and every table a caption (it can be visually hidden).</li>
        <li>Write clear error messages that say how to fix the problem.</li>
        <li>If you override theme colours, check they still meet 4.5:1 contrast. The theming playground shows this.</li>
        <li>Test your full pages with a screen reader (VoiceOver, NVDA) and keyboard only.</li>
      </ul>
    </>
  );
}
