import { instantiate, UITransform, Canvas, Layers, Node, Size, ResolutionPolicy, view, screen, js, Component, Prefab, Constructor, assetManager } from 'cc';
import { EViewLayer } from './EViewLayer';
import { ResManager } from '../res/ResManager';
import { ResLoader } from '../res/ResLoader';


const g_UICls2BUrl = new Map<any, IBundleUrl>();
const g_Key2BUrl = new Map<string, IBundleUrl>();

export function registerBUrlByCfg(cfg:{
    [uiClassName: string]: IBundleUrl
}) {
    for (let uiClassName in cfg) {
        g_Key2BUrl.set(uiClassName, cfg[uiClassName]);
    }
}

function setUIClassBUrl(uiClass: any, bUrl: IBundleUrl) {
    return g_UICls2BUrl.set(uiClass, bUrl);
}

export function getUIClassBUrl(uiClass: any): IBundleUrl | null {
    if (!uiClass) {
        return null;
    }
    if (g_UICls2BUrl.has(uiClass)) {
        return g_UICls2BUrl.get(uiClass)!;
    }
    let uiClassName: string;
    if (typeof uiClass === 'string') {
        uiClassName = uiClass;
    } else {
        uiClassName = js.getClassName(uiClass);
    }
    // let bUrl = PrefabCfg[uiClassName];
    let bUrl = g_Key2BUrl.get(uiClassName);

    if (!bUrl) {
        console.error(`UI 类 ${uiClassName} 未配置 PrefabCfg`);
        return null;
    }
    g_UICls2BUrl.set(uiClass, bUrl);

    return bUrl;
}

export const G_VIEW_SIZE = new Size(0, 0);

function adapterScreen() { 
    let resolutionPolicy: ResolutionPolicy = view.getResolutionPolicy();
    let designSize = view.getDesignResolutionSize();
    let frameSize = screen.windowSize;
    let frameW = frameSize.width;
    let frameH = frameSize.height;
    const isScreenWidthLarger = (frameW / frameH) > (designSize.width / designSize.height);
    let targetResolutionPolicy = isScreenWidthLarger ? ResolutionPolicy.FIXED_HEIGHT : ResolutionPolicy.FIXED_WIDTH;
    if (targetResolutionPolicy !== resolutionPolicy.getContentStrategy().strategy) {
        view.setDesignResolutionSize(designSize.width, designSize.height, targetResolutionPolicy);
        view.emit("canvas-resize");
    }
    if (isScreenWidthLarger) {
        G_VIEW_SIZE.width = Math.ceil(designSize.height * frameSize.width / frameSize.height);
        G_VIEW_SIZE.height = designSize.height;
    } else {
        G_VIEW_SIZE.width = designSize.width;
        G_VIEW_SIZE.height = Math.ceil(designSize.width * frameSize.height / frameSize.width);
    }
    console.log(`屏幕${isScreenWidthLarger ? "更宽, 高度适配" : "更高, 宽度适配"} 设计分辨率比例下的屏幕尺寸: ${G_VIEW_SIZE.width}x${G_VIEW_SIZE.height}`);
    return isScreenWidthLarger;
}  

class MyLayer {
    public readonly node: Node;
    constructor(
        public readonly layer: EViewLayer,
        public readonly canvas: Canvas,
        name: string,
    ) {
        const node = this.node = new Node(name);
        node.layer = Layers.Enum.UI_2D;
        node.addComponent(UITransform);
        canvas.node.addChild(node);
    }
}

export class UIManager {
    private m_Canvas: Canvas = null!;
    private m_Layers: MyLayer[] = [];
    private m_ResManager: ResManager = new ResManager();

    init(canvas: Canvas) {
        this.m_Canvas = canvas;
        adapterScreen();
        for (let layer = EViewLayer.Scene, maxLayer = EViewLayer.Toast; layer <= maxLayer; layer++) {
            this.m_Layers.push(new MyLayer(layer, canvas, EViewLayer[layer]));
        }
    }

    // open(uiClassOrName: any) {
    //     let uiClass = uiClassOrName;
    //     if (typeof uiClassOrName === 'string') {
    //         uiClass = js.getClassByName(uiClassOrName);
    //     }
    //     const bUrl = getUIClassBUrl(uiClass);
    //     if (!bUrl) {
    //         console.error(`无法找到 UI 类 ${uiClassOrName} 的 Bundle 配置`);
    //         return;
    //     }
    //     this.m_ResManager.loadPrefabByBUrl(bUrl, prefab => {
    //         if (!prefab) {
    //             console.error(`加载 UI Prefab 失败: ${bUrl.b}/${bUrl.l}`);
    //             return;
    //         }
    //         let uiNode = instantiate(prefab)!;
    //         this.m_Layers[EViewLayer.UI].node.addChild(uiNode);
    //         uiNode.getComponent(UITransform).setContentSize(G_VIEW_SIZE.clone());
    //     })
    // }

    async openc<UI extends Component>(uiClass: Constructor<UI>): Promise<UI> {
        const resLoader = new ResLoader();
        resLoader.addUI(uiClass);
        await resLoader.load();
        let ui = this.instantiate(uiClass);
        this.m_Layers[EViewLayer.UI].node.addChild(ui.node);
        ui.node.getComponent(UITransform).setContentSize(G_VIEW_SIZE.clone());
        resLoader.autoRelease(ui);
        return ui;
    }

    instantiate<UE extends Component>(ueClass: Constructor<UE>): UE {
        let bUrl = getUIClassBUrl(ueClass);
        if (!bUrl) {
            console.error(`无法找到 UI 类 ${ueClass.name} 的 Bundle 配置`);
            return null!;
        }
        let bundle = assetManager.getBundle(bUrl.b);
        if (!bundle) {
            console.error(`Bundle ${bUrl.b} 未加载`);
            return null!;
        }
        let prefab: Prefab | null = bundle.get(bUrl.l, Prefab);
        if (!prefab) {
            console.error(`加载 UI Prefab 失败: ${bUrl.b}/${bUrl.l}`);
            return null!;
        }
        let node: Node = instantiate(prefab)!;
        return (node.getComponent(ueClass as any) || node.addComponent(ueClass as any)) as any as UE;
    }

    // async loadBundleAndOpen(bundleName: string, uiClassName: string) {
    //     const bundle = await this.m_ResManager.loadBundleAsync(bundleName);
    //     if (!bundle) {
    //         console.error(`Bundle ${bundleName} 加载失败`);
    //         return;
    //     }
    //     this.open(uiClassName);
    // }


}
