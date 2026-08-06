type UnknownRecord = Record<string, unknown>;
const requiredStates = ["idle", "waiting", "indeterminate", "determinate", "paused", "disconnected", "retrying", "timeout", "cancellation-requested", "cancelled", "late-completion", "duplicate-event", "failure", "success"];
const isRecord = (value: unknown): value is UnknownRecord => typeof value === "object" && value !== null && !Array.isArray(value);

export function validateMotionRecord(value: unknown): string[] {
  if (!isRecord(value)) return ["motion record must be an object"];
  const errors: string[] = [];
  const lineage = Array.isArray(value.lineage) ? value.lineage.filter(isRecord) : [];
  const approval = isRecord(value.approval) ? value.approval : {};
  if (value.status === "canonical") {
    if (approval.decision !== "approved" || !approval.by || !approval.date || !approval.rationale) errors.push("canonical motion requires an accountable approved decision");
    for (const role of ["creative-intent", "best-original-export", "best-production"]) {
      if (!lineage.some((item) => item.role === role)) errors.push(`canonical motion requires ${role} lineage`);
    }
  }
  for (const [index, item] of lineage.entries()) {
    if (item.objectVersion && item.sha256 !== item.retrievedSha256) errors.push(`lineage[${index}] retrieval checksum does not match the preserved original`);
  }
  const reducedMotion = isRecord(value.reducedMotion) ? value.reducedMotion : {};
  const preserved = Array.isArray(reducedMotion.preservedInformation) ? reducedMotion.preservedInformation : [];
  if (!["state", "completion"].every((item) => preserved.includes(item))) errors.push("reduced motion must preserve state and completion information");
  const states = Array.isArray(value.states) ? value.states : [];
  for (const state of requiredStates) if (!states.includes(state)) errors.push(`motion record is missing ${state} state`);
  return errors;
}

export function validateProgressEvents(events: unknown[]): string[] {
  const errors: string[] = [];
  let lastPercent: number | undefined;
  let cancelled = false;
  const ids = new Set<string>();
  for (const [index, raw] of events.entries()) {
    if (!isRecord(raw)) continue;
    if (raw.restart === true) lastPercent = undefined;
    if (raw.state === "indeterminate" && typeof raw.percent === "number") errors.push(`events[${index}]: indeterminate progress cannot display a percentage`);
    if (raw.state === "determinate") {
      if (raw.source !== "server" || typeof raw.stageId !== "string") errors.push(`events[${index}]: determinate progress must be server-grounded`);
      if (typeof raw.percent === "number") {
        if (lastPercent !== undefined && raw.percent < lastPercent && raw.restart !== true) errors.push(`events[${index}]: progress cannot regress without a declared restart`);
        lastPercent = raw.percent;
      }
    }
    if (raw.state === "cancelled") cancelled = true;
    if (cancelled && raw.state === "success") errors.push(`events[${index}]: completion after cancellation must be recorded as late-completion, not success`);
    if (typeof raw.eventId === "string") {
      const duplicate = ids.has(raw.eventId);
      if (duplicate && raw.state !== "duplicate-event") errors.push(`events[${index}]: duplicate event id must be recorded as duplicate-event`);
      if (!duplicate && raw.state === "duplicate-event") errors.push(`events[${index}]: duplicate-event must reference a previous event id`);
      if (!duplicate) ids.add(raw.eventId);
    }
  }
  return errors;
}

export function validateVisualCapture(value: unknown): string[] {
  if (!isRecord(value)) return ["visual capture must be an object"];
  const errors: string[] = [];
  for (const key of ["browser", "runtime", "orientation", "locale", "timezone", "clock", "randomSeed", "animationState"]) {
    const current = value[key];
    if (current === undefined || current === null || current === "latest" || current === "system" || current === "auto" || current === "live") errors.push(`${key} must be pinned`);
  }
  if (!Array.isArray(value.fonts) || value.fonts.length === 0) errors.push("fonts must be pinned");
  if (typeof value.deviceScaleFactor !== "number" || value.deviceScaleFactor <= 0) errors.push("deviceScaleFactor must be positive");
  if (typeof value.retentionDays !== "number" || value.retentionDays < 1) errors.push("retentionDays must be positive");
  if (value.baselineApproval !== "approved") errors.push("visual baseline requires explicit approval");
  return errors;
}
