function clamp01(x) { return Math.max(0, Math.min(1, x)); }
function avg(arr) { return arr.reduce((a, b) => a + b, 0) / arr.length; }

export function buildBlendshapeMap(categories) {
  const map = {};
  for (const c of categories || []) map[c.categoryName] = c.score;
  return map;
}

// 눈둘레근: eyeSquint + cheekSquint 평균
export function eyeScore(bs, cfg) {
  const raw = avg([
    bs.eyeSquintLeft || 0, bs.eyeSquintRight || 0,
    bs.cheekSquintLeft || 0, bs.cheekSquintRight || 0,
  ]) * cfg.sensitivity.eyeGain;
  return clamp01(Math.pow(clamp01(raw), cfg.sensitivity.eyeGamma));
}

// 큰광대근: mouthSmile 평균
export function mouthScore(bs, cfg) {
  const raw = avg([bs.mouthSmileLeft || 0, bs.mouthSmileRight || 0]) * cfg.sensitivity.mouthGain;
  return clamp01(Math.pow(clamp01(raw), cfg.sensitivity.mouthGamma));
}

// 좌우 대칭 + 얼굴 수평
export function symmetryScore(bs, rollRad, cfg) {
  const diff = avg([
    Math.abs((bs.mouthSmileLeft || 0) - (bs.mouthSmileRight || 0)),
    Math.abs((bs.eyeSquintLeft || 0) - (bs.eyeSquintRight || 0)),
    Math.abs((bs.cheekSquintLeft || 0) - (bs.cheekSquintRight || 0)),
  ]);
  const balance = clamp01(1 - diff * cfg.sensitivity.symmetryStrength);
  const tilt = clamp01(1 - Math.min(Math.abs(rollRad) / cfg.sensitivity.maxRollRad, 1));
  // balance 비중을 크게(2:1)
  return clamp01((balance * 2 + tilt) / 3);
}

// 눈 바깥 코너(MediaPipe 478 mesh: left=33, right=263) 각도로 roll 추정
export function faceRoll(landmarks) {
  if (!landmarks || landmarks.length < 264 || !landmarks[33] || !landmarks[263]) return 0;
  const l = landmarks[33], r = landmarks[263];
  return Math.atan2(r.y - l.y, r.x - l.x);
}

export function computeScores(categories, landmarks, cfg) {
  const bs = buildBlendshapeMap(categories);
  const eye = eyeScore(bs, cfg);
  const mouth = mouthScore(bs, cfg);
  const sym = symmetryScore(bs, faceRoll(landmarks), cfg);
  const w = cfg.weights;
  const total = Math.round(w.eye * eye + w.mouth * mouth + w.symmetry * sym);
  const mouthRaw = ((bs.mouthSmileLeft || 0) + (bs.mouthSmileRight || 0)) / 2;
  return {
    eye: Math.round(eye * 100),
    mouth: Math.round(mouth * 100),
    symmetry: Math.round(sym * 100),
    total: Math.max(0, Math.min(100, total)),
    counted: mouthRaw >= cfg.minMouthSmileToCount,
  };
}

export function gradeFor(total, grades) {
  for (const g of grades) if (total >= g.min) return g.label;
  return grades[grades.length - 1].label;
}
