import { _decorator, assetManager, AudioClip, Component, Node, Prefab} from 'cc';
const { ccclass, property } = _decorator;

@ccclass('ResManager')
export class ResManager extends Component {
    private static _instance: ResManager = null!;
    start() {

    }

    update(deltaTime: number) {
        
    }

    /** 获取单例的接口 */
    static getInstance() {
        if (this._instance === null) {
            this._instance = new ResManager();
        }
        return this._instance;
    }

    private constructor() {
        super();
    }

    loadPrefab(bundleName: string, prefabPath: string, cb: (prefab: Prefab | null) => void) {
        assetManager.loadBundle(bundleName, (e, bundle) => {
            bundle.load(prefabPath, Prefab, (err, prefab: Prefab) => {
                if (err) {
                    console.error(err);
                    cb(null);
                    return;
                }
                cb(prefab)
            })
        })
    }

    loadAudioClip(bundleName: string, audioPath: string, cb: (assert: AudioClip | null) => void) {
        assetManager.loadBundle(bundleName, (e, bundle) => {
            bundle.load(audioPath, AudioClip, (err, assert: AudioClip) => {
                if (err) {
                    console.error(err);
                    cb(null);
                    return;
                }
                cb(assert)
            })
        })
    }
}

