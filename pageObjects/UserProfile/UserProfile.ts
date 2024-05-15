import { Locator, Page } from "playwright/test";
import { RandomUser } from "../common/testUserCredentials/randomUser";

export class UserProfile{
    page: Page;
    readonly editUserNameBtn: Locator;
    readonly editUserNameField: Locator;
    readonly saveBtn: Locator;
    readonly userName: Locator;
    readonly editAboutMe: Locator;
    readonly aboutMePlaceholder: Locator;
    readonly aboutMeTextInput: Locator;
    readonly aboutMeSaveBtn: Locator;
    readonly aboutMeEditedDescription: Locator;

    constructor(page: Page){
        this.page = page;
        this.editUserNameBtn = page.locator("//i[contains(@class, 'icn-pencil-thin')]");
        this.editUserNameField = page.locator("[name='user_name']")
        this.saveBtn = page.locator("//button[contains(@class, 'actions-save')]")
        this.userName = page.locator("//div[contains(@class, 'name-container__username')]");
        this.editAboutMe = page.locator("//button[contains(text(), 'Edit')]");
        this.aboutMePlaceholder = page.locator("//div[@class='user-about-me__placeholder']")
        this.aboutMeTextInput = page.locator(".user-about-me__input")
        this.aboutMeSaveBtn = page.locator("//button[contains(text(), 'Save')]")
        this.aboutMeEditedDescription = page.locator("//div[@class='user-about-me__description']");
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
    async getDefaultText(){
        await this.aboutMePlaceholder.scrollIntoViewIfNeeded()
        return await this.aboutMePlaceholder.textContent();
    }
    async changeAboutMeText(){
        let randomText = new RandomUser();
        await this.editAboutMe.scrollIntoViewIfNeeded();
        await this.editAboutMe.click();
        await this.aboutMeTextInput.pressSequentially(randomText.randomUserName())
        await this.page.waitForTimeout(250);
        await this.aboutMeSaveBtn.click();
        await this.page.waitForTimeout(2000)
    }
    async getEditedAboutMe(){
        return await this.aboutMeEditedDescription.textContent();
    }


}