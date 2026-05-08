import { _decorator, Component, Node } from 'cc';
const { ccclass, property } = _decorator;

declare global {
    interface IBundleUrl {
        /** * 子包名 */ b: string,
        /** * 资源路径 */ l: string,
        /** 缓存关键字 */ id: string,
    }
}

/**
 * 创建 BundleUrl 对象
 * @param url 
 * @param bundleName Asset Bundle 名称
 * @returns 
 */

export function BL(url: string, bundleName: string, k?: string): IBundleUrl {
    let obj: IBundleUrl = Object.create(null);
    obj.b = bundleName;
    obj.l = url;
    obj.id = `${bundleName}${url}`;
    return obj;
}