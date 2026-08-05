---
title: XLSX output
status: accepted
tier: CONTRACT
owner: Product OS Owner
lastVerified: 2026-08-05
---

# XLSX

XLSX preserves every requested filter, selection, column, sort, locale, unit, precision, and date basis. A visible context sheet records them. Values remain typed; displayed rounding never changes authoritative precision. Formulas are governed and auditable. User-controlled cells beginning with `=`, `+`, `-`, or `@` are rejected or safely escaped to prevent formula injection. Wide data uses frozen identifiers, filters, sensible widths, wrap, and separate sheets—never hidden truncation.
