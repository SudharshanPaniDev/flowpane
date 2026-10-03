import { Stepper } from "flowpane";

export default function Example() {
  return (
    <Stepper
      orientation="vertical"
      currentStep={2}
      aria-label="Onboarding progress"
      steps={[
        { id: "account", label: "Create account", description: "Completed 2 Oct" },
        { id: "team", label: "Invite your team", description: "4 people joined" },
        { id: "billing", label: "Add billing details", description: "Needed before your trial ends" },
        { id: "launch", label: "Go live" }
      ]}
    />
  );
}
