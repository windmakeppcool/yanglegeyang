import { _decorator, Component, JsonAsset, Node } from 'cc';
import { Match3ZiUE } from './Match3ZiUE';
import { SpriteFramesCfg } from '../../../auto/SpriteFramesCfg';
import { JsonsCfg } from '../../../auto/JsonCfg';
import { ZiStack } from './ZiStack';
import { ResLoader } from '../../../core/modules/res/ResLoader';
const { ccclass, property } = _decorator;

@ccclass('Match3UI')
export class Match3UI extends Component {
    @property(Node) private board: Node = null!;

    private m_ZiList: Match3ZiUE[] = [];
    private stacks: ZiStack[][] = [];

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
            let ziCol = clicZi.col;
            let ziRow = clicZi.row;
            this.removeZi(clicZi);
            // 目前表现是先销毁
            clicZi.node.destroy();
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

    onDestroy() {
    }
}
