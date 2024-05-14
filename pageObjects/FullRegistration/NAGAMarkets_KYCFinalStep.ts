import { Locator, Page } from "playwright/test";

export class FinalStep{
    page: Page;
    readonly scorringLevel: Locator;
    readonly scorringFooterDisclaimer: Locator;
    readonly scorringFooterDescription: Locator;
    readonly fundAccountBtn: Locator;
    readonly preAdvanceDisclaimer: Locator;
    readonly scorringFooterFundAccount: Locator;
    readonly intermidiateDisclaimer: Locator;
    readonly beginerWarning: Locator;

    constructor(page: Page){
        this.page = page;
        this.scorringLevel = page.locator("//p[contains(@class, 'descriptionHeader')][2]")
        this.scorringFooterDisclaimer = page.locator("//p[contains(@class, 'descriptionFooter')][1]")
        this.scorringFooterDescription = page.locator("//p[contains(@class, 'descriptionFooter')][2]")
        this.scorringFooterFundAccount = page.locator("//p[contains(@class, 'descriptionFooter')][3]")
        this.fundAccountBtn = page.locator("//button[text()='Fund Account']")
        this.preAdvanceDisclaimer = page.locator("//p[contains(@class, 'descriptionFooter')][1]")
        this.intermidiateDisclaimer = page.locator("//p[contains(@class, 'descriptionIntermediate')]")
        this.beginerWarning = page.locator("//p[contains(@class, 'categoryDescription')][1]")

    }

    async getUsersScorring(){
        return await this.scorringLevel.textContent()
    };
    async getScorringFooterDescription(){
        return await this.scorringFooterDisclaimer.textContent()
    };
    async getscorringFooterFundAccount(){
        return await this.scorringFooterDescription.textContent()
    };
    async clickFundAccount(){
        return await this.fundAccountBtn.click()
    };
    async getPreAdvanceDisclaimer(){
        return await this.preAdvanceDisclaimer.textContent()
    }
}
