import { expect } from "@playwright/test"
import { getLocalization } from "../../pageObjects/localization/getText"
import { MainPage } from "../../pageObjects/MainPage/MainPage"
import { MyAccounts } from "../../pageObjects/MainPage/MyAccounts"
import { SettingsPage } from "../../pageObjects/Settings/SettingsPage"
import {test} from "../../test-options"
import { SignIn } from "../../pageObjects/SignIn/SignInPage"
import { RandomUser } from "../../pageObjects/common/testUserCredentials/randomUser"
import { KYC_General } from "../../pageObjects/FullRegistration/NagaBrands_KycRegistrations"
import { YouAreInNagaMarkets } from "../../pageObjects/FullRegistration/components/NAGAMarkets_YouAreInpopup"


test("@23920 NagaCapital. Change password via settings", {tag:['@UI', '@mobile', '@settings']}, 
    async({page, AppNAGA}, testInfo)=>{
    testInfo.setTimeout(testInfo.timeout + 40000)
    let signIn = new SignIn(page)
    let mainPage = new MainPage(page)
    let settings = new SettingsPage(page)
    let localization = new getLocalization("/pageObjects/localization/NagaCapital_Settings.json")
    let email = await new RandomUser().getRandomUserEmail()
    await test.step(`Create lead user ${email} with personal information`, async()=>{
        await new KYC_General(page).NagaCapital_UserLead(
            email, process.env.USER_PASSWORD || '','Bosnia and Herzegovina','+387','603039647', AppNAGA)
        await new YouAreInNagaMarkets(page).clickExplorePlatform()
    })
    await test.step(`Change password. User opens header menu  and change to Test2345!`, async()=>{
        await mainPage.openMobileBackMenuPoint('Settings')
        await settings.changePasswordToNew("Test12345!")
        expect(await settings.getSuccessPopuptext()).toContain(await localization.getLocalizationText("ChangePasswordSuccessPopup"))
        await settings.acceptSuccessPopup()
    })
    await test.step(`Check possibility of Login to platform with new password`, async()=>{
        await signIn.signInUserToPlatform(email, "Test12345!")
        expect(await mainPage.checkMobileWidgetIsVisisble('Step 1/4: NAGA Start')).toBe(true)
    })})

test("@23598 NagaMarkets. Change password via settings",{tag:['@UI', '@mobile', '@settings']}, 
        async({page, AppNAGA}, testInfo)=>{
    testInfo.setTimeout(testInfo.timeout + 120000);
    let newLead = new KYC_General(page)
    let localization = new getLocalization("/pageObjects/localization/NagaCapital_Settings.json")
    let email = new RandomUser().getRandomUserEmail()
    let mainPage = new MainPage(page)
    let settings = new SettingsPage(page)
    let signIn = new SignIn(page)
    await test.step(`Create lead user - ${email}, fill personal information, verify phone number`, async()=>{
        await newLead.NagaMarkets_UserLead(email, process.env.USER_PASSWORD || '','France', '+387', '603039647', AppNAGA)
    })
    await test.step(`Change password. Open header menu, change password  to new -Test12345!`, async()=>{
        await mainPage.openMobileBackMenuPoint('Settings')
        await settings.changePasswordToNew("Test12345!")
        expect(await settings.getSuccessPopuptext()).toContain(await localization.getLocalizationText("ChangePasswordSuccessPopup"))
        await settings.acceptSuccessPopup()
    })
    await test.step('Login to platform with new password', async()=>{
        await signIn.signInUserToPlatform(email, "Test12345!")
        expect(await mainPage.checkMobileWidgetIsVisisble('Step 1/3: Upgrade to Live')).toBe(true)
    })
})

test("@25428 NagaMena, Change password via settings",{tag:['@UI', '@mobile', '@settings']}, 
    async({page, AppNAGA}, testInfo)=>{
    testInfo.setTimeout(testInfo.timeout + 120000);
    let newLead = new KYC_General(page)
    let localization = new getLocalization("/pageObjects/localization/NagaCapital_Settings.json")
    let email = new RandomUser().getRandomUserEmail()
    let mainPage = new MainPage(page)
    let settings = new SettingsPage(page)
    let signIn = new SignIn(page)
    await test.step(`Create lead user with ${email}`, async()=>{
        await newLead.NagaMena_UserLead(email, AppNAGA)
    })
    await test.step(`Change password. Open header menu, change password  to new -Test12345!`, async()=>{
        await mainPage.openMobileBackMenuPoint('Settings')
        await settings.changePasswordToNew("Test12345!")
        expect(await settings.getSuccessPopuptext()).toContain(await localization.getLocalizationText("ChangePasswordSuccessPopup"))
        await settings.acceptSuccessPopup()
    })
    await test.step('Login to platform with new password', async()=>{
        await signIn.signInUserToPlatform(email, "Test12345!");
        expect(await mainPage.checkMobileWidgetIsVisisble('Step 1/3: Upgrade to Live')).toBe(true)
    })
})

test("@25429 NagaAfrica, Change password via settings",{tag:['@UI', '@mobile', '@settings']}, 
    async({page, AppNAGA}, testInfo)=>{
    testInfo.setTimeout(testInfo.timeout + 120000);
    let newLead = new KYC_General(page)
    let localization = new getLocalization("/pageObjects/localization/NagaCapital_Settings.json")
    let email = new RandomUser().getRandomUserEmail()
    let mainPage = new MainPage(page)
    let settings = new SettingsPage(page)
    let signIn = new SignIn(page)
    await test.step(`Create lead user with ${email}`, async()=>{
        await newLead.NagaAfrica_UserLead(email, AppNAGA)
    })
    await test.step(`Change password. Open header menu, change password  to new -Test12345!`, async()=>{
        await mainPage.openMobileBackMenuPoint('Settings')
        await settings.changePasswordToNew("Test12345!")
        expect(await settings.getSuccessPopuptext()).toContain(await localization.getLocalizationText("ChangePasswordSuccessPopup"))
        await settings.acceptSuccessPopup()
    })
    await test.step('Login to platform with new password', async()=>{
        await signIn.signInUserToPlatform(email, "Test12345!")
        expect(await mainPage.checkMobileWidgetIsVisisble('Step 1/4: NAGA Start')).toBe(true)
    })
})


