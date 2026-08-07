type RecordValue = Record<string, unknown>;

const text = (value: unknown) => typeof value === "string" && value.trim().length > 0;
const list = (value: unknown) => Array.isArray(value) ? value : [];
const isRecord = (value: unknown): value is RecordValue => typeof value === "object" && value !== null && !Array.isArray(value);

export function validatePreferredStack(value: unknown): string[] {
  const root = value as RecordValue;
  const errors: string[] = [];
  const foundations = new Map<string, number>();
  for (const [index, raw] of list(root.choices).entries()) {
    const choice = raw as RecordValue;
    for (const field of ["category", "technology", "rationale", "rejectedAlternative", "reversalTrigger", "owner", "lastVerified"]) {
      if (!text(choice[field])) errors.push(`choices[${index}] missing ${field}`);
    }
    if (choice.status !== "preferred") errors.push(`choices[${index}] must be preferred`);
    const category = String(choice.category ?? "unknown");
    foundations.set(category, (foundations.get(category) ?? 0) + 1);
    if (choice.foundational === true && choice.additionalFoundation === true && choice.approvedDecision !== true) {
      errors.push(`${category}: second foundational dependency requires an approved decision`);
    }
  }
  if (list(root.choices).length === 0) errors.push("preferred stack has no choices");
  return errors;
}

export function validateDatabaseOperation(value: RecordValue): string[] {
  if (value.destructive !== true) return [];
  if (value.target !== "local" || value.selfStamp !== "local-development") {
    return ["destructive database work is allowed only against a self-stamped local-development database"];
  }
  return [];
}

export function validateVendorEvidence(value: unknown): string[] {
  const record = value as RecordValue;
  const errors: string[] = [];
  if (record.officialSource !== true) errors.push("vendor evidence must use an official source");
  if (record.officialSkillOrMcpChecked !== true) errors.push("official vendor skill or MCP must be checked");
  if (record.diagnosticsPassed !== true) errors.push("vendor diagnostics must pass");
  if (!text(record.lastVerified)) errors.push("vendor evidence needs a verification date");
  if (!text(record.owner)) errors.push("vendor evidence needs an owner");
  return errors;
}

export function validateCapabilityMap(value: unknown): string[] {
  const root = value as RecordValue;
  const errors: string[] = [];
  const requiredTransports = ["ui", "trpc", "mcp", "copilot", "jobs", "reports", "schedules"];
  for (const [index, raw] of list(root.capabilities).entries()) {
    const capability = raw as RecordValue;
    if (!text(capability.id)) errors.push(`capabilities[${index}] missing id`);
    if (!text(capability.procedure)) errors.push(`capabilities[${index}] missing shared authorized procedure`);
    if (list(capability.userVocabulary).length === 0) errors.push(`capabilities[${index}] missing userVocabulary`);
    if (list(capability.callers).length === 0) errors.push(`capabilities[${index}] missing callers`);
    for (const field of ["contextAvailability", "completionSignal", "recovery"]) if (!text(capability[field])) errors.push(`capabilities[${index}] missing ${field}`);
    const transports = list(capability.transports) as RecordValue[];
    if (transports.length === 0) errors.push(`capabilities[${index}] has no transports`);
    const names = transports.map((entry) => String(entry.name ?? ""));
    for (const name of requiredTransports) if (!names.includes(name)) errors.push(`capabilities[${index}] missing ${name} transport disposition`);
    if (new Set(names).size !== names.length) errors.push(`capabilities[${index}] has duplicate transport dispositions`);
    for (const [transportIndex, entry] of transports.entries()) {
      if (entry.applicability === "not-applicable") {
        const exception = isRecord(entry.exception) ? entry.exception : {};
        if (!["physical", "legal", "security"].includes(String(exception.reasonType)) || !text(exception.reason) || !text(exception.humanProcedure) || !text(exception.approvalId)) {
          errors.push(`capabilities[${index}].transports[${transportIndex}] needs a governed physical, legal, or security exception and human procedure`);
        }
      } else if (entry.applicability !== "implemented") errors.push(`capabilities[${index}].transports[${transportIndex}] missing applicability`);
    }
    const implemented = transports.filter((entry) => entry.applicability === "implemented");
    const auth = new Set(implemented.map((entry) => entry.authorizationPolicy));
    const approvals = new Set(implemented.map((entry) => entry.approvalPolicy));
    if (auth.size !== 1 || auth.has(undefined)) errors.push(`capabilities[${index}] authorization differs across transports`);
    if (approvals.size !== 1 || approvals.has(undefined)) errors.push(`capabilities[${index}] approval differs across transports`);
    if (implemented.some((entry) => !text(entry.procedure) || entry.procedure !== capability.procedure)) {
      errors.push(`capabilities[${index}] transport does not use the shared procedure`);
    }
    if (capability.consequential === true && !approvals.has("human-only")) {
      errors.push(`capabilities[${index}] consequential action requires human-only approval`);
    }
  }
  return errors;
}

