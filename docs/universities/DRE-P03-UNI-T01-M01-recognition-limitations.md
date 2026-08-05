# Recognition & Approval Limitations

**Task ID**: DRE-P03-UNI-T01-M01

The data architecture classifies universities using `recognitionStatus` to prevent applicants from mistakenly assuming a university is valid for returning to Iran to practise medicine.

## Status Classifications
1. `IRAN_MOH_APPROVED`
   Strictly enforced for Group 1 universities (UMFCD, UMFT, UMF Iasi, UMF Cluj). These are explicitly listed in the Iranian Ministry of Health directory for medical studies.
2. `GENERAL_POPULAR`
   Used for non-medical schools (e.g. UniBuc, UPB, ASE, RAU). These are accredited in the EU/Romania, but are not medical institutions subject to the strict MOH constraints.
3. `REQUIRES_CURRENT_RECHECK`
   Used for Titu Maiorescu. Although highly popular among some agents and applicants, it lacks guaranteed inclusion on the Iranian MOH approved list.

## Enforcement
The `validateUniversities` script explicitly checks that Titu Maiorescu is never labeled as `IRAN_MOH_APPROVED` and that it always has a `warningLevel` applied.

## UI Impact
Universities with `warningLevel !== 'none'` (like Titu Maiorescu) trigger amber styling in the `UniversityCard` and a dedicated warning section on the Homepage. This prevents the platform from inadvertently endorsing unverified medical pathways.
