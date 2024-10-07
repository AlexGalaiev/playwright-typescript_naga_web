import { Locator, Page } from "@playwright/test";


export class ForgotPassword{
    readonly page: Page;
    readonly forgotPasswordDescription: Locator;
    readonly forgotPasswordEmailField: Locator;
    readonly forgotPasswordSendBtn: Locator;
    readonly forgotPasswordConfirmation: Locator;
    readonly forgotPasswordhead: Locator;

    constructor(page: Page){
        this.page = page;
        this.forgotPasswordDescription = page.locator(".forgot-password-form__description");
        this.forgotPasswordEmailField = page.locator("[name='emailOrUsername']");
        this.forgotPasswordSendBtn = page.locator("//button[contains(@class, 'forgot-password-form__submit-button')]");
        this.forgotPasswordConfirmation = page.locator("//div[contains(@class, 'forgot-password-form__description-confirmation')]")
        this.forgotPasswordhead = page.locator('.forgot-password-form__headline')
    }

    async getForgotPasswordDescription(){
        return await this.forgotPasswordDescription.textContent();
    };
    async getForgotPasswordConfirmation(){
        return await this.forgotPasswordConfirmation.textContent();
    }
    async sendForgotPasswordToEmail(Email: string){
        await this.page.waitForTimeout(250)
        await this.forgotPasswordEmailField.pressSequentially(Email);
        await this.page.waitForTimeout(250)
        await this.forgotPasswordSendBtn.click();   
    }
    async getForgotPasswordHeadText(){
        return await this.forgotPasswordhead.textContent();
    }


}