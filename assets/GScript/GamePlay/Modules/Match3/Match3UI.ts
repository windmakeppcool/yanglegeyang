import { _decorator, Component, instantiate, Node, Prefab } from 'cc';
import { Match3ZiUE } from './Match3ZiUE';
import { ResLoader } from '../../../core/modules/res/ResLoader';
import { SpriteFramesCfg } from '../../../auto/SpriteFramesCfg';
const { ccclass, property } = _decorator;


@ccclass('Match3UI')
export class Match3UI extends Component {
    @property(Node) private board: Node = null!;

    static R(loader: ResLoader) {
        loader.addUI(Match3ZiUE);
        for (let i = 1; i <= 30; i++) {
            loader.addSpriteFrame(SpriteFramesCfg.pai(`pai-${i}`));
        }
    }
    

    async start() {
        console.log("主玩法界面");
        let ziArr = [
            [0, 0],
            [6, 6],
            [12, 12]
        ];
        ziArr.forEach(zi => {
            let ziUE = gCtr.ui.instantiate(Match3ZiUE);
            if (!ziUE) {
                console.error("无法获取 Match3ZiUE 组件");
                return;
            }
            ziUE.node.setParent(this.board);
            ziUE.init();
            ziUE.node.setPosition(zi[0] * 17, zi[1] * 20);
            ziUE.setDisplay(1);
        })
        
    }

    onDestroy() {
        // resLoader.releaseResRef();  
    }
}


