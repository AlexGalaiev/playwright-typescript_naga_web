import { Page } from "@playwright/test";

export class NagaX_KYC{
    page: Page;

    constructor(page: Page){
        this.page = page
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
}