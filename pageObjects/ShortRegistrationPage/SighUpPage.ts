import { Locator, Page } from "@playwright/test";
import { RandomUser } from "../common/testUserCredentials/randomUser";

export class SignUp{
    page: Page;
    readonly email: Locator;
    readonly password: Locator;
    readonly country: Locator;
    readonly submitBtn: Locator;
    readonly riskWarning: Locator;
    readonly sighUpTittle: Locator;
    readonly NM_checkboxPrivacyPolicy: Locator;
    readonly NM_checkbox_yearsConfirmeation: Locator;

    constructor(page: Page){
        this.page = page;
        this.email = page.locator("[name='email']");
        this.password = page.locator("[name='password']");
        this.country = page.locator("[data-testid='naga-dropdown-input']");
        this.submitBtn = page.locator("//button[contains(@class, 'submit')]");
        this.riskWarning = page.locator(".registration-form__risk-warning");
        this.sighUpTittle = page.locator("//div[@class='registration-form__title']")
        this.NM_checkboxPrivacyPolicy = page.locator("//div[@class='custom-checkbox'][1]");
        this.NM_checkbox_yearsConfirmeation = page.locator("//div[@class='custom-checkbox'][2]");
    };

    async goto(MainPage: string, pageTest: string){
        await this.page.goto(`${MainPage}/${pageTest}`);
    };

    async createCFDUser(Country: string){
        let user = new RandomUser();
        let randomEmail = user.getRandomUserEmail();
        await this.email.pressSequentially(randomEmail);
        await this.password.pressSequentially("Test123!")
        await this.checkCountry(Country)
        await this.submitBtn.click();
        return randomEmail;
    };
    async create_NM_CFDUser(Country: string){
        let user = new RandomUser();
        let randomEmail = user.getRandomUserEmail();
        await this.email.pressSequentially(randomEmail);
        await this.password.pressSequentially("Test123!")
        await this.checkCountry(Country)
        await this.NM_checkboxPrivacyPolicy.click();
        await this.NM_checkbox_yearsConfirmeation.click();
        await this.submitBtn.click();
        return randomEmail;
    }

    async checkCountry(Country: string){
        if(await this.country.textContent() !== Country){
            await this.country.click();
            await this.country.pressSequentially(Country);
            await this.country.press('Enter')
        } else {}
    };
    async getRiskWarningText(){
        return await this.riskWarning.textContent();
    };
    async getSighUpTittleText(){
        return await this.sighUpTittle.textContent();
    };
}