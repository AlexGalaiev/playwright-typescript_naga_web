import { expect } from "@playwright/test"
import { startVerification_NagaMarkets } from "../../pageObjects/common/NagaMarkets_startKYC_verification/startVerification"
import { PersonalInformation } from "../../pageObjects/FullRegistration/NAGACapital-PersonalInformationPage"
import { getLocalization } from "../../pageObjects/localization/getText"
import { MainPage } from "../../pageObjects/MainPage/MainPage"
import { SighIn } from "../../pageObjects/SighIn/SignInPage"
import {test} from "..//..//test-options"

test.beforeEach("login by lead user", async({page, NagaMarkets})=>{
    let testUser = "testLeadUser@gmail.com"
    let signIn = new SighIn(page)
    await test.step("Login by lead user", async()=>{
        await signIn.goto(NagaMarkets, "login");
        await signIn.sigInUserToPlatform(testUser, process.env.USER_PASSWORD || '')
//        await new PersonalInformation(page).waitPersonalInfoBlock();
    })
})
test("@23575 Upgrade account banner",{tag:'@smoke'}, async({page})=>{
    let localization_MainPage = new getLocalization("/pageObjects/localization/NagaMarkets_MainPage.json")
    let localization_KYC_start = new getLocalization("/pageObjects/localization/NagaMarkets_KYC_localization.json")
    let mainPage = new MainPage(page)
    await test.step("Check upgrade banner", async()=>{
        expect(await mainPage.getVerifyBannerContent()).toContain(await localization_MainPage.getLocalizationText("UpgradeAccountBannerContent"))
        await mainPage.clickUpgradeBtn()
        expect(await localization_KYC_start.getLocalizationText("KYC_start_introduction")).toContain(await new startVerification_NagaMarkets(page).getKycIntroductionText())
    })
})
test("@23943 KYC categorizations", {tag:'@smoke'},async({page})=>{
    let mainPage = new MainPage(page)
    let kycStart = new startVerification_NagaMarkets(page)
    let localization_KYC_start = new getLocalization("/pageObjects/localization/NagaMarkets_KYC_localization.json")
    await test.step("Check upgrade banner", async()=>{
        await mainPage.clickUpgradeBtn()})
    await test.step("Check Kyc start information", async()=>{
        expect(await kycStart.getKycContent()).toBe(await localization_KYC_start.getLocalizationText("KYC_start_QUIZDescription"))
        expect(await kycStart.getKycWarning()).toBe(await localization_KYC_start.getLocalizationText("KYC_start_Warning"))
    })
    await test.step("Check KYC categorization", async()=>{
        await kycStart.openKYCKategorizationBanner();
        expect(await page).toHaveScreenshot()
    })
})