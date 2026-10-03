import type { ComponentType } from "react";
import type { KeyDoc } from "./ui/KeyboardTable";
import type { PropDoc } from "./ui/PropsTable";

// Every example file is loaded twice: once as a component (live preview) and once as raw source (Code tab).
const exampleModules = import.meta.glob<{ default: ComponentType }>("./examples/**/*.tsx", { eager: true });
const exampleSources = import.meta.glob<string>("./examples/**/*.tsx", { eager: true, query: "?raw", import: "default" });

export interface ExampleDoc {
  id: string;
  title: string;
  description?: string;
  Demo: ComponentType;
  code: string;
  alignTop?: boolean;
}

function example(path: string, title: string, description?: string, alignTop?: boolean): ExampleDoc {
  const key = `./examples/${path}.tsx`;
  const mod = exampleModules[key];
  const code = exampleSources[key];
  if (!mod || code === undefined) throw new Error(`Missing example: ${key}`);
  return { id: path.split("/")[1]!.replace(/([a-z])([A-Z])/g, "$1-$2").toLowerCase(), title, description, Demo: mod.default, code, alignTop };
}

export interface PropGroup {
  component: string;
  props: PropDoc[];
}

export interface ComponentDoc {
  slug: string;
  name: string;
  category: "Workflow" | "Building blocks";
  summary: string;
  description: string;
  importCode: string;
  examples: ExampleDoc[];
  props: PropGroup[];
  keyboard?: KeyDoc[];
  accessibility: string[];
}

const className: PropDoc = { name: "className", type: "string", description: "Extra class names for the root element." };

