import { expect } from "@playwright/test";
import { test } from "../../test-options";
import { getLocalization } from "../../pageObjects/localization/getText";
import { ChangeBrandPopup } from "../../pageObjects/ShortRegistrationPage/ChangeBrandPopup";
import { SignUp } from "../../pageObjects/ShortRegistrationPage/SighUpPage";

test.describe("Naga Capital. Sigh up page", async()=>{
    let SighUpPage_localization = "/pageObjects/localization/SignUpPage.json"
    
    test("@C24931 Change brand popup", async({page, NagaCapital, NagaMarkets})=>{
        let localizationText = new getLocalization(SighUpPage_localization)
        let sighUp = new SignUp(page);
        await sighUp.goto(NagaCapital, "register")
        await sighUp.createCFDUser("France");
        let changeBrandPopup = new ChangeBrandPopup(page);
        expect(await changeBrandPopup.getPopupHeaderText()).toEqual(await localizationText.getLocalizationText("NagaCapital_redirectToNagaMarkets_head"));
        expect(await changeBrandPopup.getPopupText()).toEqual(await localizationText.getLocalizationText("NagaCapital_redirectToNagaMarkets_text"));
        await changeBrandPopup.proceedRegistration();
        expect(await page.url()).toContain(NagaMarkets)
    });

    test("@24930 Risk Disclaimer text", async({page, NagaCapital})=>{
        let localizationText = new getLocalization(SighUpPage_localization)
        let sighUp = new SignUp(page);
        await sighUp.goto(NagaCapital, "register")
        expect(await sighUp.getRiskWarningText()).toEqual(await localizationText.getLocalizationText("NagaCapital_RiskDisclaimer"))
    })
})