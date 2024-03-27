import { expect } from "@playwright/test";
import { test } from "..//test-options";
import { getLocalization } from "../pageObjects/localization/getText";
import { ChangeBrandPopup } from "../pageObjects/ShortRegistrationPage/ChangeBrandPopup";
import { SignUp } from "../pageObjects/ShortRegistrationPage/SighUpPage";

test.describe("Naga Capital. Sigh up page", async()=>{
    let SighUpPage_localization = "/pageObjects/localization/SignUpPage.json"
    
    test("Change brand popup", async({page, NagaCapital, NagaMarkets})=>{
        let localizationText = new getLocalization(SighUpPage_localization)
        let sighUp = new SignUp(page);
        await sighUp.goto(NagaCapital, "register")
        await sighUp.createCFDUser("France");
        let changeBrandPopup = new ChangeBrandPopup(page);
        await changeBrandPopup.getPopupHeaderText() === await localizationText.getLocalizationText("NagaCapital_redirectToNagaMarkets_head");
        await changeBrandPopup.getPopupText() === await localizationText.getLocalizationText("NagaCapital_redirectToNagaMarkets_text");
        await changeBrandPopup.proceedRegistration();
        expect(await page.url()).toContain(NagaMarkets)
    });

    test("Risk Disclaimer text", async({page, NagaCapital})=>{
        let localizationText = new getLocalization(SighUpPage_localization)
        let sighUp = new SignUp(page);
        await sighUp.goto(NagaCapital, "register")
        await sighUp.getRiskWarningText() === await localizationText.getLocalizationText("NagaCapital_RiskDisclaimer")
    })
})