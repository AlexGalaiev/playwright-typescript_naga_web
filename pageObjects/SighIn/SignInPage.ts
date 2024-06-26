import { Locator, Page } from "@playwright/test";

export class SighIn{
    readonly page: Page;
    readonly signInName: Locator;
    readonly signInPassword: Locator;
    readonly signBtn: Locator;
    readonly forgotPasswordLink: Locator;
    readonly redirectionNotice: Locator;
    readonly redirectionButton: Locator;
    readonly sighInHeaderName: Locator;
    readonly incorrectCredentialsMsg: Locator;

    constructor(page: Page){
        this.page = page;
        this.signInName = page.locator("[name='user_name']");
        this.signInPassword = page.locator("[name='password']");
        this.signBtn = page.locator("[data-cy='login-btn']");
        this.forgotPasswordLink = page.locator(".login-form__forgot-password");
        this.redirectionNotice = page.locator(".prompt__content__message");
        this.redirectionButton = page.locator("//div[@class='prompt__actions']//button");
        this.sighInHeaderName = page.locator("//h2[contains(@class, 'login-form__headline')]");
        this.incorrectCredentialsMsg = page.locator(".login-form__error");
    }
    async sigInUserToPlatform(UserEmail: string, UserPassword: string){
        await this.signInName.waitFor({state:"visible"})
        await this.signInName.pressSequentially(UserEmail);
        await this.signInPassword.pressSequentially(UserPassword);
        await this.signBtn.click();
    };
    async forgotPasswordClick(){
        await this.forgotPasswordLink.click();
    };
    async getRedirectionNoticeMsg(){
        return await this.redirectionNotice.textContent();
    };
    async redirectAccept(){
        await this.redirectionButton.click()
        await this.page.waitForTimeout(1500);
    };
    async getSighInHeaderText(){
        return await this.sighInHeaderName.textContent();
    };
    async getLoginErrorMsg(){
        return await this.incorrectCredentialsMsg.textContent();
    };
    async clickSignInBtn(){
        await this.signBtn.click();
    };
    async goto(MainPage: string, pageTest: string){
        await this.page.goto(`${MainPage}/${pageTest}`);
    };

}