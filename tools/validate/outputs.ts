type UnknownRecord = Record<string, unknown>;
const isRecord = (value: unknown): value is UnknownRecord => typeof value === "object" && value !== null && !Array.isArray(value);

export function validateOutputContract(value: unknown): string[] {
  if (!isRecord(value)) return ["output contract must be an object"];
  const errors: string[] = [];
  if (value.format === "chart") {
    const chart = isRecord(value.chartSemantics) ? value.chartSemantics : {};
    for (const key of ["units", "source", "dateBasis", "textAlternative"]) if (!chart[key]) errors.push(`chart requires ${key}`);
  }
  const assets = isRecord(value.generatedAssetPolicy) ? value.generatedAssetPolicy : {};
  if (typeof assets.sizeBytes === "number" && typeof assets.gitThresholdBytes === "number" && assets.sizeBytes > assets.gitThresholdBytes) {
    if (assets.storage !== "r2-manifest" || !assets.objectVersion || !assets.sha256) errors.push("large generated asset requires versioned R2 manifest and checksum");
  }
  const fixtures = Array.isArray(value.fixtures) ? value.fixtures : [];
  for (const state of ["normal", "overflow", "empty", "unavailable"]) if (!fixtures.includes(state)) errors.push(`output contract requires ${state} fixture`);
  return errors;
}

export function validateFinancialTieOut(rendered: unknown, authoritative: unknown): string[] {
  if (!isRecord(rendered) || !isRecord(authoritative)) return ["financial tie-out requires two snapshots"];
  const errors: string[] = [];
  const keys = new Set([...Object.keys(rendered), ...Object.keys(authoritative)]);
  for (const key of keys) if (rendered[key] !== authoritative[key]) errors.push(`${key} does not tie to authoritative snapshot`);
  return errors;
}

export function validateSpreadsheetCell(value: string): string[] {
  return /^[=+\-@]/.test(value) ? ["spreadsheet cell begins with a formula-control character and must be rejected or safely escaped"] : [];
}

export function validateOutputJob(value: unknown, now = new Date()): string[] {
  if (!isRecord(value)) return ["output job must be an object"];
  const errors: string[] = [];
  if (JSON.stringify(value.requestScope) !== JSON.stringify(value.renderedScope)) errors.push("rendered scope does not preserve request scope");
  const auth = isRecord(value.authorization) ? value.authorization : {};
  if (auth.recipientAuthorized !== true) errors.push("recipient is not authorized for this output");
  const delivery = isRecord(value.delivery) ? value.delivery : {};
  const expiry = new Date(String(delivery.signedUrlExpiresAt));
  if (!Number.isFinite(expiry.getTime()) || expiry <= now) errors.push("signed download URL is expired or invalid");
  if (typeof value.idempotencyKey !== "string" || value.idempotencyKey.length === 0) errors.push("idempotency key is required to prevent duplicate delivery");
  if (typeof value.attempt === "number" && value.attempt > 1 && !value.idempotencyKey) errors.push("retry without idempotency key can duplicate a job");
  return errors;
}
