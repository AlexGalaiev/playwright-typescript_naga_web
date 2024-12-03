import { Locator, Page } from "playwright";

export class PhoneVerification{
    page: Page;
    readonly personalDetailsForm: Locator;
    readonly countryCode: Locator;
    readonly phoneNumber: Locator;
    readonly submitBtn: Locator;
    readonly verificationCode: Locator;
    readonly continueBtn: Locator;
    readonly MN_verifyCode: Locator;

    constructor(page: Page){
        this.page = page;
        this.personalDetailsForm = page.locator("//form[contains(@class, 'kyc-live-account-capital')]");
        this.countryCode = page.locator("//div[@name='country_phone_code']");
        this.phoneNumber = page.locator("[name='telephone']");
        this.submitBtn = page.locator("//div[contains(@class, 'phone-verification-capital')]//button[contains(@class, 'submit')]");
        this.verificationCode = page.locator("//input[contains(@name, 'otp')]");
        this.continueBtn = page.locator("//footer[contains(@class, 'phone-verification-capital')]");
        this.MN_verifyCode = page.locator("//button[contains(@class, 'verify-phone-number')]")
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
        await this.insertCode(0, '1')
        await this.insertCode(1, '1')
        await this.insertCode(2, '1')
        await this.insertCode(3, '1')
        await this.submitBtn.click();
        await this.page.waitForTimeout(10000)
    };

    async MN_insertVerificationCode(){
        await this.page.getByText('Send to SMS').click()
        await this.page.waitForTimeout(2000);
        for(const otpCode of await this.verificationCode.all()){
            await otpCode.pressSequentially('1');
        }
        await this.page.waitForTimeout(500)
        await this.page.locator("//footer//button[text()='Verify']").click();  
    }
    async insertVerificationCode_Crypto(){
        await this.insertCode(0, '1')
        await this.insertCode(1, '1')
        await this.insertCode(2, '1')
        await this.insertCode(3, '1')
        await this.page.locator("//button[contains(@class, 'kyc-live-account_submitButton')]").click();
        await this.page.waitForTimeout(22000)
    }

    async waitPersonalDetails(){
        await this.page.waitForSelector("//p[text()='Personal Details']", {state:'visible', timeout:25000})
    }
    async acceptPhoneNumber(){
        await this.page.locator("//button[contains(@class, 'kyc-live-account_submitButton')]").click()
        await this.page.waitForSelector("//div[contains(@class, 'phone-verification-modal__body__kyc')]", {state:'visible'})
    }
    async insertCode(index: number, code: string){
        await this.page.waitForTimeout(500)
        let field = await this.verificationCode.nth(index)
        await field.pressSequentially(code)
        await this.page.waitForTimeout(500)
    }
}