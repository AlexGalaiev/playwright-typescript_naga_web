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
    readonly verifyBanner: Locator;
    readonly verifyBannerDisclaimer: Locator;
    readonly IUnderstandBtn: Locator;
    readonly UpgradeButton: Locator;
    readonly notActiveTradingAccount: Locator
    readonly bannerName: Locator;
    readonly leadMarketsBanner: Locator;
    readonly searchField: Locator;

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
        this.verifyBanner = page.locator(".header__verify__content")
        this.verifyBannerDisclaimer = page.locator(".user-status-box__desc-text")
        this.IUnderstandBtn = page.locator("//button[text()='I understand']")
        this.UpgradeButton = page.locator("//button[@type='button']//span[text()='Upgrade Now']")
        this.bannerName = page.locator('.header-verify-account-levels__checkbox__description_wrapper__text')
        this.leadMarketsBanner = page.locator('.header__verify__content')
        this.searchField = page.locator('#global_search_input')
    };
    async mainPageIsDownLoaded(){
        await this.sideBar.waitFor({timeout: 10000});
    }
    async checkMainPage(){
        await this.sideBar.waitFor({timeout: 10000});
        return await this.verifyHeaders.isVisible()
    }
    async proceedRegistration(){
        await this.page.waitForTimeout(1500)
        await this.page.locator("//span[text()='Complete now']").click();
        await this.page.waitForTimeout(500)
    };
    async updateUserLevel(){
        let verifyIdentityBtn = await this.page.locator("//span[text()='Verify identity']")
        await verifyIdentityBtn.waitFor({state:'visible'})
        await verifyIdentityBtn.click()
        await this.page.waitForTimeout(1000)
        
    }
    //Naga Capital
    async openLoginFromGuestMode(){
        await this.GuestLogin.waitFor()
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

    async getVerifyBannerContent(){
        let banner = await this.page.locator(".header__verify__content")
        return await banner.textContent()
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
        await this.page.waitForSelector(".user-status-box__desc-text", {state:'visible'})
        return await this.verifyBannerDisclaimer.textContent()
    };
    async getVerifyBannerMiddleScore(){
        //await this.page.waitForSelector('.user-status-box__desc-text', {state:'visible'})
        let middleText = await this.page.locator('.user-status-box__desc-text').textContent();
        return middleText
    }

    //new
    async openHeaderMenuPoint(NameOfMenuPoint: string){
        await this.page.waitForTimeout(1000)
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
    async search(stringToSearch: string){
        await this.searchField.pressSequentially(stringToSearch)
        await this.page.waitForTimeout(1500)
    }
    async getFoundResults(userName: string){
        let foundPopup = await this.page.locator('.global-search__results__group')
        let foundUser = await foundPopup.locator('.global-search__results__group__item-name', {hasText: userName})
        await foundUser.first().click()
    }
    async openBackMenuPoint(nameOfMenuPoint: string){
        let element = await this.page.locator(`//span[text()='${nameOfMenuPoint}']`)
        await element.scrollIntoViewIfNeeded();
        await element.click()
        await this.page.waitForTimeout(500)
    }

    async getMainPageBannerText(){
        await this.page.waitForTimeout(1500)
        return await this.page.locator('//div[@class="user-status-box__desc-title"]').textContent()
    }
    async openKyc(){
        await this.page.locator("//div[@class='header__verify']//span[text()='Upgrade Now']").click()
    }
    async waitForHeaderBanner(){
        await this.page.waitForSelector('.header__verify__content', {state:'visible'})
    }
    async cryptoOpenKyc(){
        await this.page.waitForSelector("//button//span[text()='Verify now']", {state:'visible'})
        await this.page.locator("//button//span[text()='Verify now']").click()
        await this.page.waitForTimeout(500)
    }

    //mainpage widget naga capital
    async getStatusOfWidgetStep(nameOfTheStep:string){
        await this.page.waitForTimeout(5000)
        let step = await this.page.locator(`//div[text()='${nameOfTheStep}']`)
        return await step.getAttribute('class')
    }

    async getTextOfWidgetStep(widgetName: string){
        let text = await this.page.locator(`//div[text()='${widgetName}']//following-sibling::div`)
        return await text.textContent()
    }

    async clickOnWidgepPoint(nameOfTheStep:string){
        let menupoint = await this.page.locator("//div[contains(@class, 'step-wrapper--clickable')]",{hasText:`${nameOfTheStep}`})
        await menupoint.waitFor({state:'visible'})
        await this.page.locator(`//div[text()='${nameOfTheStep}']//..//..`).first().click()
        await this.page.waitForTimeout(1000)
    }
    async clickOnMobileWidget(nameOfTheStep:string){
        let menuPoint = await this.page.locator("//div[@id='news_feed_left']")
        let banner = await menuPoint.locator("//div[@class='complete-profile-widget--mobile__title']", {hasText:`${nameOfTheStep}`})
        await banner.click()
    }
    async getMobileStepDescription(){
        let menuPoint = await this.page.locator("//div[@id='news_feed_left']")
        let banner = await menuPoint.locator(".complete-profile-widget--mobile__description")
        return await banner.textContent()
    }
    async checkWidgetStepVisibility(nameOfTheStep: string){
        await this.page.waitForTimeout(3000)
        let step = await this.page.locator(`//div[text()='${nameOfTheStep}']`)
        await step.waitFor({state:'visible'})
        return await step.isVisible()
    }

    // main page naga markets
    async getKYCbannerText(){
        let bannerText = await this.page.locator(`//div[contains(@class, 'complete-profile-widget__title--finished')]//..//div[@class='complete-profile-widget__description']`)
        return await bannerText.textContent()
    }
    async removeNeedHelpBaloon(){
        await this.page.waitForTimeout(500)
        let framme = await this.page.frameLocator('[title="Close message"]')
        await framme.locator("//button[@aria-label='Close message from company']").click()
        await this.page.waitForTimeout(500)
    }
    async openMobileMenuPoint(nameOfStep:string){
        await this.page.locator('.header__menu').waitFor({state:'visible'})
        let menuPoint = await this.page.locator(".header__menu__nav-item", 
            {has: await this.page.locator(`//a[@href='/${nameOfStep}']`)})
        await menuPoint.click()
    }
    async openMobileBackMenuPoint(stepName: string){
        let menuPoint = await this.page.locator(`[data-testid='navigation-mm_${stepName}']`)
        await menuPoint.click()
    }
    async refreshPage(){
        await this.page.reload()
    }
    async openMobileMenu(nameOfMenuPoint: string){
        let menu = await this.page.locator('.header__menu__nav-item__text', {hasText:nameOfMenuPoint})
        await menu.click()
    }
    async searchUser(userName: string){
        await this.page.locator('.ng-ico-search').click()
        await this.page.locator('#global_search_input').pressSequentially(userName)
        await this.page.waitForTimeout(500)
    }

    async searchMobileUser(userName: string){
        await this.page.locator("//i[@class='ng-ico-search']").click()
        await this.page.locator('#global_search_input').pressSequentially(userName)
        await this.page.waitForTimeout(500)
        let foundResults = await this.page.locator('.global-search__results__group .global-search__results__group__item-user', {hasText:userName})
        await foundResults.click()
    }

    async openMobileTradingAccountMenu(){
        await this.page.locator('.sidebar-trading-account__header').click()
        await this.page.locator('.sidebar-trading-accounts').waitFor({state:'visible'})
    }
    async switchTo(accountName: string){
        let account = await this.page.locator(".sidebar-trading-account__wrapper", {has:await this.page.locator(`//h2[text()='${accountName}']`)})
        await account.click()
        await this.page.waitForTimeout(3500)
        await this.page.locator('.profile-info').waitFor({state:'visible'})
    }
    async getloginnedUserAccount(){
        return await this.page.locator(".sidebar-trading-account__title").textContent()
    }

    async switchToAcIfNeeded(accountName){
        let account = await this.page.locator('.sidebar-trading-account__title').textContent()
        if(await account !== accountName){
            await this.page.locator(".sidebar-trading-account__wrapper").click()
            await this.page.locator(`//h2[text()='${accountName}']`).click()
            await this.page.waitForTimeout(300)
        }
    }
    async getLoginedAccountId(){
        return await this.page.locator(".sidebar-trading-account__info-item--login").textContent()
    }
    async checkBackMenuElementIsVisible(nameOfElement: string){
        let element = await this.page.locator(`[data-testid="navigation-${nameOfElement}"]`)
        return await element.isVisible()
    }
    async mainMobilePageIsDownLoaded(){
        await this.page.waitForSelector('.news-feed', {state:'visible'})
    }
}
