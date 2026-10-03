import type { ReactNode } from "react";
import { cx } from "../../utils/cx";
import { CheckIcon } from "../../utils/icons";
import { VisuallyHidden } from "../../utils/VisuallyHidden";

export interface StepperStep {
  id: string;
  label: ReactNode;
  description?: ReactNode;
}

export interface StepperProps {
  steps: StepperStep[];
  /** Zero-based index of the step the user is on. */
  currentStep: number;
  /**
   * Lets users jump back to completed steps. When provided, completed steps render as buttons.
   * Upcoming steps are never clickable, so users can't skip required work.
   */
  onStepClick?: (index: number) => void;
  orientation?: "horizontal" | "vertical";
  /** Accessible name for the list. Default "Progress". */
  "aria-label"?: string;
  className?: string;
}

type StepStatus = "complete" | "current" | "upcoming";

const statusText: Record<StepStatus, string> = {
  complete: "Completed",
  current: "Current step",
  upcoming: "Not started"
};

export function Stepper({
  steps,
  currentStep,
  onStepClick,
  orientation = "horizontal",
  "aria-label": ariaLabel = "Progress",
  className
}: StepperProps) {
  return (
    <ol aria-label={ariaLabel} className={cx("fp-stepper", `fp-stepper--${orientation}`, className)}>
      {steps.map((step, index) => {
        const status: StepStatus = index < currentStep ? "complete" : index === currentStep ? "current" : "upcoming";
        const content = (
          <>
            <span className="fp-step__marker" aria-hidden="true">
              {status === "complete" ? <CheckIcon /> : index + 1}
            </span>
            <span className="fp-step__text">
              <span className="fp-step__label">
                {step.label}
                <VisuallyHidden>
                  {`, step ${index + 1} of ${steps.length}, ${statusText[status]}`}
                </VisuallyHidden>
              </span>
              {step.description && <span className="fp-step__description">{step.description}</span>}
            </span>
          </>
        );

        return (
          <li
            key={step.id}
            className="fp-step"
            data-status={status}
            aria-current={status === "current" ? "step" : undefined}
          >
            {onStepClick && status === "complete" ? (
              <button type="button" className="fp-step__inner" onClick={() => onStepClick(index)}>
                {content}
              </button>
            ) : (
              <div className="fp-step__inner">{content}</div>
            )}
          </li>
        );
      })}
    </ol>
  );
}
