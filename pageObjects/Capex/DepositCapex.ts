import { Page } from "playwright";

export class DepositCapex{
    page: Page

    constructor(page: Page){
        this.page = page
    }

    async openDepositFromMainPageAndChooseValue(valueToChoose:string){
        await this.page.locator("//a[text()='Deposit']").first().click()
        await this.page.waitForSelector("//div[contains(@class, 'deposit-view-content')]", {state:'visible'})
        const [customerData] = await Promise.all([
            this.page.waitForResponse('https://api-terminal.praxispay.com/api/cashier/get-customer-data', {timeout:20000}),
            this.page.locator(`//button[@data-amount="${valueToChoose}"]`).click()
        ])
        let dataRespones = await customerData.json()
        let dataStatus = await customerData.status()
        return await [dataRespones, dataStatus]
    }

    async getResponseFrontendName(body:any){
        return await body.frontend_name
    }
    async getBaseAmount(body:any){
        return await body.base_amount
    }
}