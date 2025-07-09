import { Page } from "playwright";

export class CryptoMainPage{
    page: Page

    constructor(page: Page){
        this.page = page
    }

    async openBackMenuPoint(menuName: string){
        let menu = await this.page.locator(`//span[text()='${menuName}']`)
        await menu.click()
    }

    async searchAndOpenInstrument(instrumentName:string){
        let search = await this.page.locator("//div[contains(@class, 'your-portfolio_wrapper')]//input[@type='text']")
        await search.pressSequentially(instrumentName)
        await this.page.waitForTimeout(500)
        let instrument = await this.page.locator("//div[contains(@class, 'crypto-account_account')]", {has: await this.page.locator(`//span[text()='${instrumentName}']`)})
        await instrument.click()
    }
    async clickBuySellBtn(){
        await this.page.locator(".total-balance-widget__action").click()
    }
    async getSourceInstrumentName(){
        await this.page.waitForTimeout(500)
        return await this.page.locator(".buy-sell-crypto__account-item-name-currency").first().textContent()
    }
    async getDestinationInstrumentName(){
        return await this.page.locator(".buy-sell-crypto__account-item-name-currency").nth(1).textContent()
    }
    async checkBuySellTittleIsVisible(){
        return await this.page.locator(".buy-sell-crypto__title").isVisible()
    }
}