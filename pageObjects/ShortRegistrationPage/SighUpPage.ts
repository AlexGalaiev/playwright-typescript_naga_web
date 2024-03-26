import { Locator, Page } from "@playwright/test";
import { RandomUser } from "../common/testUserCredentials/randomUser";

export class SignUp{
    page: Page;
    readonly email: Locator;
    readonly password: Locator;
    readonly country: Locator;
    readonly submitBtn: Locator;

    constructor(page: Page){
        this.page = page;
        this.email = page.locator("[name='email']");
        this.password = page.locator("[name='password']");
        this.country = page.locator("[data-testid='naga-dropdown-input']");
        this.submitBtn = page.locator("//button[contains(@class, 'submit')]");
    };

    async goto(MainPage: string, pageTest: string){
        await this.page.goto(`${MainPage}/${pageTest}`);
        await this.email.waitFor({timeout:4000})
    }
    async createCFDUser(Country: String){
        let user = new RandomUser();
        await this.email.pressSequentially(user.getRandomUserEmail());
        await this.password.pressSequentially("Test123!")
        await this.checkCountry("Ukraine")
        await this.submitBtn.click();     
    }

    async checkCountry(Country: string){
        if(await this.country.textContent() !== Country){
            await this.country.click();
            await this.country.pressSequentially(Country);
            await this.country.press('Enter')
        } else {}
    };
}