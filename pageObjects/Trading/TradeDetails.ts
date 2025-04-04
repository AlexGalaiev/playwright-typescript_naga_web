import { Locator, Page } from "playwright/test";

export class TradeDetails{
    page: Page;
    readonly mainInfo: Locator;
    readonly depositAmount: Locator;
    readonly lots: Locator;
    readonly closeTradeBtn: Locator;
    readonly confirmCloseTrade: Locator;
    readonly confirmationPopupClosingPosition: Locator;
    readonly tradeDetailsPopupInfo: Locator

    constructor(page: Page){
        this.page = page;
        this.mainInfo = page.locator("trade-details__main-info")
        this.depositAmount = page.locator("//span[text()='Deposit']//..//span[contains(@class, 'amount')]")
        this.lots = page.locator("//span[text()='Lots']/following-sibling::*")
        this.closeTradeBtn = page.locator("//button[contains(@class, 'btn-success')]")
        this.confirmCloseTrade = page.locator("#confirm_close_trade")
        this.confirmationPopupClosingPosition = page.locator(".close-trade-warning__body")
        this.tradeDetailsPopupInfo = page.locator('.trade-details__detail-info')
    };
    async getDepositAmount(){
        return await this.depositAmount.textContent();
    };
    async getLots(){
        await this.page.waitForTimeout(500)
        return await this.lots.textContent();
    };
    async clickCloseTrade(){
        return await this.closeTradeBtn.click()
    };
    async clickCloseTradeConfirm(){
        await this.confirmationPopupClosingPosition.waitFor({state:"visible"})
        await this.confirmCloseTrade.click()
    }
    async getMobileLots(){
        await this.tradeDetailsPopupInfo.waitFor({state:'visible'})
        await this.page.waitForTimeout(250)
        let lots = await this.page.locator("//span[text()='Lots']/following-sibling::span")
        return await lots.textContent()
    }
    async closePosition(){
        await this.page.waitForSelector("#close_trader_button", {state:'visible'})
        await this.page.locator("#close_trader_button").click()
        await this.page.waitForSelector("//div[@class='close-trade-warning__close-action']//button", {state:'visible'})
        await this.page.locator("//div[@class='close-trade-warning__close-action']//button").click()
    }
    async getMobileProtectionValue(nameOfProtection: string){
        let bar = await this.page.locator(".progress-indicator-values")
        let value = await bar.locator(`//span[text()='${nameOfProtection}']//..//span[contains(@class, 'amount')]`)
        return await value.textContent()
    }
    async acceptOfClosingPosiion(){
        await this.page.waitForSelector("//div[@class='close-trade-warning__close-action']//button", {state:'visible'})
        await this.page.locator("//div[@class='close-trade-warning__close-action']//button").click()
        await this.page.locator("#ot_ok_thx").click()
    }
    async openEditLimitsPopup(){
        let editLimitsBtn = await this.page.locator("//button[text()='Change Limits']")
        await editLimitsBtn.waitFor({state:"visible"})
        await editLimitsBtn.scrollIntoViewIfNeeded()
        await editLimitsBtn.click()
    }
    async getDateOfOpenedPosition(){
        await this.tradeDetailsPopupInfo.waitFor({state:'visible'})
        await this.page.waitForTimeout(500)
        let date = await this.page.locator("//span[text()='Open Time']//following-sibling::span").textContent()
        return await date
    }
    async getTradeOwner(){
        return await this.page.locator('.trade-owner__text__username').textContent()
    }
}