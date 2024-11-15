import { Page } from "playwright";

export class TwoAuthenfication{
    page: Page

    constructor(page: Page){
        this.page = page
    }

    async skipAuthenfication(){
        await this.page.waitForSelector("//button[text()='Skip for now']", {state:'visible'})
        await this.page.locator("//button[text()='Skip for now']").click()
    }
}