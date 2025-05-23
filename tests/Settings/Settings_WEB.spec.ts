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

test.describe('WEB', async()=>{

    test("@23920 NagaCapital. Change password via settings", {tag:['@UI', '@web', '@settings']}, 
    async({page, AppNAGA}, testInfo)=>{
    testInfo.setTimeout(testInfo.timeout + 40000);
    let signIn = new SignIn(page)
    let myAccounts = new MyAccounts(page)
    let settings = new SettingsPage(page)
    let localization = new getLocalization("/pageObjects/localization/NagaCapital_Settings.json")
    let email = await new RandomUser().getRandomUserEmail()
    await test.step(`Create lead user ${email} with personal information`, async()=>{
        await new KYC_General(page).NagaCapital_UserLead(
            email, process.env.USER_PASSWORD || '','Bosnia and Herzegovina','+387','603039647', AppNAGA)
        await new YouAreInNagaMarkets(page).clickExplorePlatform()
    })
    await test.step(`Change password. User opens header menu  and change to Test2345!`, async()=>{
        await myAccounts.openUserMenu();
        await myAccounts.openMyAccountMenuItem('Settings')
        await settings.openSettingsMenuItem('Password & Security')
        await settings.changePasswordToNew("Test12345!")
        expect(await settings.getSuccessPopuptext()).toContain(await localization.getLocalizationText("ChangePasswordSuccessPopup"))
        await settings.acceptSuccessPopup()
    })
    await test.step(`Check possibility of Login to platform with new password`, async()=>{
        await signIn.signInUserToPlatform(email, "Test12345!");
        expect(await new MainPage(page).checkWidgetStepNotFinishedVisibility('NAGA Start', 'active')).toBe(true);
    })})

test("@23598 NagaMarkets. Change password via settings",{tag:['@UI', '@web', '@settings']}, 
        async({page, AppNAGA}, testInfo)=>{
    testInfo.setTimeout(testInfo.timeout + 120000);
    let newLead = new KYC_General(page)
    let localization = new getLocalization("/pageObjects/localization/NagaCapital_Settings.json")
    let email = new RandomUser().getRandomUserEmail()
    let myAccounts = new MyAccounts(page)
    let settings = new SettingsPage(page)
    let signIn = new SignIn(page)
    await test.step(`Create lead user - ${email}, fill personal information, verify phone number`, async()=>{
        await newLead.NagaMarkets_UserLead(email, process.env.USER_PASSWORD || '','France', '+387', '603039647', AppNAGA)
    })
    await test.step(`Change password. Open header menu, change password  to new -Test12345!`, async()=>{
        await myAccounts.openUserMenu();
        await myAccounts.openMyAccountMenuItem('Settings')
        await settings.openSettingsMenuItem('Password & Security')
        await settings.changePasswordToNew("Test12345!")
        expect(await settings.getSuccessPopuptext()).toContain(await localization.getLocalizationText("ChangePasswordSuccessPopup"))
        await settings.acceptSuccessPopup()
    })
    await test.step('Login to platform with new password', async()=>{
        await signIn.signInUserToPlatform(email, "Test12345!");
        expect(await new MainPage(page).checkWidgetStepNotFinishedVisibility('Upgrade to Live', 'active')).toBe(true);
    })
})

test("@25428 NagaMena, Change password via settings",{tag:['@UI', '@web', '@settings']}, 
    async({page, AppNAGA}, testInfo)=>{
    testInfo.setTimeout(testInfo.timeout + 120000);
    let newLead = new KYC_General(page)
    let localization = new getLocalization("/pageObjects/localization/NagaCapital_Settings.json")
    let email = new RandomUser().getRandomUserEmail()
    let myAccounts = new MyAccounts(page)
    let settings = new SettingsPage(page)
    let signIn = new SignIn(page)
    await test.step(`Create lead user with ${email}`, async()=>{
        await newLead.NagaMena_UserLead(email, AppNAGA)
    })
    await test.step(`Change password. Open header menu, change password  to new -Test12345!`, async()=>{
        await myAccounts.openUserMenu();
        await myAccounts.openMyAccountMenuItem('Settings')
        await settings.openSettingsMenuItem('Password & Security')
        await settings.changePasswordToNew("Test12345!")
        expect(await settings.getSuccessPopuptext()).toContain(await localization.getLocalizationText("ChangePasswordSuccessPopup"))
        await settings.acceptSuccessPopup()
    })
    await test.step('Login to platform with new password', async()=>{
        await signIn.signInUserToPlatform(email, "Test12345!");
        expect(await new MainPage(page).checkWidgetStepNotFinishedVisibility('Upgrade to Live', 'active')).toBe(true);
    })
})

test("@25429 NagaAfrica, Change password via settings",{tag:['@UI', '@web', '@settings']}, 
    async({page, AppNAGA}, testInfo)=>{
    testInfo.setTimeout(testInfo.timeout + 120000);
    let newLead = new KYC_General(page)
    let localization = new getLocalization("/pageObjects/localization/NagaCapital_Settings.json")
    let email = new RandomUser().getRandomUserEmail()
    let myAccounts = new MyAccounts(page)
    let settings = new SettingsPage(page)
    let signIn = new SignIn(page)
    await test.step(`Create lead user with ${email}`, async()=>{
        await newLead.NagaAfrica_UserLead(email, AppNAGA)
    })
    await test.step(`Change password. Open header menu, change password  to new -Test12345!`, async()=>{
        await myAccounts.openUserMenu();
        await myAccounts.openMyAccountMenuItem('Settings')
        await settings.openSettingsMenuItem('Password & Security')
        await settings.changePasswordToNew("Test12345!")
        expect(await settings.getSuccessPopuptext()).toContain(await localization.getLocalizationText("ChangePasswordSuccessPopup"))
        await settings.acceptSuccessPopup()
    })
    await test.step('Login to platform with new password', async()=>{
        await signIn.signInUserToPlatform(email, "Test12345!");
        expect(await new MainPage(page).checkVisisbilityOfBalanceBar()).toBe(true);
    })})
})

