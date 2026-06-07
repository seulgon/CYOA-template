# 나레이터 이미지 요구사항

이 문서는 대체역사 CYOA의 다섯 조력자/나레이터 이미지를 어떤 단위로 준비해야 하는지 정의한다. 현재 게임 흐름은 `INTRO`, `INTRO_STORY`, `WORLD_SETUP`, `CYOA_STORY`, `CYOA_BUILD`, `REWARD_STORY`, `REWARD_SELECT`, `LOCATION_CUTSCENE`, `CHARACTER_SHEET` 단계로 나뉘며, 나레이터 이미지는 특히 프롤로그, 조력자 선택, 주요 선택 구간, 보상/엔딩에서 반복 사용된다.

## 나레이터 목록

| id | 이름 | 성향 | 메인 컬러 | 이미지 방향 |
| --- | --- | --- | --- | --- |
| `angel` | 천사 | 평화, 구원, 세계시민적 목표 | 금색 | 성스러운 빛, 흰색/금색 의장, 부드러운 표정 |
| `devil` | 악마 | 파괴, 독재, 반인륜적 목표 | 붉은색 | 붉은 조명, 날카로운 실루엣, 유혹적이거나 위압적인 표정 |
| `mountain_spirit` | 산신령 | 패권, 국운, 거대한 역사 변화 | 옥색 | 산, 안개, 신령한 옥빛, 고대적 위엄 |
| `vengeful_spirit` | 원령 | 개인/국가의 원한 청산 | 남색 | 차가운 어둠, 원혼의 기운, 슬픔과 분노가 섞인 표정 |
| `super_ai` | 초지능 AI | 기술 발전, 문명 건설, 역사 시뮬레이션 | 청록색 | 홀로그램, 회로, 관측자적 시선, 비인간적 안정감 |

## 우선 제작해야 할 공통 세트

각 나레이터마다 최소 6종을 준비한다. 총 30장이다.

| suffix | 사용 상태 | 용도 | 권장 구도 |
| --- | --- | --- | --- |
| `portrait_neutral` | 조력자 선택 카드, 요약 화면 | 기본 식별 이미지 | 세로형 반신 또는 흉상 |
| `intro_offer` | `INTRO_STORY` | 미지의 공간에서 계약을 제안하는 첫 등장 | 와이드 컷신, 정면 또는 3/4 구도 |
| `selected_contract` | `WORLD_SETUP` 완료 직후, `CYOA_STORY` | 플레이어가 해당 조력자를 선택한 후 계약 성립 | 손짓, 서명, 문장, 계약서, 빛/불꽃/홀로그램 등 |
| `quest_explain` | `CYOA_BUILD` 진입 전후 | 주요 목표와 서브 퀘스트를 설명 | 배경에 지도, 연표, 전장, 도시, 데이터 패널 등 |
| `reward_judgement` | `REWARD_STORY`, `REWARD_SELECT` | 역사 개변 완료 후 평가와 보상 제시 | 내려다보거나 심판하는 구도 |
| `ending_result` | `LOCATION_CUTSCENE`, 최종 정리 | 엔딩/최종 요약용 | 플레이어의 선택 결과를 상징하는 넓은 배경 |

## 선택 상태별 추가 표정 세트

가능하면 각 나레이터마다 3종을 추가한다. 총 15장이다.

| suffix | 사용 조건 | 용도 |
| --- | --- | --- |
| `pleased` | 플레이어가 나레이터 성향에 맞는 선택을 많이 했을 때 | 긍정 반응, 보상 강화, 칭찬 |
| `displeased` | 나레이터 성향과 어긋난 선택을 많이 했을 때 | 경고, 비꼼, 보상 감소 암시 |
| `critical` | 포인트 부족, 제약 과다, 모순된 빌드, 파국적 역사 개변 | 강한 경고 또는 특수 이벤트 |

## 상태별 배경 이미지

나레이터가 없는 순수 배경도 필요하다. 이것은 5명 공통으로 재사용한다.

