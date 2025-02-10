import { expect } from "@playwright/test";
import { test } from "../../test-options";
import { getLocalization } from "../../pageObjects/localization/getText";
import { SignUp } from "../../pageObjects/ShortRegistrationPage/SighUpPage";
import { SignIn } from "../../pageObjects/SignIn/SignInPage";
import { RandomUser } from "../../pageObjects/common/testUserCredentials/randomUser";
import { Captcha } from "../../pageObjects/captcha";
import { YouAreInNagaMarkets } from "../../pageObjects/FullRegistration/components/NAGAMarkets_YouAreInpopup";

test.describe("Sign up page.", async()=>{

    type testRiskDisclaimer = {
        testRailId: string,
        brand: string,
        localization: string
    }
    const testParamsRiskDisclaimer: testRiskDisclaimer[] = [
        {testRailId: '@24930', brand: '@Capital', localization: 'SighUp_RiskDisclaimer_Capital'},
        {testRailId: '@25142', brand: '@Markets', localization: 'SighUp_RiskDisclaimer'},
        {testRailId: '@25433', brand: '@Africa', localization: 'SighUp_RiskDisclaimer_Africa'}
    ]
    for(const{testRailId, brand, localization} of testParamsRiskDisclaimer){
        test(`${testRailId} Risk Disclaimer text ${brand}`, {tag:['@UI']}, async({page})=>{
            let localizationText = await new getLocalization('/pageObjects/localization/NagaMarkets_SighUp.json').getLocalizationText(localization)
            let signUp = new SignUp(page);
            await signUp.goto(await new SignIn(page).chooseBrand(brand), "register")
            expect(await signUp.getRiskWarningText()).toEqual(localizationText)
        })
    }

    const testParamsRiskDisclaimerMena: testRiskDisclaimer[] = [
        {testRailId: '@25432', brand: '@Mena', localization: 'SighUp_RiskDisclaimer_Mena'}
    ]
    for(const{testRailId, brand, localization} of testParamsRiskDisclaimerMena){
        test(`${testRailId} Risk Disclaimer text ${brand}`, {tag:['@UI']}, async({page})=>{
            let localizationText = await new getLocalization('/pageObjects/localization/NagaMarkets_SighUp.json').getLocalizationText(localization)
            let signUp = new SignUp(page);
            await signUp.goto(await new SignIn(page).chooseBrand(brand), "register")
            expect(await signUp.getMenaRiskWarning()).toContain(localizationText)
        })
    }


    type languages = {
        testRailId: string;
        brand: string;
        languages: string[];
    }
    const platformLanguages :languages[] = [
        {testRailId: '@25241', brand:'@Capital', languages: ['English', 'Español', 'Deutsch','Polski','Italiano', 'Česky', 'Magyar', 'Português', 'Română', '汉语', '繁體中文']},
        {testRailId: '@25242', brand:'@Markets', languages: ['English', 'Español', 'Deutsch','Polski','Italiano', 'Česky', 'Magyar', 'Português', 'Română', '汉语', '繁體中文']},
        {testRailId: '@25436', brand:'@Mena', languages: ['English', 'العربية']},
        {testRailId: '@25437', brand:'@Africa', languages: ['English']},
    ]
    for(const{testRailId, brand, languages}of platformLanguages){
        test(`${testRailId} Check default languages on ${brand}`, {tag:['@UI']}, async({page})=>{
            let signIn = new SignIn(page)
            await test.step(`Open platform of ${brand} brand`, async()=>{
                await signIn.goto(await signIn.chooseBrand(brand), 'login')
            })
            await test.step('Check languages', async()=>{
                await signIn.openLanguages();
                for(let index in languages){
                    expect(await signIn.checkDefaultLanguage(languages[index])).toBeVisible();
                }
            })})
        }
    
    type countryCheck = {
        testRailId: string,
        brand: string,
        notCorrectCountry: string,
        correctCountry: string,
        msgText: string
    }
    const CountryCheckParams: countryCheck[] =[
        {testRailId:'@25243', brand:'@Markets', notCorrectCountry:'Ukraine', correctCountry:'France', msgText:'Firms within the NAGA Group do not provide regulated activities to residents of the '},
        {testRailId:'@25244', brand:'@Capital', notCorrectCountry:'Ukraine', correctCountry:'France', msgText:'Firms within the NAGA Group do not provide regulated activities to residents of the '}
    ]
    for(const{testRailId, brand, notCorrectCountry, correctCountry, msgText}of CountryCheckParams){
        test(`${testRailId} Check not correct country msg. ${brand} brand`, {tag:['@UI']}, async({page})=>{
            let sighUp = new SignUp(page)
            await test.step(`Open platform for brand ${brand}`, async()=>{
                await sighUp.goto(await new SignIn(page).chooseBrand(brand), 'register')
            })
            await test.step(`Check msg appear after input ${notCorrectCountry}`, async()=>{
                await sighUp.inputCountry(notCorrectCountry)
                expect(await sighUp.getNotCoorectMsgText()).toContain(msgText)
            })
            await test.step(`Check msg dissappear after country change to ${correctCountry}`, async()=>{
                await sighUp.inputCountry(correctCountry)
                expect(await sighUp.notCorrectCountryMSG).not.toBeVisible()
            })})
        }
    type legalDocuments = {
        testRailId: string,
        brand: string,
        documents: Map<string, string>
    }
    const legalDocumentsParams: legalDocuments[] = [
        {testRailId:'@25246', brand:'@Capital', documents: new Map<string, string>([['Privacy Policy', "https://nagacap.com/documents/privacy_policy"],['legal documents',"https://nagacap.com/legal-documentation"],['Client Agreement',"https://nagacap.com/legal-documentation"]])},
        {testRailId:'@25247', brand:'@Markets', documents: new Map<string, string>([['Privacy Policy', "https://nagamarkets.com/documents/privacy_policy"],['legal documents',"https://nagamarkets.com/legal-documentation"]])},
    ]
    for(const{testRailId, brand, documents}of legalDocumentsParams){
        test(`${testRailId} Check legal documents on sigh up page. ${brand} brand`, {tag:['@UI', '@compliance']},async({page}, testInfo)=>{
            let signUp = new SignUp(page)
            testInfo.setTimeout(testInfo.timeout + 20000)
            await test.step(`Open sign up page on brand ${brand}`, async()=>{
                await signUp.goto(await new SignIn(page).chooseBrand(brand), 'register')
            })
            await test.step('Check legal documents', async()=>{
                for(let[documentName, url] of documents){
                    expect(await signUp.getDocumentHref(documentName)).toEqual(url)
                }})})
    }
})

