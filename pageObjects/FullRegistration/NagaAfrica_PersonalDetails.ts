import { Page } from "@playwright/test";

export class PersonalDetails{
    page: Page

    constructor(page: Page){
        this.page = page;
    }

    async fillPersonalDetail(){
        await this.page.waitForSelector("#middle_name", {state:'visible'})
        await this.page.locator("#middle_name").pressSequentially("testMiddleName")
        await this.page.waitForTimeout(500)
        await this.page.locator("#date_of_birth").pressSequentially('12.12.1990')
        await this.page.waitForTimeout(500)
        await this.page.locator("//button[text()='Continue']").click()
    }
    async fillAddressResidence(){
        await this.page.waitForSelector(".kyc-find-my-address__title", {state:'visible'})
        let adreseResidence = await this.page.locator("//div[@class='dropdown-select__custom__input']//input")
        await adreseResidence.pressSequentially("The Company's Garden Restaurant")
        await this.page.waitForTimeout(1000)
        await adreseResidence.press('Enter')
        await this.page.waitForTimeout(1000)
        await this.page.locator("//button[text()='Finish']").click()
    }
}
