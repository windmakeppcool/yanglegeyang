import { _decorator, Component, Canvas } from 'cc';
import { registerBUrlByCfg, UIManager } from './core/modules/ui/UIManager';
import { ResManager } from './core/modules/res/ResManager';
import { LogCtr } from './GamePlay/Modules/Login/LoginCtr';
import { Match3UI } from './GamePlay/Modules/Match3/Match3UI';
import { PrefabCfg } from './auto/PrefabCfg';
const { ccclass, property } = _decorator;


declare global { const gCtr: GCtr; }


@ccclass('GCtr')
export class GCtr extends Component {
    readonly loginCtr = new LogCtr();
    readonly res = new ResManager();
    readonly ui = new UIManager();
    
    async init(param: {
        canvas2d: Canvas,
        releaseBoostFun: Function,
    }) {
        // UIManager.getInstance().init(param.canvas);
        // 全局变量设置
        (globalThis as any)["gCtr"] = this;
        if (!param?.canvas2d) {
            console.error("canvas2d 为空，UI 无法初始化");
            return;
        }
        gCtr.ui.init(param.canvas2d);

        // 提前注册预制体信息
        registerBUrlByCfg(PrefabCfg);

        // 登录模块初始化
        gCtr.loginCtr.init();

        // 显示登录界面（传入登录成功回调函数）
        gCtr.loginCtr.showLogin(async () => {
            await gCtr.res.loadBundleAsync("Match3BN");
            await gCtr.ui.open(Match3UI);
            console.log("登录成功");
            param.releaseBoostFun();
        });
    }
    
}


