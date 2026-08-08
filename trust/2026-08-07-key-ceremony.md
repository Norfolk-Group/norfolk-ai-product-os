# Trusted release key ceremony — 2026-08-07

## Scope

This ceremony established the first trusted Ed25519 signing identity for private Norfolk AI Product OS releases. It did not authorize, build, or publish a release.

## Custody and identity

- Owner: Norfolk AI
- Private-key system of record: Doppler project `norfolk-ai-product-os`, config `prd`
- Restricted secret identifier: `PRODUCT_OS_TRUSTED_PRIVATE_KEY`
- GitHub environment: `product-os-release`, restricted to `main`
- Doppler service account: `norfolk-product-os-release` (`8b45b541-2ffa-4a0e-adb2-796142de81f2`)
- Doppler service identity: `github-product-os-release` (`c45a067b-324a-49a8-b9f5-1afdb13934fc`)
- OIDC audience: `https://github.com/Norfolk-Group`
- OIDC subject: `repo:Norfolk-Group@275303183/norfolk-ai-product-os@1323608872:environment:product-os-release`
- Access-token lifetime: 900 seconds
- Static Doppler API tokens: none

## Public identity

- Algorithm: Ed25519
- Public key: `trust/product-os-release-public-key.pem`
- SPKI DER SHA-256: `bbb53e2c1af53b57b02caa19d73bd8bfb1bd779a1317df9acee08fa7e1e8ae58`

The public key was derived from the ceremony private key. Only the public half and this non-secret evidence are proposed for repository review.

## Validation and closure

- GitHub Actions run `31235841731` successfully exchanged the protected environment's immutable OIDC subject for temporary Doppler access and fetched the restricted config.
- The diagnostic then failed closed at the separate, expected WorkOS staging-credential gate; no provider action or release occurred.
- The temporary human Doppler CLI token used for ceremony administration was revoked.
- Local private-key generation material was destroyed after the restricted Doppler save and OIDC access test.
- Exact private/public matching remains enforced in the trusted release job before any artifact or GitHub release can be created.

## Rotation and revocation

Rotation requires another reviewed ceremony that creates new Doppler trust material and updates the committed public key in the same change. Before merging, the replacement key must be validated through the protected GitHub OIDC path. The prior key remains authoritative until that reviewed change merges.

Emergency revocation disables or deletes the Doppler service identity and revokes any temporary human CLI token used for ceremony administration. A replacement key must never reuse candidate-local or previously distributed private material.

## Recovery

There is no private-key export or repository backup. If the restricted Doppler secret is lost or suspected compromised, revoke the service identity, perform a new ceremony, and publish a new reviewed public key. Existing bundles remain verifiable with the public key embedded in their release evidence.
