import { Locator, Page } from "playwright"
import { KYC_answerFunctions } from "./KYC_answer/NagaMarkets_KYC_answer";


const KYC_SCORE = {
    "Advance":"/pageObjects/FullRegistration/KYC_answer/NagaMena_Advance.json",
    "PreAdvance":'/pageObjects/FullRegistration/KYC_answer/NagaMena_PreAdvance.json',
    "Intermediate":'/pageObjects/FullRegistration/KYC_answer/NagaMena_Intermediate.json',
    "Elementary":"/pageObjects/FullRegistration/KYC_answer/NagaMena_Elementary.json",
    "Beginner":"/pageObjects/FullRegistration/KYC_answer/NagaMena_Beginner.json"
}

export class MenaFullRegistration{
    page: Page
    submit: Locator
    placeOfBirth: Locator

    constructor(page: Page){
        this.page = page;
        this.submit = page.locator("//button[@type='submit']")
        this.placeOfBirth = page.locator("[data-testid='naga-dropdown-input']")
    }

    async singleSelect(QuestionName: string, level: string){
        await this.page.waitForTimeout(700)
        let question = await this.page.locator(`//p[@for='${QuestionName}']`)
        let quiz = new KYC_answerFunctions(KYC_SCORE[level])
        await question.textContent() === await quiz.getQuizText(QuestionName)
        let answer = await quiz.getQuizAnswer(QuestionName)
        let answerQuiz = await this.page.locator(`//button[text()='${answer}']`)
        await this.page.waitForTimeout(4000);
        await answerQuiz.click();
    }
    async clickBtn(answerText:string){
       // let question = await this.page.locator(`//p[text()='${questionName}']//..`).first()
        let answer = await this.page.locator(`//button[text()='${answerText}']`)
        await answer.click()
        await this.page.waitForTimeout(1000)
    }

    async inputDateOfBirth(){
        let dateObBirth = await this.page.locator('#date_of_birth')
        await dateObBirth.click()
        let inputData = await this.page.locator("//input[contains(@class, 'DateInput_input')]")
        await inputData.pressSequentially('1212')
        await this.page.waitForTimeout(800)
        await inputData.pressSequentially('2000')
        //await this.page.locator("//button[@type='submit']").click()
    }

    async chooseFromDropDown(QuestionName: string, level:string){
        let question = await this.page.locator(`//label[text()='${QuestionName}']//..`).first()
        await question.click()
        let answer = await question.locator("//div[contains(@class, 'select__option')]").first()
        await answer.click()
        await this.page.waitForTimeout(1000)
    }

    async inputData(answerText: string, inputData: string){
        await this.clickBtn(answerText)
        await this.page.waitForTimeout(250)
        await this.page.locator("[data-naga-components='input']").pressSequentially(inputData)
        await this.page.waitForTimeout(500)
        await this.submit.click()
    }

    async input(textToInput: string){
        await this.page.waitForTimeout(250)
        await this.page.locator("[data-naga-components='input']").pressSequentially(textToInput)
        await this.page.waitForTimeout(500)
        await this.submit.click()
    }

    async inputAdress(){
        await this.placeOfBirth.click()
        await this.placeOfBirth.pressSequentially("405 E 45th St, New York, NY 10017, Соединенные Штаты")
        await this.page.waitForTimeout(1000)
        await this.placeOfBirth.press('Enter')
        await this.page.waitForTimeout(1000)
        await this.submit.click();
    }
    //used with Employment status, source of income, annual income, net=worth, anticipated_amount, currency
    async singleSelectOther(QuestionName: string, level: string){
        await this.page.waitForTimeout(700)
        let question = await this.page.locator(`//p[contains(@class, 'stepTitle')]`)
        let quiz = new KYC_answerFunctions(KYC_SCORE[level])
        await question.textContent() === await quiz.getQuizText(QuestionName)
        let answer = await quiz.getQuizAnswer(QuestionName)
        let answerQuiz = await this.page.locator(`//button[text()='${answer}']`)
        await this.page.waitForTimeout(4000);
        await answerQuiz.click();
    }
    async chooseKYCInstrument(QuestionName: string, level: string){
        await this.page.waitForTimeout(500)
        let question = await this.page.locator(`//p[@for='${QuestionName}']`)
        let quiz = new KYC_answerFunctions(KYC_SCORE[level])
        await question.textContent() === await quiz.getQuizText(QuestionName)
        let answer = await quiz.getQuizAnswer(QuestionName)
        let answerQuiz = await this.page.locator(`//label[@data-naga-components="checkbox"][1]`)
        await this.page.waitForTimeout(1200);
        await answerQuiz.click();
        await this.page.waitForTimeout(500)
        await this.page.locator("//button[@type='submit']").click()
    }

    async fillKYC(level:string){
        //Personal information step
        await this.clickBtn('Male')
        await this.inputDateOfBirth()
        await this.chooseFromDropDown('Nationality', level)
        await this.submit.click()
       // await this.inputData("Select Passport or ID number", "ID", '3323232333')
        await this.inputAdress()
        await this.clickCheckBox('Do you have Tax Identification Number (TIN)?', 'No')
        await this.clickBtn('No TIN is required')
        await this.submit.click()
        await this.page.waitForTimeout(1500)
        await this.submit.click()
        //Knoledge and experience step
        await this.singleSelectOther("employment_status", level)
        await this.input('Amazon')
        await this.chooseFromDropDown('Select Industry', level)
        await this.submit.click()
        //await this.clickBtn('Credit Card')
        //await this.submit.click()
        await this.singleSelectOther('annual_income', level)
        await this.singleSelectOther('net_worth', level)
        await this.singleSelectOther('anticipated_amount', level)
        await this.singleSelectOther('source_of_income', level)
        await this.submit.click()
        
        await this.singleSelectOther('expected_deposit_and_withdrawal_method', level)
        await this.submit.click()
        await this.singleSelectOther('level_of_trading_knowledge', level)
        await this.singleSelectOther('trades_on_financial_products', level)
        await this.singleSelectOther('number_of_leveraged_trades', level)
        await this.singleSelectOther('average_level_of_leverage', level)
        await this.singleSelectOther('bull_market', level)
        await this.singleSelectOther('position_describing', level)
        await this.singleSelectOther('trading_with_leverage', level)
        await this.singleSelectOther('investment_objectives_naga', level)
        await this.singleSelectOther('level_of_risk_to_tolerate_in_exchange', level)
        await this.singleSelectOther('time_to_hold_open_positions', level)
        await this.singleSelectOther('currency', level)
        //await this.submit.click()
    }

    async finishKycAndGetAML(){
        const [response] = await Promise.all([
            this.page.waitForResponse('**/kyc/scores', {timeout:15000}),
            this.submit.click()
        ])
        let body = await response.json()
        let amlScor = await body.data.aml_score
        let score = await body.data.knowledge_experience_score
        return [amlScor, score]
    }

    async clickCheckBox(questionName:string, answerText:string){
        let question = await this.page.locator("//p[contains(@class, 'stepTitle')]", {hasText:questionName})
        let answer = await question.locator(`//..//following-sibling::div//div[text()='${answerText}']`)
        await answer.click()
        await this.page.waitForTimeout(500)
    }

}