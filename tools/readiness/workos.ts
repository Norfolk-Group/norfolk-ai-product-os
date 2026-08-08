export function validateWorkOSReadinessEnvironment(environment: NodeJS.ProcessEnv): string[] {
  const errors: string[] = [];
  for (const name of ["WORKOS_API_KEY", "WORKOS_CLIENT_ID", "WORKOS_REDIRECT_URI"]) if (!environment[name]?.trim()) errors.push(`missing ${name}`);
  if (environment.WORKOS_ENVIRONMENT !== "staging") errors.push("WORKOS_ENVIRONMENT must be staging");
  return errors;
}

export function redactDiagnosticOutput(value: string): string {
  return value
    .replace(/\b(?:sk|pk)_(?:test|live)_[A-Za-z0-9_-]+\b/g, "[REDACTED]")
    .replace(/\b((?:code|token|secret|cookie|session|authorization|api[_ -]?key)=)[^\s&]+/gi, "$1[REDACTED]")
    .replace(/(https?:\/\/[^\s?]+)\?[^\s]+/gi, "$1?[REDACTED]");
}
