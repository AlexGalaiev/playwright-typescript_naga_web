import { Locator, Page } from "@playwright/test";
import { KYC_answerFunctions } from "./KYC_answer/NagaMarkets_KYC_answer";


const KYC_SCORE = {
    "Advance":"/pageObjects/FullRegistration/KYC_answer/NagaMarkets_Advance.json",
    "PreAdvance":"/pageObjects/FullRegistration/KYC_answer/NagaMarkets_PreAdvance.json",
    "Intermediate":"/pageObjects/FullRegistration/KYC_answer/NagaMarkets_Intermediate.json",
    "Elementary":"/pageObjects/FullRegistration/KYC_answer/NagaMarkets_Elementary.json",
    "Beginner":"/pageObjects/FullRegistration/KYC_answer/NagaMarkets_Beginer.json"
}

export class FullRegistration{
    page: Page;
    readonly countrySumbit: Locator;
    readonly submitBtn: Locator;
    readonly dateObBirth: Locator;
    readonly placeOfBirth: Locator;
    readonly id: Locator;
    
    constructor(page: Page){
        this.page = page
        this.countrySumbit = page.locator("//button[contains(@class, 'kyc-live-account_submitButton')]")
        this.submitBtn = page.locator("//button[@type='submit']")
        this.dateObBirth = page.locator("#date_of_birth")
        this.placeOfBirth = page.locator("[data-testid='naga-dropdown-input']");
        this.id = page.locator("[name='national_id']")
    }
    async countryStep(){
        await this.page.waitForSelector("//label[@for='country_expected_source_of_funds']", {'state':'visible'});
        await this.countrySumbit.click()
        await this.page.waitForTimeout(250)
    }
    async clickSubmitBtn(){
        await this.submitBtn.click();
        await this.page.waitForTimeout(250)
    }

    async clickFinishAndGetAML(){
        const [response] = await Promise.all([
            this.page.waitForResponse('**/kyc/scores', {timeout:15000}),
            this.submitBtn.click()
        ])
        let body = await response.json()
        let amlScor = await body.data.aml_score
        return amlScor
    }
    async inputDateOfBirth(){
        await this.dateObBirth.pressSequentially("12.12.1980")
        await this.page.locator("//button[@type='submit']").click()
    }

    async checkbox(QuestionName: string, level: string){
        //Get quiestion text from json and compare it from text on the page
        let question = await this.page.locator(`//label[@for='${QuestionName}']`)
        let quiz = new KYC_answerFunctions(KYC_SCORE[level])
        await question.textContent() === await quiz.getQuizText(QuestionName)
        //get answer from json 
        let answer = await quiz.getQuizAnswer(QuestionName)
        //get answer on ui 
        let answerQuiz = await this.page.locator(`//label[@for='${QuestionName}']//..//..//button[contains(text(), '${answer}')]`)
        await this.page.waitForTimeout(500);
        await answerQuiz.click(); 
    };
    async checkbox_Tin(QuestionName: string, level: string){
        let question = await this.page.locator(`//p[@for='${QuestionName}']`)
        let quiz = new KYC_answerFunctions(KYC_SCORE[level])
        await question.textContent() === await quiz.getQuizText(QuestionName)
        let answer = await quiz.getQuizAnswer(QuestionName)
        let answerQuiz = await this.page.locator(`//p[@for='${QuestionName}']//..//button[text()='${answer}']`)
        await this.page.waitForTimeout(500);
        await answerQuiz.click();
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

    async inputId(){
        await this.id.pressSequentially("445533445533")
        await this.page.waitForTimeout(250)
    }
    async inputAdress(){
        await this.placeOfBirth.click()
        await this.placeOfBirth.pressSequentially("Bosnia and herzegovina association for united nations")
        await this.page.waitForTimeout(1000)
        await this.placeOfBirth.press('Enter')
        await this.page.waitForTimeout(500)
        await this.submitBtn.click();
    }

    async fill_KYC(level: string){
        await this.countryStep();
        await this.checkbox('pep', level);
        await this.checkbox_Tin('has_tin', level);
        await this.checkbox('citizen', level);
        await this.clickSubmitBtn();
        await this.singleSelect('level_of_trading_knowledge', level);
        await this.singleSelect('trading_experience_in_stocks_bonds_etfs', level);
        await this.singleSelect('trading_experience_in_contracts', level);
        await this.singleSelect('trading_experience_in_crypto', level);
        await this.singleSelect('market_moves_by_3_percent', level);
        await this.singleSelect('required_margin_for_1_lot', level);
        await this.singleSelect('type_of_closing_order', level);
        await this.singleSelect('how_much_do_you_have_to_pay_to_buy', level);
        await this.singleSelect('market_moving_against_you', level);
        await this.singleSelectOther('employment_status', level); 
        await this.singleSelect('employment_type', level); 
        await this.singleSelectOther('source_of_income', level);
        await this.singleSelectOther('annual_income', level); 
        await this.singleSelectOther('net_worth', level);
        await this.singleSelect('liquid_assets_net_worth', level);
        await this.singleSelectOther('anticipated_amount', level);
        await this.singleSelect("expected_deposit_and_withdrawal_method", level);
        await this.chooseKYCInstrument("underlying_instrument_on_contracts", level);
        await this.singleSelect("investment_objectives_naga", level);
        await this.singleSelect("time_to_hold_open_positions", level);
        await this.singleSelect("level_of_risk_to_tolerate_in_exchange", level);
        await this.singleSelect("gender_on_passport", level)
        await this.clickSubmitBtn();
        await this.inputDateOfBirth();
        await this.inputAdress();
        await this.singleSelectOther('currency', level);
        await this.inputId()
        await this.clickSubmitBtn();
    }

    async finishKycAndGetAML(){
        const [response] = await Promise.all([
            this.page.waitForResponse('**/kyc/scores', {timeout:15000}),
            this.submitBtn.click()
        ])
        let body = await response.json()
        let amlScor = await body.data.aml_score
        let score = await body.data.suitability_score
        return [amlScor, score]
    }

    //new designe
    async singeSelectNew(QuestionName: string, level: string){
        await this.page.waitForTimeout(700)
        let question = await this.page.locator(`//p[text()='${QuestionName}']`)
        let quiz = new KYC_answerFunctions(KYC_SCORE[level])
        await question.textContent() === await quiz.getQuizText(QuestionName)
        //get answer from json 
        let answer = await quiz.getQuizAnswer(QuestionName)
        //get answer on ui
        await this.page.locator(``)

    }
    
}