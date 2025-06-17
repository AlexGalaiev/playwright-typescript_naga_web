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
    async chooseAccount(acSource: string, acDirect: string){
        await this.page.waitForTimeout(500)
        await this.page.locator('[data-testid="transfer-from"]').click()
        await this.clickAccount(acSource)
        await this.page.locator('[data-testid="transfer-to"]').click()
        await this.clickAccount(acDirect)
        await this.page.waitForTimeout(500)
    }

    async clickAccount(nameOfSourceAccount: string){
        await this.page.waitForTimeout(500)
        let account = await this.page.locator(`//div[@class='internal-transfer__select-option-wrapper']//span[contains(text(),'${nameOfSourceAccount}')]`)
        await account.click()
    }

    async openInternalTransferPage(){
        return this.InternalTransferMenuPoint.click();
    }

    async make1$InternalTransfer(){
        await this.page.waitForTimeout(2000)
        await this.valueInternalTransfer.pressSequentially('5')
        await this.page.waitForTimeout(1000)
        await this.submitBtn.press('Enter')
    }

    async checkSuccessPopupText(){
        await this.successPopup.waitFor({state:'visible'})
        expect(await this.successPopupHeader.textContent()).toEqual("Internal transfer")
        return await this.successPopupText.textContent()
    }
}