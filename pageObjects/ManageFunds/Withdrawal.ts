import { Locator, Page } from "playwright";

export class Withdrawal{
    page: Page;
    readonly WithdrawalMenupoint: Locator;
    readonly CCWithdrawalAmount: Locator;
    readonly WithdrawalAmountErrorMSG: Locator;
    readonly WithdrawalAmointCheck: Locator;
    readonly WithdrawBtn: Locator;
    readonly ccCashierModalPopup: Locator;
    readonly cryptoAdressPopup: Locator;
    readonly cryptoAdressPopupHeader: Locator;
    readonly cryptoWalletAdress: Locator;
    readonly cryptoPopupWithdrawalBtn: Locator;
    readonly cryptoWithdrawalSuccessPopup: Locator;
    readonly cryptoSuccessPopupText: Locator;
    readonly iframeName: Locator;
    readonly ewalletWithdrawalAmount: Locator;
    readonly titleOnCashier: Locator;
    readonly titleOnNagaMarketsPopup: Locator;

    constructor(page: Page){
        this.page = page;
        this.WithdrawalMenupoint = page.locator("#mm_withdraw");
        this.CCWithdrawalAmount = page.locator("//input[contains(@class, 'amount')]");
        this.WithdrawalAmountErrorMSG = page.locator("//div[@class='error']")
        this.WithdrawalAmointCheck = page.locator("//div[contains(@class, 'withdrawal__info__amount')]//span[contains(@class, 'value')]")
        this.WithdrawBtn = page.locator("//button[text()='Withdraw']");
        this.ccCashierModalPopup = page.locator("//div[@class='modal-body']");
        this.cryptoAdressPopup = page.locator("//div[@class='modal-body']");
        this.cryptoAdressPopupHeader = page.locator("//span[@class='crypto-withdraw-modal__header__title']");
        this.cryptoWalletAdress = page.locator("//input[@name='address']");
        this.cryptoPopupWithdrawalBtn = page.locator("//div[contains(@class, 'actions')]//button[@type='submit']");
        this.cryptoWithdrawalSuccessPopup = page.locator("//div[@class='modal-content']")
        this.cryptoSuccessPopupText = page.locator("//div[@class='modal-body']//p[1]")
        this.iframeName = page.locator("//div[@class='praxis-withdrawal']//iframe")
        this.ewalletWithdrawalAmount = page.locator("//div[@class='ewallet-withdrawal-form__info__amount']//span[contains(@class, 'amount')]")
        this.titleOnCashier = page.locator("//p[contains(@class, 'title')]")
        this.titleOnNagaMarketsPopup = page.locator("//div[@class='modal-body']//p[1]")
    };

    async clickMenuPoint(methodName: string){
        let meuPoint = await this.page.locator(`//div[@class='manage-money__content']//div[@class='btn-group']//button[contains(text(), "${methodName}")]`)
        return await meuPoint.click()
    };
    async clickPaymentMethod(paymentMethod: string){
        await this.page.waitForTimeout(500)
        let method = await this.page.locator(`//div[contains(@class,'ewallet-selection__list__item')]//img[contains(@src, '${paymentMethod}')]`)
        await this.page.waitForTimeout(1500)
        return await method.click()
    }
    async chooseWithdrawalMenu(){
        return await this.WithdrawalMenupoint.click();
    };
    async checkNameOfIframe(){
        await this.page.waitForTimeout(5000)
        let frameName = await this.iframeName.getAttribute("id")
        return await frameName
    };
    async inputAmountWithdrawal(AmountToInput: string){
        await this.CCWithdrawalAmount.waitFor({timeout:15000})
        await this.CCWithdrawalAmount.pressSequentially(AmountToInput);
        await this.page.waitForTimeout(3000)
    };
    async getWithdrawalAmountValue(){
        await this.WithdrawalAmointCheck.waitFor({timeout:10000})
        return await this.WithdrawalAmointCheck.textContent();
    };
    async getErrorText(){
        await this.page.waitForTimeout(2000);
        return await this.WithdrawalAmountErrorMSG.textContent();
    };
    async clickWithdrawBtn(){
        await this.WithdrawBtn.scrollIntoViewIfNeeded();
        return await this.WithdrawBtn.click();
    };
    async getEwalletWithdrawalAmount(){
        return await this.ewalletWithdrawalAmount.textContent();
    };
    async openModalCCPopup(){
        await this.WithdrawBtn.press('Enter');
    };
    async getTitleOfCashierName(){
        return await this.titleOnCashier.textContent();
    }
    async checkModalPopup(){
        return await this.ccCashierModalPopup;
    }
    async checkCryptoPopup(){
        return await this.cryptoAdressPopup
    };
    async checkCryptoPopupHeaderText(){
        return await this.cryptoAdressPopupHeader.textContent()
    };
    async performCryptoWithdrawalToTestAccount(){
        await this.cryptoWalletAdress.pressSequentially("1Lbcfr7sAHTD9CgdQo3HTMTkV8LK4ZnX71")
        await this.page.waitForTimeout(750);
        await this.cryptoPopupWithdrawalBtn.click()
    };
    async checkCryptoWithdrawalSuccessPopup(){
        await this.cryptoWithdrawalSuccessPopup.waitFor()
        return await this.cryptoWithdrawalSuccessPopup.isVisible()
    };
    async checkCryptoSuccessPopupText(){
        return await this.cryptoSuccessPopupText.textContent();
    };
    async getNagaMarketsWithdrawalPopupTitle(){
        return await this.titleOnNagaMarketsPopup.textContent();
    };
    async checkWithdrawalRequest(){
        await this.WithdrawBtn.scrollIntoViewIfNeeded();
        const [withdrawalRequest] = await Promise.all([
            this.page.waitForResponse("**/api/cashier/get-gateway-list-without-details"),
            this.page.locator("//button[text()='Withdraw']").click()
        ])
        let body = await withdrawalRequest.json()
        return body.title()
    };
    async numberOfEwalletMethods(){
        return await this.page.locator('[alt="withdraw option"]').count()
    }
    async numberOfCryptoMethods_NS(){
        return await this.page.locator("//div[contains(@class, 'account-selection__list__item')]")
    }
}