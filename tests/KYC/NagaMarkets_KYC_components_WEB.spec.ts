import { expect } from "@playwright/test"
import { startVerification_NagaMarkets } from "../../pageObjects/common/NagaMarkets_startKYC_verification/startVerification"
import { getLocalization } from "../../pageObjects/localization/getText"
import {test} from "../../test-options"

test.describe('KYC components', async()=>{
    test.beforeEach(`Login by testLeadUser@gmail.com user to NagaMarkets`, async({app, AppNAGA})=>{
        let testUser = "testLeadUser@gmail.com"
        await test.step(`Login by ${testUser} user`, async()=>{
            await app.signIn.goto(AppNAGA, "login");
            await app.signIn.signInUserToPlatform(testUser, process.env.USER_PASSWORD || '')
        })
    })
    test("Upgrade account banner",{tag:['@kyc','@KYC_Markets','@web']}, async({app})=>{
        let localization_MainPage = new getLocalization("/pageObjects/localization/NagaMarkets_MainPage.json")
        let localization_KYC_start = new getLocalization("/pageObjects/localization/NagaMarkets_KYC_localization.json")
        await test.step("Check upgrade account banner", async()=>{
            expect(await app.mainPage.getTextOfWidgetStep('Upgrade to Live')).toContain(await localization_MainPage.getLocalizationText('KYC_AdvanceBanner'))
            await app.mainPage.clickOnWidgepPoint('Upgrade to Live')
            expect(await app.multiLicense.checkKYCTitle("Expected country of origin and destination of your funds? ")).toBeTruthy()
        })
    })
    
    test.skip("KYC categorizations", {tag:['@kyc','@KYC_Markets','@web']},async({app})=>{
        let localization_KYC_start = new getLocalization("/pageObjects/localization/NagaMarkets_KYC_localization.json")
        await test.step("Open upgrade account popup", async()=>{
            await app.mainPage.clickOnWidgepPoint('Upgrade to Live')
        })
        await test.step("Check Start KYC popup content", async()=>{
            expect(await app.startVerifyMarkets.getKycContent()).toBe(await localization_KYC_start.getLocalizationText("KYC_start_QUIZDescription"))
        })
        await test.step("Check KYC categorization popup", async()=>{
            await app.startVerifyMarkets.openKYCKategorizationBanner();
            expect(await app.startVerifyMarkets.getKYCCategorizationText()).toEqual(await localization_KYC_start.getLocalizationText("KYC_categorization"))
        })
    })
    
})
