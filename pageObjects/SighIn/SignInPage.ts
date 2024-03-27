import { Locator, Page } from "@playwright/test";


export class SighIn{
    readonly page: Page;
    readonly signInName: Locator;
    readonly signInPassword: Locator;
    readonly signBtn: Locator;
    readonly forgotPasswordLink: Locator;
    readonly redirectionNotice: Locator;
    readonly redirectionButton: Locator;


    constructor(page: Page){
        this.page = page;
        this.signInName = page.locator("[name='user_name']");
        this.signInPassword = page.locator("[name='password']");
        this.signBtn = page.locator("[data-cy='login-btn']");
        this.forgotPasswordLink = page.locator(".login-form__forgot-password");
        this.redirectionNotice = page.locator(".prompt__content__message");
        this.redirectionButton = page.locator("//div[@class='prompt__actions']//button");
    }
    async sigInUserToPlatform(UserEmail: string, UserPassword: string){
        await this.signInName.pressSequentially(UserEmail);
        await this.signInPassword.pressSequentially(UserPassword);
        await this.signBtn.click();
    };
    async forgotPasswordClick(){
        return this.forgotPasswordLink.click();
    };
    async getRedirectionNoticeMsg(){
        return await this.redirectionNotice.textContent();
    };
    async redirectAccept(){
        await this.redirectionButton.click()
        await this.page.waitForTimeout(1500);
    }
}