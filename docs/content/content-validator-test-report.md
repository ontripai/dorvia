# Content Validator Negative Test Report

## Test Scope
Tested `scripts/validateContent.ts` by passing a mocked content file (`run_negative_test.js`) intentionally containing the following violations:
- Only three out of seven required scenarios
- Missing Iranian scenario
- Mismatched duplicate source IDs
- Unsupported fixed fee (no `sourceId`)
- Unsupported fixed timeline (no `sourceId`)
- Missing source reference

## Execution Command
```bash
node run_negative_test.js
```

## Results
The validator successfully identified all violations:
```
Errors caught:
- Duplicate source IDs found: dgpci-exchange
- Missing required scenario ID: iranian-issued-licence
- Missing required scenario ID: renew-romanian-licence
- Missing required scenario ID: international-driving-permit
- Missing required scenario ID: penalties-suspension-and-restrictions
- Fixed fee entry missing sourceId reference in block index 0
- Fixed timeline entry missing sourceId reference in block index 0
```

## Conclusion
The `validateContent.ts` script successfully enforces exactly seven scenarios, strict source citations for fixed metrics, and catches duplicate configurations.
