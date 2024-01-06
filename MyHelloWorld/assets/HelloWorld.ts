import { _decorator, Component, Node } from 'cc';
const { ccclass, property } = _decorator;

@ccclass('NewComponent')
export class NewComponent extends Component {
    start() {
        console.info("Hello World");
    }

    update(deltaTime: number) {
        
    }
}

