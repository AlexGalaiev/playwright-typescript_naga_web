import { Locator, Page } from "@playwright/test";
import { RandomUser } from "../common/testUserCredentials/randomUser";

export class PersonalInformation{
    page: Page;
    readonly firstName: Locator;
    readonly lastName: Locator;
    readonly userName: Locator;
    readonly phone: Locator;
    readonly countryCode: Locator;
    readonly verifyBySMS: Locator;
    readonly submitBtn: Locator;

    constructor(page: Page){
        this.page = page;
        this.firstName = page.locator("[name='first_name']")
        this.lastName = page.locator("[name='last_name']")
        this.userName = page.locator("[name='user_name']")
        this.phone = page.locator("[name='phone']")
        this.verifyBySMS = page.locator("//button[contains(text(), 'SMS')]")
        this.countryCode = page.locator("[data-testid='naga-dropdown-input']")
        this.submitBtn = page.locator("//button[text()='Proceed']")
    };

    async fillPersonalInformation(){
        let randomUser = new RandomUser();
        await this.page.waitForTimeout(5000)
        await this.firstName.pressSequentially('testFirstName');
        await this.page.waitForTimeout(1000);
        await this.lastName.pressSequentially('testLastName');
        await this.page.waitForTimeout(1000);
        await this.userName.pressSequentially(randomUser.randomUserName());
        await this.page.waitForTimeout(1000)
        await this.countryCode.click();
        await this.page.waitForTimeout(250)
        await this.countryCode.pressSequentially("Bosnia")
        await this.page.waitForTimeout(1000)
        await this.countryCode.press('Enter')
        await this.phone.pressSequentially("603039647")
        await this.page.waitForTimeout(750);
        await this.verifyBySMS.click();
    }
    async fillCryptoPersonalInfo(){
        let randomUser = new RandomUser();
        await this.page.waitForTimeout(1000)
        await this.firstName.clear()
        await this.firstName.pressSequentially('TestN')
        await this.page.waitForTimeout(100)
        await this.lastName.clear()
        await this.lastName.pressSequentially('TestSN')
        await this.page.waitForTimeout(500)
        await this.userName.pressSequentially(randomUser.randomUserName())
        await this.page.waitForTimeout(500)
        await this.phone.pressSequentially('603039647')
        await this.page.waitForTimeout(500)
        await this.submitBtn.click();
    }
}