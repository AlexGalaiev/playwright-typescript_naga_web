import { expect } from "@playwright/test";
import { getLocalization } from "../../pageObjects/localization/getText";
import { SignUp } from "../../pageObjects/ShortRegistrationPage/SighUpPage";
import { ForgotPassword } from "../../pageObjects/SighIn/ForgotPassword";
import { SighIn } from "../../pageObjects/SighIn/SignInPage";
import {test} from "..//..//test-options";
import { MainPage } from "../../pageObjects/MainPage/MainPage";
import { MyAccounts } from "../../pageObjects/MainPage/MyAccounts";
import { LogOutPopup } from "../../pageObjects/common/logOutPopup/LogOutPopup";
import { PageAfterLogout } from "../../pageObjects/common/logOutPopup/PageAfterLogout";
import { PersonalInformation } from "../../pageObjects/FullRegistration/NAGAMarkets_PersonalInformation";
import { PhoneVerification } from "../../pageObjects/FullRegistration/NAGACapital-PhoneVerification";
import { YouAreInNagaMarkets } from "../../pageObjects/FullRegistration/components/NAGAMarkets_YouAreInpopup";

test.describe("Naga Markets. SignIn Page", async()=>{
    const localization_SignInPage = "/pageObjects/localization/NagaMarkets_SighInPage.json";
    
    test("@23574 Forgot password", async({page, NagaMarkets})=>{
        let localization = new getLocalization(localization_SignInPage);
        let signInPage = new SighIn(page);
        let forgotPassword = new ForgotPassword(page);
        await new SignUp(page).goto(NagaMarkets,"login")
        await signInPage.forgotPasswordClick()
        await forgotPassword.getForgotPasswordDescription() === await localization.getLocalizationText("ForgotPasswordDescription")
        await forgotPassword.sendForgotPasswordToEmail("forgotPassword@gmail.com");
        await forgotPassword.getForgotPasswordDescription() === await localization.getLocalizationText('ForgotPasswordEmailSendDisclaimerText');
    });
    
    test("@23569 Entity redirection", async({page, NagaMarkets, NagaCapital})=>{
        let localization = new getLocalization(localization_SignInPage);
        let sighInPage = new SighIn(page);
        await test.step("Open login form of NagaMarkets and try to login NagaCapital user", async()=>{
            await new SignUp(page).goto(NagaMarkets,"login");
            await sighInPage.sigInUserToPlatform("NagaCapitalLead@gmail.com", "Test123!");
        });
        await test.step("Check redirection notice of switching between platform", async()=>{
            await localization.getLocalizationText("RedirectionNotice") === await sighInPage.getRedirectionNoticeMsg();
            await sighInPage.redirectAccept();
            expect(await page.url()).toContain(NagaCapital)
        });
    });

    test("@24936 Open platform in Guest mode", async({page, NagaMarkets})=>{
        let localization = new getLocalization(localization_SignInPage);
        let signUp = new SignUp(page);
        let sighIn = new SighIn(page);
        let mainPage = new MainPage(page);
        await test.step("Redirect from platform (in Guest mode) to sigh in page", async()=>{
            await signUp.goto(NagaMarkets,"feed");
            await mainPage.openLoginFromGuestMode();
            expect(await sighIn.getSighInHeaderText()) === await localization.getLocalizationText("SighInHeaderMainText");
        });
        await test.step("Redirect from platform(in Guest mode) to sigh Up page", async()=>{
            await signUp.goto(NagaMarkets,"feed");
            await mainPage.openRegistrationFromGuestMode();
            expect(await signUp.getSighUpTittleText()).toContain("Sign Up, it's free!");
        });
    })

    test("@23915 Account locking", async({page, NagaMarkets})=>{
        let sighUp = new SignUp(page);
        let sighIn = new SighIn(page);
        let localization = new getLocalization(localization_SignInPage);
        let myAccountsMenu = new MyAccounts(page); 
        let personalInfo = new PersonalInformation(page)
        let phoenVerification = new PhoneVerification(page);
        let youAreIn = new YouAreInNagaMarkets(page);
        await test.step("Create lead user and log out", async()=>{
            await sighUp.goto(NagaMarkets, "register");
            let randomUser = await sighUp.create_NM_CFDUser("France");
            await personalInfo.fillPersonalInformation();
            await phoenVerification.MN_insertVerificationCode();
            await youAreIn.clickExplorePlatform();
            await myAccountsMenu.openUserMenu();
            await myAccountsMenu.userLogOut();
            await new LogOutPopup(page).proceedLogOut();
            await new PageAfterLogout(page).pageAfterLogOutSignIn();
            await sighIn.sigInUserToPlatform(randomUser, "111Test123")
        });
        await test.step("Check account msg after incorrect password", async()=>{
            await sighIn.getLoginErrorMsg() === await localization.getLocalizationText("incorrectPassword_1try");
            await sighIn.clickSignInBtn();
            await sighIn.getLoginErrorMsg() === await localization.getLocalizationText("incorrectPassword_2try");
            await sighIn.clickSignInBtn();
            await sighIn.getLoginErrorMsg() === await localization.getLocalizationText("AccountBlockDescription");
            await sighIn.clickSignInBtn();
            await sighIn.getLoginErrorMsg() === await localization.getLocalizationText("AccountBlockDescriptionLastTry");
        })
    })

})