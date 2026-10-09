# Agent notes — visitor-counter

## Documentation conventions

| ID | Acceptance criterion | Expectation |
| --- | --- | --- |
| DOC-1 | Language of acceptance criteria | Always write acceptance criteria in English (tables and prose). |

## Public project IDs / counter URLs

| ID | Acceptance criterion | Expectation |
| --- | --- | --- |
| PID-1 | Public counter URLs | Project IDs appear in user-facing links (`?id=…`) and are short and readable — not UUIDs. |
| PID-2 | ID generation | IDs are generated with a cryptographically strong generator (e.g. `nanoid`), a URL-safe alphanumeric alphabet, and a fixed short length (currently **10**). |
| PID-3 | Uniqueness | Uniqueness is enforced by the DB primary key; on collision, regenerate and retry — never silently overwrite. |
| PID-4 | Internal IDs | View / internal row IDs may remain UUIDs if they never appear in public links. |
| PID-5 | No regression | Do not reintroduce UUIDs or other long opaque IDs for public project links without updating this document. |
