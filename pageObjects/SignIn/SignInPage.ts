import { Locator, Page } from "@playwright/test";
import {test} from '..//..//test-options'

export class SignIn{
    readonly page: Page;
    readonly signInName: Locator;
    readonly signInPassword: Locator;
    readonly signBtn: Locator;
    readonly forgotPasswordLink: Locator;
    readonly redirectionNotice: Locator;
    readonly redirectionButton: Locator;
    readonly sighInHeaderName: Locator;
    readonly incorrectCredentialsMsg: Locator;
    readonly languageSwitcher: Locator;

    constructor(page: Page){
        this.page = page;
        this.signInName = page.locator("[name='user_name']");
        this.signInPassword = page.locator("[name='password']");
        this.signBtn = page.locator("[data-cy='login-btn']");
        this.forgotPasswordLink = page.locator(".login-form__forgot-password");
        this.redirectionNotice = page.locator(".prompt__content__message");
        this.redirectionButton = page.locator("//div[@class='prompt__actions']//button");
        this.sighInHeaderName = page.locator("//h2[contains(@class, 'login-form__headline')]");
        this.incorrectCredentialsMsg = page.locator(".login-form__error");
        this.languageSwitcher = page.locator('.registration-header__dropdown-toggle');
    }
    async signInUserToPlatform(UserEmail: string, UserPassword: string){
        await this.signInName.waitFor({state:"visible"})
        await this.signInName.clear()
        await this.signInName.pressSequentially(UserEmail);
        await this.signInPassword.pressSequentially(UserPassword);
        await this.signBtn.click();
        //await new SignIn(this.page).closeLearnMoreIfExist()
    };
    async forgotPasswordClick(){
        await this.page.waitForTimeout(500)
        await this.forgotPasswordLink.click();
        await this.page.waitForTimeout(500)
    };
    async getRedirectionNoticeMsg(){
        return await this.redirectionNotice.textContent();
    };
    async redirectAccept(){
        await this.redirectionButton.click()
        await this.page.waitForTimeout(1500);
    };
    async getSignInHeaderText(){
        return await this.sighInHeaderName.textContent();
    };
    async getLoginErrorMsg(){
        await this.page.waitForTimeout(1500)
        return await this.incorrectCredentialsMsg.textContent();
    };
    async clickSignInBtn(){
        await this.signBtn.click();
    };
    async goto(MainPage: string, pageTest: string){
        await this.page.goto(`${MainPage}/${pageTest}`);
    };

    async openLanguages(){
        await this.languageSwitcher.click();
        await this.page.waitForTimeout(500)
    }
    async checkDefaultLanguage(language: string){ 
        return await this.page.locator(`//img[@alt='${language}']//..`)
    }
    async checkPageHeader(){
        await this.page.waitForTimeout(500)
        return await this.page.locator("//h2[contains(@class, 'login-form__headline')]").textContent()
    }

    async clickLogo(){
        await this.page.locator(".naga-logo"). click()
        await this.page.waitForTimeout(500)
    }
    async getLoginMainPageText(){
        await this.page.waitForSelector(".login-form__wrapper", {state:'visible'})
        return await this.page.locator(".login-form__headline").textContent()
    }
    async switchPage(page: Page){
        await this.page.bringToFront()
        await this.page.waitForTimeout(300)
    }
    async closeLearnMoreIfExist(){
        await this.page.waitForTimeout(5000)
        let learnBtn = await this.page.locator("//button[text()='Learn more']")
        if (await learnBtn.isVisible()){
            await this.page.locator('//img[@alt="Close modal"]').click()
        }
    }
  
}