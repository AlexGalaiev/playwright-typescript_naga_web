import { expect } from "@playwright/test";
import { getLocalization } from "../../pageObjects/localization/getText";
import {test} from "../../test-options"
import { RandomUser } from "../../pageObjects/common/testUserCredentials/randomUser";
import { Captcha } from "../../pageObjects/captcha";


test.describe("WEB", async()=>{

    test("@Capital Forgot password link test",
            {tag:['@forgotPassword', '@web', '@prodSanity','@settings']}, async({appUA, AppNAGA, NSCountry}, testInfo)=>{
        testInfo.setTimeout(testInfo.timeout + 40000)
        let testUser = new RandomUser().getRandomUserEmail()
        await test.step(`Create lead user ${testUser}`, async()=>{
            await appUA.signUp.goto(AppNAGA, 'register')
            await new Captcha(appUA.page).removeCaptcha()
            await appUA.signUp.createCFDUser(testUser, process.env.USER_PASSWORD || "", NSCountry,'+387', '603039647')
            await appUA.youAreIn.clickExplorePlatform()
        })
        test.step('Log out from paltform and open forgot password link', async()=>{
            await appUA.myAccounts.openUserMenu()
            await appUA.myAccounts.userLogOut()
            await appUA.pageAfterLogin.redirectToSighIn()
        })
        await test.step('Check forgot password messages on UI', async()=>{
            await appUA.signIn.forgotPasswordClick()
            let response = await appUA.forgotPassword.sendEmailToAddress(testUser)
            expect(await appUA.forgotPassword.getRequestMethod(response)).toBe('POST')
        })
    })

    test("@Markets Forgot password link test",
            {tag:['@forgotPassword', '@web', '@prodSanity','@settings']}, async({appIT, AppNAGA, NMCountry}, testInfo)=>{
        testInfo.setTimeout(testInfo.timeout + 40000)
        let testUser = new RandomUser().getRandomUserEmail()
        await test.step(`Create lead user ${testUser}`, async()=>{
            await appIT.signUp.goto(AppNAGA, 'register')
            await new Captcha(appIT.page).removeCaptcha()
            await appIT.signUp.createCfdUser_All(testUser, process.env.USER_PASSWORD || '', NMCountry, "+387", "603039647")
        })
        test.step('Log out from paltform and open forgot password link', async()=>{
            await appIT.personalInformation.clickLogOut()
            await appIT.pageAfterLogin.redirectToSighIn()
        })
        await test.step('Check forgot password messages on UI', async()=>{
            await appIT.signIn.forgotPasswordClick()
            let response = await appIT.forgotPassword.sendEmailToAddress(testUser)
            expect(await appIT.forgotPassword.getRequestMethod(response)).toBe('POST')
        })
    })
    test("@Mena Forgot password link test",
            {tag:['@forgotPassword', '@web', '@prodSanity','@settings'], annotation:{description:'https://keywaygroup.atlassian.net/browse/RG-9272', type:'issue'}}, 
            async({appUAE, AppNAGA, NagaMenaCountry}, testInfo)=>{
        testInfo.setTimeout(testInfo.timeout + 40000)
        let testUser = new RandomUser().getRandomUserEmail()
        await test.step(`Create lead user ${testUser}`, async()=>{
            await appUAE.signUp.goto(AppNAGA, 'register')
            await new Captcha(appUAE.page).removeCaptcha()
            await appUAE.signUp.createCfdUser_All(testUser, process.env.USER_PASSWORD || '', NagaMenaCountry, "+387", "603039647")
        })
        test.step('Log out from paltform and open forgot password link', async()=>{
            await appUAE.personalInformation.clickLogOut()
            await appUAE.pageAfterLogin.redirectToSighIn()
        })
        await test.step('Check forgot password messages on UI', async()=>{
            await appUAE.signIn.forgotPasswordClick()
            let response = await appUAE.forgotPassword.sendEmailToAddress(testUser)
            expect(await appUAE.forgotPassword.getRequestMethod(response)).toBe('POST')
        })
    })
    test("@Africa Forgot password link test",
            {tag:['@forgotPassword', '@web', '@prodSanity','@settings'], annotation:{description:'https://keywaygroup.atlassian.net/browse/RG-9272', type:'issue'}}, 
            async({appSA, AppNAGA, NagaAfricaCountry}, testInfo)=>{
        testInfo.setTimeout(testInfo.timeout + 40000)
        // let signUp = new SignUp(proxyPageSA)
        // let signIn = new SignIn(proxyPageSA)
        // let forgotPassword = new ForgotPassword(proxyPageSA)
        let testUser = new RandomUser().getRandomUserEmail()
        // let myAccount = new MyAccounts(proxyPageSA)
        await test.step(`Create lead user ${testUser}`, async()=>{
            await appSA.signUp.goto(AppNAGA, 'register')
            await new Captcha(appSA.page).removeCaptcha()
            await appSA.signUp.createCfdUser_All(testUser, process.env.USER_PASSWORD || '', NagaAfricaCountry, "+387", "603039647")
            await appSA.youAreIn.clickExplorePlatform()
        })
        test.step('Log out from paltform and open forgot password link', async()=>{
            await appSA.myAccounts.openUserMenu()
            await appSA.myAccounts.userLogOut()
            await appSA.pageAfterLogin.redirectToSighIn()
            //await signUp.goto(AppNAGA, 'password/forgot')
        })
        await test.step('Check forgot password messages on UI', async()=>{
            await appSA.signIn.forgotPasswordClick()
            let response = await appSA.forgotPassword.sendEmailToAddress(testUser)
            expect(await appSA.forgotPassword.getRequestMethod(response)).toBe('POST')
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
        test(`${testRailId} Open ${brand} platform in Guest mode`, {tag:['@UI','@mobile','@web']}, async({app,AppNAGA}, testInfo)=>{
            testInfo.setTimeout(testInfo.timeout + 50000);
            let localizationPage = new getLocalization(localization);
            await test.step("Redirect from platform (in Guest mode) to sigh in page", async()=>{
                await app.signUp.goto(AppNAGA,"feed");
                await app.mainPage.openLoginFromGuestMode();
                expect(await app.signIn.getSignInHeaderText()).toEqual(await localizationPage.getLocalizationText("SighInHeaderMainText"));
            });
            await test.step("Redirect from platform(in Guest mode) to sigh Up page", async()=>{
                await app.signUp.goto(AppNAGA, "feed");
                await app.mainPage.openRegistrationFromGuestMode();
                expect(await app.signUp.getSighUpTittleText()).toContain("Sign up");
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
            {tag:['@login', '@prodSanity','@smoke','@web']}, async({app,AppNAGA})=>{
            await test.step(`Login to ${brand} plarform by ${email} user`, async()=>{
                await app.signIn.goto(AppNAGA, 'login')
                await app.signIn.signInUserToPlatform(email, process.env.USER_PASSWORD || '')
            })
            await test.step('Log out from platform', async()=>{
                await app.myAccounts.openUserMenu();
                await app.myAccounts.userLogOut()
                expect(await app.pageAfterLogin.getLogOutPageTittle()).toEqual('Trade with NAGA on the go!')
            })})
    }
})