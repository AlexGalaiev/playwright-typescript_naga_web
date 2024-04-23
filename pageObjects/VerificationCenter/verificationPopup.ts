import { Locator, Page } from "@playwright/test";

export class VerificationPopup{
    page: Page;
    readonly verificationPopup: Locator

    constructor(page: Page){
        this.page = page;
        this.verificationPopup = page.locator("//div[contains(@class, 'document-verification-capital_wrapper')]")
    }
    async verificationPoupIsDisplyed(){
        await this.verificationPopup.waitFor({timeout:1500});
        return this.verificationPopup
    }
    
}