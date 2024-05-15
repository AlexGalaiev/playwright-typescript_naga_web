import { Locator, Page } from "playwright/test";

export class KYC_Start{
    page: Page
    readonly headerText: Locator;
    readonly description: Locator;
    readonly desclaimer: Locator;
    readonly accountsTypes: Locator;
    readonly startVerificationBtn: Locator;

    constructor(page: Page){
        this.page = page;
        this.headerText = page.locator(".kyc-introduction__title")
        this.description = page.locator(".kyc-introduction__content")
        this.desclaimer = page.locator("//div[@class='kyc-introduction__warning']//p")
        this.accountsTypes = page.locator(".kyc-introduction__account-types")
        this.startVerificationBtn = page.locator(".kyc-introduction__btn")
    }
    async getIntroductionText(){
        return await this.headerText.textContent();
    }
    async getDescriptionText(){
        return await this.description.textContent();
    }
    async getDisclaimertext(){
        return await this.desclaimer.textContent();
    }
    async openAccountsTypes(){
        await this.accountsTypes.click();
    }
    async clickStartVerificationBtn(){
        await this.startVerificationBtn.click()
    }
}