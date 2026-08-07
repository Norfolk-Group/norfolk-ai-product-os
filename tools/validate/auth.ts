type R = Record<string, unknown>;
const requiredJourneys = ["login","logout","open-entry","invite-valid","invite-expired","invite-revoked","invite-used","email-verification","mfa-enrollment","mfa-challenge","organization-selection","sso-required","no-authorized-organization","organization-switch","recovery","locked-user","disabled-user","access-denied","session-expired","callback-failure","return-to-intent"];

export function validateAuthExperience(value: unknown): string[] {
  const root = value as R;
  const errors: string[] = [];
  if (!(["open", "invite-only"] as unknown[]).includes(root.entryMode)) errors.push("entry mode must be open or invite-only");
  if (root.entryMode === "invite-only" && root.openSignupEnabled !== false) errors.push("invite-only entry mode must disable open signup");
  if (root.entryMode === "open" && root.openSignupEnabled !== true) errors.push("open entry mode must enable signup");
  const states = new Map(((root.states as R[]) ?? []).map((state) => [state.id, state]));
  for (const id of requiredJourneys) {
    const state = states.get(id) as R | undefined;
    if (!state) { errors.push(`missing auth state ${id}`); continue; }
    for (const field of ["owner","copyOwner","recovery","keyboard","screenReader","slowNetwork","reducedMotion"]) {
      if (typeof state[field] !== "string" || !String(state[field]).trim()) errors.push(`${id} missing ${field}`);
    }
  }
  return errors;
}

export function isSafeReturnIntent(value: string, allowlist: string[]): boolean {
  let decoded: string;
  try { decoded = decodeURIComponent(value); } catch { return false; }
  if (!decoded.startsWith("/") || decoded.startsWith("//") || /^(?:[a-z]+:|\\)/i.test(decoded)) return false;
  if (decoded.includes("//") || decoded.includes("\\") || /[\u0000-\u001f]/.test(decoded)) return false;
  const origin = "https://return-intent.invalid";
  let path: string;
  try { path = new URL(decoded, origin).pathname; } catch { return false; }
  return allowlist.some((prefix) => {
    let allowed: string;
    try { allowed = new URL(prefix, origin).pathname; } catch { return false; }
    return path === allowed || path.startsWith(`${allowed}/`);
  });
}

export function validateAuthSecurity(value: unknown): string[] {
  const r = value as R; const errors: string[] = [];
  for (const field of ["stateBound","nonceBound","pkce","exactCallbackOrigin","sessionRotation","revocation","csrf","replayProtection","rateLimits","redactedLogs"]) if (r[field] !== true) errors.push(`auth security requires ${field}`);
  const cookie = (r.cookie ?? {}) as R;
  if (cookie.httpOnly !== true) errors.push("cookie must be HttpOnly");
  if (cookie.secure !== true) errors.push("cookie must be Secure");
  if (cookie.sameSite !== "lax" && cookie.sameSite !== "strict") errors.push("cookie needs restrictive SameSite");
  if (cookie.path !== "/") errors.push("cookie path must be explicit");
  return errors;
}
