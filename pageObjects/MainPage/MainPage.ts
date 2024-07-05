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
    readonly manageFunds: Locator;
    readonly verifyBanner: Locator;
    readonly verifyBannerDisclaimer: Locator;
    readonly IUnderstandBtn: Locator;
    readonly UpgradeButton: Locator;
    readonly TradeHeaderMenuPoint: Locator;
    readonly myTradesMenuPoint: Locator;
    readonly faqMenuPoint: Locator;

    constructor(page: Page){
        this.page = page;
        this.GuestLogin = page.locator("//button[contains(@class, 'guest-mode-header-actions__buttons__login')]");
        this.GuestRegistration = page.locator("//button[contains(@class, 'guest-mode-header-actions__buttons__register')]");
        this.tradingAccount = page.locator("//div[contains(@class, 'sidebar-trading-account__wrapper')]")
        this.tradingAccountStatus = page.locator("//span[contains(@class, 'sidebar-trading-account__info-item--')][3]")
        this.sideBar = page.locator('.sidebar__wrapper');
        this.verifyHeaders = page.locator("//div[@class = 'header-verify-account-levels']");
        this.CompleatRegistration = page.locator("//div[contains(@class, 'header-verify-account-levels__checkbox')]//div[contains(@class, 'active')]")
        this.verifyStepHeader = page.locator("//div[contains(@class, 'header-verify-account-levels__checkbox')]//div[contains(@class, 'active')]")
        this.finishStepHeader = page.locator("//div[contains(@class, 'header-verify-account-levels__checkbox')]//div[contains(@class, 'active')]")
        this.manageFunds = page.locator("//span[text()='Manage Funds']")
        this.verifyBanner = page.locator(".header__verify__content")
        this.verifyBannerDisclaimer = page.locator(".user-status-box__desc-text")
        this.IUnderstandBtn = page.locator("//button[text()='I understand']")
        this.UpgradeButton = page.locator("//button[@type='button']//span[text()='Upgrade Now']")
        this.TradeHeaderMenuPoint = page.locator("//a[@href='/markets']")
        this.myTradesMenuPoint = page.locator("//span[text()='My Trades']")
        this.faqMenuPoint = page.locator("//span[text()='F.A.Q']")
    };
    async mainPageIsDownLoaded(){
        await this.sideBar.waitFor({timeout: 10000});
        await this.verifyHeaders.waitFor({timeout:3000})
    }
    async checkMainPage(){
        await this.sideBar.waitFor({timeout: 10000});
        return await this.verifyHeaders.isVisible()
    }
    async proceedRegistration(){
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
    };
    async openManageFunds(){
        await this.page.waitForTimeout(1000)
        await this.manageFunds.click();
    };

    async getVerifyBannerContent(){
        return await this.verifyBanner.textContent()
    };
    async getVerifyBannerDisclaimerText(){
        return await this.verifyBannerDisclaimer.textContent()
    };
    async clickIUnderstanBtn(){
        return await this.IUnderstandBtn.click()
    };
    async clickUpgradeBtn(){
        await this.UpgradeButton.click()
    };
    async chooseTradeMenuPoint(){
        await this.TradeHeaderMenuPoint.click();
    };
    async chooseMyTradesMenuPoint(){
        await this.myTradesMenuPoint.click();
    };
    async openFAQMenuPoint(){
        await this.faqMenuPoint.scrollIntoViewIfNeeded();
        await this.page.waitForTimeout(750);
        await this.faqMenuPoint.click()
    };
    async openHeaderMenuPoint(NameOfMenuPoint: string){
        let menuPoint = await this.page.locator(".header__menu__nav-item", {hasText:NameOfMenuPoint})
        await menuPoint.click();
    }
}