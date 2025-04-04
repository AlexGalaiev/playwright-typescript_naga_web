import { expect } from "@playwright/test";
import { NagaCom } from "../../pageObjects/Website/NagaCom";
import { test } from "../../test-options";
import { getLocalization } from "../../pageObjects/localization/getText";

test.describe('Mobile website', async()=>{

    type RedirectTypes = {
        testRailId: string
        type: string;
        buttonName: string;
        redirectTo: string;
        baseUrl: string;
    }
    //get started btn is tested in Check allert popup test
    const fromWebsiteToNM: RedirectTypes[] = [
        {testRailId: '@25208', type: 'Trade', buttonName: 'Login', baseUrl: 'https://naga.com/en', redirectTo: 'https://app.naga.com/login'},
        {testRailId: '@25208', type: 'Invest', buttonName: 'Login', baseUrl: 'https://naga.com/en', redirectTo: 'https://app.naga.com/login'},
    ]

    for(const{testRailId, type, buttonName, redirectTo, baseUrl }of fromWebsiteToNM){
        test(`${testRailId} Mobile. Redirect with VPN (Italy) from ${baseUrl} / ${type} to ${redirectTo}.->Click ${buttonName} button`, 
            {tag: ['@naga.com','@mobile']}, async({proxyPage},testInfo)=>{
            testInfo.setTimeout(testInfo.timeout + 25000)
            let website = new NagaCom(proxyPage)
            await test.step(`Open website ${baseUrl}`, async()=>{
                await website.open(`${baseUrl}`)
                await website.openMobileMenu(0)
            })
            await test.step(`Choose ${type} page. Click ${buttonName} btn`, async()=>{
                await website.acceptAllCookies()
                await website.checkMobileTradeInstrument(`${type}`,1)
                await website.acceptAllCookies()
                await website.checkAndCloseBullonPopup()
                await website.openMobileMenu(0)
                await website.clickMobileBtn(`${buttonName}`,1)
                expect(await website.checkUrl()).toContain(`${redirectTo}`)
            })
        })
    }

    const fromWebsiteToNMena: RedirectTypes[] = [
        {testRailId: '@25226', type: 'Trade', buttonName: 'Login', baseUrl: 'https://naga.com/ae', redirectTo: 'https://app.naga.com/login?lang=en'},
        {testRailId: '@25226', type: 'Trade', buttonName: 'Get started', baseUrl: 'https://naga.com/ae', redirectTo: 'https://app.naga.com/register?lang=en'},
        {testRailId: '@25226', type: 'Invest', buttonName: 'Login', baseUrl: 'https://naga.com/ae', redirectTo: 'https://app.naga.com/login?lang=en'},
        {testRailId: '@25226', type: 'Invest', buttonName: 'Get started', baseUrl: 'https://naga.com/ae', redirectTo: 'https://app.naga.com/register?lang=en'},
    ]

    for(const{testRailId, type, buttonName, redirectTo, baseUrl }of fromWebsiteToNMena){
        test(`${testRailId} Mobile. Redirect with VPN (UAE) from ${baseUrl} / ${type} to ${redirectTo}.->Click ${buttonName} button`, 
            {tag: ['@naga.com','@mobile']}, async({proxyPageUAE},testInfo)=>{
            testInfo.setTimeout(testInfo.timeout + 25000)
            let website = new NagaCom(proxyPageUAE)
            await test.step(`Open website ${baseUrl}`, async()=>{
                await website.open(`${baseUrl}`)
                await website.openMobileMenu(0)
            })
            await test.step(`Choose ${type} page. Click ${buttonName} btn`, async()=>{
                await website.checkMobileTradeInstrument(`${type}`,1)
                await website.openMobileMenu(0)
                await website.acceptAllCookies()
                await website.clickMobileBtn(`${buttonName}`,1)
                expect(await website.checkUrl()).toContain(`${redirectTo}`)
            })
        })
    }
    const fromWebsiteToNAfrica: RedirectTypes[] = [
        {testRailId: '@25220', type: 'Trade', buttonName: 'Login', baseUrl: 'https://naga.com/za', redirectTo: 'https://app.naga.com/login?lang=en'},
        {testRailId: '@25220', type: 'Trade', buttonName: 'Get started', baseUrl: 'https://naga.com/za', redirectTo: 'https://app.naga.com/register?lang=en'},
    ]

    for(const{testRailId, type, buttonName, redirectTo, baseUrl }of fromWebsiteToNAfrica){
        test(`${testRailId} Mobile. Redirect with VPN (ZA) from ${baseUrl} / ${type} to ${redirectTo}.->Click ${buttonName} button`, 
            {tag: ['@mobile', '@naga.com']}, async({proxyPageSA},testInfo)=>{
            testInfo.setTimeout(testInfo.timeout + 15000)
            let website = new NagaCom(proxyPageSA)
            await test.step(`Open website ${baseUrl}`, async()=>{
                await website.open(`${baseUrl}`)
                await website.openMobileMenu(2)
            })
            await test.step(`Choose ${type} page. Click ${buttonName} btn`, async()=>{
                await website.checkMobileTradeInstrument(`${type}`,2)
                await website.openMobileMenu(2)
                await website.acceptAllCookies()
                await website.clickMobileBtn(`${buttonName}`,2)
                expect(await website.checkUrl()).toContain(`${redirectTo}`)
            })
        })
    }
    const fromWebsitetoNS: RedirectTypes[] = [
        {testRailId: '@25195', type: 'trade', buttonName: 'Login', baseUrl: 'https://naga.com/eu', redirectTo: 'https://app.naga.com/login'},
        {testRailId: '@25195', type: 'trade', buttonName: 'Get started', baseUrl: 'https://naga.com/eu', redirectTo: 'https://app.naga.com/register'},
        {testRailId: '@25195', type: 'invest', buttonName: 'Login', baseUrl: 'https://naga.com/eu', redirectTo: 'https://app.naga.com/login'},
        {testRailId: '@25195', type: 'invest', buttonName: 'Get started', baseUrl: 'https://naga.com/eu', redirectTo: 'https://app.naga.com/register'},
        {testRailId: '@25195', type: 'crypto', buttonName: 'Login', baseUrl: 'https://naga.com/eu', redirectTo: 'https://app.nagax.com/eu/login'},
        {testRailId: '@25195', type: 'crypto', buttonName: 'Get started', baseUrl: 'https://naga.com/eu',  redirectTo: 'https://app.nagax.com/eu/register'},
    ]
    for(const{type, buttonName, redirectTo, testRailId, baseUrl}of fromWebsitetoNS){
    test(`${testRailId} Mobile Redirect with VPN (Ukraine) from ${baseUrl} /${type} to ${redirectTo}. -> Click ${buttonName} button`, 
        {tag: ['@naga.com','@mobile']}, async({proxyPageUA}, testInfo)=>{
        testInfo.setTimeout(testInfo.timeout + 10000)
        let website = new NagaCom(proxyPageUA)
        await test.step(`Open website ${baseUrl}`, async()=>{
            await website.open(`${baseUrl}`)
            await website.openMobileMenu(0)
        })
        await test.step(`Choose ${type} page. Click ${buttonName} btn`, async()=>{
            await website.checkMobileTradeInstrument(`${type}`,1)
            await website.openMobileMenu(0)
            await website.acceptAllCookies()
            await website.clickMobileBtn(`${buttonName}`,1)
            expect(await website.checkUrl()).toContain(`${redirectTo}`)
        })})
    }
    
    const fromENtoNMAllert: RedirectTypes[] = [
        {testRailId: '@25210', type: 'Trade', buttonName: 'Get started', baseUrl:'https://naga.com/en', redirectTo: 'https://app.naga.com/register'},
        {testRailId: '@25210', type: 'Invest', buttonName: 'Get started', baseUrl:'https://naga.com/en',  redirectTo: 'https://app.naga.com/register'},
    ]

    for(const{type, buttonName, redirectTo, testRailId, baseUrl}of fromENtoNMAllert){
    test(`${testRailId} Mobile.Redirect with VPN (Italy) from ${baseUrl} /${type} to ${redirectTo}. Check allert popup`, 
        {tag: ['@naga.com','@mobile']}, 
        async({proxyPage}, testInfo)=>{
        testInfo.setTimeout(testInfo.timeout + 50000);
        let website = new NagaCom(proxyPage)
        let localization = new getLocalization('/pageObjects/localization/Website_NagaCom.json')
        await test.step(`Open website ${baseUrl}`, async()=>{
            await website.open(`${baseUrl}`)
            await website.openMobileMenu(0)
        })
        await test.step(`Choose ${type} page. Click ${buttonName} btn`, async()=>{
            // await website.checkAndCloseBullonPopup()
            await website.checkMobileTradeInstrument(`${type}`,1)
            await website.acceptAllCookies()
            await website.checkAndCloseBullonPopup()
            await website.openMobileMenu(0)
            await website.clickMobileBtn(`${buttonName}`,1)
        await test.step('Check redirect notification popup text. And redirect to Webtrader', async()=>{
            expect(await website.getRedirectAllertPopupText()).toContain(await localization.getLocalizationText("RedirectAllertPopupText"))
            await website.acceptRedirectPopup()
        })
            expect(await website.checkUrl()).toContain(`${redirectTo}`)
        })})
    }
    type searchTypes = {
        testRailId: string;
        type: string;
        nameOfInstrument: string;
        redirectTo: string;
        basePage: string;
        buttonName: string;
    }
    const EuSearchTypes: searchTypes[] = [
        {testRailId: '@25214', type: 'trade', nameOfInstrument: "FACEBOOK", redirectTo: "https://app.naga.com/open-trade", basePage:"https://naga.com/eu", buttonName:'Trade'},
        {testRailId: '@25212', type: 'invest', nameOfInstrument: "FACEBOOK", redirectTo: "https://app.naga.com/open-trade", basePage:"https://naga.com/eu", buttonName: 'Invest'},
    ]
    for(const{testRailId, type, nameOfInstrument, redirectTo,basePage,buttonName}of EuSearchTypes){
        test(`${testRailId} Mobile VPN(Ukraine) Redirect from ${basePage}/${type} to platform. Search ${nameOfInstrument} instrument `, 
            {tag:['@naga.com','@mobile']}, async({proxyPageUA}, testInfo)=>{
            let website = new NagaCom(proxyPageUA)
            testInfo.setTimeout(testInfo.timeout + 20000)
            await test.step(`Open website ${basePage}. Check ${type} page`,async()=>{
                await website.open(basePage)
                await website.openMobileMenu(0)
                await website.checkMobileTradeInstrument(`${type}`,1)
                await website.acceptAllCookies()
                await website.checkAndCloseBullonPopup()
            })
            await test.step(`Search instrument ${nameOfInstrument}. Redirect to ${redirectTo} platform`, async()=>{
                await website.searchMobileInstrument(nameOfInstrument);
                const[newPage, instrumentName] = await website.openMobilePosition()
                let newWebsite = new NagaCom(newPage)
                expect(await newWebsite.checkUrl()).toContain(`${redirectTo}`)
            })})
    }
    const AESearchTypes: searchTypes[] = [
        {testRailId: "@25235", type: 'Trade', nameOfInstrument: "SIEMENS", redirectTo: 'https://app.naga.com/open-trade', basePage:'https://naga.com/ae', buttonName:'Trade'},
        {testRailId: "@25236", type: 'Invest', nameOfInstrument: "SIEMENS", redirectTo: 'https://app.naga.com/open-trade', basePage:'https://naga.com/ae', buttonName:'Invest'}
   ]

    for(const{testRailId, type, nameOfInstrument, redirectTo,basePage,buttonName}of AESearchTypes){
        test(`${testRailId} Mobile VPN(UAE) Redirect from ${basePage}/${type} to platform. Search ${nameOfInstrument} instrument `, 
            {tag:['@naga.com','@mobile']}, async({proxyPageUAE}, testInfo)=>{
            let website = new NagaCom(proxyPageUAE)
            testInfo.setTimeout(testInfo.timeout + 20000)
            await test.step(`Open website ${basePage}. Check ${type} page`,async()=>{
                await website.open(basePage)
                await website.openMobileMenu(0)
                await website.checkMobileTradeInstrument(`${type}`,1)
                await website.acceptAllCookies()
                await website.checkAndCloseBullonPopup()
            })
            await test.step(`Search instrument ${nameOfInstrument}. Redirect to ${redirectTo} platform`, async()=>{
                await website.searchMobileInstrument(nameOfInstrument);
                const[newPage, instrumentName] = await website.openMobilePosition()
                let newWebsite = new NagaCom(newPage)
                expect(await newWebsite.checkUrl()).toContain(`${redirectTo}`)
            })
        })
    }

    const ZASearchTypes: searchTypes[] = [
        {testRailId: '@25224', type: 'Trade', nameOfInstrument: "FACEBOOK", redirectTo: "https://app.naga.com/open-trade", basePage:"https://naga.com/za", buttonName:'Trade'}
   ]

    for(const{testRailId, type, nameOfInstrument, redirectTo,basePage,buttonName}of ZASearchTypes){
    test(`${testRailId} Mobile. VPN(ZA) Redirect from ${basePage}/${type} to platform. Search ${nameOfInstrument} instrument `, 
        {tag:['@naga.com','@mobile']}, async({proxyPageSA}, testInfo)=>{
        let website = new NagaCom(proxyPageSA)
        testInfo.setTimeout(testInfo.timeout + 20000)
        await test.step(`Open website ${basePage}. Check ${type} page`,async()=>{
            await website.open(basePage)
            await website.openMobileMenu(2)
            await website.checkMobileTradeInstrument(`${type}`,2)
            await website.acceptAllCookies()
            await website.checkAndCloseBullonPopup()
        })
        await test.step(`Search instrument ${nameOfInstrument}. Redirect to ${redirectTo} platform`, async()=>{
            await website.searchMobileInstrument(nameOfInstrument);
            const[newPage, instrumentName] = await website.openMobilePosition()
            let newWebsite = new NagaCom(newPage)
            expect(await newWebsite.checkUrl()).toContain(`${redirectTo}`)
        })
    })
    }

    const EnSearchTypes: searchTypes[] = [
        {testRailId: '@25213', type: 'Trade', nameOfInstrument: "FACEBOOK", redirectTo: "https://app.naga.com/open-trade", basePage:"https://naga.com/en", buttonName:'Trade'},
        {testRailId: '@25211', type: 'Invest', nameOfInstrument: "FACEBOOK", redirectTo: "https://app.naga.com/open-trade", basePage:"https://naga.com/en", buttonName: 'Invest'},
    ]
    for(const{testRailId, type, nameOfInstrument, redirectTo,basePage,buttonName}of EnSearchTypes){
        test(`${testRailId} Mobile VPN(Italy). Redirect from ${basePage}/${type} to platfotm. Search ${nameOfInstrument} on page`, 
            {tag: ['@naga.com','@mobile']}, async({proxyPage}, testInfo)=>{
            let website = new NagaCom(proxyPage)
            testInfo.setTimeout(testInfo.timeout + 10000)
            await test.step(`Open website ${basePage}. Check instrument ${type}`,async()=>{
                await website.open(basePage)
                await website.openMobileMenu(0)
                await website.checkMobileTradeInstrument(`${type}`,1)
                await website.acceptAllCookies()
                await website.checkAndCloseBullonPopup()
            })
            await test.step(`Search instrument ${nameOfInstrument}. Redirect to platform`, async()=>{
                await website.searchMobileInstrument(nameOfInstrument);
                const[newPage, instrumentName] = await website.openMobilePosition()
                let newWebsite = new NagaCom(newPage)
                expect(await newWebsite.checkUrl()).toContain(`${redirectTo}`)
            })}
        )}
})

