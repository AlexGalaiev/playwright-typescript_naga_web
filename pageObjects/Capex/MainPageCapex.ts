import { Page } from "playwright";

export class MainPageCapex{
    page: Page

    constructor(page: Page){
        this.page = page
    }

    async waitForMainPage(){
        await this.page.waitForTimeout(500)
        await this.page.locator("//div[contains(@class, 'page-header')]").first().waitFor({state:'visible'})
    }

    async userLogOut(){
        await this.page.locator('.icon-logout').click()
    }
    async getChartResponse(){
        const response = await this.page.waitForResponse('https://trading.capex.com/api/charts', {timeout:35000})
        return await response.status()
    }
    async checkChartVisible(){
        let chart = await this.page.locator('#devexperts-webtrader').first()
        return await chart.isVisible()
    }
    async openCategoryMenu(menuName: string){
        await this.page.locator(`//span[text()='${menuName}']`).click()
    }
    async openTradingCentralMenu(menuPoint:string, url: string){
        const [response ] = await Promise.all([
            this.page.waitForResponse(url, {timeout:15000}),
            this.page.locator(`//span[contains(text(), '${menuPoint}')]`).click()
        ])
        return await response.status()
    }
    async openKyc(){
        await this.page.waitForTimeout(500)
        await this.page.locator("//a[text()='complete the account registration process']").click()
        await this.page.waitForSelector("//div[@class='open-live-account1']",{state:'visible'})
        await this.page.locator("//button[text()='Start the Account Opening Process']").click()
        await this.page.waitForSelector("//div[@class='panel-body']", {state:'visible'})
    }

}
