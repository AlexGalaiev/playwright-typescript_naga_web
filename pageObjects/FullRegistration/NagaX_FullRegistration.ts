import { Locator, Page } from "@playwright/test";
import { RandomUser } from "../common/testUserCredentials/randomUser";

export class NagaX_KYC{
    page: Page
    firstName: Locator
    lastName: Locator
    userName: Locator
    phone: Locator
    submitBtn: Locator
    continueBtn: Locator

    constructor(page: Page){
        this.page = page
        this.firstName = page.locator("[name='first_name']")
        this.lastName = page.locator("[name='last_name']")
        this.userName = page.locator("[name='user_name']")
        this.phone = page.locator("[name='phone']")
        this.submitBtn = page.locator("//button[text()='Proceed']")
        this.continueBtn = page.locator("//button[contains(@class, 'register-success-modal__button')]")

    }

    async inputData(elementToSearch: string, dataToInput: string){
        let field = await this.page.locator(`//input[@id='${elementToSearch}']`)
        await field.pressSequentially(dataToInput)
        await this.page.waitForTimeout(1000)
    }
    async chooseFromDropDown(title: string){
        let element = await this.page.locator("//div[contains(@class, 'kyc-live-account_gridItem')]", {hasText:`${title}`})
        await element.locator("//div[contains(@class, 'form-select__control')]").click()
        await element.locator("//div[contains(@class, 'form-select__control')]").press('Enter')
        await this.page.waitForTimeout(500)
    }
    async singleSelect(titleNmae: string, buttonName: string){
        let element = await this.page.locator("//div[contains(@class, 'kyc-live-account_gridItem')]", {hasText:`${titleNmae}`})
        await element.locator(`//button[text()='${buttonName}']`).click()
        await this.page.waitForTimeout(500)
    }
    async fillPersonalFullData(){
        await this.page.waitForSelector("//p[contains(@class, 'stepTitle')]", {state:'visible'})
        await this.page.waitForTimeout(1000)
        await this.chooseFromDropDown('Title*')
        await this.inputData("middle_name",  "TestNM")
        await this.chooseFromDropDown('Month')
        await this.page.locator("//label[text() = 'Day']//..//..//input").pressSequentially('12')
        await this.page.locator("//label[text() = 'Year']//..//..//input").pressSequentially('1989')
        await this.inputData('national_id', '332322')
        await this.page.locator("//button[@type='submit']").click()
    }
    async fillTinData(){
        await this.page.waitForSelector("//p[text()= 'Personal Details']", {state:'visible'})
        await this.singleSelect('Are you a US resident for tax purposes?*', 'No')
        await this.singleSelect('Are you a politically exposed person?*', 'No')
        await this.page.locator("//button[@type='submit']").click()
    }
    async fillAddressInfo(){
        await this.page.waitForSelector("//p[text()='Address Information']", {state:'visible'})
        await this.inputData('addr_street','East 45th Street')
        await this.inputData('addr_street_no', '405')
        await this.inputData('addr_city', 'New York')
        await this.inputData('addr_zip', '10017')
        await this.inputData('addr_state', "Florida")
        await this.page.locator("//button[@type='submit']").click()
    }
    async fillInvestorProfile(){
        await this.page.waitForSelector("//p[text()='Investor Profile']", {state:'visible'})
        await this.page.waitForTimeout(1000)
        await this.chooseFromDropDown('Total estimated net worth (€)?*')
        await this.chooseFromDropDown('Total estimated annual income (€)?*')
        await this.chooseFromDropDown('Source of Income*')
        await this.chooseFromDropDown('What best describes your employment status?')
        await this.page.locator("//button[@type='submit']").click()
    }
    async acceptTermsAndConditions(){
        await this.page.waitForSelector("//p[text() = 'Account Settings and Conditions']", {state:'visible'})
        await this.page.locator('//input[@name="nx_terms"]//..').click()
        return await this.page.locator('//input[@name="nx_terms"]//..//span//span').textContent()
    }
    async finishRegistration(){
        await this.page.locator("//button[@type='submit']").click()
    }

    async getPersonalInformationTitle(){
        await this.page.waitForSelector(".complete-your-profile-modal__headline__title", {state:'visible'})
        return await this.page.locator(".complete-your-profile-modal__headline__title").textContent()
    }

    async fillCryptoPersonalInfo(){
        let randomUser = new RandomUser();
        await this.page.waitForTimeout(1000)
        await this.firstName.pressSequentially('TestN')
        await this.page.waitForTimeout(100)
        await this.lastName.pressSequentially('TestSN')
        await this.page.waitForTimeout(500)
        await this.userName.pressSequentially(await randomUser.randomUserName())
        await this.page.waitForTimeout(500)
        await this.phone.pressSequentially('603039647')
        await this.page.waitForTimeout(500)
        await this.submitBtn.click();
    }
    async acceptPopup(){
        await this.page.waitForSelector('.register-success-modal__title',{timeout:30000})
        await this.continueBtn.click();
    }

    async acceptAccountCreationPopup(){
        await this.page.waitForTimeout(500)
        await this.page.locator("//button[contains(@class, 'register-success-modal__button')]").click();
        await this.page.waitForTimeout(500)
    }
    async getSuccessfulMsg(){
        let text = await this.page.locator("//p[contains(@class, 'kyc-live-account_description')]").first()
        return await text.textContent()
    }

    async getVerificationMsg(){
        let text = await this.page.locator("//p[contains(@class, 'kyc-live-account_description')]").nth(1)
        return await text.textContent()
    }
    
}