test.describe('Mobile. Languages and translations', async()=>{
    type languageTypes = {
        regulation: string;
        languages: string[];
        testRailId: string;
        numberOfLanguages: number;
    }
    const languageParameters: languageTypes[] = [
        {testRailId: '@25197', regulation: 'eu', numberOfLanguages: 9, languages: ['English (Europe)', 'Deutsch', 'Italiano', 'Español', 'Polski', 'Čeština', 'Nederlands', 'Português', 'Română']},
        {testRailId: '@25196', regulation: 'en', numberOfLanguages: 8, languages: ['English (Global)', 'Español (Latam)', 'Português', 'العربية', 'Bahasa Indonesia', '简化字', '繁體中文', 'ภาษาไทย']},
        {testRailId: '@25229', regulation: 'ae', numberOfLanguages: 2, languages: ['English (Mena)', 'العربية']}
    ]
    for(const{testRailId, regulation, languages,numberOfLanguages}of languageParameters){
        test(`${testRailId} Mobile Check available languages on ${regulation}`,
            {tag: ['@naga.com','@mobile']}, async({page})=>{
            let website = new NagaCom(page)
            await test.step(`Open naga.com/${regulation} website`, async()=>{
                await website.open(`https://naga.com/${regulation}`)
            })
            await test.step('Check visible language', async()=>{
                await website.openMobileLanguages(1)
                for(let index in languages){
                    expect(await website.checkVisibileLanguage(languages[index])).toBeTruthy()
                }
                expect(await website.getNumberOfLanguages()).toEqual(numberOfLanguages)
            })})
    }

    type translations = {
        testRailId: string;
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
        {testRailId: "@25215", tradeType: 'trade', investType: 'invest', platform: "https://naga.com/eu", language:'English (Europe)', btn1:'LoginBtn.eng', btn2:"GetStarted.eng", btn3:"Discover more.eng", btn4:"Start trading.eng"},
        {testRailId: "@25215", tradeType: 'trade', investType: 'invest', platform: "https://naga.com/eu", language:'Deutsch', btn1:'LoginBtn.de', btn2:"GetStarted.de", btn3:"Discover more.de", btn4:"Start trading.de"},
        {testRailId: "@25215", tradeType: 'trade', investType: 'invest', platform: "https://naga.com/eu", language:'Italiano', btn1:'LoginBtn.it', btn2:"GetStarted.it", btn3:"Discover more.it", btn4:"Start trading.it"},
        {testRailId: "@25215", tradeType: 'trade', investType: 'invest', platform: "https://naga.com/eu", language:'Español', btn1:'LoginBtn.es', btn2:"GetStarted.es", btn3:"Discover more.es", btn4:"Start trading.es"},
        {testRailId: "@25215", tradeType: 'trade', investType: 'invest', platform: "https://naga.com/eu", language:'Polski', btn1:'LoginBtn.pl', btn2:"GetStarted.pl", btn3:"Discover more.pl", btn4:"Start trading.pl"},
        {testRailId: "@25215", tradeType: 'trade', investType: 'invest', platform: "https://naga.com/eu", language:'Čeština', btn1:'LoginBtn.cz', btn2:"GetStarted.cz", btn3:"Discover more.cz", btn4:"Start trading.cz"},
        {testRailId: "@25215", tradeType: 'trade', investType: 'invest', platform: "https://naga.com/eu", language:'Nederlands', btn1:'LoginBtn.ne', btn2:"GetStarted.ne", btn3:"Discover more.ne", btn4:"Start trading.ne"},
        {testRailId: "@25215", tradeType: 'trade', investType: 'invest', platform: "https://naga.com/eu", language:'Português', btn1:'LoginBtn.po', btn2:"GetStarted.po", btn3:"Discover more.po", btn4:"Start trading.po"},
        {testRailId: "@25215", tradeType: 'trade', investType: 'invest', platform: "https://naga.com/eu", language:'Română', btn1:'LoginBtn.ro', btn2:"GetStarted.ro", btn3:"Discover more.ro", btn4:"Start trading.ro"},
        {testRailId: "@25216", tradeType: 'Trade', investType: 'Invest', platform: "https://naga.com/en", language:'Español (Latam)', btn1:'LoginBtn.lat', btn2:"GetStarted.lat", btn3:"Discover more.lat", btn4:"Start trading.lat"},
        {testRailId: "@25216", tradeType: 'Trade', investType: 'Invest', platform: "https://naga.com/en", language:'Português', btn1:'LoginBtn.por', btn2:"GetStarted.por", btn3:"Discover more.por", btn4:"Start trading.por"},
        {testRailId: "@25216", tradeType: 'Trade', investType: 'Invest', platform: "https://naga.com/en", language:'العربية', btn1:'LoginBtn.ar', btn2:"GetStarted.ar", btn3:"Discover more.ar", btn4:"Start trading.ar"},
        {testRailId: "@25216", tradeType: 'Trade', investType: 'Invest', platform: "https://naga.com/en", language:'Bahasa Indonesia', btn1:'LoginBtn.ind', btn2:"GetStarted.ind", btn3:"Discover more.ind", btn4:"Start trading.ind"},
        {testRailId: "@25216", tradeType: 'Trade', investType: 'Invest', platform: "https://naga.com/en", language:'简化字', btn1:'LoginBtn.chi', btn2:"GetStarted.chi", btn3:"Discover more.chi", btn4:"Start trading.chi"},
        {testRailId: "@25216", tradeType: 'Trade', investType: 'Invest', platform: "https://naga.com/en", language:'繁體中文', btn1:'LoginBtn.chiGlobal', btn2:"GetStarted.chiGlobal", btn3:"Discover more.chiGlobal", btn4:"Start trading.chiGlobal"},
        {testRailId: "@25216", tradeType: 'Trade', investType: 'Invest', platform: "https://naga.com/en", language:'ภาษาไทย', btn1:'LoginBtn.thai', btn2:"GetStarted.thai", btn3:"Discover more.thai", btn4:"Start trading.thai"},
        {testRailId: "@25232", tradeType: 'Trade', investType: 'Invest', platform: "https://naga.com/ae", language:'العربية', btn1:'LoginBtn.ar', btn2:"GetStarted.ar", btn3:"Discover more.ar", btn4:"Start trading.ar"},
    ]

    for(const{testRailId,platform,language,btn1,btn2,btn3,btn4,tradeType,investType}of translationParams){
    test(`${testRailId} Mobile Localization of main buttons-${platform}. ${language} language`,
        {tag:['@naga.com','@mobile']}, async({page}, testInfo)=>{
        testInfo.setTimeout(testInfo.timeout + 80000);
        let website = new NagaCom(page)
        let localization = new getLocalization("/pageObjects/localization/Website_Naga.com_translations.json")
        await test.step(`Open ${platform} and switch to ${language}`, async()=>{
            await website.open(platform)
            await website.switchMobileLanguageTo(language)
            await website.acceptAllCookies()
            await website.openMobileMenu(0)
            await website.checkAndCloseBullonPopup()
        })
        await test.step(`Check ${tradeType} page buttons`, async()=>{
            expect(await website.getMobileBtnText(await localization.getTranslation(btn1))).toBeVisible()
            expect(await website.getMobileBtnText(await localization.getTranslation(btn2))).toBeVisible()
        })
        await test.step(`Check ${investType} page buttons`, async()=>{
            await website.checkMobileTradeInstrument(`${investType}`,1)
            await website.openMobileMenu(0)
            await website.acceptAllCookies()
            expect(await website.getMobileBtnText(await localization.getTranslation(btn1))).toBeVisible()
            expect(await website.getMobileBtnText(await localization.getTranslation(btn2))).toBeVisible()
        })})
    }

    type translationsCrypto = {
        testRailId: string;
        platform: string;
        type: string;
        language: string;
        btn1: string;
        btn2: string;
    }

    const cryptoParams: translationsCrypto[] = [
        {testRailId: '@25215', platform: 'https://naga.com/eu', type: 'crypto', language:'English', btn1: 'LoginBtn.eng', btn2: 'GetStarted.eng'},
        {testRailId: '@25215', platform: 'https://naga.com/eu', type: 'crypto', language:'Deutsch', btn1: 'LoginBtn.de', btn2: 'GetStarted.de'},
        {testRailId: '@25215', platform: 'https://naga.com/eu', type: 'crypto', language:'Español', btn1: 'LoginBtn.es', btn2: 'GetStarted.es'},
        {testRailId: '@25215', platform: 'https://naga.com/eu', type: 'crypto', language:'Italiano', btn1: 'LoginBtn.it', btn2: 'Get started Crypto.it'},
        {testRailId: '@25215', platform: 'https://naga.com/eu', type: 'crypto', language:'Polski', btn1: 'LoginBtn.pl', btn2: 'Get started Crypto.pl'},
    ]
    for(const{testRailId, platform, language, type, btn1, btn2}of cryptoParams){
    test(`${testRailId} Mobile Localization of main buttons, Language-${language} on ${platform}, ${type}`,
        {tag: ['@naga.com','@mobile']}, async({page}, testInfo)=>{
        testInfo.setTimeout(testInfo.timeout + 30000);
        let website = new NagaCom(page)
        let localization = new getLocalization("/pageObjects/localization/Website_Naga.com_translations.json")
        await test.step(`Open ${platform} ans switch to ${language}`, async()=>{
            await website.open(platform)
            await website.openMobileMenu(0)
            await website.checkMobileTradeInstrument(type, 1)
            await website.switchMobileLanguageTo(language)
            await website.acceptAllCookies()
            await website.openMobileMenu(0)
            await website.checkAndCloseBullonPopup()
        })
        await test.step(`Check main button ${type} page`, async()=>{
            expect(await website.getMobileBtnText(await localization.getTranslation(btn1))).toBeVisible()
            expect(await website.getMobileBtnText(await localization.getTranslation(btn2))).toBeVisible()
        })})
    }

    type payTranslations = {
        testRailId: string,
        platform: string,
        type: string,
        language: string,
        btn1: string
    }
    const payTranslationsParams: payTranslations[] = [
        {testRailId: "@25215", platform: 'https://naga.com/eu', type:'pay', language:'English (Europe)', btn1:"Get your card.eng"},
        {testRailId: "@25215", platform: 'https://naga.com/eu', type:'pay', language:'Deutsch', btn1:"Get your card.de"},
        {testRailId: "@25215", platform: 'https://naga.com/eu', type:'pay', language:'Italiano', btn1:"Get your card.it"},
        {testRailId: "@25215", platform: 'https://naga.com/eu', type:'pay', language:'Español', btn1:"Get your card.es"},
        {testRailId: "@25215", platform: 'https://naga.com/eu', type:'pay', language:'Polski', btn1:"Get your card.pl"},
        {testRailId: "@25215", platform: 'https://naga.com/eu', type:'pay', language:'Čeština', btn1:"Get your card.cz"},
        {testRailId: "@25215", platform: 'https://naga.com/eu', type:'pay', language:'Português', btn1:"Get your card.po"},
    ]

    for(const{testRailId, platform, language, btn1,type}of payTranslationsParams){
        test(`${testRailId} Mobile. Localization of main buttons, Language-${language} on ${platform}, Pay page`,
            {tag:['@naga.com','@mobile']}, async({page}, testInfo)=>{
            testInfo.setTimeout(testInfo.timeout + 30000);
            let website = new NagaCom(page)
            let localization = new getLocalization("/pageObjects/localization/Website_Naga.com_translations.json")
            await test.step(`Open ${platform} ans switch to ${language}`, async()=>{
                await website.open(platform)
                await website.openMobileMenu(0)
                await website.checkMobileTradeInstrument(type, 1)
                await website.switchMobileLanguageTo(language)
                await website.acceptAllCookies()
                await website.openMobileMenu(0)
                await website.checkAndCloseBullonPopup()
            })
            await test.step(`Check main button ${type} page`, async()=>{
                expect(await website.getMobileBtnTextPay(await localization.getTranslation(btn1))).toBeVisible()
            })
        })}

    type footerTypes = {
        testRailId: string;
        type: string;
    }
    const footer: footerTypes[] = [
        {testRailId:'@25200', type:'trade'},
        {testRailId: '@25202', type: 'invest'}
    ]
    for(const{testRailId, type } of footer){
        test(`${testRailId} Mobile naga.com/eu footer ->${type} page`, 
            {tag:['@naga.com','@mobile']}, async({page})=>{
            let website = new NagaCom(page);
            let localization = new getLocalization("/pageObjects/localization/Website_NagaCom.json")
            await test.step(`Open website https://naga.com/eu`, async()=>{
                await website.open('https://naga.com/eu')
                await website.openMobileMenu(0)
                await website.checkMobileTradeInstrument(type, 1)
                await website.acceptAllCookies()
                await website.checkAndCloseBullonPopup()
            })
            await test.step("Check naga.com/eu footer elements", async()=>{
                expect(await website.getText(await website.riskWarning_EU)).toEqual(await localization.getLocalizationText('EU_footer_RiskWarning_header'))
                expect(await website.getText(await website.riskWarning_EU_main)).toEqual(await localization.getLocalizationText('EU_footer_RiskWarning_main'))
            })})
    }
    const EuFooterCryptoParams: footerTypes[] = [
        {testRailId: '@25205', type: 'crypto'},
    ]

    for(const{testRailId, type} of EuFooterCryptoParams){
        test(`${testRailId} Mobile naga.com/eu footer ->${type} page`, {tag:['@naga.com','@mobile']}, async({page})=>{
            let website = new NagaCom(page);
            let localization = new getLocalization("/pageObjects/localization/Website_NagaCom.json")
            await test.step("Open website https://naga.com/eu", async()=>{
                await website.open('https://naga.com/eu')
                await website.openMobileMenu(0)
                await website.checkMobileTradeInstrument(type, 1)
                await website.acceptAllCookies()
                await website.checkAndCloseBullonPopup()
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
        test(`${testRailId} Mobile naga.com/eu footer ->${type} page`, {tag:['@naga.com','@mobile']}, async({page})=>{
            let website = new NagaCom(page);
            let localization = new getLocalization("/pageObjects/localization/Website_NagaCom.json")
            await test.step("Open website https://naga.com/eu", async()=>{
                await website.open('https://naga.com/eu')
                await website.openMobileMenu(0)
                await website.checkMobileTradeInstrument(type, 1)
                await website.acceptAllCookies()
                await website.checkAndCloseBullonPopup()
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
        test(`${testRailId} Mobile naga.com/en footer ->${type} page`, {tag:['@naga.com','@mobile']}, async({page})=>{
            let website = new NagaCom(page);
            let localization = new getLocalization("/pageObjects/localization/Website_NagaCom.json")
            await test.step("Open website naga.com/en", async()=>{
                await website.open('https://naga.com/en')
                await website.openMobileMenu(0)
                await website.checkMobileTradeInstrument(type, 1)
                await website.acceptAllCookies()
                await website.checkAndCloseBullonPopup()
            })
            await test.step("Check footer naga.com/en footer elemets", async()=>{
                expect(await website.getText(await website.riskWarning_EN)).toEqual(await localization.getLocalizationText("EN_footer_RiskWarning"))
                expect(await website.getText(await website.restrictedRegions_EN)).toEqual(await localization.getLocalizationText("EN_footer_RestrictedRegions"))
            })})
    }
    const ZA_FooterParams: footerTypes[] = [
        {testRailId: "@25223", type: 'Trade'},
    ]

    for(const{testRailId, type}of ZA_FooterParams){
        test(`${testRailId} Mobile naga.com/za footer ->${type} page`, {tag:['@naga.com','@mobile']}, async({page})=>{
            let website = new NagaCom(page);
            let localization = new getLocalization("/pageObjects/localization/Website_NagaCom.json")
            await test.step("Open website naga.com/za", async()=>{
                await website.open('https://naga.com/za')
                await website.acceptAllCookies()
                await website.checkAndCloseBullonPopup()
            })
            await test.step("Check footer naga.com/en footer elemets", async()=>{
                expect(await website.getText(await website.zaRiskWarning)).toEqual(await localization.getLocalizationText("ZA_RiskWarning"))
                expect(await website.getText(await website.zaRegualtion)).toEqual(await localization.getLocalizationText("ZA_Regulation"))
            })})
    }

    const AE_FooterParams: footerTypes[] = [
        {testRailId: '@25230', type: "Trade"},
        {testRailId: '@25231', type: 'Invest'}
    ]

    for(const{testRailId, type}of AE_FooterParams){
        test(`${testRailId} Mobile naga.com/ae footer ->${type} page`, {tag:['@naga.com','@mobile']}, async({page})=>{
            let website = new NagaCom(page);
            let localization = new getLocalization("/pageObjects/localization/Website_NagaCom.json")
            await test.step("Open website naga.com/ae", async()=>{
                await website.open('https://naga.com/ae')
                await website.openMobileMenu(0)
                await website.checkMobileTradeInstrument(type, 1)
                await website.acceptAllCookies()
                await website.checkAndCloseBullonPopup()
            })
            await test.step("Check footer naga.com/en footer elemets", async()=>{
                expect(await website.getText(await website.aeFooterRiskWarning)).toEqual(await localization.getLocalizationText("AE_RiskWarning"))
                expect(await website.getText(await website.aeFooterDisclaimer)).toEqual(await localization.getLocalizationText("AE_Disclaimer"))
            })})
    }

    type mobileFooterTypeEU = {
        testRailId: string,
        type: string,
        baseUrl: string,
        page1: string,
        page2: string,
        subcategory1: string,
        subcategory2: string
    }

    const EuMobileRiskWarningFooter: mobileFooterTypeEU[] = [
        {testRailId: '@25199', type: 'trade', baseUrl:'https://naga.com/eu', page1:"Markets", page2:"Company", subcategory1:'Forex', subcategory2:'Contact us'},
        {testRailId: '@25198', type: 'invest', baseUrl:'https://naga.com/eu', page1:'Platforms', page2:'Help & Support', subcategory1:'NAGA Web', subcategory2:'Contact us'}
    ]
    for(const{testRailId, type, baseUrl,page1, page2, subcategory1, subcategory2}of EuMobileRiskWarningFooter){
        test(`${testRailId} Mobile ${baseUrl} -> Risk Warning footer /${type} page`, {tag:['@naga.com','@mobile']}, async({page})=>{
            let website = new NagaCom(page);
            let localization = new getLocalization("/pageObjects/localization/Website_NagaCom.json")
            await test.step(`Open website ${baseUrl}`, async()=>{
                await website.open(`${baseUrl}`)
                await website.openMobileMenu(0)
                await website.checkMobileTradeInstrument(type, 1)
            })
            await test.step('Check risk warning footer', async()=>{
                await website.acceptAllCookies()
                await website.checkAndCloseBullonPopup()
                expect(await website.getRiskWarningFooter()).toEqual(await localization.getLocalizationText("EU_riskWarning_footer"))
            })
            await test.step(`Check footer on ${page1} page`, async()=>{
                await website.openMobileFooterCategory(page1, subcategory1)
                expect(await website.getRiskWarningFooter()).toEqual(await localization.getLocalizationText("EU_riskWarning_footer"))
            })
            await test.step(`Check footer on ${page2} page`, async()=>{
                await website.openMobileFooterCategory(page2, subcategory2)
                expect(await website.getRiskWarningFooter()).toEqual(await localization.getLocalizationText("EU_riskWarning_footer"))
            })
        })
    }

    const AEMobileRiskWarningFooter: mobileFooterTypeEU[] = [
        {testRailId: '@25199', type: 'Trade', baseUrl:'https://naga.com/eu', page1:"Markets", page2:"Company", subcategory1:'Forex', subcategory2:'Contact us'},
        {testRailId: '@25198', type: 'Invest', baseUrl:'https://naga.com/eu', page1:'Platforms', page2:'Help & Support', subcategory1:'NAGA Web app', subcategory2:'Contact us'}
    ]
    for(const{type, page1, page2, subcategory1, subcategory2, testRailId}of AEMobileRiskWarningFooter){
        test(`${testRailId} Footer disclaimer on ${type} page`,{tag:['@naga.com','@mobile']}, async({page}, testInfo)=>{
            let website = new NagaCom(page);
            testInfo.setTimeout(testInfo.timeout + 10000);
            let localization = new getLocalization("/pageObjects/localization/Website_NagaCom.json")
            await test.step('Open naga.com/ae and check header discleimer', async()=>{
                await website.open('https://naga.com/ae');
                await website.openMobileMenu(0)
                await website.checkMobileTradeInstrument(`${type}`, 1)
                await website.checkAndCloseBullonPopup()
                await website.acceptAllCookies();
                //await website.checkTradeInstrument(type);
                expect(await website.getText(await website.aeHeaderDisclaimer)).toEqual(await localization.getLocalizationText('AE_HeaderDisclaimer'))
            })
            await test.step(`Check header on ${page1} page`, async()=>{
                await website.openMobileFooterCategory(page1, subcategory1)
                expect(await website.getText(await website.aeHeaderDisclaimer)).toEqual(await localization.getLocalizationText('AE_HeaderDisclaimer'))
            })
            await test.step(`Check header on ${page2} page`, async()=>{
                await website.openMobileFooterCategory(page2, subcategory2)
                expect(await website.getText(await website.aeHeaderDisclaimer)).toEqual(await localization.getLocalizationText('AE_HeaderDisclaimer'))
            })
        })}

    type pdfTypes = {
        testRailId: string,
        type: string,
        platform: string,
        documents: string[],
        regulation: string,
    }

    const pdfParams: pdfTypes[] = [
        {testRailId: "@25218", type:'trade',regulation: 'EU', platform:'https://naga.com/eu/legal-documentation', documents: ["AML and Account Verification Policy", 'Client Agreement', 'Client Categorization Policy','Cost and Charges Policy','Privacy Policy']},
        {testRailId: "@25217", type:'Trade',regulation: 'EN', platform:'https://naga.com/en/legal-documentation', documents: ["Client Agreement", 'Privacy Policy','Cost and Charges Policy','FATCA']},
        {testRailId: "@25225", type:'Trade',regulation: 'ZA', platform:'https://naga.com/za/legal-documentation', documents: ["Privacy Policy", 'Risk Disclosure and Warning Notice','Terms & Conditions']},
        {testRailId: "@25233", type:'Trade',regulation: 'AE', platform:'https://naga.com/ae/legal-documentation', documents: ["Terms & Conditions", 'Disclaimer','W-8 BEN Form', 'Privacy Policy']}
    ]   
    for(const{testRailId, type, platform, documents, regulation}of pdfParams){
        test(`${testRailId} Mobile. Check legal documents on ${type} page. Base url ${platform}`,
            {tag: ['@naga.com', '@compliance','@mobile']}, async({page}, testInfo)=>{
            await testInfo.setTimeout(testInfo.timeout + 40000);
            let website = new NagaCom(page);
            await test.step(`Open ${platform}`, async()=>{
                await website.open(platform)
            })
            await test.step('Check documents in popup', async()=>{
                for(let index in documents){
                    await website.openLegalDocument(documents[index])
                    expect(await website.getPopupHeader()).toEqual(documents[index])
                    expect(await website.checkDocumentVisibility(`${regulation}_${type}`, `${documents[index]}`, 'name')).toBeVisible()
                    expect(await website.checkDocumentVisibility(`${regulation}_${type}`, `${documents[index]}`, 'updated')).toBeVisible()
                    expect(await website.checkDocumentVisibility(`${regulation}_${type}`, `${documents[index]}`, 'year')).toBeVisible()
                    await website.closePopup()
                }}
            )})
        }
})
