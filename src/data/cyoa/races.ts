import type { Section } from '../../types/cyoa';

export const raceSection: Section = {
    id: "race",
    title: "템플릿 본문 선택지 및 스탯/포인트 시스템 예시",
    description: "이 화면은 본격적으로 포인트를 소비하고 스탯이 변동하는 본문 선택지 UI입니다. 카드를 선택하면 실시간으로 포인트가 차감되고 스탯이 반영되는 것을 볼 수 있습니다.",
    type: "single",
    required: true,
    choices: [
        {
            id: "human",
            name: "인간",
            description: "어디에나 있고 무엇이든 될 수 있는, 가장 다루기 쉬운 '백지' 같은 존재예요. 당신의 무한한 가능성을 실험해보기에 이보다 좋은 재료가 있을까요?",
            comment: "어디에나 있고 무엇이든 될 수 있는, 가장 다루기 쉬운 '백지' 같은 존재예요. 당신의 무한한 가능성을 실험해보기에 이보다 좋은 재료가 있을까요?",
            cost: 0,
            stats: { POW: 1, SEN: 1, CON: 1, INT: 1, WIL: 1, CHA: 1 },
            tags: ["인간", "다재다능"],
            image: "./assets/images/races/human.webp"
        },
        {
            id: "elf",
            name: "엘프",
            description: "아름답고 고결한, 숲의 사랑을 듬뿍 받은 아이들이랍니다. 섬세한 마력을 다루는 솜씨는 일품이지만, 그만큼 쉽게 부서질 수 있으니 조심히 다뤄야 해요.",
            comment: "아름답고 고결한, 숲의 사랑을 듬뿍 받은 아이들이랍니다. 섬세한 마력을 다루는 솜씨는 일품이지만, 그만큼 쉽게 부서질 수 있으니 조심히 다뤄야 해요.",
            cost: 20,
            stats: { POW: -2, SEN: 2, INT: 2, CHA: 2 },
            tags: ["엘프", "마력친화"],
            image: "./assets/images/races/elf.webp"
        },
        {
            id: "dwarf",
            name: "드워프",
            description: "대지의 심장처럼 단단하고 정교한 손재주를 가진 이들이에요. 조금 고집스럽긴 해도, 그 투박한 진심만큼은 이 세계에서 가장 신뢰할 만하답니다.",
            comment: "대지의 심장처럼 단단하고 정교한 손재주를 가진 이들이에요. 조금 고집스럽긴 해도, 그 투박한 진심만큼은 이 세계에서 가장 신뢰할 만하답니다.",
            cost: 20,
            stats: { POW: 2, SEN: -1, CON: 2, WIL: 2, CHA: -1 },
            tags: ["드워프", "장인정신"],
            image: "./assets/images/races/dwarf.webp"
        },
        {
            id: "beastkin",
            name: "수인",
            description: "야생의 본능 and 예민한 감각을 지닌, 생명력 넘치는 종족이죠. 그 거칠고 유연한 육체로 세상을 활보하는 모습... 정말이지 야성적인 매력이 넘치지 않나요?",
            comment: "야생의 본능 and 예민한 감각을 지닌, 생명력 넘치는 종족이죠. 그 거칠고 유연한 육체로 세상을 활보하는 모습... 정말이지 야성적인 매력이 넘치지 않나요?",
            cost: 20,
            stats: { POW: 2, SEN: 3, INT: -1 },
            tags: ["수인", "야생의_직감"],
            image: "./assets/images/races/beastkin.webp"
        },
        {
            id: "orc",
            name: "오크",
            description: "오직 투쟁과 파괴를 위해 태어난 승부사들이에요. 그 압도적인 무력과 단단한 육체라면, 어떤 가혹한 전장에서도 당신의 목숨을 굳건히 지켜줄 거예요.",
            comment: "오직 투쟁과 파괴를 위해 태어난 승부사들이에요. 그 압도적인 무력과 단단한 육체라면, 어떤 가혹한 전장에서도 당신의 목숨을 굳건히 지켜줄 거예요.",
            cost: 10,
            stats: { POW: 6, INT: -2, CON: 3, CHA: -3 },
            tags: ["오크", "투쟁심"],
            image: "./assets/images/races/orc.webp"
        },
        {
            id: "demonkin",
            name: "마인",
            description: "금기된 피가 흐르는, 저주받았으면서도 매혹적인 이들이죠. 세상의 따가운 눈총을 견뎌낼 각오만 있다면, 누구보다 강력한 권능이 당신의 손에 쥐어질 거랍니다.",
            comment: "금기된 피가 흐르는, 저주받았으면서도 매혹적인 이들이죠. 세상의 따가운 눈총을 견뎌낼 각오만 있다면, 누구보다 강력한 권능이 당신의 손에 쥐어질 거랍니다.",
            cost: 30,
            stats: { POW: 4, SEN: 2, CON: 4, CHA: -3 },
            tags: ["마인", "박해대상"],
            image: "./assets/images/races/demonkin.webp"
        },
        {
            id: "violet",
            name: "바이올렛",
            description: "그렇게나 저와 닮고 싶은건가요? 후훗, 살짝 기분이 나쁠 정도인걸요. 특별히 저와 같은 신체를 가질 기회를 드릴 테니, 제 미모를 동경하며 제발 집착을 그만둬 주세요.",
            comment: "그렇게나 저와 닮고 싶은건가요? 후훗, 살짝 기분이 나쁠 정도인걸요. 특별히 저와 같은 신체를 가질 기회를 드릴 테니, 제 미모를 동경하며 제발 집착을 그만둬 주세요.",
            cost: 0,
            stats: { CHA: 20 },
            tags: ["바이올렛", "초차원 방랑자"],
            image: "./assets/images/races/violet_race.webp",
            useFrame: true
        }
    ]
};
