import { _decorator, Component, instantiate, JsonAsset, Node, Prefab } from 'cc';
import { Match3ZiUE } from './Match3ZiUE';
import { ResLoader } from '../../../core/modules/res/ResLoader';
import { SpriteFramesCfg } from '../../../auto/SpriteFramesCfg';
import { JsonsCfg } from '../../../auto/JsonCfg';
import { ZiStack } from './ZiStack';
const { ccclass, property } = _decorator;


@ccclass('Match3UI')
export class Match3UI extends Component {
    @property(Node) private board: Node = null!;

    private m_ZiList: Match3ZiUE[] = [];
    private stacks: ZiStack[] = [];

    static R(loader: ResLoader) {
        loader.addUI(Match3ZiUE);
        for (let i = 1; i <= 30; i++) {
            loader.addSpriteFrame(SpriteFramesCfg.pai(`pai-${i}`));
        }
    }

    addZi(ziUE: Match3ZiUE) {
        // 加到数组
        this.m_ZiList.push(ziUE);
        // 加到棋子栈
        for (let r = 0; r < 6; r++) {
            for (let c = 0; c < 6; c++) {
                this.stacks[ziUE.row + r][ziUE.col + c].push(ziUE);
            }
        }
    }

    /** 判断是否可点击 */
    calcClickable(ziUE: Match3ZiUE): boolean {
        let stack: ZiStack = null;
        for (let r = 0; r < 6; r++) {
            for (let c = 0; c < 6; c++) {
                stack = this.stacks[ziUE.row + r][ziUE.col + c];
                if (!stack.empty && stack.top !== ziUE) {
                    // 有一个棋子栈顶部不是该棋子，说明被遮挡，不可点击
                    return false;
                }
            }
        }
        return true;
    }
    

    async start() {
        console.log("主玩法界面");
        // 初始化栈数据
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

        levelJson.zis.forEach(zi => {
            let ziUE = gCtr.ui.instantiate(Match3ZiUE);
            if (!ziUE) {
                console.error("无法获取 Match3ZiUE 组件");
                return;
            }
            ziUE.node.setParent(this.board);
            ziUE.init(zi[0], zi[1], zi[2]);
            ziUE.node.setPosition(zi[0] * 17, zi[1] * 20);
            ziUE.setDisplay(zi[2]);
        })

        // 初始化可点击状态
        this.m_ZiList.forEach(ziUE => {
            ziUE.setClickable(this.calcClickable(ziUE));
        })
        
    }

    onDestroy() {
        // resLoader.releaseResRef();  
    }
}


