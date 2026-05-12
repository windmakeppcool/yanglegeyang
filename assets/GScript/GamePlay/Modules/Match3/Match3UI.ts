import { _decorator, Component, instantiate, Node, Prefab } from 'cc';
import { Match3ZiUE } from './Match3ZiUE';
import { ResLoader } from '../../../core/modules/res/ResLoader';
const { ccclass, property } = _decorator;


@ccclass('Match3UI')
export class Match3UI extends Component {
    static R(loader: ResLoader) {
        loader.addUI(Match3ZiUE);
    }

    async start() {
        console.log("主玩法界面");
        let ziArr = [
            [0, 0],
            [1, 1],
            [2, 2]
        ];
        ziArr.forEach(zi => {
            let ziUE = gCtr.ui.instantiate(Match3ZiUE);
            if (!ziUE) {
                console.error("无法获取 Match3ZiUE 组件");
                return;
            }
            ziUE.node.setParent(this.node);
            ziUE.init();
            ziUE.node.setPosition(zi[0] * 102, zi[1] * 120);
        })
        
    }

    onDestroy() {
        // resLoader.releaseResRef();  
    }
}


