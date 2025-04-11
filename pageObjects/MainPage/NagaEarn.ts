import { Page } from "playwright";

export class NagaEarn{
    page: Page

    constructor(page: Page){
        this.page = page
    }

    async getEarnHeaderTittle(){
        return await this.page.locator('.naga-earn__getting-started-title').textContent()
    }
    async enableEarn(){
        await this.page.locator("//button[contains(@class, 'naga-earn__enable')]").click()
        //await this.page.locator('.naga-earn__terminal-container').waitFor({state:'visible'})
    }
    async getAccountId(){
        return await this.page.locator(".naga-earn__terminal-number").textContent()
    }
    async getAccountStatus(){
        return await this.page.locator("//div[contains(@class, 'naga-earn__status--active')]").textContent()
    }
    async disableNagaEarn(){
        await this.page.locator("//button[text()='Disable NAGA Earn']").click()
        await this.page.locator("//button[text()='Continue']").waitFor({state:'visible'})
        await this.page.locator("//button[text()='Continue']").click()
    }
    async getPopupMsg(){
        await this.page.locator("//span[text()='Switch to a EUR Live Account']").waitFor({state:'visible'})
        return await this.page.locator(".prompt__content__message").textContent()
    }
    async switchToMyaccount(){
        await this.page.locator("//button[text()='Go to Accounts']").click()
    }
}