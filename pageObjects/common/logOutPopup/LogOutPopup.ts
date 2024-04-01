import { Locator, Page } from "@playwright/test";

export class LogOutPopup{
    readonly page: Page;
    readonly logOutPopup: Locator;
    readonly logOutBtn: Locator;
    
    constructor(page: Page){
        this.page = page;
        this.logOutPopup = page.locator(".modal-body");
        this.logOutBtn = page.locator("//button[text()='Log out']")
    }

    async proceedLogOut(){
        await this.logOutBtn.click();
    }
}