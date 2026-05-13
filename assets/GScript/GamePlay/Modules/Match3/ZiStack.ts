import { Match3ZiUE } from "./Match3ZiUE";

export class ZiStack {
    /** 用数组来实现栈 */
    private m_Stack: Match3ZiUE[] = [];

    /** 栈是否为空 */
    get empty(): boolean { return this.m_Stack.length === 0 }

    /** 获取栈顶元素 */
    get top(): Match3ZiUE | null {
        if (this.empty) {
            return null
        }
        return this.m_Stack[this.m_Stack.length - 1];
    }

    /** 添加的时候，放到数组最后一项 */
    push(zi: Match3ZiUE) {
        this.m_Stack.push(zi)
    }

    pop(): Match3ZiUE {
        return this.m_Stack.pop();
    }
}