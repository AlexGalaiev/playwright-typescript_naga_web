import { Locator, Page } from "@playwright/test";

export class ChangeLimitSuccessPopup{
    page: Page;
    readonly popupBody: Locator;
    readonly popupHeader: Locator;
    readonly investmentAmount: Locator;
    readonly lots: Locator;
    readonly MaxProfitWithValue: Locator;
    readonly MaxLossWithValue: Locator;
    readonly thankYouBtn: Locator
    
    constructor(page: Page){
        this.page = page;
        this.popupBody = page.locator(".trade-modal__body")
        this.popupHeader = page.locator(".trade-modal__type")
        this.investmentAmount = page.locator("//span[text()='Investment']//..//span[contains(@class, 'amount')]")
        this.lots = page.locator("//span[text()='Lots']//..//span[contains(@class, 'amount')]")
        this.MaxProfitWithValue = page.locator("//div[text()='Max. Profit']//..//span[contains(@class, 'amount')]")
        this.MaxLossWithValue = page.locator("//div[text()='Max. Loss']//..//span[contains(@class, 'amount')]")
        this.thankYouBtn = page.locator("#ot_ok_thx")
    }
    async getInvesctmentsAmount(){
        await this.popupBody.waitFor({state:"visible"})
        return await this.investmentAmount.textContent();
    };
    async getLotsAmount(){
        return await this.lots.textContent()
    };
    async getStopLossValue(){
        return await this.MaxLossWithValue.textContent()
    };
    async acceptPopup(){
        return await this.thankYouBtn.click()
    }
} 