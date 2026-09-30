/**
 * Converts a Survey Portal package into BID scope items (one section per family).
 */
import { IScopeItem, ISurveyCatalog, ISurveyPackageLine } from "../models";
import { makeId } from "./idGenerator";

const PACKAGE_TAG = "survey-portal";

export function buildScopeItemsFromPackage(
  lines: ISurveyPackageLine[],
  catalog: ISurveyCatalog,
  startLineNumber: number = 1,
): IScopeItem[] {
  const result: IScopeItem[] = [];
  let lineNumber = startLineNumber;
  const byFamily: Record<string, ISurveyPackageLine[]> = {};
  const familyOrder: string[] = [];

  lines.forEach((line) => {
    const eq = catalog.equipment.find((e) => e.id === line.equipmentId);
    if (!eq) return;
    if (!byFamily[eq.familyId]) {
      byFamily[eq.familyId] = [];
      familyOrder.push(eq.familyId);
    }
    byFamily[eq.familyId].push(line);
  });

  familyOrder.forEach((familyId) => {
    const family = catalog.families.find((f) => f.id === familyId);
    const sectionId = makeId("scope");
    result.push({
      id: sectionId,
      lineNumber: 0,
      isSection: true,
      sectionId: null,
      sectionTitle: `Survey — ${family ? family.title : familyId}`,
      clientDocRef: "",
      description: "",
      compliance: null,
      resourceType: "",
      resourceSubType: "",
      equipmentOffer: "",
      partNumber: "",
      qtyOperational: 0,
      qtySpare: 0,
      needsCertification: false,
      comments: "",
      importedFromTemplate: PACKAGE_TAG,
      integratedDivision: "SURVEY",
      subItems: [],
    });

    byFamily[familyId].forEach((line) => {
      const eq = catalog.equipment.find((e) => e.id === line.equipmentId)!;
      result.push({
        id: makeId("scope"),
        lineNumber: lineNumber++,
        isSection: false,
        sectionId,
        sectionTitle: "",
        clientDocRef: "",
        description: eq.title,
        compliance: null,
        resourceType: "",
        resourceSubType: "",
        equipmentOffer: [eq.manufacturer, eq.model].filter(Boolean).join(" "),
        partNumber: eq.partNumber,
        qtyOperational: line.qty,
        qtySpare: 0,
        needsCertification: false,
        comments: "Added from Survey Portal",
        importedFromTemplate: PACKAGE_TAG,
        integratedDivision: "SURVEY",
        source: "human",
        subItems: [],
      });
    });
  });

  return result;
}
