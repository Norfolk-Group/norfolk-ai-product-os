function isRecord(value: unknown): value is Record<string, unknown> {
  return typeof value === "object" && value !== null && !Array.isArray(value);
}

export function validateDesignContract(value: unknown): string[] {
  if (!isRecord(value)) return ["design contract must be an object"];
  const errors: string[] = [];

  if (Array.isArray(value.shadcnInputs)) {
    for (const [index, input] of value.shadcnInputs.entries()) {
      if (!isRecord(input)) continue;
      if (input.recordedHash !== input.resolvedHash) {
        errors.push(`shadcnInputs[${index}]: hash mismatch between recorded and resolved source`);
      }
    }
  }

  const references = new Map<string, string>();
  if (Array.isArray(value.references)) {
    for (const reference of value.references) {
      if (isRecord(reference) && typeof reference.id === "string" && typeof reference.state === "string") {
        references.set(reference.id, reference.state);
      }
    }
  }
  if (Array.isArray(value.rules)) {
    for (const [ruleIndex, rule] of value.rules.entries()) {
      if (!isRecord(rule) || !Array.isArray(rule.sources)) continue;
      for (const source of rule.sources) {
        if (!isRecord(source) || typeof source.referenceId !== "string") continue;
        if (references.get(source.referenceId) !== "accepted") {
          errors.push(`rules[${ruleIndex}]: source ${source.referenceId} is not an accepted reference`);
        }
      }
    }
  }

  const inheritance = isRecord(value.inheritance) ? value.inheritance : undefined;
  const preferences = inheritance && isRecord(inheritance.userPreferences) ? inheritance.userPreferences : undefined;
  if (preferences && Array.isArray(preferences.allowed) && isRecord(preferences.values)) {
    const allowed = new Set(preferences.allowed.filter((item): item is string => typeof item === "string"));
    for (const key of Object.keys(preferences.values)) {
      if (!allowed.has(key)) errors.push(`userPreferences.values.${key}: preference is not allowed by this contract`);
    }
  }

  return errors;
}
