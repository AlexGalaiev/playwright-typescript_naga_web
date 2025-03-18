import { Locator, Page } from "@playwright/test";

export class AutoCopy{
    page: Page
    autoCopyContainer: Locator
    manageAutoCopy: Locator
    pauseAutoCopy: Locator
    activeTradesBanner: Locator
    percenatgePopupInput: Locator;
    startAutoCopyBtn: Locator;

    constructor(page: Page){
        this.page = page
        this.autoCopyContainer = page.locator(".copied-user-details")
        this.manageAutoCopy = page.locator("//div[@class='manage-auto-copy-user']//button[@id='split-button-pull-right']")
        this.pauseAutoCopy = page.locator("//a[text()='Pause Autocopying']")
        this.activeTradesBanner = page.locator("//span[text()='Active Trades']")
        this.percenatgePopupInput = page.locator("//div[@class='auto-copy-settings__input-container_field']//input")
        this.startAutoCopyBtn = page.locator('#auto_copy_button')

    }
    async closeAutoCopiesIfexist(){
        if(await this.activeTradesBanner.isVisible()){
            await this.manageAutoCopy.click()
            await this.pauseAutoCopy.click()
            await this.activeTradesBanner.waitFor({state:'hidden'})
        }
    }

    async chooseAutocopyTab(TabName: string){
        await this.page.locator(`//div[contains(@class, 'autocopy__tabs')]//span[contains(text(), '${TabName}')]`).click()
        await this.page.waitForTimeout(500)
    }

    async StartAutoCopyPopup(percentage: string){
        await this.page.waitForSelector(".auto-copy-settings__content", {state:'visible'})
        await this.percenatgePopupInput.clear()
        await this.page.waitForTimeout(250)
        await this.percenatgePopupInput.pressSequentially(percentage)
        await this.page.waitForTimeout(1000)
        await this.startAutoCopyBtn.click()
        let understandBtn = await this.page.locator("//button[text()='I understand']")
        await understandBtn.waitFor({state:'visible'})
        await understandBtn.click()
    }


}