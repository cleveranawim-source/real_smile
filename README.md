# 뒤센 미소 대회

카메라로 진짜 미소(뒤센 미소)를 측정하는 SEL 수업용 교실 키오스크 게임.

- 진짜 미소 = 입(큰광대근) + **눈(눈둘레근)** 이 함께 웃는 미소. 입만 웃어선 100점이 안 나온다.
- 모든 분석은 **기기 안(온디바이스)** 에서 처리. 카메라 영상은 업로드·저장되지 않는다.

## 바로 써보기

- 🌐 **https://smile.uzu.kr** — 폰·태블릿·노트북 어디서나 접속(카메라 허용)
- 📄 교사용 사용 안내: [guide.html](https://cleveranawim-source.github.io/real_smile/guide.html)
- 📱 접속 QR: `qr-smile.png` / `qr-smile.svg`

여러 학교·여러 기기가 **동시에 써도** 서로 영향이 없다(서버·계정 없음, 순위는 기기별로 따로).

## 로컬에서 직접 실행 (개발·수정용)

카메라(getUserMedia)는 보안 컨텍스트에서만 작동한다. **파일을 더블클릭(`file://`)하면 카메라가 안 켜진다.** 로컬 서버로 띄울 것.

```bash
cd ~/Claude/duchenne-contest
python3 -m http.server 8000
```

브라우저에서 `http://localhost:8000` 접속 → 카메라 권한 허용.

> 외부(다른 기기)에서도 쓰려면 https로 배포(Vercel/Netlify/GitHub Pages 등)하면 카메라가 작동한다.

## 채점 로직 테스트

```bash
npm test    # 또는: node --test
```

## 튜닝

점수가 너무 짜거나 후하면 `config.js`의 값만 조절한다.

- `weights` — 눈/입/대칭 배점(합 100)
- `sensitivity.eyeGain`, `mouthGain` — 클수록 후해짐(낮게 잡히는 원값 보정)
- `sensitivity.eyeGamma`, `mouthGamma` — 낮을수록 후해짐
- `sensitivity.symmetryStrength` — 높을수록 비대칭에 엄격
- `grades` — 등급 이름과 컷

## 라이선스

MIT — 자유롭게 쓰고 고쳐도 됩니다. ([LICENSE](LICENSE))
