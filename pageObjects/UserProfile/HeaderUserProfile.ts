import { Locator, Page } from "@playwright/test";

export class HeaderMenuUserProfile{
    page: Page;
    readonly myAccountsHeader: Locator;
    readonly tradingAccountsMenuPoint: Locator;
    readonly userProfileMenu: Locator;
    
    constructor(page: Page){
        this.page = page;
        this.myAccountsHeader = page.locator("#account-menu");
        this.tradingAccountsMenuPoint = page.locator("//li[contains(@class, 'accounts')]");
        this.userProfileMenu = page.locator("//ul[contains(@class, 'open')]")
    }
    async openAddNewTradingAccount(){
        await this.myAccountsHeader.click();
        await this.page.waitForTimeout(1000)
        await this.tradingAccountsMenuPoint.click();
        await this.page.waitForTimeout(1000)
        await this.userProfileMenu.waitFor({timeout:1500})
        await this.tradingAccountsMenuPoint.click();
    }
    
}