import { Locator, Page } from "playwright";

export class Deposit{
    page: Page;
    readonly depositInputValuePoopup: Locator;
    readonly inputFieldDepositPopup: Locator;
    readonly submitDeposit: Locator;
    readonly creditCardCashier: Locator;
    readonly praxisHeaderTittle: Locator;
    readonly cryptoDepositIframe: Locator;
    readonly iframeName: Locator;
    readonly iframeNameNM: Locator;
    readonly praxisHeaderTittleNM: Locator;

    constructor(page: Page){
        this.page = page;
        this.depositInputValuePoopup = page.locator(".modal-content")
        this.inputFieldDepositPopup = page.locator("//input[contains(@class, 'amount')]")
        this.submitDeposit = page.locator("//button[@type='submit']")
        this.creditCardCashier = page.locator("#_cashier_iframe")
        this.praxisHeaderTittle = page.locator(".praxis-funding__header__title")
        this.praxisHeaderTittleNM = page.locator("//span[contains(@class, 'header__title')]")
        this.cryptoDepositIframe = page.locator("//div[@class='paydev-modal_inner']")
        this.iframeName = page.locator("//div[@id='cashier-block']//iframe")
        this.iframeNameNM = page.locator("//div[@class='Loader__content']//iframe")
    }
    async performDeposit(){
        await this.depositInputValuePoopup.waitFor({state:"visible"});
        await this.inputFieldDepositPopup.pressSequentially("100");
        await this.submitDeposit.click();
    }
    async checkNameOfIframe(){
        await this.page.waitForTimeout(5000)
        let frameName = await this.iframeName.getAttribute("id")
        return await frameName
    }
    async checkNameOfiframeNM(){
        await this.page.waitForTimeout(5000)
        let frameName = await this.iframeNameNM.getAttribute("id")
        return await frameName
    }
    async getPraxisHeaderTittle(){
        return await this.praxisHeaderTittle.textContent()
    }
    async getPraxisHeaderTittleNM(){
        return await this.praxisHeaderTittleNM.textContent();
    }
    async checkCryptoIframeDeposit(){
        return await this.cryptoDepositIframe.isVisible()
    }
//new 
    async chooseDepositMethod(methodName: string){
        let depositMethod = await this.page.locator('.funding-method-table-body__info')
        .filter({has: await this.page.locator(`//img[contains(@src, '${methodName}')]`)})
        await depositMethod.click();
    }
}