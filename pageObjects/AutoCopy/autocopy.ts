import { tr } from "@faker-js/faker";
import { Locator, Page } from "@playwright/test";

export class AutoCopy{
    page: Page
    autoCopyContainer: Locator
    manageAutoCopy: Locator
    pauseAutoCopy: Locator
    activeTradesBanner: Locator
    percenatgePopupInput: Locator;
    startAutoCopyBtn: Locator;
    enableAutoCopy: Locator;

    constructor(page: Page){
        this.page = page
        this.autoCopyContainer = page.locator(".copied-user-details")
        this.manageAutoCopy = page.locator("//div[@class='manage-auto-copy-user']//button[@id='split-button-pull-right']")
        this.pauseAutoCopy = page.locator("//a[text()='Pause Autocopying']")
        this.enableAutoCopy = page.locator("//a[text()='Enable User']")
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
    async closeMobileAutoCopiesIfExist(){
        let copyUsers = await this.page.locator(".list-of-copied-users")
        while(await copyUsers.isVisible()){
            let user = await this.page.locator("//div[contains(@class, 'copied-user-container ')]").first()
            await user.click()
            await this.page.locator("//button[@id='split-button-pull-right']").click()
            await this.page.waitForTimeout(750)
            await this.page.locator("//a[text()='Pause Autocopying']").click()
            await this.page.waitForTimeout(750)
            await this.page.locator("//button[contains(@class, 'copied-user-details__nav-back')]").click()
            await this.page.waitForTimeout(750)
        }
    }

    async chooseAutocopyTab(TabName: string){
        await this.page.locator(`//div[contains(@class, 'autocopy__tabs')]//span[contains(text(), '${TabName}')]`).click()
        await this.page.waitForTimeout(500)
    }

    async StartAutoCopyPopup(percentage: string){
        await this.page.waitForSelector(".auto-copy-settings__content", {state:'visible'})
        await this.percenatgePopupInput.clear()
        await this.page.waitForTimeout(500)
        await this.percenatgePopupInput.scrollIntoViewIfNeeded()
        await this.percenatgePopupInput.pressSequentially(percentage)
        await this.page.waitForTimeout(1000)
        await this.startAutoCopyBtn.click()
        let understandBtn = await this.page.locator("//button[text()='I understand']")
        await understandBtn.waitFor({state:'visible'})
        await understandBtn.click()
    }

    async chooseUserForCopyTrading(nameOfUser: string){
        await this.page.locator(`//div[@id='list_of_autocopy_users_container']//div[text()='${nameOfUser}']`).click()
    }
    async EnableAutoCopyUser(){
        await this.manageAutoCopy.click()
        await this.enableAutoCopy.click()        
    }
    async openTradesTab(nameOfTab: string){
        await this.page.locator(`//span[text()='${nameOfTab}']`).click()
    }


}