import { _decorator, Component, Sprite, SpriteFrame } from 'cc';
import { SpriteFramesCfg } from '../../../auto/SpriteFramesCfg';
const { ccclass, property } = _decorator;

@ccclass('Match3ZiUE')
export class Match3ZiUE extends Component {

    @property(Sprite) private bg: Sprite = null!;
    @property(Sprite) private sprite: Sprite = null!;

    init() {
        console.log("初始化 Match3ZiUE");
    }

    setDisplay(style: number) {
        let spriteFrame = gCtr.res.getAsset(SpriteFramesCfg.pai(`pai-${style}`), SpriteFrame);
        this.sprite.spriteFrame = spriteFrame;
    }
}


