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
    readonly sellBtn: Locator;
    readonly buyBtn: Locator;

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
        this.sellBtn = page.locator("//div[@data-type='SELL']")
        this.buyBtn = page.locator("//div[@data-type='BUY']")
    }

    async searchInstrument(NameOfInstrument: string){
        await this.searchInstrumentField.pressSequentially(NameOfInstrument)
        await this.page.waitForTimeout(500);
    };
    async addToWatchlist(NameOfInstrument: string){
        await this.foundInstrumentName.textContent() === NameOfInstrument;
        await this.foundInstrumentAddtoWatchlist.click();
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
        await this.addPriceAlert.click();
        await this.page.waitForTimeout(500)
    };
    async openShortPosition(){
        await this.sellBtn.click()
    };
    async openLongPosition(){
        await this.buyBtn.click()
    }

}