| id | 사용 상태 | 설명 |
| --- | --- | --- |
| `void_crossroads` | `INTRO_STORY` 첫 프레임 | 사용자가 떨어진 알 수 없는 미지의 공간 |
| `five_contractors` | `INTRO_STORY` 또는 `WORLD_SETUP` | 다섯 존재가 동시에 모습을 드러내는 단체 컷 |
| `timeline_archive` | 국가와 시대 선택 | 연표, 지도, 역사 기록 보관소 느낌의 배경 |
| `identity_vessel` | 빙의 신분 및 대상 선택 | 몸, 가문, 신분, 혈통을 고르는 의식적 공간 |
| `trip_method_gate` | 트립 방식 선택 | 빙의/환생/각성/전이를 상징하는 네 갈래 문 |
| `boon_vault` | 특전, 아이템, 동료 선택 | 보상과 자원이 진열된 초월적 창고 |
| `penalty_seal` | 제약 및 패널티 선택 | 봉인, 족쇄, 저주, 계약 조항을 상징 |
| `history_changed` | 역사 개변 완료 후 보상 | 바뀐 역사가 펼쳐지는 엔딩 배경 |

## 조력자 선택 카드 이미지

현재 `WorldSetup`은 단일 선택 카드 UI로 조력자를 고르기 좋다. 이 단계에는 각 조력자의 `portrait_neutral`을 카드 이미지로 사용한다.

권장 파일 경로:

```text
public/assets/images/narrators/angel/portrait_neutral.webp
public/assets/images/narrators/devil/portrait_neutral.webp
public/assets/images/narrators/mountain_spirit/portrait_neutral.webp
public/assets/images/narrators/vengeful_spirit/portrait_neutral.webp
public/assets/images/narrators/super_ai/portrait_neutral.webp
```

## 컷신 이미지 파일명 규칙

와이드 컷신 이미지는 같은 이름에 `_wide`를 붙인다. 모바일용을 따로 만들 경우 `_mobile`을 붙인다.

```text
public/assets/images/narrators/{narrator_id}/{suffix}.webp
public/assets/images/narrators/{narrator_id}/{suffix}_wide.webp
public/assets/images/narrators/{narrator_id}/{suffix}_mobile.webp
```

예시:

```text
public/assets/images/narrators/angel/intro_offer_wide.webp
public/assets/images/narrators/devil/reward_judgement_wide.webp
public/assets/images/narrators/super_ai/quest_explain_wide.webp
```

## 최소 구현 범위

첫 구현에서 반드시 필요한 것은 다음 13장이다.

1. 조력자 선택 카드: `portrait_neutral` 5장
2. 선택 후 계약 컷신: `selected_contract_wide` 5장
3. 공통 프롤로그 배경: `void_crossroads` 1장
4. 다섯 존재 단체 컷: `five_contractors` 1장
5. 국가와 시대 선택 공통 배경: `timeline_archive` 1장

이 13장만 있어도 프롤로그와 조력자 선택, 국가/시대 선택 진입까지는 새 쵸아 정체성이 선명해진다. 이후 본게임 선택지가 늘어나면 `quest_explain`, `reward_judgement`, `ending_result`, 추가 표정 세트를 순서대로 확장한다.

## 생성 프롬프트 공통 기준

- 같은 나레이터는 얼굴, 의상, 상징물, 색상 팔레트가 모든 이미지에서 유지되어야 한다.
- 카드 이미지는 세로형 중심 구도, 컷신 이미지는 와이드 배경 포함 구도로 만든다.
- 나레이터는 역사 속 특정 실존 인물이 아니라 초월적 계약자처럼 보여야 한다.
- 국가/시대 선택지는 너무 특정 시대에 고정된 배경보다 지도, 연표, 기록 보관소처럼 범용성이 높은 이미지가 좋다.
- 색상은 문서의 메인 컬러를 기준으로 하되, UI 전체가 한 색으로만 보이지 않도록 보조색과 명암 대비를 둔다.
