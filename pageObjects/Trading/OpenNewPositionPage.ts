import { Locator, Page } from "playwright";

export class NewPosition{
    page: Page;
    readonly shortPositionBtn: Locator;
    readonly longPositionbtn: Locator;
    readonly instrumentName: Locator;
    readonly shortAtCurrentPrice: Locator;
    readonly longAtCurrentPrice: Locator;
    readonly investmentTab: Locator;
    readonly shortAtSpecificRate: Locator;
    readonly plusBtn: Locator;
    readonly submitBtn: Locator;
    readonly longAtSpecificRate: Locator;

    constructor(page: Page){
        this.page = page
        this.instrumentName = page.locator(".open-trade__symbol__name")
        this.shortAtCurrentPrice = page.locator("//label[text()='Short at Current Price']")
        this.shortAtSpecificRate = page.locator("//label[text()='Short at Specific Rate']")
        this.longAtSpecificRate = page.locator("//label[text()='Long at Specific Rate']")
        this.plusBtn = page.locator("//div[contains(@class, 'undefined')]//i[contains(@class, 'icn-circle-add')]")
        this.longAtCurrentPrice = page.locator("//label[text()='Long at Current Price']")
        this.investmentTab = page.locator("//div[@class='investment-section ']//label[text()='Investment ($)']")
        this.submitBtn = page.locator("//button[contains(@class, 'buy-sell-button')]")
    }
    async getInstrumentName(){
        return await this.instrumentName.textContent()
    };
    async openPosition(){
        await this.shortAtCurrentPrice.click()
    };
    async openShortOrder(){
        await this.shortAtSpecificRate.click()
    };
    async openLongOrder(){
        await this.longAtSpecificRate.click()
    }
    async increaseInvestmentValue(){
        await this.plusBtn.waitFor({state:"visible"})
        await this.plusBtn.click();
        await this.page.waitForTimeout(250)
    }
    async submitPosition(){
        await this.submitBtn.scrollIntoViewIfNeeded()
        await this.submitBtn.click()
        await this.page.waitForTimeout(3000)
    }

    //new
    //tabs of investments directions (Short or Long)

    async getStatusOfBtn(Btn: Locator){
        return await Btn.getAttribute('class')
    }
    async chooseBtn(Btn: Locator){
        await Btn.click()
    }
    async investmentDirectionBtn(investmentType: string){
        let buttonsTab = await this.page.locator('.buy-sell-toggle')
        let button = await buttonsTab.locator("//label[contains(@class, 'btn-default')]", {hasText: investmentType})
        return await button
    }
    async ratePositionBtn(positionDiewctionWithRate: string){
        let rateBtns = await this.page.locator('.blue-toggle__group')
        let rateBtn = await rateBtns.locator("//label[contains(@class, 'btn-default')]", {hasText:positionDiewctionWithRate})
        return await rateBtn
    }
}