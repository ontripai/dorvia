# Legal Operator Configuration

## Location
`src/lib/legalConfig.ts`

## Purpose
To centralise all legal entity information (Name, CUI, Address, Contact) into a single source of truth.

## Behaviour
- If the required fields in `legalOperatorConfig` are empty AND the environment is Production, the evaluation form will automatically disable itself.
- A neutral fallback message will display direct contact methods instead of allowing data collection without a controller identity.
