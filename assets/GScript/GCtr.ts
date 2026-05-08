import { _decorator, Component, Canvas } from 'cc';
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
            await gCtr.res.loadBundleAsync("Match3BN");
            gCtr.ui.open("Match3UI");
            console.log("登录成功");
        });
    }
    
    start() {

    }

    update(deltaTime: number) {
        
    }

}


