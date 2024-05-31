import { Locator, Page } from "playwright";

export class NewPosition{
    page: Page;
    readonly shortPositionBtn: Locator;
    readonly longPositionbtn: Locator;
    readonly instrumentName: Locator;
    readonly shortAtCurrentPrice: Locator;
    readonly longAtCurrentPrice: Locator;
    readonly investmentTab: Locator;

    constructor(page: Page){
        this.page = page
        this.shortPositionBtn = page.locator("//div[contains(@class, 'buy-sell-toggle')]//label[contains(@class, 'sell')]")
        this.longPositionbtn = page.locator("//div[contains(@class, 'buy-sell-toggle')]//label[contains(@class, 'buy')]")
        this.instrumentName = page.locator(".open-trade__symbol__name")
        this.shortAtCurrentPrice = page.locator("//label[text()='Short at Current Price']")
        this.longAtCurrentPrice = page.locator("//label[text()='Long at Current Price']")
        this.investmentTab = page.locator("//div[@class='investment-section ']//label[text()='Investment ($)']")
    }
}