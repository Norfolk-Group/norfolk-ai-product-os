import { createHash } from "node:crypto";
import { readdir, readFile } from "node:fs/promises";
import path from "node:path";

const ignoredDirectories = new Set([".git", "node_modules", "coverage"]);

export function normalizeText(value: string): string {
  return value.replace(/\r\n?/gu, "\n").normalize("NFC");
}

export function stableTextHash(value: string): string {
  return createHash("sha256").update(normalizeText(value), "utf8").digest("hex");
}

export async function listFiles(root: string, extension?: string): Promise<string[]> {
  const output: string[] = [];

  async function walk(directory: string): Promise<void> {
    for (const entry of await readdir(directory, { withFileTypes: true })) {
      if (entry.isDirectory() && ignoredDirectories.has(entry.name)) continue;
      const absolute = path.join(directory, entry.name);
      if (entry.isDirectory()) await walk(absolute);
      else if (!extension || entry.name.endsWith(extension)) output.push(absolute);
    }
  }

  await walk(root);
  return output.sort((left, right) => left.localeCompare(right, "en"));
}

export async function readNormalized(file: string): Promise<string> {
  return normalizeText(await readFile(file, "utf8"));
}

export function safeRepositoryPath(value: string): boolean {
  if (!value || path.isAbsolute(value) || value.includes("\\")) return false;
  const normalized = path.posix.normalize(value);
  return normalized !== ".." && !normalized.startsWith("../") && normalized === value;
}
