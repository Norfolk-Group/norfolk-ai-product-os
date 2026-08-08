# Provider readiness evidence — 2026-08-08

Sensitivity: Norfolk-only operational evidence. Publication: blocked. This record names only non-secret configuration outcomes and redacted GitHub Actions evidence; it does not contain credentials, provider values, signed URLs, client identifiers, or source masters.

## Release trust and Doppler path

The trusted private-release implementation is merged. Its reviewed signing identity is the Ed25519 public key at `trust/product-os-release-public-key.pem`, with non-secret ceremony evidence in `trust/2026-08-07-key-ceremony.md`. The protected `product-os-release` workflow path uses GitHub OIDC to obtain release-scoped material from Doppler; it does not fall back to a static Doppler token.

Post-merge repository quality passed in [GitHub Actions run `31246900501`](https://github.com/Norfolk-Group/norfolk-ai-product-os/actions/runs/31246900501).

## WorkOS structural readiness

The protected staging diagnostic passed in [GitHub Actions run `31246933868`](https://github.com/Norfolk-Group/norfolk-ai-product-os/actions/runs/31246933868). It verifies the configured structural WorkOS path and preserves only redacted diagnostic evidence. It does not prove an application's user-visible login journey.

Every adopting application retains a separate, required end-to-end staging-login gate: login, callback, sealed session, organization selection where applicable, logout, and safe return intent. Rotate the dedicated WorkOS diagnostic key before `2026-08-14`.

## R2 diagnostic readiness

The protected R2 diagnostic passed in [GitHub Actions run `31246933854`](https://github.com/Norfolk-Group/norfolk-ai-product-os/actions/runs/31246933854). It verifies redacted, temporary, scoped diagnostic access only.

This does not authorize source-master migration or preservation. Motion and other client/brand source masters remain in their current locations until a separately authorized preservation effort inventories the sources, writes immutable versioned objects to a Norfolk AI-controlled target, independently retrieves and checks each object, and leaves every original unmodified.
