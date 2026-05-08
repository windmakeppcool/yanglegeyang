import { _decorator, AudioSource, Component, instantiate, UITransform } from 'cc';
import { G_VIEW_SIZE } from '../../boost';
import { ResManager } from '../../fw/res/ResManager';
import { AudioManager } from '../../fw/audio/audioManager';
const { ccclass, property } = _decorator;

@ccclass('LoginEntry')
export class LoginEntry extends Component {
    start() {
        this.scheduleOnce(() => {
            ResManager.getInstance().loadPrefab("Match3BN", "Match3UI", prefab => {
                if (!prefab) {
                    console.error("Match3UI 为空");
                    return;
                }
                let match3Node = instantiate(prefab);
                this.node.addChild(match3Node);
                match3Node.getComponent(UITransform).setContentSize(G_VIEW_SIZE.clone());
            });
            AudioManager.getInstance().playMusic({
                b: "Match3BN",
                l: "Audio/background",
            });
        }, 1)
    }

    update(deltaTime: number) {
        
    }
}
