import GraphicsLayer from "@arcgis/core/layers/GraphicsLayer";
import JSZip from "jszip";
import { FinishedFlightPlanType } from "Types/finished_plans";
import { ATTACHMENTS_FEATURE_LAYER_URL } from "@helpers/arcgis/deleteArcgisAttachment";
import { runWithConcurrency } from "./utils";
import {
  addProcessedItemsToZip,
  preloadReportAttachments,
} from "./reportZipHelpers";
import { buildReportProcessingTasks } from "./buildReportProcessingTasks";

export type AssembleReportZipInput = {
  selectedPlan: FinishedFlightPlanType;
  selectedPointsData: FinishedFlightPlanType["points_data"];
  selectedGeometriesData: NonNullable<FinishedFlightPlanType["geometries"]>;
  activities: Array<{ label: string; value: string | number }>;
  organizations: Array<{ label: string; value: string | number }>;
  mapServerUrl: string;
  pilootOptions: { label: string; value: string }[];
  tempLayer: InstanceType<typeof GraphicsLayer>;
  zip: InstanceType<typeof JSZip>;
  setZippingStatus: (status: string) => void;
};

export async function assembleReportZipContents(
  input: AssembleReportZipInput
): Promise<void> {
  const { zip, ...rest } = input;
  const { attachmentsByPoint, attachmentsByGeometry, logoDataUrl } =
    await preloadReportAttachments(rest);
  const totalItems =
    rest.selectedPointsData.length + rest.selectedGeometriesData.length;
  const tasks = buildReportProcessingTasks({
    ...rest,
    totalItems,
    attachmentsByPoint,
    attachmentsByGeometry,
    featureLayerUrl: ATTACHMENTS_FEATURE_LAYER_URL,
    logoDataUrl,
  });
  addProcessedItemsToZip({
    zip,
    processedItems: await runWithConcurrency({ tasks, concurrency: 4 }),
  });
}
