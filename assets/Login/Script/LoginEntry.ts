import { _decorator, AudioSource, Component, instantiate, UITransform } from 'cc';
import { G_VIEW_SIZE } from '../../boost';
import { ResManager } from '../../fw/res/ResManager';
import { AudioManager } from '../../fw/audio/audioManager';
import { LoginAudio } from './LoginAudio';
const { ccclass, property } = _decorator;

@ccclass('LoginEntry')
export class LoginEntry extends Component {
    start() {
        // 加载背景音乐后播放
        AudioManager.getInstance().playMusic(LoginAudio.bgm);

        this.autoLogin();
    }

    update(deltaTime: number) {
        
    }

    autoLogin() {
        this.scheduleOnce(() => {
            this.onLoginSuccess();
        }, 1);
    }

    async onLoginSuccess() {
        await ResManager.getInstance().loadBundleAsync("Match3BN");
        let match3Entry  = this.node.addComponent("Match3Entry");
        (match3Entry as any ).init();
    }
}
