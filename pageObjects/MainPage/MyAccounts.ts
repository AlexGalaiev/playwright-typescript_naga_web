import { Locator, Page } from "playwright/test";

export class MyAccounts{
    readonly page: Page;
    readonly myAccountsHeaderBtn: Locator;
    readonly myAccountsLogOut: Locator;
    readonly logOutPopupBtn: Locator;

    constructor(page: Page){
        this.page = page;
        this.myAccountsHeaderBtn = page.locator(".al-user-profile");
        this.myAccountsLogOut = page.locator("//i[contains(@class, 'ng-ico-log-out')]/..");
        this.logOutPopupBtn = page.locator("//i[contains(text(), 'Log out')]")
    }
    async openUserMenu(){
        await this.myAccountsHeaderBtn.click();
    };
    async userLogOut(){
        await this.myAccountsLogOut.click();
        await this.logOutPopupBtn.click();
    };
}