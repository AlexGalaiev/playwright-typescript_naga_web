import {Locator, Page, BrowserContext } from "@playwright/test";
import { getLocalization } from "../localization/getText";

export class NagaCom{
    page: Page;
    languageSwitcher: Locator;
    languageSwitcherCrypto: Locator;
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
    userLoginSection: Locator;
    userLoginSectionPay: Locator;
    headerContainer: Locator;
    footerContainer: Locator;
    zaRiskWarning: Locator;
    zaRegualtion: Locator;
    aeFooterRiskWarning: Locator;
    aeFooterDisclaimer: Locator;
    aeHeaderDisclaimer: Locator;
    mainPageContent: Locator;
    mikeTysonTab: Locator;
    languageSwitcherMobile: Locator;

    constructor(page: Page){
        this.page = page
        this.headerContainer = page.locator("//div[@id='header-container']")
        this.languageSwitcher = page.locator("//div[contains(@class, 'LanguageSelector_language-trigger')]//div").first()
        this.languageSwitcherMobile = page.locator("//div[contains(@class, 'LanguageSelector_language-trigger')]//div")
        this.redirectPopupText = page.locator("//button//span[text()='OK']//..//..//preceding-sibling::div[1]")
        this.riskWarning_EU = page.locator("//span[text()='RISK WARNING:']//..//..//p[1]")
        this.riskWarning_EU_main = page.locator("//span[text()='RISK WARNING:']//..//..//p[2]")
        this.restrictedRegions_EU = page.locator("//span[text()='Restricted regions:']//..")
        this.riskWarning_EN = page.locator("//span[text()='RISK WARNING:']//..").first()
        this.restrictedRegions_EN = page.locator("//span[text()='Restricted countries:']//..").first()
        this.euCryptoAdressFooter = page.locator("//div[@id='disclaimer-container']//p[1]")
        this.euCryptoRegulationFooter = page.locator("//div[@id='disclaimer-container']//p[2]")
        this.euCryptoRiskNotification = page.locator("//div[@id='disclaimer-container']//p[4]")
        this.euCryptoRestrictedCountries = page.locator("//div[@id='disclaimer-container']//p[6]")
        this.euPayRegistrationNumber = page.locator("//div[@id='disclaimer-container']//ul//li[1]")
        this.euPayAddress = page.locator("//div[@id='disclaimer-container']//ul//li[2]")
        this.euPayRiskNotification = page.locator("//div[@id='disclaimer-container']//p[6]")
        this.userLoginSection = this.headerContainer.locator("//a[contains(@class, 'ButtonBaseV2_btn')]")
        this.userLoginSectionPay = this.headerContainer.locator("//a[contains(@class, 'ButtonBaseV2_btn')]")
        this.languageSwitcherCrypto = page.locator("//div[contains(@class, 'LanguageSelector_language-trigger')]//div[@title]").first()
        this.footerContainer = page.locator("#footer-container")
        this.zaRiskWarning = page.locator("//span[text()='RISK WARNING:']//..").first()
        this.zaRegualtion = page.locator("//p[text()='Copyright © 2024 – All rights reserved.']//..//p[4]")
        this.aeFooterRiskWarning = page.locator("//span[text()='RISK WARNING:']//..").first()
        this.aeFooterDisclaimer = page.locator("//span[text()='Disclaimer:']//..").first()
        this.aeHeaderDisclaimer = page.locator("//div[@id='header-container']//preceding::div[contains(@class, 'block')][1]")
        this.mainPageContent = page.locator("//div[@id='header-mobile-container']//following-sibling::div[contains(@class, 'container')]").first()
        this.mikeTysonTab = page.locator("//img[contains(@src, 'mike-thumbnail.png')]")
    }

