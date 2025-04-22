import { Page } from "@playwright/test";


export class KYCWidgetModalPopup{
    page: Page

    constructor(page: Page){
        this.page = page
    }

    async clickOnWidgetMenu(widgetMenuName: string){
        let popup = await this.page.locator(".modal-content")
        await popup.locator(`//div[text()='${widgetMenuName}']`).click()
    }

}