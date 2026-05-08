import { _decorator, AssetManager, assetManager, AudioClip, Component, Node, Prefab} from 'cc';
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

    constructor() {
        super();
    }

    loadPrefab(bundleName: string, prefabPath: string, cb: (prefab: Prefab | null) => void) {
        assetManager.loadBundle(bundleName, (e, bundle) => {
            if (e || !bundle) {
                console.error(`Bundle ${bundleName} 加载失败:`, e);
                cb(null);
                return;
            }
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
    loadPrefabByBUrl(bUrl: IBundleUrl, cb: (prefab: Prefab | null) => void) { 
        this.loadPrefab(bUrl.b, bUrl.l, cb); 
    }

    loadAudioClip(bundleName: string, audioPath: string, cb: (assert: AudioClip | null) => void) {
        assetManager.loadBundle(bundleName, (e, bundle) => {
            if (e || !bundle) {
                console.error(`Bundle ${bundleName} 加载失败:`, e);
                cb(null);
                return;
            }
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
    loadAudioByBUrl(bUrl: IBundleUrl, cb: (audioClip: AudioClip | null) => void) { 
        this.loadAudioClip(bUrl.b, bUrl.l, cb); 
    }

    loadBundle(bundleName: string, cb?: (bundle: AssetManager.Bundle | null) => void) {
        assetManager.loadBundle(bundleName, (e, bundle) => {
            if (e) {
                console.error(`Bundle ${bundleName} 加载失败:`, e);
                cb && cb(null);
                return;
            }
            cb && cb(bundle);
        });
    }

    /**
     * 加载 Asset Bundle 接口
     * @param bundleName 
     * @returns 
     */
    loadBundleAsync(bundleName: string): Promise<AssetManager.Bundle> {
        return new Promise<AssetManager.Bundle>(rs => {
            this.loadBundle(bundleName, rs);
        })
    }

    
    
}

