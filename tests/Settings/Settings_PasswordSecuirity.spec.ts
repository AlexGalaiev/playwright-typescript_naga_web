import { expect } from "@playwright/test"
import { getLocalization } from "../../pageObjects/localization/getText"
import { MainPage } from "../../pageObjects/MainPage/MainPage"
import { MyAccounts } from "../../pageObjects/MainPage/MyAccounts"
import { SettingsPage } from "../../pageObjects/Settings/SettingsPage"
import { SignUp } from "../../pageObjects/ShortRegistrationPage/SighUpPage"
import {test} from "../../test-options"
import { SignIn } from "../../pageObjects/SignIn/SignInPage"
import { RandomUser } from "../../pageObjects/common/testUserCredentials/randomUser"
import { register } from "module"
import { KYC_General } from "../../pageObjects/FullRegistration/NagaBrands_KycRegistrations"

test.describe("NagaCapital. Settings", async()=>{
    test("@23920 Change password via settings", {tag:['@settings', '@prodSanity']}, async({page, NagaCapital}, testInfo)=>{
        testInfo.setTimeout(testInfo.timeout + 40000);
        let signUp = new SignUp(page)
        let signIn = new SignIn(page)
        let myAccounts = new MyAccounts(page)
        let settings = new SettingsPage(page)
        let localization = new getLocalization("/pageObjects/localization/NagaCapital_Settings.json")
        let email = await signUp.createLeadUserApi("BA")
        await test.step(`Create lead user ${email} with personal information`, async()=>{
            await new KYC_General(page).NagaCapital_UserLead(email, process.env.USER_PASSWORD || '','Bosnia and Herzegovina', NagaCapital)
        })
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
            expect(await new MainPage(page).checkMainPage()).toBe(true);
        })})

    test("@23598 Change password via settings",{tag:['@settings', '@prodSanity']}, 
            async({page, NagaMarkets}, testInfo)=>{
        testInfo.setTimeout(testInfo.timeout + 120000);
        let newLead = new KYC_General(page)
        let localization = new getLocalization("/pageObjects/localization/NagaCapital_Settings.json")
        let email = new RandomUser().getRandomUserEmail()
        let myAccounts = new MyAccounts(page)
        let settings = new SettingsPage(page)
        let signIn = new SignIn(page)
        await test.step(`Create lead user - ${email}`, async()=>{
            await newLead.NagaMarkets_UserLead(email, process.env.USER_PASSWORD || '','France', NagaMarkets)
        })
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
        })
    })
})

