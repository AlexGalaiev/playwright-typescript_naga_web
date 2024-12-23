import { expect } from "@playwright/test";
import { test } from "../../test-options";
import { getLocalization } from "../../pageObjects/localization/getText";
import { SignUp } from "../../pageObjects/ShortRegistrationPage/SighUpPage";
import { SignIn } from "../../pageObjects/SignIn/SignInPage";
import { RandomUser } from "../../pageObjects/common/testUserCredentials/randomUser";

test.describe("Sign up page.", async()=>{

    type testRiskDisclaimer = {
        testRailId: string,
        brand: string,
        localization: string
    }
    const testParamsRiskDisclaimer: testRiskDisclaimer[] = [
        {testRailId: '@24930', brand: '@NS', localization: '/pageObjects/localization/SignUpPage.json'},
        {testRailId: '@25142', brand: '@NM', localization: '/pageObjects/localization/NagaMarkets_SighUp.json'}
    ]
    for(const{testRailId, brand, localization} of testParamsRiskDisclaimer){
        test(`${testRailId} Risk Disclaimer text ${brand}`, {tag:['@UI']}, async({page})=>{
            let localizationText = new getLocalization(localization)
            let signUp = new SignUp(page);
            await signUp.goto(await new SignIn(page).chooseBrand(brand), "register")
            expect(await signUp.getRiskWarningText()).toEqual(await localizationText.getLocalizationText("SighUp_RiskDisclaimer"))
    })}

    type languages = {
        testRailId: string;
        brand: string;
        languages: string[];
    }
    const platformLanguages :languages[] = [
        {testRailId: '@25241', brand:'@NS', languages: ['English', 'Español', 'Deutsch','Polski','Italiano', 'Česky', 'Magyar', 'Português', 'Romanian', '汉语', '繁體中文']},
        {testRailId: '@25242', brand:'@NM', languages: ['English', 'Español', 'Deutsch','Polski','Italiano', 'Česky', 'Magyar', 'Português', 'Romanian', '汉语', '繁體中文']},
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
        {testRailId:'@25243', brand:'@NM', notCorrectCountry:'Ukraine', correctCountry:'France', msgText:'Firms within the NAGA Group do not provide regulated activities to residents of the '},
        {testRailId:'@25244', brand:'@NS', notCorrectCountry:'Ukraine', correctCountry:'France', msgText:'Firms within the NAGA Group do not provide regulated activities to residents of the '}
    ]
    for(const{testRailId, brand, notCorrectCountry, correctCountry, msgText}of CountryCheckParams){
        test(`${testRailId} Check not correct country msg. ${brand} brand`, {tag:'@UI'}, async({page})=>{
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
        {testRailId:'@25246', brand:'@NS', documents: new Map<string, string>([['Privacy Policy', "https://nagacap.com/documents/privacy_policy"],['legal documents',"https://nagacap.com/legal-documentation"],['Client Agreement',"https://nagacap.com/legal-documentation"]])},
        {testRailId:'@25247', brand:'@NM', documents: new Map<string, string>([['Privacy Policy', "https://nagamarkets.com/documents/privacy_policy"],['legal documents',"https://nagamarkets.com/legal-documentation"]])},
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

                    // const documentPage = await signUp.openDocument(documentName)
                    // const newTab = new SignUp(documentPage)
                    // expect(await newTab.checkUrl()).toContain(url)
                    // await newTab.closeTab();
                    // await signUp.switchBack()
                }})})
    }
})

test.describe('Create account per brand', async()=>{

    test.skip('@25356 @NM Create lead user',
        {tag:'@smoke', annotation:{'description':'https://keywaygroup.atlassian.net/browse/RG-1275','type':'ticket'}}, 
            async({page, NagaMarkets})=>{
        let signUp = new SignUp(page)
        let localizationText = new getLocalization('/pageObjects/localization/NagaMarkets_SighUp.json')
        await signUp.goto(NagaMarkets, 'register')
        expect(await signUp.getNumberObBtns()).toEqual(4)
        expect(await signUp.getRiskWarningText()).toEqual(await localizationText.getLocalizationText("SighUp_RiskDisclaimer"))
        let email = new RandomUser().getRandomUserEmail()
        await signUp.createCfdUser_All(email, process.env.USER_PASSWORD || '', 'France')
        expect(await signUp.personalInfoPopup()).toBeVisible()
    })
    test.skip('@25357 @NS Create lead user',
        {tag:'@smoke', annotation:{'description':'https://keywaygroup.atlassian.net/browse/RG-1275','type':'ticket'}}, 
            async({page, NagaCapital})=>{
        let signUp = new SignUp(page)
        let localizationText = new getLocalization('/pageObjects/localization/SignUpPage.json')
        await signUp.goto(NagaCapital, 'register')
        expect(await signUp.getNumberObBtns()).toEqual(4)
        expect(await signUp.getRiskWarningText()).toEqual(await localizationText.getLocalizationText("SighUp_RiskDisclaimer"))
        let email = new RandomUser().getRandomUserEmail()
        await signUp.createCFDUser(email, process.env.USER_PASSWORD || '', 'Bosnia and Herzegovina')
        expect(await signUp.personalInfoPopup()).toBeVisible()
    })
})


    


