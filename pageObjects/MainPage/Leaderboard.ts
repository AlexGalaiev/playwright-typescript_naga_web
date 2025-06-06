import { Locator, Page } from "@playwright/test";


export class Leaderboard{
    page: Page
    goldTrader: Locator
    silverTrader: Locator
    bronzeTrader: Locator

    constructor(page:Page){
        this.page = page
        this.goldTrader = page.locator("//div[contains(@class, 'top-trader-item__gold')]")
        this.silverTrader = page.locator("//div[contains(@class, 'top-trader-item__silver')]")
        this.bronzeTrader = page.locator("//div[contains(@class, 'top-trader-item__bronze')]")
    }

    async filterLeaderBoardTo(nameOfFilter:string){
        await this.page.locator("//div[@class='leaderboard__filters__controls']//div[text()='Trending Leaders']").click()
        await this.page.waitForTimeout(200)
        
    }
}