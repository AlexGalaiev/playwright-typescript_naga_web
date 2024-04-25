import { Locator, Page } from "@playwright/test";

export class HeaderMenuUserProfile{
    page: Page;
    readonly myAccountsHeader: Locator;
    readonly tradingAccountsMenuPoint: Locator;
    readonly userProfileMenu: Locator;
    
    constructor(page: Page){
        this.myAccountsHeader = page.locator("#account-menu");
        this.tradingAccountsMenuPoint = page.locator("//li[contains(@class, 'accounts')]");
        this.userProfileMenu = page.locator("//ul[contains(@class, 'open')]")
    }
    async openAddNewTradingAccount(){
        await this.myAccountsHeader.click();
        await this.userProfileMenu.waitFor({timeout:1500})
        await this.tradingAccountsMenuPoint.click();
    }
    
}