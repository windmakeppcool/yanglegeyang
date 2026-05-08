import { _decorator, Component, Node, AudioSource, director } from 'cc';
import { ResManager } from '../res/ResManager';
const { ccclass, property } = _decorator;

@ccclass('AudioManager')
export class AudioManager extends Component {
    private static _instance: AudioManager = null!;
    /** AudioSource 挂载在此节点上 */
    private m_AttachNode: Node = null;
    /** AudioSource 组件 */
    private m_AudioSource: AudioSource = null;

    start() {

    }

    update(deltaTime: number) {
        
    }

    /** 获取单例的接口 */
    static getInstance() {
        if (this._instance === null) {
            this._instance = new AudioManager();
        }
        return this._instance;
    }

    private constructor() {
        super();
        // 私有化的构造函数
        this.m_AttachNode = director.getScene().getChildByName("Canvas");
        this.m_AudioSource = this.m_AttachNode.addComponent(AudioSource);
    }

    playMusic(bUrl: {
        b: string,
        l: string,
    }): void {
        gCtr.res.loadAudioClip(bUrl.b, bUrl.l, audioClip => {
            let audioSource = this.m_AudioSource;
            audioSource.clip = audioClip;
            audioSource.loop = true;
            audioSource.play();
        })
    }
}


