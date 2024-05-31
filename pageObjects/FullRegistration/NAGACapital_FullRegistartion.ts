import { Page } from "@playwright/test"
import { KYC_answerFunctions } from "./KYC_answer/NagaMarkets_KYC_answer";


const KYC_SCORE = {
    "UpdateAccount":"/pageObjects/FullRegistration/KYC_answer/NagaCapital_AccountUpdate.json"
}
export class NagaCapitalFullRegistration{
    page:Page
    
    constructor(page:Page){
        this.page = page;
    }

    async chooseAnswerDropDown(QuestionName: string, levelOfUser: string){
        //get text from json, get text from ui and compare these values
        let questionText = await this.page.locator(`//div[contains(@class, ${QuestionName})]//label`);
        let quiz = new KYC_answerFunctions(KYC_SCORE[levelOfUser])
        await questionText.textContent() === await quiz.getQuizText(QuestionName)
        //get quiz answer from json
        let answer = await quiz.getQuizAnswer(QuestionName)

    }
    async fillQuiz(kycAnswers: string){

    }

}