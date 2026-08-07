import { safeRepositoryPath } from "../validate/files.js";

type Payload = { path: string; sensitivity: string; action: "add" | "update" | "delete" };
type CompatibilityEntry = { productOS: string; kit: string; status: string };
type Preflight = { productOSVersion: string; kitVersion: string; compatibility: CompatibilityEntry[]; bundlePinned: boolean; signatureValid: boolean; hashesValid: boolean; branchWriteOnly: boolean; identityScope: string; environmentApproval: boolean; payload: Payload[]; allowedSensitivities: string[] };

function versionParts(value: string): [number, number, number] | undefined {
  const match = /^(\d+)\.(\d+)\.(\d+)(?:-[0-9A-Za-z.-]+)?$/.exec(value);
  return match ? [Number(match[1]), Number(match[2]), Number(match[3])] : undefined;
}

function compareVersion(left: [number, number, number], right: [number, number, number]): number {
  for (let index = 0; index < 3; index += 1) if (left[index] !== right[index]) return left[index] - right[index];
  return 0;
}

function matchesRange(version: string, range: string): boolean {
  const candidate = versionParts(version);
  if (!candidate) return false;
  return range.split(/\s+/).every((token) => {
    const match = /^(>=|<=|>|<|=)?(\d+\.\d+\.\d+)$/.exec(token);
    if (!match) return token === version;
    const target = versionParts(match[2]);
    if (!target) return false;
    const comparison = compareVersion(candidate, target);
    return match[1] === ">=" ? comparison >= 0 : match[1] === "<=" ? comparison <= 0 : match[1] === ">" ? comparison > 0 : match[1] === "<" ? comparison < 0 : comparison === 0;
  });
}

function isCompatible(value: Preflight): boolean {
  return value.compatibility.some((entry) => entry.productOS === value.productOSVersion && ["candidate", "released"].includes(entry.status) && matchesRange(value.kitVersion, entry.kit));
}

export function planManagedFile(input: { installedHash: string; currentHash: string; incomingHash: string }) {
  if (input.currentHash !== input.installedHash) return { action: "conflict" as const, reason: "locally edited managed file" };
  if (input.currentHash === input.incomingHash) return { action: "unchanged" as const };
  return { action: "update" as const };
}

export function validateAdoptionPreflight(value: Preflight): string[] {
  const errors: string[] = [];
  if (!isCompatible(value)) errors.push(`Product OS ${value.productOSVersion} and Kit ${value.kitVersion} are incompatible; no files may change`);
  if (!value.bundlePinned) errors.push("release bundle must be pinned by immutable version and manifest hash");
  if (!value.signatureValid) errors.push("release manifest signature is invalid or untrusted");
  if (!value.hashesValid) errors.push("release bundle content hashes do not match");
  if (!value.branchWriteOnly) errors.push("adoption identity must write only to a deterministic review branch, never the default branch");
  if (value.identityScope !== "repository") errors.push("adoption identity must be scoped to one repository");
  if (!value.environmentApproval) errors.push("release environment approval is required before mutation");
  for (const item of value.payload) {
    if (!safeRepositoryPath(item.path)) errors.push(`${item.path}: unsafe path cannot enter an adoption payload`);
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
  const sanitization = typeof value.sanitization === "object" && value.sanitization !== null ? value.sanitization as Record<string, unknown> : {};
  if (!value.provenance) errors.push("promotion requires provenance");
  if (!value.reviewer) errors.push("promotion requires a Norfolk reviewer");
  if (value.ipClassification !== "norfolk-owned" && value.ipClassification !== "licensed-for-reuse") errors.push("promotion rights are unknown or restricted");
  if (value.sensitivity === "client-restricted") errors.push("client-restricted material cannot enter canon");
  if (sanitization.humanDisclosureReview !== true) errors.push("promotion requires human disclosure review");
  if (sanitization.syntheticExamples !== true) errors.push("promotion requires synthetic examples");
  if (sanitization.metadataStripped !== true) errors.push("promotion requires stripped metadata");
  const evidence = Array.isArray(value.evidence) ? value.evidence.join("\n") : "";
  const disclosureSurface = [value.source, value.provenance, evidence].map((item) => String(item ?? "")).join("\n");
  if (/(?:H-Analytics|KIT Capital|client record|\/(?:Users|home)\/[^/\s]+\/|https?:\/\/[^\s]+(?:client|customer|investor)|(?:api|secret|access)[_-]?key\s*[:=])/i.test(disclosureSurface)) errors.push("promotion content contains client identity, path, URL, or credential-like material");
  if (value.state === "accepted" && value.reviewer !== "Product OS Owner") errors.push("only Product OS Owner may accept canon");
  return errors;
}
