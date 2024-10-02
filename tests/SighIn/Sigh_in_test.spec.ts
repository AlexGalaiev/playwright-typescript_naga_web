import { expect } from "@playwright/test";
import { SighUp } from "../../pageObjects/ShortRegistrationPage/SighUpPage"
import { ForgotPassword } from "../../pageObjects/SighIn/ForgotPassword";
import { SighIn } from "../../pageObjects/SighIn/SignInPage";
import { getLocalization } from "../../pageObjects/localization/getText";
import {test} from "../../test-options"
import { MainPage } from "../../pageObjects/MainPage/MainPage";
import { MyAccounts } from "../../pageObjects/MainPage/MyAccounts";
import { PageAfterLogout } from "../../pageObjects/common/logOutPopup/PageAfterLogout";
import { IncorrectPasswordPopup } from "../../pageObjects/SighIn/IncorrectPassword";


test.describe("Naga Capital. SignIn Page", async()=>{
    let localization = new getLocalization('/pageObjects/localization/SighInPage.json');
    let testUser: string = '';

    test.beforeEach('Create lead user for tests', async({page, NagaCapital})=>{
        let sighUp = new SighUp(page)
        let sighIn = new SighIn(page)
        let mainPage = new MainPage(page);
        let myAccountsMenu = new MyAccounts(page)
        await test.step("Create lead user", async()=>{
            testUser = await sighUp.createLeadUserApiNagaCapital('BA', page)
            await sighIn.goto(NagaCapital, 'login');
            await sighIn.sigInUserToPlatform(testUser, process.env.USER_PASSWORD || "")
            await mainPage.mainPageIsDownLoaded()
            await sighUp.makePhoneVerifed(page)
        })
        await test.step('Log out from platform ', async()=>{
            await myAccountsMenu.openUserMenu();
            await myAccountsMenu.userLogOut()
            await new PageAfterLogout(page).redirectToSighIn();
        })})

    test.skip("@23916 Forgot password link test",{tag:['@smoke', '@signIn']}, async({page})=>{
        let signInPage = new SighIn(page);
        let forgotPassword = new ForgotPassword(page);
        await test.step('Check forgot password messages on UI', async()=>{
            await signInPage.forgotPasswordClick()
            expect(await forgotPassword.getForgotPasswordDescription()).toEqual(await localization.getLocalizationText("ForgotPasswordDescription"))
            await forgotPassword.sendForgotPasswordToEmail(testUser);
            expect(await forgotPassword.getForgotPasswordConfirmation()).toEqual(await localization.getLocalizationText('ForgotPasswordEmailSendDisclaimerText'));
        })});

    test.skip("@23915 Account locking functionality",{tag:'@sighIn'}, async({page})=>{
        let sighIn = new SighIn(page);
        await test.step("Check login to platform with incorrect password", async()=>{
            await sighIn.sigInUserToPlatform(testUser, "111Test123")
            expect(await sighIn.getLoginErrorMsg()).toEqual(await localization.getLocalizationText("incorrectPassword_1try"));
            await sighIn.clickSignInBtn();
            expect(await sighIn.getLoginErrorMsg()).toEqual(await localization.getLocalizationText("incorrectPassword_2try"));
            await sighIn.clickSignInBtn();
            expect(await sighIn.getLoginErrorMsg()).toEqual(await localization.getLocalizationText("AccountBlockDescription"));
            await sighIn.clickSignInBtn();
            expect(await sighIn.getLoginErrorMsg()).toEqual(await localization.getLocalizationText("AccountBlockDescriptionLastTry"));
        })
    })
})
test.describe('Naga Markets. Sigh in', async()=>{
    let testUser;
    let localization = new getLocalization('/pageObjects/localization/NagaMarkets_SighInPage.json');

    test.beforeEach('Create lead user for tests', async({page, NagaMarkets})=>{
        let sighUp = new SighUp(page)
        let myAccountsMenu = new MyAccounts(page)
        let sighIn = new SighIn(page)
        await test.step("Create lead user", async()=>{
            testUser = await sighUp.createLeadUserApi('FR')
            await sighIn.goto(NagaMarkets, 'login');
            await sighIn.sigInUserToPlatform(testUser, process.env.USER_PASSWORD || "")
        })
        await test.step('Log out from platform ', async()=>{
            await myAccountsMenu.openUserMenu();
            await myAccountsMenu.userLogOut()
            await new PageAfterLogout(page).redirectToSighIn();
        })})
    
    test.skip("@23574 Forgot password link test", {tag:['@smoke', '@signIn']}, async({page})=>{
        let signInPage = new SighIn(page);
        let forgotPassword = new ForgotPassword(page);
        await test.step("Check forgot password functionality", async()=>{
            await signInPage.forgotPasswordClick()
            expect(await forgotPassword.getForgotPasswordDescription()).toEqual(await localization.getLocalizationText("ForgotPasswordDescription"))
            await forgotPassword.sendForgotPasswordToEmail(testUser);
            expect(await forgotPassword.getForgotPasswordConfirmation()).toEqual(await localization.getLocalizationText('ForgotPasswordEmailSendDisclaimerText'));
        })});

    test.skip("@23896 Account locking", {tag:'@sighIn'}, async({page})=>{
        let sighIn = new SighIn(page);
        let incorrectPasPopup = new IncorrectPasswordPopup(page);
        let forgotPassword = new ForgotPassword(page);
        await test.step("Check account blocking functionality", async()=>{
            await sighIn.sigInUserToPlatform(testUser, "111Test123")
            expect(await sighIn.getLoginErrorMsg()).toEqual(await localization.getLocalizationText("incorrectPassword_1try"));
            await sighIn.clickSignInBtn();
            expect(await sighIn.getLoginErrorMsg()).toEqual(await localization.getLocalizationText("incorrectPassword_2try"));
            await sighIn.clickSignInBtn();
            expect(await sighIn.getLoginErrorMsg()).toEqual(await localization.getLocalizationText("AccountBlockDescription"));
            await sighIn.clickSignInBtn();
            expect(await incorrectPasPopup.getPopupText()).toEqual(await localization.getLocalizationText("AccountBlockDescriptionLastTry"));
            await incorrectPasPopup.openForgotPasswordForm();
            expect(await forgotPassword.getForgotPasswordHeadText()).toEqual('Forgot your password?')
        })
    })
})

