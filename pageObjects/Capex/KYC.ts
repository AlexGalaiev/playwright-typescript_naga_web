import { Page } from "playwright";

export class CapexKYC{
    page: Page

    constructor(page: Page){
        this.page = page
    }
    async chooseDropDown(answer:string, question:string){
        await this.page.waitForTimeout(250)

    }
}