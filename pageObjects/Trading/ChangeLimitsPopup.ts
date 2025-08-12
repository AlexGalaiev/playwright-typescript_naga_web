import { Locator, Page } from "@playwright/test";


export class ChangeLimitsPopup{
    page: Page;
    readonly changeLimitPopup: Locator;
    readonly instrumentName: Locator;
    readonly investmentAmount: Locator;
    readonly specificRateCheckbox: Locator;
    readonly stopLossSwitcher: Locator;
    readonly takeProfit: Locator;
    readonly updateBtn: Locator;
    
    constructor(page: Page){
        this.page = page;
        this.changeLimitPopup = page.locator(".change-trade-limits__body");
        this.instrumentName = page.locator(".trade-symbol__name");
        this.investmentAmount = page.locator("//span[text()='Invested:']//..//span[contains(@class, 'amount')]")
        this.specificRateCheckbox = page.locator("//input[@value='rate']")
        this.stopLossSwitcher = page.locator("//span[text()='Stop Loss']//..//..//label[contains(@class, 'switch')]")
        this.takeProfit = page.locator("//span[text()='Take Profit']//..//..//label[contains(@class, 'switch')]")
        this.updateBtn = page.locator("//button[contains(@class, 'limits-update')]")
    }
    async getInstrumentName(){
        return await this.instrumentName.textContent()
    }
    async getInvestedAmount(){
        return await this.investmentAmount.textContent();
    };
    async enableStopLoss(){
        await this.page.waitForSelector(
            "//span[contains(@class, 'change-trade-limits__profit')]//span[contains(@class, 'value-negative')]", {state:'visible'})
        await this.page.waitForTimeout(2500)
        await this.stopLossSwitcher.click()
        await this.page.waitForTimeout(500);
    };
    async enableTakeProgit(){
        await this.page.waitForSelector(
            "//span[contains(@class, 'change-trade-limits__profit')]//span[contains(@class, 'value-negative')]", {state:'visible'})
        await this.page.waitForTimeout(2500)
        await this.takeProfit.click()
        await this.page.waitForTimeout(500);
    };

    async enableProtection(nameOfProtection:string){
        let switcher = await this.page.locator(`//span[text()='${nameOfProtection}']//..//..//div[@class='limit-value-old__switch']`)
        await switcher.click()
        await this.page.waitForTimeout(1000)
    }
    async updatePosition(){
        await this.updateBtn.click()
        await this.page.waitForTimeout(1000)
    };
    async getProtectionValue(protectionType: string){
        let mainElement = await this.page.locator(`//span[text()='${protectionType}']//..//..`).first()
        let element = await mainElement.locator("//input[@type='text']")
        return await element.textContent()
        ////span[text()='Stop Loss']//..//..//div[@class='limit-value__input']
    }
    async getPopupStopLoss(currency:string){
        let expectedStopLoss = await this.page.locator("//span[@class='change-trade-limits__profit']/following-sibling::span").textContent()
        let value = expectedStopLoss?.replace(currency, '')
        return value
    }
    async inputProtectionValue(nameOfProtection: string, value: string){
        let inputField = await this.page.locator(`//span[text()='${nameOfProtection}']//..//..//input[@type='text']`)
        await inputField.clear()
        await inputField.pressSequentially(value)
        //await this.page.waitForTimeout(500)
    }
    async switchToSpecificRateForm(){
        await this.page.waitForTimeout(250)
        await this.page.locator("//span[text()='Specific Rate']/preceding-sibling::input").nth(1).click()
        await this.page.waitForTimeout(250)
    }

    async updatePosition_EnableProtection(protectionName:string){
        let nagaProtector = await this.page.locator(".naga-protector")
        let protection = await nagaProtector.locator("//div[contains(@class, 'limit-value')]", {has: await this.page.locator(`//span[text()='${protectionName}']`)})
        await this.page.waitForTimeout(3000)
        await protection.locator(".limit-value__switch").click()
        await this.page.waitForTimeout(1500)
        let value = await protection.locator("//div[@class='limit-value__input']//input")
        return await value.getAttribute('value')
    }
    //debug function for test
    async updatePositionWithManuallInput(protectionName:string){
        await this.page.waitForTimeout(1500)
        let bouthgtAt = await this.page.locator("//span[text()='Bought at:']//..//span").nth(2).textContent()
        let nagaProtector = await this.page.locator(".naga-protector-old")
        let protection = await nagaProtector.locator("//div[contains(@class, 'limit-value')]", {has: await this.page.locator(`//span[text()='${protectionName}']`)})
        await this.page.waitForTimeout(2000)
        await protection.locator(".limit-value-old__switch").click()
        await this.page.waitForTimeout(1500)
        let value = await protection.locator("//div[@class='limit-value-old__input']//input")
        await value.clear()
        let newPrice = String(await this.calculationProtection(bouthgtAt || '', protectionName))
        await value.pressSequentially(String(newPrice))
        await this.page.waitForTimeout(1000)
        return newPrice
    }

    async calculationProtection(itemPrice: string, protectionName: string){
        let price
        if(protectionName == "Take Profit"){
            price = (Number(itemPrice)) * 1.10
        }else if(protectionName == 'Stop Loss'){
            price = Number(itemPrice) / 1.10
        }
        let newPrice = Math.floor(price * 10) / 10
        return newPrice
    }

    async switchToSpecificRate(){
        await this.page.locator('//input[@value="rate"]').click()
    }
}