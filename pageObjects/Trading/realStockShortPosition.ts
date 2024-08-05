import { Locator, Page } from "playwright";


export class RealStockPopup{
    page: Page
    popupText: Locator;

    constructor(page: Page){
        this.page = page
        this.popupText = page.locator('.prompt__content__message')
    }
    async getPopupText(){
        return await this.popupText.textContent()
    }
}