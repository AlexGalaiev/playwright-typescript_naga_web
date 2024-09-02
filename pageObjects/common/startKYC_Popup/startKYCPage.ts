import { Locator, Page } from "playwright";

export class StartKYCPopup{
    page: Page;
    readonly continueBtn: Locator;

    constructor(page: Page){
        this.page = page;
        this.continueBtn = page.locator("//*[@class='modal-content']//button[contains(text(), 'Continue')]");
    };

    async startKYC(){
        await this.continueBtn.click();
    }
    async proceedVerification(){
        await this.page.locator("//button[@type='submit']").click()
    }

    
}