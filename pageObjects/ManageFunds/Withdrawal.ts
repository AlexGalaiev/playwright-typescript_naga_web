import { Locator, Page } from "playwright";

export class Withdrawal{
    page: Page;
    readonly WithdrawalMenupoint: Locator;
    readonly WithdrawalCreditCard: Locator;
    readonly WithdrawalBankAccount: Locator;
    readonly WithdrawalEwallet: Locator;
    readonly CCWithdrawalAmount: Locator;
    readonly WithdrawalAmountErrorMSG: Locator;
    readonly WithdrawalAmointCheck: Locator;
    readonly WithdrawBtn: Locator;
    readonly ccCashier: Locator;
    readonly ccCashierModalPopup: Locator;
    readonly neteller: Locator;
    readonly skril: Locator;
    readonly perfectMoney: Locator;
    readonly netelerCashier: Locator;
    readonly perfectMoneyCashier: Locator;
    readonly skrillCashier: Locator;

    constructor(page: Page){
        this.page = page;
        this.WithdrawalMenupoint = page.locator("#mm_withdraw");
        this.WithdrawalCreditCard = page.locator("//button[@data-option-index='0']");
        this.WithdrawalBankAccount = page.locator("//button[@data-option-index='1']")
        this.WithdrawalEwallet = page.locator("//button[@data-option-index='2']")
        this.CCWithdrawalAmount = page.locator("//input[contains(@class, 'amount')]");
        this.WithdrawalAmountErrorMSG = page.locator("//div[@class='error']")
        this.WithdrawalAmointCheck = page.locator("//div[contains(@class, 'withdrawal__info__amount')]//span[contains(@class, 'value')]")
        this.WithdrawBtn = page.locator("//button[text()='Withdraw']");
        this.ccCashier = page.locator("#cashier-block");
        this.ccCashierModalPopup = page.locator("//div[@class='modal-body']");
        this.neteller = page.locator("//div[@class='ewallet-withdrawal-sidebar']//img[@class='praxisNeteller']")
        this.skril = page.locator("//div[@class='ewallet-withdrawal-sidebar']//img[@class='praxisSkrill']")
        this.perfectMoney = page.locator("//div[@class='ewallet-withdrawal-sidebar']//img[@class='perfectmoney']")
        this.netelerCashier = page.locator(".praxis-withdrawal")
        this.perfectMoneyCashier = page.locator(".ewallet-withdrawal-form")
        this.skrillCashier = page.locator("//div[@payment_method='skrill']")
    };
    //Withdrawal credit card
    async chooseWithdrawalMenu(){
        return await this.WithdrawalMenupoint.click();
    };
    async inputAmountWithdrawal(AmountToInput: string){
        await this.CCWithdrawalAmount.pressSequentially(AmountToInput);
        await this.page.waitForTimeout(1000)
    };
    async getCheckWithdrawalAmount(){
        await this.page.waitForTimeout(1000)
        return await this.WithdrawalAmointCheck.textContent();
    };
    async clickWithdrawBtn(){
        await this.WithdrawBtn.scrollIntoViewIfNeeded();
        return await this.WithdrawBtn.click();
    };
    async checkCCCashier(){
        await this.page.waitForTimeout(3000);
        return await this.ccCashier;
    };
    async getErrorText(){
        await this.page.waitForTimeout(1500);
        return await this.WithdrawalAmountErrorMSG.textContent();
    };
    async openModalCCPopup(){
        await this.WithdrawBtn.press('Enter');
    }
    async checkModalPopup(){
        return this.ccCashierModalPopup;
    }
    //Ewallet withdrawal
    async checkNetelerCashier(){
        return await this.netelerCashier
    };
    async clickNeteler(){
        return await this.neteller.click();
    };
    async clickPerfectMoney(){
        return await this.perfectMoney.click();
    };
    async clickEwalletWithdrawal(){
        return await this.WithdrawalEwallet.click();
    };
    async clickSkrillWithdrawal(){
        return await this.skril.click();
    };
    async checkSkrilCashier(){
        return await this.skrillCashier
    };
    async checkPerfectMoneyCashier(){
        return await this.perfectMoneyCashier
    }
}