    async checkTradeInstrument(nameOfInstrument: string){
        let instrument = await this.page.locator(`#prod_type_${nameOfInstrument}`).first()
        let instrumentsAtr = await instrument.getAttribute('class')
        if(instrumentsAtr?.includes('active')){}else{
            await instrument.click()
        }
    }
    async checkMobileTradeInstrument(nameOfInstrument: string, numberOfElement: number){
        let instrument = await this.page.locator(`#prod_type_${nameOfInstrument}`).nth(numberOfElement)
        // let instrumentsAtr = await instrument.getAttribute('class')
        // if(instrumentsAtr?.includes('active')){}else{
        await instrument.click()
        
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
    async clickMobileBtn(ButtonName:string, numberElement: number){
        let elementToClick = await this.page.locator(`//span[text()='${ButtonName}']`).nth(numberElement)
        await elementToClick.scrollIntoViewIfNeeded()
        await elementToClick.click()
        await this.page.waitForTimeout(1500)
    }
    async checkUrl(){
        await this.page.waitForTimeout(2500)
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
        await this.page.waitForSelector("//div[contains(@class, 'LanguageSelector_menuBody')]",{state:"visible"})
    }
    async openMobileLanguages(numberOdElement: number){
        await this.languageSwitcherMobile.nth(numberOdElement).click()
        await this.page.waitForSelector("//div[contains(@class, 'LanguageSelector_menuBody')]",{state:"visible"})
    }
    async getName(exampleName: string){
        return await this.page.locator(`//span[text()='${exampleName}']`).first().textContent()
    }
    async getText(elementGetText: Locator){
        await elementGetText.scrollIntoViewIfNeeded();
        return await elementGetText.first().textContent()
    }
    async getBtnHeaderText(buttonName: string){
        let btn = await this.userLoginSection.locator(`//span[text()='${buttonName}']`)
        await btn.first().scrollIntoViewIfNeeded();
        return await btn
    }
    async getMobileBtnText(buttonName: string){
        return await this.page.locator("//div[contains(@class, 'mobile-header')]//a[contains(@class, 'ButtonBaseV2_btn__WH_wc')]", {hasText: buttonName})
    }
    async getMobileBtnTextPay(buttonName: string){
        return await this.page.locator("//div[contains(@class, 'mobile-header')]//button[contains(@class, 'ButtonBaseV2_btn')]", {hasText:buttonName})
    }

    async getBtnHeaderTextPay(buttonName: string){
        let btn = await this.userLoginSectionPay.locator(`//span[text()='${buttonName}']`)
        await btn.first().scrollIntoViewIfNeeded();
        return await btn
    }
    async getMainPageBtntext(btnName: string){
        await this.checkMikeTysonTab()
        let element = await this.page.locator(`//span[text()='${btnName}']`)
        return await element.first()
    }
    async getRiskWarningFooter(){
        await this.page.waitForTimeout(2000)
        let footer = await this.page.locator("//span[text()='RISK WARNING']//..").first()
        return await footer.textContent()
    }
    async searchInstrument(nameOfInstrument: string){
        let searchField = await this.page.locator("//input[@placeholder='Search']")
        await searchField.scrollIntoViewIfNeeded();
        await searchField.pressSequentially(nameOfInstrument)
        await this.page.waitForTimeout(500);
    }
    async searchMobileInstrument(nameOfInstrument: string){
        let searchField = await this.page.locator("//input[@placeholder='Search NAGA for assets...']")
        await searchField.scrollIntoViewIfNeeded();
        // await searchField.pressSequentially(nameOfInstrument)
        // await this.page.waitForTimeout(500);
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
        await this.page.waitForTimeout(10000)
        return [newPage, instrumentName?.replace(/[()]/g, "")]
    }

    async openMobilePosition():Promise<[Page, instrumentName:any]>{
        let instrument = await this.page.locator("//ul[contains(@class, 'InstrumentsTableRow')]").first()
        let name = await instrument.locator("//div[contains(@class, 'text-xs')]")
        let instrumentName = await name.textContent()
        let contexts =  await this.page.context()
        const [newPage] = await Promise.all([
            contexts.waitForEvent('page'),
            name.click()
        ])
        await this.page.waitForTimeout(10000)
        return [newPage, instrumentName?.replace(/[()]/g, "")]
    }

    async switchLanguageTo(language: string){
        await this.page.waitForTimeout(1000)
        let langTitle = await this.languageSwitcher.getAttribute('title') || ''
        if(langTitle.includes(language)){}else{
            await this.languageSwitcher.click();
            await this.page.waitForTimeout(200)
            await this.page.waitForSelector("//div[contains(@class, 'LanguageSelector_menuBody')]", {state:"visible"})
            await this.page.locator("//a[contains(@id, 'language_menu_item')]", {hasText:language}).click()
        }
        await this.page.waitForTimeout(1500)
    }
    async switchMobileLanguageTo(language: string){
        await this.page.waitForTimeout(1000)
        let langTitle = await this.languageSwitcherMobile.nth(1).getAttribute('title') || ''
        if(langTitle.includes(language)){}else{
            await this.languageSwitcherMobile.nth(1).click();
            await this.page.waitForTimeout(200)
            await this.page.waitForSelector("//div[contains(@class, 'LanguageSelector_menuBody')]", {state:"visible"})
            await this.page.locator("//a[contains(@id, 'language_menu_item')]", {hasText:language}).click()
        }
        await this.page.waitForTimeout(1500)
    }
    async openLegalDocument(DocumentName: string){
        let documnet = await this.page.locator('//div[@data-aos="fade-up"]', {hasText:DocumentName}).first()
        await documnet.scrollIntoViewIfNeeded()
        await documnet.locator("//span[text()='Download']").click()
        await this.page.locator('.rpv-core__inner-container').first().waitFor({state:'visible'})
        await this.page.waitForTimeout(1500)
    }
    async getDocumentsHeaderPage(){
        return await this.page.locator("//span[text()='AML and Account Verification']")
    }
    async getPopupHeader(){
        return await this.page.locator("//h1").textContent()
    }
    async checkDocumentVisibility(type: string, documentName: string, documentField: string){
        let localization = new getLocalization('/pageObjects/localization/Website_Naga.com_documents.json');
        let text = await localization.getDocumentInfo(`${type}.${documentName}.${documentField}`)
        let element = await this.page.locator(`//span[contains(text(), '${text}')]`).first()
        await element.scrollIntoViewIfNeeded()
        return await element
    }
    async closePopup(){
        await this.page.locator("//button[contains(@class, 'mantine-CloseButton')]").click()
    }
    async openFooterCategory(categoryName: string){
        await this.footerContainer.scrollIntoViewIfNeeded();
        let category = await this.footerContainer.locator(`//a[text()='${categoryName}']`).first()
        await category.click()
        await this.page.waitForTimeout(1500)
    }
    async openMobileFooterCategory(categoryName: string, subcategory: string){
        await this.footerContainer.scrollIntoViewIfNeeded();
        await this.footerContainer.locator(`//div[text()='${categoryName}']`).click()
        await this.footerContainer.locator(`//a[text()='${subcategory}']`).click()
        await this.page.waitForTimeout(1500)
    }
    async openSocialNetwork(networkName: string):Promise<Page>{
        let icon = await this.page.locator(`//a[contains(@aria-label, '${networkName}')]`).first()
        await icon.scrollIntoViewIfNeeded();
        const [newPage] = await Promise.all([
            this.page.context().waitForEvent('page'),
            icon.click()
        ])
        await newPage.waitForLoadState('load')
        return newPage
    }
    async switchToPreviousTab(){
        await this.page.bringToFront()
        await this.page.waitForTimeout(750)
    }
    async checkMikeTysonTab(){
        if(await this.mikeTysonTab.isVisible()){
            await this.mikeTysonTab.click();
            await this.page.waitForTimeout(250)
        }else{}
    }
    async getNumberOfLanguages(){
        return await this.page.locator("//a[contains(@id, 'language_menu_item')]").count()
    };
    async getNumberOfLandPages(){
        return await this.page.locator("//div[contains(@class, 'mantine-Tabs-panel')]").count()
    }
    async openLandingPageTab(landingPage: string){
        let minicard = await this.page.locator(`//button[contains(@id, '${landingPage}')]`)
        if(await minicard.isVisible()){
            await minicard.click()
            await this.page.waitForTimeout(250)
            let mainCardText = await this.page.locator(`//div[contains(@id, 'panel-${landingPage}')]//h1 | //div[contains(@id, 'panel-${landingPage}')]//h2`).textContent()
            let btnRedirect = await this.page.locator(`//div[contains(@id, 'panel-${landingPage}')]//a`).first().getAttribute('href')
            return [mainCardText, btnRedirect]
        }else{
            let mainCardText = await this.page.locator(`//div[contains(@id, 'panel-${landingPage}')]//h1 | //div[contains(@id, 'panel-${landingPage}')]//h2`).textContent()
            let btnRedirect = await this.page.locator(`//div[contains(@id, 'panel-${landingPage}')]//a`).first().getAttribute('href')
            return [mainCardText, btnRedirect]
        }
    }
    async openLandingPagesOnPay(landingPage: string){
        let minicard = await this.page.locator(`//button[contains(@id, '${landingPage}')]`)
        if(await minicard.isVisible()){
            await minicard.click()
            await this.page.waitForTimeout(250)
            let mainCardText = await this.page.locator(`//div[contains(@id, 'panel-${landingPage}')]//h1 | //div[contains(@id, 'panel-${landingPage}')]//h2`).textContent()
            let btnRedirect = await this.page.locator(`//div[contains(@id, 'panel-${landingPage}')]//button`).textContent()
            return [mainCardText, btnRedirect]
        }else{
            let mainCardText = await this.page.locator(`//div[contains(@id, 'panel-${landingPage}')]//h1 | //div[contains(@id, 'panel-${landingPage}')]//h2`).textContent()
            let btnRedirect = await this.page.locator(`//div[contains(@id, 'panel-${landingPage}')]//button`).textContent()
            return [mainCardText, btnRedirect]
        }
    }
    async checkAndCloseBullonPopup(){
        await this.page.waitForTimeout(2000)
        let pushPopup = await this.page.locator("//div[contains(@class, 'mantine-Paper-root')]")
        if(await pushPopup.isVisible()){
            await pushPopup.locator("//button[contains(@class, 'mantine-CloseButton-root')]").click()
        }
        await this.page.waitForTimeout(500)
    }
    async openMarketAndHoursTab(tabName: string){
        await this.page.locator(`//button[@id='${tabName}']`).click()
        await this.page.waitForTimeout(2500)
    }
    async scrollToMarketsAndTradingFees(){
        await this.page.locator("//div[text()='Market Hours and Trading Fees']//..//tbody").scrollIntoViewIfNeeded();
    }
    async scrollToOtherFees(){
        await this.page.locator("//div[text()='Payment method']").scrollIntoViewIfNeeded()
    }
    async getAllAvailableInstruments(){
        await this.page.waitForTimeout(1500)
        return await this.page.locator('//table//tbody//div[@id]').allTextContents()
    }
    async getTableData(instrument: string, tableIndex: string){
        let tabledata = await this.page.locator(`//div[@id='${instrument}']//..//..//..//..//td[${tableIndex}]`)
        return await tabledata.textContent();
    }
    async getOtherFeeAvailabelInstruments(){
        let table = await this.page.locator("//div[text()='Payment method']//..//..//..//following-sibling::tbody//tr[contains(@class, '0')]")
        return await table.locator('//tr//td[1]').allTextContents()
    }
    async getDataForInstrument_OtherFee(instrumentName: string, dataIndex: string){
        let instrument = await this.page.locator(`//div[text()='${instrumentName}']`).first()
        return await instrument.locator(`//..//..//td[${dataIndex}]`).textContent()
    }
    async acceptAllCookies(){
        await this.page.waitForTimeout(3000)
        let cookieBtn = await this.page.locator("//button[contains(@id, 'CybotCookiebot')]").nth(1)
        if(await cookieBtn.isVisible())
            {await cookieBtn.click()}
    }
    async getSocialNetworkHref(newtworkName: string){
        let socialNetwork = await this.page.locator(`//a[contains(@aria-label, '${newtworkName}')]`).first()
        return await socialNetwork.getAttribute('href')
    }
    async checkInstrumentBar(){
        return await this.page.locator("#prod_types_container").first()
    }
    /////Mobile view
    async getMobileLandingPageContainer(){
        let container = await this.page.locator("//div[contains(@class, 'fullHeightMobile')]").first()
        await container.waitFor({state:"visible"})
        return await container
    }
    async openMobileMenu(numberOfElement: number){
        await this.page.waitForLoadState()
        let hamburger = await this.page.locator(".hamburger").nth(numberOfElement)
        await hamburger.click()
        let menu = await this.page.locator("//div[contains(@class, 'product-tabs')]").nth(1)
        await menu.waitFor({state:"visible"})
    }
    async goBack(){
        await this.page.goBack()
        await this.page.waitForTimeout(500)
    }
}