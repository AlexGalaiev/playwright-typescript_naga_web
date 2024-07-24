import { expect } from "@playwright/test";
import { test } from "../../test-options";
import { getLocalization } from "../../pageObjects/localization/getText";
import { ChangeBrandPopup } from "../../pageObjects/ShortRegistrationPage/ChangeBrandPopup";
import { SighUp } from "../../pageObjects/ShortRegistrationPage/SighUpPage";
import { SighIn } from "../../pageObjects/SighIn/SignInPage";

test.describe("Naga Capital. Sigh up page", async()=>{
    let SighUpPage_localization = "/pageObjects/localization/SignUpPage.json"
    
    type testChangeBrandPopup = {
        testRailId: string,
        brandStart: string,
        localization: string,
        brandRedirect: string
    }
    const testParamsChangeBrandPopup: testChangeBrandPopup[] = [
        {testRailId: '@24931', brandStart: '@NS', brandRedirect: '@NM', localization: "/pageObjects/localization/NagaMarkets_SighUp.json"},
        {testRailId: '@25141', brandStart: '@NM', brandRedirect: '@NS', localization: '/pageObjects/localization/SignUpPage.json'}
    ]
    for(const{testRailId, brandStart, localization, brandRedirect} of testParamsChangeBrandPopup){
        test(`${testRailId} Change brand popup ${brandStart} ${localization}`, async({page})=>{
            let localizationText = new getLocalization(localization)
            let sighUp = new SighUp(page);
            let changeBrandPopup = new ChangeBrandPopup(page);
            let sighIn = new SighIn(page)
            await test.step('Open platform and try to create user from not regualted country', async()=>{
                await sighUp.goto(await sighIn.chooseBrand(brandStart), "register")
                await sighUp.createCFDUser(await sighIn.chooseBrandCountry(brandRedirect));
            })
            await test.step('Check change brand popup and check redirect to correct platform', async()=>{
                expect(await changeBrandPopup.getPopupHeaderText()).toEqual(await localizationText.getLocalizationText("SighUp_redirectToOppositeBrand_head"));
                expect(await changeBrandPopup.getPopupText()).toEqual(await localizationText.getLocalizationText("SighUp_redirectToOppositeBrand_text"));
                await changeBrandPopup.proceedRegistration();
                expect(await page.url()).toContain(brandRedirect)
            })
        });
    }
    type testRiskDisclaimer = {
        testRailId: string,
        brand: string,
        localization: string
    }
    const testParamsRiskDisclaimer: testRiskDisclaimer[] = [
        {testRailId: '@24930', brand: '@NS', localization: '/pageObjects/localization/SignUpPage.json'},
        {testRailId: '@25142', brand: '@NM', localization: '/pageObjects/localization/NagaMarkets_SighUp.json'}
    ]
    for(const{testRailId, brand, localization} of testParamsRiskDisclaimer){
        test(`${testRailId} Risk Disclaimer text ${brand} ${localization}`, async({page})=>{
            let localizationText = new getLocalization(SighUpPage_localization)
            let sighUp = new SighUp(page);
            await sighUp.goto(await new SighIn(page).chooseBrand(brand), "register")
            expect(await sighUp.getRiskWarningText()).toEqual(await localizationText.getLocalizationText("SighUp_RiskDisclaimer"))
    })}})