import { instantiate, UITransform, Canvas, Layers, Node } from 'cc';
import { G_VIEW_SIZE } from '../../boost';
import { ResManager } from '../../fw/res/ResManager';
import { EViewLayer } from './EViewLayer';
import { Match3UI } from '../../Match3/script/Match3UI';
import { BL } from '../res/ResConst';

function getUIClassBUrl(uiClass: any): IBundleUrl | void {
    if (uiClass === Match3UI) {
        return BL("Match3UI", "Match3BN");
    }
    console.log(`未找到 UI 类 ${uiClass}`);
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

    Infinity(canvas: Canvas) {
        this.m_Canvas = canvas;
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


