import { expect} from "@playwright/test";
import { NagaCom } from "../../pageObjects/Website/NagaCom";
import {test} from "../../test-options"
import { getLocalization } from "../../pageObjects/localization/getText";

test.describe('Website redirect', async()=>{
    
    type RedirectTypes = {
        type: string;
        buttonName: string;
        redirectTo: string;
        baseUrl: string;
    }
    //get started btn is tested in Check allert popup test
    const fromWebsiteToNM: RedirectTypes[] = [
        {type: 'Trade', buttonName: 'Login', baseUrl: 'https://naga.com/en', redirectTo: 'https://app.naga.com/login'},
        {type: 'Invest', buttonName: 'Login', baseUrl: 'https://naga.com/en', redirectTo: 'https://app.naga.com/login'},
    ]
    for(const{ type, buttonName, redirectTo, baseUrl }of fromWebsiteToNM){
        test(` Redirect with VPN (Italy) from ${baseUrl} / ${type} to ${redirectTo}.->Click ${buttonName} button`, 
            {tag: ['@prodSanity','@naga.com','@web','@smoke']}, async({appIT},testInfo)=>{
            testInfo.setTimeout(testInfo.timeout + 25000)
            await test.step(`Open website ${baseUrl}`, async()=>{
                await appIT.website.open(`${baseUrl}`)
            })
            await test.step(`Choose ${type} page. Click ${buttonName} btn`, async()=>{
                await appIT.website.checkTradeInstrument(`${type}`)
                await appIT.website.clickBtn(`${buttonName}`)
                expect(await appIT.website.checkUrl()).toContain(`${redirectTo}`)
            })
        })
    }
  
    const fromWebsiteToNMena: RedirectTypes[] = [
        {type: 'Trade', buttonName: 'Login', baseUrl: 'https://naga.com/ae', redirectTo: 'https://app.naga.com/login?lang=en'},
        {type: 'Trade', buttonName: 'Get started', baseUrl: 'https://naga.com/ae', redirectTo: 'https://app.naga.com/register?lang=en'},
        {type: 'Invest', buttonName: 'Login', baseUrl: 'https://naga.com/ae', redirectTo: 'https://app.naga.com/login?lang=en'},
        {type: 'Invest', buttonName: 'Get started', baseUrl: 'https://naga.com/ae', redirectTo: 'https://app.naga.com/register?lang=en'},
    ]
    for(const{type, buttonName, redirectTo, baseUrl }of fromWebsiteToNMena){
        test(`Redirect with VPN (UAE) from ${baseUrl} / ${type} to ${redirectTo}.->Click ${buttonName} button`, 
            {tag: ['@prodSanity', '@naga.com','@web','@smoke']}, async({appUAE},testInfo)=>{
            testInfo.setTimeout(testInfo.timeout + 30000)
            await test.step(`Open website ${baseUrl}`, async()=>{
                await appUAE.website.open(`${baseUrl}`)
            })
            await test.step(`Choose ${type} page. Click ${buttonName} btn`, async()=>{
                await appUAE.website.checkTradeInstrument(`${type}`)
                await appUAE.website.clickBtn(`${buttonName}`)
                expect(await appUAE.website.checkUrl()).toContain(`${redirectTo}`)
            })})
    }
    
    const fromWebsiteToNAfrica: RedirectTypes[] = [
        {type: 'Trade', buttonName: 'Login', baseUrl: 'https://naga.com/za', redirectTo: 'https://app.naga.com/login?lang=en'},
        {type: 'Trade', buttonName: 'Get started', baseUrl: 'https://naga.com/za', redirectTo: 'https://app.naga.com/register?lang=en'},
    ]
    for(const{type, buttonName, redirectTo, baseUrl }of fromWebsiteToNAfrica){
        test(`Redirect with VPN (ZA) from ${baseUrl} / ${type} to ${redirectTo}.->Click ${buttonName} button`, 
            {tag: ['@prodSanity', '@naga.com','@web','@smoke']}, async({appSA},testInfo)=>{
            testInfo.setTimeout(testInfo.timeout + 20000)
            await test.step(`Open website ${baseUrl}`, async()=>{
                await appSA.website.open(`${baseUrl}`)
            })
            await test.step(`Choose ${type} page. Click ${buttonName} btn`, async()=>{
                await appSA.website.checkTradeInstrument(`${type}`)
                await appSA.website.clickBtn(`${buttonName}`)
                expect(await appSA.website.checkUrl()).toContain(`${redirectTo}`)
            })
        })
    }
    
    const fromWebsitetoNS: RedirectTypes[] = [
        {type: 'trade', buttonName: 'Login', baseUrl: 'https://naga.com/eu', redirectTo: 'https://app.naga.com/login'},
        {type: 'trade', buttonName: 'Get started', baseUrl: 'https://naga.com/eu', redirectTo: 'https://app.naga.com/register'},
        {type: 'invest', buttonName: 'Login', baseUrl: 'https://naga.com/eu', redirectTo: 'https://app.naga.com/login'},
        {type: 'invest', buttonName: 'Get started', baseUrl: 'https://naga.com/eu', redirectTo: 'https://app.naga.com/register'},
        {type: 'crypto', buttonName: 'Login', baseUrl: 'https://naga.com/eu', redirectTo: 'https://app.nagax.com/eu/login'},
        {type: 'crypto', buttonName: 'Get started', baseUrl: 'https://naga.com/eu',  redirectTo: 'https://app.nagax.com/eu/register'},
    ]
    for(const{type, buttonName, redirectTo, baseUrl}of fromWebsitetoNS){
        test(` Redirect with VPN (Ukraine) from ${baseUrl} /${type} to ${redirectTo}. -> Click ${buttonName} button`, 
            {tag: ['@prodSanity', '@naga.com','@web','@smoke']}, async({appUA}, testInfo)=>{
            testInfo.setTimeout(testInfo.timeout + 20000)
            await test.step(`Open website ${baseUrl}`, async()=>{
                await appUA.website.open(`${baseUrl}`)
            })
            await test.step(`Choose ${type} page. Click ${buttonName} btn`, async()=>{
                await appUA.website.checkTradeInstrument(`${type}`)
                await appUA.website.clickBtn(`${buttonName}`)
                expect(await appUA.website.checkUrl()).toContain(`${redirectTo}`)
            })})
    }


    const fromENtoNMAllert: RedirectTypes[] = [
        {type: 'Trade', buttonName: 'Get started', baseUrl:'https://naga.com/en', redirectTo: 'https://app.naga.com/register'},
        {type: 'Invest', buttonName: 'Get started', baseUrl:'https://naga.com/en',  redirectTo: 'https://app.naga.com/register'},
    ]
    for(const{type, buttonName, redirectTo, baseUrl}of fromENtoNMAllert){
        test(` Redirect with VPN (Italy) from ${baseUrl} /${type} to ${redirectTo}. Check allert popup`, 
            {tag: ['@naga.com','@web']}, async({appIT}, testInfo)=>{
            testInfo.setTimeout(testInfo.timeout + 60000);
            let localization = new getLocalization('/pageObjects/localization/Website_NagaCom.json')
            await test.step(`Open website ${baseUrl}`, async()=>{
                await appIT.website.open(`${baseUrl}`)
            })
            await test.step(`Choose ${type} page. Click ${buttonName} btn`, async()=>{
                await appIT.website.checkAndCloseBullonPopup()
                await appIT.website.checkTradeInstrument(`${type}`)
                await appIT.website.clickBtn(`${buttonName}`)
            await test.step('Check redirect notification popup text. And redirect to Webtrader', async()=>{
                expect(await appIT.website.getRedirectAllertPopupText()).toContain(await localization.getLocalizationText("RedirectAllertPopupText"))
                await appIT.website.acceptRedirectPopup()
            })
                expect(await appIT.website.checkUrl()).toContain(`${redirectTo}`)
            })})
        }

    type searchTypes = {
        type: string;
        nameOfInstrument: string;
        redirectTo: string;
        basePage: string;
        buttonName: string;
    }
    const EuSearchTypes: searchTypes[] = [
        {type: 'trade', nameOfInstrument: "FACEBOOK", redirectTo: "https://app.naga.com/open-trade", basePage:"https://naga.com/eu", buttonName:'Trade'},
        {type: 'invest', nameOfInstrument: "FACEBOOK", redirectTo: "https://app.naga.com/open-trade", basePage:"https://naga.com/eu", buttonName: 'Invest'},
       ]
    for(const{ type, nameOfInstrument, redirectTo,basePage,buttonName}of EuSearchTypes){
        test(` VPN(Ukraine) Redirect from ${basePage}/${type} to platform. Search ${nameOfInstrument} instrument `, 
            {tag:['@naga.com','@web']}, async({appUA}, testInfo)=>{
            testInfo.setTimeout(testInfo.timeout + 40000)
            await test.step(`Open website ${basePage}. Check ${type} page`,async()=>{
                await appUA.website.open(basePage)
                await appUA.website.checkTradeInstrument(type)
                await appUA.website.acceptAllCookies()
                await appUA.website.checkAndCloseBullonPopup()
            })
            await test.step(`Search instrument ${nameOfInstrument}. Redirect to ${redirectTo} platform`, async()=>{
                await appUA.website.searchInstrument(nameOfInstrument);
                const[newPage, instrumentName] = await appUA.website.openPosition(buttonName)
                let newWebsite = new NagaCom(newPage)
                expect(await newWebsite.checkUrl()).toContain(`${redirectTo}`)
            })})
    }

    
    const AESearchTypes: searchTypes[] = [
         {type: 'Trade', nameOfInstrument: "SIEMENS", redirectTo: 'https://app.naga.com/open-trade', basePage:'https://naga.com/ae', buttonName:'Trade'},
         {type: 'Invest', nameOfInstrument: "SIEMENS", redirectTo: 'https://app.naga.com/open-trade', basePage:'https://naga.com/ae', buttonName:'Invest'}
    ]
    for(const{type, nameOfInstrument, redirectTo,basePage,buttonName}of AESearchTypes){
        test(` VPN(UAE) Redirect from ${basePage}/${type} to platform. Search ${nameOfInstrument} instrument `, 
            {tag:['@naga.com','@web']}, async({appUAE}, testInfo)=>{
            testInfo.setTimeout(testInfo.timeout + 40000)
            await test.step(`Open website ${basePage}. Check ${type} page`,async()=>{
                await appUAE.website.open(basePage)
                await appUAE.website.checkTradeInstrument(type)
            })
            await test.step(`Search instrument ${nameOfInstrument}. Redirect to ${redirectTo} platform`, async()=>{
                await appUAE.website.searchInstrument(nameOfInstrument);
                await appUAE.website.checkAndCloseBullonPopup()
                const[newPage, instrumentName] = await appUAE.website.openPosition(buttonName)
                let newWebsite = new NagaCom(newPage)
                expect(await newWebsite.checkUrl()).toContain(`${redirectTo}`)
            })})
    }

    
    const ZASearchTypes: searchTypes[] = [
         {type: 'Trade', nameOfInstrument: "FACEBOOK", redirectTo: "https://app.naga.com/open-trade", basePage:"https://naga.com/za", buttonName:'Trade'}
    ]
    for(const{type, nameOfInstrument, redirectTo,basePage,buttonName}of ZASearchTypes){
        test(` VPN(ZA) Redirect from ${basePage}/${type} to platform. Search ${nameOfInstrument} instrument `, 
            {tag:['@naga.com','@web']}, async({appSA}, testInfo)=>{
            testInfo.setTimeout(testInfo.timeout + 30000)
            await test.step(`Open website ${basePage}. Check ${type} page`,async()=>{
                await appSA.website.open(basePage)
                await appSA.website.checkTradeInstrument(type)
            })
            await test.step(`Search instrument ${nameOfInstrument}. Redirect to ${redirectTo} platform`, async()=>{
                await appSA.website.searchInstrument(nameOfInstrument);
                await appSA.website.checkAndCloseBullonPopup()
                const[newPage, instrumentName] = await appSA.website.openPosition(buttonName)
                let newWebsite = new NagaCom(newPage)
                expect(await newWebsite.checkUrl()).toContain(`${redirectTo}`)
            })})
    }

    const EnSearchTypes: searchTypes[] = [
        {type: 'Trade', nameOfInstrument: "FACEBOOK", redirectTo: "https://app.naga.com/open-trade", basePage:"https://naga.com/en", buttonName:'Trade'},
        {type: 'Invest', nameOfInstrument: "FACEBOOK", redirectTo: "https://app.naga.com/open-trade", basePage:"https://naga.com/en", buttonName: 'Invest'},
    ]
    for(const{type, nameOfInstrument, redirectTo,basePage,buttonName}of EnSearchTypes){
        test(` VPN(Italy). Redirect from ${basePage}/${type} to platfotm. Search ${nameOfInstrument} on page`, 
            {tag: ['@naga.com','@web']}, async({appIT}, testInfo)=>{
            testInfo.setTimeout(testInfo.timeout + 40000)
            await test.step(`Open website ${basePage}. Check instrument ${type}`,async()=>{
                await appIT.website.open(basePage)
                await appIT.website.checkTradeInstrument(type)
                await appIT.website.checkAndCloseBullonPopup()
            })
            await test.step(`Search instrument ${nameOfInstrument}. Redirect to platform`, async()=>{
                await appIT.website.searchInstrument(nameOfInstrument);
                const[newPage, instrumentName] = await appIT.website.openPosition(buttonName)
                let newWebsite = new NagaCom(newPage)
                expect(await newWebsite.checkUrl()).toContain(`${redirectTo}`)
            })})}
    })

