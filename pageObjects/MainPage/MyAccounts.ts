import { Locator, Page } from "playwright/test";

export class MyAccounts{
    private readonly page: Page;
    private readonly myAccountsHeaderBtn: Locator;

    constructor(page: Page){
        this.page = page;
        this.myAccountsHeaderBtn = page.locator("//button[contains(@class, 'user-avatar-widget')]");
    }
    
    async openUserMenu(){
        await this.myAccountsHeaderBtn.click()
    }
    async openUserMenuCrypto(){
        await this.page.locator("#account-menu").click()
    }
    async chooseMenuPointCrypto(nameOfPoint:string){
        let menuPoint = await this.page.locator(`//span[text()='${nameOfPoint}']`)
        await menuPoint.click()
    }
    async openMyAccountMenuItem(nameOfItem: string){
        let menu = await this.page.locator('.popover-content')
        await menu.locator(`//span[text()='${nameOfItem}']//..`).first().click()
        await this.page.waitForTimeout(500)
    }
    async userLogOut(){
        await this.openMyAccountMenuItem('Logout')
        await this.page.getByRole('button', {name: 'Log out'}).click()
    }
    async userLogOutCrypto(){
        await this.chooseMenuPointCrypto('Logout')
        await this.page.getByRole('button', {name: 'Log out'}).click()
    }

    //old design
    async openMobileMyAccountsMenuItem(nameOfItem: string){
        let menuItem = await this.page.locator(`//span[@class='dropdown-item__content__title']`,{hasText:nameOfItem})
        await menuItem.click()
        await this.page.locator("//div[text()='Currently logged in']").waitFor({state:'visible'})
    }
}