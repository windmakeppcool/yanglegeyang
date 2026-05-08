import { _decorator, Component, assetManager, Size, Canvas, AssetManager } from 'cc';
const { ccclass, property } = _decorator;
/** 
 * 画布的标准化尺寸，就是之前说的
 * iPad 设备中的画布尺寸 = 1001 x 1334 (其中 1001 ≈ 1668/1.6672)
 * iPhone16设备中的画布尺寸 = 750 x1626（其中 1626 = 2556/1.572）
 */
export const G_VIEW_SIZE = new Size(0, 0);

@ccclass('boost')
export class boost extends Component {
    @property(Canvas) private canvas2d: Canvas = null!;

    private loadBundle(bundleName: string): Promise<AssetManager.Bundle> {
        return new Promise<AssetManager.Bundle>(rs => {
            assetManager.loadBundle(bundleName, (e, asset) => {
                if (e) {
                    console.error(e);
                    rs(null)
                    return;
                }
                rs(asset);
            });
        })
    }

    async start() {
        /** 加载全局脚本包 */
        await this.loadBundle("GScriptBN");
        const gCtr: any = this.node.addComponent("GCtr");
        await gCtr.init({ canvas: this.canvas2d });

    }

    update(deltaTime: number) {
        
    }

     
}

