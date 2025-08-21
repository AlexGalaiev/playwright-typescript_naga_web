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

}
