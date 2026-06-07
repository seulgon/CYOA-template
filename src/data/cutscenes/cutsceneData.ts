export interface DialogueChoice {
    label: string;       // 버튼에 표시할 텍스트
    value?: string;      // 선택 결과 식별값 (App.tsx 분기용)
    tags?: string[];     // 선택 시 캐릭터에게 부여할 태그
    skipToEnd?: boolean; // true면 다음 스텝으로 가는 대신 스토리 즉시 종료
}

export interface Dialogue {
    name: string;
    text: string;
    choices?: DialogueChoice[]; // 있으면 클릭 대신 선택지 UI 표시
}

export interface CutsceneFrame {
    backgroundImage: string;
    dialogues: Dialogue[];
}

export interface CutsceneData {
    frames: CutsceneFrame[];
    nextSceneId?: string;
}

export const CUTSCENE_DATA: Record<string, CutsceneData> = {
    PROLOGUE_STORY: {
        frames: [
            {
                backgroundImage: "./assets/images/backgrounds/timeline_map_clock_room_4k.webp",
                dialogues: [
                    { name: "나레이션", text: "어느날 눈을 떠보니 시공간의 틈에 빠져들었고," },
                    { name: "나레이션", text: "그런 나를 발견하고 멀리서 다섯 빛 덩어리가 다가온다." }
                ]
            }
        ]
    },
    INTRO_STORY: {
        frames: [
            {
                backgroundImage: "./assets/images/intro/violet_intro.webp",
                dialogues: [
                    { name: "???", text: "어머, 드디어 오셨군요. 당신이 오기를 기다리고 있었답니다." },
                    { name: "???", text: "혹시 나만의 CYOA를 만들어보고 싶으신가요? UI와 뼈대가 잘 작동하는지 보고 싶으시다고요?" },
                    { name: "???", text: "그런 개발자이자 창작자분을 기다리고 있었답니다." },
                    { name: "???", text: "이 템플릿이 어떻게 구성되어 있고, 어떤 UI 기능들을 제공하는지 알고 싶으신가요?" },
                    { name: "???", text: "갑자기 템플릿 소개라니 뜬금없다고요?" },
                    { name: "???", text: "먼저 제 소개를 해야겠군요." }
                ]
            },
            {
                backgroundImage: "./assets/images/intro/violet_offer.webp",
                dialogues: [
                    { name: "바이올렛", text: "저는 바이올렛이라고 합니다. 이 템플릿의 가이드이자 여러분의 테스트를 도와줄 도우미이지요." },
                    { name: "바이올렛", text: "이 프로젝트는 HTML, CSS, React + TypeScript 기반으로 세련되게 디자인된 템플릿이랍니다." },
                    { name: "바이올렛", text: "기존의 복잡한 이세계 판타지 콘텐츠는 잠시 걷어내고, UI와 작동 뼈대만 깔끔하게 남겨두었지요." },
                    { name: "바이올렛", text: "제가 직접 템플릿의 각 단계를 돌며 화면 레이아웃, 포인트 계산 시스템, 스탯 분배 및 실시간 데이터 바인딩 등 다양한 동작 원리를 친절하게 안내해 드릴게요. 이 텍스트는 대사가 매우 길어졌을 때 대화창의 세로 높이가 자동으로 예쁘게 확장되면서 글자를 잘림 없이 시원하게 다 보여주는지 테스트하기 위해 일부러 길게 작성된 안내문이랍니다. 대사가 늘어나면 대화창 영역이 세로로 확장되는 모습을 직접 관찰해 보세요! 다 읽으셨다면 대화창 바깥 배경을 클릭해서 다음 대사로 넘어가시면 됩니다." },
                    { name: "바이올렛", text: "어떻게 테스트를 진행하냐고요?" }
                ]
            },
            {
                backgroundImage: "./assets/images/intro/violet_holy.webp",
                dialogues: [
                    { name: "바이올렛", text: "직접 흐름을 따라가며 이름 입력, 단일 선택(Single-select), 다중 선택(Multi-select) UI를 체험해볼 수 있습니다." },
                    { name: "바이올렛", text: "이 모든 과정은 상단의 포인트 차감, 스탯 가산, 획득 태그, 그리고 최종 시트에 실시간으로 연동된답니다." },
                    { name: "바이올렛", text: "개발 중에 UI 디자인이나 반응형 애니메이션이 어떻게 깎였는지 한눈에 확인할 수 있지요." },
                    { name: "바이올렛", text: "그럼, 템플릿 가이드 투어를 시작해 보시겠어요?" },
                    {
                        name: "바이올렛",
                        text: "자, 준비가 되셨다면 투어를 시작해 볼까요?",
                        choices: [
                            {
                                label: "시작할래",
                                value: "accept",
                                skipToEnd: true
                            },
                            {
                                label: "나갈래",
                                value: "decline"
                            }
                        ]
                    }
                ]
            },
            {
                backgroundImage: "./assets/images/intro/violet_greeting.webp",
                dialogues: [
                    { name: "바이올렛", text: "그렇군요. 아쉽지만, 억지로 시작할 수는 없지요." },
                    { name: "바이올렛", text: "언제든 템플릿 구경이 필요하시면 저는 또 여기 있을 테니까요. 그럼 잘 지내세요." },
                    { name: "바이올렛", text: "후훗... 그럼 이만 실례할게요. 좋은 하루 되세요." }
                ]
            }
        ]
    },
    CYOA_STORY: {
        frames: [
            {
                backgroundImage: "./assets/images/intro/violet_cyoa.webp",
                dialogues: [
                    { name: "바이올렛", text: "기초적인 프로필 입력이 끝났군요! 이제 본격적인 템플릿 본문 선택지 화면을 체험할 차례입니다." },
                    { name: "바이올렛", text: "본게임 빌드 화면(CYOA_BUILD)에서는 카드 형태로 구성된 선택지 UI를 만나보실 수 있습니다." },
                    { name: "바이올렛", text: "카드를 고르면 우측 상단의 포인트가 실시간으로 깎이고, 캐릭터 스탯이 실시간으로 증가하거나 감소합니다." },
                    { name: "바이올렛", text: "자, 마음에 드는 선택지를 고르고 템플릿의 인터랙티브한 반응을 직접 테스트해 보세요!" }
                ]
            }
        ]
    },
    LOCATION_CUTSCENE: {
        frames: [
            {
                backgroundImage: "./assets/images/intro/violet_goal.webp",
                dialogues: [
                    { name: "바이올렛", text: "축하합니다! 이로써 템플릿의 모든 설정과 선택 단계를 정상적으로 마치셨군요." },
                    { name: "바이올렛", text: "다음 화면에서는 당신이 선택한 테마, 스탯, 태그들이 깔끔하게 요약된 '캐릭터 시트' UI를 보실 수 있습니다." },
                    { name: "바이올렛", text: "최종 결과물은 브라우저의 로컬 스토리지에 세이브되거나 파일(JSON)로 내보내어 보관할 수 있습니다." }
                ]
            },
            {
                backgroundImage: "./assets/images/intro/violet_failure.webp",
                dialogues: [
                    { name: "바이올렛", text: "만약 빌드 중 포인트가 부족하거나 필수 선택 항목을 빠뜨렸다면, UI가 에러 상태를 시각적으로 잘 경고해 주었을 것입니다." },
                    { name: "바이올렛", text: "앞으로 이 뼈대에 당신만의 오리지널 콘텐츠와 이미지를 채워 넣기만 하면, 훌륭한 CYOA 게임이 완성될 거예요!" }
                ]
            },
            {
                backgroundImage: "./assets/images/intro/violet_greeting.webp",
                dialogues: [
                    { name: "바이올렛", text: "후훗, UI를 예쁘게 깎는 데 공들인 만큼 아주 세련되고 부드러운 전환 효과를 느끼셨길 바래요." },
                    { name: "바이올렛", text: "앞으로 창작자님의 멋진 CYOA 프로젝트가 이 템플릿을 통해 널리 퍼져나가기를 진심으로 기대하겠습니다." },
                    { name: "바이올렛", text: "그럼 제 안내는 여기까지입니다. 엔딩 컷씬을 마치고 캐릭터 시트 결과를 확인해 보세요. 안녕히!" }
                ]
            }
        ]
    },
    REWARD_STORY: {
        frames: [
            {
                backgroundImage: "./assets/images/intro/violet_offer.webp",
                dialogues: [
                    { name: "바이올렛", text: "훌륭한 빌드로 본게임 테스트를 마치셨군요!" },
                    { name: "바이올렛", text: "선택한 카드들의 칭호, 장비 아이템, 스탯 변동 내용이 최종 시트에 기록될 준비를 마쳤습니다." },
                    { name: "바이올렛", text: "하지만 그냥 마무리하면 아쉽겠죠? 템플릿에는 추가 보상이나 기획 시나리오를 선택하는 기능도 구현되어 있답니다." },
                    { name: "바이올렛", text: "이 보상 선택 단계는 여러 개의 시나리오/특전을 겹쳐서 선택할 수 있는 다중 선택(Multi-select) UI의 모범 사례입니다." },
                    { name: "바이올렛", text: "자, 템플릿의 마지막 다중 선택 UI를 테스트하러 가볼까요?" }
                ]
            }
        ]
    }
};
