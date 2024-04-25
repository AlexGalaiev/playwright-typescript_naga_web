import {Page, Locator} from "@playwright/test"

export class AllSetPopup{
    page: Page;
    readonly AllSetUpPopup: Locator;
    readonly depositNowBtn: Locator;

    constructor(page: Page){
        this.page = page;
        this.AllSetUpPopup = page.locator("//div[@class='kyc-all-set-modal__body modal-body']")
        this.depositNowBtn = page.locator("//button[contains(@class, 'btn-primary')]")
    }

    async clickDepositNow(){
        await this.depositNowBtn.click();
        await this.page.waitForTimeout(2000)
    }
}