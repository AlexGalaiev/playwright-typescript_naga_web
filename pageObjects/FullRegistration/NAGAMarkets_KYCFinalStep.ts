import { Locator, Page } from "playwright/test";

export class FinalStep{
    page: Page;
    readonly scorringLevel: Locator;
    readonly AdvanceDescription: Locator;
    readonly fundAccountBtn: Locator;
    readonly AdvanceDisclaimer: Locator;
    readonly AdvanceFundAccount: Locator;
    readonly PreAdvanceDisclaimer: Locator;
    readonly PreAdvanceDescription: Locator;
    readonly PreAdvanceFundAccount: Locator;
    readonly IntermediateWarning: Locator;
    readonly IntermediateDisclaimer: Locator;
    readonly IntermediateDescription: Locator;
    readonly IntermediateFundAccount:Locator;
    readonly ElementaryWarning: Locator;
    readonly ElementaryDisclaimer: Locator;
    readonly ElementaryDescription: Locator;
    readonly ElementaryFundAccount: Locator;

    constructor(page: Page){
        this.page = page;
        this.scorringLevel = page.locator("//p[contains(@class, 'descriptionHeader')][2]")
        //Advance
        this.AdvanceDisclaimer = page.locator("//p[contains(@class, 'descriptionAdvanced')]");
        this.AdvanceDescription = page.locator("//p[contains(@class, 'descriptionFooter')][1]")
        this.AdvanceFundAccount = page.locator("//p[contains(@class, 'descriptionFooter')][2]")
        this.fundAccountBtn = page.locator("//button[text()='Fund Account']")
        //PreAdvance
        this.PreAdvanceDisclaimer = page.locator("//p[contains(@class, 'categoryDescription')]");
        this.PreAdvanceDescription = page.locator("//p[contains(@class, 'descriptionFooter')][2]");
        this.PreAdvanceFundAccount = page.locator("//p[contains(@class, 'descriptionFooter')][3]");
        //intermediate
        this.IntermediateWarning = page.locator("//p[contains(@class, 'descriptionIntermediate')]")
        this.IntermediateDisclaimer = page.locator("//p[contains(@class, 'descriptionFooter')][1]")
        this.IntermediateDescription = page.locator("//p[contains(@class, 'descriptionFooter')][2]")
        this.IntermediateFundAccount = page.locator("//p[contains(@class, 'descriptionFooter')][3]")
        //Elementary
        this.ElementaryWarning = page.locator("//p[contains(@class, 'descriptionBeginner')]")
        this.ElementaryDisclaimer = page.locator("//p[contains(@class, 'descriptionFooter')][1]")
        this.ElementaryDescription = page.locator("//p[contains(@class, 'descriptionFooter')][2]")
        this.ElementaryFundAccount = page.locator("//p[contains(@class, 'descriptionFooter')][3]")

    };
//advance
    async getDisclaimer(){
        return await this.AdvanceDisclaimer.textContent()
    };
    async getDescription(){
        return await this.AdvanceDescription.textContent()
    };
    async getUsersScorring(){
        return await this.scorringLevel.textContent()
    };
    async getFundAccountText(){
        return await this.AdvanceFundAccount.textContent()
    }
    async clickFundAccount(){
        return await this.fundAccountBtn.click()
    };
    //preadvance disclaimer
    async getPreAdvanceDisclaimer(){
        return await this.PreAdvanceDisclaimer.textContent();
    }
    async getPreAdvanceWarning(){
        return await this.AdvanceDescription.textContent();
    };
    async getPreAdvanceDescription(){
        return await this.PreAdvanceDescription.textContent()
    };
    async getPreAdvanceFundAccount(){
        return await this.PreAdvanceFundAccount.textContent()
    };
    //intermediate
    async getIntermediateWarning(){
        return await this.IntermediateWarning.textContent()
    };
    async getIntermediateDisclaimer(){
        return await this.IntermediateDisclaimer.textContent()
    };
    async getIntermediateDescription(){
        return await this.IntermediateDescription.textContent()
    };
    async getIntermediateFundAcount(){
        return await this.IntermediateFundAccount.textContent()
    }
    //ELementary
    async getElementaryWarning(){
        return await this.ElementaryWarning.textContent()
    };
    async getElementaryDisclaimer(){
        return await this.ElementaryDisclaimer.textContent()
    }
    async getElementaryDescription(){
        return await this.ElementaryDescription.textContent()
    }
    async getElementaryFundAccount(){
        return await this.ElementaryFundAccount.textContent()
    }
