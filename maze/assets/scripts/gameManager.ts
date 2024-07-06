import { _decorator, Component, instantiate, Node, Prefab, Vec3, RigidBodyComponent, BoxCollider } from 'cc';
import { PlayerController } from './PlayerController';
import { Maze } from './Maze'
const { ccclass, property } = _decorator;

@ccclass('gameManager')
export class gameManager extends Component {
    private Maze: Array<Array<'#' | '0'>> = Maze

    @property({ type: Prefab })
    public cubePrefab: Prefab | null = null

    private center = [4.5, 4.5]

    @property({type: Node})
    public question: Node | null = null

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

    getCubePrefab(type: '#' | '0') {
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

    }
}

