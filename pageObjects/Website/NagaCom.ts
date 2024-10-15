import {Locator, Page } from "playwright";

export class NagaCom{
    page: Page;
    languageSwitcher: Locator;
    redirectPopupText: Locator;

    constructor(page: Page){
        this.page = page
        this.languageSwitcher = page.locator("//div[contains(@class, 'LanguageSelector_language-trigger')]").first()
        this.redirectPopupText = page.locator("//button//span[text()='OK']//..//..//preceding-sibling::div[1]")
    }

    async checkTradeInstrument(nameOfInstrument: string){
        let instrument = await this.page.locator(`#prod_type_${nameOfInstrument}`).first()
        let instrumentsAtr = await instrument.getAttribute('class')
        if(instrumentsAtr?.includes('active')){}else{
            await instrument.click()
        }
    }
    async open(url: string){
        await this.page.goto(url);
        await this.page.waitForTimeout(1000)
    }
    async clickBtn(ButtonName:string){
        let elementToClick = await this.page.locator(`//span[text()='${ButtonName}']`).first()
        await elementToClick.scrollIntoViewIfNeeded()
        await elementToClick.click()
        await this.page.waitForTimeout(1500)
    }
    async checkUrl(){
        return await this.page.url()
    }
    async getLanguage(language:string){
        await this.languageSwitcher.click()
        await this.page.waitForTimeout(500)
        let point = await this.page.locator(`#language_menu_item_${language}`)
        await point.click()
    }
    async getRedirectAllertPopupText(){
        return await this.redirectPopupText.textContent();
    }
    async acceptRedirectPopup(){
        await this.page.locator("//button//span[text()='OK']").click();
    }
    async checkVisibileLanguage(language:string){
        return await this.page.locator(`//span[text()='${language}']`).isVisible()
    }
    async openLanguages(){
        await this.languageSwitcher.click();
        await this.page.waitForTimeout(1000)
    }
    async getName(exampleName: string){
        return await this.page.locator(`//span[text()='${exampleName}']`).first().textContent()
    }
}