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
    readonly direction: Locator;
    
    constructor(page: Page){
        this.page = page;
        this.popupBody = page.locator(".trade-modal__body")
        this.popupHeader = page.locator(".trade-modal__type")
        this.investmentAmount = page.locator("//span[text()='Investment']//..//span[contains(@class, 'amount')]")
        this.lots = page.locator("//span[text()='Lots']//..//span[contains(@class, 'amount')]")
        this.MaxProfitWithValue = page.locator("//div[text()='Max. Profit']//..//span[contains(@class, 'amount')]")
        this.MaxLossWithValue = page.locator("//div[text()='Max. Loss']//..//span[contains(@class, 'amount')]")
        this.thankYouBtn = page.locator("#ot_ok_thx")
        this.direction = page.locator("//div[@class='modal-trade-summary__buy-sell']//div[@class='modal-trade-summary__direction']")
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
    };
    async getTakeProfitValue(){
        return await this.MaxProfitWithValue.textContent()
    }
    async getDirection(){
        return await this.direction.textContent()
    }
    async getProtectionValue(protectionType: string){
        let element = await this.page.locator('.modal-trade-summary__price-notice', {hasText: protectionType})
        return await element.textContent()
    }
} 