import { _decorator, Component, Node, instantiate, UITransform } from 'cc';
import { ResManager } from '../../../core/modules/res/ResManager';
import { G_VIEW_SIZE } from '../../../core/modules/ui/UIManager';
const { ccclass, property } = _decorator;


@ccclass('Match3Entry')
export class Match3Entry extends Component {
    async init() {
        ResManager.getInstance().loadPrefab("Match3BN", "Match3UI", prefab => {
            if (!prefab) {
                console.error("Match3UI 为空");
                return;
            }
            let match3Node = instantiate(prefab);
            this.node.addChild(match3Node);
            match3Node.getComponent(UITransform).setContentSize(G_VIEW_SIZE.clone());
        })
    }

    start() {

    }

    update(deltaTime: number) {
        
    }
}


