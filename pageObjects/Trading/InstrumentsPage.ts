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
    readonly mobileSearchBtn: Locator;

    constructor(page: Page){
        this.page = page;
        this.searchInstrumentField = page.locator("//div[@class='symbol-search']//input");
        this.foundInstrumentFromSearch = page.locator(".symbol-row");
        this.foundInstrumentName = page.locator("//div[contains(@class, 'symbol-name-container')]//div");
        this.foundInstrumentSellBtn = page.locator("//div[@class='buy-sell-container']//div[@data-type='SELL']");
        this.foundInstrumentBuyBtn = page.locator("//div[@class='buy-sell-container']//div[@data-type='BUY']");
        this.foundInstrumentAddtoWatchlist = page.locator("//button[contains(@class, 'star-checkbox')]");
        this.watchlistTab = page.locator("#favorites_symbol_type")
        this.watchlistedInstrument = page.locator(".symbol-container__name")
        this.removeFromWatchlist = page.locator("//i[contains(@class, 'remove-favorites')]")
        this.emptyWatchlistHeader = page.locator("//div[@class='no-data__title']")
        this.emptyWatchlistText = page.locator("//div[@class='no-data__description']")
        this.addPriceAlert = page.locator("//div[@class='symbol-row']//i[contains(@class,'icn-price-alert')]")
        this.mobileSearchBtn = page.locator("//img[@class='symbol-types-nav__search']//..")
    }

    async searchInstrument(NameOfInstrument: string){
        //await this.searchInstrumentField.pressSequentially(NameOfInstrument)
        await this.page.locator("//div[@id='symbol_types_dd']//button").click()
        await this.page.locator(".markets-search").pressSequentially(NameOfInstrument)
        await this.page.waitForTimeout(500);
    };
    async addToWatchlist(NameOfInstrument: string){
        let firstInstrument = await this.page.locator('.symbol-row', {has: await this.page.locator(`//div[text()='${NameOfInstrument}']`)}).first()
        await firstInstrument.locator("//div[contains(@class, 'symbol-container__menu-dropdown')]//button").click()
        await this.page.waitForTimeout(250)
        await firstInstrument.locator("//li[@role='presentation']//a[text()='Add to favorites']").click()
        await this.page.waitForTimeout(250)
    };
    async openWatclistTab(){
        await this.watchlistTab.click();
    };
    async getWatchlistedInstrumentName(){
        return await this.watchlistedInstrument.textContent()
    };
    async getMobileWatchlistedInstrumentName(){
        return await this.page.locator("//div[@class='symbol-row-mobile__symbol-container__name']//div[1]").textContent()
    };
    async removeInstrumentFromWatclist(){
        //await this.removeFromWatchlist.click();
        await this.page.locator("//i[contains(@class, ' active-star')]").first().click()
        await this.page.waitForTimeout(1000)
    };
    async getEmptyWatchlistHeader(){
        return await this.emptyWatchlistHeader.textContent();
    };
    async getEmptyWatchlistText(){
        return await this.emptyWatchlistText.textContent();
    };
    async addPriceAlertToInstrumnet(){
        let existPosition = await this.page.locator(".symbol-row").first()
        await existPosition.locator("//div[contains(@class, 'symbol-container__menu-dropdown')]").click()
        await existPosition.locator("//a[text()='Add Price Alert']").click()
        await this.page.waitForTimeout(500)
    };
    async openMobileInstrument(){
        await this.page.waitForTimeout(500)
        let instrument = await this.page.locator(".symbol-row-mobile").first()
        await instrument.locator("//div[contains(@class, 'mini')]").click()
        await this.page.waitForSelector(".open-trade__right__container", {state:'visible'})
    }

//new 
    async openPositionOfInstrument(instrumentName: string, positionType: string){
        await this.page.locator("//div[@id='symbol_types_dd']//button").click()
        await this.page.locator(".markets-search").pressSequentially(instrumentName)
        //await this.searchInstrumentField.pressSequentially(instrumentName)
        await this.page.waitForTimeout(500);
        let instrumentContainer = await this.page.locator(".symbol-row", 
            {has: await this.page.locator(`//div[@class = 'symbol-name-container']//div[text()='${instrumentName}']`)})
        let instrument = await instrumentContainer.first();
        let position = await instrument.locator(`//button//span[text()='${positionType}']`)
        await this.page.waitForTimeout(1000)
        await position.first().click();
    }

    async openPosition(investmentType: string){
        let button = await this.page.locator("//button[contains(@class, 'btn-sm')]", {hasText: investmentType}).first()
        await button.click()
    }
    async cleanWatchlist(){
        let existPosition = await this.page.locator(".symbol-container")
        while(await existPosition.isVisible()){
            await existPosition.locator("//div[contains(@class, 'symbol-container__menu-dropdown')]").click()
            await existPosition.locator("//a[text()='Remove from favorites']").click()
            await this.page.waitForTimeout(1500)
        }
    }
    async clearMobileSearchField(){
        await this.page.locator('[alt="clear search"]').click()
        await this.page.waitForTimeout(500)
        await this.page.locator("//button[text()='Done']").click()
    }
    async clearSearchField(){
        await this.page.locator("//i[contains(@class, 'clear-text')]").click()
        await this.page.waitForTimeout(500) 
    }
    async openMobilePosition(nameOfInstrumnet: string, positionType: string){
        await this.page.locator("//div[@id='symbol_types_dd']//button").click()
        await this.page.locator(".markets-search").pressSequentially(nameOfInstrumnet)
        //await this.page.locator("//input[@type='text']").pressSequentially(nameOfInstrumnet)
        await this.page.waitForTimeout(1000)
        let position = await this.page.locator(`//div[@class='symbol-row-mobile']`).first()
        await position.locator(`//div[@data-type='${positionType}']`).click()
    }
    async openMobileFavorites(){
        let favorites = await this.page.locator("#favorites_symbol_type")
        await favorites.scrollIntoViewIfNeeded()
        await favorites.click()
        await this.page.waitForTimeout(500)
    }
    async openMobileSearchField(){
        await this.page.locator("//img[@class='symbol-types-nav__search']//..").click()
    }
    async openPriceAlerts(){
        await this.page.locator("#price_alerts_button").click()
    }

}