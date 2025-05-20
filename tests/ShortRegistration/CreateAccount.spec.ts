import { expect } from "@playwright/test";
import { test } from "../../test-options";
import { getLocalization } from "../../pageObjects/localization/getText";
import { SignUp } from "../../pageObjects/ShortRegistrationPage/SighUpPage";
import { SignIn } from "../../pageObjects/SignIn/SignInPage";
import { RandomUser } from "../../pageObjects/common/testUserCredentials/randomUser";
import { Captcha } from "../../pageObjects/captcha";
import { YouAreInNagaMarkets } from "../../pageObjects/FullRegistration/components/NAGAMarkets_YouAreInpopup";
import { NagaCom } from "../../pageObjects/Website/NagaCom";
import { GusetLogin } from "../../pageObjects/MainPage/GuestLogin";
import { VPN } from "../../pageObjects/Website/VPN";

test.describe("Short regitration page elements", async()=>{

    test.describe('Capital', async()=>{
        
        test.beforeEach('Create vpn connect', async({proxyPageUA, AppNAGA},testInfo)=>{
            testInfo.setTimeout(testInfo.timeout + 10000)
            await new SignUp(proxyPageUA).goto(AppNAGA, "register")
        })

        test(`@24930 Risk Disclaimer text`, {tag:['@UI', '@mobile','@web']}, async({proxyPageUA})=>{
            let localizationText = await new getLocalization('/pageObjects/localization/NagaMarkets_SighUp.json').getLocalizationText('SighUp_RiskDisclaimer_Capital')
            expect(await new SignUp(proxyPageUA).getRiskWarningText()).toEqual(localizationText)
        })

        test('@25241 Check default languages', {tag:['@UI', '@web']}, async({proxyPageUA})=>{
            let languages = ['English', 'Español', 'Deutsch','Polski','Italiano', 'Česky', 'Magyar', 'Português', 'Română', '汉语', '繁體中文']
            let signIn = new SignIn(proxyPageUA)
            await signIn.openLanguages();
            for(let index in languages){
                expect(await signIn.checkDefaultLanguage(languages[index])).toBeVisible();
            }
        })

        test('@25246 Legal documents on Short registrtaion page', {tag:['@UI','@mobile','@compliance','@web']}, async({proxyPageUA})=>{
            let documents = [['Privacy Policy', "https://naga.com/en/privacy-policy"],['legal documents',"https://nagacap.com/legal-documentation"],['Client Agreement',"https://nagacap.com/legal-documentation"]]
            await test.step('Check legal documents', async()=>{
                for(let[documentName, url] of documents){
                    expect(await new SignUp(proxyPageUA).getDocumentHref(documentName)).toEqual(url)}}
            )}
        )
        test(`@25389 Redirect from Capital logo to website`,
            {tag:['@UI','@web']}, async({proxyPageUA})=>{
            await new SignUp(proxyPageUA).clickLogo()
            await new GusetLogin(proxyPageUA).checkGuestPageIsVisible()
        })

        test(`@25389 Mobile view. Redirect from Capital logo to website`,
            {tag:['@UI','@mobile']}, async({proxyPageUA})=>{
            await new SignUp(proxyPageUA).clickLogo()
            await new GusetLogin(proxyPageUA).checkMobileGuestPageIsVisible()
        })
    })
    

    test.describe('Markets', async()=>{

        test.beforeEach('Create vpn connect', async({proxyPage, AppNAGA}, testInfo)=>{
            testInfo.setTimeout(testInfo.timeout + 10000)
            await new SignUp(proxyPage).goto(AppNAGA, "register")
        })

        test(`@25142 @Markets Risk Disclaimer text`, {tag:['@UI', '@mobile','@web']}, async({proxyPage})=>{
            let localizationText = await new getLocalization('/pageObjects/localization/NagaMarkets_SighUp.json').getLocalizationText('SighUp_RiskDisclaimer')
            expect(await new SignUp(proxyPage).getRiskWarningNM()).toEqual(localizationText)
        })
        test('@25242 @Markets Check default languages', {tag:['@UI', '@web']}, async({proxyPage})=>{
            let languages = ['English', 'Español', 'Deutsch','Polski','Italiano', 'Česky', 'Magyar', 'Português', 'Română', '汉语', '繁體中文']
            let signIn = new SignIn(proxyPage)
            await signIn.openLanguages();
            for(let index in languages){
                expect(await signIn.checkDefaultLanguage(languages[index])).toBeVisible();
            }
        })
        test('@25247 Legal documents on Short registrtaion page', {tag:['@UI','@mobile','@compliance','@web']}, async({proxyPage})=>{
            let documents = [['Privacy Policy', "https://naga.com/eu/privacy-policy"],['legal documents',"https://nagamarkets.com/legal-documentation"]]
            await test.step('Check legal documents', async()=>{
                for(let[documentName, url] of documents){
                    expect(await new SignUp(proxyPage).getDocumentHref(documentName)).toEqual(url)
                }}
            )})

        test(`@25388 Redirect from Markets logo to website`,
            {tag:['@UI','@web']}, async({proxyPage})=>{
            await new SignUp(proxyPage).clickLogo()
            await new GusetLogin(proxyPage).checkGuestPageIsVisible()
        })

        test(`@25388 Mobile view. Redirect from Markets logo to website`,
            {tag:['@UI','@mobile']}, async({proxyPage})=>{
            await new SignUp(proxyPage).clickLogo()
            await new GusetLogin(proxyPage).checkMobileGuestPageIsVisible()
        })
})

    test.describe('@Africa', async()=>{

        test.beforeEach('Create vpn connect', async({proxyPageSA, AppNAGA}, testInfo)=>{
            testInfo.setTimeout(testInfo.timeout + 10000)
            await new SignUp(proxyPageSA).goto(AppNAGA, "register")
        })

        test(`@25433 @Africa Risk Disclaimer text`, {tag:['@UI', '@mobile','@web']}, async({proxyPageSA})=>{
            let localizationText = await new getLocalization('/pageObjects/localization/NagaMarkets_SighUp.json').getLocalizationText('SighUp_RiskDisclaimer_Africa')
            expect(await new SignUp(proxyPageSA).getRiskWarningText()).toEqual(localizationText)
        })

        test('@25437 @Africa Check default languages', {tag:['@UI', '@web']}, async({proxyPageSA})=>{
            let languages = ['English']
            let signIn = new SignIn(proxyPageSA)
            await signIn.openLanguages();
            for(let index in languages){
                expect(await signIn.checkDefaultLanguage(languages[index])).toBeVisible();
            }})
        test('@25443 Legal documents on Short registrtaion page', {tag:['@UI','@mobile','@compliance','@web']}, async({proxyPageSA})=>{
            let documents = [['Privacy Policy', "https://naga.com/za/privacy-policy"]]
            await test.step('Check legal documents', async()=>{
                for(let[documentName, url] of documents){
                    expect(await new SignUp(proxyPageSA).getDocumentHref(documentName)).toEqual(url)
                }}
            )})
        test(`@25390 Redirect from Africa logo to website`,
            {tag:['@UI','@web'], annotation:{type:'tiket', description:'https://keywaygroup.atlassian.net/browse/RG-8514'}}, async({proxyPageSA})=>{
            await new SignUp(proxyPageSA).clickLogo()
            await new GusetLogin(proxyPageSA).checkGuestPageIsVisible()
        })

        test.skip(`@25390 Mobile. view. Redirect from Africa logo to website`,
            {tag:['@UI','@mobile'], annotation:{type:'tiket', description:'https://keywaygroup.atlassian.net/browse/RG-8514'}}, async({proxyPageSA})=>{
            let website = new NagaCom(proxyPageSA)
            await new SignUp(proxyPageSA).clickLogo()
            await new GusetLogin(proxyPageSA).checkMobileGuestPageIsVisible()
        })
    })

    test.describe('@Mena', async()=>{

        test.beforeEach('Create vpn connect', async({proxyPageUAE, AppNAGA}, testInfo)=>{
            testInfo.setTimeout(testInfo.timeout + 10000)
            await new SignUp(proxyPageUAE).goto(AppNAGA, "register")
        })

        test(`@25432 @Mena Risk Disclaimer text`, {tag:['@UI','@mobile','@web']}, async({proxyPageUAE})=>{
            let localizationText = await new getLocalization('/pageObjects/localization/NagaMarkets_SighUp.json').getLocalizationText('SighUp_RiskDisclaimer_Mena')
            expect(await new SignUp(proxyPageUAE).getMenaRiskWarning()).toContain(localizationText)
        })
        test('@25436 @Mena Check default languages', {tag:['@UI','@web']}, async({proxyPageUAE})=>{
            let languages = ['English', 'العربية']
            let signIn = new SignIn(proxyPageUAE)
            await signIn.openLanguages();
            for(let index in languages){
                expect(await signIn.checkDefaultLanguage(languages[index])).toBeVisible();
            }
        })
        test('@25442 Legal documents on Short registrtaion page', {tag:['@UI','@mobile','@compliance','@web']}, async({proxyPageUAE})=>{
            let documents = [['Privacy Policy', "https://naga.com/ae/privacy-policy"]]
            await test.step('Check legal documents', async()=>{
                for(let[documentName, url] of documents){
                    expect(await new SignUp(proxyPageUAE).getDocumentHref(documentName)).toEqual(url)
                }}
            )})
        test(`@25391 Redirect from Mena logo to website`,
            {tag:['@UI','@web']}, async({proxyPageUAE})=>{
            await new SignUp(proxyPageUAE).clickLogo()
            await new GusetLogin(proxyPageUAE).checkGuestPageIsVisible()
        })

        test(`@25391 Mobile view. Redirect from Mena logo to website`,
            {tag:['@UI','@mobile']}, async({proxyPageUAE})=>{
            await new SignUp(proxyPageUAE).clickLogo()
            await new GusetLogin(proxyPageUAE).checkMobileGuestPageIsVisible()
        })
    })

    test.describe('Spain', async()=>{
        test('Not clickable logo for spanish users',{tag:['@UI','@web','@mobile']}, async({proxyPageES, AppNAGA}, testInfo)=>{
            testInfo.setTimeout(testInfo.timeout + 10000)
            let signUp = new SignUp(proxyPageES)
            await signUp.goto(AppNAGA, "register")
            await signUp.clickLogo()
            expect(await signUp.checkUrl()).toEqual(`${AppNAGA}/register`)
        })})
})

