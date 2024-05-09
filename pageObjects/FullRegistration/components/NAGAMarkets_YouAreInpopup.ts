import { Locator, Page } from "@playwright/test";

export class YouAreInNagaMarkets{
    page: Page;
    readonly description: Locator;
    readonly openRealAccount: Locator;
    readonly explorePlatform: Locator;

    constructor(page: Page){
        this.page = page;
        this.description = page.locator(".register-success-modal__description")
        this.openRealAccount = page.locator("//button[contains(text(), 'Real Money')]")
        this.explorePlatform = page.locator("//button[contains(text(), 'Explore')]")
        
    }
    async getDescriptionText(){
        return await this.description.textContent();
    }
    async clickOpenRealMoneyAccount(){
        return await this.openRealAccount.click();
    }
    async clickExplorePlatform(){
        return await this.explorePlatform.click();
    }
    async openNagaPlatform(){
        await this.explorePlatform.click()
    }
}