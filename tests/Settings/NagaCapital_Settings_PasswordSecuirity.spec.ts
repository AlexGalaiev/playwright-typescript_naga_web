import { expect } from "@playwright/test"
import { getLocalization } from "../../pageObjects/localization/getText"
import { MainPage } from "../../pageObjects/MainPage/MainPage"
import { MyAccounts } from "../../pageObjects/MainPage/MyAccounts"
import { SettingsPage } from "../../pageObjects/Settings/SettingsPage"
import { SighUp } from "../../pageObjects/ShortRegistrationPage/SighUpPage"
import {test} from "..//..//test-options"
import { SighIn } from "../../pageObjects/SighIn/SignInPage"

test.describe("NagaCapital. Settings", async()=>{
    test("@23920 Change password via settings", async({page, NagaCapital})=>{
        let sighUp = new SighUp(page);
        let sighIn = new SighIn(page)
        let mainPage = new MainPage(page);
        let myAccounts = new MyAccounts(page)
        let settings = new SettingsPage(page)
        let localization = new getLocalization("/pageObjects/localization/NagaCapital_Settings.json")
        await sighUp.goto(NagaCapital, 'register');
        let userEmail = await sighUp.createCFDUser("Ukraine");
        await test.step("Change password", async()=>{
            await myAccounts.openUserMenu();
            await myAccounts.openMyAccountsMenuItem('settings')
            await settings.openSettingsMenuItem('Password & Security')
            await settings.changePasswordToNew("Test12345!")
            expect(await settings.getSuccessPopuptext()).toContain(await localization.getLocalizationText("ChangePasswordSuccessPopup"))
            await settings.acceptSuccessPopup()
        })
        await test.step("Login to platform with new password", async()=>{
            await sighIn.sigInUserToPlatform(userEmail, "Test12345!");
            expect(await mainPage.checkMainPage()).toBe(true);
        })
    })
})