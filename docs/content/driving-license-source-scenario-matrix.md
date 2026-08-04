# Driving License Source-Scenario Matrix

This matrix enforces that no scenario relies solely on generic sources when a procedure-specific official source exists.

| Scenario | Primary Source ID | Supported Claims | Qualified Claims | Authority Confirmation | Action Link |
|---|---|---|---|---|---|
| `temporary-foreign-licence-use` | `codul-rutier` (Art. 83) | Foreign licence use validity; International Driving Permit (IDP) requirement for non-Latin script. | Duration of use depends on residency establishment (vague in practice without specific visa context). | None | None |
| `foreign-licence-exchange` | `dgpci-exchange`, `omai-163-2011` | Annex 1 eligibility, 89 RON fee, standard required documents. | Verification delays strictly depend on issuing state (Embassy/Direct). | **None** | None |
| `iranian-issued-licence` | `omai-163-2011` | Eligible for exchange without exam (Annex 1). | Processing time is variable, depends on Iranian Embassy verification. | **None** | None |
| `obtain-romanian-licence-from-scratch` | `dgpci-exam` | Requirements for medical, psychological testing, driving school, theory/practical exams. | None | None | None |
| `renew-romanian-licence` | `dgpci-renewal` | Medical certificate requirement, 89 RON fee, required documents. | None | None | None |
| `international-driving-permit` | `dgpci-idp` | 46 RON fee, up to 30 days processing, requires valid Romanian national licence. | None | None | None |
| `penalties-suspension-and-restrictions` | `codul-rutier` | General traffic penalties and suspensions. | None | None | None |

## Conclusion
All seven scenarios are mapped to explicit, procedure-specific official sources (DGPCI procedures or national legislation), eliminating reliance on generic homepage references.
