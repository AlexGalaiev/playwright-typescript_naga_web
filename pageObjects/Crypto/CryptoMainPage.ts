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
    async checkQRCodeVisible(){
        return await this.page.locator(".receive-crypto__qr-code").isVisible()
    }
    async checkWalletVisible(){
        return await this.page.locator("//span[contains(@class, 'copy-to-clipboard_text')]").isVisible()
    }
    async checkCopyButtonWorks(){
        let copyBtn = await this.page.locator("//button[contains(@class, 'copy-to-clipboard_button')]")
        await copyBtn.click()
        await this.page.waitForTimeout(300)
        return await copyBtn.textContent()
    }
    async inputWithdrawalAmount(amount: string){
        await this.page.waitForTimeout(1000)
        let inputField = await this.page.locator("//input[contains(@class, 'currency-input-with-swap__input')]")
        await inputField.pressSequentially(amount)
        await this.page.waitForTimeout(1000)
    }
    async getErrorMsgText(){
        return await this.page.locator('.send-crypto-tab__amount-error-message').textContent()
    }
    async openAddressBook(){
        await this.page.locator("//button[text()='Address book']").click()
    }
    async checkDogeCoinAddressBookPopupVisible(){
        await this.page.waitForTimeout(500)
        return await this.page.locator("//h4[text()='Dogecoin (Doge) address book']").isVisible()
    }
    async checkEmptyPageVisible(){
        return await this.page.locator("//p[text()='There are currently no addresses saved.']").isVisible()
    }
    async switchToWithdrawTab(){
        await this.page.waitForSelector("#receive-send-crypto-tabs", {state:'visible'})
        await this.page.locator("//a[text()='Withdraw']").click()
    }
    async cryptoWalletDepositBtnClick(){
        await this.page.locator("//button[contains(@class, 'your-portfolio_receiveCryptoButton')]").click()
    }
    async checkDepositScreen(){
        await this.page.waitForSelector(".receive-crypto", {state:'visible'})
        return await this.page.locator(".receive-crypto__qr-code").isVisible()
    }
    async cryptoWalleBuySellBtnClick(){
        await this.page.locator("//a[contains(@class, 'your-portfolio_buySellCryptoButton')]").click()
    }
    async searchInstrument(instrumentName:string){
        let search = await this.page.locator("//div[contains(@class, 'your-portfolio_wrapper')]//input[@type='text']")
        await search.pressSequentially(instrumentName)
        await this.page.waitForTimeout(500)
    }
    async openActionDropdownPointMenu(menuPoint: string){
        await this.page.locator("//button[contains(@class, 'crypto-account_sendButton')]").click()
        let menu = await this.page.locator("//div[contains(@class, 'crypto-account_dorpdownMenu')]")
        await menu.locator(`//span[contains(text(), '${menuPoint}')]`).click()
        await this.page.waitForTimeout(500)
    }

}