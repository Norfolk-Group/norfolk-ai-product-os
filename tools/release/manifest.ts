import { createHash, sign, verify, type KeyLike } from "node:crypto";

export interface ReleaseFile { path: string; sha256: string; sensitivity: "client-safe" | "norfolk-only" }
export interface SignedManifest { manifest: Record<string, unknown>; signature: string; algorithm: "Ed25519"; keyId: string }

export function sha256(value: string | Uint8Array): string { return createHash("sha256").update(value).digest("hex"); }

export function canonicalJson(value: unknown): string {
  if (value === null || typeof value !== "object") return JSON.stringify(value);
  if (Array.isArray(value)) return `[${value.map(canonicalJson).join(",")}]`;
  return `{${Object.entries(value as Record<string, unknown>).sort(([a], [b]) => a.localeCompare(b)).map(([key, item]) => `${JSON.stringify(key)}:${canonicalJson(item)}`).join(",")}}`;
}

export function signManifest(manifest: Record<string, unknown>, privateKey: KeyLike, keyId: string): SignedManifest {
  return { manifest, signature: sign(null, Buffer.from(canonicalJson(manifest)), privateKey).toString("base64"), algorithm: "Ed25519", keyId };
}

export function verifyManifest(bundle: SignedManifest, publicKey: KeyLike): boolean {
  if (bundle.algorithm !== "Ed25519") return false;
  return verify(null, Buffer.from(canonicalJson(bundle.manifest)), publicKey, Buffer.from(bundle.signature, "base64"));
}

export function validateManifestFiles(files: ReleaseFile[]): string[] {
  const errors: string[] = [];
  const seen = new Set<string>();
  for (const file of files) {
    if (seen.has(file.path)) errors.push(`duplicate path ${file.path}`); else seen.add(file.path);
    if (!/^[0-9a-f]{64}$/.test(file.sha256)) errors.push(`${file.path}: invalid sha256`);
    if (file.path.startsWith("/") || file.path.includes("..")) errors.push(`${file.path}: unsafe path`);
  }
  return errors;
}
