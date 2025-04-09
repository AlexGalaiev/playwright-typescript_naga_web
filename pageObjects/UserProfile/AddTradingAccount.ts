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
    readonly newLiveUSDAccount: Locator;
    readonly newDemoEURAccount: Locator;
    readonly accountEditMenu: Locator;
    readonly editAccountBtn: Locator;
    readonly saveEditPopupBtn: Locator;
    readonly defaultAccountName: Locator;
    readonly showPasswordBtn: Locator;
    readonly passwordContainer: Locator;
    readonly addNewAccountBtnMobile: Locator;

    constructor(page: Page){
        this.page = page;
        //elements for add new account test
        this.addNewAccountBtn = page.locator("//span[contains(text(), 'Add New Account')]");
        this.addNewAccountBtnMobile = page.locator("//div[text()='Currently logged in']//..//div[@class='content-box-title__button']")
        this.accountTypeLive = page.locator("//input[@value='R']")
        this.accountTypeDemo = page.locator("//input[@value='D']")
        this.accountName = page.locator("//div[@class='modal-body']//input[@type='text']")
        this.accountCurrencyEUR = page.locator("//div[@data-currency='EUR']");
        this.accountCurrecnyUSD = page.locator("//div[@data-currency='USD']");
        this.createAccount = page.locator("//button[contains(text(), 'Create')]")
        this.addAccountPopup = page.locator("//div[@class='modal-body']")
        this.successAddingAccountBtn = page.locator("//div[contains(@class, 'info-modal_actionButtons')]//button")
        this.newLiveUSDAccount = page.locator("//span[text()='Live_USD']")
        this.newDemoEURAccount = page.locator("//span[@title='DEMO_EUR']")
        //elements for edit user accounts test
        this.accountEditMenu = page.locator("//div[@class='trading-account-item'][1]//button[@id='dd-edit-account']")
        this.editAccountBtn = page.locator("//div[@class='trading-account-item'][1]//ul//a[text()='Edit Account']")
        this.saveEditPopupBtn = page.locator("//button[contains(text(), 'Edit Account')]")
        this.defaultAccountName = page.locator("//div[@class='trading-account-item'][1]//span[contains(@class, 'broker__info__name')]")
        this.showPasswordBtn = page.locator("//div[@class='trading-account-item'][1]//ul//a[text()='Show password']");
        this.passwordContainer = page.locator("//div[contains(@class, 'password-container')]");
    };


    async create_USD_LiveAccount(){
        await this.addNewAccountBtn.waitFor({timeout:3000})
        await this.addNewAccountBtn.click()
        await this.addAccountPopup.waitFor({timeout:4000});
        await this.accountName.pressSequentially('Live_USD');
        await this.accountCurrecnyUSD.click();
        await this.createAccount.click();
        await this.successAddingAccountBtn.waitFor({timeout:4000})
        await this.successAddingAccountBtn.click();
        await this.page.waitForTimeout(1500)
    }

    async openMobileAccountCreateForm(){
        await this.addNewAccountBtnMobile.click()
        await this.page.locator("//h4[text()='Add New Account']").waitFor({state:'visible'})
    }
    async createMobileAccount(typeOfAccount: string, nameOfAccount: string, currency:string){
        let popup = await this.page.locator("//h4[text()='Add New Account']//..//..")
        let accountCheckbox = await this.page.locator(`//span[text()='${typeOfAccount}']//preceding-sibling::input`)
        await accountCheckbox.click()
        await popup.locator('//input[@placeholder]').pressSequentially(`${nameOfAccount}`)
        await this.page.waitForTimeout(1000)
        await popup.locator(`//div[@data-currency="${currency}"]`).click()
        await popup.locator("//button[text()='Create Account']").click()

    }

    async getMobileStatusMSG(){
        return await this.page.locator("//span[contains(@class, 'info-modal_title')]").textContent()
    }
    async acceptPopup(){
        await this.page.locator("//span[text()='Ok']").click()
    }
    async create_EUR_DemoAccount(){
        await this.addNewAccountBtn.waitFor({timeout:3000})
        await this.addNewAccountBtn.click()
        await this.page.waitForTimeout(3000)
        await this.accountTypeDemo.click();
        await this.accountName.pressSequentially('DEMO_EUR');
        await this.createAccount.click();
        await this.successAddingAccountBtn.waitFor({timeout:4000})
        await this.successAddingAccountBtn.click();
        await this.page.waitForTimeout(1500)
    };
    async checkNewLiveAccount(){
        return this.newLiveUSDAccount.isVisible();
    }
    async checkNewDemoAccount(){
        return this.newDemoEURAccount.isVisible();
    };
    async editLiveAccountName(AccountName: string){
        let account = await this.page.locator('.trading-account-item', {hasText: 'Live'})
        await account.locator("#dd-edit-account").click();
        let editBtn = await account.locator("//li[@role='presentation']", 
            {has: await this.page.locator("//a[text()='Edit Account']")})
        await editBtn.click()
        await this.addAccountPopup.waitFor({timeout:1500});
        await this.accountName.clear()
        await this.accountName.pressSequentially(AccountName);
        await this.saveEditPopupBtn.click();
        await this.page.locator("//span[text()='Ok']").click()
        await this.successAddingAccountBtn.waitFor({timeout:2000})
    };

    async getDefaultAccountName(){
        return this.defaultAccountName.textContent();
    };

    async openShowPasswordPopup(){
        await this.accountEditMenu.click();
        await this.showPasswordBtn.waitFor({timeout:2000})
        await this.showPasswordBtn.click();
        await this.passwordContainer.waitFor({timeout:3000});
    };

    async checkPasswordContainerIsVisibel(){
        return this.passwordContainer.isVisible()
    }
    async getLoginedAccountId(){
        let tradeAccount = await this.page.locator("//div[text()='Currently logged in']//../following-sibling::div[@class='trading-account-item']").first()
        let brokerInfo = await tradeAccount.locator(".trading-account-item__top__broker__info__number").textContent()
        let id = brokerInfo?.match(/#(\d+)/)
        return id[1]
    }
    async clickAccount(accountId: string){
        let account = await this.page.locator('trading-account-item', {has: await this.page.locator(`//span[contains(text(), '${accountId}')]`)})
        await account.click()
    }
}