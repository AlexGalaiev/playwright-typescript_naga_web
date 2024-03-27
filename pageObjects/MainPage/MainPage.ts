import { Locator, Page } from "@playwright/test"


export class MainPage{
    page: Page;
    readonly CompleatRegistration: Locator;
    readonly GuestLogin: Locator;
    readonly GuestRegistration: Locator;

    constructor(page: Page){
        this.page = page;
        this.CompleatRegistration = page.locator("//div[contains(@class, 'header-levels')]//div[contains(@class, 'active')]");
        this.GuestLogin = page.locator("//button[contains(@class, 'guest-mode-header-actions__buttons__login')]");
        this.GuestRegistration = page.locator("//button[contains(@class, 'guest-mode-header-actions__buttons__register')]");
    };

    async proceedRegistration(){
        return this.CompleatRegistration.click();
    };

    async openLoginFromGuestMode(){
        await this.GuestLogin.waitFor({timeout:1500})
        return this.GuestLogin.click();
    }
    async openRegistrationFromGuestMode(){
        await this.GuestRegistration.waitFor({timeout:1500})
        return this.GuestRegistration.click();
    }


}