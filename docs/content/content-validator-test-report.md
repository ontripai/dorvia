# Content Validator Negative Test Report

## Test Scope
Tested `scripts/validateContent.ts` by passing a mocked content file (`run_negative_test.js`) intentionally containing the following violations:
- Foreign exchange marked medical not-required without qualification
- IDP scenario missing a dedicated source
- IDP fixed fee without source
- IDP fixed deadline without source
- FA/EN medical-condition mismatch
- FA/EN IDP source mismatch

## Execution Command
```bash
node run_negative_test.js
```

## Results
The validator successfully identified all violations:
```
Errors caught in EN:
- Foreign exchange marked medical not-required without qualification
- IDP scenario missing a dedicated source
- IDP fixed fee without source
- IDP fixed deadline without source
Parity Errors:
- FA/EN medical-condition mismatch: EN=not-required, FA=conditional
- FA/EN IDP source mismatch: EN=, FA=sourceId: 'dgpci-idp-wrong',sourceId: 'different-source'
```

## Conclusion
The `validateContent.ts` script successfully enforces the conditional medical rules, specific IDP source requirements, and strict FA/EN cross-locale parity.
