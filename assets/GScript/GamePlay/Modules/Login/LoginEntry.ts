import { _decorator, AudioSource, Component, instantiate, UITransform } from 'cc';
import { LoginAudio } from './LoginAudio';
import { ResManager } from '../../../core/modules/res/ResManager';
import { AudioManager } from '../../../core/modules/audio/audioManager';
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
