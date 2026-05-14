import { _decorator, Color, Component, Sprite, SpriteFrame, Vec3, Node } from 'cc';
import { SpriteFramesCfg } from '../../../auto/SpriteFramesCfg';
const { ccclass, property } = _decorator;


enum MovingType {
    // 无动画
    none = 0,
    // 从棋盘飞到收集区
    flying = 1,
    // 收集区调整位置
    adjusting = 2,
}

@ccclass('Match3ZiUE')
export class Match3ZiUE extends Component {

    @property(Sprite) private bg: Sprite = null!;
    @property(Sprite) private sprite: Sprite = null!;

    private m_MovingType: MovingType = MovingType.none;
    /** 移动到哪个目标 */
    private m_TargetPosition: Vec3 = new Vec3(0, 0, 0);
    /** 用平滑因子替换：二维的移动速度 */
    private m_SmoothFactor: number = 0.2;
    private m_FlyingCallback: Function  = null!;

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

    /** 调用此方法时，一定是从棋盘移动到收集区 */
    moveToTargetIndex(collectArea: Node, index: number, cb: Function) {
        if (this.m_MovingType !== MovingType.none) {
            debugger
        }
        this.m_MovingType = MovingType.flying;
        this.m_FlyingCallback = cb;
        // 目前表现是移动到 collectArea 节点下
        this.node.setParent(collectArea, true);
        /** 设置运动目标 */
        this.m_TargetPosition.set(index * 102, 0, 0);
        /** 开启调度控制飞行 */
        this.schedule(this.updateMoving, 0);
    }

    private updateMoving(dt: number) {
        let pos = this.node.position;
        // 到达目标位置
        if (Math.abs(this.m_TargetPosition.x - pos.x) + Math.abs(this.m_TargetPosition.y - pos.y) < this.m_SmoothFactor) {
            this.node.setPosition(this.m_TargetPosition.x, this.m_TargetPosition.y, pos.z);
            this.unschedule(this.updateMoving);
            let movingType = this.m_MovingType;
            this.m_MovingType = MovingType.none;
            if (movingType === MovingType.flying) {
                let flyingCallback = this.m_FlyingCallback;
                this.m_FlyingCallback = null;
                return flyingCallback();
            } else {
                return;
            }
        }
        this.node.setPosition(new Vec3(pos.x + (this.m_TargetPosition.x - pos.x) * this.m_SmoothFactor, pos.y + (this.m_TargetPosition.y - pos.y) * this.m_SmoothFactor, pos.z));
    }

    changeMovingTargetIndex(index: number) {
        /** 设置运动目标位置 */
        this.m_TargetPosition.set(index * 102, 0, 0);
        switch (this.m_MovingType) {
            case MovingType.none: {
                this.m_MovingType = MovingType.adjusting;
                /** 开启调度控制移动 */
                this.schedule(this.updateMoving, 0);
                break;
            }
            case MovingType.adjusting:
            case MovingType.flying: {
                // 在调整动画或者飞行的时候，又修改一次目标位置 -> 改目标位置即可（上方已执行）。
                break;
            }
        }
    }
}


