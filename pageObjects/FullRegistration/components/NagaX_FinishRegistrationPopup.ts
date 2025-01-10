import { Page } from "@playwright/test";

export class FinishPopup{
    page: Page

    constructor(page:Page){
        this.page = page
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
