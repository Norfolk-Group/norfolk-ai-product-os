# Trusted release key

Trusted Product OS releases use an Ed25519 key whose private half is held outside GitHub and obtained only through Doppler OIDC during the protected release job.

`trust/product-os-release-public-key.pem` is added only through a separately reviewed key ceremony that records ownership, rotation, recovery, the Doppler key identifier, and the public-key fingerprint. The current ceremony record is `trust/2026-08-07-key-ceremony.md`.

The private key remains a restricted Doppler secret and must never be committed, printed in workflow output, copied into GitHub secrets, or reused as a candidate-local key. Removing the committed public key intentionally blocks publication.
