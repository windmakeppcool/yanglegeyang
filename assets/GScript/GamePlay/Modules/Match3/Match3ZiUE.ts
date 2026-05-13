import { _decorator, Color, Component, Sprite, SpriteFrame } from 'cc';
import { SpriteFramesCfg } from '../../../auto/SpriteFramesCfg';
const { ccclass, property } = _decorator;

@ccclass('Match3ZiUE')
export class Match3ZiUE extends Component {

    @property(Sprite) private bg: Sprite = null!;
    @property(Sprite) private sprite: Sprite = null!;

    col: number = 0;
    row: number = 0;
    style: number = 0;

    private m_ClickFunc: (zi: Match3ZiUE) => any = null!;
    init(col: number, row: number, style: number, clickFunc: (zi: Match3ZiUE) => any){
        console.log("初始化 Match3ZiUE");
        this.col = col;
        this.row = row;
        this.style = style;
        this.m_ClickFunc = clickFunc;
        this.node.setPosition(col * 17, row * 20);
        this.setDisplay(style);
    }

    setDisplay(style: number) {
        let spriteFrame = gCtr.res.getAsset(SpriteFramesCfg.pai(`pai-${style}`), SpriteFrame);
        this.sprite.spriteFrame = spriteFrame;
    }

    /** 设置是否可点击（不可点击时变暗） */
    setClickable(bClickable: boolean) {
        this.bg.color = bClickable ? Color.WHITE :  new Color(120, 120, 120, 180);
        this.sprite.color = bClickable ? Color.WHITE :  new Color(120, 120, 120, 180);
    }

    click() {
        this.m_ClickFunc(this);
    }

    
}


