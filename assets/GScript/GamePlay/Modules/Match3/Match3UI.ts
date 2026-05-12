import { _decorator, Component, instantiate, Node, Prefab } from 'cc';
import { PrefabCfg } from '../../../auto/PrefabCfg';
import { Match3ZiUE } from './Match3ZiUE';
import { ResLoader } from '../../../core/modules/res/ResLoader';
const { ccclass, property } = _decorator;


@ccclass('Match3UI')
export class Match3UI extends Component {

    // private m_ResLoader: ResLoader = null!;

    async start() {
        console.log("主玩法界面");
        // this.m_ResLoader = new ResLoader();
        // await this.m_ResLoader.load();

        const resLoader = new ResLoader().autoRelease(this);
        resLoader.addUI(Match3ZiUE);
        await resLoader.load();

        let ziUE = gCtr.ui.instantiate(Match3ZiUE);
        if (!ziUE) {
            console.error("无法获取 Match3ZiUE 组件");
            return;
        }
        ziUE.node.setParent(this.node);
        ziUE.init();
    }

    onDestroy() {
        // resLoader.releaseResRef();  
    }
}


