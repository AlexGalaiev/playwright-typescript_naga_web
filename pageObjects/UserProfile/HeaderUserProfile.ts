import { Locator, Page } from "@playwright/test";

export class HeaderMenuUserProfile{
    page: Page;
    readonly myAccountsHeader: Locator;
    readonly tradingAccountsMenuPoint: Locator;
    readonly userProfileMenu: Locator;
    readonly userProfile: Locator;
    
    constructor(page: Page){
        this.page = page;
        this.myAccountsHeader = page.locator("//button[contains(@class, 'user-avatar-widget')]");
        this.tradingAccountsMenuPoint = page.locator("//li[contains(@class, 'accounts')]");
        this.userProfileMenu = page.locator("//ul[contains(@class, 'open')]");
        this.userProfile = page.locator("//li[contains(@class, 'profile')]")
    }
    async openAddNewTradingAccount(){
        await this.myAccountsHeader.click();
        await this.page.waitForTimeout(1000)
        await this.tradingAccountsMenuPoint.click();
        await this.page.waitForTimeout(1000)
    };
    async openProfileMenuPoint(){
        await this.myAccountsHeader.click();
        await this.page.waitForTimeout(1000)
        await this.userProfile.click();
        await this.page.waitForTimeout(1000)
    }
}