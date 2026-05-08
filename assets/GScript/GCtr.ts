import { _decorator, Component, Node, Size, Canvas, view, screen, ResolutionPolicy, js } from 'cc';
import { UIManager } from './core/modules/ui/UIManager';
import { ResManager } from './core/modules/res/ResManager';
const { ccclass, property } = _decorator;

/** 
 * 画布的标准化尺寸，就是之前说的
 * iPad 设备中的画布尺寸 = 1001 x 1334 (其中 1001 ≈ 1668/1.6672)
 * iPhone16设备中的画布尺寸 = 750 x1626（其中 1626 = 2556/1.572）
 */

@ccclass('GCtr')
export class GCtr extends Component {
    async init(param: {
        canvas: Canvas
    }) {
        UIManager.getInstance().init(param.canvas);

        ResManager.getInstance().loadBundle("LoginBN", _ => {
            const loginEntryClass = js.getClassByName("LoginEntry") as typeof Component;
            this.node.addComponent(loginEntryClass);
        })
    }
    
    start() {

    }

    update(deltaTime: number) {
        
    }

}


