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
        await this.page.getByRole('button', {name: 'Log out'}).click()
    };
    async openMyAccountsMenuItem(nameOfItem: string){
        let menuItem = await this.page.locator("//ul[contains(@class, 'dropdown-menu')]")
        await menuItem.locator(`//span[text()='${nameOfItem}']`).click()
    }
    async openMobileMyAccountsMenuItem(nameOfItem: string){
        let menuItem = await this.page.locator(`//span[@class='dropdown-item__content__title']`,{hasText:nameOfItem})
        await menuItem.click()
        await this.page.locator("//div[text()='Currently logged in']").waitFor({state:'visible'})
    }
}