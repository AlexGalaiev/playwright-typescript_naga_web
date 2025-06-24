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
    async clickBtn(questionName:string, answerText:string){
        let question = await this.page.locator(`//p[text()='${questionName}']//..`).first()
        let answer = await question.locator(`//button[text()='${answerText}']`)
        await answer.click()
        await this.page.waitForTimeout(1000)
    }

    async inputDateOfBirth(){
        let dateObBirth = await this.page.locator('#date_of_birth')
        await dateObBirth.pressSequentially("12.12.1980")
        //await this.page.locator("//button[@type='submit']").click()
    }
    async chooseFromDropDown(questionName: string){
        let question = await this.page.locator(`//p[@for='${questionName}']//..`).first()
        let answer = await question.locator("//div[contains(@class, 'form-select__control')]")
        await answer.click()
        await answer.press('Enter')
        await this.page.waitForTimeout(500)
    }
    async inputData(questionName: string, answerText: string, inputData: string){
        await this.clickBtn(questionName, answerText)
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
        await this.placeOfBirth.pressSequentially("Bosnia and herzegovina association for united nations")
        await this.page.waitForTimeout(1000)
        await this.placeOfBirth.press('Enter')
        await this.page.waitForTimeout(1000)
        await this.submit.click();
    }
    //used with Employment status, source of income, annual income, net=worth, anticipated_amount, currency
    async singleSelectOther(QuestionName: string, level: string){
        await this.page.waitForTimeout(700)
        let question = await this.page.locator(`//label[@for='${QuestionName}']`)
        let quiz = new KYC_answerFunctions(KYC_SCORE[level])
        await question.textContent() === await quiz.getQuizText(QuestionName)
        let answer = await quiz.getQuizAnswer(QuestionName)
        let answerQuiz = await this.page.locator(`//button[text()='${answer}']`)
        await this.page.waitForTimeout(1500);
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
        await this.clickBtn('Gender', 'Male')
        await this.inputDateOfBirth()
        await this.chooseFromDropDown('nationality')
        await this.submit.click()
       // await this.inputData("Select Passport or ID number", "ID", '3323232333')
        await this.inputAdress()
        await this.clickBtn('Do you have Tax Identification Number (TIN)?', 'No')
        await this.clickBtn('Please choose the appropriate reason:', 'No TIN is required')
        await this.submit.click()
        await this.page.waitForTimeout(1500)
        await this.submit.click()
        //Knoledge and experience step
        await this.singleSelectOther("employment_status", level)
        await this.input('Amazon')
        await this.singleSelect('employment_type', level)
        await this.submit.click()
        await this.singleSelectOther('annual_income', level)
        await this.singleSelectOther('net_worth', level)
        await this.singleSelectOther('anticipated_amount', level)
        await this.singleSelectOther('source_of_income', level)
        await this.submit.click()
        await this.singleSelect('expected_deposit_and_withdrawal_method', level)
        await this.submit.click()
        await this.singleSelect('level_of_trading_knowledge', level)
        await this.singleSelect('trades_on_financial_products', level)
        await this.singleSelect('number_of_leveraged_trades', level)
        await this.singleSelect('average_level_of_leverage', level)
        await this.singleSelect('bull_market', level)
        await this.singleSelect('position_describing', level)
        await this.singleSelect('trading_with_leverage', level)
        await this.singleSelect('investment_objectives_naga', level)
        await this.singleSelect('level_of_risk_to_tolerate_in_exchange', level)
        await this.singleSelect('time_to_hold_open_positions', level)
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
}