import { Locator, Page } from "playwright";

export class Deposit{
    page: Page;
    readonly depositInputValuePoopup: Locator;
    readonly inputFieldDepositPopup: Locator;
    readonly submitDeposit: Locator;

    constructor(page: Page){
        this.page = page;
        this.depositInputValuePoopup = page.locator(".modal-content")
        this.inputFieldDepositPopup = page.locator("//input[contains(@class, 'amount')]")
        this.submitDeposit = page.locator("//button[@type='submit']")
    }

    ///new
    async performDepositWithoutAmount(depositName:string, depositUrl:string){
        await this.page.waitForTimeout(1500)
        //choose deposit method 
        let depositMethod = await this.page.locator('.funding-method-table-body__info')
        .filter({has: await this.page.locator(`//img[contains(@src, '${depositName}')]`)})
        //await depositMethod.scrollIntoViewIfNeeded()
        //click on deposit method and get response
        const [response] = await Promise.all([
            this.page.waitForResponse(depositUrl),
            depositMethod.click()
        ]) 
        return response
    }
    async performMobileDepositWithoutAmount(depositName:string, depositUrl:string){
        await this.page.waitForTimeout(1500)
        //choose deposit method 
        let depositMethod = await this.page.locator("//div[contains(@class, 'fund-method-item-default')]")
        .filter({has: await this.page.locator(`//img[contains(@src, '${depositName}')]`)})
        //await depositMethod.scrollIntoViewIfNeeded()
        //click on deposit method and get response
        await depositMethod.click()
        const [response] = await Promise.all([
            this.page.waitForResponse(depositUrl),
            this.page.locator("//button[text()='Continue']").click()
        ]) 
        return response
    }
    async performDepositWithAmount(depositName:string, value:string, depositUrl:string){
        await this.page.waitForTimeout(1500)
        //choose deposit method 
        let depositMethod = await this.page.locator('.funding-method-table-body__info')
        .filter({has: await this.page.locator(`//img[contains(@src, '${depositName}')]`)})
        await depositMethod.scrollIntoViewIfNeeded()
        await depositMethod.click()
        //popup with input value
        await this.depositInputValuePoopup.waitFor({state:"visible"});
        await this.inputFieldDepositPopup.clear()
        await this.page.waitForTimeout(1000)
        await this.inputFieldDepositPopup.pressSequentially(value);
        await this.page.waitForTimeout(1500)
        // Wait for response after click sub,it btn
        const [response] = await Promise.all([
            this.page.waitForResponse(depositUrl, {timeout:15000}),
            this.submitDeposit.click()
        ]) 
        return response
    }
    async performMobileDepositWithAmount(depositName:string, value:string, depositUrl:string){
        await this.page.waitForTimeout(1500)
        //choose deposit method 
        let depositMethod = await this.page.locator("//div[contains(@class, 'fund-method-item-default')]")
        .filter({has: await this.page.locator(`//img[contains(@src, '${depositName}')]`)})
        await depositMethod.scrollIntoViewIfNeeded()
        await depositMethod.click()
        await this.page.waitForTimeout(750)
        await this.page.locator("//button[text()='Continue']").click()
        //popup with input value
        await this.depositInputValuePoopup.waitFor({state:"visible"});
        await this.inputFieldDepositPopup.clear()
        await this.page.waitForTimeout(1000)
        await this.inputFieldDepositPopup.pressSequentially(value);
        await this.page.waitForTimeout(1500)
        // Wait for response after click sub,it btn
        const [response] = await Promise.all([
            this.page.waitForResponse(depositUrl, {timeout:15000}),
            this.submitDeposit.click()
        ]) 
        return response
    }
    async getApiPaymentMethodKey(responseBody: any){
        let response = await responseBody.json()
        return await response.gateways[0].payment_method_key
    }
    async getApiStatusCode(bodyJson: any){
        return await bodyJson.status()
    }
    async getSuccessStatus(response: any){
        let responseBody = await response.json()
        return await responseBody.success
    }
    async getInfoCode(response: any){
        let responseBody = await response.json()
        return await responseBody.info.code
    }
    async getNumberOfDepositMethods(){
        await this.page.waitForTimeout(500)
        return await this.page.locator("//div[contains(@class, 'funding-method-table-body__info')]").count()
    }
    async getNumberOfMobileDeposits(){
        await this.page.waitForSelector("//div[contains(@class, 'fund-method-item-default')][1]", {state:'visible'})
        await this.page.waitForTimeout(1000)
        return await this.page.locator("//div[contains(@class, 'fund-method-item-default')]").count()
    }
    async checkActiveDepositTab(tabName: string){
        let tab = await this.page.locator(`//a[contains(@id, 'mm_${tabName}')]`)
        let tabStatus = await tab.getAttribute('class')
        if(!tabStatus?.includes('active'))
            await tab.click()
    }
    async checkActiveMobileManageTab(nameOfTheTab:string){
        let tab = await this.page.locator(`//a[contains(@data-location, '/manage-money/${nameOfTheTab}')]//..`).first()
        let tabStatus = await tab.getAttribute('class')
        if(!tabStatus?.includes('active'))
            await tab.click()
    }
    async getCurrentUrl(){
        await this.page.waitForTimeout(1500)
        return await this.page.url();
    }
    async clickDepositMethod(methodName: string){
        let depositName = await this.page.locator(".method-name__full", {hasText: methodName})
        await depositName.click()
        await this.page.waitForTimeout(500)
    }
    async clickMobileDepositMethod(methodName: string){
        let depositMethod = await this.page.locator(".fund-method-item-title", {hasText:methodName})
        await depositMethod.click()
        await this.page.waitForTimeout(500)
        await this.page.locator("//button[text()='Continue']").click()
    }
}