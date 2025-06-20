import { expect } from "@playwright/test"
import { getLocalization } from "../../pageObjects/localization/getText"
import {test} from "../../test-options"
import { RandomUser } from "../../pageObjects/common/testUserCredentials/randomUser"


test("Mobile. NagaCapital. Change password via settings", {tag:['@UI', '@mobile', '@settings']}, 
    async({app, AppNAGA}, testInfo)=>{
    testInfo.setTimeout(testInfo.timeout + 40000)
    let localization = new getLocalization("/pageObjects/localization/NagaCapital_Settings.json")
    let email = await new RandomUser().getRandomUserEmail()
    await test.step(`Create lead user ${email} with personal information`, async()=>{
        await app.KYC_Registration.NagaCapital_UserLead(
            email, process.env.USER_PASSWORD || '','Bosnia and Herzegovina','+387','603039647', AppNAGA)
        await app.youAreIn.clickExplorePlatform()
    })
    await test.step(`Change password. User opens header menu  and change to Test2345!`, async()=>{
        await app.mainPage.openMobileBackMenuPoint('Settings')
        await app.settings.changePasswordToNew("Test12345!")
        expect(await app.settings.getSuccessPopuptext()).toContain(await localization.getLocalizationText("ChangePasswordSuccessPopup"))
        await app.settings.acceptSuccessPopup()
    })
    await test.step(`Check possibility of Login to platform with new password`, async()=>{
        await app.signIn.signInUserToPlatform(email, "Test12345!")
        expect(await app.mainPage.checkMobileWidgetIsVisisble('Step 1/4: NAGA Start')).toBe(true)
    })})

test("Mobile NagaMarkets. Change password via settings",{tag:['@UI', '@mobile', '@settings']}, 
        async({app, AppNAGA}, testInfo)=>{
    testInfo.setTimeout(testInfo.timeout + 120000)
    let localization = new getLocalization("/pageObjects/localization/NagaCapital_Settings.json")
    let email = new RandomUser().getRandomUserEmail()
    await test.step(`Create lead user - ${email}, fill personal information, verify phone number`, async()=>{
        await app.KYC_Registration.NagaMarkets_UserLead(email, process.env.USER_PASSWORD || '','France', '+387', '603039647', AppNAGA)
    })
    await test.step(`Change password. Open header menu, change password  to new -Test12345!`, async()=>{
        await app.mainPage.openMobileBackMenuPoint('Settings')
        await app.settings.changePasswordToNew("Test12345!")
        expect(await app.settings.getSuccessPopuptext()).toContain(await localization.getLocalizationText("ChangePasswordSuccessPopup"))
        await app.settings.acceptSuccessPopup()
    })
    await test.step('Login to platform with new password', async()=>{
        await app.signIn.signInUserToPlatform(email, "Test12345!")
        expect(await app.mainPage.checkMobileWidgetIsVisisble('Step 1/3: Upgrade to Live')).toBe(true)
    })
})

test("Mobile. NagaMena, Change password via settings",{tag:['@UI', '@mobile', '@settings']}, 
    async({app, AppNAGA}, testInfo)=>{
    testInfo.setTimeout(testInfo.timeout + 120000)
    let localization = new getLocalization("/pageObjects/localization/NagaCapital_Settings.json")
    let email = new RandomUser().getRandomUserEmail()
    await test.step(`Create lead user with ${email}`, async()=>{
        await app.KYC_Registration.NagaMena_UserLead(email, AppNAGA)
    })
    await test.step(`Change password. Open header menu, change password  to new -Test12345!`, async()=>{
        await app.mainPage.openMobileBackMenuPoint('Settings')
        await app.settings.changePasswordToNew("Test12345!")
        expect(await app.settings.getSuccessPopuptext()).toContain(await localization.getLocalizationText("ChangePasswordSuccessPopup"))
        await app.settings.acceptSuccessPopup()
    })
    await test.step('Login to platform with new password', async()=>{
        await app.signIn.signInUserToPlatform(email, "Test12345!")
        expect(await app.mainPage.checkMobileWidgetIsVisisble('Step 1/3: Upgrade to Live')).toBe(true)
    })
})

test("Mobile. NagaAfrica, Change password via settings",{tag:['@UI', '@mobile', '@settings']}, 
    async({app, AppNAGA}, testInfo)=>{
    testInfo.setTimeout(testInfo.timeout + 120000)
    let localization = new getLocalization("/pageObjects/localization/NagaCapital_Settings.json")
    let email = new RandomUser().getRandomUserEmail()
    await test.step(`Create lead user with ${email}`, async()=>{
        await app.KYC_Registration.NagaAfrica_UserLead(email, AppNAGA)
    })
    await test.step(`Change password. Open header menu, change password  to new -Test12345!`, async()=>{
        await app.mainPage.openMobileBackMenuPoint('Settings')
        await app.settings.changePasswordToNew("Test12345!")
        expect(await app.settings.getSuccessPopuptext()).toContain(await localization.getLocalizationText("ChangePasswordSuccessPopup"))
        await app.settings.acceptSuccessPopup()
    })
    await test.step('Login to platform with new password', async()=>{
        await app.signIn.signInUserToPlatform(email, "Test12345!")
        expect(await app.mainPage.checkMobileWidgetIsVisisble('Step 1/4: NAGA Start')).toBe(true)
    })
})

test.describe('Mobile', async()=>{

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
        {tag:['@UI', '@mobile', '@settings']},async({AppNAGA, app}, testInfo)=>{
        testInfo.setTimeout(testInfo.timeout + 40000)
        await test.step(`Login by ${user} to platform`, async()=>{
            await app.signIn.goto(AppNAGA, 'login')
            await app.signIn.signInUserToPlatform(user, process.env.USER_PASSWORD || '')
        })
        await test.step('Check settings of user profile. Check phone verification via settings', async()=>{
            await app.mainPage.openMobileBackMenuPoint('Settings')
            expect(await app.settings.getPhoneValidationStatus()).toEqual('Not Verified ')
            await app.settings.openPhoneVerification()
            expect(await app.settings.checkPhoneVerificationPopupIsVisible()).toBeTruthy()
            await app.settings.goBack()
        })
        await test.step('Check email verification popup', async()=>{
            await app.settings.openEmailVerificationPopup()
            expect(await app.settings.checkEmailVerifiedPopupIsDisplayed()).toBeTruthy()
        })})
    }

    const otherBrands: settings[] = [
        {brand:'@Markets', user:'leadMarkets@naga.com'},
        {brand:'@Mena', user:'leadMena@naga.com'},
    ]
    for(const{brand, user} of otherBrands){
    test(`${brand} Settings -> Profile. Check profile credentials`,
        {tag:['@UI', '@mobile', '@settings']},async({AppNAGA, app}, testInfo)=>{
    testInfo.setTimeout(testInfo.timeout + 40000)
    await test.step(`Login to platform by ${user}`, async()=>{
        await app.signIn.goto(AppNAGA, 'login')
        await app.signIn.signInUserToPlatform(user, process.env.USER_PASSWORD || '')
    })
    await test.step('Check settings of user profile. Check phone verification via settings', async()=>{
        await app.mainPage.openMobileBackMenuPoint('Settings')

    })
    await test.step('Check email verification popup', async()=>{
        await app.settings.openEmailVerificationPopup()
        expect(await app.settings.checkEmailVerifiedPopupIsDisplayed()).toBeTruthy()
    })
})} 

})
