import {
    _decorator,
    Component,
    Node,
    input,
    Input,
    EventMouse,
    Vec3,
    Animation,
} from "cc";
const { ccclass, property } = _decorator;

@ccclass("PlayerController")
export class PlayerController extends Component {
    @property({ type: Animation })
    public BodyAnim: Animation | null = null;

    private _startJump: boolean = false;
    private _jumpStep: number = 0;
    private _currentJumpTime: number = 0;
    private _jumpTime: number = 0.1;
    private _currentJumpSpeed: number = 0;
    private _curPos: Vec3 = new Vec3();
    private _deltaPos: Vec3 = new Vec3();
    private _targetPos: Vec3 = new Vec3();

    private _curMoveIndex: number = 0;

    start() {
        input.on(Input.EventType.MOUSE_UP, this.onMouseUp, this);
    }

    update(deltaTime: number) {
        if (this._startJump) {
            this._currentJumpTime += deltaTime;
            if (this._currentJumpTime > this._jumpTime) {
                this.node.setPosition(this._targetPos);
                this._startJump = false;
                this.onOnceJumpEnd();
            } else {
                this.node.getPosition(this._curPos);
                this._deltaPos.x = this._currentJumpSpeed * deltaTime;
                Vec3.add(this._curPos, this._curPos, this._deltaPos);
                this.node.setPosition(this._curPos);
            }
        }

    }

    onMouseUp(event: EventMouse) {
        if (event.getButton() === 0) {
            // 按下鼠标左键
            this.BodyAnim.play("oneStep");
            this.jumpByStep(1);
        } else if (event.getButton() === 2) {
            // 按下鼠标右键
            this.jumpByStep(2);
            this.BodyAnim.play("twoStep");
        }
    }

    jumpByStep(num: number) {
        if (this._startJump) {
            return;
        }
        this._startJump = true;
        this._jumpStep = num;
        this._currentJumpTime = 0;
        this._currentJumpSpeed = this._jumpStep / this._jumpTime;
        this.node.getPosition(this._curPos);
        Vec3.add(this._targetPos, this._curPos, new Vec3(this._jumpStep, 0, 0));
        this._curMoveIndex += num;
    }
    setInputActive(active: boolean) {
        if (active) {
            input.on(Input.EventType.MOUSE_UP, this.onMouseUp, this);
        } else {
            input.off(Input.EventType.MOUSE_UP, this.onMouseUp, this);
        }
    }

    onOnceJumpEnd(){
        this.node.emit('JumpEnd', this._curMoveIndex);
    }

    reset(){
        this._curMoveIndex = 0;
    }
}
