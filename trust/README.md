# Trusted release key

Trusted Product OS releases use an Ed25519 key whose private half is held outside GitHub and obtained only through Doppler OIDC during the protected release job.

`trust/product-os-release-public-key.pem` is deliberately absent. It may be added only through a separately reviewed key ceremony that records ownership, rotation, recovery, and the Doppler key identifier. Its absence intentionally blocks publication. Candidate-local keys prove candidate integrity only and must never be promoted or reused.
