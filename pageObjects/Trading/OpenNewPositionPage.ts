import { Locator, Page } from "playwright";
import { Deposit } from "../ManageFunds/Deposit";

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
        let button = await buttonsTab.locator("//label[contains(@class, 'btn-default')]", {has: await this.page.locator(`//input[@value='${investmentType}']`)})
        return await button
    }
    async ratePositionBtn(positionDiewctionWithRate: string){
        let rateBtns = await this.page.locator('.blue-toggle__group')
        let rateBtn = await rateBtns.locator("//label[contains(@class, 'btn-default')]", {hasText:positionDiewctionWithRate})
        return await rateBtn
    }
    async submitPosition(){
        await this.page.waitForTimeout(2000)
        let submitBtn = await this.page.locator("#buy_sell_button")
        await submitBtn.scrollIntoViewIfNeeded()
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
        let value = await protectionfield.locator("//div[@class='limit-value__input']//input")
        return await value.getAttribute('value')
    }
    async getNotEnoughFundsMsg(){
        return await this.notEnoughMsg.textContent()
    }
    async getSubmitBtnText(){
        return await this.submitBtn.textContent()
    }

    async switchToSpecificRateForm(){
        await this.page.locator("//span[text()='Specific Rate']/preceding-sibling::input").nth(1).click()
        await this.page.waitForTimeout(250)
    }
    async getStopLossValue(nameOfProtection: string){
        return await this.page.locator(`//span[text()='${nameOfProtection}']//..//..//input[@type='text']`).textContent()
    }
    async addPriceAlert(){
        await this.page.locator("//i[contains(@class, 'add-price-alert')]").click()
        await this.page.waitForSelector(".create-price-alert-modal__header__title", {state:'visible'})
    }
    async installLotsSize(numberOfClicks: number, positionOfEleemnt: number){
        let lostSize = await this.page.locator("//label[text()='Lotsize']")
        await lostSize.click()
        //click 120 times(60 double clicks) on minus btn(2nd button on the page)
        await this.installValueViaMinusBtn(numberOfClicks, positionOfEleemnt)
    }
    async installMobileLotsSize(numberOfClicks: number, positionOfEleemnt: number){
        let lostSize = await this.page.locator("//label[text()='Lotsize']")
        await lostSize.click()
        //click 120 times(60 double clicks) on minus btn(2nd button on the page)
        await this.installMobileValueViaMinusBtn(numberOfClicks, positionOfEleemnt)
    }
    //test function just for debugging
    async installLotsManually(valueToInstall: string, fieldName: string){
        //await this.page.locator("//label[text()='Lotsize']").click()
        let inputField = await this.page.locator(`//label[text()='${fieldName}']//..//input`)
        await inputField.clear()
        await this.page.waitForTimeout(250)
        await inputField.pressSequentially(valueToInstall)
        await this.page.waitForTimeout(1000)
        let minusBtn = await this.page.locator(`//label[text()='${fieldName}']//..//div[contains(@class,'minus-btn')]`)
        await minusBtn.click()
        await this.page.waitForTimeout(250)
        let submit = await this.page.locator("//button[contains(@class, 'buy-sell-button')]")
        await submit.scrollIntoViewIfNeeded()
        await submit.click()
        await this.page.waitForTimeout(1000)
    }

    async installValueViaMinusBtn(iterations: number, elementOnthePage: number){
        let minusBtn = await this.page.locator("//div[contains(@class, 'minus-btn')]").nth(elementOnthePage)
        let iteration = 0
        while(iteration!=iterations){
            await minusBtn.dblclick()
            await this.page.waitForTimeout(150)
            iteration++
        }
        await this.page.waitForTimeout(1000)
    }
    async installMobileValueViaMinusBtn(iterations: number, elementOnthePage: number){
        let minusBtn = await this.page.locator("//div[contains(@class, 'minus-btn')]//i").nth(elementOnthePage)
        let iteration = 0
        while(iteration!=iterations){
            await minusBtn.tap()
            await this.page.waitForTimeout(150)
            iteration++
        }
        await this.page.waitForTimeout(1000)
    
    }
    async getBalloonText(){
        let baloon = await this.page.locator('.naga-toast')
        return await baloon.textContent()
    }
    async switchToTabAndGerResponse(tabName:string, depositUrl: string){
        const [response] = await Promise.all([
            this.page.waitForResponse(depositUrl, {timeout:15000}),
            this.page.locator(`//label[text()='${tabName}']`).click()
        ])
        let body = await response.status()
        return await body
    }

    async switchToTab(tabName:string){
        await this.page.waitForTimeout(1500)
        await this.page.locator(`//label[text()='${tabName}']`).click()
    }

    async checkChartIsVisible(){
        await this.page.waitForTimeout(1500)
        return await this.page.locator('#tv_chart_container').first().isVisible()
    }
    async checkFeedFormIsVisible(){
        await this.page.waitForTimeout(1500)
        return await this.page.locator('.feed-status-post').isVisible()
    }
    async checkSymolsItemsIsVisbile(){
        await this.page.waitForTimeout(1500)
        return await this.page.locator('.symbol-sentiment__items').isVisible()
    }
    async moveBackToTrades(){
        await this.page.locator("//a[@href='/markets']").nth(1).click()
    }
    async checkSmartScoreIsVisible(){
        await this.page.waitForTimeout(500)
        return await this.page.locator('.smart-score-container__wrapper').isVisible()
    }
}