import { Locator, Page } from "@playwright/test";

export class YouAreInCrypto{
    page: Page
    continueBtn: Locator;

    constructor(page: Page){
        this.page = page
        this.continueBtn = page.locator("//button[contains(@class, 'register-success-modal__button')]")
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
}