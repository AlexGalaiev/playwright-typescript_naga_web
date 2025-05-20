import { Page } from "playwright";

export class GusetLogin{
    page: Page

    constructor(page:Page){
        this.page = page
    }

    async changeLaguageTo(language: string){
        await this.page.locator("//button[contains(@class, 'guest-mode-header-actions__buttons__configuration')]").click()
        let existLan = await this.page.locator("//div[contains(@class, 'guest-settings-modal__dropdown__single-value')]").textContent()
        await this.page.waitForTimeout(500)
        if(existLan !== language){
            await this.page.waitForTimeout(500)
            await this.page.locator("//div[contains(@class, 'guest-settings-modal__dropdown__control')]").click()
           // await this.page.pause()
            await this.page.waitForTimeout(500)
            await this.page.locator(`//div[text()='${language}']`).click()
            await this.page.waitForTimeout(500)
        } 
    }
    async checkTutorPopupBtnIsVisible(btnName: string){
        await this.page.waitForSelector(`//button[text()='${btnName}']`, {state:'visible'})
        return await this.page.locator(`//button[text()='${btnName}']`).isVisible()
    }
    async openTutorPopup(btnName: string){
        await this.page.waitForSelector(`//button[text()='${btnName}']`, {state:'visible'})
        await this.page.locator(`//button[text()='${btnName}']`).click()
    }
    async checkTutorPopupTitleIsVisible(popupTitle: string){
        await this.page.waitForSelector(`//div[text()='${popupTitle}']`, {state:'visible'})
        return await this.page.locator(`//div[text()='${popupTitle}']`).isVisible()
    }
    async openGuestLoginPage(){
        await this.page.waitForTimeout(1000)
        let btn = await this.page.locator("//div[@class='tutorial-welcome-modal__buttons-container']//button").first()
        await btn.click()
    }
    async getSignInBtnText(){
        await this.page.waitForSelector(`//button[contains(@class, 'guest-mode-header-actions__buttons__login')]`, {state:'visible'})
        return await this.page.locator("//button[contains(@class, 'guest-mode-header-actions__buttons__login')]").textContent()
    }
    async getSignUpBtnText(){
        await this.page.waitForSelector(`//button[contains(@class, 'guest-mode-header-actions__buttons__register')]`, {state:'visible'})
        return await this.page.locator("//button[contains(@class, 'guest-mode-header-actions__buttons__register')]").textContent()
    }
    async checkGuestPageIsVisible(){
        await this.page.locator(".header__top-nav__guest-mode").waitFor({state:'visible'})
        return await this.page.locator(".header__top-nav__guest-mode").isVisible()
    }
    async checkMobileGuestPageIsVisible(){
        await this.page.locator(".guest-mode-header-actions__buttons").waitFor({state:'visible'})
        return await this.page.locator(".guest-mode-header-actions__buttons").isVisible()
    }
}