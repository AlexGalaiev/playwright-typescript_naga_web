import { Page } from "@playwright/test";

export class NagaXAddPopup{
    page: Page;

    constructor(page: Page){
        this.page = page
    }

    async acceptLoginPopup(){
        await this.page.waitForSelector('.prompt__header__title', {state:'visible'})
        await this.page.locator("//div[@class='prompt__actions']//button").click();
        await this.page.waitForTimeout(2000)
    }
    async acceptTermsConditions(){
        await this.page.locator("//button[text()='Continue']").click()
        await this.page.waitForTimeout(1000)
    }
}