import { Locator, Page } from "playwright/test";
import { RandomUser } from "../common/testUserCredentials/randomUser";

export class PersonalInformation{
    page: Page;
    readonly firstName: Locator;
    readonly lastName: Locator;
    readonly dateOfBirth: Locator;
    readonly address: Locator;
    readonly userName: Locator;
    readonly countryCode: Locator;
    readonly phone: Locator;
    readonly verificationCode: Locator;
    
    constructor(page:Page){
        this.page = page;
        this.firstName = page.locator('[name="first_name"]');
        this.lastName = page.locator('[name="last_name"]');
        this.dateOfBirth = page.locator("#date_of_birth");
        this.address = page.locator("[data-testid='naga-dropdown-input']");
        this.userName = page.locator('[name="user_name"]')
        this.countryCode = page.locator('[data-testid="naga-dropdown-input"]')
        this.phone = page.locator('[name="phone"]')
        this.verificationCode = page.locator("//input[contains(@name, 'otp')]");
    }

    async fillPersonalInformation(submitBtnName: string){
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
        await this.phone.clear()
        await this.phone.pressSequentially("603039647")
        await this.page.waitForTimeout(750);
        await this.page.locator(`//button[text()='${submitBtnName}']`).click();
    }
    
    async compleateYourProfile(){
        await this.page.waitForSelector("//p[text()='Enter your information as it appears on your ID/Passport:']", {state:'visible'})
        await this.firstName.pressSequentially('testFirstName');
        await this.page.waitForTimeout(1000);
        await this.lastName.pressSequentially('testLastName');
        await this.page.waitForTimeout(1000);
        await this.dateOfBirth.pressSequentially('12.12.1989')
        await this.page.waitForTimeout(500)
        await this.page.locator("//button[@type='submit']").click()
    }
    async fillLocationInformation(){
        await this.address.click()
        await this.address.pressSequentially("405 E 45th St, New York, NY 10017, Соединенные Штаты")
        await this.page.waitForTimeout(1000)
        await this.address.press('Enter')
        await this.page.waitForTimeout(1000)
        await this.page.locator("//button[@type='submit']").click()
    }

    async fillPersonalDetailsInformation(){
        await this.chooseFromDropDown('Nationality')
        await this.page.waitForTimeout(1000)
        await this.clickCheckBox('Are you a politically exposed person?*','No')
        await this.page.waitForTimeout(1000)
        await this.page.locator("//button[@type='submit']").click()
    }

    async clickDepositNow(){
        let depositBtn = await this.page.locator("//button[text()='Deposit Now']")
        await depositBtn.waitFor({state:"visible"})
        await depositBtn.click()
    }
    async clickLogOut(){
        await this.page.waitForSelector(".complete-your-profile-modal__content", {state:'visible'})
        await this.page.locator("//button[text()='Sign out']").click()
        await this.page.waitForTimeout(3000)
    }
    async clickExploreNaga(){
        await this.page.locator("//button[text()='Explore NAGA Platform']").click()
    }
     async chooseFromDropDown(questionName: string){
        let question = await this.page.locator(`//label[text()='${questionName}']//..`).first()
        await question.click()
        let answer = await question.locator("//div[contains(@class, 'select__option')]").first()
        await answer.click()
        await this.page.waitForTimeout(1000)
    }
    async clickCheckBox(questionName: string, answer: string){
        let question = await this.page.locator(`//p[text()='${questionName}']//..`)
        let answerText = await question.locator(`//div[text()='${answer}']`)
        await answerText.click()
        await this.page.waitForTimeout(500)
    }
    async verifyYouPhoneNumber(){
        await this.page.waitForTimeout(500)
        await this.page.locator("//button[@type='submit']").click()
        await this.page.waitForSelector("//p[text()='Verification Code']", {state:'visible'})
        
    }
}