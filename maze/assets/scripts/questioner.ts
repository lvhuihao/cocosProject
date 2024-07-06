import { Label } from 'cc';
import { _decorator, Component, Node } from 'cc';
import { getCompelite, cleanPrompt } from './gpts/gpt';
import { Button } from 'cc';
const { ccclass, property } = _decorator;
@ccclass('questioner')
export class questioner extends Component {
    start() {
        getCompelite().then(res => {
            this.setQuestion(res)
        })
        this.confirmButton.node.on('click', this.btnClick, this);
    }

    update(deltaTime: number) {

    }

    @property({ type: Label })
    private questionLabel: Label | null = null

    @property({ type: Label })
    private answerLabel: Label | null = null

    @property({ type: Button })
    private confirmButton: Button | null = null

    setQuestion(content: string) {
        try {
            let result = JSON.parse(content);
            let scoreText = typeof result.score !== 'undefined' ? (result.score === 10 ? "" : `得分：${result.score}`) : "";
            let reasonText = result.reason || "";
            let contentText = result.content || "";

            this.questionLabel.string =
                `${scoreText}${scoreText ? "\n" : ''}${reasonText}${reasonText ? "\n" : ''}${contentText}`.trim();
        } catch (e) {
            this.questionLabel.string = content;
        }
    }

    public getAnswer() {
        return this.answerLabel.string;
    }

    public btnClick() {
        let ans = this.getAnswer()
        getCompelite(ans).then(res => {
            this.setQuestion(res)
        })
    }


}

