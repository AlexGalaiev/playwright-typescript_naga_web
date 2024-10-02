import { expect } from "@playwright/test"
import { getLocalization } from "../../pageObjects/localization/getText"
import { MainPage } from "../../pageObjects/MainPage/MainPage"
import { MyAccounts } from "../../pageObjects/MainPage/MyAccounts"
import { SettingsPage } from "../../pageObjects/Settings/SettingsPage"
import { SighUp } from "../../pageObjects/ShortRegistrationPage/SighUpPage"
import {test} from "../../test-options"
import { SighIn } from "../../pageObjects/SighIn/SignInPage"

test.describe("NagaCapital. Settings", async()=>{
    test("@23920 Change password via settings", {tag:['@smoke','@settings', '@prodSanity']}, async({page, NagaCapital}, testInfo)=>{
        await testInfo.setTimeout(testInfo.timeout + 40000);
        let sighUp = new SighUp(page)
        let sighIn = new SighIn(page)
        let mainPage = new MainPage(page)
        let myAccounts = new MyAccounts(page)
        let settings = new SettingsPage(page)
        let localization = new getLocalization("/pageObjects/localization/NagaCapital_Settings.json")
        let email = await sighUp.createLeadUserApiNagaCapital('BA', page)
        await sighIn.goto(NagaCapital, 'login');
        await sighIn.sigInUserToPlatform(email, process.env.USER_PASSWORD || "")
        await test.step("Change password", async()=>{
            await myAccounts.openUserMenu();
            await myAccounts.openMyAccountsMenuItem('Settings')
            await settings.openSettingsMenuItem('Password & Security')
            await settings.changePasswordToNew("Test12345!")
            expect(await settings.getSuccessPopuptext()).toContain(await localization.getLocalizationText("ChangePasswordSuccessPopup"))
            await settings.acceptSuccessPopup()
        })
        await test.step("Login to platform with new password", async()=>{
            await sighIn.sigInUserToPlatform(email, "Test12345!");
            expect(await mainPage.checkMainPage()).toBe(true);
        })})
})

test.describe('Naga Markets. Settings', async()=>{
    test("@23598 Change password via settings",{tag:['@smoke','@settings', '@prodSanity']}, async({page, NagaMarkets}, testInfo)=>{
        await testInfo.setTimeout(testInfo.timeout + 120000);
        let sighUp = new SighUp(page);
        let sighIn = new SighIn(page)
        let myAccounts = new MyAccounts(page)
        let settings = new SettingsPage(page)
        let localization = new getLocalization("/pageObjects/localization/NagaCapital_Settings.json")
        let email = await sighUp.createLeadUserApi('FR')
        await sighIn.goto(NagaMarkets, 'login');
        await sighIn.sigInUserToPlatform(email, process.env.USER_PASSWORD || "")
        await test.step("Change password", async()=>{
            await myAccounts.openUserMenu();
            await myAccounts.openMyAccountsMenuItem('Settings')
            await settings.openSettingsMenuItem('Password & Security')
            await settings.changePasswordToNew("Test12345!")
            expect(await settings.getSuccessPopuptext()).toContain(await localization.getLocalizationText("ChangePasswordSuccessPopup"))
            await settings.acceptSuccessPopup()
        })
        await test.step("Login to platform with new password", async()=>{
            await sighIn.sigInUserToPlatform(email, "Test12345!");
        })})
})

