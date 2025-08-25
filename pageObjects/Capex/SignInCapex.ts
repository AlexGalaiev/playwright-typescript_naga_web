import { Page } from "playwright";


export class SignInCapex{
    page: Page

    constructor(page: Page){
        this.page = page
    }
    async checkPageTitleIsVisible(){
        let title = await this.page.locator("//h1[text()='Sign In']")
        await title.waitFor({state:'visible'})
        return await title.isVisible()
    }
    async open(url: string, page: string){
        await this.page.goto(url+'/'+page)
        await this.page.waitForTimeout(1000)
    }
    async loginToPlatform(email:string, password: string){
        await this.page.locator('//input[@name="email"]').pressSequentially(email)
        await this.page.waitForTimeout(500)
        await this.page.locator('//input[@name="password"]').pressSequentially(password)
        await this.page.waitForTimeout(500)
        await this.page.locator("//span[text()='Sign In']").click()
        await this.page.waitForTimeout(500)
    }
    async openForgotPasswordPage(){
        await this.page.locator("//a[text()='Forgot Password?']").click()
        await this.page.waitForSelector('//input[@type="email"]', {state:'visible'})
    }
    async checkForgotPasswordResponse(email:string){
        let inputField = await this.page.locator('//input[@type="email"]')
        await this.page.waitForTimeout(1000)
        await inputField.pressSequentially(email)
        await this.page.waitForTimeout(500)
        const [response] = await Promise.all([
            this.page.waitForResponse("https://syn-api.capex.com/get_password_reset_link", {timeout:15000}),
            this.page.locator("//span[text()='Submit']").click()
        ])
        return await response
    }
    async getStatusCode(respone: any){
        let json = await respone.json()
        return await json.info.code
    }
    async getStatusMessage(respone: any){
        let json = await respone.json()
        return await json.info.message
    }
}