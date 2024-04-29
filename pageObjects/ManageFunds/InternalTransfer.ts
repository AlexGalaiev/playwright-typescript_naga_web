import { Locator, Page } from "playwright";

export class InternalTransfer{
    page: Page;
    readonly InternalTransferMenuPoint: Locator;
    readonly sourceAccount: Locator;
    readonly destinationAccount: Locator;

    constructor(page: Page){
        this.page = page;
        this.InternalTransferMenuPoint = page.locator("#mm_transfer");
        this.sourceAccount = page.locator("//div[@class='internal-transfer__select-wrapper'][1]//div[contains(@class, 'hidcal-control')]")
        this.destinationAccount = page.locator("//div[@class='internal-transfer__select-wrapper'][2]//div[contains(@class, 'hidcal-control')]")
    }
    async chooseAccount(){
        await this.sourceAccount.click()
        await this.page.keyboard.press('Enter');
        await this.destinationAccount.click();
        await this.page.keyboard.press('Enter')
    };
    async openInternalTransferPage(){
        return this.InternalTransferMenuPoint.click();
    }
}