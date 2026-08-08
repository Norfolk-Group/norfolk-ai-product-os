export const CANONICAL_OUTPUT_PATHS = [
  "outputs/README.md",
  "outputs/charts.md",
  "outputs/docx.md",
  "outputs/email.md",
  "outputs/investor-materials.md",
  "outputs/job-lifecycle.md",
  "outputs/pdf.md",
  "outputs/pptx.md",
  "outputs/presentation-ir.example.json",
  "outputs/presentation-ir.md",
  "outputs/print.md",
  "outputs/shared-principles.md",
  "outputs/xlsx.md",
] as const;

const canonicalOutputPaths = new Set<string>(CANONICAL_OUTPUT_PATHS);

export function isReleaseInputPath(path: string): boolean {
  return /^(?:adoption|design|governance|product)\/[^/]+\.md$/.test(path)
    || canonicalOutputPaths.has(path)
    || /^(?:compatibility|schemas)\/[^/]+\.json$/.test(path)
    || /^standards\/[^/]+\.(?:md|json)$/.test(path)
    || path === "handbook/index.html"
    || path === "catalog/generated/index.html";
}
