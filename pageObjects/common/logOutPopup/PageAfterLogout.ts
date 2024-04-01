import { Locator, Page } from "@playwright/test";

export class PageAfterLogout{
    readonly page: Page;
    readonly AppPage: Locator;
    readonly SignInBtn: Locator;

    constructor(page: Page){
        this.page = page;
        this.AppPage = page.locator(".logout-form__wrapper");
        this.SignInBtn = page.locator("//button[text()='Sign In']")
    }
    async pageAfterLogOutSignIn(){
        await this.SignInBtn.click();
    }

}