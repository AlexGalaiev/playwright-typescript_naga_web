import { expect } from "@playwright/test";
import { NagaCom } from "../../pageObjects/Website/NagaCom";
import { test } from "../../test-options";
import { getLocalization } from "../../pageObjects/localization/getText";

test.describe('Mobile website', async()=>{

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

    for(const{type, buttonName, redirectTo, baseUrl }of fromWebsiteToNM){
        test(`Mobile. Redirect with VPN (Italy) from ${baseUrl} / ${type} to ${redirectTo}.->Click ${buttonName} button`, 
            {tag: ['@naga.com','@mobile']}, async({appIT},testInfo)=>{
            testInfo.setTimeout(testInfo.timeout + 25000)
            await test.step(`Open website ${baseUrl}`, async()=>{
                await appIT.website.open(`${baseUrl}`)
                await appIT.website.openMobileMenu(0)
            })
            await test.step(`Choose ${type} page. Click ${buttonName} btn`, async()=>{
                await appIT.website.acceptAllCookies()
                await appIT.website.checkMobileTradeInstrument(`${type}`,1)
                await appIT.website.acceptAllCookies()
                await appIT.website.checkAndCloseBullonPopup()
                await appIT.website.openMobileMenu(0)
                await appIT.website.clickMobileBtn(`${buttonName}`,1)
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
        test(`Mobile. Redirect with VPN (UAE) from ${baseUrl} / ${type} to ${redirectTo}.->Click ${buttonName} button`, 
            {tag: ['@naga.com','@mobile']}, async({appUAE},testInfo)=>{
            testInfo.setTimeout(testInfo.timeout + 25000)
            await test.step(`Open website ${baseUrl}`, async()=>{
                await appUAE.website.open(`${baseUrl}`)
                await appUAE.website.openMobileMenu(0)
            })
            await test.step(`Choose ${type} page. Click ${buttonName} btn`, async()=>{
                await appUAE.website.checkMobileTradeInstrument(`${type}`,1)
                await appUAE.website.openMobileMenu(0)
                await appUAE.website.acceptAllCookies()
                await appUAE.website.clickMobileBtn(`${buttonName}`,1)
                expect(await appUAE.website.checkUrl()).toContain(`${redirectTo}`)
            })
        })
    }
    const fromWebsiteToNAfrica: RedirectTypes[] = [
        {type: 'Trade', buttonName: 'Login', baseUrl: 'https://naga.com/za', redirectTo: 'https://app.naga.com/login?lang=en'},
        {type: 'Trade', buttonName: 'Get started', baseUrl: 'https://naga.com/za', redirectTo: 'https://app.naga.com/register?lang=en'},
    ]

    for(const{type, buttonName, redirectTo, baseUrl }of fromWebsiteToNAfrica){
        test(`Mobile. Redirect with VPN (ZA) from ${baseUrl} / ${type} to ${redirectTo}.->Click ${buttonName} button`, 
            {tag: ['@mobile', '@naga.com']}, async({appSA},testInfo)=>{
            testInfo.setTimeout(testInfo.timeout + 15000)
            await test.step(`Open website ${baseUrl}`, async()=>{
                await appSA.website.open(`${baseUrl}`)
                await appSA.website.openMobileMenu(2)
            })
            await test.step(`Choose ${type} page. Click ${buttonName} btn`, async()=>{
                await appSA.website.checkMobileTradeInstrument(`${type}`,2)
                await appSA.website.openMobileMenu(2)
                await appSA.website.acceptAllCookies()
                await appSA.website.clickMobileBtn(`${buttonName}`,2)
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
    test(`Mobile Redirect with VPN (Ukraine) from ${baseUrl} /${type} to ${redirectTo}. -> Click ${buttonName} button`, 
        {tag: ['@naga.com','@mobile']}, async({appUA}, testInfo)=>{
        testInfo.setTimeout(testInfo.timeout + 10000)
        await test.step(`Open website ${baseUrl}`, async()=>{
            await appUA.website.open(`${baseUrl}`)
            await appUA.website.openMobileMenu(0)
        })
        await test.step(`Choose ${type} page. Click ${buttonName} btn`, async()=>{
            await appUA.website.checkMobileTradeInstrument(`${type}`,1)
            await appUA.website.openMobileMenu(0)
            await appUA.website.acceptAllCookies()
            await appUA.website.clickMobileBtn(`${buttonName}`,1)
            expect(await appUA.website.checkUrl()).toContain(`${redirectTo}`)
        })})
    }
    
    const fromENtoNMAllert: RedirectTypes[] = [
        {type: 'Trade', buttonName: 'Get started', baseUrl:'https://naga.com/en', redirectTo: 'https://app.naga.com/register'},
        {type: 'Invest', buttonName: 'Get started', baseUrl:'https://naga.com/en',  redirectTo: 'https://app.naga.com/register'},
    ]

    for(const{type, buttonName, redirectTo, baseUrl}of fromENtoNMAllert){
    test(`Mobile.Redirect with VPN (Italy) from ${baseUrl} /${type} to ${redirectTo}. Check allert popup`, 
        {tag: ['@naga.com','@mobile']}, 
        async({appIT}, testInfo)=>{
        testInfo.setTimeout(testInfo.timeout + 50000);
        let localization = new getLocalization('/pageObjects/localization/Website_NagaCom.json')
        await test.step(`Open website ${baseUrl}`, async()=>{
            await appIT.website.open(`${baseUrl}`)
            await appIT.website.openMobileMenu(0)
        })
        await test.step(`Choose ${type} page. Click ${buttonName} btn`, async()=>{
            await appIT.website.checkMobileTradeInstrument(`${type}`,1)
            await appIT.website.acceptAllCookies()
            await appIT.website.checkAndCloseBullonPopup()
            await appIT.website.openMobileMenu(0)
            await appIT.website.clickMobileBtn(`${buttonName}`,1)
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
        test(` Mobile VPN(Ukraine) Redirect from ${basePage}/${type} to platform. Search ${nameOfInstrument} instrument `, 
            {tag:['@naga.com','@mobile']}, async({appUA}, testInfo)=>{
            testInfo.setTimeout(testInfo.timeout + 30000)
            await test.step(`Open website ${basePage}. Check ${type} page`,async()=>{
                await appUA.website.open(basePage)
                await appUA.website.openMobileMenu(0)
                await appUA.website.checkMobileTradeInstrument(`${type}`,1)
                await appUA.website.acceptAllCookies()
                await appUA.website.checkAndCloseBullonPopup()
            })
            await test.step(`Search instrument ${nameOfInstrument}. Redirect to ${redirectTo} platform`, async()=>{
                await appUA.website.searchMobileInstrument(nameOfInstrument);
                const[newPage, instrumentName] = await appUA.website.openMobilePosition()
                let newWebsite = new NagaCom(newPage)
                expect(await newWebsite.checkUrl()).toContain(`${redirectTo}`)
            })})
    }
    const AESearchTypes: searchTypes[] = [
        {type: 'Trade', nameOfInstrument: "SIEMENS", redirectTo: 'https://app.naga.com/open-trade', basePage:'https://naga.com/ae', buttonName:'Trade'},
        {type: 'Invest', nameOfInstrument: "SIEMENS", redirectTo: 'https://app.naga.com/open-trade', basePage:'https://naga.com/ae', buttonName:'Invest'}
   ]

    for(const{type, nameOfInstrument, redirectTo,basePage,buttonName}of AESearchTypes){
        test(`Mobile VPN(UAE) Redirect from ${basePage}/${type} to platform. Search ${nameOfInstrument} instrument `, 
            {tag:['@naga.com','@mobile']}, async({appUAE}, testInfo)=>{
            testInfo.setTimeout(testInfo.timeout + 30000)
            await test.step(`Open website ${basePage}. Check ${type} page`,async()=>{
                await appUAE.website.open(basePage)
                await appUAE.website.openMobileMenu(0)
                await appUAE.website.checkMobileTradeInstrument(`${type}`,1)
                await appUAE.website.acceptAllCookies()
                await appUAE.website.checkAndCloseBullonPopup()
            })
            await test.step(`Search instrument ${nameOfInstrument}. Redirect to ${redirectTo} platform`, async()=>{
                await appUAE.website.searchMobileInstrument(nameOfInstrument);
                const[newPage, instrumentName] = await appUAE.website.openMobilePosition()
                let newWebsite = new NagaCom(newPage)
                expect(await newWebsite.checkUrl()).toContain(`${redirectTo}`)
            })
        })
    }

    const ZASearchTypes: searchTypes[] = [
        {type: 'Trade', nameOfInstrument: "FACEBOOK", redirectTo: "https://app.naga.com/open-trade", basePage:"https://naga.com/za", buttonName:'Trade'}
   ]

    for(const{type, nameOfInstrument, redirectTo,basePage,buttonName}of ZASearchTypes){
    test(`Mobile. VPN(ZA) Redirect from ${basePage}/${type} to platform. Search ${nameOfInstrument} instrument `, 
        {tag:['@naga.com','@mobile']}, async({appSA}, testInfo)=>{
        testInfo.setTimeout(testInfo.timeout + 20000)
        await test.step(`Open website ${basePage}. Check ${type} page`,async()=>{
            await appSA.website.open(basePage)
            await appSA.website.openMobileMenu(2)
            await appSA.website.checkMobileTradeInstrument(`${type}`,2)
            await appSA.website.acceptAllCookies()
            await appSA.website.checkAndCloseBullonPopup()
        })
        await test.step(`Search instrument ${nameOfInstrument}. Redirect to ${redirectTo} platform`, async()=>{
            await appSA.website.searchMobileInstrument(nameOfInstrument);
            const[newPage, instrumentName] = await appSA.website.openMobilePosition()
            let newWebsite = new NagaCom(newPage)
            expect(await newWebsite.checkUrl()).toContain(`${redirectTo}`)
        })
    })
    }

    const EnSearchTypes: searchTypes[] = [
        { type: 'Trade', nameOfInstrument: "FACEBOOK", redirectTo: "https://app.naga.com/open-trade", basePage:"https://naga.com/en", buttonName:'Trade'},
        { type: 'Invest', nameOfInstrument: "FACEBOOK", redirectTo: "https://app.naga.com/open-trade", basePage:"https://naga.com/en", buttonName: 'Invest'},
    ]
    for(const{ type, nameOfInstrument, redirectTo,basePage,buttonName}of EnSearchTypes){
        test(` Mobile VPN(Italy). Redirect from ${basePage}/${type} to platfotm. Search ${nameOfInstrument} on page`, 
            {tag: ['@naga.com','@mobile']}, async({appIT}, testInfo)=>{
            testInfo.setTimeout(testInfo.timeout + 10000)
            await test.step(`Open website ${basePage}. Check instrument ${type}`,async()=>{
                await appIT.website.open(basePage)
                await appIT.website.openMobileMenu(0)
                await appIT.website.checkMobileTradeInstrument(`${type}`,1)
                await appIT.website.acceptAllCookies()
                await appIT.website.checkAndCloseBullonPopup()
            })
            await test.step(`Search instrument ${nameOfInstrument}. Redirect to platform`, async()=>{
                await appIT.website.searchMobileInstrument(nameOfInstrument);
                const[newPage, instrumentName] = await appIT.website.openMobilePosition()
                let newWebsite = new NagaCom(newPage)
                expect(await newWebsite.checkUrl()).toContain(`${redirectTo}`)
            })}
        )}
})

test.describe('Mobile. Languages and translations', async()=>{
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
    for(const{regulation, languages,numberOfLanguages}of languageParameters){
        test(`Mobile Check available languages on ${regulation}`,
            {tag: ['@naga.com','@mobile']}, async({app})=>{
            await test.step(`Open naga.com/${regulation} website`, async()=>{
                await app.website.open(`https://naga.com/${regulation}`)
            })
            await test.step('Check visible language', async()=>{
                await app.website.openMobileLanguages(1)
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
        { tradeType: 'trade', investType: 'invest', platform: "https://naga.com/eu", language:'English (Europe)', btn1:'LoginBtn.eng', btn2:"GetStarted.eng", btn3:"Discover more.eng", btn4:"Start trading.eng"},
        { tradeType: 'trade', investType: 'invest', platform: "https://naga.com/eu", language:'Deutsch', btn1:'LoginBtn.de', btn2:"GetStarted.de", btn3:"Discover more.de", btn4:"Start trading.de"},
        { tradeType: 'trade', investType: 'invest', platform: "https://naga.com/eu", language:'Italiano', btn1:'LoginBtn.it', btn2:"GetStarted.it", btn3:"Discover more.it", btn4:"Start trading.it"},
        { tradeType: 'trade', investType: 'invest', platform: "https://naga.com/eu", language:'Español', btn1:'LoginBtn.es', btn2:"GetStarted.es", btn3:"Discover more.es", btn4:"Start trading.es"},
        { tradeType: 'trade', investType: 'invest', platform: "https://naga.com/eu", language:'Polski', btn1:'LoginBtn.pl', btn2:"GetStarted.pl", btn3:"Discover more.pl", btn4:"Start trading.pl"},
        { tradeType: 'trade', investType: 'invest', platform: "https://naga.com/eu", language:'Čeština', btn1:'LoginBtn.cz', btn2:"GetStarted.cz", btn3:"Discover more.cz", btn4:"Start trading.cz"},
        { tradeType: 'trade', investType: 'invest', platform: "https://naga.com/eu", language:'Nederlands', btn1:'LoginBtn.ne', btn2:"GetStarted.ne", btn3:"Discover more.ne", btn4:"Start trading.ne"},
        { tradeType: 'trade', investType: 'invest', platform: "https://naga.com/eu", language:'Português', btn1:'LoginBtn.po', btn2:"GetStarted.po", btn3:"Discover more.po", btn4:"Start trading.po"},
        { tradeType: 'trade', investType: 'invest', platform: "https://naga.com/eu", language:'Română', btn1:'LoginBtn.ro', btn2:"GetStarted.ro", btn3:"Discover more.ro", btn4:"Start trading.ro"},
        { tradeType: 'Trade', investType: 'Invest', platform: "https://naga.com/en", language:'Español (Latam)', btn1:'LoginBtn.lat', btn2:"GetStarted.lat", btn3:"Discover more.lat", btn4:"Start trading.lat"},
        { tradeType: 'Trade', investType: 'Invest', platform: "https://naga.com/en", language:'Português', btn1:'LoginBtn.por', btn2:"GetStarted.por", btn3:"Discover more.por", btn4:"Start trading.por"},
        { tradeType: 'Trade', investType: 'Invest', platform: "https://naga.com/en", language:'العربية', btn1:'LoginBtn.ar', btn2:"GetStarted.ar", btn3:"Discover more.ar", btn4:"Start trading.ar"},
        { tradeType: 'Trade', investType: 'Invest', platform: "https://naga.com/en", language:'Bahasa Indonesia', btn1:'LoginBtn.ind', btn2:"GetStarted.ind", btn3:"Discover more.ind", btn4:"Start trading.ind"},
        { tradeType: 'Trade', investType: 'Invest', platform: "https://naga.com/en", language:'简化字', btn1:'LoginBtn.chi', btn2:"GetStarted.chi", btn3:"Discover more.chi", btn4:"Start trading.chi"},
        { tradeType: 'Trade', investType: 'Invest', platform: "https://naga.com/en", language:'繁體中文', btn1:'LoginBtn.chiGlobal', btn2:"GetStarted.chiGlobal", btn3:"Discover more.chiGlobal", btn4:"Start trading.chiGlobal"},
        { tradeType: 'Trade', investType: 'Invest', platform: "https://naga.com/en", language:'ภาษาไทย', btn1:'LoginBtn.thai', btn2:"GetStarted.thai", btn3:"Discover more.thai", btn4:"Start trading.thai"},
        { tradeType: 'Trade', investType: 'Invest', platform: "https://naga.com/ae", language:'العربية', btn1:'LoginBtn.ar', btn2:"GetStarted.ar", btn3:"Discover more.ar", btn4:"Start trading.ar"},
    ]

    for(const{platform,language,btn1,btn2,btn3,btn4,tradeType,investType}of translationParams){
    test(` Mobile Localization of main buttons-${platform}. ${language} language`,
        {tag:['@naga.com','@mobile']}, async({app}, testInfo)=>{
        testInfo.setTimeout(testInfo.timeout + 80000);
        let localization = new getLocalization("/pageObjects/localization/Website_Naga.com_translations.json")
        await test.step(`Open ${platform} and switch to ${language}`, async()=>{
            await app.website.open(platform)
            await app.website.switchMobileLanguageTo(language)
            await app.website.acceptAllCookies()
            await app.website.openMobileMenu(0)
            await app.website.checkAndCloseBullonPopup()
        })
        await test.step(`Check ${tradeType} page buttons`, async()=>{
            expect(await app.website.getMobileBtnText(await localization.getTranslation(btn1))).toBeVisible()
            expect(await app.website.getMobileBtnText(await localization.getTranslation(btn2))).toBeVisible()
        })
        await test.step(`Check ${investType} page buttons`, async()=>{
            await app.website.checkMobileTradeInstrument(`${investType}`,1)
            await app.website.openMobileMenu(0)
            await app.website.acceptAllCookies()
            expect(await app.website.getMobileBtnText(await localization.getTranslation(btn1))).toBeVisible()
            expect(await app.website.getMobileBtnText(await localization.getTranslation(btn2))).toBeVisible()
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
        { platform: 'https://naga.com/eu', type: 'crypto', language:'English', btn1: 'LoginBtn.eng', btn2: 'GetStarted.eng'},
        { platform: 'https://naga.com/eu', type: 'crypto', language:'Deutsch', btn1: 'LoginBtn.de', btn2: 'GetStarted.de'},
        { platform: 'https://naga.com/eu', type: 'crypto', language:'Español', btn1: 'LoginBtn.es', btn2: 'GetStarted.es'},
        { platform: 'https://naga.com/eu', type: 'crypto', language:'Italiano', btn1: 'LoginBtn.it', btn2: 'Get started Crypto.it'},
        { platform: 'https://naga.com/eu', type: 'crypto', language:'Polski', btn1: 'LoginBtn.pl', btn2: 'Get started Crypto.pl'},
    ]
    for(const{platform, language, type, btn1, btn2}of cryptoParams){
    test(` Mobile Localization of main buttons, Language-${language} on ${platform}, ${type}`,
        {tag: ['@naga.com','@mobile']}, async({app}, testInfo)=>{
        testInfo.setTimeout(testInfo.timeout + 30000);
        let localization = new getLocalization("/pageObjects/localization/Website_Naga.com_translations.json")
        await test.step(`Open ${platform} ans switch to ${language}`, async()=>{
            await app.website.open(platform)
            await app.website.openMobileMenu(0)
            await app.website.checkMobileTradeInstrument(type, 1)
            await app.website.switchMobileLanguageTo(language)
            await app.website.acceptAllCookies()
            await app.website.openMobileMenu(0)
            await app.website.checkAndCloseBullonPopup()
        })
        await test.step(`Check main button ${type} page`, async()=>{
            expect(await app.website.getMobileBtnText(await localization.getTranslation(btn1))).toBeVisible()
            expect(await app.website.getMobileBtnText(await localization.getTranslation(btn2))).toBeVisible()
        })})
    }

    type payTranslations = {
        platform: string,
        type: string,
        language: string,
        btn1: string
    }
    const payTranslationsParams: payTranslations[] = [
        { platform: 'https://naga.com/eu', type:'pay', language:'English (Europe)', btn1:"Get your card.eng"},
        { platform: 'https://naga.com/eu', type:'pay', language:'Deutsch', btn1:"Get your card.de"},
        { platform: 'https://naga.com/eu', type:'pay', language:'Italiano', btn1:"Get your card.it"},
        { platform: 'https://naga.com/eu', type:'pay', language:'Español', btn1:"Get your card.es"},
        { platform: 'https://naga.com/eu', type:'pay', language:'Polski', btn1:"Get your card.pl"},
        { platform: 'https://naga.com/eu', type:'pay', language:'Čeština', btn1:"Get your card.cz"},
        { platform: 'https://naga.com/eu', type:'pay', language:'Português', btn1:"Get your card.po"},
    ]

    for(const{ platform, language, btn1,type}of payTranslationsParams){
        test(` Mobile. Localization of main buttons, Language-${language} on ${platform}, Pay page`,
            {tag:['@naga.com','@mobile']}, async({app}, testInfo)=>{
            testInfo.setTimeout(testInfo.timeout + 30000);
            let localization = new getLocalization("/pageObjects/localization/Website_Naga.com_translations.json")
            await test.step(`Open ${platform} ans switch to ${language}`, async()=>{
                await app.website.open(platform)
                await app.website.openMobileMenu(0)
                await app.website.checkMobileTradeInstrument(type, 1)
                await app.website.switchMobileLanguageTo(language)
                await app.website.acceptAllCookies()
                await app.website.openMobileMenu(0)
                await app.website.checkAndCloseBullonPopup()
            })
            await test.step(`Check main button ${type} page`, async()=>{
                expect(await app.website.getMobileBtnTextPay(await localization.getTranslation(btn1))).toBeVisible()
            })
        })}

    type footerTypes = {
        type: string;
    }
    const footer: footerTypes[] = [
        {type:'trade'},
        {type: 'invest'}
    ]
    for(const{type } of footer){
        test(`Mobile naga.com/eu footer ->${type} page`, 
            {tag:['@naga.com','@mobile']}, async({app})=>{
            let localization = new getLocalization("/pageObjects/localization/Website_NagaCom.json")
            await test.step(`Open website https://naga.com/eu`, async()=>{
                await app.website.open('https://naga.com/eu')
                await app.website.openMobileMenu(0)
                await app.website.checkMobileTradeInstrument(type, 1)
                await app.website.acceptAllCookies()
                await app.website.checkAndCloseBullonPopup()
            })
            await test.step("Check naga.com/eu footer elements", async()=>{
                expect(await app.website.getText(await app.website.riskWarning_EU)).toEqual(await localization.getLocalizationText('EU_footer_RiskWarning_header'))
                expect(await app.website.getText(await app.website.riskWarning_EU_main)).toEqual(await localization.getLocalizationText('EU_footer_RiskWarning_main'))
            })})
    }
    const EuFooterCryptoParams: footerTypes[] = [
        {type: 'crypto'},
    ]

    for(const{type} of EuFooterCryptoParams){
        test(` Mobile naga.com/eu footer ->${type} page`, {tag:['@naga.com','@mobile']}, async({app})=>{
            let localization = new getLocalization("/pageObjects/localization/Website_NagaCom.json")
            await test.step("Open website https://naga.com/eu", async()=>{
                await app.website.open('https://naga.com/eu')
                await app.website.openMobileMenu(0)
                await app.website.checkMobileTradeInstrument(type, 1)
                await app.website.acceptAllCookies()
                await app.website.checkAndCloseBullonPopup()
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
        test(` Mobile naga.com/eu footer ->${type} page`, {tag:['@naga.com','@mobile']}, async({app})=>{
            let localization = new getLocalization("/pageObjects/localization/Website_NagaCom.json")
            await test.step("Open website https://naga.com/eu", async()=>{
                await app.website.open('https://naga.com/eu')
                await app.website.openMobileMenu(0)
                await app.website.checkMobileTradeInstrument(type, 1)
                await app.website.acceptAllCookies()
                await app.website.checkAndCloseBullonPopup()
            })
            await test.step("Check naga.com/eu footer elements", async()=>{
                expect(await app.website.getText(await app.website.euPayAddress)).toEqual(await localization.getLocalizationText('EU_payFooter_address'))
                expect(await app.website.getText(await app.website.euPayRegistrationNumber)).toEqual(await localization.getLocalizationText('EU_payFooter_registrationNumber'))
                expect(await app.website.getText(await app.website.euPayRiskNotification)).toEqual(await localization.getLocalizationText('EU_payFooter_riskNotification'))
            })
        })}
    const EnFooterParams: footerTypes[] = [
        { type: 'Trade'},
        { type: 'Invest'},
    ]

    for(const{ type}of EnFooterParams){
        test(` Mobile naga.com/en footer ->${type} page`, {tag:['@naga.com','@mobile']}, async({app})=>{
            let localization = new getLocalization("/pageObjects/localization/Website_NagaCom.json")
            await test.step("Open website naga.com/en", async()=>{
                await app.website.open('https://naga.com/en')
                await app.website.openMobileMenu(0)
                await app.website.checkMobileTradeInstrument(type, 1)
                await app.website.acceptAllCookies()
                await app.website.checkAndCloseBullonPopup()
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
        test(` Mobile naga.com/za footer ->${type} page`, {tag:['@naga.com','@mobile']}, async({app})=>{
            let localization = new getLocalization("/pageObjects/localization/Website_NagaCom.json")
            await test.step("Open website naga.com/za", async()=>{
                await app.website.open('https://naga.com/za')
                await app.website.acceptAllCookies()
                await app.website.checkAndCloseBullonPopup()
            })
            await test.step("Check footer naga.com/en footer elemets", async()=>{
                expect(await app.website.getText(await app.website.zaRiskWarning)).toEqual(await localization.getLocalizationText("ZA_RiskWarning"))
                expect(await app.website.getText(await app.website.zaRegualtion)).toEqual(await localization.getLocalizationText("ZA_Regulation"))
            })})
    }

    const AE_FooterParams: footerTypes[] = [
        { type: "Trade"},
        { type: 'Invest'}
    ]

    for(const{ type}of AE_FooterParams){
        test(` Mobile naga.com/ae footer ->${type} page`, {tag:['@naga.com','@mobile']}, async({app})=>{
            let localization = new getLocalization("/pageObjects/localization/Website_NagaCom.json")
            await test.step("Open website naga.com/ae", async()=>{
                await app.website.open('https://naga.com/ae')
                await app.website.openMobileMenu(0)
                await app.website.checkMobileTradeInstrument(type, 1)
                await app.website.acceptAllCookies()
                await app.website.checkAndCloseBullonPopup()
            })
            await test.step("Check footer naga.com/en footer elemets", async()=>{
                expect(await app.website.getText(await app.website.aeFooterRiskWarning)).toEqual(await localization.getLocalizationText("AE_RiskWarning"))
                expect(await app.website.getText(await app.website.aeFooterDisclaimer)).toEqual(await localization.getLocalizationText("AE_Disclaimer"))
            })})
    }

    type mobileFooterTypeEU = {
        type: string,
        baseUrl: string,
        page1: string,
        page2: string,
        subcategory1: string,
        subcategory2: string
    }

    const EuMobileRiskWarningFooter: mobileFooterTypeEU[] = [
        { type: 'trade', baseUrl:'https://naga.com/eu', page1:"Markets", page2:"Company", subcategory1:'Forex', subcategory2:'Contact us'},
        { type: 'invest', baseUrl:'https://naga.com/eu', page1:'Platforms', page2:'Help & Support', subcategory1:'NAGA Web', subcategory2:'Contact us'}
    ]
    for(const{ type, baseUrl,page1, page2, subcategory1, subcategory2}of EuMobileRiskWarningFooter){
        test(` Mobile ${baseUrl} -> Risk Warning footer /${type} page`, {tag:['@naga.com','@mobile']}, async({app})=>{
            let localization = new getLocalization("/pageObjects/localization/Website_NagaCom.json")
            await test.step(`Open website ${baseUrl}`, async()=>{
                await app.website.open(`${baseUrl}`)
                await app.website.openMobileMenu(0)
                await app.website.checkMobileTradeInstrument(type, 1)
            })
            await test.step('Check risk warning footer', async()=>{
                await app.website.acceptAllCookies()
                await app.website.checkAndCloseBullonPopup()
                expect(await app.website.getRiskWarningFooter()).toEqual(await localization.getLocalizationText("EU_riskWarning_footer"))
            })
            await test.step(`Check footer on ${page1} page`, async()=>{
                await app.website.openMobileFooterCategory(page1, subcategory1)
                expect(await app.website.getRiskWarningFooter()).toEqual(await localization.getLocalizationText("EU_riskWarning_footer"))
            })
            await test.step(`Check footer on ${page2} page`, async()=>{
                await app.website.openMobileFooterCategory(page2, subcategory2)
                expect(await app.website.getRiskWarningFooter()).toEqual(await localization.getLocalizationText("EU_riskWarning_footer"))
            })
        })
    }

    const AEMobileRiskWarningFooter: mobileFooterTypeEU[] = [
        { type: 'Trade', baseUrl:'https://naga.com/eu', page1:"Markets", page2:"Company", subcategory1:'Forex', subcategory2:'Contact us'},
        { type: 'Invest', baseUrl:'https://naga.com/eu', page1:'Platforms', page2:'Help & Support', subcategory1:'NAGA Web app', subcategory2:'Contact us'}
    ]
    for(const{type, page1, page2, subcategory1, subcategory2}of AEMobileRiskWarningFooter){
        test(`Footer disclaimer on ${type} page`,{tag:['@naga.com','@mobile']}, async({app}, testInfo)=>{
            testInfo.setTimeout(testInfo.timeout + 10000);
            let localization = new getLocalization("/pageObjects/localization/Website_NagaCom.json")
            await test.step('Open naga.com/ae and check header discleimer', async()=>{
                await app.website.open('https://naga.com/ae');
                await app.website.openMobileMenu(0)
                await app.website.checkMobileTradeInstrument(`${type}`, 1)
                await app.website.checkAndCloseBullonPopup()
                await app.website.acceptAllCookies();
                expect(await app.website.getText(await app.website.aeHeaderDisclaimer)).toEqual(await localization.getLocalizationText('AE_HeaderDisclaimer'))
            })
            await test.step(`Check header on ${page1} page`, async()=>{
                await app.website.openMobileFooterCategory(page1, subcategory1)
                expect(await app.website.getText(await app.website.aeHeaderDisclaimer)).toEqual(await localization.getLocalizationText('AE_HeaderDisclaimer'))
            })
            await test.step(`Check header on ${page2} page`, async()=>{
                await app.website.openMobileFooterCategory(page2, subcategory2)
                expect(await app.website.getText(await app.website.aeHeaderDisclaimer)).toEqual(await localization.getLocalizationText('AE_HeaderDisclaimer'))
            })
        })}

    type pdfTypes = {
        type: string,
        platform: string,
        documents: string[],
        regulation: string,
    }

    const pdfParams: pdfTypes[] = [
        { type:'trade',regulation: 'EU', platform:'https://naga.com/eu/legal-documentation', documents: ["AML and Account Verification Policy", 'Client Agreement', 'Client Categorization Policy','Cost and Charges Policy','Privacy Policy']},
        { type:'Trade',regulation: 'EN', platform:'https://naga.com/en/legal-documentation', documents: ["Client Agreement", 'Privacy Policy','Cost and Charges Policy','FATCA']},
        { type:'Trade',regulation: 'ZA', platform:'https://naga.com/za/legal-documentation', documents: ["Privacy Policy", 'Risk Disclosure and Warning Notice','Terms & Conditions']},
        { type:'Trade',regulation: 'AE', platform:'https://naga.com/ae/legal-documentation', documents: ["Terms & Conditions", 'Disclaimer','W-8 BEN Form', 'Privacy Policy']}
    ]   
    for(const{ type, platform, documents, regulation}of pdfParams){
        test(` Mobile. Check legal documents on ${type} page. Base url ${platform}`,
            {tag: ['@naga.com', '@compliance','@mobile']}, async({app}, testInfo)=>{
            await testInfo.setTimeout(testInfo.timeout + 40000);
            await test.step(`Open ${platform}`, async()=>{
                await app.website.open(platform)
            })
            await test.step('Check documents in popup', async()=>{
                for(let index in documents){
                    await app.website.openLegalDocument(documents[index])
                    expect(await app.website.getPopupHeader()).toEqual(documents[index])
                    expect(await app.website.checkDocumentVisibility(`${regulation}_${type}`, `${documents[index]}`, 'name')).toBeVisible()
                    expect(await app.website.checkDocumentVisibility(`${regulation}_${type}`, `${documents[index]}`, 'updated')).toBeVisible()
                    expect(await app.website.checkDocumentVisibility(`${regulation}_${type}`, `${documents[index]}`, 'year')).toBeVisible()
                    await app.website.closePopup()
                }}
            )})
        }
})
