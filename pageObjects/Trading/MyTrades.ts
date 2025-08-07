import { Locator, Page } from "@playwright/test";
import { MainPage } from "../MainPage/MainPage";
import { TradeDetails } from "./TradeDetails";

export class MyTrades{
    page: Page;
    readonly activeTradesTab: Locator;
    readonly activePendingOrdersTab: Locator;
    readonly openedPosition: Locator;
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
//readonly orderUnits: Locator;
    readonly orderTakeProfit: Locator;
    readonly orderStopLoss: Locator;
    readonly openedMobilePosition: Locator;
    readonly closeTradesTab: Locator;
    
    constructor(page: Page){
        this.page = page;
        this.activeTradesTab = page.locator("#my-active-trades")
        this.activePendingOrdersTab = page.locator("#my-pending-trades")
        //position values
        this.openedPosition = page.locator("//div[contains(@class, 'my-trades-table__row')]")
        this.openedMobilePosition = page.locator("//div[contains(@class, 'my-trades-table-mobile__row')]")
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
        this.closeTradesTab = page.locator("#my-closed-trades")
    }
    // new
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
    async checkStatusOfElement(element: Locator){
        return await element.getAttribute('class')
    }
    async getDepositValue(currency: string){
        await this.openedPosition.waitFor({state:"visible"})
        let value = await this.openedPosition.locator("//div[contains(@class, 'deposit-active')]//span//span").first().textContent();
        return await value?.replace(currency, '')
    }
    async getMobileDepositValue(currency: string){
        await this.openedMobilePosition.waitFor({state:"visible"})
        let value = await this.openedMobilePosition.locator("//div[@class='my-trades-table-mobile__deposit']//span[contains(@class, 'amount')]").textContent();
        return await value?.replace(currency, '')
    };
    async getUnits(){
        await this.openedPosition.waitFor({state:"visible"})
        return await this.openedPosition.locator("//div[contains(@class, 'units-active')]").first().textContent();
    }
    async getMobileUnits(){
        await this.openedMobilePosition.waitFor({state:"visible"})
        return await this.openedMobilePosition.locator("//div[@class='my-trades-table-mobile__entry-price']").textContent()
    }
    async getProtectionValue(NameOfProtection: string, currency:string){
        await this.openedPosition.waitFor({state:"visible"})
        let value = await this.openedPosition.locator(`//div[@class='${NameOfProtection}-in-currency']//span//span`).textContent()
        return await value?.replace(currency,'')
    }
    async getMobileProtectionValue(NameOfProtection: string){
        await this.openedMobilePosition.waitFor({state:'visible'})
        let value = await this.openedMobilePosition.locator(`//div[@class='${NameOfProtection}']`).textContent()
        return value
    }
    async closePosition(){
        await this.page.locator("//i[contains(@class, 'trade-actions__close')]").click()
        await this.page.waitForSelector("#confirm_close_trade", {state:'visible'});
        await this.page.locator('#confirm_close_trade').click()
        await this.page.waitForTimeout(1000)
    }
    async openActivePendingOrdersTab(){
        await this.activePendingOrdersTab.click()
    };
    async getRate(){
        await this.openedPosition.waitFor({state:"visible"})
        return await this.openedPosition.locator("//div[contains(@class, 'my-trades-table__entry-price')]//span//span").textContent()
    }
    async deleteOrder(){
        await this.page.locator("//i[contains(@class, 'trade-actions__close')]").click()
        await this.page.waitForSelector("#confirm_close_trade", {state:'visible'})
        await this.page.locator('#confirm_close_trade').click();
    }
    async getOrderUnits(){
        await this.openedPosition.waitFor({state:"visible"})
        return await this.openedPosition.locator("//div[contains(@class, 'units-pending')]").textContent()
    }
    async getOrdersRate(){
        await this.openedPosition.waitFor({state:"visible"})
        return await this.openedPosition.locator("//div[contains(@class, 'my-trades-table__entry-price')]//span//span").textContent()
    }
    async getMobileOrderRate(){
        let orderValue = await this.page.locator("//div[@class='my-trades-table-mobile__open-price']//span[contains(@class, 'amount')]")
        return await orderValue.textContent()
    }
    async openChangeLimitPopup(){
        await this.optionDropdown.click();
        await this.changeLimits.click();
    }
    async openTradeDetails(){
        await this.optionDropdown.click();
        await this.tradeDetails.click();
    }
    async openMobileTradeDetails(){
        await this.page.locator("//div[contains(@class, 'my-trades-table-mobile__row')]").waitFor({state:'visible'});
        await this.page.locator("//div[contains(@class, 'my-trades-table-mobile__row')]").click()
    }
    async getEmptyPageText(){
        return await this.emptyPage.textContent()
    }
    async emptyPageTextIsVisible(){
        await this.page.waitForTimeout(1000)
        return await this.emptyPage.isVisible()
    }
    
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
    
