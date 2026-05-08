import { instantiate, UITransform, Canvas, Layers, Node, Size, ResolutionPolicy, view, screen } from 'cc';
import { EViewLayer } from './EViewLayer';
import { Match3UI } from '../../../GamePlay/Modules/Match3/Match3UI';
import { BL } from '../res/ResConst';
import { ResManager } from '../res/ResManager';
// import { G_VIEW_SIZE } from 'db://assets/Boost/boost';


const g_UICls2BUrl = new Map<any, IBundleUrl>();
/** 注册接口 */
function setUIClassBUrl(uiClass: any, bUrl: IBundleUrl) {
    return g_UICls2BUrl.set(uiClass, bUrl);
}

/** 获取接口 */
function getUIClassBUrl(uiClass: any): IBundleUrl | void {
    return g_UICls2BUrl.get(uiClass);
}

g_UICls2BUrl.set(Match3UI, BL("Match3UI", "Match3BN"));

export const G_VIEW_SIZE = new Size(0, 0);
function adapterScreen() { 
        let resolutionPolicy: ResolutionPolicy = view.getResolutionPolicy();
        let designSize = view.getDesignResolutionSize();
        let frameSize = screen.windowSize;
        let frameW = frameSize.width;
        let frameH = frameSize.height;
        /** 是否是屏幕更宽 */
        const isScreenWidthLarger = (frameW / frameH) > (designSize.width / designSize.height);
        let targetResolutionPolicy = isScreenWidthLarger ? ResolutionPolicy.FIXED_HEIGHT : ResolutionPolicy.FIXED_WIDTH;
        if (targetResolutionPolicy !== resolutionPolicy.getContentStrategy().strategy) {
            /** 保证设计分辨率的内容都能显示出来 */
            view.setDesignResolutionSize(designSize.width, designSize.height, targetResolutionPolicy);
            view.emit("canvas-resize");
        }
        /** 实际的尺寸会和设计分辨率在一个维度，但是宽或高更大 */
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
    private static _instance: UIManager = null!;
    private m_Canvas: Canvas = null!;
    private m_Layers: MyLayer[] = [];

    init(canvas: Canvas) {
        this.m_Canvas = canvas;
        adapterScreen();
        for (let layer = EViewLayer.Scene, maxLayer = EViewLayer.Toast; layer <= maxLayer; layer++) {
            this.m_Layers.push(new MyLayer(layer, canvas, EViewLayer[layer]));
        }
    }

    static getInstance(): UIManager {
        if (!this._instance) {
            this._instance = new UIManager();
        }
        return this._instance;
    }

    private constructor() {
        
    }

    open(uiClass: any) {
        const bUrl = getUIClassBUrl(uiClass);
        if (!bUrl) {
            return;
        }
        ResManager.getInstance().loadPrefabByBUrl(bUrl, prefab => {
            let Match3Node = instantiate(prefab)!;
            this.m_Layers[EViewLayer.UI].node.addChild(Match3Node);
            Match3Node.getComponent(UITransform).setContentSize(G_VIEW_SIZE.clone());
        })
    }

}


