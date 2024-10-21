import {Locator, Page, BrowserContext } from "@playwright/test";

export class NagaCom{
    page: Page;
    languageSwitcher: Locator;
    redirectPopupText: Locator;
    riskWarning_EU: Locator;
    riskWarning_EU_main: Locator;
    restrictedRegions_EU: Locator;
    riskWarning_EN: Locator;
    restrictedRegions_EN: Locator;
    euCryptoAdressFooter: Locator;
    euCryptoRegulationFooter: Locator;
    euCryptoRiskNotification: Locator;
    euCryptoRestrictedCountries: Locator;
    euPayRegistrationNumber: Locator;
    euPayAddress: Locator;
    euPayRiskNotification: Locator;

    constructor(page: Page){
        this.page = page
        this.languageSwitcher = page.locator("//div[contains(@class, 'LanguageSelector_language-trigger')]").first()
        this.redirectPopupText = page.locator("//button//span[text()='OK']//..//..//preceding-sibling::div[1]")
        this.riskWarning_EU = page.locator("//span[text()='RISK WARNING:']//..//..//p[1]")
        this.riskWarning_EU_main = page.locator("//span[text()='RISK WARNING:']//..//..//p[2]")
        this.restrictedRegions_EU = page.locator("//span[text()='Restricted regions:']//..")
        this.riskWarning_EN = page.locator("//span[text()='RISK WARNING:']//..")
        this.restrictedRegions_EN = page.locator("//span[text()='Restricted countries:']//..")
        this.euCryptoAdressFooter = page.locator("//div[@id='disclaimer-container']//p[1]")
        this.euCryptoRegulationFooter = page.locator("//div[@id='disclaimer-container']//p[2]")
        this.euCryptoRiskNotification = page.locator("//div[@id='disclaimer-container']//p[4]")
        this.euCryptoRestrictedCountries = page.locator("//div[@id='disclaimer-container']//p[6]")
        this.euPayRegistrationNumber = page.locator("//div[@id='disclaimer-container']//ul//li[1]")
        this.euPayAddress = page.locator("//div[@id='disclaimer-container']//ul//li[2]")
        this.euPayRiskNotification = page.locator("//div[@id='disclaimer-container']//p[6]")
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
        await this.page.waitForTimeout(1500)
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
    async getText(elementGetText: Locator){
        await elementGetText.first().scrollIntoViewIfNeeded();
        return await elementGetText.first().textContent()
    }
    async getRiskWarningFooter(){
        await this.page.waitForTimeout(250)
        let footer = await this.page.locator("//span[@class='text-primary']//..", {hasText:'RISK WARNING'}).first()
        return await footer.textContent()
    }
    async searchInstrument(nameOfInstrument: string, categoryName: string){
        let searchField = await this.page.locator("//input[@placeholder='Search']")
        await searchField.scrollIntoViewIfNeeded();
        await searchField.pressSequentially(nameOfInstrument)
        await this.page.waitForTimeout(500);
        await this.page.locator(`//li[text()='${categoryName}']`).click()
    }
    async openPosition(buttonName: string):Promise<[Page, instrumentName:any]>{
        let instrument = await this.page.locator("//ul[contains(@class, 'InstrumentsTableRow')]")
        let name = await instrument.locator('//span').first();
        let instrumentName = await name.textContent()
        let contexts =  await this.page.context()
        const [newPage] = await Promise.all([
            contexts.waitForEvent('page'),
            instrument.locator(`//div[text()='${buttonName}']`).first().click()
        ])
        await this.page.waitForTimeout(4000)
        return [newPage, instrumentName?.replace(/[()]/g, "")]
    }
}