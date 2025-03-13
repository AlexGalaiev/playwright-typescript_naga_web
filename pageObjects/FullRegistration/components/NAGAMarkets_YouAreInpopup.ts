import { Locator, Page } from "@playwright/test";

export class YouAreInNagaMarkets{
    page: Page;
    readonly description: Locator;
    readonly openRealAccount: Locator;
    readonly explorePlatform: Locator;
    readonly depositNow: Locator;

    constructor(page: Page){
        this.page = page;
        this.description = page.locator(".register-success-modal__description")
        this.openRealAccount = page.locator("//button[contains(text(), 'Real Money')]")
        this.explorePlatform = page.locator("//button[contains(text(), 'Explore')]")
        this.depositNow = page.locator("//button[text()='Deposit Now']")
        
    }
    async getDescriptionText(){
        return await this.description.textContent();
    }
    async clickOpenRealMoneyAccount(){
        return await this.openRealAccount.click();
    }
    async clickExplorePlatform(){
        await this.explorePlatform.click();
        await this.page.waitForTimeout(500)
    }
    async openNagaPlatform(){
        await this.explorePlatform.click()
    }
    async openNagaKyc(){
        let openKycBtn = await this.page.locator("//button[text()='Open Real Money NAGA Account']")
        await openKycBtn.waitFor({state:"visible"})
        await openKycBtn.click()
    }
    async checkExploreBtn(){
        return await this.explorePlatform.isVisible()
    }
    async clickDepositNow(){
        await this.depositNow.click()
    }
}