export const CONFIG = {
  // 채점 가중치 (합 100). 깐깐 모드: 눈 40 / 입 30 / 대칭 30
  weights: { eye: 40, mouth: 30, symmetry: 30 },

  // 정규화 곡선. gamma<1 이면 후하게, >1 이면 깐깐하게.
  sensitivity: { eyeGamma: 0.8, mouthGamma: 0.8, symmetryStrength: 1.2, maxRollRad: 0.3 },

  // 입을 최소한 이만큼은 벌려야 측정으로 인정(가만히 있는 얼굴 0점 방지)
  minMouthSmileToCount: 0.15,

  measureDurationMs: 5000,
  countdownSec: 3,

  leaderboardSize: 10,
  leaderboardKey: 'duchenne-contest-leaderboard-v1',

  // total >= min 인 첫 등급 채택(내림차순)
  grades: [
    { min: 90, label: '진짜 미소 마스터' },
    { min: 75, label: '햇살 미소' },
    { min: 60, label: '봄날 미소' },
    { min: 40, label: '새싹 미소' },
    { min: 0, label: '미소 워밍업' },
  ],
};
