import { Locator, Page } from "playwright";

export class NagaExchange{
    page: Page
    mainBlock: Locator
    
    constructor(page: Page){
        this.page = page
        this.mainBlock = page.locator("//div[contains(@class, 'homePage')]//div")
    }

    async openCryptoBackMenu(nameOfMenuPoint:string){
        let menu = await this.page.locator("//li[@class='sidebar__nav-item']", {hasText: nameOfMenuPoint})
        await menu.click()
    }
    async redirectToNagaExchange():Promise<Page>{
        await this.page.waitForTimeout(500)
        const [newPage] = await Promise.all([
            this.page.context().waitForEvent('page'),
            this.openCryptoBackMenu('NAGA Exchange')
        ])
        await newPage.waitForLoadState('load')
        return newPage
    }

    async checkNagaExchangeTableIsVisible(){
        await this.mainBlock.waitFor({state:'visible'})
        return await this.mainBlock.isVisible()
    }
    async getUrl(){
        return await this.page.url()
    }
    async filterCategory(categoryName: string){
        let category = await this.page.locator(`//span[text()='${categoryName}']`)
        await category.click()
    }
    async openFavorites(){
        await this.page.locator("//div[text()='Favorites']").click()
    }
}