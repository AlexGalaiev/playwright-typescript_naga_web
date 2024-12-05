import { Locator, Page } from "playwright";

export class NewPosition{
    page: Page;
    readonly shortPositionBtn: Locator;
    readonly longPositionbtn: Locator;
    readonly instrumentName: Locator;
    readonly longAtCurrentPrice: Locator;
    readonly investmentTab: Locator;
    readonly submitBtn: Locator;
    readonly nagaProtector: Locator
    readonly notEnoughMsg: Locator;

    constructor(page: Page){
        this.page = page
        this.instrumentName = page.locator(".open-trade__symbol__name")
        this.longAtCurrentPrice = page.locator("//label[text()='Long at Current Price']")
        this.investmentTab = page.locator("//div[@class='investment-section ']//label[text()='Investment ($)']")
        this.submitBtn = page.locator("//button[contains(@class, 'buy-sell-button')]")
        this.nagaProtector = page.locator('.naga-protector')
        this.notEnoughMsg = page.locator('.insufficient-funds-note')
    }
    async getInstrumentName(){
        return await this.instrumentName.textContent()
    };

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
    async submitPosition(investDirection){
        let submitBtn = await this.page.locator(`//button[contains(text(), '${investDirection}')]`)
        await submitBtn.scrollIntoViewIfNeeded()
        await this.page.waitForTimeout(500)
        await submitBtn.click()
        await this.page.locator('.naga-toast').waitFor({state:'visible'})
        await this.page.waitForTimeout(500)
    }
    //NagaProtection
    async enableProtection(NameOfProtection: string){
        let protectionfield = await this.nagaProtector.locator("//div[contains(@class, 'limit-value')]",{hasText: NameOfProtection})
        let switcher = await protectionfield.locator('.limit-value__switch');
        await switcher.click()
    }
    async getProtectionValue(NameOfProtection: string){
        let protectionfield = await this.nagaProtector.locator("//div[contains(@class, 'limit-value')]",{hasText: NameOfProtection})
        let value = await protectionfield.locator("//span[contains(@class, 'limit-value__type__oposite-value')]")
        return await value.textContent()
    }
    async getNotEnoughFundsMsg(){
        return await this.notEnoughMsg.textContent()
    }
    async getSubmitBtnText(){
        return await this.submitBtn.textContent()
    }
    async installLostSizeRate(){
        await this.page.waitForTimeout(1000)
        await this.page.locator("//input[@value='units']//..").click()
        let lotsFieldInput = await this.page.locator("//div[@class='investment-section ']//div[@class='enter-value']//input").nth(1)
        let value = await lotsFieldInput.getAttribute('value')
        let newValue = Number(value)*2
        //await lotsFieldInput.clear()
        //await lotsFieldInput.pressSequentially(String(newValue))
        await this.page.waitForTimeout(500)
    }
    async installLotsSiveViaPlusBtn(){
        await this.page.waitForTimeout(1000)
        await this.page.locator("//input[@value='units']//..").click()
        await this.page.waitForTimeout(500)
        let plusBtn = await this.page.locator("//div[@class='investment-section ']//div[@class='enter-value']//div[contains(@class, 'plus-btn')]").nth(1)
        await plusBtn.dblclick()
        await plusBtn.dblclick()
        await plusBtn.dblclick()
        await plusBtn.dblclick()
        await plusBtn.dblclick()
        await this.page.waitForTimeout(500)
    }

}