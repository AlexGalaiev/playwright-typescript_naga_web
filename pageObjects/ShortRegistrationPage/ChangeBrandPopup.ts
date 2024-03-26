import { Locator, Page } from "playwright/test";


export class ChangeBrandPopup{
    readonly page: Page;
    readonly popupBody: Locator;
    readonly popupHeader: Locator;
    readonly popupText: Locator;
    readonly proceedRegistrationBtn: Locator;

    constructor(page: Page){
        this.page = page;
        this.popupBody = page.locator(".modal-content");
        this.popupHeader = page.locator(".prompt__header__title");
        this.popupText = page.locator(".prompt__content__message");
        this.proceedRegistrationBtn = page.locator("//div[@class='modal-body']//button[contains(@class, 'btn-primary')]");
    };

    async getPopupHeaderText(){
        return this.popupHeader.textContent();
    };
    async getPopupText(){
        return this.popupText.textContent();
    };
    async proceedRegistration(){
        await this.proceedRegistrationBtn.click();
        await this.page.waitForTimeout(1500);
    };
}