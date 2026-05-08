import { _decorator, Component, assetManager, js, Canvas, AssetManager } from 'cc';
const { ccclass, property } = _decorator;

@ccclass('boost')
export class boost extends Component {
    @property(Canvas) private canvas2d: Canvas = null!;

    private loadBundle(bundleName: string): Promise<AssetManager.Bundle | null> {
        return new Promise<AssetManager.Bundle | null>(rs => {
            assetManager.loadBundle(bundleName, (e, asset) => {
                if (e) {
                    console.error(`Bundle ${bundleName} 加载失败:`, e);
                    rs(null);
                    return;
                }
                rs(asset);
            });
        })
    }

    async start() {
        try {
            /** 加载全局脚本包 */
            const bundle = await this.loadBundle("GScriptBN");
            if (!bundle) {
                console.error("GScriptBN Bundle 加载失败，游戏无法启动");
                return;
            }
            const gCtrClass = js.getClassByName("GCtr") as typeof Component;
            if (!gCtrClass) {
                console.error("无法找到 GCtr 类");
                return;
            }
            const gCtr = this.node.addComponent(gCtrClass);
            await (gCtr as any).init({ canvas2d: this.canvas2d });
        } catch (error) {
            console.error("游戏启动失败:", error);
        }
    }

    update(deltaTime: number) {
        
    }

     
}

