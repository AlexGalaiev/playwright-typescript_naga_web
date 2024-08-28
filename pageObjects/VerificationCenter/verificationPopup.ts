import { Locator, Page } from "@playwright/test";

export class VerificationPopup{
    page: Page;
    readonly verificationPopup: Locator
    readonly requestedDocumentsNoData: Locator;
    readonly documentsHistoryNoData: Locator;
    readonly statusOfDocuments: Locator;

    constructor(page: Page){
        this.page = page;
        this.verificationPopup = page.locator("//div[contains(@class, 'document-verification-capital_wrapper')]")
        this.requestedDocumentsNoData = page.locator("//div[@class='my-documents__no-data']//div//div")
        this.documentsHistoryNoData = page.locator("//h2[text()='Document Upload History']//following-sibling::div")
        this.statusOfDocuments = page.locator('.status-blue')
    };
    async verificationPoupIsDisplyed(){
        await this.verificationPopup.waitFor({timeout:1500});
        return await this.verificationPopup
    };
    async skipVerificationStep(){
        await this.page.getByRole('button', {name: 'Skip'}).click()
    };
    async getNoDataRequestedDocuments(){
        return await this.requestedDocumentsNoData.textContent();
    };
    async getNoDataDocumentsHistory(){
        return await this.documentsHistoryNoData.textContent();
    }
    async getStatusOdDocuments(){
        return await this.statusOfDocuments.textContent();
    }
    async redirectToVerificationCenter(){
        await this.page.getByRole('button', {name:'Upload'}).click()
    }
    async getUrl(){
        return await this.page.url();
    }
}