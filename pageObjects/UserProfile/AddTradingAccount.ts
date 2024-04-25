import { Locator, Page } from "playwright";

export class AddAcountForm{
    page: Page;
    readonly addAccountPopup: Locator;
    readonly addNewAccountBtn: Locator;
    readonly accountTypeLive: Locator;
    readonly accountTypeDemo: Locator;
    readonly accountName: Locator;
    readonly accountCurrencyEUR: Locator;
    readonly accountCurrecnyUSD: Locator;
    readonly createAccount: Locator;
    readonly successAddingAccountBtn: Locator;

    constructor(page: Page){
        this.page = page;
        this.addNewAccountBtn = page.locator("//span[contains(text(), 'Add New Account')]");
        this.accountTypeLive = page.locator("//input[@value='R']")
        this.accountTypeDemo = page.locator("//input[@value='D']")
        this.accountName = page.locator("//input[@placeholder='NAGA - EUR']");
        this.accountCurrencyEUR = page.locator("//div[@data-currency='EUR']");
        this.accountCurrecnyUSD = page.locator("//div[@data-currency='USD']");
        this.createAccount = page.locator("//button[contains(text(), 'Create')]")
        this.addAccountPopup = page.locator("//div[@class='modal-body']")
        this.successAddingAccountBtn = page.locator("//div[contains(@class, 'info-modal_actionButtons')]//button")
    }

    async create_USD_LiveAccount(){
        await this.addNewAccountBtn.waitFor({timeout:1500})
        await this.addNewAccountBtn.click()
        await this.addAccountPopup.waitFor({timeout:3000});
        await this.accountName.pressSequentially('Live_USD');
        await this.accountCurrecnyUSD.click();
        await this.createAccount.click();
        await this.successAddingAccountBtn.waitFor({timeout:2000})
        await this.successAddingAccountBtn.click();
    }
    async create_EUR_DemoAccount(){
        await this.addAccountPopup.waitFor({timeout:3000});
        await this.accountTypeDemo.click();
        await this.accountName.pressSequentially('Demo_EUR');
        await this.createAccount.click();
    }
}