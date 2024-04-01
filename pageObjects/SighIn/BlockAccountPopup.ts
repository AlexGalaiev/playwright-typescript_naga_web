import { Locator, Page } from "@playwright/test";

export class BlockAccountPopup{
    readonly page: Page;
    readonly blockAccountDescription: Locator;
    readonly forgotPassword: Locator;

    constructor(page: Page){
        this.page = page;
        this.blockAccountDescription = page.locator("//div[contains(@class, 'last-login-attempt-modal__body')]//p");
        this.forgotPassword = page.locator("//div[@class='modal-content']//button[text()='Forgot Password?']");
    };
    async getBlockAccountDescription(){
        return await this.blockAccountDescription.textContent();
    }
    async 
}