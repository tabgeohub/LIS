import { AnimatePresence, motion } from "framer-motion";
import { FinishedFlightPlanType } from "Types/finished_plans";
import PlansFilterSection from "./PlansFilterSection";

type TimesliderPlansOverlayProps = {
  visible: boolean;
  blocked: boolean;
  plans: FinishedFlightPlanType[];
  selectedPlanId: number | null;
  onSelectPlan: (plan: FinishedFlightPlanType) => void;
  loading: boolean;
  emptyHint?: string;
  firstImageUrlByPlanId: Record<number, string>;
  imagesLoading: boolean;
};

export default function TimesliderPlansOverlay({
  visible,
  blocked,
  plans,
  selectedPlanId,
  onSelectPlan,
  loading,
  emptyHint,
  firstImageUrlByPlanId,
  imagesLoading,
}: TimesliderPlansOverlayProps) {
  return (
    <AnimatePresence>
      {visible && (
        <motion.div
          key="timeslider-plans-overlay"
          initial={{ opacity: 0, y: -16 }}
          animate={{ opacity: 1, y: 0 }}
          exit={{ opacity: 0, y: -12 }}
          transition={{ duration: 0.22, ease: [0.4, 0, 0.2, 1] }}
          className="absolute inset-x-0 top-0 z-30 max-h-[min(45vh,15rem)] overflow-y-auto rounded-b-lg bg-gray-50 px-3 pb-2 pt-1 shadow-[0_8px_30px_rgba(0,0,0,0.12)]"
        >
          <PlansFilterSection
            plans={blocked ? [] : plans}
            selectedPlanId={selectedPlanId}
            onSelectPlan={onSelectPlan}
            loading={loading}
            emptyHint={emptyHint}
            firstImageUrlByPlanId={firstImageUrlByPlanId}
            imagesLoading={imagesLoading}
          />
        </motion.div>
      )}
    </AnimatePresence>
  );
}
