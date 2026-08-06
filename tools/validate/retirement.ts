type R = Record<string, unknown>;
export function validateRetirementDossier(value: unknown): string[] {
  const d = value as R; const errors: string[] = [];
  for (const field of ["preservation","uniqueContent","consumers","branches","pullRequests","settings","recoveryTest"]) if (!d[field] || typeof d[field] !== "object") errors.push(`missing ${field}`);
  if (d.readiness === "ready-for-exact-approval" || d.readiness === "approved") {
    for (const field of ["preservation","uniqueContent","consumers","branches","pullRequests","settings","recoveryTest"]) if ((d[field] as R)?.complete !== true) errors.push(`${field} is incomplete`);
  }
  if (d.readiness !== "approved" && d.missingApproval !== true) errors.push("destructive action requires exact missing approval");
  return errors;
}

export function destructiveActionAvailable(value: unknown): boolean {
  const d = value as R;
  return validateRetirementDossier(value).length === 0 && d.readiness === "approved" && d.missingApproval === false && (d.recommendedAction === "delete" || d.recommendedAction === "archive");
}

export function validateValidationArtifact(value: string): string[] {
  const errors: string[] = [];
  if (!/publication:\s*blocked/i.test(value)) errors.push("client-derived validation must remain blocked from publication");
  if (!/source commit:\s*`[0-9a-f]{40}`/i.test(value)) errors.push("validation needs pinned source commit");
  if (!/proposal/i.test(value)) errors.push("findings must remain proposals");
  if (/(?:@[A-Za-z0-9._-]+\.[A-Za-z]{2,}|sk_(?:live|prod)_|-----BEGIN .*PRIVATE KEY-----)/.test(value)) errors.push("validation contains identifier or credential material");
  return errors;
}
