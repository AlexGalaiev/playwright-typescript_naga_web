import { Page } from "playwright/test";


export class FAQ{
    page: Page

    constructor(page:Page){
        this.page = page 
    }

    async chooseFAQCategory(categoryName: string){
        let category = await this.page.locator(".faq__category", 
            {has: await this.page.locator(`//h2[text()='${categoryName}']`)})
        await category.click()
    }

    async chooseSubCategory(subCategoryName: string){
        let subCategory = await this.page.locator(".blog-item", 
            {has: await this.page.locator(`//div[@class='blog-item__description-wrapper']//h2[text()='${subCategoryName}']`)})
    }
}