import { expect } from "@playwright/test";
import { Locator, Page } from "playwright";

export class InternalTransfer{
    page: Page;
    readonly InternalTransferMenuPoint: Locator;
    readonly sourceAccount: Locator;
    readonly destinationAccount: Locator;
    readonly valueInternalTransfer: Locator;
    readonly submitBtn: Locator;
    readonly successPopup: Locator;
    readonly successPopupHeader: Locator;
    readonly successPopupText: Locator;

    constructor(page: Page){
        this.page = page;
        this.InternalTransferMenuPoint = page.locator("#mm_transfer");
        this.sourceAccount = page.locator('[data-testid="transfer-from"]')
        this.destinationAccount = page.locator("//div[@class='internal-transfer__select-wrapper'][2]//div[contains(@class, 'hidcal-control')]")
        this.valueInternalTransfer = page.locator("//div[@class='internal-transfer__exchange__from']//input")
        this.submitBtn = page.locator("//button[@type='submit']")
        this.successPopup = page.locator("//div[contains(@class, 'prompt__content__message')]")
        this.successPopupHeader = page.locator(".prompt__header__title")
        this.successPopupText = page.locator('.prompt__content__message')
    }
    async chooseAccount(nameOfSourceAccount: string){
        await this.page.waitForTimeout(2000)
        await this.sourceAccount.click()
        await this.page.waitForTimeout(1500)
        await this.page.keyboard.press('ArrowDown')
        await this.page.keyboard.press('Enter');
        await this.checkAccount(nameOfSourceAccount)
        await this.destinationAccount.click();
        await this.page.keyboard.press('Enter')
    };

    async checkAccount(nameOfSourceAccount: string){
        let sourceAc = await this.page.locator(`//div[@data-testid="transfer-from"]//span[contains(text(), ${nameOfSourceAccount})]`)
        if(sourceAc){}else{
            await this.sourceAccount.click()
            await this.page.keyboard.press('ArrowDown')
            await this.page.keyboard.press('Enter'); 
        }
    }
    async openInternalTransferPage(){
        return this.InternalTransferMenuPoint.click();
    };
    async make1$InternalTransfer(){
        await this.valueInternalTransfer.pressSequentially('1')
        await this.page.waitForTimeout(500);
        await this.submitBtn.click()
    }
    async checkSuccessPopupText(){
        await this.successPopup.waitFor({timeout:3000})
        expect(await this.successPopupHeader.textContent()).toEqual("Internal transfer")
        return await this.successPopupText.textContent()
    }
}