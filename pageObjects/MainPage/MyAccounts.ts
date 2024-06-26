import { Locator, Page } from "playwright/test";

export class MyAccounts{
    readonly page: Page;
    readonly myAccountsHeaderBtn: Locator;
    readonly myAccountsLogOut: Locator;

    constructor(page: Page){
        this.page = page;
        this.myAccountsHeaderBtn = page.locator(".al-user-profile");
        this.myAccountsLogOut = page.locator("//i[contains(@class, 'ng-ico-log-out')]/..");
    }
    async openUserMenu(){
        await this.myAccountsHeaderBtn.click();
    };
    async userLogOut(){
        await this.myAccountsLogOut.click();
    };
    async openMyAccountsMenuItem(nameOfItem: string){
        let menuItem = await this.page.locator(`//i[contains(@class, '${nameOfItem}')]`)
        await menuItem.click()
    }
}