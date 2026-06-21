export const CONFIG = {
  // 채점 가중치 (합 100). 깐깐 모드: 눈 40 / 입 30 / 대칭 30
  weights: { eye: 40, mouth: 30, symmetry: 30 },

  // gain: 카메라 blendshape 원값이 낮게 잡히는 걸 보정(클수록 후함). gamma: 낮을수록 후함.
  sensitivity: { eyeGain: 1.5, eyeGamma: 0.7, mouthGain: 1.15, mouthGamma: 0.75, symmetryStrength: 0.9, maxRollRad: 0.3 },

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
