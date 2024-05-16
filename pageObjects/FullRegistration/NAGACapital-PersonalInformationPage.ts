import { Locator, Page } from "playwright/test";

export class PersonalInformation{
    page: Page;
    readonly firstName: Locator;
    readonly lastName: Locator;
    readonly dateOfBirth: Locator;
    readonly address: Locator;
    readonly submitBtn: Locator;
    readonly street: Locator;
    readonly personalInfoForm: Locator;

    constructor(page:Page){
        this.page = page;
        this.firstName = page.locator("#first_name");
        this.lastName = page.locator("#last_name");
        this.dateOfBirth = page.locator("#date_of_birth");
        this.address = page.locator("[data-testid='naga-dropdown-input']");
        this.submitBtn = page.locator("//button[contains(@class, 'kyc-live-account-capital_submitButton')]")
        this.street = page.locator('#addr_street_no')
        this.personalInfoForm = page.locator(".complete-your-profile-modal__content")
    }

    async fillPersonalInformation(){
        await this.firstName.pressSequentially("test");
        await this.lastName.pressSequentially("test");
        await this.dateOfBirth.pressSequentially('12.12.1980')
        await this.address.click();
        await this.address.pressSequentially("Bosnia and herzegovina association for united nations");
        await this.page.waitForTimeout(1000);
        await this.address.press("Enter");
        await this.page.waitForTimeout(500);
        await this.submitBtn.click();
    }
    async waitPersonalInfoBlock(){
        await this.personalInfoForm.waitFor({state: "visible"})
        await this.page.reload()
    }
}