export type Severity = "error" | "warning";

export interface Issue {
  code: string;
  message: string;
  path?: string;
  severity: Severity;
}

export interface ValidationResult {
  issues: Issue[];
}

export function error(code: string, message: string, path?: string): Issue {
  return { code, message, path, severity: "error" };
}

export function warning(code: string, message: string, path?: string): Issue {
  return { code, message, path, severity: "warning" };
}

export function failed(result: ValidationResult): boolean {
  return result.issues.some((issue) => issue.severity === "error");
}
