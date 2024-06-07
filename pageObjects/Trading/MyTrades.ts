import { Locator, Page } from "@playwright/test";

export class MyTrades{
    page: Page;
    readonly activeTradesTab: Locator;
    readonly depositValue: Locator;
    readonly units: Locator;
    readonly tp: Locator;
    readonly sl: Locator;
    readonly dropdownActions: Locator;
    readonly optionDropdown: Locator;
    readonly changeLimits: Locator;
    readonly closeMultiplePositions: Locator;
    readonly itemList: Locator;
    readonly selectAll: Locator;
    readonly closeNTrades: Locator;
    readonly accptanceOfClosingPositions: Locator;
    readonly tradeDetails: Locator;
    readonly emptyPage: Locator;

    constructor(page: Page){
        this.page = page;
        this.activeTradesTab = page.locator("#my-active-trades")
        //position values
        this.depositValue = page.locator("//div[contains(@class, 'my-trades-table__deposit')]//span[contains(@class, 'amount')]")
        this.units = page.locator("//div[contains(@class, 'my-trades-table__row')]//div[contains(@class, 'units-active')]")
        this.tp = page.locator("//div[contains(@class, 'limits-active')]")
        this.sl = page.locator("//div[contains(@class, 'entry-price-active')]//span[@class='not-set']")
        //dropdown actions
        this.dropdownActions = page.locator(".dropdown-navigation-items")
        this.optionDropdown = page.locator("//button[contains(@id, 'dropdown-basic')]")
        this.changeLimits = page.locator("//span[text()='Change Limits']")
        this.tradeDetails = page.locator("//span[text()='Trade Details']")
        //close all positions
        this.closeMultiplePositions = page.locator("//i[contains(@class, 'icn-folder-remove')]//..")
        this.itemList = page.locator("[data-test-id='virtuoso-item-list']")
        this.selectAll = page.locator("//span[text()='Select All']")
        this.closeNTrades = page.locator("//div[@class='close-multiple-trades-actions']//button[contains(text(), 'Close')]");
        this.accptanceOfClosingPositions = page.locator("//div[@class='close-multiple-trades-modal__header-actions']//button[contains(text(), 'Close')]")
        this.emptyPage = page.locator(".no-data__title")
    }
    async checkActiveTradesHasAttribute(){
        let attributes = await this.activeTradesTab.getAttribute("class")
        return attributes
    }
    async getDepositValue(){
        return await this.depositValue.textContent();
    };
    async getUnits(){
        return await this.units.textContent()
    }
    async getTakeProfit(){
        return await this.tp.textContent()
    };
    async getStopLoss(){
        return await this.sl.textContent()
    };
    async openChangeLimitPopup(){
        await this.optionDropdown.click();
        await this.changeLimits.click();
    };
    async openTradeDetails(){
        await this.optionDropdown.click();
        await this.tradeDetails.click();
    };
    async getEmptyPageText(){
        return await this.emptyPage.textContent()
    }
    async closePositionsIfExist(){
        if(await this.itemList.isVisible()){
            await this.closeMultiplePositions.click();
            await this.selectAll.click();
            await this.closeNTrades.click();
            await this.accptanceOfClosingPositions.waitFor({state:"visible"});
            await this.accptanceOfClosingPositions.click()
        }else{
            await this.getEmptyPageText() === "No Active Trades"
        }
    }
}