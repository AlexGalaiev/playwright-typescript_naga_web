import { expect } from "@playwright/test";
import { getLocalization } from "../../pageObjects/localization/getText";
import { MainPage } from "../../pageObjects/MainPage/MainPage";
import { SignIn } from "../../pageObjects/SignIn/SignInPage";
import { test } from "../../test-options";
import { startVerification_NagaMarkets } from "../../pageObjects/common/NagaMarkets_startKYC_verification/startVerification";


test.beforeEach(`Login by testLeadUser@gmail.com user to NagaMarkets`, async({page, AppNAGA})=>{
    let testUser = "testLeadUser@gmail.com"
    let signIn = new SignIn(page)
    await test.step(`Login by ${testUser} user`, async()=>{
        await signIn.goto(AppNAGA, "login");
        await signIn.signInUserToPlatform(testUser, process.env.USER_PASSWORD || '')
    })
})
test("@23575 Mobile. Upgrade account banner",{tag:['@KYC_Markets', '@mobile']}, async({page})=>{
    let localization_MainPage = new getLocalization("/pageObjects/localization/NagaMarkets_MainPage.json")
    let localization_KYC_start = new getLocalization("/pageObjects/localization/NagaMarkets_KYC_localization.json")
    let mainPage = new MainPage(page)
    await test.step("Check upgrade account banner", async()=>{
        expect(await mainPage.getMobileStepDescription()).toContain('Provide your financial profile, trading experience, and objectives to open a real-money account.')
        await mainPage.clickOnMobileWidget('Step 1/3: Upgrade to Live')
        expect(await localization_KYC_start.getLocalizationText("KYC_start_introduction")).toContain(await new startVerification_NagaMarkets(page).getKycIntroductionText())
    })
})

test("@23943 Mobile. KYC categorizations", {tag:['@KYC_Markets','@mobile']},async({page})=>{
    let mainPage = new MainPage(page)
    let kycStart = new startVerification_NagaMarkets(page)
    let startVerifaication = new startVerification_NagaMarkets(page)
    let localization_KYC_start = new getLocalization("/pageObjects/localization/NagaMarkets_KYC_localization.json")
    await test.step("Open upgrade account popup", async()=>{
        await mainPage.clickOnMobileWidget('Step 1/3: Upgrade to Live')
    })
    await test.step("Check Start KYC popup content", async()=>{
        expect(await kycStart.getKycContent()).toBe(await localization_KYC_start.getLocalizationText("KYC_start_QUIZDescription"))
    })
    await test.step("Check KYC categorization popup", async()=>{
        await kycStart.openKYCKategorizationBanner();
        expect(await startVerifaication.getKYCCategorizationText()).toEqual(await localization_KYC_start.getLocalizationText("KYC_categorization"))
    })
})