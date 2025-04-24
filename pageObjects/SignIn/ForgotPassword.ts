import { Locator, Page } from "@playwright/test";


export class ForgotPassword{
    private readonly page: Page;
    private readonly forgotPasswordDescription: Locator;
    private readonly forgotPasswordEmailField: Locator;
    private readonly forgotPasswordSendBtn: Locator;
    private readonly forgotPasswordConfirmation: Locator;
    private readonly forgotPasswordhead: Locator;

    constructor(page: Page){
        this.page = page;
        this.forgotPasswordDescription = page.locator("//div[contains(@class, 'forgot-password-form__description')]");
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
        await this.page.waitForTimeout(1000)
        return await this.forgotPasswordhead.textContent();
    }

    async sendEmailToAddress(email: string){
        await this.page.waitForTimeout(1500)
        await this.forgotPasswordEmailField.pressSequentially(email);
        await this.page.waitForTimeout(2000)
        //await this.forgotPasswordSendBtn.click()
        await this.forgotPasswordSendBtn.press('Enter')
        await this.page.waitForTimeout(1500)
    }
}