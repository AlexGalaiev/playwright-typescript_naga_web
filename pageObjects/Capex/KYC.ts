import { Page } from "playwright";

export class CapexKYC{
    page: Page

    constructor(page: Page){
        this.page = page
    }
    async chooseDropDown(answerText:string, questionText:string){
        await this.page.waitForTimeout(1000)
        let question = await this.page.locator("//div[contains(@class, 'qa-select div_question_')]", {has: await this.page.locator(`//span[contains(text(), '${questionText}')]`)})
        await question.locator('//button').click()
        let dropDown = await question.locator("//div[@class='dropdown-menu show']")
        await dropDown.waitFor({state:'visible'})
        await dropDown.locator(`//span[contains(text(), '${answerText}')]`).click()
        await this.page.waitForTimeout(1000)
    }
    async chooseDropDownMultiselect(answerText:string, questionText:string){
        await this.page.waitForTimeout(1000)
        let question = await this.page.locator("//div[contains(@class, 'qa-select div_question_')]", {has: await this.page.locator(`//span[contains(text(), '${questionText}')]`)})
        await question.locator('//button').click()
        let dropDown = await question.locator("//div[@class='dropdown-menu show']")
        await dropDown.waitFor({state:'visible'})
        await dropDown.locator(`//span[contains(text(), '${answerText}')]`).click()
        await this.page.waitForTimeout(500)
        await question.click()
        await this.page.waitForTimeout(500)
    }
    async inputValue(answerText:string, questionText:string){
        await this.page.waitForTimeout(1000)
        let question = await this.page.locator("//div[contains(@class, 'qa-select div_question_')]", {has: await this.page.locator(`//span[contains(text(), '${questionText}')]`)}).first()   
        await question.locator('//input').clear()
        await this.page.waitForTimeout(500)
        await question.locator('//input').pressSequentially(answerText)
        await this.page.waitForTimeout(1000)
    }
    async inputDateOfBirth(){
        await this.page.waitForTimeout(1000)
        let question = await this.page.locator("//div[contains(@class, 'qa-select div_question_')]", {has: await this.page.locator(`//span[contains(text(), 'Date of Birth')]`)})
        await question.locator('//button[@title="Day"]').click()
        await question.locator("//span[text()='1']").click()
        await this.page.waitForTimeout(500)
        await question.locator('//button[@title="Month"]').click()
        await question.locator("//span[text()='January']").click()
        await this.page.waitForTimeout(500)
        await question.locator('//button[@title="Year"]').click()
        await question.locator("//span[text()='2005']").click()
        await this.page.waitForTimeout(500)
    }

    async fillPersonalInformation(){
        await this.page.locator("//h3[text()='Personal information ']").waitFor({state:'visible'})
        await this.inputValue('test', 'First Name')
        await this.inputValue('test', 'Middle Name')
        await this.inputValue('test', 'Last Name')
        await this.chooseDropDown('Male', 'Gender')
        await this.inputDateOfBirth()
        await this.inputValue('test', 'Address')
        await this.inputValue('test', 'City')
        await this.inputValue('test', 'ZIP Code/Postcode')
        await this.chooseDropDown('Albania', 'Country of Residence')
        await this.chooseDropDown('Albania', 'Place of Birth')
        await this.chooseDropDown('No', 'Do you currently (or during the last 12 months) hold a political office, or have ties to a politically active person? ')
        await this.chooseDropDown('Albania', 'Citizenship')
        await this.page.locator("//button[text()='Next']").click()
    }
    async skipDeposit(){
        await this.page.locator("//div[contains(@class, 'amount_container')]").nth(1).waitFor({state:'visible'})
        await this.page.locator("//button[text()='Next']").click()
        await this.page.locator("//button[text()='Deposit Later']").waitFor({state:'visible'})
        await this.page.locator("//button[text()='Deposit Later']").click()
    }
    async fillTaxInformation(){
        await this.page.locator("//h3[text()='Tax Information ']").waitFor({state:'visible'})
        await this.chooseDropDown('No', 'Do you have a TIN?')
        await this.chooseDropDown('Unable to obtain a TIN or equivalent number', 'Please choose the appropriate reason: ')
        await this.chooseDropDown('No', 'Are you U.S. reportable for tax purpose? Only answer YES if you are a US citizen or tax resident')
        await this.page.locator("//button[text()='Next']").click()
    }

    async fillFinancialInformation(){
        await this.page.locator("//h3[text()='Financial Information']").waitFor({state:'visible'})
        await this.chooseDropDown('Self Employed','Employment Status')
        await this.inputValue('test', 'Company')
        await this.inputValue('test', 'Profession Name')
        await this.chooseDropDown('Accountancy', 'Industry')
        await this.chooseDropDown('$450,001 - $750,000', 'Your annual income')
        //await this.inputValue('test', 'Please specify')
        await this.chooseDropDown('$300,001 - $500,000','Average yearly net disposable income')
        await this.chooseDropDown('$450,001 - $750,000','Your Savings and Investments (net wealth)')
       // await this.inputValue('test', 'Please specify')
        await this.chooseDropDown("$300,001 - $500,000", 'Considered yearly invested amount?')
        //await this.inputValue('test', 'Please specify')
        await this.chooseDropDownMultiselect('Employment', 'What is the source of income regarding the funds you will deposit with us:(Select all that apply)')
        await this.chooseDropDownMultiselect('Bank Wire Transfer originating from country of residence', 'Methods of account funding(Select all that apply)')
        await this.inputValue('test', 'Funds origin institution/ Bank name')
        await this.chooseDropDown('Albania', 'Country of Origin')
        await this.chooseDropDown('No', 'Is your expected destination of withdrawals, different than your funding origin:')
        await this.chooseDropDown('University/College', 'Level of education ')
        await this.chooseDropDown('Banking, Economics, Accounting, Law or similar', 'Field of study')
        await this.chooseDropDown('Professional qualification (e.g. CFA, ACCA, or similar)', 'What is your level of education, qualification and work experience in the financial industry?')
        await this.page.locator("//button[text()='Next']").click()
    }

    async fillKnoledgeTradingExperience(){
        await this.page.locator("//h3[text()='Knowledge and Trading Experience ']").waitFor({state:'visible'})
        await this.chooseDropDown('More than 50', 'Total number of leveraged trades in CFDs (e.g. Forex, Commodities, Shares, Indices) placed during the past 2 years?')
        await this.chooseDropDown('Over 1:200', 'What was the average level of leverage you used for trading?')
        await this.chooseDropDown('Traded on my own', 'In the past 2 years I have:')
        await this.chooseDropDown('Stop loss', 'What type of order should you place in order to limit your losses?')
        await this.chooseDropDown('Going up', 'If we are in a Bull market the general prices in financial markets are:')
        await this.chooseDropDown('Trade in multiple financial instruments such as CFDs (e.g shares, indices)', 'What is your main trading purpose and objective?')
        await this.page.locator("//button[text()='Next']").click()
    }
    async checkRiskWarningCheckbox(){
        await this.page.locator("//span[text()='I am over 18 years of age.']").waitFor({state:'visible'})
        await this.page.locator("//button[text()='Next']").click()
    }
    async checkVerificationScreenAndSubmit(){
        return await this.page.locator('//button[@data-name="doc-id"]').isVisible()
    }
    async passVerification(){
        await this.page.locator("//button[text()='Close']").click()
    }
}