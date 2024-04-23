import { Locator, Page } from "playwright";

export class PhoneVerification{
    page: Page;
    readonly personalDetailsForm: Locator;
    readonly countryCode: Locator;
    readonly phoneNumber: Locator;
    readonly submitBtn: Locator;
    readonly verificationCode: Locator;
    readonly continueBtn: Locator;

    constructor(page: Page){
        this.page = page;
        this.personalDetailsForm = page.locator("//form[contains(@class, 'kyc-live-account-capital')]");
        this.countryCode = page.locator("//div[@name='country_phone_code']");
        this.phoneNumber = page.locator("[name='telephone']");
        this.submitBtn = page.locator("//div[contains(@class, 'phone-verification-capital')]//button[contains(@class, 'submit')]");
        this.verificationCode = page.locator("//input[contains(@name, 'otp')]");
        this.continueBtn = page.locator("//footer[contains(@class, 'phone-verification-capital')]");
    }

    async insertTestPhoneNumber(){
        await this.countryCode.click();
        await this.countryCode.pressSequentially("Bosnia");
        await this.countryCode.press("Enter");
        await this.phoneNumber.pressSequentially("603039647")
        await this.page.waitForTimeout(1500)
        await this.phoneNumber.press('Enter')
    };

    async insertVerificationCode(){
        await this.page.waitForTimeout(2000);
        // await this.verificationCode.first().waitFor({timeout:2000})
        for(const otpCode of await this.verificationCode.all()){
            await otpCode.pressSequentially('1');
        }
        await this.submitBtn.click();
        await this.page.waitForTimeout(10000)
    };

    async fillPersonalInformation(){
        
    }




}