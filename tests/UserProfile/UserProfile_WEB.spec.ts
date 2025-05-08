import { expect } from "@playwright/test";
import { RandomUser } from "../../pageObjects/common/testUserCredentials/randomUser";
import { MainPage } from "../../pageObjects/MainPage/MainPage";
import { SignUp } from "../../pageObjects/ShortRegistrationPage/SighUpPage";
import { HeaderMenuUserProfile } from "../../pageObjects/UserProfile/HeaderUserProfile";
import { UserProfile } from "../../pageObjects/UserProfile/UserProfile";
import {test} from "../../test-options";
import { SignIn } from "../../pageObjects/SignIn/SignInPage";
import { PersonalInformation } from "../../pageObjects/FullRegistration/NAGACapital-PersonalInformationPage";
import { Captcha } from "../../pageObjects/captcha";
import { MyAccounts } from "../../pageObjects/MainPage/MyAccounts";

test.describe("WEB", async()=>{
    test("@23573 NagaCapital. User profile. General", 
        {tag:'@settings'}, async({page, AppNAGA, NSCountry}, testInfo)=>{
        testInfo.setTimeout(testInfo.timeout + 30000);
        let signUp = new SignUp(page);
        let userProfile = new UserProfile(page);
        let myAccounts = new MyAccounts(page)
        let randomUser = new RandomUser()
        let email = randomUser.getRandomUserEmail()
        await test.step(`Create lead user ${email}`, async ()=>{
            await signUp.goto(AppNAGA, 'register')
            await new Captcha(page).removeCaptcha()
            await signUp.createCFDUser(email, process.env.USER_PASSWORD || "", NSCountry,'+387', '603039647')
            await new PersonalInformation(page).clickExploreNaga()
        })
        await test.step('Edit username information', async()=>{
            await myAccounts.openUserMenu()
            await myAccounts.openMyAccountMenuItem('My Social Profile')
            let nameBeforeChanging = await userProfile.getUserNameText();
            await userProfile.changeName(await randomUser.randomUserName())
            expect(await userProfile.getUserNameText()).not.toEqual(nameBeforeChanging);
        })
        await test.step("Update about me section", async()=>{
            let defaultText = await userProfile.getDefaultText();
            await userProfile.changeAboutMeText();
            expect(await userProfile.getEditedAboutMe()).not.toEqual(defaultText);
        })
    })

    
})