test.describe('WEB', async()=>{

    type settings = {
        brand: string,
        user: string
    }
    const capitalSettings: settings[] = [
        {brand:'@Capital', user:'leadCapital2@naga.com'},
        {brand:'@Africa', user: 'leadAfrica2@naga.com'}
    ]
    for(const{brand, user} of capitalSettings){
        test(`${brand} Settings -> Profile. Check profile credentials`,
        {tag:['@UI', '@web', '@settings']},async({AppNAGA, page}, testInfo)=>{
        testInfo.setTimeout(testInfo.timeout + 40000);
        let signIn = new SignIn(page)
        let myAccounts = new MyAccounts(page)
        let settings = new SettingsPage(page)
        await test.step(`Login by ${user} to platform`, async()=>{
            await signIn.goto(AppNAGA, 'login')
            await signIn.signInUserToPlatform(user, process.env.USER_PASSWORD || '')
        })
        await test.step('Check settings of user profile. Check phone verification via settings', async()=>{
            await myAccounts.openUserMenu()
            await myAccounts.openMyAccountMenuItem('Settings')
            expect(await settings.getPhoneValidationStatus()).toEqual('Not Verified ')
            await settings.openPhoneVerification()
            expect(await settings.checkPhoneVerificationPopupIsVisible()).toBeTruthy()
            await settings.goBack()
        })
        await test.step('Check email verification popup', async()=>{
            await settings.openEmailVerificationPopup()
            expect(await settings.checkEmailVerifiedPopupIsDisplayed()).toBeTruthy()
        })})
    }

    const otherBrands: settings[] = [
        {brand:'@Markets', user:'leadMarkets@naga.com'},
        {brand:'@Mena', user:'leadMena@naga.com'},
    ]
    for(const{brand, user} of otherBrands){
    test(`${brand} Settings -> Profile. Check profile credentials`,
        {tag:['@UI', '@web', '@settings']},async({AppNAGA, page}, testInfo)=>{
    testInfo.setTimeout(testInfo.timeout + 40000);
        let signIn = new SignIn(page)
        let myAccounts = new MyAccounts(page)
        let settings = new SettingsPage(page)
    await test.step(`Login to platform by ${user}`, async()=>{
        await signIn.goto(AppNAGA, 'login')
        await signIn.signInUserToPlatform(user, process.env.USER_PASSWORD || '')
    })
    await test.step('Check settings of user profile. Check phone verification via settings', async()=>{
        await myAccounts.openUserMenu()
        await myAccounts.openMyAccountMenuItem('Settings')
    })
    await test.step('Check email verification popup', async()=>{
        await settings.openEmailVerificationPopup()
        expect(await settings.checkEmailVerifiedPopupIsDisplayed()).toBeTruthy()
    })
})} 

})






