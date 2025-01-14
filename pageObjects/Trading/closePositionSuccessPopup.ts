import { Locator, Page } from "@playwright/test";


export class ClosePositionSuccessPopup{
    page: Page;
    popupBody: Locator;
    popupInvestmentValue: Locator;
    lots: Locator;
    acceptBtn: Locator;
    rate: Locator;

    constructor(page:Page){
        this.page = page
        this.popupBody = page.locator(".trade-modal__body")
        this.popupInvestmentValue = page.locator("//span[text()='Investment']//..//span[contains(@class, 'amount')]")
        this.lots = page.locator("//span[text()='Lots']//..//span[contains(@class, 'amount')]");
        this.rate = page.locator("//span[text()='Planned Entry Price']//..//span[contains(@class, 'amount')]//span")
        this.acceptBtn = page.locator("#ot_ok_thx")
    };
    async getDeposit(currency: string){
        let value = await this.popupInvestmentValue.textContent()
        return await value?.replace(currency, '')
    };
    async getLots(){
        return await this.lots.textContent()
    };
    async acceptPopup(){
        await this.acceptBtn.click()
    };
    async getRate(){
        return await this.rate.textContent();
    }
}