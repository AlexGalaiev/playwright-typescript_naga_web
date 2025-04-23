import { Locator, Page } from "@playwright/test";

export class PageAfterLogout{
    private readonly page: Page;
    private readonly AppPage: Locator;
    private readonly SignInBtn: Locator;
    private readonly logOutFormAppsTittle: Locator

    constructor(page: Page){
        this.page = page;
        this.AppPage = page.locator(".logout-form__wrapper");
        this.SignInBtn = page.locator("//button[text()='Sign In']");
        this.logOutFormAppsTittle =page.locator('.logout-form__title')
    }
    async pageAfterLogOutSignIn(){
        await this.SignInBtn.click();
    }
    async getLogOutPageTittle(){
        return await this.logOutFormAppsTittle.textContent()
    }
    async redirectToSighIn(){
        await this.page.getByRole('button', {name: 'Sign In'}).click();
        await this.page.waitForTimeout(300)
    }

}