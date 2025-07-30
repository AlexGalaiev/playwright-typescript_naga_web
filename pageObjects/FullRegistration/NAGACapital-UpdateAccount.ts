import { Locator, Page } from "playwright/test";

export class UdpateAccount{
    page: Page;
    readonly finishBtn: Locator;
    readonly kycForm: Locator;

    constructor(page: Page){
        this.page = page;
        this.finishBtn = page.locator("//button[contains(@class, 'kyc-live-account-capital_submitButton')]");
        this.kycForm = page.locator("//form[@class='kyc-live-account-capital_wizard__3kC_k']")
    }

    async clickFinishBtn(){
        await this.page.waitForSelector("//p[text()='Expected country of origin and destinations of your funds?']", {state:'visible'})
        await this.page.locator('//button[@type="submit"]').click()
        await this.page.waitForTimeout(700)
        await this.page.locator('//button[@type="submit"]').click()
        await this.page.waitForTimeout(700)
        await this.page.locator('//button[@type="submit"]').click()
        const [response] = await Promise.all([
            this.page.waitForResponse("**/kyc/scores", {timeout:15000}),
            this.page.locator("//button[text()='Finish']").click()
        ])
        let body = await response.json()
        let amlScor = await body.data.aml_score
        let score = await body.data.knowledge_experience_score
        return await [amlScor, score]
    }
}