test.describe('Website. Languages and translations', async()=>{

    type languageTypes = {
        regulation: string;
        languages: string[];
        numberOfLanguages: number;
    }
    const languageParameters: languageTypes[] = [
        {regulation: 'eu', numberOfLanguages: 9, languages: ['English (Europe)', 'Deutsch', 'Italiano', 'Español', 'Polski', 'Čeština', 'Nederlands', 'Português', 'Română']},
        {regulation: 'en', numberOfLanguages: 8, languages: ['English (Global)', 'Español (Latam)', 'Português', 'العربية', 'Bahasa Indonesia', '简化字', '繁體中文', 'ภาษาไทย']},
        {regulation: 'ae', numberOfLanguages: 2, languages: ['English (Mena)', 'العربية']}
    ]
    for(const{ regulation, languages,numberOfLanguages}of languageParameters){
        test(` Check available languages on ${regulation}`,{tag: ['@naga.com','@web']}, async({app})=>{
            await test.step(`Open naga.com/${regulation} website`, async()=>{
                await app.website.open(`https://naga.com/${regulation}`)
            })
            await test.step('Check visible language', async()=>{
                await app.website.openLanguages()
                for(let index in languages){
                    expect(await app.website.checkVisibileLanguage(languages[index])).toBeTruthy()
                }
                expect(await app.website.getNumberOfLanguages()).toEqual(numberOfLanguages)
            })})
    }


    type translations = {
        platform: string;
        language: string;
        tradeType: string;
        investType: string;
        btn1: string;
        btn2: string;
        btn3: string;
        btn4: string;
    }
                    
    const translationParams: translations[] = [
        {tradeType: 'trade', investType: 'invest', platform: "https://naga.com/eu", language:'English (Europe)', btn1:'LoginBtn.eng', btn2:"GetStarted.eng", btn3:"Discover more.eng", btn4:"Start trading.eng"},
        {tradeType: 'trade', investType: 'invest', platform: "https://naga.com/eu", language:'Deutsch', btn1:'LoginBtn.de', btn2:"GetStarted.de", btn3:"Discover more.de", btn4:"Start trading.de"},
        {tradeType: 'trade', investType: 'invest', platform: "https://naga.com/eu", language:'Italiano', btn1:'LoginBtn.it', btn2:"GetStarted.it", btn3:"Discover more.it", btn4:"Start trading.it"},
        {tradeType: 'trade', investType: 'invest', platform: "https://naga.com/eu", language:'Polski', btn1:'LoginBtn.pl', btn2:"GetStarted.pl", btn3:"Discover more.pl", btn4:"Start trading.pl"},
        {tradeType: 'trade', investType: 'invest', platform: "https://naga.com/eu", language:'Čeština', btn1:'LoginBtn.cz', btn2:"GetStarted.cz", btn3:"Discover more.cz", btn4:"Start trading.cz"},
        {tradeType: 'trade', investType: 'invest', platform: "https://naga.com/eu", language:'Nederlands', btn1:'LoginBtn.ne', btn2:"GetStarted.ne", btn3:"Discover more.ne", btn4:"Start trading.ne"},
        {tradeType: 'trade', investType: 'invest', platform: "https://naga.com/eu", language:'Português', btn1:'LoginBtn.po', btn2:"GetStarted.po", btn3:"Discover more.po", btn4:"Start trading.po"},
        {tradeType: 'trade', investType: 'invest', platform: "https://naga.com/eu", language:'Română', btn1:'LoginBtn.ro', btn2:"GetStarted.ro", btn3:"Discover more.ro", btn4:"Start trading.ro"},
        {tradeType: 'Trade', investType: 'Invest', platform: "https://naga.com/en", language:'Español (Latam)', btn1:'LoginBtn.lat', btn2:"GetStarted.lat", btn3:"Discover more.lat", btn4:"Start trading.lat"},
        {tradeType: 'Trade', investType: 'Invest', platform: "https://naga.com/en", language:'Português', btn1:'LoginBtn.por', btn2:"GetStarted.por", btn3:"Discover more.por", btn4:"Start trading.por"},
        {tradeType: 'Trade', investType: 'Invest', platform: "https://naga.com/en", language:'العربية', btn1:'LoginBtn.ar', btn2:"GetStarted.ar", btn3:"Discover more.ar", btn4:"Start trading.ar"},
        {tradeType: 'Trade', investType: 'Invest', platform: "https://naga.com/en", language:'Bahasa Indonesia', btn1:'LoginBtn.ind', btn2:"GetStarted.ind", btn3:"Discover more.ind", btn4:"Start trading.ind"},
        {tradeType: 'Trade', investType: 'Invest', platform: "https://naga.com/en", language:'简化字', btn1:'LoginBtn.chi', btn2:"GetStarted.chi", btn3:"Discover more.chi", btn4:"Start trading.chi"},
        {tradeType: 'Trade', investType: 'Invest', platform: "https://naga.com/en", language:'繁體中文', btn1:'LoginBtn.chiGlobal', btn2:"GetStarted.chiGlobal", btn3:"Discover more.chiGlobal", btn4:"Start trading.chiGlobal"},
        {tradeType: 'Trade', investType: 'Invest', platform: "https://naga.com/en", language:'ภาษาไทย', btn1:'LoginBtn.thai', btn2:"GetStarted.thai", btn3:"Discover more.thai", btn4:"Start trading.thai"},
        {tradeType: 'Trade', investType: 'Invest', platform: "https://naga.com/ae", language:'العربية', btn1:'LoginBtn.ar', btn2:"GetStarted.ar", btn3:"Discover more.ar", btn4:"Start trading.ar"},
    ]
    for(const{platform,language,btn1,btn2,btn3,btn4,tradeType,investType}of translationParams){
        test(`Localization of main buttons-${platform}. ${language} language`,
            {tag:['@naga.com','@web']}, async({app}, testInfo)=>{
            testInfo.setTimeout(testInfo.timeout + 80000);
            let localization = new getLocalization("/pageObjects/localization/Website_Naga.com_translations.json")
            await test.step(`Open ${platform} and switch to ${language}`, async()=>{
                await app.website.open(platform)
                await app.website.acceptAllCookies()
                await app.website.switchLanguageTo(language);
            })
            await test.step(`Check ${tradeType} page buttons`, async()=>{
                await app.website.checkTradeInstrument(`${tradeType}`)
                expect(await app.website.getBtnHeaderText(await localization.getTranslation(btn1))).toBeVisible()
                expect(await app.website.getBtnHeaderText(await localization.getTranslation(btn2))).toBeVisible()
            })
            await test.step(`Check ${investType} page buttons`, async()=>{
                await app.website.checkTradeInstrument(`${investType}`)
                await app.website.checkAndCloseBullonPopup()
                expect(await app.website.getBtnHeaderText(await localization.getTranslation(btn1))).toBeVisible()
                expect(await app.website.getBtnHeaderText(await localization.getTranslation(btn2))).toBeVisible()
            })})
        }

    type translationsCrypto = {
        platform: string;
        type: string;
        language: string;
        btn1: string;
        btn2: string;
    }

    const cryptoParams: translationsCrypto[] = [
        {platform: 'https://naga.com/eu', type: 'crypto', language:'English', btn1: 'LoginBtn.eng', btn2: 'GetStarted.eng'},
        {platform: 'https://naga.com/eu', type: 'crypto', language:'Deutsch', btn1: 'LoginBtn.de', btn2: 'GetStarted.de'},
        {platform: 'https://naga.com/eu', type: 'crypto', language:'Español', btn1: 'LoginBtn.es', btn2: 'GetStarted.es'},
        {platform: 'https://naga.com/eu', type: 'crypto', language:'Italiano', btn1: 'LoginBtn.it', btn2: 'Get started Crypto.it'},
        {platform: 'https://naga.com/eu', type: 'crypto', language:'Polski', btn1: 'LoginBtn.pl', btn2: 'Get started Crypto.pl'},
    ]
    for(const{platform, language, type, btn1, btn2}of cryptoParams){
        test(`Localization of main buttons, Language-${language} on ${platform}, ${type}`,
            {tag: ['@naga.com','@web']}, async({app}, testInfo)=>{
            testInfo.setTimeout(testInfo.timeout + 30000);
            let localization = new getLocalization("/pageObjects/localization/Website_Naga.com_translations.json")
            await test.step(`Open ${platform} and switch to ${language}`, async()=>{
                await app.website.open(platform)
                await app.website.checkTradeInstrument(`${type}`)
                await app.website.acceptAllCookies()
                await app.website.switchLanguageTo(language);
            })
            await test.step(`Check main button ${type} page`, async()=>{
                expect(await app.website.getBtnHeaderText(await localization.getTranslation(btn1))).toBeVisible()
                expect(await app.website.getBtnHeaderText(await localization.getTranslation(btn2))).toBeVisible()
            })})
        }

    type payTranslations = {
        platform: string,
        type: string,
        language: string,
        btn1: string
    }
    const payTranslationsParams: payTranslations[] = [
        {platform: 'https://naga.com/eu', type:'pay', language:'English (Europe)', btn1:"Get your card.eng"},
        {platform: 'https://naga.com/eu', type:'pay', language:'Deutsch', btn1:"Get your card.de"},
        {platform: 'https://naga.com/eu', type:'pay', language:'Italiano', btn1:"Get your card.it"},
        {platform: 'https://naga.com/eu', type:'pay', language:'Español', btn1:"Get your card.es"},
        {platform: 'https://naga.com/eu', type:'pay', language:'Polski', btn1:"Get your card.pl"},
        {platform: 'https://naga.com/eu', type:'pay', language:'Čeština', btn1:"Get your card.cz"},
        {platform: 'https://naga.com/eu', type:'pay', language:'Português', btn1:"Get your card.po"},
    ]
    for(const{ platform, language, btn1,type}of payTranslationsParams){
        test(`Localization of main buttons, Language-${language} on ${platform}, Pay page`,
            {tag:['@naga.com','@web']}, async({app}, testInfo)=>{
            testInfo.setTimeout(testInfo.timeout + 30000);
            let localization = new getLocalization("/pageObjects/localization/Website_Naga.com_translations.json")
            await test.step(`Open ${platform} and switch to ${language}`, async()=>{
                await app.website.open(platform)
                await app.website.checkTradeInstrument(`${type}`)
                await app.website.acceptAllCookies()
                await app.website.switchLanguageTo(language);
            })
            await test.step(`Check main button ${type} page`, async()=>{
                expect(await app.website.getBtnHeaderTextPay(await localization.getTranslation(btn1))).toBeVisible()
            })
        })}

    test(`Localization of main buttons - https://naga.com/eu. Spanish language`,
        {tag:['@naga.com','@web']}, async({app}, testInfo)=>{
        testInfo.setTimeout(testInfo.timeout + 80000);
        await test.step(`Open https://naga.com/eu  and switch to Español`, async()=>{
            await app.website.open('https://naga.com/eu')
            await app.website.acceptAllCookies()
            await app.website.switchLanguageTo('Español');
        })
        await test.step(`Check trade page buttons`, async()=>{
            await app.website.checkTradeInstrument(`trade`)
            expect(await app.website.getBtnHeaderText('Iniciar sesión')).toBeVisible()
        })
        await test.step(`Check invest page buttons`, async()=>{
            await app.website.checkTradeInstrument('invest')
            await app.website.checkAndCloseBullonPopup()
            expect(await app.website.getBtnHeaderText('Iniciar sesión')).toBeVisible()
        })})
})

