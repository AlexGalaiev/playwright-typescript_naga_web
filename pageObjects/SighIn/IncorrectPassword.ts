import { Locator, Page } from "@playwright/test";

export class IncorrectPasswordPopup{
    page: Page;
    popupText: Locator;
    forgotPasswordBtn: Locator;

    constructor(page: Page){
        this.page = page;
        this.popupText = page.locator("//div[@class='last-login-attempt-modal__body modal-body']//p")
        this.forgotPasswordBtn = page.locator("//div[@class='last-login-attempt-modal__body modal-body']//button[text()='Forgot Password?']")
    }
    async getPopupText(){
        return await this.popupText.textContent()
    }
    async openForgotPasswordForm(){
        return await this.forgotPasswordBtn.click()
    }
}