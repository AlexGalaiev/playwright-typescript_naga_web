import { Locator, Page } from "@playwright/test"

export class MainPage{
    page: Page;
    private readonly GuestLogin: Locator;
    private readonly GuestRegistration: Locator;
    private readonly tradingAccount: Locator;
    private readonly sideBar: Locator;
    private readonly searchField: Locator;

    constructor(page: Page){
        this.page = page;
        this.GuestLogin = page.locator("//button[contains(@class, 'guest-mode-header-actions__buttons__login')]");
        this.GuestRegistration = page.locator("//button[contains(@class, 'guest-mode-header-actions__buttons__register')]");
        this.tradingAccount = page.locator("//div[contains(@class, 'sidebar-trading-account__wrapper')]")
        this.sideBar = page.locator('.sidebar__wrapper');
        this.searchField = page.locator('#global_search_input')
    };
    async mainPageIsDownLoaded(){
        await this.sideBar.waitFor({timeout: 10000});
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

    async openBackMenuSubcategory(mainCategoryName: string, subcategoryName:string){
        await this.page.waitForTimeout(500)
        let categoryName = await this.page.locator(`//span[text()='${mainCategoryName}']`)
        await categoryName.click()
        let subCategory = await this.page.locator(`//div[@class='popover-content']//span[text()='${subcategoryName}']`)
        await subCategory.click()
        await this.page.waitForTimeout(500)
    }
    
    async openBackMenuCategory(mainCategoryName: string){
        await this.page.waitForTimeout(500)
        let categoryName = await this.page.locator(`//span[text()='${mainCategoryName}']`)
        await categoryName.click()
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

    //new design 
    async openBackMenuPoint(nameOfMenuPoint: string){
        let element = await this.page.locator(`//li[contains(@data-testid, 'navigation-mm_${nameOfMenuPoint}')]`)
        await element.scrollIntoViewIfNeeded();
        await element.click()
        await this.page.waitForTimeout(500)
    }

    async openKyc(){
        await this.page.locator("//div[@class='header__verify']//span[text()='Upgrade Now']").click()
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
    async checkWidgetStepNotFinishedVisibility(nameOfTheStep: string, stepStatus: string){
        await this.page.waitForTimeout(1500)
        let step = await this.page.locator(`//div[contains(@class, 'complete-profile-widget__title--${stepStatus}')]`, {hasText:nameOfTheStep})
        await step.waitFor({state:'visible'})
        return await step.isVisible()
    }

    async removeNeedHelpBaloon(){
        await this.page.waitForTimeout(500)
        let framme = await this.page.frameLocator('[title="Close message"]')
        await framme.locator("//button[@aria-label='Close message from company']").click()
        await this.page.waitForTimeout(500)
    }

    //new design 
    async openMobileBackMenuPoint(pointName: string){
        await this.page.locator("//span[text()='Menu']").click()
        await this.page.locator('.sidebar-mobile__wrapper').waitFor({state:'visible'})
        let menuPoint = await this.page.locator(`//span[text()='${pointName}']`).first()
        await menuPoint.scrollIntoViewIfNeeded()
        await this.page.waitForTimeout(500)
        await menuPoint.click()
        await this.page.waitForTimeout(500)
    }
    async refreshPage(){
        await this.page.reload()
    }
    async openMobileMenu(nameOfMenuPoint: string){
        let header = await this.page.locator('.header__menu')
        let menu = await header.locator(`//span[text()='${nameOfMenuPoint}']`)
        await menu.click()
        await this.page.waitForTimeout(500)
    }

    async searchUser(userName: string){
        await this.page.locator('.ng-ico-search').click()
        await this.page.locator('#global_search_input').pressSequentially(userName)
        await this.page.waitForTimeout(500)
    }

    async searchMobileUser(userName: string){
        await this.page.locator("//button[contains(@class, 'header-mobile__open-menu')]").click()
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

    async openMobileBalanceMenu(){
        await this.page.locator("//button[contains(@class, 'account-data-bar__tools__toggle')]").click()
        await this.page.waitForTimeout(1000)
    }

    async chooseMobileTradingAccount(accountName: string){
        let loginedAc = await this.getloginnedUserAccount()
        if(loginedAc !== accountName){
            await this.page.locator("//button[contains(@class, 'selected-trading-account__button')]").click()
            await this.page.waitForTimeout(1500)
            let dropdown = await this.page.locator(".header-trading-accounts-widget__dropdown")
            await dropdown.locator(`[data-testid="open-terminal-${accountName}"]`).click()
            await this.page.waitForTimeout(4000)
        }
    }

    async getloginnedUserAccount(){
        let loginedAc = await this.page.locator(".selected-trading-account__title").getAttribute('title')
        return await loginedAc
    }

    async switchToAcIfNeeded(accountName){
        let account = await this.page.locator('.selected-trading-account__title').getAttribute('title')
        if(await account !== accountName){
            await this.page.locator("//button[contains(@class, 'selected-trading-account__button')]").click()
            await this.page.locator(`//div[contains(@data-testid, 'open-terminal-${accountName}')]`).click()
            await this.page.waitForTimeout(300)
        }
    }
    async getLoginedAccountId(){
        await this.page.waitForTimeout(1000)
        let accountId = await this.page.locator(".selected-trading-account__info-item--login").textContent()
        return accountId
    }

    async checkBackMenuElementIsVisible(nameOfElement: string){
        let element = await this.page.locator(`[data-testid="navigation-${nameOfElement}"]`)
        return await element.isVisible()
    }
    async checkBackMenuMobileIsVisible(nameOfElement: string){
        let element = await this.page.locator('.sidebar-menu-group__item-title', {hasText:nameOfElement})
        //await element.scrollIntoViewIfNeeded()
        return await element.isVisible()
    }
    async checkBackMenuMainCategoryIsVisible(nameOfCategory: string){
        let category = await this.page.locator(`//span[text()='${nameOfCategory}']`)
        return await category.isVisible()
    }
    async checkMessangerIsVisible(){
        let msg = await this.page.locator("//div[contains(@class, 'chat-notifications-button')]")
        return await msg.isVisible()
    }
    async mainMobilePageIsDownLoaded(){
        await this.page.waitForSelector('.news-feed', {state:'visible'})
    }
    async getKYCbannerText(){
        let text = await this.page.locator("//div[contains(@class, 'complete-profile-widget__title--finished')]//..//div[@class='complete-profile-widget__description']")
        return await text.textContent()
    }
    async acceptUserLogout(){
        await this.page.getByRole('button', {name: 'Log out'}).click()
    }
    async logOutUserMobile(){
        await this.page.locator("//span[text()='Logout']").click()
        await this.page.getByRole('button', {name: 'Log out'}).click()
    }
    async openMessangerViaHeader(){
        await this.page.waitForTimeout(1500)
        await this.page.waitForSelector("//div[contains(@class, 'chat-notifications-button')]", {state:'visible'})
        await this.page.locator("//div[contains(@class, 'chat-notifications-button')]").first().click()
        await this.page.waitForTimeout(1500)
    }
    async checkVisisbilityOfBalanceBar(){
        return await this.page.locator("//div[contains(@class, 'account-data-bar__stats')]").isVisible()
    }
    async getBalanceValue(nameOfBalenceCategory: string){
        let balance = await this.page.locator(`//p[text()='${nameOfBalenceCategory}']/following-sibling::p`).textContent()
        return balance?.replace(/[^\d.,-]/g, '')
    }
    async openMobileBalance(){
        await this.page.locator("//button[contains(@class, 'account-data-bar__tools__toggle')]").click()
    }
    async checkMobileWidgetIsVisisble(stepName:string){
        let banner = await this.page.locator('.complete-profile-widget--mobile__title', {hasText:stepName}).nth(0)
        return await banner.isVisible()
    }
    async checkFinishedWidgetStepIsVisible(stepName: string){
        let step = await this.page.locator("//div[contains(@class, 'complete-profile-widget__title--finished')]", {hasText:stepName})
        return await step.isVisible()
    }
    async checkPopupWidgetStepTitleVisibility(nameOfTheStep:string, stepStatus:string){
        let popup = await this.page.locator('.modal-body')
        let step = await popup.locator(`//div[contains(@class, 'complete-profile-widget__title--${stepStatus}')]`, {hasText:nameOfTheStep})
        await step.waitFor({state:'visible'})
        return await step.isVisible()
    }
    async clickBackMenuPoint(pointName: string){
        await this.page.locator(`//span[text()='${pointName}']`).click()
    }
    async closeModal(){
        await this.page.locator("//div[@class='modal-content']//button[@class='close']").click()
    }
    async checkExternalService(serviceName: string, serviceUrl){
        await this.page.locator("//span[text()='Trading Tools']").click()
        const [response] = await Promise.all([
            this.page.waitForResponse(serviceUrl, {timeout:10000}),
            this.page.locator(`//span[text()='${serviceName}']`).click()
        ])
        return response
    }
    async getServiceStatusCode(response: any){
        let responseBody = await response.json()
        return responseBody.info.code
    }
    async checkTradingSymbolsIsVisible(){
        return await this.page.locator(".trading-central-signals").isVisible()
    }
    async checkContestTabIsVisible(){
        return await this.page.locator(".contests__container").isVisible()
    }
    async checkMarketsBuzzIsVisible(){
        return await this.page.locator("#tradingcentral").isVisible()
    }
    async waitForLiveAccount(){
        await this.page.waitForSelector(".selected-trading-account__info-item--r", {state:'visible'})
    }
    async waitForAccountTobeDisplayed(acname:string){
        await this.page.waitForSelector(`//h2[@title='${acname}']`, {state:"visible"})
        await this.page.waitForTimeout(500)
    }
    async openPraxisDepositPopupFromManageFunds(mainCategory: string, subcategoryName:string, depositUrl:string){
        await this.page.waitForTimeout(500)
        let categoryName = await this.page.locator(`//span[text()='${mainCategory}']`)
        await categoryName.click()
        const [response] = await Promise.all([
            this.page.waitForResponse(depositUrl, {timeout:15000}),
            this.page.locator(`//div[@class='popover-content']//span[text()='${subcategoryName}']`).click()
        ]) 
        return response
    }
    async closeManageFundsPopup(){
        await this.page.locator("//button[@class='close']").click()
    }
}   
