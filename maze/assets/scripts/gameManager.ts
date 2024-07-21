import { _decorator, Component, instantiate, Node, Prefab, Vec3, RigidBodyComponent, BoxCollider } from 'cc';
import { PlayerController } from './PlayerController';
import { questioner } from './questioner';
import { Maze } from './Maze'
const { ccclass, property } = _decorator;

@ccclass('gameManager')
export class gameManager extends Component {
    private Maze: Array<Array<'#' | '0' | 'Q'>> = Maze

    @property({ type: Prefab })
    public cubePrefab: Prefab | null = null

    @property({ type: Prefab })
    public conePrefab: Prefab | null = null

    private center = [4.5, 4.5]

    @property({ type: Node })
    public question: Node | null = null

    @property({ type: PlayerController })
    public playerCtrl: PlayerController | null = null

    @property({ type: questioner })
    public questioner: questioner | null = null

    private queNode: Node | null = null

    start() {
        let size = this.Maze.length
        for (let i = 0; i < size; i++) {
            for (let j = 0; j < size; j++) {
                let wall: Node | null = this.getCubePrefab(this.Maze[i][j])
                if (wall) {
                    // let rigidBody = wall.addComponent(RigidBodyComponent);
                    // rigidBody.setGroup(1)
                    // wall.addComponent(BoxCollider);
                    wall.setPosition(this.transPosition(i, j))
                    this.node.addChild(wall)
                }
            }
        }
    }

    transPosition(i, j) {
        // return new Vec3(i - this.center[0], j - this.center[1], 0)
        return new Vec3(j - this.center[1], 0, i - this.center[0])
    }

    getCubePrefab(type: '#' | '0' | 'Q') {
        if (!this.cubePrefab) {
            return null
        }
        let block: Node | null = null
        if (type === '#') {
            block = instantiate(this.cubePrefab)
        }
        return block
    }


    update(deltaTime: number) {
        if (this.questioner.randamPosition === null) {
            if (this.queNode) {
                this.node.removeChild(this.queNode)
                this.queNode = null
                setTimeout(() => {
                    this.questioner.questionReset();
                    this.queNode = instantiate(this.conePrefab)
                    this.queNode.setPosition(this.transPosition(this.questioner.randamPosition[0], this.questioner.randamPosition[1]))
                    this.node.addChild(this.queNode)
                }, 5000)
            }
        } else {
            if(this.queNode===null){
                this.questioner.questionReset();
                this.queNode = instantiate(this.conePrefab)
                this.queNode.setPosition(this.transPosition(this.questioner.randamPosition[0], this.questioner.randamPosition[1]))
                this.node.addChild(this.queNode) 
            }
        }
    }
}

