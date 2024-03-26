import { Locator, Page } from "playwright/test";

export class IncreaseDepositPopup{
    page: Page;
    continueBtn: Locator;
    
    constructor(page: Page) {
        this.page = page;
        this.continueBtn = page.locator("//div[contains(@class, 'footer-wrapper')]//button[contains(@class, 'btn-secondary')]");        
    };

    async continueRegistration(){
        await this.continueBtn.waitFor({timeout:3000});
        return this.continueBtn.click();
    }
}