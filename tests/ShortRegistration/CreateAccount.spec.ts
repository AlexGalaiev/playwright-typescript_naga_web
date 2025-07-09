import { expect } from "@playwright/test";
import { test } from "../../test-options";
import { getLocalization } from "../../pageObjects/localization/getText";
import { RandomUser } from "../../pageObjects/common/testUserCredentials/randomUser";
import { Captcha } from "../../pageObjects/captcha";

test.describe("Short regitration page elements", async()=>{

    test.describe('Capital', async()=>{
        
        test.beforeEach('Create vpn connect', async({appUA, AppNAGA},testInfo)=>{
            testInfo.setTimeout(testInfo.timeout + 10000)
            await appUA.signUp.goto(AppNAGA, "register")
        })

        test(`Risk Disclaimer text`, {tag:['@UI', '@mobile','@web']}, async({appUA})=>{
            let localizationText = await new getLocalization('/pageObjects/localization/NagaMarkets_SighUp.json').getLocalizationText('SighUp_RiskDisclaimer_Capital')
            expect(await appUA.signUp.getRiskWarningText()).toEqual(localizationText)
        })

        test('Check default languages', {tag:['@UI', '@web']}, async({appUA})=>{
            let languages = ['English', 'Español', 'Deutsch','Polski','Italiano', 'Česky', 'Magyar', 'Português', 'Română', '汉语', '繁體中文']
            await appUA.signIn.openLanguages();
            for(let index in languages){
                expect(await appUA.signIn.checkDefaultLanguage(languages[index])).toBeVisible();
            }
        })

        test('Legal documents on Short registrtaion page', {tag:['@UI','@mobile','@compliance','@web']}, async({appUA})=>{
            let documents = [['Privacy Policy', "https://naga.com/en/privacy-policy"],['legal documents',"https://nagacap.com/legal-documentation"],['Client Agreement',"https://nagacap.com/legal-documentation"]]
            await test.step('Check legal documents', async()=>{
                for(let[documentName, url] of documents){
                    expect(await appUA.signUp.getDocumentHref(documentName)).toEqual(url)}}
            )}
        )
        test(`Redirect from Capital logo to website`, {tag:['@UI','@web']}, async({appUA})=>{
            await appUA.signUp.clickLogo()
            await appUA.guestLogin.checkGuestPageIsVisible()
        })

        test(`Mobile view. Redirect from Capital logo to website`, {tag:['@UI','@mobile']}, async({appUA})=>{
            await appUA.signUp.clickLogo()
            await appUA.guestLogin.checkMobileGuestPageIsVisible()
        })
    })
    

    test.describe('Markets', async()=>{

        test.beforeEach('Create vpn connect', async({appIT, AppNAGA}, testInfo)=>{
            testInfo.setTimeout(testInfo.timeout + 10000)
            await appIT.signUp.goto(AppNAGA, "register")
        })

        test(`@Markets Risk Disclaimer text`, {tag:['@UI', '@mobile','@web']}, async({appIT})=>{
            let localizationText = await new getLocalization('/pageObjects/localization/NagaMarkets_SighUp.json').getLocalizationText('SighUp_RiskDisclaimer')
            expect(await appIT.signUp.getRiskWarningNM()).toEqual(localizationText)
        })
        test('@Markets Check default languages', {tag:['@UI', '@web']}, async({appIT})=>{
            let languages = ['English', 'Español', 'Deutsch','Polski','Italiano', 'Česky', 'Magyar', 'Português', 'Română', '汉语', '繁體中文']
            await appIT.signIn.openLanguages();
            for(let index in languages){
                expect(await appIT.signIn.checkDefaultLanguage(languages[index])).toBeVisible();
            }
        })
        test('Legal documents on Short registrtaion page', {tag:['@UI','@mobile','@compliance','@web']}, async({appIT})=>{
            let documents = [['Privacy Policy', "https://naga.com/eu/privacy-policy"],['legal documents',"https://nagamarkets.com/legal-documentation"]]
            await test.step('Check legal documents', async()=>{
                for(let[documentName, url] of documents){
                    expect(await appIT.signUp.getDocumentHref(documentName)).toEqual(url)
                }}
            )})

        test(`Redirect from Markets logo to website`, {tag:['@UI','@web']}, async({appIT})=>{
            await appIT.signUp.clickLogo()
            await appIT.guestLogin.checkGuestPageIsVisible()
        })

        test(`Mobile view. Redirect from Markets logo to website`, {tag:['@UI','@mobile']}, async({appIT})=>{
            await appIT.signUp.clickLogo()
            await appIT.guestLogin.checkMobileGuestPageIsVisible()
        })
})

    test.describe('@Africa', async()=>{

        test.beforeEach('Create vpn connect', async({appSA, AppNAGA}, testInfo)=>{
            testInfo.setTimeout(testInfo.timeout + 10000)
            await appSA.signUp.goto(AppNAGA, "register")
        })

        test(`Risk Disclaimer text`, {tag:['@UI', '@mobile','@web']}, async({appSA})=>{
            let localizationText = await new getLocalization('/pageObjects/localization/NagaMarkets_SighUp.json').getLocalizationText('SighUp_RiskDisclaimer_Africa')
            expect(await appSA.signUp.getRiskWarningText()).toEqual(localizationText)
        })

        test('Check default languages', {tag:['@UI', '@web']}, async({appSA})=>{
            let languages = ['English']
            await appSA.signIn.openLanguages();
            for(let index in languages){
                expect(await appSA.signIn.checkDefaultLanguage(languages[index])).toBeVisible();
            }})
        test('Legal documents on Short registrtaion page', {tag:['@UI','@mobile','@compliance','@web']}, async({appSA})=>{
            let documents = [['Privacy Policy', "https://naga.com/za/privacy-policy"]]
            await test.step('Check legal documents', async()=>{
                for(let[documentName, url] of documents){
                    expect(await appSA.signUp.getDocumentHref(documentName)).toEqual(url)
                }}
            )})
        test(`Redirect from Africa logo to website`, {tag:['@UI','@web'], annotation:{type:'tiket', description:'https://keywaygroup.atlassian.net/browse/RG-8514'}}, async({appSA})=>{
            await appSA.signUp.clickLogo()
            await appSA.guestLogin.checkGuestPageIsVisible()
        })

        test.skip(`Mobile. view. Redirect from Africa logo to website`,
            {tag:['@UI','@mobile'], annotation:{type:'tiket', description:'https://keywaygroup.atlassian.net/browse/RG-8514'}}, async({appSA})=>{
            await appSA.signUp.clickLogo()
            await appSA.guestLogin.checkMobileGuestPageIsVisible()
        })
    })

    test.describe('@Mena', async()=>{

        test.beforeEach('Create vpn connect', async({appUAE, AppNAGA}, testInfo)=>{
            testInfo.setTimeout(testInfo.timeout + 10000)
            await appUAE.signUp.goto(AppNAGA, "register")
        })

        test(`Risk Disclaimer text`, {tag:['@UI','@mobile','@web']}, async({appUAE})=>{
            let localizationText = await new getLocalization('/pageObjects/localization/NagaMarkets_SighUp.json').getLocalizationText('SighUp_RiskDisclaimer_Mena')
            expect(await appUAE.signUp.getMenaRiskWarning()).toContain(localizationText)
        })
        test('Check default languages', {tag:['@UI','@web']}, async({appUAE})=>{
            let languages = ['English', 'العربية']
            await appUAE.signIn.openLanguages();
            for(let index in languages){
                expect(await appUAE.signIn.checkDefaultLanguage(languages[index])).toBeVisible();
            }
        })
        test('Legal documents on Short registrtaion page', {tag:['@UI','@mobile','@compliance','@web']}, async({appUAE})=>{
            let documents = [['Privacy Policy', "https://naga.com/ae/privacy-policy"]]
            await test.step('Check legal documents', async()=>{
                for(let[documentName, url] of documents){
                    expect(await appUAE.signUp.getDocumentHref(documentName)).toEqual(url)
                }}
            )})
        test(`Redirect from Mena logo to website`,{tag:['@UI','@web']}, async({appUAE})=>{
            await appUAE.signUp.clickLogo()
            await appUAE.guestLogin.checkGuestPageIsVisible()
        })

        test(`Mobile view. Redirect from Mena logo to website`, {tag:['@UI','@mobile']}, async({appUAE})=>{
            await appUAE.signUp.clickLogo()
            await appUAE.guestLogin.checkMobileGuestPageIsVisible()
        })
    })

    test.describe('Spain', async()=>{
        test('Not clickable logo for spanish users',{tag:['@UI','@web','@mobile']}, async({appSpain, AppNAGA}, testInfo)=>{
            testInfo.setTimeout(testInfo.timeout + 10000)
            await appSpain.signUp.goto(AppNAGA, "register")
            await appSpain.signUp.clickLogo()
            expect(await appSpain.signUp.checkUrl()).toEqual(`${AppNAGA}/register`)
        })
    })
    test.describe('Crypto', async()=>{
        
        test.beforeEach('Login to platform', async({app, AppNAGAX}, testInfo)=>{
            testInfo.setTimeout(testInfo.timeout + 10000)
            await app.signIn.goto(AppNAGAX, 'register')
        })

        test(`Risk disclaimer test. Crypto`,{tag:['@UI','@web', '@crypto']}, async({app})=>{
            let localizationText = await new getLocalization('/pageObjects/localization/NagaCrypto.json').getLocalizationText('RiskDisclaimer')
            expect(await app.signUp.getCryptoRiskDisclaimer()).toEqual(localizationText)
        })

        test('Check platform languages. Crypto', {tag:['@UI', '@web', '@crypto']}, async({app})=>{
            let languages = ['English','Español','Deutsch','Polski','Italiano']
            await app.signUp.openCryptoLanguageMenu()
            for(let language of languages){
                expect(await app.signUp.checkCryptoLanguageVisibility(language)).toBeTruthy()
            }})
    })
})

