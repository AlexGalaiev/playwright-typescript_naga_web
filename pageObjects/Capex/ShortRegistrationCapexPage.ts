import { Page } from "playwright";

export class ShortRegistrationCapex{
    page: Page

    constructor(page:Page){
        this.page = page
    }
    async open(url: string, page: string){
        await this.page.goto(url+'/'+page)
        await this.page.waitForTimeout(1000)
    }

    async createLeadUser(email:string){
        await this.page.locator("//h1[text()='Sign up & Start Trading']").waitFor({state:'visible'})
        await this.page.locator('//input[@name="firstName"]').pressSequentially('test')
        await this.page.waitForTimeout(500)
        await this.page.locator('//input[@name="lastName"]').pressSequentially('test')
        await this.page.waitForTimeout(500)
        await this.page.locator('//input[@name="email"]').pressSequentially(email)
        await this.page.waitForTimeout(500)
        await this.page.locator('//input[@name="password"]').pressSequentially('Test123!')
        await this.page.waitForTimeout(500)
        await this.installCountryCode('+387')
        await this.page.locator('//input[@name="phone"]').pressSequentially('603039647')
        await this.page.waitForTimeout(500)
        await this.page.locator('//input[@name="promo"]').pressSequentially('test')
        await this.page.waitForTimeout(500)
        await this.page.locator("//span[text()='Register Account']").click()
        await this.page.waitForTimeout(500)
    }

    async installCountryCode(countryCode:string){
        let code = await this.page.locator("//div[contains(@class, 'button-country-dropdown')]")
        await code.click()
        let input = await code.locator('//input')
        await input.clear()
        await input.pressSequentially(countryCode)
        await this.page.waitForTimeout(500)
    }
}