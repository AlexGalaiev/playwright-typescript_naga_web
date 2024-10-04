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
    readonly createPostForm: Locator;
    readonly flag: Locator;

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
        this.createPostForm = page.locator(".feed-status-post__actions-input")
        this.flag = page.locator(".user-profile-photo__country")
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
    async addTextToPost(textOfPost: string){
        await this.createPostForm.click()
        await this.page.waitForTimeout(250)
        await this.page.locator('#feed_comment_input_textarea').pressSequentially(textOfPost)
        await this.page.waitForTimeout(250);
        await this.page.locator('#post_status_button').click()
    };
    async getPostTextMessage(){
        let post = await this.page.locator('.feed-item');
        let postText = await post.locator('.user-message-header__description').textContent();
        return postText
    };
    async deletePost(){
        await this.page.locator('.user-message-header__options').click();
        await this.page.locator('[data-cy="delete-post"]').click()
        //await this.page.getByRole('presentation', {name: 'Delete this post'}).click()
        await this.page.getByRole('button', {name:"Yes, Delete"}).click()
    };
    async getCountryFlag(){
        return await this.flag.getAttribute('src')
    }
}