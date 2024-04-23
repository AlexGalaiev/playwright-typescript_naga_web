import {Page, Locator} from "@playwright/test"

export class AllSetPopup{
    readonly AllSetUpPopup: Locator;
    readonly depositNowBtn: Locator;

    constructor(page: Page){
        this.AllSetUpPopup = page.locator("//div[@class='kyc-all-set-modal__body modal-body']")
        this.depositNowBtn = page.locator("//button[contains(@class, 'btn-primary')]")
    }

    async clickDepositNow(){
        await this.depositNowBtn.click();
    }
}