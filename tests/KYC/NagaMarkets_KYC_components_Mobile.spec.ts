import { expect } from "@playwright/test";
import { getLocalization } from "../../pageObjects/localization/getText";
import { test } from "../../test-options";
import { startVerification_NagaMarkets } from "../../pageObjects/common/NagaMarkets_startKYC_verification/startVerification";


test.beforeEach(`Login by testLeadUser@gmail.com user to NagaMarkets`, async({app, AppNAGA})=>{
    let testUser = "testLeadUser@gmail.com"
    await test.step(`Login by ${testUser} user`, async()=>{
        await app.signIn.goto(AppNAGA, "login");
        await app.signIn.signInUserToPlatform(testUser, process.env.USER_PASSWORD || '')
    })
})
test("Mobile. Upgrade account banner",{tag:['@KYC_Markets', '@mobile']}, async({app})=>{
    let localization_KYC_start = new getLocalization("/pageObjects/localization/NagaMarkets_KYC_localization.json")
    await test.step("Check upgrade account banner", async()=>{
        expect(await app.mainPage.getMobileStepDescription()).toContain('Provide your financial profile, trading experience, and objectives to open a real-money account.')
        await app.mainPage.clickOnMobileWidget('Step 1/3: Upgrade to Live')
        expect(await localization_KYC_start.getLocalizationText("KYC_start_introduction")).toContain(await new startVerification_NagaMarkets(page).getKycIntroductionText())
    })
})

test("Mobile. KYC categorizations", {tag:['@KYC_Markets','@mobile']},async({app})=>{
    let localization_KYC_start = new getLocalization("/pageObjects/localization/NagaMarkets_KYC_localization.json")
    await test.step("Open upgrade account popup", async()=>{
        await app.mainPage.clickOnMobileWidget('Step 1/3: Upgrade to Live')
    })
    await test.step("Check Start KYC popup content", async()=>{
        expect(await app.startVerifyMarkets.getKycContent()).toBe(await localization_KYC_start.getLocalizationText("KYC_start_QUIZDescription"))
    })
    await test.step("Check KYC categorization popup", async()=>{
        await app.startVerifyMarkets.openKYCKategorizationBanner();
        expect(await app.startVerifyMarkets.getKYCCategorizationText()).toEqual(await localization_KYC_start.getLocalizationText("KYC_categorization"))
    })
})