    async getOrderTakeProfit(){
        return await this.orderTakeProfit.textContent();
    };
    async getOrderStopLoss(){
        return await this.orderStopLoss.textContent();
    }
    async getStopLossValue(){
       return await this.page.locator("//div[contains(@class, 'my-trades-table__limits')]//div[@class='sl']").textContent()
    }
    async closeMobilePositionsIfExist(){
        await this.page.waitForTimeout(3000)
        let openedPosition = await this.page.locator("//div[contains(@class, 'my-trades-table-mobile__row')]").first()
        while (await openedPosition.isVisible()){
            await openedPosition.click();
            await this.page.waitForSelector("#close_trader_button",{state:'visible'})
            await this.page.locator("#close_trader_button").click()
            await this.page.waitForSelector("#confirm_close_trade", {state:'visible'})
            await this.page.locator("#confirm_close_trade").click()
            await this.page.locator("//button[text()='Ok, thanks!']").click()
            await this.page.locator("//button[text()='Back']").click()
            await this.page.waitForTimeout(2000)
        }
    }
    async clickMobilePositionAndOpenTradedetails(){
        await this.openedMobilePosition.click()
    }

    async getSourceOfOpenedPosition(nameOfInstrument: string){
        let position = await this.page.locator("//div[contains(@class, 'my-trades-table__row')]", {has: await this.page.locator(`//div[@title='${nameOfInstrument}']`)}).first()
        let source = await position.locator("//div[contains(@class, 'my-trades-table__trade-source')]").textContent()
        return await source
    }

    async getMobileSourceOfOpenedPosition(nameOfInstrument: string){
        let position = await this.page.locator("//div[contains(@class, 'my-trades-table-mobile__row')]", {has: await this.page.locator(`//div[@title='${nameOfInstrument}']`)}).first()
        let source = await position.locator("//div[contains(@class, 'my-trades-table-mobile__trade-source')]")
        return await source.textContent()
    }
    async refreshPage(){
        await this.page.reload()
        await this.page.waitForTimeout(1000)
    }
    async getDateOfOpenedPosition(){
        return await this.page.locator("//div[@class='my-trades-table__time time-active']").textContent()
    }
    async openCloseTradesTab(){
        await this.closeTradesTab.click()
        await this.openedPosition.first().waitFor({state:'visible'})
        await this.page.waitForTimeout(1000)
    }
    async openMobileCloseTradesTab(){
        await this.closeTradesTab.click()
        await this.page.waitForTimeout(1000)
    }
    async openLastTrade(instrumentName: string){
        await this.openedPosition.first().waitFor({state:'visible'})
        let instrumentContainer = await this.page.locator("//div[contains(@class, 'my-trades-table__row')]", {has: 
            await this.page.locator(`//div[text()='${instrumentName}']`)
        }).first()
        await instrumentContainer.click()
        let date = await new TradeDetails(this.page).getDateOfOpenedPosition()
        let time = date?.split(', ')[1]
        return await time
    }
    async getMobileSourceOftrade(){
        await this.page.waitForTimeout(500)
        return await this.page.locator("//div[contains(@class, 'my-trades-table-mobile__trade-source')]").textContent()
    }
    async openMobileClosedPositionsTab(){
        await this.closeTradesTab.click()
        await this.openedMobilePosition.first().waitFor({state:'visible'})
    }
    async openClosedPositionTab(){
        await this.page.locator("#my-closed-trades").click()
        await this.page.waitForTimeout(500)
    }
    async setFilterDate(filerDate: string){
        //open calendar
        await this.page.locator("#startDate").click()
        let datePicker = await this.page.locator("//div[contains(@class, 'DayPicker_transitionContainer')]")
        await datePicker.waitFor({state:'visible'})
        await this.page.waitForTimeout(2000)
        //choose filter
        await this.page.locator(`//button[text()='${filerDate}']`).click()
        await this.page.waitForTimeout(3000)
    }
    async getNumberOfClosedTrades(){
        await this.page.waitForTimeout(2000)
        let tradeSummary = await this.page.locator(".trades-summary__value").first()
        return await tradeSummary.textContent()
    }
    async openTypeFilter(){
        await this.page.waitForTimeout(500)
        await this.page.locator("//button[contains(@class, 'trades-filter__dropdown-link')]").click()
        await this.page.waitForTimeout(500)
    }
    async setTypeOfClosedPosition(typeName: string){
        let menu = await this.page.locator('//ul[@role="menu"]')
        //await this.page.locator("//button[contains(@class, 'trades-filter__dropdown-link')]").click()
        await menu.waitFor({state:'visible'})
        await menu.locator(`//label[text()='${typeName}']`).click()
        await this.page.waitForTimeout(1500)
    }
    async checkSourceOfTradeVisibility(nameOfTrade){
        return await this.page.locator(`//div[text()='${nameOfTrade}']`).isVisible()
    }
    async checkMobilePositionIsVisible(){
        let position = await this.page.locator("//div[contains(@class, 'my-trades-table-mobile__row')]").first()
        return await position.isVisible()
    }
    async getInstrumentName(){
        return await this.page.locator(".my-trades-table__symbol-name").textContent()
    }
    async getMobileInstrumentName(){
        return await this.page.locator(".my-trades-table-mobile__symbol-name").textContent()
    }
}