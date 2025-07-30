import { Page } from "@playwright/test";

export class MultiLicense{
    page: Page;

    constructor(page:Page){
        this.page = page
    }

    async checkRegulation(nameOfRegulation: string){
        let regulationBtn = await this.page.locator(`//button[text()='Continue with ${nameOfRegulation}']`)
        let block = await this.page.locator(`//p[contains(text(), '${nameOfRegulation}')]`)
        let atribute = await regulationBtn.getAttribute('class')
        if(atribute?.includes('not-selected')){
            await block.click()
        }
        await regulationBtn.click()
    }

    async checkKYCTitle(title: string){
        await this.page.waitForSelector(`//p[text()='${title}']`, {state:'visible'})
        return await this.page.locator(`//p[text()='${title}']`).isVisible()
    }

    async getPopupName(){
        return await this.page.locator(".change-department-modal__header__title").textContent()
    }
    async CapitalKYC(){
        let kycHeader = await this.page.locator("//p[text()='Complete your profile information']")
        await kycHeader.waitFor({state:'visible'})
        return await kycHeader
    }

    async ADGMKYC(){
        let kycHeader = await this.page.locator("//h1[text()='Let’s Set Up Your Real-Money Account']")
        await kycHeader.waitFor({state:'visible'})
        return await kycHeader
    }

    async multiLycensePopup(){
        let popup = await this.page.locator(".change-department-modal__header")
        await popup.waitFor({state:"visible"})
        return await popup.isVisible()
    }
}