test.describe('Lead registration', async()=>{
    
    type loginTypes = {
        testRailId: string,
        brand: string,
        country: string,

    }
    const loginParams:loginTypes[] = [
        {testRailId:'@25356', brand:'@Markets', country:'France'},
        {testRailId:'@25430', brand:'@Mena', country: 'United Arab Emirates'}
    ]
    for(const{testRailId, brand, country}of loginParams){
    test(`${testRailId} ${brand} Lead short registration`, 
        {tag:['@smoke','@prodSanity','@mobile','@web','@lead']}, async({page,AppNAGA})=>{
        let signUp = new SignUp(page)
        let email = new RandomUser().getRandomUserEmail()
        await test.step("Open register page, check number of buttons and remove captcha", async()=>{
            await signUp.goto(AppNAGA, 'register')
            await new Captcha(page).removeCaptcha()
            expect(await signUp.getNumberObBtns()).toEqual(4)
        })
        await test.step(`Create lead user - ${email}  country - ${country}. And check visibiity of personal popup`, async()=>{
            await signUp.createCfdUser_All(email, process.env.USER_PASSWORD || '', country, "+387", "603039647")
            expect(await signUp.personalInfoPopup()).toBeVisible()
        })
    })}
    
    const LoginParams:loginTypes[] = [
        {testRailId:'@25357', brand:'@Capital', country:'Bosnia and Herzegovina'}
    ] 
    for(const{testRailId, brand, country}of LoginParams){
    test(`${testRailId} ${brand} Lead short registration`, 
        {tag:['@smoke', '@prodSanity','@mobile','@web','@lead']}, async({page,AppNAGA})=>{
        let signUp = new SignUp(page)
        let email = new RandomUser().getRandomUserEmail()
        await test.step('Open register page, check number of buttons, remove captcha', async()=>{
            await signUp.goto(AppNAGA, 'register')
            await new Captcha(page).removeCaptcha()
            expect(await signUp.getNumberObBtns()).toEqual(4)
        })
        await test.step(`Create lead user - ${email} country - ${country}.`, async()=>{
            await signUp.createCFDUser(email, process.env.USER_PASSWORD || '', country, '+387', '603039647')
            expect(new YouAreInNagaMarkets(page).checkExploreBtn()).toBeTruthy()
        })
    })}
    const LoginParam:loginTypes[] = [
        {testRailId:'@25431', brand:'@Africa', country:'South Africa'}
    ] 
    for(const{testRailId, brand, country}of LoginParam){
    test(`${testRailId} ${brand} Lead short registration`, 
        {tag:['@smoke', '@prodSanity', '@mobile','@web','@lead']}, async({page,AppNAGA})=>{
        let signUp = new SignUp(page)
        let email = new RandomUser().getRandomUserEmail()
        await test.step('Open register page, check number of buttons, remove captcha', async()=>{
            await signUp.goto(AppNAGA, 'register')
            await new Captcha(page).removeCaptcha()
            expect(await signUp.getNumberObBtns()).toEqual(4)
        })
        await test.step(`Create lead user - ${email} country - ${country}.`, async()=>{
            await signUp.createCfdUser_All(email, process.env.USER_PASSWORD || '', country, "+387", "603039647")
            expect(new YouAreInNagaMarkets(page).checkExploreBtn()).toBeTruthy()
        })
    })}
})


    


