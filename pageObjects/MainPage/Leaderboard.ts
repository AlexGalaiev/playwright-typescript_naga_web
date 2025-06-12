import { Locator, Page } from "@playwright/test";


export class Leaderboard{
    page: Page
    goldTrader: Locator
    silverTrader: Locator
    bronzeTrader: Locator
    otherTraders: Locator

    constructor(page:Page){
        this.page = page
        this.goldTrader = page.locator("//div[contains(@class, 'top-trader-item__gold')]")
        this.silverTrader = page.locator("//div[contains(@class, 'top-trader-item__silver')]")
        this.bronzeTrader = page.locator("//div[contains(@class, 'top-trader-item__bronze')]")
        this.otherTraders = page.locator(".other-traders")
    }

    async filterLeaderBoardTo(nameOfFilter:string){
        await this.page.locator("//div[@class='leaderboard__filters__controls']//div[text()='Trending Leaders']").click()
        await this.page.waitForTimeout(200)
    }
    async openLeaderBoardFromTopTrades(){
        await this.page.locator('.top-traders-parent__link').click()
        await this.page.waitForSelector(".leaderboard-container", {state:'visible'})
    }
    async chooseLeaderboardFilter(filterName:string){
        await this.page.locator("//div[contains(@class, 'iimqet-singleValue')]").first().click()
        //await this.page.pause()
        await this.page.waitForTimeout(500)
        let menuPoint = await this.page.locator(`//div[contains(@class, 'menu')]//div[text()='${filterName}']`)
        await menuPoint.click()
    }
    async chooseTimeFilter(timeFilter:string){
        await this.page.locator("//div[contains(@class, 'iimqet-singleValue')]").nth(1).click()
        // await this.page.pause()
        // await this.page.waitForTimeout(500)
        let menuPoint = await this.page.locator(`//div[contains(@class, 'menu')]//span[text()='${timeFilter}']`)
        await this.page.waitForTimeout(500)
        await menuPoint.click()
    }
    async goldTraderVisibility(){
        await this.page.waitForTimeout(300)
        return await this.goldTrader.isVisible()
    }
    async silverTraderVisibility(){
        await this.page.waitForTimeout(300)
        return await this.silverTrader.isVisible()
    }
    async bronzeTradeVisibility(){
        await this.page.waitForTimeout(300)
        return await this.bronzeTrader.isVisible()
    }
    async otherTraderVisibility(){
        await this.page.waitForTimeout(300)
        return await this.otherTraders.isVisible()
    }
    async topTradersBlockIsVisible(nameOfBlock:string){
        let users = await this.page.locator(`//div[text()='${nameOfBlock}']//..//../following-sibling::div[contains(@class, 'top-users-wrapper')]//div[@class='slick-list']`)
        await users.scrollIntoViewIfNeeded()
        await this.page.waitForTimeout(300)
        return await users.isVisible()
    }
}