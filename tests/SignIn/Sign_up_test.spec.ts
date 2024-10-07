import { expect } from "@playwright/test";
import { test } from "../../test-options";
import { getLocalization } from "../../pageObjects/localization/getText";
import { ChangeBrandPopup } from "../../pageObjects/ShortRegistrationPage/ChangeBrandPopup";
import { SignUp } from "../../pageObjects/ShortRegistrationPage/SighUpPage";
import { SignIn } from "../../pageObjects/SignIn/SignInPage";

test.describe("Naga Capital. Sign up page", async()=>{
    let SighUpPage_localization = "/pageObjects/localization/SignUpPage.json"

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
        test(`${testRailId} Risk Disclaimer text ${brand}`, {tag:['@smoke', '@signIn']}, async({page})=>{
            let localizationText = new getLocalization(localization)
            let signUp = new SignUp(page);
            await signUp.goto(await new SignIn(page).chooseBrand(brand), "register")
            expect(await signUp.getRiskWarningText()).toEqual(await localizationText.getLocalizationText("SighUp_RiskDisclaimer"))
    })}})