import { BL } from "../core/modules/res/ResConst";


export class SpriteFramesCfg {
    static pai = (key: string | number) => BL(
        `SpriteFrames/pai/${key}/spriteFrame`, "Match3BN"
    );
}