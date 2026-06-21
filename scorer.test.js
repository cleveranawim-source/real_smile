import { test } from 'node:test';
import assert from 'node:assert/strict';
import {
  buildBlendshapeMap, computeScores, gradeFor, faceRoll,
} from './scorer.js';
import { CONFIG } from './config.js';

// 가짜 미소: 입만 활짝, 눈/볼은 거의 안 움직임
const FAKE = [
  { categoryName: 'mouthSmileLeft', score: 0.9 },
  { categoryName: 'mouthSmileRight', score: 0.9 },
  { categoryName: 'eyeSquintLeft', score: 0.05 },
  { categoryName: 'eyeSquintRight', score: 0.05 },
  { categoryName: 'cheekSquintLeft', score: 0.05 },
  { categoryName: 'cheekSquintRight', score: 0.05 },
];
// 진짜(뒤센): 입 + 눈/볼 함께, 좌우 대칭
const REAL = [
  { categoryName: 'mouthSmileLeft', score: 0.85 },
  { categoryName: 'mouthSmileRight', score: 0.85 },
  { categoryName: 'eyeSquintLeft', score: 0.8 },
  { categoryName: 'eyeSquintRight', score: 0.8 },
  { categoryName: 'cheekSquintLeft', score: 0.8 },
  { categoryName: 'cheekSquintRight', score: 0.8 },
];
// 478점 중 눈 바깥 코너(33, 263)만 쓰므로 그 부분만 채운 더미 landmark
function levelLandmarks() {
  const a = new Array(478).fill(null).map(() => ({ x: 0.5, y: 0.5, z: 0 }));
  a[33] = { x: 0.4, y: 0.5, z: 0 };
  a[263] = { x: 0.6, y: 0.5, z: 0 }; // 같은 y → roll ~ 0
  return a;
}

test('buildBlendshapeMap: categoryName→score 맵', () => {
  const m = buildBlendshapeMap(FAKE);
  assert.equal(m.mouthSmileLeft, 0.9);
  assert.equal(m.eyeSquintLeft, 0.05);
});

test('가짜 미소: 입 높고 눈 낮음, 총점은 100과 거리가 멀다', () => {
  const r = computeScores(FAKE, levelLandmarks(), CONFIG);
  assert.ok(r.mouth >= 80, `mouth=${r.mouth}`);
  assert.ok(r.eye <= 20, `eye=${r.eye}`);
  // 깐깐 기본값(40/30/30, 가산식)에서 대칭적 가짜 미소는 ~61점.
  // 눈(40점)을 통째로 못 받는 게 핵심. 더 짜게 하려면 weights.eye를 키운다.
  assert.ok(r.total < 70, `total=${r.total}`);
});

test('진짜 뒤센 미소: 총점이 높다(>=80)', () => {
  const r = computeScores(REAL, levelLandmarks(), CONFIG);
  assert.ok(r.eye >= 70, `eye=${r.eye}`);
  assert.ok(r.total >= 80, `total=${r.total}`);
});

test('진짜 미소 총점 > 가짜 미소 총점', () => {
  const real = computeScores(REAL, levelLandmarks(), CONFIG).total;
  const fake = computeScores(FAKE, levelLandmarks(), CONFIG).total;
  assert.ok(real > fake, `real=${real} fake=${fake}`);
});

test('좌우 비대칭이면 대칭 점수가 낮아진다', () => {
  const asym = [
    { categoryName: 'mouthSmileLeft', score: 0.9 },
    { categoryName: 'mouthSmileRight', score: 0.2 },
    { categoryName: 'eyeSquintLeft', score: 0.8 },
    { categoryName: 'eyeSquintRight', score: 0.2 },
    { categoryName: 'cheekSquintLeft', score: 0.8 },
    { categoryName: 'cheekSquintRight', score: 0.2 },
  ];
  const symAsym = computeScores(asym, levelLandmarks(), CONFIG).symmetry;
  const symReal = computeScores(REAL, levelLandmarks(), CONFIG).symmetry;
  assert.ok(symAsym < symReal, `asym=${symAsym} real=${symReal}`);
});

test('faceRoll: 수평 눈이면 0에 가깝다', () => {
  assert.ok(Math.abs(faceRoll(levelLandmarks())) < 0.05);
});

test('counted: 입을 거의 안 벌리면 false', () => {
  const neutral = [
    { categoryName: 'mouthSmileLeft', score: 0.02 },
    { categoryName: 'mouthSmileRight', score: 0.02 },
  ];
  assert.equal(computeScores(neutral, levelLandmarks(), CONFIG).counted, false);
});

test('gradeFor: 경계값 매핑', () => {
  assert.equal(gradeFor(95, CONFIG.grades), '진짜 미소 마스터');
  assert.equal(gradeFor(75, CONFIG.grades), '햇살 미소');
  assert.equal(gradeFor(0, CONFIG.grades), '미소 워밍업');
});
