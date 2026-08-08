export interface ReleaseAuthorization {
  schemaVersion: 1;
  releaseVersion: string;
  candidateVersion: string;
  candidateSourceCommit: string;
  candidateManifestSha256: string;
  releaseWorkflowCommit: string;
  approver: string;
  approvedAt: string;
  scope: "private-github-release";
  confirmation: "publish-private-release";
  trustedKeyId: string;
}

const exactKeys = ["schemaVersion", "releaseVersion", "candidateVersion", "candidateSourceCommit", "candidateManifestSha256", "releaseWorkflowCommit", "approver", "approvedAt", "scope", "confirmation", "trustedKeyId"];

export function validateReleaseAuthorization(value: unknown): string[] {
  if (!value || typeof value !== "object" || Array.isArray(value)) return ["authorization must be an object"];
  const record = value as Record<string, unknown>;
  const errors: string[] = [];
  for (const key of exactKeys) if (!(key in record)) errors.push(`missing ${key}`);
  for (const key of Object.keys(record)) if (!exactKeys.includes(key)) errors.push(`unexpected ${key}`);
  if (record.schemaVersion !== 1) errors.push("schemaVersion must be 1");
  if (!/^0\.\d+\.\d+$/.test(String(record.releaseVersion ?? ""))) errors.push("releaseVersion must be a release SemVer");
  if (!/^0\.\d+\.\d+-candidate\.\d+$/.test(String(record.candidateVersion ?? ""))) errors.push("candidateVersion must identify a candidate");
  if (record.releaseVersion === record.candidateVersion) errors.push("candidate cannot be the published version");
  for (const key of ["candidateSourceCommit", "releaseWorkflowCommit"]) if (!/^[0-9a-f]{40}$/.test(String(record[key] ?? ""))) errors.push(`${key} must be a full lowercase Git commit`);
  if (!/^[0-9a-f]{64}$/.test(String(record.candidateManifestSha256 ?? ""))) errors.push("candidateManifestSha256 must be SHA-256");
  if (record.scope !== "private-github-release") errors.push("scope must be private-github-release");
  if (record.confirmation !== "publish-private-release") errors.push("confirmation must be publish-private-release");
  for (const key of ["approver", "trustedKeyId"]) if (typeof record[key] !== "string" || record[key].trim() === "") errors.push(`${key} must be non-empty`);
  if (typeof record.approvedAt !== "string" || !/^\d{4}-\d{2}-\d{2}T\d{2}:\d{2}:\d{2}(?:\.\d{3})?Z$/.test(record.approvedAt) || Number.isNaN(Date.parse(record.approvedAt))) errors.push("approvedAt must be an ISO UTC timestamp");
  return errors;
}
