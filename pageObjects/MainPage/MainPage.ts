import { Locator, Page } from "@playwright/test"

export class MainPage{
    page: Page;
    readonly CompleatRegistration: Locator;
    readonly GuestLogin: Locator;
    readonly GuestRegistration: Locator;
    readonly tradingAccount: Locator;
    readonly sideBar: Locator;
    readonly verifyHeaders: Locator;
    readonly verifyStepHeader: Locator;
    readonly manageFunds: Locator;
    readonly verifyBanner: Locator;
    readonly verifyBannerDisclaimer: Locator;
    readonly IUnderstandBtn: Locator;
    readonly UpgradeButton: Locator;
    readonly faqMenuPoint: Locator;
    readonly notActiveTradingAccount: Locator

    constructor(page: Page){
        this.page = page;
        this.GuestLogin = page.locator("//button[contains(@class, 'guest-mode-header-actions__buttons__login')]");
        this.GuestRegistration = page.locator("//button[contains(@class, 'guest-mode-header-actions__buttons__register')]");
        this.tradingAccount = page.locator("//div[contains(@class, 'sidebar-trading-account__wrapper')]")
        this.notActiveTradingAccount = page.locator("//div[@class='sidebar-trading-account'][2]")
        this.sideBar = page.locator('.sidebar__wrapper');
        this.verifyHeaders = page.locator("//div[@class = 'header-verify-account-levels']");
        this.CompleatRegistration = page.locator('//div[@data-testid="complete-level-1"]//span[text()="To do"]')
        this.verifyStepHeader = page.locator("//div[contains(@class, 'header-verify-account-levels__checkbox')]//div[contains(@class, 'active')]")
        this.manageFunds = page.locator("//span[text()='Manage Funds']")
        this.verifyBanner = page.locator(".header__verify__content")
        this.verifyBannerDisclaimer = page.locator(".user-status-box__desc-text")
        this.IUnderstandBtn = page.locator("//button[text()='I understand']")
        this.UpgradeButton = page.locator("//button[@type='button']//span[text()='Upgrade Now']")
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
        await this.page.locator("//span[text()='Complete now']").click();
    };
    async updateUserLevel(){
        await this.verifyStepHeader.click();
    }
    //Naga Capital
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
        await this.page.waitForTimeout(500);
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

    async openFAQMenuPoint(){
        await this.faqMenuPoint.scrollIntoViewIfNeeded();
        await this.page.waitForTimeout(750);
        await this.faqMenuPoint.click()
    }

    async getVerifyBannerContent(){
        await this.page.waitForSelector('.header__verify__content', {state: 'visible'})
        return await this.verifyBanner.textContent()
    };
    //Naga Markets
    async clickIUnderstanBtn(){
        return await this.IUnderstandBtn.click()
    };
    async clickUpgradeBtn(){
        await this.UpgradeButton.waitFor({state:'visible'})
        await this.UpgradeButton.click()
    };
    async getVerifyBannerDisclaimerText(){
        await this.page.waitForSelector('".user-status-box__desc-text')
        return await this.verifyBannerDisclaimer.textContent()
    };
    async getVerifyBannerMiddleScore(){
        await this.page.waitForSelector('.user-status-box__desc-text', {state:'visible'})
        let middleText = await this.page.locator('.user-status-box__desc-text').textContent();
        return middleText
    }

    //new
    async openHeaderMenuPoint(NameOfMenuPoint: string){
        let menuPoint = await this.page.locator(".header__menu__nav-item")
        .filter({has: await this.page.locator(`//a[@href='/${NameOfMenuPoint}']`) })
        await menuPoint.click();
    };
    async getActiveTradingAccountId(){
        let activeAccount = await this.page.locator(".sidebar-trading-account__wrapper")
        let id = await activeAccount.locator('.sidebar-trading-account__info-item--login').textContent();
        return id;
    };
    async getActiveTradingAccountType(){
        let activeAccount = await this.page.locator(".sidebar-trading-account__wrapper");
        let status = await activeAccount.locator(".sidebar-trading-account__info-item--d").textContent()
        return status;
    };
    async getStatusOfHeaderStep(numberOfStep: number){
        await this.page.waitForTimeout(3000);
        let step = await this.page.locator(`[data-testid='complete-level-${numberOfStep}']`)
        let achievments = await step.locator("//span[contains(@class, 'checkbox__description_wrapper__round')]").textContent();
        return achievments
    };
    async getStatusTextOfHeaderStep(numberOfStep: number){
        await this.page.waitForTimeout(3000)
        let step = await this.page.locator(`[data-testid='complete-level-${numberOfStep}']`)
        let achievments = await step.locator("//span[contains(@class, 'checkbox__description_wrapper__text')]").textContent();
        return achievments
    };
    async getNotActiveTradingAccountId(){
        let id = await this.notActiveTradingAccount.locator("//span[contains(@class, 'info-item--login')]");
        return await id.textContent();
    }
    async switchUserToNotActiveAccount(){
        await this.notActiveTradingAccount.click()
        await this.page.waitForTimeout(4000)
    }
    async getUrl(){
        return await this.page.url()
    }
}