test.describe('All Brands', async()=>{
    
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
    test(`${testRailId} ${brand} Lead short registration`, {tag:['@smoke','@prodSanity']}, async({page})=>{
        let signUp = new SignUp(page)
        let email = new RandomUser().getRandomUserEmail()
        await test.step("Open register page, check number of buttons and remove captcha", async()=>{
            await signUp.goto(await new SignIn(page).chooseBrand(brand), 'register')
            await new Captcha(page).removeCaptcha()
            expect(await signUp.getNumberObBtns()).toEqual(4)
        })
        await test.step(`Create lead user - ${email}. country - ${country}. And check visibiity of personal popup`, async()=>{
            await signUp.createCfdUser_All(email, process.env.USER_PASSWORD || '', country, "+387", "603039647")
            expect(await signUp.personalInfoPopup()).toBeVisible()
        })
    })}
    
    const LoginParams:loginTypes[] = [
        {testRailId:'@25357', brand:'@Capital', country:'Bosnia and Herzegovina'}
    ] 
    for(const{testRailId, brand, country}of LoginParams){
    test(`${testRailId} ${brand} Lead short registration`, {tag:['@smoke', '@prodSanity']}, async({page})=>{
        let signUp = new SignUp(page)
        let email = new RandomUser().getRandomUserEmail()
        await test.step('Open register page, check number of buttons, remove captcha', async()=>{
            await signUp.goto(await new SignIn(page).chooseBrand(brand), 'register')
            await new Captcha(page).removeCaptcha()
            expect(await signUp.getNumberObBtns()).toEqual(4)
        })
        await test.step(`Create lead user - ${email}. country - ${country}.`, async()=>{
            await signUp.createCFDUser(email, process.env.USER_PASSWORD || '', country)
            expect(new YouAreInNagaMarkets(page).checkExploreBtn()).toBeTruthy()
        })
    })}
    const LoginParam:loginTypes[] = [
        {testRailId:'@25431', brand:'@Africa', country:'South Africa'}
    ] 
    for(const{testRailId, brand, country}of LoginParam){
    test(`${testRailId} ${brand} Lead short registration`, {tag:['@smoke', '@prodSanity']}, async({page})=>{
        let signUp = new SignUp(page)
        let email = new RandomUser().getRandomUserEmail()
        await test.step('Open register page, check number of buttons, remove captcha', async()=>{
            await signUp.goto(await new SignIn(page).chooseBrand(brand), 'register')
            await new Captcha(page).removeCaptcha()
            expect(await signUp.getNumberObBtns()).toEqual(4)
        })
        await test.step(`Create lead user - ${email}. country - ${country}.`, async()=>{
            await signUp.createCfdUser_All(email, process.env.USER_PASSWORD || '', country, "+387", "603039647")
            expect(new YouAreInNagaMarkets(page).checkExploreBtn()).toBeTruthy()
        })
    })}
})


    


