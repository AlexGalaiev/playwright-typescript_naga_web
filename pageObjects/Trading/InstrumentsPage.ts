import { expect } from "@playwright/test";
import { Locator, Page } from "playwright";


export class AllInstruments{
    page: Page;
    readonly searchInstrumentField: Locator;
    readonly foundInstrumentFromSearch: Locator;
    readonly foundInstrumentName: Locator;
    readonly foundInstrumentSellBtn: Locator;
    readonly foundInstrumentBuyBtn: Locator;
    readonly foundInstrumentAddtoWatchlist: Locator;
    readonly watchlistTab: Locator;
    readonly watchlistedInstrument: Locator;
    readonly removeFromWatchlist: Locator;
    readonly emptyWatchlistHeader: Locator;
    readonly emptyWatchlistText: Locator;
    readonly addPriceAlert: Locator;

    constructor(page: Page){
        this.page = page;
        this.searchInstrumentField = page.locator("//div[@class='symbol-search']//input");
        this.foundInstrumentFromSearch = page.locator(".symbol-row");
        this.foundInstrumentName = page.locator("//div[contains(@class, 'symbol-name-container')]//div");
        this.foundInstrumentSellBtn = page.locator("//div[@class='buy-sell-container']//div[@data-type='SELL']");
        this.foundInstrumentBuyBtn = page.locator("//div[@class='buy-sell-container']//div[@data-type='BUY']");
        this.foundInstrumentAddtoWatchlist = page.locator("//div[@class='symbol-favorite-container']//button");
        this.watchlistTab = page.locator("#favorites_symbol_type")
        this.watchlistedInstrument = page.locator("//div[@class='symbol-container__name']//div")
        this.removeFromWatchlist = page.locator("//i[contains(@class, 'remove-favorites')]")
        this.emptyWatchlistHeader = page.locator("//div[@class='no-data__title']")
        this.emptyWatchlistText = page.locator("//div[@class='no-data__description']")
        this.addPriceAlert = page.locator("//div[@class='symbol-row']//i[contains(@class,'icn-price-alert')]")
    }

    async searchInstrument(NameOfInstrument: string){
        await this.searchInstrumentField.pressSequentially(NameOfInstrument)
        await this.page.waitForTimeout(500);
    };
    async addToWatchlist(NameOfInstrument: string){
        //await this.foundInstrumentName.textContent() === NameOfInstrument;
        await this.foundInstrumentAddtoWatchlist.first().click();
        await this.page.waitForTimeout(1000)
    };
    async openWatclistTab(){
        await this.watchlistTab.click();
    };
    async getWatchlistedInstrumentName(){
        return await this.watchlistedInstrument.textContent()
    };
    async removeInstrumentFromWatclist(){
        await this.removeFromWatchlist.click();
        await this.page.waitForTimeout(1000)
    };
    async getEmptyWatchlistHeader(){
        return await this.emptyWatchlistHeader.textContent();
    };
    async getEmptyWatchlistText(){
        return await this.emptyWatchlistText.textContent();
    };
    async addPriceAlertToInstrumnet(){
        await this.addPriceAlert.first().click();
        await this.page.waitForTimeout(500)
    };

//new 
    async openPositionOfInstrument(instrumentName: string, positionType: string){
        await this.searchInstrumentField.pressSequentially(instrumentName)
        await this.page.waitForTimeout(500);
        let instrumentContainer = await this.page.locator(".symbol-row", 
            {has: await this.page.locator(`//div[@class = 'symbol-name-container']//div[text()='${instrumentName}']`)})
        let instrument = await instrumentContainer.first();
        let position = await instrument.locator(`//button[text()='${positionType}']`)
        await position.first().click();
    }

    async openPosition(investmentType: string){
        let button = await this.page.locator("//button[contains(@class, 'btn-sm')]", {hasText: investmentType})
        await button.click()
    }
    async cleanWatchlist(){
        const removeIcon = await this.page.locator("//i[contains(@class, 'remove-favorites')]").first();
        while(await removeIcon.isVisible()){
            await removeIcon.click()
            await this.page.waitForTimeout(1500)
        }
    }
}