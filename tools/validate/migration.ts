import { createHash } from "node:crypto";

type RecordValue = Record<string, unknown>;
const isRecord = (value: unknown): value is RecordValue => typeof value === "object" && value !== null && !Array.isArray(value);

export function validateMigrationRegister(value: unknown): string[] {
  if (!isRecord(value) || !Array.isArray(value.sources)) return ["migration register requires a sources array"];
  const errors: string[] = [];
  const ids = new Set<string>();
  for (const [index, source] of value.sources.entries()) {
    if (!isRecord(source)) { errors.push(`sources[${index}] must be an object`); continue; }
    for (const key of ["id", "repository", "sourceRef", "ownership", "sensitivity", "evidence", "disposition", "approval", "destination"]) {
      if (source[key] === undefined || source[key] === "") errors.push(`sources[${index}] missing ${key}`);
    }
    if (typeof source.id === "string") {
      if (ids.has(source.id)) errors.push(`duplicate source id ${source.id}`);
      ids.add(source.id);
    }
    if (source.disposition === "promote" && source.approval !== "approved") errors.push(`${source.id}: promotion requires approval`);
    if (source.disposition === "promote" && (typeof source.destination !== "string" || source.destination === "pending")) errors.push(`${source.id}: promotion requires a current destination`);
    if (source.sensitivity === "client-confidential" && source.disposition === "promote") errors.push(`${source.id}: client-confidential material cannot be promoted directly`);
  }
  return errors;
}

export function validatePromotedContent(content: string): string[] {
  const errors: string[] = [];
  if (/(?:KIT Capital|H-Analytics|Obra P[ií]a|La Plage|El Claustro)/i.test(content)) errors.push("promoted content contains client identity");
  if (/(?:api|secret|access)[_-]?key\s*[:=]/i.test(content) || /-----BEGIN [A-Z ]+PRIVATE KEY-----/.test(content)) errors.push("promoted content contains a credential-like value");
  if (/#[0-9a-f]{6}\b/i.test(content) && /client|brand|palette/i.test(content)) errors.push("promoted content contains a client-specific palette");
  return errors;
}

export function validateSupersededDoctrine(content: string): string[] {
  const patterns = [
    /Clerk is (?:the )?(?:canonical|required|preferred)/i,
    /Prisma is (?:the )?(?:canonical|required|preferred)/i,
    /Norfolk Kit is (?:the )?(?:canonical|source of truth)/i,
    /Norfolk Manual is (?:the )?(?:canonical|source of truth)/i,
    /(?:large binary (?:masters?|files?)|large files?|masters?)\s+(?:belong|live|are stored)\s+in\s+(?:the\s+)?(?:repository|git)\b/i
  ];
  return patterns.filter((pattern) => pattern.test(content)).map((pattern) => `superseded current doctrine matched ${pattern}`);
}

export function validateImportedAdr(body: string, record: { sourceBodySha256?: string; sourceDate?: string }): string[] {
  const errors: string[] = [];
  const actual = createHash("sha256").update(body).digest("hex");
  if (actual !== record.sourceBodySha256) errors.push("imported ADR body differs from source hash");
  if (record.sourceDate && !body.includes(record.sourceDate)) errors.push("imported ADR date differs from source date");
  return errors;
}
