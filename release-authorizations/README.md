# Release authorizations

Each trusted private publication requires one reviewed JSON record named for the release, such as `0.3.0.json`. The record binds an immutable candidate and manifest to the reviewed release-workflow commit, approver, trusted signing key, scope, and exact publication confirmation.

The authorization PR must contain only that record. Its first parent must equal `releaseWorkflowCommit`. Records are immutable and are not reusable. This directory intentionally contains no live authorization; adding one is a separate reviewed decision and does not itself run publication.
