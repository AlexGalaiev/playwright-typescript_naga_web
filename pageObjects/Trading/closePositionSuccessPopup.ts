import { Locator, Page } from "@playwright/test";


export class ClosePositionSuccessPopup{
    page: Page;
    popupBody: Locator;
    popupInvestmentValue: Locator;
    lots: Locator;
    acceptBtn: Locator;

    constructor(page:Page){
        this.page = page
        this.popupBody = page.locator(".trade-modal__body")
        this.popupInvestmentValue = page.locator("//span[text()='Investment']//..//span[contains(@class, 'amount')]")
        this.lots = page.locator("//span[text()='Lots']//..//span[contains(@class, 'amount')]");
        this.acceptBtn = page.locator("#ot_ok_thx")
    };
    async getDeposit(){
        return await this.popupInvestmentValue.textContent()
    };
    async getLots(){
        return await this.lots.textContent()
    };
    async acceptPopup(){
        await this.acceptBtn.click()
    }
}