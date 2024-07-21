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
        this.hiddenQuestion();
    }

    update(deltaTime: number) {

    }

    @property({ type: Boolean })
    public passQuestion: boolean = false;

    @property({ type: Label })
    private questionLabel: Label | null = null

    @property({ type: Label })
    private answerLabel: Label | null = null

    @property({ type: Button })
    private confirmButton: Button | null = null

    public randamPosition: [number, number] | null = [5, 7]

    public clearQuestion() {
        cleanPrompt();
    }

    public questionReset() {
        this.randamPosition = [5, 7]
    }

    setQuestion(content: string) {
        try {
            let result = JSON.parse(content);
            if (result.score === 10) {
                this.passQuestion = true;
                setTimeout(() => {
                    this.hiddenQuestion()
                    this.randamPosition = null
                    getCompelite().then(res => {
                        this.setQuestion(res)
                    })
                }, 1000)
            }
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

    public showQuestion() {
        return this.node.active = true;
    }

    public hiddenQuestion() {
        return this.node.active = false;
    }

    public btnClick() {
        let ans = this.getAnswer()
        getCompelite(ans).then(res => {
            this.setQuestion(res)
        })
    }


}

