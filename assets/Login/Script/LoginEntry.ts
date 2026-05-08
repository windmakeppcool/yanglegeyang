import { _decorator, AudioSource, Component, instantiate, UITransform } from 'cc';
import { G_VIEW_SIZE } from '../../boost';
import { ResManager } from '../../fw/res/ResManager';
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
            ResManager.getInstance().loadAudioClip("Match3BN", "Audio/background", autioClip => {
                if (!autioClip) {
                    console.error("background 为空");
                    return;
                }
                let audioSource = this.node.addComponent(AudioSource);
                audioSource.clip = autioClip;
                audioSource.loop = true;
                audioSource.play();
            });
        }, 1)
    }

    update(deltaTime: number) {
        
    }
}
