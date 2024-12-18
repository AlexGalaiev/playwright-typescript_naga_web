import { Locator, Page } from "playwright/test";

export class UdpateAccount{
    page: Page;
    readonly finishBtn: Locator;
    readonly kycForm: Locator;

    constructor(page: Page){
        this.page = page;
        this.finishBtn = page.locator("//button[contains(@class, 'kyc-live-account-capital_submitButton')]");
        this.kycForm = page.locator("//form[@class='kyc-live-account-capital_wizard__3kC_k']")
    }

    async clickFinishBtn(){
        await this.kycForm.waitFor({state:'visible'})
        await this.finishBtn.scrollIntoViewIfNeeded()
        await this.finishBtn.click()
    }
}