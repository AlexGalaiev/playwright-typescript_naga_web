import { expect } from "@playwright/test";
import { SignUp } from "../../pageObjects/ShortRegistrationPage/SighUpPage"
import { ForgotPassword } from "../../pageObjects/SignIn/ForgotPassword";
import { SignIn } from "../../pageObjects/SignIn/SignInPage";
import { getLocalization } from "../../pageObjects/localization/getText";
import {test} from "../../test-options"
import { MainPage } from "../../pageObjects/MainPage/MainPage";
import { MyAccounts } from "../../pageObjects/MainPage/MyAccounts";
import { PageAfterLogout } from "../../pageObjects/common/logOutPopup/PageAfterLogout";
import { IncorrectPasswordPopup } from "../../pageObjects/SignIn/IncorrectPassword";
import { RandomUser } from "../../pageObjects/common/testUserCredentials/randomUser";
import { PersonalInformation } from "../../pageObjects/FullRegistration/NAGACapital-PersonalInformationPage";
import { YouAreInNagaMarkets } from "../../pageObjects/FullRegistration/components/NAGAMarkets_YouAreInpopup";
import { Captcha } from "../../pageObjects/captcha";


test.describe("Naga Capital. SignIn Page", async()=>{
    let localization = new getLocalization('/pageObjects/localization/SighInPage.json');
    let testUser: string = '';

    test.skip("@23916 Forgot password link test",
            {tag:['@forgotPassword'], annotation:{'description':'https://keywaygroup.atlassian.net/browse/RG-1275','type':'ticket'}}, 
        async({page, AppNAGA, NSCountry})=>{
        let signInPage = new SignIn(page);
        let forgotPassword = new ForgotPassword(page);
        let signUp = new SignUp(page)
        let myAccountsMenu = new MyAccounts(page)
        testUser = new RandomUser().getRandomUserEmail()
        await test.step(`Create lead user ${testUser}`, async()=>{
            await signUp.goto(AppNAGA, 'register');
            await new Captcha(page).removeCaptcha()
            await signUp.createCFDUser(testUser, process.env.USER_PASSWORD || "", NSCountry,'+387', '603039647')
            await new YouAreInNagaMarkets(page).clickExplorePlatform()
            await myAccountsMenu.openUserMenu();
            await myAccountsMenu.userLogOut()
            await new PageAfterLogout(page).redirectToSighIn()
        })
        await test.step('Check forgot password messages on UI', async()=>{
            await signInPage.forgotPasswordClick()
            expect(await forgotPassword.getForgotPasswordDescription()).toEqual(await localization.getLocalizationText("ForgotPasswordDescription"))
            await forgotPassword.sendForgotPasswordToEmail(testUser);
            expect(await forgotPassword.getForgotPasswordConfirmation()).toEqual(await localization.getLocalizationText('ForgotPasswordEmailSendDisclaimerText'));
        })
    });

    test.skip("@23915 Account locking functionality",{tag:'@UI'}, async({page})=>{
        let signIn = new SignIn(page);
        await test.step("Check login to platform with incorrect password", async()=>{
            await signIn.signInUserToPlatform(testUser, "111Test123")
            expect(await signIn.getLoginErrorMsg()).toEqual(await localization.getLocalizationText("incorrectPassword_1try"));
            await signIn.clickSignInBtn();
            expect(await signIn.getLoginErrorMsg()).toEqual(await localization.getLocalizationText("incorrectPassword_2try"));
            await signIn.clickSignInBtn();
            expect(await signIn.getLoginErrorMsg()).toEqual(await localization.getLocalizationText("AccountBlockDescription"));
            await signIn.clickSignInBtn();
            expect(await signIn.getLoginErrorMsg()).toEqual(await localization.getLocalizationText("AccountBlockDescriptionLastTry"));
        })
    })
})
test.describe('Naga Markets. Sigh in', async()=>{
    let testUser;
    let localization = new getLocalization('/pageObjects/localization/NagaMarkets_SighInPage.json');

    test.beforeEach('Create lead user for tests', async({page, AppNAGA, NMCountry})=>{
        let signUp = new SignUp(page)
        let myAccountsMenu = new MyAccounts(page)
        testUser = new RandomUser().getRandomUserEmail()
        await test.step(`Create lead user ${testUser}`, async()=>{
            await signUp.goto(AppNAGA, 'register');
            await signUp.createCfdUser_All(testUser, process.env.USER_PASSWORD || "", NMCountry,'+387', '603039647')
            await new PersonalInformation(page).clickLogOut()
            await new PageAfterLogout(page).redirectToSighIn()
        })
    })
    
    test.skip("@23574 Forgot password link test", 
        {tag:'@forgotPassword', annotation:{'description':'https://keywaygroup.atlassian.net/browse/RG-1275','type':'ticket'}}, async({page})=>{
        let signInPage = new SignIn(page);
        let forgotPassword = new ForgotPassword(page);
        await test.step("Check forgot password functionality", async()=>{
            await signInPage.forgotPasswordClick()
            expect(await forgotPassword.getForgotPasswordDescription()).toEqual(await localization.getLocalizationText("ForgotPasswordDescription"))
            await forgotPassword.sendForgotPasswordToEmail(testUser);
            expect(await forgotPassword.getForgotPasswordConfirmation()).toEqual(await localization.getLocalizationText('ForgotPasswordEmailSendDisclaimerText'));
        })});

    test.skip("@23896 Account locking", {tag:'@UI'}, async({page})=>{
        let signIn = new SignIn(page);
        let incorrectPasPopup = new IncorrectPasswordPopup(page);
        let forgotPassword = new ForgotPassword(page);
        await test.step("Check account blocking functionality", async()=>{
            await signIn.signInUserToPlatform(testUser, "111Test123")
            expect(await signIn.getLoginErrorMsg()).toEqual(await localization.getLocalizationText("incorrectPassword_1try"));
            await signIn.clickSignInBtn();
            expect(await signIn.getLoginErrorMsg()).toEqual(await localization.getLocalizationText("incorrectPassword_2try"));
            await signIn.clickSignInBtn();
            expect(await signIn.getLoginErrorMsg()).toEqual(await localization.getLocalizationText("AccountBlockDescription"));
            await signIn.clickSignInBtn();
            expect(await incorrectPasPopup.getPopupText()).toEqual(await localization.getLocalizationText("AccountBlockDescriptionLastTry"));
            await incorrectPasPopup.openForgotPasswordForm();
            expect(await forgotPassword.getForgotPasswordHeadText()).toEqual('Forgot your password?')
        })
    })
})              
    