test.describe('Lead registration', async()=>{
    
    type loginTypes = {
        brand: string,
        country: string,

    }
    const loginParams:loginTypes[] = [
        {brand:'@Markets', country:'France'},
        {brand:'@Mena', country: 'United Arab Emirates'}
    ]
    for(const{brand, country}of loginParams){
    test(`${brand} Lead short registration`, 
        {tag:['@smoke','@prodSanity','@mobile','@web','@lead']}, async({app, AppNAGA})=>{
        let email = new RandomUser().getRandomUserEmail()
        await test.step("Open register page, check number of buttons and remove captcha", async()=>{
            await app.signUp.goto(AppNAGA, 'register')
            await new Captcha(app.page).removeCaptcha()
            expect(await app.signUp.getNumberObBtns()).toEqual(4)
        })
        await test.step(`Create lead user - ${email}  country - ${country}. And check visibiity of personal popup`, async()=>{
            await app.signUp.createCfdUser_All(email, process.env.USER_PASSWORD || '', country, "+387", "603039647")
            expect(await app.signUp.personalInfoPopup()).toBeVisible()
        })
    })}
    
    const LoginParams:loginTypes[] = [
        {brand:'@Capital', country:'Bosnia and Herzegovina'}
    ] 
    for(const{brand, country}of LoginParams){
    test(`${brand} Lead short registration`, 
        {tag:['@smoke', '@prodSanity','@mobile','@web','@lead']}, async({app,AppNAGA})=>{
        let email = new RandomUser().getRandomUserEmail()
        await test.step('Open register page, check number of buttons, remove captcha', async()=>{
            await app.signUp.goto(AppNAGA, 'register')
            await new Captcha(app.page).removeCaptcha()
            expect(await app.signUp.getNumberObBtns()).toEqual(4)
        })
        await test.step(`Create lead user - ${email} country - ${country}.`, async()=>{
            await app.signUp.createCFDUser(email, process.env.USER_PASSWORD || '', country, '+387', '603039647')
            expect(await app.youAreIn.checkExploreBtn()).toBeTruthy()
        })
    })}
    const LoginParam:loginTypes[] = [
        {brand:'@Africa', country:'South Africa'}
    ] 
    for(const{brand, country}of LoginParam){
    test(`${brand} Lead short registration`, {tag:['@smoke', '@prodSanity', '@mobile','@web','@lead']}, async({app,AppNAGA})=>{
        let email = new RandomUser().getRandomUserEmail()
        await test.step('Open register page, check number of buttons, remove captcha', async()=>{
            await app.signUp.goto(AppNAGA, 'register')
            await new Captcha(app.page).removeCaptcha()
            expect(await app.signUp.getNumberObBtns()).toEqual(4)
        })
        await test.step(`Create lead user - ${email} country - ${country}.`, async()=>{
            await app.signUp.createCfdUser_All(email, process.env.USER_PASSWORD || '', country, "+387", "603039647")
            expect(await app.youAreIn.checkExploreBtn()).toBeTruthy()
        })
    })}
})

