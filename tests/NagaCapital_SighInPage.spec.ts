import { expect } from "@playwright/test";
import { SignUp } from "../pageObjects/ShortRegistrationPage/SighUpPage"
import { ForgotPassword } from "../pageObjects/SighIn/ForgotPassword";
import { SighIn } from "../pageObjects/SighIn/SignInPage";
import { getLocalization } from "../pageObjects/localization/getText";
import {test} from "../test-options"


test.describe("Naga Capital. SignIn Page", async()=>{
    let localization_SignInPage = "/pageObjects/localization/SighInPage.json"

    test("Forgot password", async({page, NagaCapital})=>{
        let signInPage = new SighIn(page);
        let localization = new getLocalization(localization_SignInPage);
        await new SignUp(page).goto(NagaCapital,"login")
        await signInPage.forgotPasswordClick()
        let forgotPassword = new ForgotPassword(page);
        await forgotPassword.getForgotPasswordDescription() === await localization.getLocalizationText("ForgotPasswordDescription")
        await forgotPassword.sendForgotPasswordToEmail("forgotPassword@gmail.com");
        await forgotPassword.getForgotPasswordDescription() === await localization.getLocalizationText('ForgotPasswordEmailSendDisclaimerText');
    });

    test("Redirection notice between platforms", async({page, NagaMarkets, NagaCapital})=>{
        let sighInPage = new SighIn(page);
        let localization = new getLocalization(localization_SignInPage);
        await new SignUp(page).goto(NagaMarkets,"login");
        await sighInPage.sigInUserToPlatform("NagaCapitalLead@gmail.com", "Test123!");
        await localization.getLocalizationText("RedirectionNotice") === await sighInPage.getRedirectionNoticeMsg();
        await sighInPage.redirectAccept();
        expect(await page.url()).toContain(NagaCapital)
    }); 

    test("Open platform wit not an authorized user", async({page, NagaCapital})=>{

    })

})
