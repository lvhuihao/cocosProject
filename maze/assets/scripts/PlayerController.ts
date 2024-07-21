import { _decorator, Component, EventKeyboard, Input, input, KeyCode, Vec3 } from 'cc';
import { Maze } from './Maze';
import { questioner } from './questioner'

const { ccclass, property } = _decorator;

@ccclass('PlayerController')
export class PlayerController extends Component {
    start() {
        input.on(Input.EventType.KEY_DOWN, this.onKeyDown, this)
        input.on(Input.EventType.KEY_UP, this.onKeyUp, this)
        this.curTime = 0
        this.targetPos = this.node.getPosition()
        // this._targetPosition = this.node.getPosition()
    }

    update(deltaTime: number) {
        this.move(deltaTime)
    }
    onDestroy() {
        // 移除键盘事件
        input.off(Input.EventType.KEY_DOWN, this.onKeyDown, this);
        input.off(Input.EventType.KEY_UP, this.onKeyUp, this);
    }


    private curPos: Vec3 = new Vec3()
    private targetPos: Vec3 = new Vec3()

    private changeTime: number = 1
    private curTime: number = 0
    private isMoveing: boolean = false

    private curRotation: Vec3 = new Vec3()
    private targetRotation: Vec3 = new Vec3()

    private _moveDirection: Vec3 = new Vec3();
    private _rotationY: number = 0; // 用于控制视角的旋转

    @property({ type: questioner })
    private questioner: questioner | null = null

    onKeyUp(event: EventKeyboard) {
        switch (event.keyCode) {
            case KeyCode.KEY_W:
            case KeyCode.KEY_S:
                this._moveDirection.z = 0;
                break;
            case KeyCode.KEY_A:
            case KeyCode.KEY_D:
                this._moveDirection.x = 0;
                break;
            case KeyCode.ARROW_LEFT:
            case KeyCode.ARROW_RIGHT:
                this._rotationY = 0;
                break;
        }
    }
    onKeyDown(event: EventKeyboard) {
        switch (event.keyCode) {
            case KeyCode.KEY_W:
                this._moveDirection.z = 1;
                break;
            case KeyCode.KEY_S:
                this._moveDirection.z = -1;
                break;
            case KeyCode.KEY_A:
                this._moveDirection.x = -1;
                break;
            case KeyCode.KEY_D:
                this._moveDirection.x = 1;
                break;
            case KeyCode.ARROW_LEFT:
                this._rotationY = 1;
                break;
            case KeyCode.ARROW_RIGHT:
                this._rotationY = -1;
                break;
        }
    }

    move(deltaTime: number) {

        // 计算前方向量
        const forward = this.node.forward.clone();
        // console.info('forward', forward)
        forward.y = 0;
        forward.normalize();

        // 计算右方向量
        const right = Vec3.cross(new Vec3(), forward, Vec3.UNIT_Y).normalize();
        // console.info('right', right)

        if (this.curTime >= this.changeTime) {
            // 将位置设置成目标位置
            this.node.eulerAngles = this.targetRotation;
            this.curPos = this.node.getPosition()
            this.curRotation = this.node.eulerAngles.clone()
            this.node.setPosition(this.targetPos)
            this.node.eulerAngles = this.targetRotation
            this.curTime = 0
            this.isMoveing = false
        } else {
            if (this.isMoveing) {
                this.node.eulerAngles = this.node.eulerAngles.add3f(0, (this.targetRotation.y - this.curRotation.y) / this.changeTime * deltaTime, 0);
                let move = new Vec3((this.targetPos.x - this.curPos.x) / this.changeTime * deltaTime, this.curPos.y, (this.targetPos.z - this.curPos.z) / this.changeTime * deltaTime)
                Vec3.add(move, move, this.node.getPosition())
                this.node.setPosition(move)
                this.curTime += deltaTime
            } else {
                this.curRotation = this.node.eulerAngles.clone()
                this.curPos = this.node.getPosition()

                if (this._rotationY !== 0) {
                    this.targetRotation = new Vec3(0, this.curRotation.y + 90 * this._rotationY, 0)
                    this.isMoveing = true
                }
                if (this._moveDirection.z !== 0) {
                    let tempTarg = new Vec3()
                    Vec3.scaleAndAdd(tempTarg, this.curPos, forward, this._moveDirection.z);
                    if (this.canMove(tempTarg)) {
                        this.targetPos = tempTarg
                        this.isMoveing = true
                    }

                }
                if (this._moveDirection.x !== 0) {
                    let tempTarg = new Vec3()
                    Vec3.scaleAndAdd(tempTarg, this.curPos, right, this._moveDirection.x);
                    if (this.canMove(tempTarg)) {
                        this.targetPos = tempTarg
                        this.isMoveing = true
                    }
                }
            }

        }
    }

    canMove(targetPosition: Vec3) {
        if (Math.round(targetPosition.z + 4.5) === this.questioner?.randamPosition?.[0] && Math.round(targetPosition.x + 4.5) === this.questioner?.randamPosition?.[1]) {
            this.questioner.showQuestion()
            return false
        }
        return Maze[Math.round(targetPosition.z + 4.5)][Math.round(targetPosition.x + 4.5)] !== '#'
    }

}
