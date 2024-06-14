import { Locator, Page } from "@playwright/test";

export class MyTrades{
    page: Page;
    readonly activeTradesTab: Locator;
    readonly activePendingOrdersTab: Locator;
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
    readonly gotItBtn: Locator;
    readonly removeNOrders: Locator;
    readonly accptanceOfRemovingOrders: Locator;
    readonly orderUnits: Locator;
    readonly orderTakeProfit: Locator;
    readonly orderStopLoss: Locator;
    
    constructor(page: Page){
        this.page = page;
        this.activeTradesTab = page.locator("#my-active-trades")
        this.activePendingOrdersTab = page.locator("#my-pending-trades")
        //position values
        this.depositValue = page.locator("//div[contains(@class, 'my-trades-table__deposit')]//span[contains(@class, 'amount')]")
        this.units = page.locator("//div[contains(@class, 'my-trades-table__row')]//div[contains(@class, 'units-active')]")
        this.tp = page.locator("//div[contains(@class, 'limits-active')]")
        this.sl = page.locator("//div[contains(@class, 'entry-price-active')]//span[@class='not-set']")
        //orders values
        this.orderUnits = page.locator("//div[contains(@class, 'my-trades-table__row')]//div[contains(@class, 'units-pending')]")
        this.orderTakeProfit = page.locator("//div[contains(@class, 'my-trades-table__row')]//div[contains(@class, 'limits-pending')]")
        this.orderStopLoss = page.locator("//div[contains(@class, 'my-trades-table__limits entry-price-pending')]")
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
        this.removeNOrders = page.locator("//div[@class='close-multiple-trades-actions']//button[contains(text(), 'Remove')]");
        this.accptanceOfClosingPositions = page.locator("//div[@class='close-multiple-trades-modal__header-actions']//button[contains(text(), 'Close')]")
        this.accptanceOfRemovingOrders = page.locator("//div[@class='close-multiple-trades-modal__header-actions']//button[contains(text(), 'Remove')]")
        this.emptyPage = page.locator(".no-data__title");
        this.gotItBtn = page.locator("//button[text()='Got it']")
    }
    async checkActiveTradesHasAttribute(){
        let attributes = await this.activeTradesTab.getAttribute("class")
        return attributes
    }
    async checkActiveOrdersHasAttribute(){
        return await this.activePendingOrdersTab.getAttribute("class")
    }
    async getDepositValue(){
        await this.depositValue.waitFor({state:"visible"})
        return await this.depositValue.textContent();
    };
    async getUnits(){
        await this.units.waitFor({state:"visible"})
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
        await this.page.waitForTimeout(5000)
        let existPosition = await this.itemList.isVisible()
        if(existPosition === true){
            await this.closeMultiplePositions.click();
            await this.selectAll.click();
            await this.closeNTrades.click();
            await this.accptanceOfClosingPositions.waitFor({state:"visible"});
            await this.accptanceOfClosingPositions.click()
            await this.gotItBtn.click()
        }else{
            await this.getEmptyPageText() === "No Active Trades"
        }
    };
    async openActivePendingOrdersTab(){
        await this.activePendingOrdersTab.click()
    };
    async removeOrdersIfExist(){
        await this.page.waitForTimeout(5000)
        let existPosition = await this.itemList.isVisible()
        if(existPosition === true){
            await this.closeMultiplePositions.click();
            await this.selectAll.click();
            await this.removeNOrders.click()
            await this.accptanceOfRemovingOrders.waitFor({state:"visible"});
            await this.accptanceOfRemovingOrders.click()
            await this.gotItBtn.click()
        }else{
            await this.getEmptyPageText() === "No Active Trades"
        }
    };
    async getOrderUnits(){
        return await this.orderUnits.textContent()
    }
    async getOrderTakeProfit(){
        return await this.orderTakeProfit.textContent();
    };
    async getOrderStopLoss(){
        return await this.orderStopLoss.textContent();
    }

}