test.describe('Website. Footer and header elements', async()=>{
    
    type footerTypes = {
        type: string;
    }
    const footer: footerTypes[] = [
        {type:'trade'},
        {type: 'invest'}
    ]
    for(const{ type } of footer){
        test(` naga.com/eu footer ->${type} page`, 
            {tag:['@naga.com','@web']}, async({app})=>{
            let localization = new getLocalization("/pageObjects/localization/Website_NagaCom.json")
            await test.step(`Open website https://naga.com/eu`, async()=>{
                await app.website.open('https://naga.com/eu')
                await app.website.checkTradeInstrument(type)
            })
            await test.step("Check naga.com/eu footer elements", async()=>{
                expect(await app.website.getText(await app.website.riskWarning_EU)).toEqual(await localization.getLocalizationText('EU_footer_RiskWarning_header'))
                expect(await app.website.getText(await app.website.riskWarning_EU_main)).toEqual(await localization.getLocalizationText('EU_footer_RiskWarning_main'))
            })})
    }
    
    const EuFooterCryptoParams: footerTypes[] = [
        {type: 'crypto'},
    ]
    for(const{ type} of EuFooterCryptoParams){
        test(` naga.com/eu footer ->${type} page`, {tag:['@naga.com','@web']}, async({app})=>{
            let localization = new getLocalization("/pageObjects/localization/Website_NagaCom.json")
            await test.step("Open website https://naga.com/eu", async()=>{
                await app.website.open('https://naga.com/eu')
                await app.website.checkTradeInstrument(type)
            })
            await test.step("Check naga.com/eu footer elements", async()=>{
                expect(await app.website.getText(await app.website.euCryptoAdressFooter)).toEqual(await localization.getLocalizationText('EU_cryptoFooter_address'))
                expect(await app.website.getText(await app.website.euCryptoRegulationFooter)).toEqual(await localization.getLocalizationText('EU_cryptoFooter_regulation'))
                expect(await app.website.getText(await app.website.euCryptoRiskNotification)).toEqual(await localization.getLocalizationText('EU_cryptoFooter_riskNotification'))
                expect(await app.website.getText(await app.website.euCryptoRestrictedCountries)).toEqual(await localization.getLocalizationText('EU_cryptoFooter_restrictedCountries'))
            })
        })}


    const EuFooterPayParams: footerTypes[] = [
        {type: 'pay'},
    ]
    for(const{type} of EuFooterPayParams){
        test(`naga.com/eu footer ->${type} page`, {tag:['@naga.com','@web']}, async({app})=>{
            let localization = new getLocalization("/pageObjects/localization/Website_NagaCom.json")
            await test.step("Open website https://naga.com/eu", async()=>{
                await app.website.open('https://naga.com/eu')
                await app.website.checkTradeInstrument(type)
            })
            await test.step("Check naga.com/eu footer elements", async()=>{
                expect(await app.website.getText(await app.website.euPayAddress)).toEqual(await localization.getLocalizationText('EU_payFooter_address'))
                expect(await app.website.getText(await app.website.euPayRegistrationNumber)).toEqual(await localization.getLocalizationText('EU_payFooter_registrationNumber'))
                expect(await app.website.getText(await app.website.euPayRiskNotification)).toEqual(await localization.getLocalizationText('EU_payFooter_riskNotification'))
            })
        })}

   
    const EnFooterParams: footerTypes[] = [
        {type: 'Trade'},
        {type: 'Invest'},
    ]
    for(const{ type}of EnFooterParams){
        test(` naga.com/en footer ->${type} page`, {tag:['@naga.com','@web']}, async({app})=>{
            let localization = new getLocalization("/pageObjects/localization/Website_NagaCom.json")
            await test.step("Open website naga.com/en", async()=>{
                await app.website.open('https://naga.com/en')
                await app.website.checkTradeInstrument(type)
            })
            await test.step("Check footer naga.com/en footer elemets", async()=>{
                expect(await app.website.getText(await app.website.riskWarning_EN)).toEqual(await localization.getLocalizationText("EN_footer_RiskWarning"))
                expect(await app.website.getText(await app.website.restrictedRegions_EN)).toEqual(await localization.getLocalizationText("EN_footer_RestrictedRegions"))
            })})
    }

    const ZA_FooterParams: footerTypes[] = [
        { type: 'Trade'},
    ]
    for(const{ type}of ZA_FooterParams){
        test(`naga.com/za footer ->${type} page`, {tag:['@naga.com','@web']}, async({app})=>{
            let localization = new getLocalization("/pageObjects/localization/Website_NagaCom.json")
            await test.step("Open website naga.com/za", async()=>{
                await app.website.open('https://naga.com/za')
            })
            await test.step("Check footer naga.com/en footer elemets", async()=>{
                expect(await app.website.getText(await app.website.zaRiskWarning)).toEqual(await localization.getLocalizationText("ZA_RiskWarning"))
                expect(await app.website.getText(await app.website.zaRegualtion)).toEqual(await localization.getLocalizationText("ZA_Regulation"))
            })})
    }

    const AE_FooterParams: footerTypes[] = [
        {type: "Trade"},
        {type: 'Invest'}
    ]
    for(const{ type}of AE_FooterParams){
        test(` naga.com/ae footer ->${type} page`, {tag:['@naga.com','@web']}, async({app})=>{
            let localization = new getLocalization("/pageObjects/localization/Website_NagaCom.json")
            await test.step("Open website naga.com/ae", async()=>{
                await app.website.open('https://naga.com/ae')
            })
            await test.step("Check footer naga.com/en footer elemets", async()=>{
                expect(await app.website.getText(await app.website.aeFooterRiskWarning)).toEqual(await localization.getLocalizationText("AE_RiskWarning"))
                expect(await app.website.getText(await app.website.aeFooterDisclaimer)).toEqual(await localization.getLocalizationText("AE_Disclaimer"))
            })})
    }    

    type footerTypeEU = {
        type: string,
        baseUrl: string,
        page1: string,
        page2: string,
        page3: string,
    }
    const EuRiskWarningFooter: footerTypeEU[] = [
        {type: 'trade', baseUrl:'https://naga.com/eu', page1:"Shares", page2:"Contact us", page3:'Daily hot news'},
        {type: 'invest', baseUrl:'https://naga.com/eu', page1:'Fees', page2:'IPO', page3:'Privacy Policy'}
    ]
    for(const{type, baseUrl,page1, page2, page3}of EuRiskWarningFooter){
        test(` ${baseUrl} ->Risk Warning footer /${type} page`, {tag:['@naga.com','@web']}, async({app})=>{
            let localization = new getLocalization("/pageObjects/localization/Website_NagaCom.json")
            await test.step(`Open website ${baseUrl}`, async()=>{
                await app.website.open(`${baseUrl}`)
                await app.website.checkTradeInstrument(type)
                await app.website.acceptAllCookies()
            })
            await test.step('Check risk warning footer', async()=>{
                expect(await app.website.getRiskWarningFooter()).toEqual(await localization.getLocalizationText("EU_riskWarning_footer"))
            })
            await test.step(`Check footer on ${page1} page`, async()=>{
                await app.website.openFooterCategory(`${page1}`)
                expect(await app.website.getRiskWarningFooter()).toEqual(await localization.getLocalizationText("EU_riskWarning_footer"))
            })
            await test.step(`Check footer on ${page2} page`, async()=>{
                await app.website.openFooterCategory(`${page2}`)
                expect(await app.website.getRiskWarningFooter()).toEqual(await localization.getLocalizationText("EU_riskWarning_footer"))
            })})
    }

    type socialNetworksZA = {
        regulation: string;
        networks: Map<string, string>;
    }
    const socialParamsZA: socialNetworksZA[] = [
        { regulation:'eu', networks: new Map<string, string>([['facebook','https://www.facebook.com/nagamarketsofficial'],['instagram','https://www.instagram.com/nagaeuofficial/'],['youtube','https://www.youtube.com/@NAGAEurope'],['linkedin','https://www.linkedin.com/company/nagainvesting/posts/?feedView=all']])},
        { regulation:'en', networks: new Map<string, string>([['facebook','https://www.facebook.com/nagacapitalofficial'],['instagram','https://www.instagram.com/nagacomofficial'],['youtube','http://www.youtube.com/@NAGAinvesting'],['twitter','https://x.com/nagacapitalcom']])},
        { regulation:'za', networks: new Map<string, string>([['facebook', 'https://www.facebook.com/NAGA.S.Africa'], ['instagram', 'https://www.instagram.com/naga.s.africa']])},
        { regulation:'ae', networks: new Map<string, string>([['youtube', 'https://www.youtube.com/@nagamena'], ['facebook', 'https://www.facebook.com/NAGA.ADGM'],['instagram', 'https://www.instagram.com/naga_adgm/'],['tiktok','https://www.tiktok.com/@naga_mena'],['linkedin','https://www.linkedin.com/company/naga-mena/']])},
    ]
    for(const{ regulation, networks}of socialParamsZA){
        test(` Social networks. ${regulation} regulation`,{tag:['@naga.com','@web','@mobile']},async({app}, testInfo)=>{
            await testInfo.setTimeout(testInfo.timeout + 40000);
            await test.step(`Open naga.com/${regulation}`, async()=>{
                await app.website.open(`https://naga.com/${regulation}`)
            })
            await test.step('Check icons of social networks', async()=>{
                for(const[icon, url] of networks){
                    expect(await app.website.getSocialNetworkHref(icon)).toEqual(url)
                }
            })})
    }

    type headerTypes = {
        type: string;
        page1: string;
        page2: string;
        page3: string;
    }
    const headerParams: headerTypes[] = [
        {type:'Trade', page1:'Execution policy', page2:'Contact us', page3:'Daily hot news'},
        {type:'Invest', page1:'Futures', page2:'Economic Calendar', page3:'Partnerships'}
    ]
    for(const{type, page1, page2, page3}of headerParams){
        test(`@25234 Header disclaimer on ${type} page`,{tag:['@naga.com','@web']}, async({app}, testInfo)=>{
            await testInfo.setTimeout(testInfo.timeout + 10000);
            let localization = new getLocalization("/pageObjects/localization/Website_NagaCom.json")
            await test.step('Open naga.com/ae and check header discleimer', async()=>{
                await app.website.open('https://naga.com/ae');
                await app.website.acceptAllCookies();
                await app.website.checkTradeInstrument(type);
                expect(await app.website.getText(await app.website.aeHeaderDisclaimer)).toEqual(await localization.getLocalizationText('AE_HeaderDisclaimer'))
            })
            await test.step(`Check header on ${page1} page`, async()=>{
                await app.website.openFooterCategory(`${page1}`)
                expect(await app.website.getText(await app.website.aeHeaderDisclaimer)).toEqual(await localization.getLocalizationText('AE_HeaderDisclaimer'))
            })
            await test.step(`Check header on ${page2} page`, async()=>{
                await app.website.openFooterCategory(`${page2}`)
                expect(await app.website.getText(await app.website.aeHeaderDisclaimer)).toEqual(await localization.getLocalizationText('AE_HeaderDisclaimer'))
            })})}
        })

    test.describe('Website. Landing pages', async()=>{

        type mainPage = {
            regulation: string;
            landingPages: string[];
            type: string;
        }
        const mainPageParams: mainPage[] = [
            { regulation:'en', type:'Trade', landingPages:['trading', 'social', 'bvb', 'money']},
            { regulation:'en', type:'Invest', landingPages:['trading', 'social', 'money']},
            { regulation:'eu', type:'trade', landingPages:['trading', 'social', 'bvb', 'earn']},
            { regulation:'eu', type:'invest', landingPages:['trading', 'social', 'money']},
            { regulation:'eu', type:'crypto', landingPages:['trading', 'social', 'money']},
            { regulation:'za', type:'Trade', landingPages:['trading', 'bvb', 'money']},
            { regulation:'ae', type:'Trade', landingPages:['trading', 'social', 'bvb', 'money']},
            { regulation:'ae', type:'Invest', landingPages:['trading', 'social', 'money']},
        ]
        for(const{ regulation, type, landingPages}of mainPageParams){
            test(` Landing pages on ${regulation}/ ${type}`, {tag: ['@naga.com','@web']},async({app}, testInfo)=>{
                testInfo.setTimeout(testInfo.timeout + 30000);
                let localization = new getLocalization('/pageObjects/localization/Website_Naga.com_landingPages.json')
                await test.step(`Open naga.com/${regulation} ->${type} page`, async()=>{
                    await app.website.open(`https://naga.com/${regulation}`)
                    await app.website.checkTradeInstrument(type)
                })
                await test.step(`Check visible langing pages`, async()=>{
                    for(let index in landingPages){
                        await app.website.checkAndCloseBullonPopup()
                        const[mainCardName, btnLink] = await app.website.openLandingPageTab(landingPages[index])
                        expect(mainCardName).toEqual(await localization.getLandingPage(regulation, type, landingPages[index], 'title'))
                        expect(btnLink).toContain(await localization.getLandingPage(regulation, type, landingPages[index], 'btnRedirect'))
                    }})})
        }

        const mainPageLandings: mainPage[] = [
            { regulation:'eu', type:'pay', landingPages:['trading', 'social', 'money']}
        ]
        for(const{ regulation, type, landingPages}of mainPageLandings){
            test(`Landing page on ${type} page`,{tag: ['@naga.com','@web']},async({app})=>{
            let localization = new getLocalization('/pageObjects/localization/Website_Naga.com_landingPages.json')
            await test.step(`Open naga.com/${regulation}=>${type} page`, async()=>{
                await app.website.open(`https://naga.com/${regulation}`)
                await app.website.checkTradeInstrument('pay')
            })
            await test.step('Check text and name of the btn', async()=>{
                for(let index in landingPages){
                    const[mainCardName, btnName] = await app.website.openLandingPagesOnPay(landingPages[index])
                    expect(mainCardName).toEqual(await localization.getLandingPage(regulation, type, landingPages[index], 'title'))
                    expect(btnName).toContain(await localization.getLandingPage(regulation, type, landingPages[index], 'btnRedirect'))
                }})})
    }

    type tabTypes = {
        regulation: string,
        tabsName: string[],
    }
    const tabParams: tabTypes[] = [
        { regulation:'eu', tabsName:['CFDs on Forex','Crypto CFDs','CFDs on Indices','CFDs on Stocks','Real Stocks','CFDs on Commodities', 'CFDs on Futures','CFDs on ETFs']},
        { regulation:'en', tabsName:['Forex','Crypto','Indices','Stock CFDs','Real Stocks','Commodities', 'Futures','ETFs']},
        { regulation:'ae', tabsName:['Forex','Indices','Stock CFDs','Real Stocks','Commodities', 'Futures','ETFs']},
        { regulation:'za', tabsName:['Forex','Crypto','Indices','Stock CFDs','Commodities', 'Futures','ETFs']}
    ]
    for(const{ regulation, tabsName}of tabParams){
        test(`Check Pricing and Markets hours page.${regulation}`,{tag:['@naga.com','@web']}, async({app},testInfo)=>{
            testInfo.setTimeout(testInfo.timeout + 70000);
            await test.step(`Open website naga.com/${regulation}`, async()=>{
                await app.website.open(`https://naga.com/${regulation}/trading/hours-and-fees`)
            })
            await test.step('Check that value inside tabs are not empty', async()=>{
                await app.website.acceptAllCookies()
                for(let index in tabsName){
                    await app.website.scrollToMarketsAndTradingFees()
                    await app.website.openMarketAndHoursTab(tabsName[index])
                    let allInstruments = await app.website.getAllAvailableInstruments()
                    for(let index in allInstruments){
                        expect(await app.website.getTableData(allInstruments[index], '2')).not.toBeNull()
                        expect(await app.website.getTableData(allInstruments[index], '3')).not.toBeNull()
                        expect(await app.website.getTableData(allInstruments[index], '4')).not.toBeNull()
                        expect(await app.website.getTableData(allInstruments[index], '6')).not.toBeNull()
                    }}}
            )})}
        
    type pagesNumber = {
        type: string,
        regulation: string,
        numberOfLandingPages: number
    }
    const pageNumberParams: pagesNumber[] = [
        { regulation:'en', type:'Trade',  numberOfLandingPages: 4},
        { regulation:'en', type:'Invest', numberOfLandingPages: 3},
        { regulation:'eu', type:'trade', numberOfLandingPages: 4},
        { regulation:'eu', type:'invest', numberOfLandingPages: 3},
        { regulation:'eu', type:'crypto', numberOfLandingPages: 3},
        { regulation:'eu', type:'pay', numberOfLandingPages: 3},
        { regulation:'za', type:'Trade', numberOfLandingPages: 3},
        { regulation:'ae', type:'Trade', numberOfLandingPages: 4},
        { regulation:'ae', type:'Invest', numberOfLandingPages: 3}
    ]
    for(const{regulation, type, numberOfLandingPages} of pageNumberParams){
        test.skip(`Check number of langing pages on website/${regulation}/${type}`, 
            {tag:['@web', '@naga.com']}, async({app})=>{
        await test.step(`Open naga.com/${regulation} ->${type} page`, async()=>{
            await app.website.open(`https://naga.com/${regulation}`)
            await app.website.checkTradeInstrument(type)
        })
        await test.step('Check number of displayed landing pages', async()=>{
            expect(await app.website.getNumberOfLandingPages()).toEqual(numberOfLandingPages)
        })
    })}
})