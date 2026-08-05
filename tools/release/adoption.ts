type Payload = { path: string; sensitivity: string; action: "add" | "update" | "delete" };
type Preflight = { productOSVersion: string; kitVersion: string; compatible: boolean; bundlePinned: boolean; signatureValid: boolean; hashesValid: boolean; branchWriteOnly: boolean; identityScope: string; environmentApproval: boolean; payload: Payload[]; allowedSensitivities: string[] };

export function planManagedFile(input: { installedHash: string; currentHash: string; incomingHash: string }) {
  if (input.currentHash !== input.installedHash) return { action: "conflict" as const, reason: "locally edited managed file" };
  if (input.currentHash === input.incomingHash) return { action: "unchanged" as const };
  return { action: "update" as const };
}

export function validateAdoptionPreflight(value: Preflight): string[] {
  const errors: string[] = [];
  if (!value.compatible) errors.push(`Product OS ${value.productOSVersion} and Kit ${value.kitVersion} are incompatible; no files may change`);
  if (!value.bundlePinned) errors.push("release bundle must be pinned by immutable version and manifest hash");
  if (!value.signatureValid) errors.push("release manifest signature is invalid or untrusted");
  if (!value.hashesValid) errors.push("release bundle content hashes do not match");
  if (!value.branchWriteOnly) errors.push("adoption identity must write only to a deterministic review branch, never the default branch");
  if (value.identityScope !== "repository") errors.push("adoption identity must be scoped to one repository");
  if (!value.environmentApproval) errors.push("release environment approval is required before mutation");
  for (const item of value.payload) {
    if (!value.allowedSensitivities.includes(item.sensitivity)) errors.push(`${item.path}: sensitivity ${item.sensitivity} is not allowed for this repository`);
    if (item.action === "delete") errors.push(`${item.path}: deletion must be separated into an unexecuted destructive proposal with exact approval`);
  }
  return errors;
}

export function validateRollback(value: { codeConfigOnly: boolean; expandContractCompatible: boolean; recoveryPlanApproved: boolean }): string[] {
  if (value.codeConfigOnly && value.expandContractCompatible) return [];
  if (!value.recoveryPlanApproved) return ["normal rollback is unsafe; an irreversible data or schema change requires a separately approved recovery plan"];
  return [];
}

export function validatePromotionCandidate(value: Record<string, unknown>): string[] {
  const errors: string[] = [];
  if (!value.provenance) errors.push("promotion requires provenance");
  if (!value.reviewer) errors.push("promotion requires a Norfolk reviewer");
  if (value.ipClassification !== "norfolk-owned" && value.ipClassification !== "licensed-for-reuse") errors.push("promotion rights are unknown or restricted");
  if (value.humanDisclosureReview !== true) errors.push("promotion requires human disclosure review");
  if (value.syntheticExamples !== true) errors.push("promotion requires synthetic examples");
  if (/(?:H-Analytics|KIT Capital|client record)/i.test(String(value.source ?? ""))) errors.push("promotion source contains client identity");
  if (value.state === "accepted" && value.reviewer !== "Product OS Owner") errors.push("only Product OS Owner may accept canon");
  return errors;
}
