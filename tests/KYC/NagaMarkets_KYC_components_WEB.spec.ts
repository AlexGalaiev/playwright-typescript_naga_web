import { expect } from "@playwright/test"
import { startVerification_NagaMarkets } from "../../pageObjects/common/NagaMarkets_startKYC_verification/startVerification"
import { PersonalInformation } from "../../pageObjects/FullRegistration/NAGACapital-PersonalInformationPage"
import { getLocalization } from "../../pageObjects/localization/getText"
import { MainPage } from "../../pageObjects/MainPage/MainPage"
import { SignIn } from "../../pageObjects/SignIn/SignInPage"
import {test} from "../../test-options"

test.describe('KYC components', async()=>{
    test.beforeEach(`Login by testLeadUser@gmail.com user to NagaMarkets`, async({page, AppNAGA})=>{
        let testUser = "testLeadUser@gmail.com"
        let signIn = new SignIn(page)
        await test.step(`Login by ${testUser} user`, async()=>{
            await signIn.goto(AppNAGA, "login");
            await signIn.signInUserToPlatform(testUser, process.env.USER_PASSWORD || '')
        })
    })
    test("@23575 Upgrade account banner",{tag:['@kyc','@KYC_Markets','@web']}, async({page})=>{
        let localization_MainPage = new getLocalization("/pageObjects/localization/NagaMarkets_MainPage.json")
        let localization_KYC_start = new getLocalization("/pageObjects/localization/NagaMarkets_KYC_localization.json")
        let mainPage = new MainPage(page)
        await test.step("Check upgrade account banner", async()=>{
            expect(await mainPage.getTextOfWidgetStep('Upgrade to Live')).toContain(await localization_MainPage.getLocalizationText('KYC_AdvanceBanner'))
            await mainPage.clickOnWidgepPoint('Upgrade to Live')
            expect(await localization_KYC_start.getLocalizationText("KYC_start_introduction")).toContain(await new startVerification_NagaMarkets(page).getKycIntroductionText())
        })
    })
    
    test("@23943 KYC categorizations", {tag:['@kyc','@KYC_Markets','@web']},async({page})=>{
        let mainPage = new MainPage(page)
        let kycStart = new startVerification_NagaMarkets(page)
        let startVerifaication = new startVerification_NagaMarkets(page)
        let localization_KYC_start = new getLocalization("/pageObjects/localization/NagaMarkets_KYC_localization.json")
        await test.step("Open upgrade account popup", async()=>{
            await mainPage.clickOnWidgepPoint('Upgrade to Live')
        })
        await test.step("Check Start KYC popup content", async()=>{
            expect(await kycStart.getKycContent()).toBe(await localization_KYC_start.getLocalizationText("KYC_start_QUIZDescription"))
        })
        await test.step("Check KYC categorization popup", async()=>{
            await kycStart.openKYCKategorizationBanner();
            expect(await startVerifaication.getKYCCategorizationText()).toEqual(await localization_KYC_start.getLocalizationText("KYC_categorization"))
        })
    })
    
})
