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

    };
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
}