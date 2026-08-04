import WizardButtonBar from "Components/Common/Wizard/WizardButtonBar";

type WizardLabels = {
  vorige: string;
  filteren: string;
  volgende: string;
  annuleren: string;
};

/** Shared filter-step button bar for TemplateFlight / FlightPlan Step2. */
export function FilterStepWizardButtons(props: {
  labels: WizardLabels;
  withLog: (message: string, action: () => void) => () => void;
  onPrevious: () => void;
  previousLogMessage: string;
  onFilter: () => void;
  onNext: () => void;
  onCancel: () => void;
}) {
  const { labels, withLog } = props;
  return (
    <WizardButtonBar
      buttons={[
        {
          label: labels.vorige,
          onClick: withLog(props.previousLogMessage, props.onPrevious),
        },
        {
          label: labels.filteren,
          onClick: withLog("User clicked 'Filter' button", props.onFilter),
        },
        {
          label: labels.volgende,
          onClick: withLog("User clicked 'Next' button", props.onNext),
        },
        {
          label: labels.annuleren,
          onClick: withLog("User clicked 'Cancel' button", props.onCancel),
        },
      ]}
    />
  );
}
