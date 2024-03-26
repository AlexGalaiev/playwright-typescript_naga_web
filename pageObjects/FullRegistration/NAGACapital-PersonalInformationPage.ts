import { Locator, Page } from "playwright/test";



export class PersonalInformation{
    page: Page;
    readonly firstName: Locator;
    readonly lastName: Locator;
    readonly dateOfBirth: Locator;
    readonly address: Locator;

    constructor(page:Page){
        this.page = page;
        this.firstName = page.locator("#first_name");
        this.lastName = page.locator("#last_name");
        this.dateOfBirth = page.locator("#date_of_birth");
        this.address = page.locator("[data-testid='naga-dropdown-input']");
    }

    async fillPersonalInformation(){
        await this.firstName.pressSequentially("test");
        await this.lastName.pressSequentially("test");
        await this.dateOfBirth.pressSequentially('12121990')
        await this.address.click();
        await this.address.pressSequentially("Bosnia and herzegovina association for united nations");
        await this.address.press("Enter");

    }
}