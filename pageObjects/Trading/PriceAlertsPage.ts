import { Locator, Page } from "playwright";

export class PriceAlert{
    page: Page
    readonly createPriceAlertPopup: Locator;
    readonly instrumentName: Locator;
    readonly RisesBy: Locator;
    readonly percentageBtn: Locator;
    readonly threshold: Locator;
    readonly timePeriod: Locator;    
    readonly setPriceAlert: Locator;
    readonly tab_instrumentName: Locator;
    readonly tab_treshholdResult: Locator;
    readonly tab_removeAlertFromTabBtn: Locator;
    readonly emptyTabPriceAlertHeader: Locator;
    readonly emptyTabPriceAlertDescription: Locator

    constructor(page: Page){
        this.page = page;
        this.createPriceAlertPopup = page.locator("//p[contains(@class, 'create-price-alert')]")
        this.instrumentName = page.locator("//p[@class='symbol-box__name']")
        this.RisesBy = page.locator("//label[text() = 'Rises By']");
        this.percentageBtn = page.locator("//label[text() = 'Percentage']")
        this.threshold = page.locator("//div[contains(@class, 'threshold-value')]//input")
        this.timePeriod = page.locator("//div[contains(@class, 'time-period')]//input")
        this.setPriceAlert = page.locator("#set_alert_button")
        this.tab_instrumentName = page.locator("//div[@class='symbol-name']//p")
        this.tab_treshholdResult = page.locator("//p[@class='alert-type__trend-text']")
        this.tab_removeAlertFromTabBtn = page.locator("//i[contains(@class,'icn-trash')]");
        this.emptyTabPriceAlertHeader = page.locator(".no-data__title")
        this.emptyTabPriceAlertDescription = page.locator(".no-data__description")
    };
    async installPriceAlertParameters(){
        await this.percentageBtn.click()
        await this.threshold.clear();
        await this.threshold.pressSequentially("100");
        await this.page.waitForTimeout(250)
        await this.timePeriod.clear();
        await this.timePeriod.pressSequentially("5")
        await this.page.waitForTimeout(250)
    };
    async getInstrumentName(){
        await this.createPriceAlertPopup.waitFor({state:"visible"})
        return await this.instrumentName.textContent()
    };
    async installRisesBy(){
        await this.RisesBy.click()
        await this.page.waitForTimeout(250)
    };
    async clickSetPriceAlert(){
        await this.setPriceAlert.click()
    };
    async checkInstrumentNameTab(){
        return await this.tab_instrumentName.textContent()
    };
    async getInstrumentNameFromTab(){
        return await this.tab_instrumentName.textContent()
    };
    async getAlertType(){
        return await this.tab_treshholdResult.textContent()
    };
    async removePriceAlert(){
        await this.tab_removeAlertFromTabBtn.click()
        await this.page.waitForTimeout(500)
    };
    async getEmptyPriceAlertTabHeader(){
        return await this.emptyTabPriceAlertHeader.textContent()
    };
    async getEmptyPriceAlertTabDescription(){
        return await this.emptyTabPriceAlertDescription.textContent()
    };
    async cleanPriceAlerts(){
        await this.page.waitForTimeout(2000)
        const removePriceAlert = await this.page.locator("//i[contains(@class,'icn-trash')]").first();
        while(await removePriceAlert.isVisible()){
            await removePriceAlert.click();
            await this.page.waitForTimeout(1500)
        }
    }   
        // for(let icon of removePriceAlerts){
        //     if(await icon.isVisible()){
        //         await icon.click()
        //     }else{}}}
    }
