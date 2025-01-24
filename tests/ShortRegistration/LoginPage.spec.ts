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
import { NagaCom } from "../../pageObjects/Website/NagaCom";
import { Captcha } from "../../pageObjects/captcha";


test.describe("Naga Capital. SignIn Page", async()=>{
    let localization = new getLocalization('/pageObjects/localization/SighInPage.json');
    let testUser: string = '';

    test.skip("@23916 Forgot password link test",
            {tag:['@forgotPassword','@debug'], annotation:{'description':'https://keywaygroup.atlassian.net/browse/RG-1275','type':'ticket'}}, 
        async({page, NagaCapital, NSCountry})=>{
        let signInPage = new SignIn(page);
        let forgotPassword = new ForgotPassword(page);
        let signUp = new SignUp(page)
        let myAccountsMenu = new MyAccounts(page)
        testUser = new RandomUser().getRandomUserEmail()
        await test.step(`Create lead user ${testUser}`, async()=>{
            await signUp.goto(NagaCapital, 'register');
            await new Captcha(page).removeCaptcha()
            await signUp.createCFDUser(testUser, process.env.USER_PASSWORD || "", NSCountry)
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

    test.beforeEach('Create lead user for tests', async({page, NagaMarkets, NMCountry})=>{
        let signUp = new SignUp(page)
        let myAccountsMenu = new MyAccounts(page)
        testUser = new RandomUser().getRandomUserEmail()
        await test.step(`Create lead user ${testUser}`, async()=>{
            await signUp.goto(NagaMarkets, 'register');
            await signUp.createCfdUser_All(testUser, process.env.USER_PASSWORD || "", NMCountry)
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
    test(`${testRailId} Switch brands popup ${brandStart}`, {tag:'@UI'}, async({page})=>{
        let localizationPage = new getLocalization(localization);
        let sighInPage = new SignIn(page);
        await test.step('Open login page and input email from different regulation', async()=>{
            await new SignUp(page).goto(await sighInPage.chooseBrand(brandStart), "login");
            await sighInPage.signInUserToPlatform(user, process.env.USER_PASSWORD || '');
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
    test(`${testRailId} Open platform in Guest mode ${brand}`, {tag:'@UI'}, async({page}, testInfo)=>{
        await testInfo.setTimeout(testInfo.timeout + 50000);
        let localizationPage = new getLocalization(localization);
        let signUp = new SignUp(page);
        let signIn = new SignIn(page);
        let mainPage = new MainPage(page);
        await test.step("Redirect from platform (in Guest mode) to sigh in page", async()=>{
            await signUp.goto(await signIn.chooseBrand(brand),"feed");
            await mainPage.openLoginFromGuestMode();
            expect(await signIn.getSignInHeaderText()).toEqual(await localizationPage.getLocalizationText("SighInHeaderMainText"));
        });
        await test.step("Redirect from platform(in Guest mode) to sigh Up page", async()=>{
            await signUp.goto(await signIn.chooseBrand(brand),"feed");
            await mainPage.openRegistrationFromGuestMode();
            expect(await signUp.getSighUpTittleText()).toContain("Sign up, it's free!");
        });
    })
}
    test.describe('Login/Logout functionality',async()=>{
        type testTypes = {
            testrailId: string;
            brand: string;
            email: string;
        }
        const testParams: testTypes[] = [
           { testrailId: "@23568", brand: '@NM', email: "testLeadUser@i.ua"},
           { testrailId: "@23914", brand: '@NS', email: "testLeadUser"},
           { testrailId: "@25359", brand: '@NMena', email: "testLeadUserMena"},
           { testrailId: "@25360", brand: '@NAfrica', email: "testLeadAfrica"}
        ]
        for(const {testrailId, brand, email} of testParams){
            test(`${testrailId} Login/logout to platform ${brand} by ${email}`, 
                {tag:['@login', '@prodSanity','@smoke']}, async({page})=>{
                let signIn = new SignIn(page);
                let pageAfterLogOut = new PageAfterLogout(page)
                let myAccountsMenu = new MyAccounts(page)
                await test.step(`Login to platform by ${email}`, async()=>{
                    await signIn.goto(await signIn.chooseBrand(brand), 'login')
                    await signIn.signInUserToPlatform(email, process.env.USER_PASSWORD || '')
                })
                await test.step('Log out from platform', async()=>{
                    await myAccountsMenu.openUserMenu();
                    await myAccountsMenu.userLogOut()
                    expect(await pageAfterLogOut.getLogOutPageTittle()).toEqual('Trade with NAGA on the go!')
                })})
        }
    })

    type logoTests = {
        testRailId:string;
        brand: string;
    }
    const logoTestParams: logoTests[] = [
        {testRailId: '@25388', brand: '@NM'},
        {testRailId: '@25389', brand: '@NS'},
        {testRailId: '@25390', brand: '@NMena'},
        {testRailId: '@25390', brand: '@NAfrica'}
    ]

    for(const{testRailId, brand}of logoTestParams){
        test(`${testRailId} Redirect from ${brand} logo to website`,{tag:'@UI'}, async({page})=>{
            let signIn = new SignIn(page)
            let website = new NagaCom(page)
            await signIn.goto(await signIn.chooseBrand(brand), 'login')
            await signIn.clickLogo()
            expect(await website.checkInstrumentBar()).toBeVisible()
        })
    }



    
    

