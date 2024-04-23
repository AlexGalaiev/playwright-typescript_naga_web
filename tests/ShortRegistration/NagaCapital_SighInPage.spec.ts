import { expect } from "@playwright/test";
import { SignUp } from "../../pageObjects/ShortRegistrationPage/SighUpPage"
import { ForgotPassword } from "../../pageObjects/SighIn/ForgotPassword";
import { SighIn } from "../../pageObjects/SighIn/SignInPage";
import { getLocalization } from "../../pageObjects/localization/getText";
import {test} from "../../test-options"
import { MainPage } from "../../pageObjects/MainPage/MainPage";
import { RandomUser } from "../../pageObjects/common/testUserCredentials/randomUser";
import { MyAccounts } from "../../pageObjects/MainPage/MyAccounts";
import { LogOutPopup } from "../../pageObjects/common/logOutPopup/LogOutPopup";
import { PageAfterLogout } from "../../pageObjects/common/logOutPopup/PageAfterLogout";


test.describe("Naga Capital. SignIn Page", async()=>{
    const localization_SignInPage = "/pageObjects/localization/SighInPage.json";
    
    test("@23916 Forgot password", async({page, NagaCapital})=>{
        let localization = new getLocalization(localization_SignInPage);
        let signInPage = new SighIn(page);
        let forgotPassword = new ForgotPassword(page);
        await new SignUp(page).goto(NagaCapital,"login")
        await signInPage.forgotPasswordClick()
        await forgotPassword.getForgotPasswordDescription() === await localization.getLocalizationText("ForgotPasswordDescription")
        await forgotPassword.sendForgotPasswordToEmail("forgotPassword@gmail.com");
        await forgotPassword.getForgotPasswordDescription() === await localization.getLocalizationText('ForgotPasswordEmailSendDisclaimerText');
    });

    test("@23911 Entity redirection", async({page, NagaMarkets, NagaCapital}, testInfo)=>{
        let localization = new getLocalization(localization_SignInPage);
        console.log(await testInfo.title)
        let sighInPage = new SighIn(page);
        await new SignUp(page).goto(NagaMarkets,"login");
        await sighInPage.sigInUserToPlatform("NagaCapitalLead@gmail.com", "Test123!");
        await localization.getLocalizationText("RedirectionNotice") === await sighInPage.getRedirectionNoticeMsg();
        await sighInPage.redirectAccept();
        expect(await page.url()).toContain(NagaCapital)
    }); 

    test("@24929 Open platform in Guest mode", async({page, NagaCapital})=>{
        let localization = new getLocalization(localization_SignInPage);
        let signUp = new SignUp(page);
        let sighIn = new SighIn(page);
        let mainPage = new MainPage(page);
        await test.step("Redirect from platform (in Guest mode) to sigh in page", async()=>{
            await signUp.goto(NagaCapital,"feed");
            await mainPage.openLoginFromGuestMode();
            expect(await sighIn.getSighInHeaderText()) === await localization.getLocalizationText("SighInHeaderMainText");
        });
        await test.step("Redirect from platform(in Guest mode) to sigh Up page", async()=>{
            await signUp.goto(NagaCapital,"feed");
            await mainPage.openRegistrationFromGuestMode();
            expect(await signUp.getSighUpTittleText()).toContain("Sign Up, it's free!");
        });
    })
    test("@23915 Account locking", async({page, NagaCapital})=>{
        let sighUp = new SignUp(page);
        let sighIn = new SighIn(page);
        let localization = new getLocalization(localization_SignInPage);
        let myAccountsMenu = new MyAccounts(page); 
        await sighUp.goto(NagaCapital, "register");
        let randomUser = await sighUp.createCFDUser("Ukraine");
        await myAccountsMenu.openUserMenu();
        await myAccountsMenu.userLogOut();
        await new LogOutPopup(page).proceedLogOut();
        await new PageAfterLogout(page).pageAfterLogOutSignIn();
        await sighIn.sigInUserToPlatform(randomUser, "111Test123")
        await sighIn.getLoginErrorMsg() === await localization.getLocalizationText("incorrectPassword_1try");
        await sighIn.clickSignInBtn();
        await sighIn.getLoginErrorMsg() === await localization.getLocalizationText("incorrectPassword_2try");
        await sighIn.clickSignInBtn();
        await sighIn.getLoginErrorMsg() === await localization.getLocalizationText("AccountBlockDescription");
        await sighIn.clickSignInBtn();
        await sighIn.getLoginErrorMsg() === await localization.getLocalizationText("AccountBlockDescriptionLastTry");
    })
})
