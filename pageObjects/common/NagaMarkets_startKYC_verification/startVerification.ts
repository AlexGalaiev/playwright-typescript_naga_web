import { Locator, Page } from "@playwright/test";

export class startVerification_NagaMarkets{
    page: Page;
    readonly kycIntroduction: Locator
    readonly kycCategorizationBtn: Locator
    readonly kycContent: Locator;
    readonly kycWarning: Locator;
    readonly kycCategorizationPopup: Locator;

    constructor(page: Page){
        this.page = page;
        this.kycIntroduction = page.locator('.kyc-introduction__title')
        this.kycCategorizationBtn = page.locator("//div[@class='kyc-introduction__account-types']//span")
        this.kycContent = page.locator(".kyc-introduction__content")
        this.kycWarning = page.locator("//div[@class='kyc-introduction__warning']//p")
        this.kycCategorizationPopup = page.locator("//div[contains(@class, 'types-modal__header')]")
    }
    async getKycIntroductionText(){
        return await this.kycIntroduction.innerText()
    }
    async getKycContent(){
        return await this.kycContent.textContent()
    } 
    async getKycWarning(){
        return await this.kycWarning.textContent()
    }
    async openKYCKategorizationBanner(){
        await this.kycCategorizationBtn.click()
    }
    async getKYCCategorizationPopup(){
        return await this.kycCategorizationPopup
    }
}