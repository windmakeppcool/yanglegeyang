import { _decorator, Asset, Component, Constructor, Node, Prefab } from 'cc';
import { PrefabCfg } from '../../../auto/PrefabCfg';
import { getUIClassBUrl } from "../ui/UIManager";
import { DestoryHook } from './DestoryHook';
const { ccclass, property } = _decorator;




@ccclass('ResLoader')
export class ResLoader extends Component {
    /** 待加载的资源 */
    private toLoadAssets: {
        type: Constructor<Asset> | null,
        bUrl: IBundleUrl
    }[] = [];
    /** 已加载的资源 */
    private loadedAssets: Asset[] = [];
    /** 标记已调用释放资源接口 */
    private m_Released: boolean = false;

    addUI<UI extends Component>(uiClass: Constructor<UI>) {
        let prefabBUrl = getUIClassBUrl(uiClass);
        this.toLoadAssets.push({
            type: Prefab,
            bUrl: prefabBUrl!,
        });

        return this;
    }

    async load() {
        let toLoadPromises = this.toLoadAssets.map(toLoad => gCtr.res.loadAssetAsync(toLoad.bUrl, toLoad.type));
        let toLoadResults = await Promise.all(toLoadPromises);
        toLoadResults.forEach(assert => {
            // 资源加引用计数
            assert.addRef();
            if (!this.m_Released) {
                this.loadedAssets.push(assert);
            } else {
                assert.decRef(true);
            }
        })
    }

    /** 释放已加载资源的引用计数 */
    releaseResRef() {
        if (this.m_Released) return;
        this.m_Released = true;
        while (this.loadedAssets.length) {
            this.loadedAssets.pop().decRef(true);
        }
    }

    autoRelease(comp: Component) {
        comp.node.addComponent(DestoryHook).addHook(() => {
            this.releaseResRef();
        })
        return this;
    }
}


