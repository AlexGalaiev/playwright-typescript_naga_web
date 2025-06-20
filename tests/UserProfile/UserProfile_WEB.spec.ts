import { expect } from "@playwright/test";
import { RandomUser } from "../../pageObjects/common/testUserCredentials/randomUser";
import {test} from "../../test-options";
import { Captcha } from "../../pageObjects/captcha";

test.describe("WEB", async()=>{
    test("NagaCapital. User profile. General", {tag:'@settings'}, async({app, AppNAGA, NSCountry}, testInfo)=>{
        testInfo.setTimeout(testInfo.timeout + 30000);
        let randomUser = new RandomUser()
        let email = randomUser.getRandomUserEmail()
        await test.step(`Create lead user ${email}`, async ()=>{
            await app.signUp.goto(AppNAGA, 'register')
            await new Captcha(app.page).removeCaptcha()
            await app.signUp.createCFDUser(email, process.env.USER_PASSWORD || "", NSCountry,'+387', '603039647')
            await app.personalInformation.clickExploreNaga()
        })
        await test.step('Edit username information', async()=>{
            await app.myAccounts.openUserMenu()
            await app.myAccounts.openMyAccountMenuItem('My Social Profile')
            let nameBeforeChanging = await app.userProfile.getUserNameText();
            await app.userProfile.changeName(await randomUser.randomUserName())
            expect(await app.userProfile.getUserNameText()).not.toEqual(nameBeforeChanging);
        })
        await test.step("Update about me section", async()=>{
            let defaultText = await app.userProfile.getDefaultText();
            await app.userProfile.changeAboutMeText();
            expect(await app.userProfile.getEditedAboutMe()).not.toEqual(defaultText);
        })})
})