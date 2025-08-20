import { Page } from "playwright";

export class MainPageCapex{
    page: Page

    constructor(page: Page){
        this.page = page
    }

    async waitForMainPage(){
        await this.page.waitForTimeout(500)
        await this.page.locator("//div[contains(@class, 'page-header')]").first().waitFor({state:'visible'})
    }

    async userLogOut(){
        await this.page.locator('.icon-logout').click()
    }
}
