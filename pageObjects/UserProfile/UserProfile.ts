import { Locator, Page } from "playwright/test";

export class UserProfile{
    page: Page;
    readonly editUserNameBtn: Locator;
    readonly editUserNameField: Locator;
    readonly saveBtn: Locator;
    readonly userName: Locator;
    readonly editAboutMeSection: Locator;

    constructor(page: Page){
        this.page = page;
        this.editUserNameBtn = page.locator("//i[contains(@class, 'icn-pencil-thin')]");
        this.editUserNameField = page.locator("[name='user_name']")
        this.saveBtn = page.locator("//button[contains(@class, 'actions-save')]")
        this.userName = page.locator("//div[contains(@class, 'name-container__username')]");
        this.editAboutMeSection = page.locator("//button[contains(text(), 'Edit')]");
    }

    async changeName(NewName: string){
        await this.editUserNameBtn.click();
        await this.editUserNameField.pressSequentially(NewName);
        await this.page.waitForTimeout(500)
        await this.saveBtn.click();
    };
    async getUserNameText(){
        return await this.userName.textContent()
    };
    


}