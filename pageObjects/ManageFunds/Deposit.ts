import { Locator, Page } from "playwright";

export class Deposit{
    page: Page;
    readonly depositInputValuePoopup: Locator;
    readonly inputFieldDepositPopup: Locator;
    readonly creditCardDeposit: Locator;
    readonly submitDeposit: Locator;
    readonly creditCardCashier: Locator;
    readonly perfectMoneyDeposit: Locator;
    readonly praxisHeaderTittle: Locator;
    readonly nettelerDeposit: Locator;
    readonly skrillDeposit: Locator;
    readonly cryptoDeposit: Locator;
    readonly cryptoDepositIframe: Locator;
    readonly wireTransferDeposit: Locator;
    readonly bankTransferHeader: Locator;
    readonly bankTransferOprions: Locator;
    readonly iframeName: Locator;

    constructor(page: Page){
        this.page = page;
        this.depositInputValuePoopup = page.locator(".modal-content")
        this.creditCardDeposit = page.locator("//span[text()='Credit/Debit Cards']//..//div[@data-item-index=0]")
        this.inputFieldDepositPopup = page.locator("//input[contains(@class, 'amount')]")
        this.submitDeposit = page.locator("//button[@type='submit']")
        this.creditCardCashier = page.locator("#_cashier_iframe")
        this.perfectMoneyDeposit = page.locator("//span[text()='Other']//..//div[@data-item-index=0]")
        this.nettelerDeposit = page.locator("//span[text()='Alternative Payment Methods']//..//div[@data-item-index=1]")
        this.skrillDeposit = page.locator("//span[text()='Alternative Payment Methods']//..//div[@data-item-index=3]")
        this.cryptoDeposit = page.locator("//span[text()='Alternative Payment Methods']//..//div[@data-item-index=13]")
        this.wireTransferDeposit = page.locator("//span[text()='Wire Transfer']//..//div[@data-item-index=0]")
        this.praxisHeaderTittle = page.locator(".praxis-funding__header__title")
        this.cryptoDepositIframe = page.locator("//div[@class='paydev-modal_inner']")
        this.bankTransferHeader = page.locator(".bank-transfer__header__title")
        this.bankTransferOprions = page.locator("//div[@class='bank-transfer-options ']")
        this.iframeName = page.locator("//div[@id='cashier-block']//iframe")
    }
    async performDeposit(){
        await this.depositInputValuePoopup.waitFor({state:"visible"});
        await this.inputFieldDepositPopup.pressSequentially("100");
        await this.submitDeposit.click();
    }
    async chooseCreditCardDeposit(){
        await this.creditCardDeposit.click()
    }
    async checkNameOfIframe(){
        await this.page.waitForTimeout(5000)
        let frameName = await this.iframeName.getAttribute("id")
        return await frameName
    }
    async choosePerfectMoneyDeposit(){
        await this.perfectMoneyDeposit.click();
    }
    async getPraxisHeaderTittle(){
        return await this.praxisHeaderTittle.textContent()
    }
    async chooseNettelerDeposit(){
        await this.nettelerDeposit.click()
    }
    async choosekSkrillDeposit(){
        await this.skrillDeposit.click();
    }
    async chooseCyproDeposit(){
        await this.cryptoDeposit.click();
    }
    async checkCryptoIframeDeposit(){
        return await this.cryptoDepositIframe.isVisible()
    }
    async chooseWireTransfer(){
        await this.wireTransferDeposit.click()
    }
    async getbankTransferHeaderTittle(){
        return await this.bankTransferHeader.textContent()
    }
    async getWireTransferBankDetails(){
        return await this.bankTransferOprions.isVisible()
    }
}