type testTypes = {
    testRailId:string,
    brandStart: string,
    brandRedirect: string,
    localization: string,
    user: string,
}

const testParams: testTypes[] = [
    {testRailId: "@23911", brandStart: '@NS', brandRedirect: '@NM', user: 'NagaMarketsLeadUser@gmail.com', localization: '/pageObjects/localization/SighInPage.json'},
    {testRailId: '@23569', brandStart: '@NM', brandRedirect: '@NS', user: 'NagaCapitalLead@gmail.com', localization: '/pageObjects/localization/NagaMarkets_SighInPage.json'}
]
for(const{testRailId, brandStart, localization, user, brandRedirect} of testParams){
    test(`${testRailId} Entity redirection ${brandStart}`, {tag:['@smoke', '@signIn']}, async({page})=>{
        let localizationPage = new getLocalization(localization);
        let sighInPage = new SighIn(page);
        await test.step('Open login page and input email from different regulation', async()=>{
            await new SighUp(page).goto(await sighInPage.chooseBrand(brandStart), "login");
            await sighInPage.sigInUserToPlatform(user, process.env.USER_PASSWORD || '');
            expect(await localizationPage.getLocalizationText("RedirectionNotice")).toEqual(await sighInPage.getRedirectionNoticeMsg());
            await sighInPage.redirectAccept();
            expect(await page.url()).toContain(await sighInPage.chooseBrand(brandRedirect))
        })}); }    

type testTypesGuestMode = {
    testRailId: string,
    brand: string, 
    localization: string
}

const testParamsGuestMode: testTypesGuestMode[] = [
    {testRailId: '@24929', brand: '@NS', localization: '/pageObjects/localization/SighInPage.json'},
    {testRailId: '@24936', brand: '@NM', localization: '/pageObjects/localization/NagaMarkets_SighInPage.json'}
] 
for(const{testRailId, brand, localization} of testParamsGuestMode){
    test(`${testRailId} Open platform in Guest mode ${brand}`, {tag:['@smoke', '@signIn']}, async({page}, testInfo)=>{
        await testInfo.setTimeout(testInfo.timeout + 50000);
        let localizationPage = new getLocalization(localization);
        let signUp = new SighUp(page);
        let sighIn = new SighIn(page);
        let mainPage = new MainPage(page);
        await test.step("Redirect from platform (in Guest mode) to sigh in page", async()=>{
            await signUp.goto(await sighIn.chooseBrand(brand),"feed");
            await mainPage.openLoginFromGuestMode();
            expect(await sighIn.getSighInHeaderText()).toEqual(await localizationPage.getLocalizationText("SighInHeaderMainText"));
        });
        await test.step("Redirect from platform(in Guest mode) to sigh Up page", async()=>{
            await signUp.goto(await sighIn.chooseBrand(brand),"feed");
            await mainPage.openRegistrationFromGuestMode();
            expect(await signUp.getSighUpTittleText()).toContain("Sign Up, it's free!");
        });
    })
}

    
    

