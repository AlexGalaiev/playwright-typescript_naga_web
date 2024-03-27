import { Locator, Page } from "@playwright/test";


export class ForgotPassword{
    readonly page: Page;
    readonly forgotPasswordDescription: Locator;
    readonly forgotPasswordEmailField: Locator;
    readonly forgotPasswordSendBtn: Locator;

    constructor(page: Page){
        this.page = page;
        this.forgotPasswordDescription = page.locator(".forgot-password-form__description");
        this.forgotPasswordEmailField = page.locator("[name='emailOrUsername']");
        this.forgotPasswordSendBtn = page.locator("//button[contains(@class, 'forgot-password-form__submit-button')]");
    }

    async getForgotPasswordDescription(){
        return await this.forgotPasswordDescription.textContent();
    };
    async sendForgotPasswordToEmail(Email: string){
        await this.forgotPasswordEmailField.pressSequentially(Email);
        await this.forgotPasswordSendBtn.click();
    }


}