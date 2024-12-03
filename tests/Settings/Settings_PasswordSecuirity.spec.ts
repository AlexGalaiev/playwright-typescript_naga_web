import { expect } from "@playwright/test"
import { getLocalization } from "../../pageObjects/localization/getText"
import { MainPage } from "../../pageObjects/MainPage/MainPage"
import { MyAccounts } from "../../pageObjects/MainPage/MyAccounts"
import { SettingsPage } from "../../pageObjects/Settings/SettingsPage"
import { SignUp } from "../../pageObjects/ShortRegistrationPage/SighUpPage"
import {test} from "../../test-options"
import { SignIn } from "../../pageObjects/SignIn/SignInPage"

test.describe("NagaCapital. Settings", async()=>{
    test("@23920 Change password via settings", {tag:['@settings', '@prodSanity']}, async({page, NagaCapital}, testInfo)=>{
        await testInfo.setTimeout(testInfo.timeout + 40000);
        let signUp = new SignUp(page)
        let signIn = new SignIn(page)
        let mainPage = new MainPage(page)
        let myAccounts = new MyAccounts(page)
        let settings = new SettingsPage(page)
        let localization = new getLocalization("/pageObjects/localization/NagaCapital_Settings.json")
        let email = await signUp.createLeadUserApi("BA")
        await signIn.goto(NagaCapital, 'login');
        await signIn.signInUserToPlatform(email, process.env.USER_PASSWORD || "")
        await test.step("Change password", async()=>{
            await myAccounts.openUserMenu();
            await myAccounts.openMyAccountsMenuItem('Settings')
            await settings.openSettingsMenuItem('Password & Security')
            await settings.changePasswordToNew("Test12345!")
            expect(await settings.getSuccessPopuptext()).toContain(await localization.getLocalizationText("ChangePasswordSuccessPopup"))
            await settings.acceptSuccessPopup()
        })
        await test.step("Login to platform with new password", async()=>{
            await signIn.signInUserToPlatform(email, "Test12345!");
            expect(await mainPage.checkMainPage()).toBe(true);
        })})
})

test.describe('Naga Markets. Settings', async()=>{
    test("@23598 Change password via settings",{tag:['@settings', '@prodSanity']}, async({page, NagaMarkets}, testInfo)=>{
        await testInfo.setTimeout(testInfo.timeout + 120000);
        let signUp = new SignUp(page);
        let signIn = new SignIn(page)
        let myAccounts = new MyAccounts(page)
        let settings = new SettingsPage(page)
        let localization = new getLocalization("/pageObjects/localization/NagaCapital_Settings.json")
        let email = await signUp.createLeadUserApi('FR')
        await signIn.goto(NagaMarkets, 'login');
        await signIn.signInUserToPlatform(email, process.env.USER_PASSWORD || "")
        await test.step("Change password", async()=>{
            await myAccounts.openUserMenu();
            await myAccounts.openMyAccountsMenuItem('Settings')
            await settings.openSettingsMenuItem('Password & Security')
            await settings.changePasswordToNew("Test12345!")
            expect(await settings.getSuccessPopuptext()).toContain(await localization.getLocalizationText("ChangePasswordSuccessPopup"))
            await settings.acceptSuccessPopup()
        })
        await test.step("Login to platform with new password", async()=>{
            await signIn.signInUserToPlatform(email, "Test12345!");
        })})
})

