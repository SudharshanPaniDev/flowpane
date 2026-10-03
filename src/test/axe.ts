import axe from "axe-core";

// Runs axe-core against a rendered container and fails with a readable list of violations.
export async function expectNoA11yViolations(container: Element) {
  const results = await axe.run(container, {
    // jsdom can't compute colours or layout, so contrast checks are left to the browser.
    rules: { "color-contrast": { enabled: false } }
  });
  const summary = results.violations.map((v) => `${v.id}: ${v.help} (${v.nodes.length} node(s))`);
  expect(summary).toEqual([]);
}
