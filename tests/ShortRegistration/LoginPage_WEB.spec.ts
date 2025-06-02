import { expect } from "@playwright/test";
import { SignUp } from "../../pageObjects/ShortRegistrationPage/SighUpPage"
import { ForgotPassword } from "../../pageObjects/SignIn/ForgotPassword";
import { SignIn } from "../../pageObjects/SignIn/SignInPage";
import { getLocalization } from "../../pageObjects/localization/getText";
import {test} from "../../test-options"
import { MainPage } from "../../pageObjects/MainPage/MainPage";
import { MyAccounts } from "../../pageObjects/MainPage/MyAccounts";
import { PageAfterLogout } from "../../pageObjects/common/logOutPopup/PageAfterLogout";
import { RandomUser } from "../../pageObjects/common/testUserCredentials/randomUser";
import { PersonalInformation } from "../../pageObjects/FullRegistration/NAGACapital-PersonalInformationPage";
import { YouAreInNagaMarkets } from "../../pageObjects/FullRegistration/components/NAGAMarkets_YouAreInpopup";
import { Captcha } from "../../pageObjects/captcha";


test.describe("WEB", async()=>{

    test("@Capital Forgot password link test",
            {tag:['@forgotPassword', '@web', '@prodSanity', '@UI']}, async({proxyPageUA, AppNAGA, NSCountry}, testInfo)=>{
        testInfo.setTimeout(testInfo.timeout + 40000)
        let signUp = new SignUp(proxyPageUA)
        let signIn = new SignIn(proxyPageUA)
        let myAccount = new MyAccounts(proxyPageUA)
        let forgotPassword = new ForgotPassword(proxyPageUA)
        let testUser = new RandomUser().getRandomUserEmail()
        await test.step(`Create lead user ${testUser}`, async()=>{
            await signUp.goto(AppNAGA, 'register')
            await new Captcha(proxyPageUA).removeCaptcha()
            await signUp.createCFDUser(testUser, process.env.USER_PASSWORD || "", NSCountry,'+387', '603039647')
            await new YouAreInNagaMarkets(proxyPageUA).clickExplorePlatform()
        })
        test.step('Log out from paltform and open forgot password link', async()=>{
            await myAccount.openUserMenu()
            await myAccount.userLogOut()
            await new PageAfterLogout(proxyPageUA).redirectToSighIn()
        })
        await test.step('Check forgot password messages on UI', async()=>{
            await signIn.forgotPasswordClick()
            let response = await forgotPassword.sendEmailToAddress(testUser)
            expect(await forgotPassword.getRequestMethod(response)).toBe('POST')
            // expect(await forgotPassword.getForgotPasswordHeadText()).toEqual('Check yourInbox')
            // expect(await forgotPassword.getForgotPasswordDescription()).toEqual('We’ve sent your password reset instructions to:')
        })
    })
    test("@Markets Forgot password link test",
            {tag:['@forgotPassword', '@web', '@prodSanity', '@UI']}, async({proxyPage, AppNAGA, NMCountry}, testInfo)=>{
        testInfo.setTimeout(testInfo.timeout + 40000)
        let signUp = new SignUp(proxyPage)
        let signIn = new SignIn(proxyPage)
        let forgotPassword = new ForgotPassword(proxyPage)
        let testUser = new RandomUser().getRandomUserEmail()
        await test.step(`Create lead user ${testUser}`, async()=>{
            await signUp.goto(AppNAGA, 'register')
            await new Captcha(proxyPage).removeCaptcha()
            await signUp.createCfdUser_All(testUser, process.env.USER_PASSWORD || '', NMCountry, "+387", "603039647")
        })
        test.step('Log out from paltform and open forgot password link', async()=>{
            await new PersonalInformation(proxyPage).clickLogOut()
            await new PageAfterLogout(proxyPage).redirectToSighIn()
        })
        await test.step('Check forgot password messages on UI', async()=>{
            await signIn.forgotPasswordClick()
            let response = await forgotPassword.sendEmailToAddress(testUser)
            expect(await forgotPassword.getRequestMethod(response)).toBe('POST')
            // expect(await forgotPassword.getForgotPasswordHeadText()).toEqual('Check yourInbox')
            // expect(await forgotPassword.getForgotPasswordDescription()).toEqual('We’ve sent your password reset instructions to:')
        })
    })
    test("@Mena Forgot password link test",
            {tag:['@forgotPassword', '@web', '@prodSanity', '@UI'], annotation:{description:'https://keywaygroup.atlassian.net/browse/RG-9272', type:'issue'}}, 
            async({proxyPageUAE, AppNAGA, NagaMenaCountry}, testInfo)=>{
        testInfo.setTimeout(testInfo.timeout + 40000)
        let signUp = new SignUp(proxyPageUAE)
        let signIn = new SignIn(proxyPageUAE)
        let forgotPassword = new ForgotPassword(proxyPageUAE)
        let testUser = new RandomUser().getRandomUserEmail()
        await test.step(`Create lead user ${testUser}`, async()=>{
            await signUp.goto(AppNAGA, 'register')
            await new Captcha(proxyPageUAE).removeCaptcha()
            await signUp.createCfdUser_All(testUser, process.env.USER_PASSWORD || '', NagaMenaCountry, "+387", "603039647")
        })
        test.step('Log out from paltform and open forgot password link', async()=>{
            await new PersonalInformation(proxyPageUAE).clickLogOut()
            await new PageAfterLogout(proxyPageUAE).redirectToSighIn()
        })
        await test.step('Check forgot password messages on UI', async()=>{
            await signIn.forgotPasswordClick()
            let response = await forgotPassword.sendEmailToAddress(testUser)
            expect(await forgotPassword.getRequestMethod(response)).toBe('POST')
            //expect(await forgotPassword.getForgotPasswordHeadText()).toEqual('Check yourInbox')
            //expect(await forgotPassword.getForgotPasswordDescription()).toEqual('We’ve sent your password reset instructions to:')
        })
    })
    test("@Africa Forgot password link test",
            {tag:['@forgotPassword', '@web', '@prodSanity', '@UI'], annotation:{description:'https://keywaygroup.atlassian.net/browse/RG-9272', type:'issue'}}, 
            async({proxyPageSA, AppNAGA, NagaAfricaCountry}, testInfo)=>{
        testInfo.setTimeout(testInfo.timeout + 40000)
        let signUp = new SignUp(proxyPageSA)
        let signIn = new SignIn(proxyPageSA)
        let forgotPassword = new ForgotPassword(proxyPageSA)
        let testUser = new RandomUser().getRandomUserEmail()
        let myAccount = new MyAccounts(proxyPageSA)
        await test.step(`Create lead user ${testUser}`, async()=>{
            await signUp.goto(AppNAGA, 'register')
            await new Captcha(proxyPageSA).removeCaptcha()
            await signUp.createCfdUser_All(testUser, process.env.USER_PASSWORD || '', NagaAfricaCountry, "+387", "603039647")
            await new YouAreInNagaMarkets(proxyPageSA).clickExplorePlatform()
        })
        test.step('Log out from paltform and open forgot password link', async()=>{
            await myAccount.openUserMenu()
            await myAccount.userLogOut()
            await new PageAfterLogout(proxyPageSA).redirectToSighIn()
            //await signUp.goto(AppNAGA, 'password/forgot')
        })
        await test.step('Check forgot password messages on UI', async()=>{
            await signIn.forgotPasswordClick()
            let response = await forgotPassword.sendEmailToAddress(testUser)
            expect(await forgotPassword.getRequestMethod(response)).toBe('POST')
            //expect(await forgotPassword.getForgotPasswordHeadText()).toEqual('ForgotPassword')
            //expect(await forgotPassword.getForgotPasswordDescription()).toEqual('We’ve sent your password reset instructions to:')
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
            })
        })}
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
})