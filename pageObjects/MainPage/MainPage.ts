import { Locator, Page } from "@playwright/test"


export class MainPage{
    page: Page;
    readonly CompleatRegistration: Locator;

    constructor(page: Page){
        this.page = page;
        this.CompleatRegistration = page.locator("//div[contains(@class, 'header-levels')]//div[contains(@class, 'active')]");
    };

    async proceedRegistration(){
        return this.CompleatRegistration.click();
    }


}