import { _decorator, Component, JsonAsset, Node, tween, Vec3 } from 'cc';
import { Match3ZiUE } from './Match3ZiUE';
import { SpriteFramesCfg } from '../../../auto/SpriteFramesCfg';
import { JsonsCfg } from '../../../auto/JsonCfg';
import { ZiStack } from './ZiStack';
import { ResLoader } from '../../../core/modules/res/ResLoader';
const { ccclass, property } = _decorator;

@ccclass('Match3UI')
export class Match3UI extends Component {
    @property(Node) private board: Node = null!;
    @property(Node) private collectArea: Node = null!;

    private m_IsLose: boolean = false;
    private m_ZiList: Match3ZiUE[] = [];
    private stacks: ZiStack[][] = [];
    private m_PlaceHolders: Match3ZiUE[] = [];

    static R(loader: ResLoader) {
        loader.addUI(Match3ZiUE);
        for (let i = 1; i <= 30; i++) {
            loader.addSpriteFrame(SpriteFramesCfg.pai(`pai-${i}`));
        }
    }

    addZi(ziUE: Match3ZiUE) {
        this.m_ZiList.push(ziUE);
        for (let r = 0; r < 6; ++r) {
            for (let c = 0; c < 6; ++c) {
                this.stacks[ziUE.row + r][ziUE.col + c].push(ziUE);
            }
        }
    }

    removeZi(ziUE: Match3ZiUE) {
        this.m_ZiList.splice(this.m_ZiList.indexOf(ziUE), 1);
        // 棋子栈栈顶肯定是该棋子
        for (let r = 0; r < 6; ++r) {
            for (let c = 0; c < 6; ++c) {
                this.stacks[ziUE.row + r][ziUE.col + c].pop();
            }
        }
    }

    calcClickable(ziUE: Match3ZiUE): boolean {
        let stack: ZiStack;
        for (let r = 0; r < 6; ++r) {
            for (let c = 0; c < 6; ++c) {
                stack = this.stacks[ziUE.row + r][ziUE.col + c];
                if (!stack.empty && stack.top !== ziUE) {
                    return false;
                }
            }
        }
        return true;
    }

    private tryCollectingZi(clickZi: Match3ZiUE) {
        // 已经有 7 个了，不让继续收集
        if (this.m_PlaceHolders.length === 7) {
            return false;
        }
        // 没有 7 个
        // 1.先从后往前找，看看有没有同花色的棋子，有的话，就插入
        for (let i = this.m_PlaceHolders.length - 1; i >= 0; i--) {
            let zi = this.m_PlaceHolders[i];
            if (zi.style === clickZi.style) {
                this.m_PlaceHolders.splice(i + 1, 0, clickZi);
                // 标记当前子是否和前面 2 个子形成了消除
                let elimination: Match3ZiUE[] = [];
                if (!zi.isMarkEliminate && (i >= 1) && (this.m_PlaceHolders[i - 1].style === clickZi.style) 
                    && !this.m_PlaceHolders[i - 1].isMarkEliminate) {
                    // 形成消除
                    elimination.push(zi);
                    elimination.push(this.m_PlaceHolders[i - 1]);
                    elimination.push(clickZi);
                    // 标记消除
                    elimination.forEach(it => it.isMarkEliminate= true);
                }
                clickZi.moveToTargetIndex(this.collectArea, i + 1, () => {
                    // 检测消除或者失败逻辑
                    if (elimination.length > 0) {
                        // 消除行为
                        elimination.forEach(it => {
                            this.m_PlaceHolders.splice(this.m_PlaceHolders.indexOf(it), 1);
                            it.node.destroy();
                        })
                    } else {
                        this.checkLose();
                    }
                    // TODO
                })
                // 后面的棋子如果正在做飞行动画，要改目标
                for (let j = i + 2; j < this.m_PlaceHolders.length; j++) {
                    this.m_PlaceHolders[j].changeMovingTargetIndex(j);
                }
                return true;
            }

        }
        // 2.找不到花色，那么直接插入
        this.m_PlaceHolders.push(clickZi);
        clickZi.moveToTargetIndex(this.collectArea, this.m_PlaceHolders.length - 1, () => {
            this.checkLose();
        })
        return true;
    }
    
    checkLose() {
        if (this.m_PlaceHolders.length < 7) return;
        for (let i = 0; i < this.m_PlaceHolders.length; i++) {
            if (this.m_PlaceHolders[i].isMarkEliminate) {
                return;
            }
        }
        
        if (this.m_IsLose) return;
        this.m_IsLose = true;
        console.log(`游戏失败弹窗`)
    }

    async start() {
        console.log("主玩法界面");
        const COL = 7;
        const ROW = 10;
        const SPLIT = 6;
        for (let r = 0, rmax = ROW * SPLIT; r < rmax; r++) {
            let row_stacks: ZiStack[] = [];
            this.stacks.push(row_stacks);
            for (let c = 0, cmax = COL * SPLIT; c < cmax; c++) {
                row_stacks.push(new ZiStack());
            }
        }

        let jsonAsset = await gCtr.res.loadAssetAsync(JsonsCfg.level(0), JsonAsset);
        const levelJson = jsonAsset.json as {
            zis: [col: number, row: number, style: number][]
        };

        let clickFunc = (clicZi: Match3ZiUE) => {
            let isClickable = this.calcClickable(clicZi);
            if (!isClickable) {
                return;
            }
            const isCollectFly = this.tryCollectingZi(clicZi);
            if (!isCollectFly) {
                return;
            }
            let ziCol = clicZi.col;
            let ziRow = clicZi.row;
            this.removeZi(clicZi);
            // 目前表现是移动到 collectArea 节点下
            clicZi.node.setParent(this.collectArea, true);
            tween(clicZi.node)
                .to(0.15, { position: new Vec3(0, 0, 0) })
                .start();

            // 下方刷新
            let stack: ZiStack = null!;
            for (let r = 0; r < 6; ++r) {
                for (let c = 0; c < 6; c++) {
                    stack = this.stacks[ziRow + r][ziCol + c];
                    if (!stack.empty) {
                        stack.top.setClickable(this.calcClickable(stack.top));
                    }
                }
            }
        }

        levelJson.zis.forEach(zi => {
            let ziUE = gCtr.ui.instantiate(Match3ZiUE);
            if (!ziUE) {
                console.error("无法获取 Match3ZiUE 组件");
                return;
            }
            ziUE.node.setParent(this.board);
            ziUE.init(zi[0], zi[1], zi[2], clickFunc);
            this.addZi(ziUE);
        })

        this.m_ZiList.forEach(ziUE => {
            ziUE.setClickable(this.calcClickable(ziUE));
        })
        
    }

}
