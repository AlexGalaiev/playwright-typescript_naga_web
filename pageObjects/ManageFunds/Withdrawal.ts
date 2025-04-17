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
        await this.page.waitForTimeout(2500);
        await this.WithdrawalAmountErrorMSG.scrollIntoViewIfNeeded()
        return await this.WithdrawalAmountErrorMSG.textContent();
    };
    async clickWithdrawBtn(){
        await this.WithdrawBtn.scrollIntoViewIfNeeded();
        return await this.WithdrawBtn.click();
    };
    // async getEwalletWithdrawalAmount(){
    //     return await this.ewalletWithdrawalAmount.textContent();
    // };
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
    // new
    async checkWithdrawalRequest(){
        await this.WithdrawBtn.scrollIntoViewIfNeeded();
        const [withdrawalRequest] = await Promise.all([
            this.page.waitForResponse("**/api/cashier/get-gateway-list-without-details"),
            this.page.locator("//button[text()='Withdraw']").click()
        ])
        return withdrawalRequest
    };
    async getNumberOfWithdrawalMethods(){
        return await this.page.locator('[alt="withdraw option"]').count()
    }
    async numberOfCryptoMethods_NS(){
        return await this.page.locator("//div[contains(@class, 'account-selection__list__item')]")
    }

    async performManualWithdrawal(ValueToInput: number, withdrawalURL: string){
        await this.CCWithdrawalAmount.waitFor({timeout:15000})
        await this.CCWithdrawalAmount.pressSequentially(String(ValueToInput));
        await this.page.waitForTimeout(1000)
        const [response] = await Promise.all([
            this.page.waitForResponse(withdrawalURL),
            this.WithdrawBtn.click()
        ])
        return response
    }
    async getAPIWithdrawalMSG(response: any){
        let body = await response.json()
        return await body.data.message
    }
    async getAPIWithdrawalAmount(response: any){
        let body = await response.json()
        return await body.data.requested_amount
    }
    async getApiPaymentMethodKey(response: any){
        let body = await response.json();
        return await body.gateways[0].payment_method_key
    }
    async getApiStatusCode(response: any){
        return await response.status()
    }
    async withdrawalCalculation(currency: string){
        let value = await this.page.locator("//div[@id='balance_status']//p[contains(@class, 'item__value')]").first().textContent()
        let amount = value?.replace(currency, '').trim().replace(/,/g, '')
        let number = Number(amount) * Number(0.5)
        return number
    }
    async chooseMobileWithdrawalMethod(withdrawalMethod:string){
        let menu = await this.page.locator("//button[@id='withdrawal-navigation']")
        await menu.click()
        let menuPoint = await this.page.locator(`//button[@id='withdrawal-navigation']/following-sibling::ul//span[text()='${withdrawalMethod}']`)
        await menuPoint.click()
        await this.page.waitForTimeout(500)
    }
    async chooseMobileEWalletMethod(methodName:string){
        await this.page.waitForTimeout(500)
        await this.page.locator(".ewallet-selection__input").click()
        await this.page.waitForTimeout(500)
        await this.page.click(`//img[contains(@src, '${methodName}')]`)
        await this.page.waitForTimeout(1500)
    }
    async getWithdrawalPopupTittle(){
        return await this.page.locator('.withdraw-request-received-modal__title').textContent()
    }
}