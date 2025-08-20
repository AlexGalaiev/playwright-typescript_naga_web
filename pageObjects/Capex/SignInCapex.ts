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
}