export const components: ComponentDoc[] = [
  {
    slug: "data-table",
    name: "DataTable",
    category: "Workflow",
    summary: "Sortable, searchable, selectable table with pagination and bulk actions.",
    description:
      "A typed table for operational data. Define columns once and get sorting, search across columns, row selection with a \"select all on this page\" checkbox, pagination, a toolbar slot for bulk actions, and empty and no-results states. Results and sort changes are announced to screen readers.",
    importCode: `import { DataTable, type DataTableColumn } from "flowpane";`,
    examples: [
      example("data-table/Basic", "Basic", "Columns map each row to a value with `accessor`; `cell` customises how it renders.", true),
      example("data-table/SearchSort", "Search, sort, and pagination", "Click a header to sort ascending, then descending, then clear. Search filters across searchable columns.", true),
      example("data-table/BulkActions", "Selection and bulk actions", "The toolbar receives the current selection, so bulk actions always act on what's selected.", true)
    ],
    props: [
      {
        component: "DataTable",
        props: [
          { name: "data", type: "T[]", required: true, description: "Rows to display." },
          { name: "columns", type: "DataTableColumn<T>[]", required: true, description: "Column definitions (see below)." },
          { name: "getRowId", type: "(row: T) => string", required: true, description: "Stable unique id per row, used for keys and selection." },
          { name: "caption", type: "string", required: true, description: "Describes the table for screen readers." },
          { name: "hideCaption", type: "boolean", default: "false", description: "Hide the caption visually but keep it for assistive tech." },
          { name: "searchable", type: "boolean", default: "false", description: "Show a search box that filters rows." },
          { name: "searchLabel", type: "string", default: "\"Search\"", description: "Accessible label for the search box." },
          { name: "searchPlaceholder", type: "string", default: "\"Search…\"", description: "Placeholder text for the search box." },
          { name: "selectable", type: "boolean", default: "false", description: "Add row checkboxes and a select-all-on-page checkbox." },
          { name: "selectedIds", type: "string[]", description: "Selected row ids (controlled)." },
          { name: "defaultSelectedIds", type: "string[]", default: "[]", description: "Initially selected ids (uncontrolled)." },
          { name: "onSelectionChange", type: "(ids: string[]) => void", description: "Called when the selection changes." },
          { name: "getRowLabel", type: "(row: T) => string", description: "Accessible name for each row checkbox. Defaults to \"Select row <id>\"." },
          { name: "sort", type: "SortState | null", description: "Current sort (controlled)." },
          { name: "defaultSort", type: "SortState | null", default: "null", description: "Initial sort (uncontrolled)." },
          { name: "onSortChange", type: "(sort: SortState | null) => void", description: "Called when the user changes the sort." },
          { name: "pageSize", type: "number", default: "10", description: "Rows per page. Use 0 to disable pagination." },
          { name: "toolbar", type: "(ctx: { selectedIds, clearSelection }) => ReactNode", description: "Extra controls next to search, e.g. filters or bulk actions." },
          { name: "emptyState", type: "ReactNode", description: "Shown when `data` is empty." },
          className
        ]
      },
      {
        component: "DataTableColumn<T>",
        props: [
          { name: "id", type: "string", required: true, description: "Unique column id; used by sort state." },
          { name: "header", type: "ReactNode", required: true, description: "Header content." },
          { name: "accessor", type: "(row: T) => string | number | boolean | Date | null", description: "Plain value used for sorting, search, and default rendering." },
          { name: "cell", type: "(row: T) => ReactNode", description: "Custom cell content." },
          { name: "sortable", type: "boolean", default: "false", description: "Allow sorting by this column (requires `accessor`)." },
          { name: "searchable", type: "boolean", default: "true", description: "Include in search when the column has an accessor." },
          { name: "align", type: "\"left\" | \"center\" | \"right\"", default: "\"left\"", description: "Text alignment; use right for numbers." },
          { name: "width", type: "string", description: "CSS width, also used as the minimum width." }
        ]
      }
    ],
    keyboard: [
      { keys: ["Tab"], action: "Moves through search, sort buttons, checkboxes, and pagination." },
      { keys: ["Enter"], action: "On a column header: cycles sort ascending → descending → none." },
      { keys: ["Space"], action: "On a checkbox: selects or deselects the row (or the whole page)." }
    ],
    accessibility: [
      "Uses a native <table> with a caption and scoped column headers, so screen readers can navigate by row and column.",
      "Sorted columns expose aria-sort; sort controls are real buttons inside the headers.",
      "A polite live region announces sort changes and the number of search results.",
      "The select-all checkbox is indeterminate (aria-checked=\"mixed\") when only some rows are selected."
    ]
  },
  {
    slug: "stepper",
    name: "Stepper",
    category: "Workflow",
    summary: "Progress through multi-step flows, horizontal or vertical.",
    description:
      "Shows where the user is in a multi-step workflow. Completed steps can link back so users can review earlier answers; upcoming steps are never clickable, so required steps can't be skipped.",
    importCode: `import { Stepper } from "flowpane";`,
    examples: [
      example("stepper/Interactive", "Interactive", "Pass `onStepClick` to let users jump back to completed steps."),
      example("stepper/Vertical", "Vertical", "Use the vertical layout for onboarding checklists and narrow panels.")
    ],
    props: [
      {
        component: "Stepper",
        props: [
          { name: "steps", type: "{ id: string; label: ReactNode; description?: ReactNode }[]", required: true, description: "The steps, in order." },
          { name: "currentStep", type: "number", required: true, description: "Zero-based index of the current step. Use steps.length when all are complete." },
          { name: "onStepClick", type: "(index: number) => void", description: "Makes completed steps clickable." },
          { name: "orientation", type: "\"horizontal\" | \"vertical\"", default: "\"horizontal\"", description: "Layout direction. Horizontal stacks vertically on small screens." },
          { name: "aria-label", type: "string", default: "\"Progress\"", description: "Accessible name for the step list." },
          className
        ]
      }
    ],
    accessibility: [
      "Rendered as an ordered list with an accessible name.",
      "The current step has aria-current=\"step\".",
      "Each step announces its position and status, e.g. \"Items, step 2 of 4, Current step\".",
      "Completed steps are buttons only when onStepClick is provided."
    ]
  },
  {
    slug: "status-badge",
    name: "StatusBadge",
    category: "Workflow",
    summary: "Consistent, colour-coded status labels.",
    description:
      "Compact labels for statuses in tables, headers, and cards. Colour reinforces the meaning, but the text always states it, so the badge works for colour-blind users and in greyscale.",
    importCode: `import { StatusBadge } from "flowpane";`,
    examples: [example("status-badge/Tones", "Tones")],
    props: [
      {
        component: "StatusBadge",
        props: [
          { name: "tone", type: "\"neutral\" | \"info\" | \"success\" | \"warning\" | \"danger\"", default: "\"neutral\"", description: "Colour scheme." },
          { name: "dot", type: "boolean", default: "true", description: "Show a leading dot." },
          { name: "children", type: "ReactNode", required: true, description: "The status text." },
          className
        ]
      }
    ],
    accessibility: ["The dot is decorative (aria-hidden); the text carries the meaning.", "All tones meet WCAG AA contrast in light and dark themes."]
  },
  {
    slug: "empty-state",
    name: "EmptyState",
    category: "Workflow",
    summary: "Helpful empty and no-results views with a next step.",
    description: "Explains why a view is empty and what to do next. DataTable uses it for its default empty and no-results states.",
    importCode: `import { EmptyState } from "flowpane";`,
    examples: [example("empty-state/Basic", "Basic")],
    props: [
      {
        component: "EmptyState",
        props: [
          { name: "title", type: "ReactNode", required: true, description: "Short heading." },
          { name: "description", type: "ReactNode", description: "Supporting text." },
          { name: "icon", type: "ReactNode", description: "Decorative icon above the title." },
          { name: "action", type: "ReactNode", description: "Next step, e.g. a button." },
          { name: "headingLevel", type: "2 | 3 | 4 | 5 | 6", default: "3", description: "Heading level so it fits the page outline." },
          className
        ]
      }
    ],
    accessibility: ["The title is a real heading at a level you choose, so it fits the document outline.", "The icon is hidden from assistive tech."]
  },
  {
    slug: "button",
    name: "Button",
    category: "Building blocks",
    summary: "Actions in four variants and three sizes, with a loading state.",
    description:
      "Use one primary button per view for the main action, secondary for alternatives, ghost for low-emphasis actions, and danger for destructive ones. The loading state keeps the button focusable and its label readable while blocking repeat clicks.",
    importCode: `import { Button } from "flowpane";`,
    examples: [
      example("button/Variants", "Variants"),
      example("button/Sizes", "Sizes"),
      example("button/Loading", "Icons and loading", "Click Save order to see the loading state.")
    ],
    props: [
      {
        component: "Button",
        props: [
          { name: "variant", type: "\"primary\" | \"secondary\" | \"ghost\" | \"danger\"", default: "\"primary\"", description: "Visual style." },
          { name: "size", type: "\"sm\" | \"md\" | \"lg\"", default: "\"md\"", description: "Height and padding." },
          { name: "loading", type: "boolean", default: "false", description: "Shows a spinner, sets aria-busy, and ignores clicks." },
          { name: "iconStart", type: "ReactNode", description: "Icon before the label." },
          { name: "iconEnd", type: "ReactNode", description: "Icon after the label." },
          { name: "fullWidth", type: "boolean", default: "false", description: "Stretch to the container width." },
          { name: "type", type: "\"button\" | \"submit\" | \"reset\"", default: "\"button\"", description: "Defaults to button so it never submits a form by accident." },
          { name: "...props", type: "ButtonHTMLAttributes", description: "All native button attributes and a forwarded ref." }
        ]
      }
    ],
    keyboard: [
      { keys: ["Enter"], action: "Activates the button." },
      { keys: ["Space"], action: "Activates the button." }
    ],
    accessibility: [
      "Always a native <button>, so it's focusable and activatable with the keyboard.",
      "While loading it stays focusable (focus isn't lost) and exposes aria-busy and aria-disabled.",
      "Icons are hidden from screen readers; the label names the button."
    ]
  },
  {
    slug: "text-field",
    name: "TextField",
    category: "Building blocks",
    summary: "Labelled text input with description and error states.",
    description:
      "Every field has a visible label. The description and error message are linked to the input, so screen readers read them with the field, and errors mark it invalid.",
    importCode: `import { TextField } from "flowpane";`,
    examples: [example("text-field/Basic", "Basic"), example("text-field/Validation", "Validation", "Show errors after the user submits, not while they're still typing.")],
    props: [
      {
        component: "TextField",
        props: [
          { name: "label", type: "ReactNode", required: true, description: "Visible label." },
          { name: "description", type: "ReactNode", description: "Hint shown under the label." },
          { name: "error", type: "ReactNode", description: "Error message; sets aria-invalid." },
          { name: "required", type: "boolean", description: "Marks the field required (visual asterisk + native required)." },
          { name: "wrapperClassName", type: "string", description: "Class for the outer wrapper; `className` styles the input." },
          { name: "...props", type: "InputHTMLAttributes", description: "All native input attributes and a forwarded ref." }
        ]
      }
    ],
    accessibility: [
      "The label is a real <label> tied to the input.",
      "Description and error are connected with aria-describedby.",
      "The asterisk is decorative; the native required attribute is what assistive tech reads."
    ]
  },
  {
    slug: "select",
    name: "Select",
    category: "Building blocks",
    summary: "Styled native select with label, description, and error.",
    description:
      "A styled native <select>. For short option lists it's the most robust choice: correct keyboard behaviour, screen reader support, and the platform picker on mobile, with no extra JavaScript.",
    importCode: `import { Select } from "flowpane";`,
    examples: [example("select/Basic", "Basic")],
    props: [
      {
        component: "Select",
        props: [
          { name: "label", type: "ReactNode", required: true, description: "Visible label." },
          { name: "options", type: "{ value: string; label: string; disabled?: boolean }[]", description: "Options to render (or pass <option> children)." },
          { name: "placeholder", type: "string", description: "Adds an empty first option." },
          { name: "description", type: "ReactNode", description: "Hint shown under the label." },
          { name: "error", type: "ReactNode", description: "Error message; sets aria-invalid." },
          { name: "...props", type: "SelectHTMLAttributes", description: "All native select attributes and a forwarded ref." }
        ]
      }
    ],
    keyboard: [
      { keys: ["↑", "↓"], action: "Changes the selected option." },
      { keys: ["Space"], action: "Opens the option list." }
    ],
    accessibility: ["Native select semantics and platform pickers.", "Description and error linked with aria-describedby."]
  },
  {
    slug: "checkbox",
    name: "Checkbox",
    category: "Building blocks",
    summary: "Checkbox with label, description, and indeterminate state.",
    description: "A native checkbox with custom styling. The indeterminate state is useful for \"select all\" controls.",
    importCode: `import { Checkbox } from "flowpane";`,
    examples: [example("checkbox/Basic", "Basic"), example("checkbox/SelectAll", "Select all (indeterminate)", "The parent checkbox is mixed when only some children are checked.")],
    props: [
      {
        component: "Checkbox",
        props: [
          { name: "label", type: "ReactNode", description: "Visible label. Without one, pass aria-label." },
          { name: "description", type: "ReactNode", description: "Supporting text under the label." },
          { name: "indeterminate", type: "boolean", default: "false", description: "Mixed state." },
          { name: "...props", type: "InputHTMLAttributes", description: "All native checkbox attributes and a forwarded ref." }
        ]
      }
    ],
    keyboard: [{ keys: ["Space"], action: "Toggles the checkbox." }],
    accessibility: ["Native checkbox, so it works with every assistive technology.", "Indeterminate is exposed as aria-checked=\"mixed\"."]
  },
  {
    slug: "dialog",
    name: "Dialog",
    category: "Building blocks",
    summary: "Accessible modal and alert dialog with focus management.",
    description:
      "A modal rendered in a portal. It moves focus inside when opened, keeps Tab cycling within it, closes on Escape, returns focus to the trigger, and locks page scroll. Use role=\"alertdialog\" for destructive confirmations.",
    importCode: `import { Dialog } from "flowpane";`,
    examples: [
      example("dialog/Confirmation", "Confirmation", "An alert dialog that can't be dismissed by clicking outside, so a misclick can't lose the decision."),
      example("dialog/Form", "With a form")
    ],
    props: [
      {
        component: "Dialog",
        props: [
          { name: "open", type: "boolean", required: true, description: "Whether the dialog is shown." },
          { name: "onOpenChange", type: "(open: boolean) => void", required: true, description: "Called with false on Escape, overlay click, or the close button." },
          { name: "title", type: "ReactNode", required: true, description: "Heading and accessible name." },
          { name: "description", type: "ReactNode", description: "Supporting text; announced on open." },
          { name: "children", type: "ReactNode", description: "Body content." },
          { name: "footer", type: "ReactNode", description: "Actions row." },
          { name: "size", type: "\"sm\" | \"md\" | \"lg\"", default: "\"md\"", description: "Maximum width." },
          { name: "role", type: "\"dialog\" | \"alertdialog\"", default: "\"dialog\"", description: "Use alertdialog for confirmations." },
          { name: "closeOnOverlayClick", type: "boolean", default: "true", description: "Close when clicking the backdrop." },
          { name: "showCloseButton", type: "boolean", default: "true", description: "Show the × button." },
          { name: "initialFocusRef", type: "RefObject<HTMLElement>", description: "Element to focus on open." },
          className
        ]
      }
    ],
    keyboard: [
      { keys: ["Tab"], action: "Moves focus to the next element inside the dialog, wrapping at the end." },
      { keys: ["Shift", "Tab"], action: "Moves focus backwards, wrapping at the start." },
      { keys: ["Esc"], action: "Closes the dialog and returns focus to the trigger." }
    ],
    accessibility: [
      "role=\"dialog\" (or alertdialog) with aria-modal, labelled by the title and described by the description.",
      "Focus moves inside on open and returns to the trigger on close.",
      "Page scroll is locked while open, including nested dialogs."
    ]
  },
  {
    slug: "tabs",
    name: "Tabs",
    category: "Building blocks",
    summary: "WAI-ARIA tabs with full keyboard support.",
    description:
      "Organise related content into panels. Follows the WAI-ARIA tabs pattern and works controlled (value + onValueChange) or uncontrolled (defaultValue).",
    importCode: `import { Tab, TabList, TabPanel, Tabs } from "flowpane";`,
    examples: [example("tabs/Basic", "Basic")],
    props: [
      {
        component: "Tabs",
        props: [
          { name: "value", type: "string", description: "Selected tab (controlled)." },
          { name: "defaultValue", type: "string", description: "Initially selected tab (uncontrolled)." },
          { name: "onValueChange", type: "(value: string) => void", description: "Called when the selection changes." },
          className
        ]
      },
      {
        component: "TabList",
        props: [{ name: "aria-label", type: "string", required: true, description: "Describes the group of tabs." }]
      },
      {
        component: "Tab / TabPanel",
        props: [
          { name: "value", type: "string", required: true, description: "Connects a tab to its panel." },
          { name: "disabled", type: "boolean", description: "Tab only: skipped by keyboard navigation." }
        ]
      }
    ],
    keyboard: [
      { keys: ["←", "→"], action: "Moves to and selects the previous or next tab, wrapping around." },
      { keys: ["Home"], action: "Selects the first tab." },
      { keys: ["End"], action: "Selects the last tab." },
      { keys: ["Tab"], action: "Moves focus from the tab list into the panel." }
    ],
    accessibility: [
      "tablist, tab, and tabpanel roles with aria-selected and aria-controls.",
      "Roving tabindex: only the selected tab is in the Tab order.",
      "Disabled tabs are skipped by arrow keys."
    ]
  },
  {
    slug: "toast",
    name: "Toast",
    category: "Building blocks",
    summary: "Accessible notifications with actions like Undo.",
    description:
      "Brief notifications that don't interrupt work. Wrap your app in <ToastProvider> once, then call toast() from useToast() anywhere. Auto-dismiss pauses while a toast is hovered or focused.",
    importCode: `import { ToastProvider, useToast } from "flowpane";`,
    examples: [example("toast/Tones", "Tones"), example("toast/Undo", "With an Undo action")],
    props: [
      {
        component: "ToastProvider",
        props: [
          { name: "limit", type: "number", default: "3", description: "Maximum toasts on screen; oldest are removed first." },
          { name: "label", type: "string", default: "\"Notifications\"", description: "Accessible name of the notifications region." }
        ]
      },
      {
        component: "toast(options)",
        props: [
          { name: "title", type: "ReactNode", required: true, description: "Main message." },
          { name: "description", type: "ReactNode", description: "Supporting text." },
          { name: "tone", type: "\"info\" | \"success\" | \"warning\" | \"danger\"", default: "\"info\"", description: "Danger toasts use role=\"alert\"." },
          { name: "duration", type: "number", default: "5000", description: "Milliseconds before auto-dismiss; Infinity to persist." },
          { name: "action", type: "ReactNode", description: "Optional action such as Undo." }
        ]
      }
    ],
    accessibility: [
      "Toasts live in a labelled region that stays mounted, so new messages are announced.",
      "Danger toasts use role=\"alert\" (assertive); others use role=\"status\" (polite).",
      "Auto-dismiss pauses on hover and focus so people have time to read and act."
    ]
  }
];

export const workflowComponents = components.filter((c) => c.category === "Workflow");
export const buildingBlocks = components.filter((c) => c.category === "Building blocks");

export const guides = [
  { slug: "introduction", title: "Introduction" },
  { slug: "installation", title: "Installation" },
  { slug: "theming", title: "Theming" },
  { slug: "accessibility", title: "Accessibility" }
];
