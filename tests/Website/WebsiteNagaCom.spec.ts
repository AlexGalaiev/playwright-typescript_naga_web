import { expect, BrowserContext} from "@playwright/test";
import { NagaCom } from "../../pageObjects/Website/NagaCom";
import {test} from "../../test-options"
import { getLocalization } from "../../pageObjects/localization/getText";

test.describe('Naga.com website', async()=>{
    
    type RedirectTypes = {
        testRailId: string
        type: string;
        buttonName: string;
        redirectTo: string;
        baseUrl: string;
    }
    const fromWebsiteToNM: RedirectTypes[] = [
        {testRailId: '@25194', type: 'trade', buttonName: 'Login', baseUrl: 'https://naga.com/eu', redirectTo: 'https://nagamarkets.com/login'},
        {testRailId: '@25194', type: 'trade', buttonName: 'Get started',baseUrl: 'https://naga.com/eu', redirectTo: 'https://nagamarkets.com/register'},
        {testRailId: '@25194', type: 'invest', buttonName: 'Login', baseUrl: 'https://naga.com/eu',redirectTo: 'https://nagamarkets.com/login'},
        {testRailId: '@25194', type: 'invest', buttonName: 'Get started', baseUrl: 'https://naga.com/eu',redirectTo: 'https://nagamarkets.com/register'},
        {testRailId: '@25194', type: 'crypto', buttonName: 'Login', baseUrl: 'https://naga.com/eu', redirectTo: 'https://app.nagax.com/eu/login'},
        {testRailId: '@25194', type: 'crypto', buttonName: 'Get started', baseUrl: 'https://naga.com/eu', redirectTo: 'https://app.nagax.com/eu/register'},
        {testRailId: '@25194', type: 'pay', buttonName: 'Get your card', baseUrl: 'https://naga.com/eu', redirectTo: 'https://naga.com/eu/pay'},
        {testRailId: '@25208', type: 'Trade', buttonName: 'Login', baseUrl: 'https://naga.com/en', redirectTo: 'https://nagamarkets.com/login'},
        {testRailId: '@25208', type: 'Invest', buttonName: 'Login', baseUrl: 'https://naga.com/en', redirectTo: 'https://nagamarkets.com/login'},
    
    ]
    for(const{testRailId, type, buttonName, redirectTo, baseUrl }of fromWebsiteToNM){
        test(`${testRailId} Redirect from ${baseUrl} to ${redirectTo} platform. ${type} page. Click ${buttonName} button`, {tag: ['@prodSanity', '@website-naga.com']}, async({proxyPage})=>{
            let website = new NagaCom(proxyPage)
            await test.step(`Open website ${baseUrl}`, async()=>{
                await website.open(`${baseUrl}`)
            })
            await test.step(`Choose ${type} page. Click ${buttonName} btn`, async()=>{
                await website.checkTradeInstrument(`${type}`)
                await website.clickBtn(`${buttonName}`)
                expect(await website.checkUrl()).toContain(`${redirectTo}`)
            })
        })
    }
    
    const fromWebsitetoNS: RedirectTypes[] = [
        {testRailId: '@25195', type: 'trade', buttonName: 'Login', baseUrl: 'https://naga.com/eu', redirectTo: 'https://nagacap.com/login'},
        {testRailId: '@25195', type: 'trade', buttonName: 'Get started', baseUrl: 'https://naga.com/eu', redirectTo: 'https://nagacap.com/register'},
        {testRailId: '@25195', type: 'invest', buttonName: 'Login', baseUrl: 'https://naga.com/eu', redirectTo: 'https://nagacap.com/login'},
        {testRailId: '@25195', type: 'invest', buttonName: 'Get started', baseUrl: 'https://naga.com/eu', redirectTo: 'https://nagacap.com/register'},
        {testRailId: '@25195', type: 'crypto', buttonName: 'Login', baseUrl: 'https://naga.com/eu', redirectTo: 'https://app.nagax.com/eu/login'},
        {testRailId: '@25195', type: 'crypto', buttonName: 'Get started', baseUrl: 'https://naga.com/eu',  redirectTo: 'https://app.nagax.com/eu/register'},
        {testRailId: '@25195', type: 'pay', buttonName: 'Get your card', baseUrl: 'https://naga.com/eu', redirectTo: 'https://naga.com/eu/pay'},
        {testRailId: '@25209', type: 'Trade', buttonName: 'Login', baseUrl:'https://naga.com/en', redirectTo: 'https://nagacap.com/login'},
        {testRailId: '@25209', type: 'Trade', buttonName: 'Get started', baseUrl:'https://naga.com/en',  redirectTo: 'https://nagacap.com/register'},
        {testRailId: '@25209', type: 'Invest', buttonName: 'Login', baseUrl:'https://naga.com/en', redirectTo: 'https://nagacap.com/login'},
        {testRailId: '@25209', type: 'Invest', buttonName: 'Get started', baseUrl:'https://naga.com/en', redirectTo: 'https://nagacap.com/register'},
   
   
    ]
    for(const{type, buttonName, redirectTo, testRailId, baseUrl}of fromWebsitetoNS){
        test(`${testRailId} Redirect from ${baseUrl} to ${redirectTo} platform. ${type} page.Click ${buttonName} button`, {tag: ['@prodSanity', '@website-naga.com']},async({page})=>{
            let website = new NagaCom(page)
            await test.step(`Open website ${baseUrl}`, async()=>{
                await website.open(`${baseUrl}`)
            })
            await test.step(`Choose ${type} page. Click ${buttonName} btn`, async()=>{
                await website.checkTradeInstrument(`${type}`)
                await website.clickBtn(`${buttonName}`)
                expect(await website.checkUrl()).toContain(`${redirectTo}`)
            })})
    }

    const fromENtoNMAllert: RedirectTypes[] = [
        {testRailId: '@25210', type: 'Trade', buttonName: 'Get started', baseUrl:'https://naga.com/en', redirectTo: 'https://nagamarkets.com/register'},
        {testRailId: '@25210', type: 'Invest', buttonName: 'Get started', baseUrl:'https://naga.com/en',  redirectTo: 'https://nagamarkets.com/register'},
    ]
    for(const{type, buttonName, redirectTo, testRailId, baseUrl}of fromENtoNMAllert){
        test(`${testRailId} Redirect from ${baseUrl} to ${redirectTo}. Check allert popup.On ${type} page`, {tag: ['@prodSanity', '@website-naga.com']},async({proxyPage}, testInfo)=>{
            await testInfo.setTimeout(testInfo.timeout + 10000);
            let website = new NagaCom(proxyPage)
            let localization = new getLocalization('/pageObjects/localization/Website_NagaCom.json')
            await test.step(`Open website ${baseUrl}`, async()=>{
                await website.open(`${baseUrl}`)
            })
            await test.step(`Choose ${type} page. Click ${buttonName} btn`, async()=>{
                await website.checkTradeInstrument(`${type}`)
                await website.clickBtn(`${buttonName}`)
            await test.step('Check redirect notification popup text. And redirect to Webtrader', async()=>{
                expect(await website.getRedirectAllertPopupText()).toContain(await localization.getLocalizationText("RedirectAllertPopupText"))
                await website.acceptRedirectPopup()
            })
                expect(await website.checkUrl()).toContain(`${redirectTo}`)
            })})
        }

    type languageTypes = {
        regulation: string;
        languages: string[];
        testRailId: string;
    }
    const languageParameters: languageTypes[] = [
        {testRailId: '@25197', regulation: 'eu', languages: ['English (Europe)', 'Deutsch', 'Italiano', 'Español', 'Polski', 'Čeština', 'Nederlands', 'Português']},
        {testRailId: '@25196', regulation: 'en', languages: ['English (Global)', 'Español (Latam)', 'Português', 'العربية', 'Bahasa Indonesia', '简化字', '繁體中文']},
    ]
    for(const{testRailId, regulation, languages}of languageParameters){
        test(`${testRailId} Default languages via ${regulation}`,{tag: ['@prodSanity', '@website-naga.com']}, async({page})=>{
            let website = new NagaCom(page)
            await test.step(`Open naga.com/${regulation} website`, async()=>{
                await website.open(`https://naga.com/${regulation}`)
            })
            await test.step('Check visible language', async()=>{
                await website.openLanguages()
                for(let index in languages){
                    expect(await website.checkVisibileLanguage(languages[index])).toBeTruthy()
                }})})
    }

    type footerTypes = {
        testRailId: string;
        type: string;
    }
    const EuFooterParams: footerTypes[] = [
        {testRailId: '@25200', type: 'trade'},
        {testRailId: '@25202', type: 'invest'}
    ]
    for(const{testRailId, type} of EuFooterParams){
        test(`${testRailId} naga.com/eu footer.${type} page`, {tag: '@website-naga.com'}, async({page})=>{
            let website = new NagaCom(page);
            let localization = new getLocalization("/pageObjects/localization/Website_NagaCom.json")
            await test.step("Open website https://naga.com/eu", async()=>{
                await website.open('https://naga.com/eu')
                await website.checkTradeInstrument(type)
            })
            await test.step("Check naga.com/eu footer elements", async()=>{
                expect(await website.getText(await website.riskWarning_EU)).toEqual(await localization.getLocalizationText("EU_footer_RiskWarning_header"))
                expect(await website.getText(await website.riskWarning_EU_main)).toEqual(await localization.getLocalizationText("EU_footer_RiskWarning_main"))
                expect(await website.getText(await website.restrictedRegions_EU)).toEqual(await localization.getLocalizationText("EU_footer_RestrictedRegions"))
            })})
    }
    
    const EuFooterCryptoParams: footerTypes[] = [
        {testRailId: '@25205', type: 'crypto'},
    ]
    for(const{testRailId, type} of EuFooterCryptoParams){
        test(`${testRailId} naga.com/eu footer.${type} page`, {tag: '@website-naga.com'}, async({page})=>{
            let website = new NagaCom(page);
            let localization = new getLocalization("/pageObjects/localization/Website_NagaCom.json")
            await test.step("Open website https://naga.com/eu", async()=>{
                await website.open('https://naga.com/eu')
                await website.checkTradeInstrument(type)
            })
            await test.step("Check naga.com/eu footer elements", async()=>{
                expect(await website.getText(await website.euCryptoAdressFooter)).toEqual(await localization.getLocalizationText('EU_cryptoFooter_address'))
                expect(await website.getText(await website.euCryptoRegulationFooter)).toEqual(await localization.getLocalizationText('EU_cryptoFooter_regulation'))
                expect(await website.getText(await website.euCryptoRiskNotification)).toEqual(await localization.getLocalizationText('EU_cryptoFooter_riskNotification'))
                expect(await website.getText(await website.euCryptoRestrictedCountries)).toEqual(await localization.getLocalizationText('EU_cryptoFooter_restrictedCountries'))
            })
        })}

    const EuFooterPayParams: footerTypes[] = [
        {testRailId: '@25207', type: 'pay'},
    ]
    for(const{testRailId, type} of EuFooterPayParams){
        test(`${testRailId} naga.com/eu footer.${type} page`, {tag: '@website-naga.com'}, async({page})=>{
            let website = new NagaCom(page);
            let localization = new getLocalization("/pageObjects/localization/Website_NagaCom.json")
            await test.step("Open website https://naga.com/eu", async()=>{
                await website.open('https://naga.com/eu')
                await website.checkTradeInstrument(type)
            })
            await test.step("Check naga.com/eu footer elements", async()=>{
                expect(await website.getText(await website.euPayAddress)).toEqual(await localization.getLocalizationText('EU_payFooter_address'))
                expect(await website.getText(await website.euPayRegistrationNumber)).toEqual(await localization.getLocalizationText('EU_payFooter_registrationNumber'))
                expect(await website.getText(await website.euPayRiskNotification)).toEqual(await localization.getLocalizationText('EU_payFooter_riskNotification'))
            })
        })}



    const EnFooterParams: footerTypes[] = [
        {testRailId: "@25201", type: 'Trade'},
        {testRailId: "@25203", type: 'Invest'},
    ]
    for(const{testRailId, type}of EnFooterParams){
        test(`${testRailId} naga.com/en footer. ${type} page`, {tag: '@website-naga.com'}, async({page})=>{
            let website = new NagaCom(page);
            let localization = new getLocalization("/pageObjects/localization/Website_NagaCom.json")
            await test.step("Open website naga.com/en", async()=>{
                await website.open('https://naga.com/en')
                await website.checkTradeInstrument(type)
            })
            await test.step("Check footer naga.com/en footer elemets", async()=>{
                expect(await website.getText(await website.riskWarning_EN)).toEqual(await localization.getLocalizationText("EN_footer_RiskWarning"))
                expect(await website.getText(await website.restrictedRegions_EN)).toEqual(await localization.getLocalizationText("EN_footer_RestrictedRegions"))
            })
        })
    }
    const EuRiskWarningFooter: footerTypes[] = [
        {testRailId: '@25199', type: 'trade'},
        {testRailId: '@25198', type: 'invest'}
    ]
    for(const{testRailId, type}of EuRiskWarningFooter){
        test(`${testRailId} Risk Warning footer. ${type} page`, {tag: '@website-naga.com'}, async({page})=>{
            let website = new NagaCom(page);
            let localization = new getLocalization("/pageObjects/localization/Website_NagaCom.json")
            await test.step("Open website https://naga.com/eu", async()=>{
                await website.open('https://naga.com/eu')
                await website.checkTradeInstrument(type)
            })
            await test.step('Check risk warning footer', async()=>{
                expect(await website.getRiskWarningFooter()).toEqual(await localization.getLocalizationText("EU_riskWarning_footer"))
            })
        })
    }

    type searchTypes = {
        testRailId: string;
        type: string;
        nameOfInstrument: string;
        redirectTo: string;
        basePage: string;
        categoryName: string;
        buttonName: string;
    }
    const EuSearchTypes: searchTypes[] = [
        {testRailId: '@25214', type: 'trade', nameOfInstrument: "FACEBOOK", redirectTo: "https://nagacap.com/open-trade", basePage:"https://naga.com/eu", categoryName: 'Shares', buttonName:'Trade'},
        {testRailId: '@25212', type: 'invest', nameOfInstrument: "FACEBOOK", redirectTo: "https://nagacap.com/open-trade", basePage:"https://naga.com/eu", categoryName: 'Real Stock USA', buttonName: 'Invest'},
    ]
    for(const{testRailId, type, nameOfInstrument, redirectTo,basePage,categoryName,buttonName}of EuSearchTypes){
        test(`${testRailId} Search instrument on ${basePage}. ${type} page. Redirect to ${redirectTo}`, {tag: '@website-naga.com'}, async({page})=>{
            let website = new NagaCom(page)
            await test.step(`Open website ${basePage}. Check ${type} page`,async()=>{
                await website.open(basePage)
                await website.checkTradeInstrument(type)
            })
            await test.step(`Search instrument ${nameOfInstrument}. Redirect to ${redirectTo} platform`, async()=>{
                await website.searchInstrument(nameOfInstrument, categoryName);
                const[newPage, instrumentName] = await website.openPosition(buttonName)
                let newWebsite = new NagaCom(newPage)
                expect(await newWebsite.checkUrl()).toEqual(`${redirectTo}/${instrumentName}?type=BUY`)
            })
        })
    }

    const EnSearchTypes: searchTypes[] = [
        {testRailId: '@25213', type: 'Trade', nameOfInstrument: "FACEBOOK", redirectTo: "https://nagamarkets.com/open-trade", basePage:"https://naga.com/en", categoryName: 'Shares', buttonName:'Trade'},
        {testRailId: '@25211', type: 'Invest', nameOfInstrument: "FACEBOOK", redirectTo: "https://nagamarkets.com/open-trade", basePage:"https://naga.com/en", categoryName: 'Real Stock USA', buttonName: 'Invest'},
    ]
    for(const{testRailId, type, nameOfInstrument, redirectTo,basePage,categoryName,buttonName}of EnSearchTypes){
        test(`${testRailId} Search instrument on ${basePage}. ${type} page. Redirect to ${redirectTo}`, {tag: '@website-naga.com'}, async({proxyPage})=>{
            let website = new NagaCom(proxyPage)
            await test.step(`Open website ${basePage}. Check instrument ${type}`,async()=>{
                await website.open(basePage)
                await website.checkTradeInstrument(type)
            })
            await test.step(`Search instrument ${nameOfInstrument}. Redirect to platform`, async()=>{
                await website.searchInstrument(nameOfInstrument, categoryName);
                const[newPage, instrumentName] = await website.openPosition(buttonName)
                let newWebsite = new NagaCom(newPage)
                expect(await newWebsite.checkUrl()).toEqual(`${redirectTo}/${instrumentName}?type=BUY`)
            })
        })
    }
})