export function scanSecrets(value: string, location: "source" | "log" | "fixture" | "manifest" | "handbook"): string[] {
  const patterns = [
    /(?:API|SECRET|ACCESS|PRIVATE)[_-]?KEY\s*[:=]\s*["']?(?!redacted|example|test)[A-Za-z0-9_\-]{12,}/i,
    /-----BEGIN [A-Z ]+PRIVATE KEY-----/,
    /(?:sk|pk)_(?:live|prod)_[A-Za-z0-9]{12,}/,
  ];
  return patterns.some((pattern) => pattern.test(value)) ? [`credential material detected in ${location}`] : [];
}

export function validateSecretControl(value: RecordValue): string[] {
  const errors: string[] = [];
  if (!text(value.owner)) errors.push("secret control requires a rotation owner");
  if (!text(value.rotationTestedAt)) errors.push("secret control requires a tested rotation path");
  if (value.emergencyRevocation !== true) errors.push("secret control requires emergency revocation");
  return errors;
}

export function validateDataLifecycle(value: unknown): string[] {
  const root = value as RecordValue;
  const errors: string[] = [];
  for (const [index, raw] of list(root.artifacts).entries()) {
    const artifact = raw as RecordValue;
    for (const field of ["classification", "systemOfRecord", "retention", "deletionProcedure", "backupExpiry", "deletionEvidence"]) {
      const label = field === "deletionEvidence" ? "deletion evidence" : field === "backupExpiry" ? "backup expiry" : field;
      if (!text(artifact[field])) errors.push(`artifacts[${index}] missing ${label}`);
    }
    if (list(artifact.roles).length === 0) errors.push(`artifacts[${index}] missing roles`);
    if (typeof artifact.legalHold !== "boolean") errors.push(`artifacts[${index}] missing legalHold behavior`);
    if (artifact.deletionEvidence === "signed-url-expiry") errors.push(`artifacts[${index}] signed URL expiry is not deletion evidence`);
  }
  return errors;
}

export function validateMediaTransfer(value: unknown): string[] {
  const record = value as RecordValue;
  const errors: string[] = [];
  if (record.path !== "direct-to-provider") errors.push("media transfer must be direct to R2 or Stream");
  if (record.boundedGrant !== true) errors.push("media transfer requires a bounded grant");
  if (record.durableConfirmation !== true) errors.push("media transfer requires durable confirmation");
  if (record.quarantine !== true) errors.push("media transfer requires quarantine before use");
  if (record.orphanCleanup !== true) errors.push("media transfer requires orphan cleanup");
  if (record.idempotentConfirmation !== true) errors.push("media transfer confirmation must be idempotent");
  if (record.authorizationRechecked !== true) errors.push("authorization must be rechecked at confirmation and access");
  return errors;
}

export function validateAgentIdentityRegistry(value: unknown): string[] {
  const root = value as RecordValue;
  const errors: string[] = [];
  const naming = isRecord(root.naming) ? root.naming : {};
  const traditions = new Set(list(naming.traditions));
  if (!traditions.has("italian") || !traditions.has("brazilian")) errors.push("agent names must use Italian and Brazilian traditions");
  if (naming.roleAligned !== true) errors.push("agent naming must be role-aligned");

  const seen = new Set<string>();
  for (const [index, raw] of list(root.members).entries()) {
    const member = raw as RecordValue;
    for (const field of ["id", "name", "productScope", "type", "role", "shortDescription", "longDescription", "pronunciation"]) {
      if (!text(member[field])) errors.push(`members[${index}] missing ${field}`);
    }
    const key = `${member.productScope}:${String(member.name).toLocaleLowerCase()}`;
    if (seen.has(key)) errors.push(`members[${index}] duplicate name within product scope`);
    seen.add(key);

    if (member.type === "minion") {
      if (member.usesLlm !== false) errors.push(`members[${index}] minion cannot use an LLM`);
      if (member.exercisesJudgment !== false) errors.push(`members[${index}] minion cannot exercise judgment`);
    } else if (["agent", "specialist", "orchestrator"].includes(String(member.type)) && member.usesLlm !== true) {
      errors.push(`members[${index}] ${member.type} must use an LLM; deterministic workers are minions`);
    }
    if (member.type === "orchestrator" && (member.routesWork !== true || member.producesContent !== false)) errors.push(`members[${index}] orchestrator routes work and does not produce content directly`);
    if (member.scope === "cross-product" && member.type !== "specialist") errors.push(`members[${index}] only a Specialist may have cross-product scope`);

    if (member.conversational === true) {
      const presentation = isRecord(member.presentation) ? member.presentation : {};
      const modes = new Set(list(presentation.modes));
      if (presentation.genderIdentity !== "female") errors.push(`members[${index}] conversational identity must be female`);
      if (presentation.explicitAiDisclosure !== true) errors.push(`members[${index}] conversational identity requires explicit AI disclosure`);
      if (!modes.has("abstract-animation") || !modes.has("photoreal-animated-human")) errors.push(`members[${index}] conversational identity requires abstract and photoreal modes`);
      if (presentation.candidateCount !== 3 || presentation.regenerationAllowed !== true) errors.push(`members[${index}] photoreal identity requires three candidates and regeneration`);
      if (presentation.abstractFallback !== true) errors.push(`members[${index}] photoreal identity requires an abstract fallback`);
      if (presentation.syntheticIdentity !== true || presentation.realPersonImitation !== false) errors.push(`members[${index}] photoreal identity must be synthetic and cannot imitate a real person`);
    }
  }
  if (list(root.members).length === 0) errors.push("agent identity registry has no members");
  return errors;
}
