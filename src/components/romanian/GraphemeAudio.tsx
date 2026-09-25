/**
 * dre-p170: GraphemeAudio has been generalized into PronunciationAudio.tsx
 * to serve both alphabet pages (labelled variant) and core station pages (compact variant)
 * from a single component with module-level exclusive playback and lazy Audio construction.
 *
 * This file is maintained as a re-export for complete backward compatibility.
 */
export { PronunciationAudio, GraphemeAudio } from './PronunciationAudio';
export { default } from './PronunciationAudio';
