import { Locator, Page } from "@playwright/test";
import { KYC_answerFunctions } from "./KYC_answer/NagaMarkets_KYC_answer";

const KYC_SCORE = {
    "Advance":"/pageObjects/FullRegistration/KYC_answer/NagaAfrica_Advance.json",
    "PreAdvance":'/pageObjects/FullRegistration/KYC_answer/NagaAfrica_PreAdvance.json',
    "Intermediate":'/pageObjects/FullRegistration/KYC_answer/NagaAfrica_Intermediate.json'
}

export class KYC_Africa{
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
            await this.page.waitForTimeout(1500)
            let zip = await this.page.locator("#addr_zip")
            await zip.clear()
            await zip.pressSequentially('3443')
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
        async fillPersonalInformation(){
                await this.page.waitForTimeout(500)
                await this.page.locator('#first_name').pressSequentially('testFN');
                await this.page.waitForTimeout(500);
                await this.page.locator("#middle_name").pressSequentially('testMN');
                await this.page.waitForTimeout(500);
                await this.page.locator("#last_name").pressSequentially('testLN');
                await this.page.waitForTimeout(500)
                await this.page.locator("#date_of_birth").pressSequentially('12.12.1990')
                await this.page.waitForTimeout(500)
                await this.submit.click()
            }
        async fillStartInformation(){
            await this.submit.click()
            //fill personal information
            await this.fillPersonalInformation()
            await this.inputAdress()
        }
        async waitNagaProgress(){
            await this.page.waitForSelector('.level-intro-modal__title', {state:'visible'})
            await this.page.locator("//button[text()='Continue'] ").click()
            await this.page.waitForTimeout(1000)
        }
        async fillKYC(level:string){
            await this.clickBtn('Gender on your passport', 'Female')
            await this.chooseFromDropDown('nationality')
            await this.submit.click()
            await this.clickBtn('Provide Passport or ID number', 'ID')
            await this.input('3344334433')
            await this.submit.click()
            await this.clickBtn('Do you have Tax Identification Number (TIN)?', 'No')
            await this.singleSelect('tin_absence_reason', level)
            await this.submit.click()
            await this.clickBtn('Do you currently (or during the last 12 months) hold a political office, or have ties to a politically active person? ', 'No')
            await this.clickBtn('Are you a US resident for tax purposes?', 'No')
            await this.submit.click()
            await this.singleSelect('employment_status', level)
            await this.input('IBM')
            await this.submit.click()
            await this.singleSelect('employment_type', level)
            await this.singleSelect('source_of_income', level)
            await this.singleSelect('annual_income', level)
            await this.singleSelect('net_worth', level)
            await this.singleSelect('anticipated_amount', level)
            await this.singleSelect('expected_deposit_and_withdrawal_method', level)
            await this.submit.click()
            await this.singleSelect('investment_objectives_naga', level)
            await this.singleSelect('trading_experience', level)
            await this.singleSelect('past_years_i_have', level)
            await this.singleSelect('bull_market', level)
            await this.singleSelect('position_describing', level)
            await this.singleSelect('trading_with_leverage', level)
            await this.singleSelect('level_of_risk_to_tolerate_in_exchange', level)
            await this.submit.click()
        }
}
