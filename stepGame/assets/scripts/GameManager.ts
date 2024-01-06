import {
    _decorator,
    Component,
    Node,
    Prefab,
    instantiate,
    Vec3,
    Label,
} from "cc";
import { PlayerController } from "./PlayerController";
const { ccclass, property } = _decorator;
enum BlockType {
    BT_NONE,
    BT_STONE,
}
enum GameState {
    GS_init,
    GS_playing,
    GS_end,
}
@ccclass("GameManager")
export class GameManager extends Component {
    @property({ type: Label })
    public stepsLabel: Label | null = null;

    @property({ type: Prefab })
    public cubePref: Prefab | null = null;

    @property
    public roadLength: number = 50;

    @property({ type: PlayerController })
    public playerCtrl: PlayerController | null = null;

    @property({ type: Node })
    public startMenu: Node | null = null;

    private _road: BlockType[] = [];

    start() {
        this.curState = GameState.GS_init;
        this.playerCtrl?.node.on("JumpEnd", this.onPlayerEnd, this);
    }
    onPlayerEnd(moveIndex: number) {
        if (this.stepsLabel) {
            this.stepsLabel.string =
                "" +
                (moveIndex >= this.roadLength ? this.roadLength : moveIndex);
        }
        this.checkResult(moveIndex);
    }

    set curState(state: GameState) {
        switch (state) {
            case GameState.GS_init:
                this.init();
                break;
            case GameState.GS_playing:
                if (this.startMenu) {
                    this.startMenu.active = false;
                }
                if (this.stepsLabel) {
                    this.stepsLabel.string = "0";
                }
                setTimeout(() => {
                    if (this.playerCtrl) {
                        this.playerCtrl.setInputActive(true);
                    }
                }, 10);
                break;
            case GameState.GS_end:
                break;
            default:
                break;
        }
    }

    init() {
        if (this.startMenu) {
            this.startMenu.active = true;
        }
        this.generateRoad();
        if (this.playerCtrl) {
            this.playerCtrl.setInputActive(false);
            this.playerCtrl.node.setPosition(Vec3.ZERO);
            this.playerCtrl.reset();
        }
    }
    generateRoad() {
        this.node.removeAllChildren();
        this._road = [];
        this._road.push(BlockType.BT_STONE);
        for (let i = 0; i < this.roadLength; i++) {
            if (this._road[i] === BlockType.BT_NONE) {
                this._road.push(BlockType.BT_STONE);
            } else {
                this._road.push(Math.floor(Math.random() * 2));
            }
        }
        for (let j = 0; j < this._road.length; j++) {
            let stone = this.spawnStoneByType(this._road[j]);
            if (stone) {
                this.node.addChild(stone);
                stone.setPosition(j, -1.5, 0);
            }
        }
    }

    spawnStoneByType(type: BlockType) {
        if (!this.cubePref) {
            return null;
        }
        let block: Node | null = null;
        switch (type) {
            case BlockType.BT_STONE: {
                block = instantiate(this.cubePref);
                break;
            }
        }
        return block;
    }
    update(deltaTime: number) {}

    onStartBtnClick() {
        this.curState = GameState.GS_playing;
    }

    checkResult(index: number) {
        if (index < this.roadLength) {
            if (this._road[index] === BlockType.BT_NONE) {
                this.curState = GameState.GS_init;
            }
        } else {
            this.curState = GameState.GS_init;
        }
    }
}
