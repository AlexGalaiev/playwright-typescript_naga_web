import { Locator, Page } from "playwright";

export class TwoAuthenfication{
    page: Page
    skipAuth: Locator;

    constructor(page: Page){
        this.page = page
        this.skipAuth = page.locator("//button[text()='Skip for now']")
    }

    async skipAuthenfication(){
        await this.page.waitForTimeout(2000)
        if(await this.skipAuth.isVisible()){
            await this.skipAuth.click()
        }
    }
}