test.describe('Guest mode', async()=>{

    type testTypesGuestMode = {
        testRailId: string,
        brand: string, 
        localization: string
    }
    
    const testParamsGuestMode: testTypesGuestMode[] = [
        {testRailId: '@24929', brand: '@Capital', localization: '/pageObjects/localization/SighInPage.json'},
        {testRailId: '@24936', brand: '@Markets', localization: '/pageObjects/localization/NagaMarkets_SighInPage.json'},
        {testRailId: '@25434', brand: '@Mena', localization: '/pageObjects/localization/NagaMarkets_SighInPage.json'},
        {testRailId: '@25435', brand: '@Africa', localization: '/pageObjects/localization/NagaMarkets_SighInPage.json'},
    ] 
    for(const{testRailId, brand, localization} of testParamsGuestMode){
        test(`${testRailId} Open ${brand} platform in Guest mode`, {tag:['@UI','@mobile','@web']}, async({page,AppNAGA}, testInfo)=>{
            testInfo.setTimeout(testInfo.timeout + 50000);
            let localizationPage = new getLocalization(localization);
            let signUp = new SignUp(page);
            let signIn = new SignIn(page);
            let mainPage = new MainPage(page);
            await test.step("Redirect from platform (in Guest mode) to sigh in page", async()=>{
                await signUp.goto(AppNAGA,"feed");
                await mainPage.openLoginFromGuestMode();
                expect(await signIn.getSignInHeaderText()).toEqual(await localizationPage.getLocalizationText("SighInHeaderMainText"));
            });
            await test.step("Redirect from platform(in Guest mode) to sigh Up page", async()=>{
                await signUp.goto(AppNAGA, "feed");
                await mainPage.openRegistrationFromGuestMode();
                expect(await signUp.getSighUpTittleText()).toContain("Sign up");
            })})}
})


test.describe('Login/LogOut',async()=>{
    type testTypes = {
        testrailId: string;
        brand: string;
        email: string;
    }
    const testParams: testTypes[] = [
        { testrailId: "@23568", brand: '@Markets', email: "testLeadUser@i.ua"},
        { testrailId: "@23914", brand: '@Capital', email: "testLeadUser"},
        { testrailId: "@25359", brand: '@Mena', email: "testLeadUserMena"},
        { testrailId: "@25360", brand: '@Africa', email: "testLeadAfrica"}
    ]
    for(const {testrailId, brand, email} of testParams){
        test(`${testrailId} Login/logout to platform ${brand} by ${email}`, 
            {tag:['@login', '@prodSanity','@smoke','@web']}, async({page,AppNAGA})=>{
            let signIn = new SignIn(page);
            let pageAfterLogOut = new PageAfterLogout(page)
            let myAccountsMenu = new MyAccounts(page)
            await test.step(`Login to ${brand} plarform by ${email} user`, async()=>{
                await signIn.goto(AppNAGA, 'login')
                await signIn.signInUserToPlatform(email, process.env.USER_PASSWORD || '')
            })
            await test.step('Log out from platform', async()=>{
                await myAccountsMenu.openUserMenu();
                await myAccountsMenu.userLogOut()
                expect(await pageAfterLogOut.getLogOutPageTittle()).toEqual('Trade with NAGA on the go!')
            })})
    }

    for(const {testrailId, brand, email} of testParams){
        test(`${testrailId} Mobile view. Login/logout to platform ${brand} by ${email}`, 
            {tag:['@login', '@mobile']}, async({page, AppNAGA})=>{
            let signIn = new SignIn(page);
            let myAccountsMenu = new MyAccounts(page)
            await test.step(`Login to ${brand} plarform by ${email} user`, async()=>{
                await signIn.goto(AppNAGA, 'login')
                await signIn.signInUserToPlatform(email, process.env.USER_PASSWORD || '')
            })
            await test.step('Log out from platform', async()=>{
                await myAccountsMenu.openUserMenu();
                await myAccountsMenu.userLogOut()
                expect(await signIn.getLoginMainPageText()).toEqual("Sign In to your account")
            })})
    }
})