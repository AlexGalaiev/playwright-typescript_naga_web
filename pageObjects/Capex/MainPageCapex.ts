import { Page } from "playwright";

export class MainPageCapex{
    page: Page

    constructor(page: Page){
        this.page = page
    }

    async waitForMainPage(){
        await this.page.waitForTimeout(500)
        await this.page.locator("#topbarmenu").first().waitFor({state:'visible'})
    }

    async userLogOut(){
        await this.page.locator("//span[contains(@class, 'username')]").first().click()
        await this.page.locator("//span[text()='Log Out']").first().waitFor({state:'visible'})
        await this.page.locator("//span[text()='Log Out']").first().click()
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
        let category = await this.page.locator(`//span[text()='${menuName}']`)
        await category.waitFor({state:'visible'})
        await category.click()
    }
    async openTradingCentralMenu(menuPoint:string, url: string){
        await this.page.locator('//ul[@aria-labelledby="topnavDashboards"]').nth(1).waitFor({state:'visible'})
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
    async resumeMyAppBtn(){
        await this.page.waitForSelector("//button[text()='Resume My Application']", {state:'visible'})
        return await this.page.locator("//button[text()='Resume My Application']").isVisible()
    }
    async checkAccountPlatformVisibility(accountId: string, platformType: string){
        await this.page.waitForTimeout(250)
        let account = await this.page.locator(`//a[contains(@alt, '${accountId}')]//..//..//..`).first()
        return await account.locator(`//td[text()='${platformType}']`).isVisible()
    }
    async checkAccountPlatformAccountIdVisibility(accountId: string){
        await this.page.waitForTimeout(250)
        let account = await this.page.locator(`//a[contains(@alt, '${accountId}')]//..//..//..`).first()
        return await account.locator(`//a[text()='${accountId}']`).isVisible()
    }
    async checkAccountPlatformType(accountId: string, type: string){
        await this.page.waitForTimeout(250)
        let account = await this.page.locator(`//a[contains(@alt, '${accountId}')]//..//..//..`).first()
        return await account.locator(`//td[text()='${type}']`).isVisible()
    }
    async checkAccountPlatformCurrency(accountId: string, currency: string){
        await this.page.waitForTimeout(250)
        let account = await this.page.locator(`//a[contains(@alt, '${accountId}')]//..//..//..`).first()
        return await account.locator(`//td[text()='${currency}']`)
    }
    async waitForAccountTable(){
        await this.page.locator("#trading-accounts-account-table").waitFor({state:'visible'})
    }
    async waitNavbarVisibility(){
        await this.page.locator('#topbarmenu').waitFor({state:'visible'})
        await this.page.waitForTimeout(100)
    }
}
