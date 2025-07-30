import { Locator, Page } from "playwright";

export class SettingsPage{
    page: Page
    readonly twoFactorAuth: Locator;
    readonly qrCode: Locator;
    readonly twoStepKey: Locator;
    readonly currentPassword: Locator;
    readonly newPassword: Locator;
    readonly submitBtn: Locator;
    readonly successPopuptext: Locator;
    readonly acceptPopup: Locator;
    
    constructor(page:Page){
        this.page = page
        this.twoFactorAuth = page.locator("//div[@class='settings-mfa__actions']//button")
        this.qrCode = page.locator("//img[@alt='QR Code']")
        this.twoStepKey = page.locator("//div[@class='mfa-authenticator__code']//span[2]")
        this.currentPassword = page.locator("//input[@name='currentPassword']")
        this.newPassword = page.locator("//input[@name='newPassword']")
        this.submitBtn = page.locator("//div[@class='change-password__actions']//button[@type='submit']")
        this.successPopuptext = page.locator("//p[contains(@class, 'info-modal_message')]")
        this.acceptPopup = page.locator("//button//span[text()='Ok']")
    }
    async open2FactorAuthification(){
        await this.twoFactorAuth.click();
    }
    async checkedQRCodeVisible(){
        return await this.qrCode
    }
    async get2StepKey(){
        return await this.twoStepKey.textContent()
    }
    async changePasswordToNew(newPassword: string){
        await this.currentPassword.pressSequentially('Test123!')
        await this.page.waitForTimeout(500)
        await this.newPassword.pressSequentially(newPassword)
        await this.page.waitForTimeout(500)
        await this.submitBtn.click()
    }
    async openSettingsMenuItem(itemName: string){
        let menuPoint = await this.page.locator(`//div[contains(@class, 'user-settings-navigation__items')]//p[text()='${itemName}']`)
        await menuPoint.click();
    }
    async getSuccessPopuptext(){
        return await this.successPopuptext.textContent();
    }
    async acceptSuccessPopup(){
        await this.acceptPopup.click();
        await this.page.waitForTimeout(6000)
    }
    async getPhoneValidationStatus(){
        return await this.page.locator("//div[contains(@class, 'input-validation-box')]").textContent()
    }
    async openPhoneVerification(){
        await this.page.locator("//button[contains(@class, 'verify-phone-button')]").click()
    }
    async checkPhoneVerificationPopupIsVisible(){
        return await this.page.locator(".phone-verification-modal__text").isVisible()
    }
    async goBack(){
        await this.page.locator("//button[contains(@class, 'close-button')]").click()
    }
    async openEmailVerificationPopup(){
        await this.page.locator("//button[contains(@class, 'verify-email-button')]").click()
    }
    async checkEmailVerifiedPopupIsDisplayed(){
        return await this.page.locator('.verify-email-modal__title').isVisible()
    }
}