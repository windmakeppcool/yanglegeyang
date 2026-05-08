import { _decorator, Component, Node, Size, Canvas, view, screen, ResolutionPolicy, js } from 'cc';
import { UIManager } from './core/modules/ui/UIManager';
import { ResManager } from './core/modules/res/ResManager';
import { LogCtr } from './GamePlay/Modules/Login/LoginCtr';
const { ccclass, property } = _decorator;


declare global {
    const gCtr: GCtr;
}
@ccclass('GCtr')
export class GCtr extends Component {
    readonly loginCtr = new LogCtr();
    readonly res = new ResManager();
    readonly ui = new UIManager();
    
    async init(param: {
        canvas2d: Canvas
    }) {
        // UIManager.getInstance().init(param.canvas);
        (globalThis as any)["gCtr"] = this;
        gCtr.ui.init(param.canvas2d);

        // 登录模块初始化
        this.loginCtr.init();

        // 显示登录界面（传入登录成功回调函数）
        this.loginCtr.showLogin(async () => {
            await ResManager.getInstance().loadBundleAsync("Match3BN");
            UIManager.getInstance().open("Match3UI");
            console.log("登录 登录成功");
        });

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


