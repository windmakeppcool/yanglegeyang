import { _decorator, Asset, AssetManager, assetManager, AudioClip, Constructor, Prefab } from 'cc';
const { ccclass, property } = _decorator;

@ccclass('ResManager')
export class ResManager {

    // loadPrefab(bundleName: string, prefabPath: string, cb: (prefab: Prefab | null) => void) {
    //     assetManager.loadBundle(bundleName, (e, bundle) => {
    //         if (e || !bundle) {
    //             console.error(`Bundle ${bundleName} 加载失败:`, e);
    //             cb(null);
    //             return;
    //         }
    //         bundle.load(prefabPath, Prefab, (err, prefab: Prefab) => {
    //             if (err) {
    //                 console.error(err);
    //                 cb(null);
    //                 return;
    //             }
    //             cb(prefab)
    //         })
    //     })
    // }

    // loadPrefabByBUrl(bUrl: IBundleUrl, cb: (prefab: Prefab | null) => void) { 
    //     this.loadPrefab(bUrl.b, bUrl.l, cb); 
    // }

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

    // loadAudioByBUrl(bUrl: IBundleUrl, cb: (audioClip: AudioClip | null) => void) { 
    //     this.loadAudioClip(bUrl.b, bUrl.l, cb); 
    // }

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

    loadBundleAsync(bundleName: string): Promise<AssetManager.Bundle | null> {
        return new Promise<AssetManager.Bundle | null>(rs => {
            this.loadBundle(bundleName, rs);
        })
    }

    loadAssetAsync<T extends Asset>(bUrl: IBundleUrl, type: Constructor<T> | null): Promise<T | null> {
        return new Promise<T | null>(rs => {
            assetManager.loadBundle(bUrl.b, (e, bundle) => {
                if (e || !bundle) {
                    console.error(`Bundle ${bUrl.b} 加载失败:`, e);
                    rs(null);
                    return;
                }
                const onLoaded = (err: any, asset: T) => {
                    if (err || !asset) {
                        console.error(err);
                        rs(null);
                        return;
                    }
                    rs(asset);
                };
                if (type) {
                    bundle.load(bUrl.l, type, onLoaded);
                } else {
                    (bundle.load as any)(bUrl.l, onLoaded);
                }
            })
        })
    }

}
