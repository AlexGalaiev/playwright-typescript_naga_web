import { Locator, Page } from "playwright/test";

export class TradeDetails{
    page: Page;
    readonly mainInfo: Locator;
    readonly depositAmount: Locator;
    readonly lots: Locator;
    readonly closeTradeBtn: Locator;
    readonly confirmCloseTrade: Locator;
    readonly confirmationPopupClosingPosition: Locator;

    constructor(page: Page){
        this.page = page;
        this.mainInfo = page.locator("trade-details__main-info")
        this.depositAmount = page.locator("//span[text()='Deposit']//..//span[contains(@class, 'amount')]")
        this.lots = page.locator("//span[text()='Lots']/following-sibling::*")
        this.closeTradeBtn = page.locator("//button[contains(@class, 'btn-success')]")
        this.confirmCloseTrade = page.locator("#confirm_close_trade")
        this.confirmationPopupClosingPosition = page.locator(".close-trade-warning__body")
    };
    async getDepositAmount(){
        return await this.depositAmount.textContent();
    };
    async getLots(){
        return await this.lots.textContent();
    };
    async clickCloseTrade(){
        return await this.closeTradeBtn.click()
    };
    async clickCloseTradeConfirm(){
        await this.confirmationPopupClosingPosition.waitFor({state:"visible"})
        await this.confirmCloseTrade.click()
    }
}