import{test, expect} from "@playwright/test";
import { getLocalization } from "../pageObjects/localization/getText";

test.describe("Naga Capital. Sigh up page", async()=>{
    let SighUpPage_localization = "/pageObjects/localization/SignUpPage.json"
    
    test("Risk disclaimer", async({page})=>{
        let localizationText = new getLocalization(SighUpPage_localization)
        console.log(await localizationText.getLocalizationText("NagaCapital_RiskDisclaimer"))

    })
})