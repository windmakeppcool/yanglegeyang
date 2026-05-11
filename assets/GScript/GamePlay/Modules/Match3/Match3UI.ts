import { _decorator, Component, instantiate, Node, Prefab } from 'cc';
import { PrefabCfg } from '../../../auto/PrefabCfg';
import { Match3ZiUE } from './Match3ZiUE';
const { ccclass, property } = _decorator;


@ccclass('Match3UI')
export class Match3UI extends Component {
    async start() {
        console.log("主玩法界面");
        let prefab = await gCtr.res.loadAssetAsync(PrefabCfg.Match3ZiUE, Prefab);
        let ziNode: Node = instantiate(prefab);
        ziNode.setParent(this.node);
        let ziUE: Match3ZiUE = ziNode.getComponent(Match3ZiUE);
        if (!ziUE) {
            console.error("无法获取 Match3ZiUE 组件");
            return;
        }
        ziUE.init();
    }
}


