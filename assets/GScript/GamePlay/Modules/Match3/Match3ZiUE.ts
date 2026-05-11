import { _decorator, Component, Node, Sprite } from 'cc';
const { ccclass, property } = _decorator;

@ccclass('Match3ZiUE')
export class Match3ZiUE extends Component {

    @property(Sprite) private bg: Sprite = null;
    @property(Sprite) private sprite: Sprite = null;

    start() {

    }

    update(deltaTime: number) {
        
    }
}


