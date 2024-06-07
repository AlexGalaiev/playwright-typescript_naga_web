import { Locator, Page } from "@playwright/test";


export class ChangeLimitsPopup{
    page: Page;
    readonly changeLimitPopup: Locator;
    readonly instrumentName: Locator;
    readonly investmentAmount: Locator;
    readonly specificRateCheckbox: Locator;
    readonly stopLossSwitcher: Locator;
    readonly takeProfit: Locator;
    readonly updateBtn: Locator;
    
    constructor(page: Page){
        this.page = page;
        this.changeLimitPopup = page.locator(".change-trade-limits__body");
        this.instrumentName = page.locator(".trade-symbol__name");
        this.investmentAmount = page.locator("//span[text()='Invested:']//..//span[contains(@class, 'amount')]")
        this.specificRateCheckbox = page.locator("//input[@value='rate']")
        this.stopLossSwitcher = page.locator("//span[text()='Stop Loss']//..//..//label[contains(@class, 'switch')]")
        this.takeProfit = page.locator("//span[text()='Take Profit']//..//..//label[contains(@class, 'switch')]")
        this.updateBtn = page.locator("//button[contains(@class, 'limits-update')]")
    }
    async getInstrumentName(){
        return await this.instrumentName.textContent()
    }
    async getInvestedAmount(){
        return await this.investmentAmount.textContent();
    };
    async enableStopLoss(){
        await this.stopLossSwitcher.click()
        await this.page.waitForTimeout(250);
        await this.updateBtn.click()
    };
    async enableTakeProgit(){
        await this.takeProfit.click()
        await this.page.waitForTimeout(250);
        await this.updateBtn.click()
    };
    async updatePosition(){
        return await this.updateBtn.click();
    }

}