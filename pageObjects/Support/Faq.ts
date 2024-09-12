import * as path from 'path';
import * as fs from 'fs';
import { expect, Locator, Page } from "playwright/test";


export class FAQ{
    page: Page;
    private jsonObj: any;
    pageTitle: Locator;
    backToSubcategory: Locator;
    backToMainCategory: Locator;
    content: Locator;
    

    constructor(page:Page, registrationJson: string){
        this.page = page
        const fullFilePath = path.resolve(__dirname, registrationJson);
        let fileContents = fs.readFileSync(path.resolve(process.cwd()+registrationJson), 'utf-8');
        this.jsonObj = JSON.parse(fileContents);
        this.pageTitle = page.locator('.news-item-details__content__title')
        this.backToSubcategory = page.locator("//button[contains(@class, 'news-item-details__back-btn')]")
        this.backToMainCategory = page.locator("//button[contains(@class, 'faq-category__back-btn btn')]")
        this.content = page.locator('.news-item-details__content__description')
    }

    async chooseFAQCategory(categoryName: string){
        let category = await this.page.locator(".faq__category__title", 
            {hasText: categoryName})
        await category.first().click()
    }

    async chooseSubCategory(subCategoryName: string){
        let subCategory = await this.page.locator(".blog-item", 
            {has: await this.page.locator(`//div[@class='blog-item__description-wrapper']//h2[text()='${subCategoryName}']`)})
        await subCategory.click();
        await this.page.waitForTimeout(1000)
    }

    async checkURl(){
        return await this.page.url()
    }
    async goToSubCategories(){
        await this.backToSubcategory.click()
    }
    async goToMainCategory(){
        await this.backToMainCategory.click()
    }

    async checkSubcategory(categoryName: string, ) {
        await this.chooseFAQCategory(categoryName)
        for (const key in this.jsonObj[categoryName]){
            let subCategoryURL = await this.jsonObj[categoryName][key]
            await this.chooseSubCategory(key)
            expect(await this.pageTitle.textContent()).toEqual(key)
            expect(await this.checkURl()).toContain(subCategoryURL)
            expect(await this.content.textContent()).toEqual(expect.any(String))
            await this.goToSubCategories()
        }
        await this.goToMainCategory()
    };
}