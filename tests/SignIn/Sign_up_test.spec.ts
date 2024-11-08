import { expect } from "@playwright/test";
import { test } from "../../test-options";
import { getLocalization } from "../../pageObjects/localization/getText";
import { ChangeBrandPopup } from "../../pageObjects/ShortRegistrationPage/ChangeBrandPopup";
import { SignUp } from "../../pageObjects/ShortRegistrationPage/SighUpPage";
import { SignIn } from "../../pageObjects/SignIn/SignInPage";
import { StringColorFormat } from "@faker-js/faker";

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
        test(`${testRailId} Risk Disclaimer text ${brand}`, {tag:['@smoke', '@signIn']}, async({page})=>{
            let localizationText = new getLocalization(localization)
            let signUp = new SignUp(page);
            await signUp.goto(await new SignIn(page).chooseBrand(brand), "register")
            expect(await signUp.getRiskWarningText()).toEqual(await localizationText.getLocalizationText("SighUp_RiskDisclaimer"))
    })}

    const testNXRiskDisclaimer: testRiskDisclaimer[] = [
        {testRailId: '@25116', brand:'@NX', localization: '/pageObjects/localization/NagaX_SignInPage.json'}
    ]
    for(const{testRailId, brand, localization} of testNXRiskDisclaimer){
        test(`${testRailId} Risk Disclaimer text ${brand}`, {tag:['@smoke', '@signIn']}, async({page})=>{
            let localizationText = new getLocalization(localization)
            let signUp = new SignUp(page);
            await signUp.goto(await new SignIn(page).chooseBrand(brand), "register")
            expect(await signUp.getRiskWarningText_NX()).toEqual(await localizationText.getLocalizationText("SighIn_RiskDisclaimer"))
    })}

    type languages = {
        testRailId: string;
        brand: string;
        languages: string[];
    }
    const platformLanguages :languages[] = [
        {testRailId: '@25117', brand:'@NX', languages: ['English', 'Español', 'Deutsch','Polski','Italiano']},
        {testRailId: '@25241', brand:'@NS', languages: ['English', 'Español', 'Deutsch','Polski','Italiano', 'Česky', 'Magyar', 'Português', 'Romanian', '汉语', '繁體中文']},
        {testRailId: '@25242', brand:'@NM', languages: ['English', 'Español', 'Deutsch','Polski','Italiano', 'Česky', 'Magyar', 'Português', 'Romanian', '汉语', '繁體中文']},
    ]
    for(const{testRailId, brand, languages}of platformLanguages){
        test(`${testRailId} Check default languages on ${brand}`, {tag:['@signIn']}, async({page})=>{
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
        test(`${testRailId} Check not correct country msg. ${brand} brand`, {tag:['@signIn']}, async({page})=>{
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
        {testRailId:'@25246', brand:'@NS', documents: new Map<string, string>([['Privacy Policy', 'https://naga.com/en/privacy-policy'],['legal documents','https://naga.com/en/legal-documentation'],['Client Agreement','https://naga.com/en/legal-documentation']])},
        {testRailId:'@25247', brand:'@NM', documents: new Map<string, string>([['Privacy Policy', 'https://cms.naga.com/Privacy_Policy'],['legal documents','https://nagamarkets.com/eu/legal-documentation']])},
        {testRailId:'@25247', brand:'@NX', documents: new Map<string, string>([['Privacy Policy', 'https://files.nagax.com/files/NXCY-Privacy-Policy.pdf'],['legal documents','https://nagax.com/eu/regulation-and-licensing']])}
    ]
    for(const{testRailId, brand, documents}of legalDocumentsParams){
        test(`${testRailId} Check legal documents on sigh up page. ${brand} brand`, {tag:['@signIn']},async({page})=>{
            let sighUp = new SignUp(page)
            await test.step(`Open sign up page on brand ${brand}`, async()=>{
                await sighUp.goto(await new SignIn(page).chooseBrand(brand), 'register')
            })
            await test.step('Check legal documents', async()=>{
                for(let[documentName, url] of documents){
                    const documentPage = await sighUp.openDocument(documentName)
                    const newTab = new SignUp(documentPage)
                    expect(await newTab.checkUrl()).toContain(url)
                    await newTab.closeTab();
                    await sighUp.switchBack()
                }})})
    }

    })
