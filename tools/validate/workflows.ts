type JsonRecord = Record<string, any>;

function record(value: unknown): JsonRecord { return value && typeof value === "object" ? value as JsonRecord : {}; }
function source(value: unknown): string { return JSON.stringify(value); }

export function validateTrustedReleaseWorkflow(value: unknown): string[] {
  const workflow = record(value);
  const jobs = record(workflow.jobs);
  const preflight = record(jobs.preflight);
  const release = record(jobs.release);
  const dispatch = record(record(workflow.on).workflow_dispatch);
  const text = source(workflow);
  const errors: string[] = [];
  if (Object.keys(record(workflow.on)).join(",") !== "workflow_dispatch") errors.push("release workflow must be manual only");
  for (const input of ["release_version", "authorization_path", "confirmation"]) if (!record(dispatch.inputs)[input]?.required) errors.push(`missing required ${input} input`);
  if (workflow.concurrency?.group !== "product-os-private-release" || workflow.concurrency?.["cancel-in-progress"] !== false) errors.push("release concurrency must serialize without cancellation");
  if (preflight.permissions?.contents !== "read" || Object.keys(record(preflight.permissions)).length !== 1) errors.push("preflight must be read-only");
  if (release.needs !== "preflight") errors.push("release must depend on preflight");
  if (release.environment !== "product-os-release") errors.push("release must use product-os-release environment");
  if (release.permissions?.contents !== "write" || release.permissions?.["id-token"] !== "write" || Object.keys(record(release.permissions)).length !== 2) errors.push("release permissions must be contents and OIDC only");
  for (const job of [preflight, release]) if (!String(job.if).includes("refs/heads/main") || !String(job.if).includes("publish-private-release")) errors.push("release jobs require main and exact confirmation");
  for (const required of ["dopplerhq/secrets-fetch-action@v2.0.0", '"auth-method":"oidc"', "DOPPLER_SERVICE_IDENTITY_ID", "DOPPLER_RELEASE_PROJECT", "DOPPLER_RELEASE_CONFIG", "trust/product-os-release-public-key.pem", "gh release create", "release:verify", "actions/upload-artifact@v7"]) if (!text.includes(required)) errors.push(`release workflow missing ${required}`);
  for (const step of [...(preflight.steps ?? []), ...(release.steps ?? [])]) if (typeof step.run === "string" && step.run.includes("${{ inputs.")) errors.push("workflow inputs must reach shell through environment variables");
  if (/DOPPLER_TOKEN|doppler-token/i.test(text)) errors.push("release workflow must not use a persistent Doppler token");
  return errors;
}

export function validateProviderReadinessWorkflow(value: unknown): string[] {
  const workflow = record(value);
  const job = record(record(workflow.jobs).diagnostic);
  const text = source(workflow);
  const errors: string[] = [];
  if (Object.keys(record(workflow.on)).join(",") !== "workflow_dispatch") errors.push("provider workflow must be manual only");
  if (job.environment !== "product-os-release") errors.push("provider workflow must use product-os-release environment");
  if (job.permissions?.contents !== "read") errors.push("provider workflow must not write contents");
  if (job.permissions?.["id-token"] !== "write") errors.push("provider workflow requires OIDC");
  if (!String(job.if).includes("refs/heads/main") || !String(job.if).includes("run-staging-diagnostic")) errors.push("provider workflow requires main and exact confirmation");
  for (const required of ["dopplerhq/secrets-fetch-action@v2.0.0", '"auth-method":"oidc"', "readiness:workos", "readiness:r2"]) if (!text.includes(required)) errors.push(`provider workflow missing ${required}`);
  if (/gh release|DOPPLER_TOKEN|doppler-token/i.test(text)) errors.push("provider workflow contains publication or persistent-token capability");
  return errors;
}
