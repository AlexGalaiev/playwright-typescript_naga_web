import { Locator, Page } from "@playwright/test"

export class MainPage{
    page: Page;
    readonly CompleatRegistration: Locator;
    readonly GuestLogin: Locator;
    readonly GuestRegistration: Locator;
    readonly currentAccount: Locator;
    readonly realTradingAccount: Locator;
    readonly tradingAccount: Locator;
    readonly tradingAccountStatus: Locator;
    readonly sideBar: Locator;
    readonly verifyHeaders: Locator;
    readonly verifyStepHeader: Locator;
    readonly finishStepHeader: Locator;

    constructor(page: Page){
        this.page = page;
        this.GuestLogin = page.locator("//button[contains(@class, 'guest-mode-header-actions__buttons__login')]");
        this.GuestRegistration = page.locator("//button[contains(@class, 'guest-mode-header-actions__buttons__register')]");
        this.tradingAccount = page.locator("//div[contains(@class, 'sidebar-trading-account__wrapper')]")
        this.tradingAccountStatus = page.locator("//span[contains(@class, 'sidebar-trading-account__info-item--')][3]")
        this.sideBar = page.locator('.sidebar__wrapper');
        this.verifyHeaders = page.locator("//div[@class = 'header-verify-account-levels']");
        this.CompleatRegistration = page.locator("//div[contains(@class, 'header-verify-account-levels__checkbox')]//div[contains(@class, 'active')]")
        this.verifyStepHeader = this.verifyHeaders.locator("//div[contains(@class, 'header-verify-account-levels__checkbox')]//div[contains(@class, 'active')]")
        this.finishStepHeader = this.verifyHeaders.locator("//div[contains(@class, 'header-verify-account-levels__checkbox')]//div[contains(@class, 'active')]")
    };
    async mainPageIsDownLoaded(){
        await this.sideBar.waitFor({timeout: 10000});
        await this.verifyHeaders.waitFor({timeout:3000})
    }
    async proceedRegistration(){
        // await this.CompleatRegistration.waitFor({timeout:2000})
        await this.CompleatRegistration.click();
    };
    async updateUserLevel(){
        await this.verifyStepHeader.click();
    }
    async openLoginFromGuestMode(){
        await this.GuestLogin.waitFor({timeout:1500})
        return this.GuestLogin.click();
    };
    async openRegistrationFromGuestMode(){
        await this.GuestRegistration.waitFor({timeout:1500})
        return this.GuestRegistration.click();
    };
    async openTradingAssountsMenu(){
        await this.tradingAccount.click();
    };
    async getTradingAccountStatus(){
        let status = await this.tradingAccountStatus.textContent()
        return status;
    };
    async getNumberOfTradingAccounts(){
        await this.page.waitForTimeout(4000)
        let numberOfTrdingAccounts = (await this.tradingAccount).count();
        return numberOfTrdingAccounts
    }
}