import { expect } from "@playwright/test";
import { test } from "../../test-options";
import { getLocalization } from "../../pageObjects/localization/getText";
import { ChangeBrandPopup } from "../../pageObjects/ShortRegistrationPage/ChangeBrandPopup";
import { SighUp } from "../../pageObjects/ShortRegistrationPage/SighUpPage";
import { SighIn } from "../../pageObjects/SighIn/SignInPage";

test.describe("Naga Capital. Sigh up page", async()=>{
    let SighUpPage_localization = "/pageObjects/localization/SignUpPage.json"


    //need to check for dublication for entity redirection
    test.skip(`@24931 Change brand popup from NS to NM`, async({page,NagaCapital, NagaMarkets, NMCountry})=>{
        let localizationText = new getLocalization('/pageObjects/localization/SignUpPage.json')
        let sighUp = new SighUp(page);
        let changeBrandPopup = new ChangeBrandPopup(page);
        await test.step('Open platform and try to create user from not regualted country', async()=>{
            await sighUp.goto(NagaCapital, "register")
            await sighUp.createCFDUser(NMCountry);
        })
        await test.step('Check change brand popup and check redirect to correct platform', async()=>{
            expect(await changeBrandPopup.getPopupHeaderText()).toEqual(await localizationText.getLocalizationText("SighUp_redirectToOppositeBrand_head"));
            expect(await changeBrandPopup.getPopupText()).toEqual(await localizationText.getLocalizationText("SighUp_redirectToOppositeBrand_text"));
            await changeBrandPopup.proceedRegistration();
            expect(await page.url()).toContain(NagaMarkets)
        })
    });

    test.skip(`@25141 Change brand popup from NM to NS`, async({page, NagaCapital, NagaMarkets, NSCountry})=>{
        let localizationText = new getLocalization('/pageObjects/localization/NagaMarkets_SighUp.json')
        let sighUp = new SighUp(page);
        let changeBrandPopup = new ChangeBrandPopup(page);
        await test.step('Open platform and try to create user from not regualted country', async()=>{
            await sighUp.goto(NagaMarkets, "register")
            await sighUp.create_NM_CFDUser(NSCountry);
        })
        await test.step('Check change brand popup and check redirect to correct platform', async()=>{
            expect(await changeBrandPopup.getPopupHeaderText()).toEqual(await localizationText.getLocalizationText("SighUp_redirectToOppositeBrand_head"));
            expect(await changeBrandPopup.getPopupText()).toEqual(await localizationText.getLocalizationText("SighUp_redirectToOppositeBrand_text"));
            await changeBrandPopup.proceedRegistration();
            expect(await page.url()).toContain(NagaCapital)
        })
    });

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
        test(`${testRailId} Risk Disclaimer text ${brand}`, {tag:'@smoke'}, async({page})=>{
            let localizationText = new getLocalization(localization)
            let sighUp = new SighUp(page);
            await sighUp.goto(await new SighIn(page).chooseBrand(brand), "register")
            expect(await sighUp.getRiskWarningText()).toEqual(await localizationText.getLocalizationText("SighUp_RiskDisclaimer"))
    })}})