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
        test(`${testRailId} Redirect with VPN (Italy) from ${baseUrl} /${type} to ${redirectTo}.->Click ${buttonName} button`, {tag: ['@prodSanity', '@website-naga.com']}, async({proxyPage})=>{
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
        test(`${testRailId} Redirect from ${baseUrl} /${type} to ${redirectTo}. -> Click ${buttonName} button`, {tag: ['@prodSanity', '@website-naga.com']},async({page})=>{
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
        test.fixme(`${testRailId} Redirect with VPN (Italy) from ${baseUrl} /${type} to ${redirectTo}. Check allert popup`, {tag: ['@prodSanity', '@website-naga.com']},async({proxyPage}, testInfo)=>{
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
        test(`${testRailId} Check available languages on ${regulation}`,{tag: ['@prodSanity', '@website-naga.com']}, async({page})=>{
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
        test(`${testRailId} naga.com/eu footer. ${type} page`, {tag: '@website-naga.com'}, async({page})=>{
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
        test(`${testRailId} naga.com/eu footer. ${type} page`, {tag: '@website-naga.com'}, async({page})=>{
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
        test.fixme(`${testRailId} Risk Warning footer. ${type} page`, {tag: '@website-naga.com'}, async({page})=>{
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
        test(`${testRailId} Redirect from website to platform. Search instrument ${nameOfInstrument} on ${basePage} /${type}.`, {tag: '@website-naga.com'}, async({page})=>{
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
            })})
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
            })})}
            

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
        {testRailId: "@25215", tradeType: 'trade', investType: 'invest', platform: "https://naga.com/eu", language:'English (Europe)', btn1:'LoginBtn.eng', btn2:"GetStarted.eng", btn3:"Start Investing.eng", btn4:"Start trading.eng"},
        {testRailId: "@25215", tradeType: 'trade', investType: 'invest', platform: "https://naga.com/eu", language:'Deutsch', btn1:'LoginBtn.de', btn2:"GetStarted.de", btn3:"Start Investing.de", btn4:"Start trading.de"},
        {testRailId: "@25215", tradeType: 'trade', investType: 'invest', platform: "https://naga.com/eu", language:'Italiano', btn1:'LoginBtn.it', btn2:"GetStarted.it", btn3:"Start Investing.it", btn4:"Start trading.it"},
        {testRailId: "@25215", tradeType: 'trade', investType: 'invest', platform: "https://naga.com/eu", language:'Español', btn1:'LoginBtn.es', btn2:"GetStarted.es", btn3:"Start Investing.es", btn4:"Start trading.es"},
        {testRailId: "@25215", tradeType: 'trade', investType: 'invest', platform: "https://naga.com/eu", language:'Polski', btn1:'LoginBtn.pl', btn2:"GetStarted.pl", btn3:"Start Investing.pl", btn4:"Start trading.pl"},
        {testRailId: "@25215", tradeType: 'trade', investType: 'invest', platform: "https://naga.com/eu", language:'Čeština', btn1:'LoginBtn.cz', btn2:"GetStarted.cz", btn3:"Start Investing.cz", btn4:"Start trading.cz"},
        {testRailId: "@25215", tradeType: 'trade', investType: 'invest', platform: "https://naga.com/eu", language:'Nederlands', btn1:'LoginBtn.ne', btn2:"GetStarted.ne", btn3:"Start Investing.ne", btn4:"Start trading.ne"},
        {testRailId: "@25215", tradeType: 'trade', investType: 'invest', platform: "https://naga.com/eu", language:'Português', btn1:'LoginBtn.po', btn2:"GetStarted.po", btn3:"Start Investing.po", btn4:"Start trading.po"},
        {testRailId: "@25216", tradeType: 'Trade', investType: 'Invest', platform: "https://naga.com/en", language:'Español (Latam)', btn1:'LoginBtn.lat', btn2:"GetStarted.lat", btn3:"Start Investing.lat", btn4:"Start trading.lat"},
        {testRailId: "@25216", tradeType: 'Trade', investType: 'Invest', platform: "https://naga.com/en", language:'Português', btn1:'LoginBtn.por', btn2:"GetStarted.por", btn3:"Start Investing.por", btn4:"Start trading.por"},
        {testRailId: "@25216", tradeType: 'Trade', investType: 'Invest', platform: "https://naga.com/en", language:'العربية', btn1:'LoginBtn.ar', btn2:"GetStarted.ar", btn3:"Start Investing.ar", btn4:"Start trading.ar"},
        {testRailId: "@25216", tradeType: 'Trade', investType: 'Invest', platform: "https://naga.com/en", language:'Bahasa Indonesia', btn1:'LoginBtn.ind', btn2:"GetStarted.ind", btn3:"Start Investing.ind", btn4:"Start trading.ind"},
        {testRailId: "@25216", tradeType: 'Trade', investType: 'Invest', platform: "https://naga.com/en", language:'简化字', btn1:'LoginBtn.chi', btn2:"GetStarted.chi", btn3:"Start Investing.chi", btn4:"Start trading.chi"},
        {testRailId: "@25216", tradeType: 'Trade', investType: 'Invest', platform: "https://naga.com/en", language:'繁體中文', btn1:'LoginBtn.chiGlobal', btn2:"GetStarted.chiGlobal", btn3:"Start Investing.chiGlobal", btn4:"Start trading.chiGlobal"},
    ]
    for(const{testRailId,platform,language,btn1,btn2,btn3,btn4,tradeType,investType}of translationParams){
        test(`${testRailId} Localization of main buttons-${platform}. ${language} language`,{tag: '@website-naga.com'}, async({page}, testInfo)=>{
            await testInfo.setTimeout(testInfo.timeout + 80000);
            let website = new NagaCom(page)
            let localization = new getLocalization("/pageObjects/localization/Website_Naga.com_translations.json")
            await test.step(`Open ${platform} ans switch to ${language}`, async()=>{
                await website.open(platform)
                await website.switchLanguageTo(language);
            })
            await test.step(`Check ${tradeType} page buttons`, async()=>{
                await website.checkTradeInstrument(`${tradeType}`)
                expect(await website.getBtnHeaderText(await localization.getTranslation(btn1))).toBeVisible()
                expect(await website.getBtnHeaderText(await localization.getTranslation(btn2))).toBeVisible()
                expect(await website.getMainPageBtntext(await localization.getTranslation(btn4))).toBeVisible()
            })
            await test.step(`Check ${investType} page buttons`, async()=>{
                await website.checkTradeInstrument(`${investType}`)
                expect(await website.getBtnHeaderText(await localization.getTranslation(btn1))).toBeVisible()
                expect(await website.getBtnHeaderText(await localization.getTranslation(btn2))).toBeVisible()
                expect(await website.getMainPageBtntext(await localization.getTranslation(btn3))).toBeVisible()
            })})}

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
        test(`${testRailId} Localization of main buttons, Language-${language} on ${platform}, ${type}`,{tag: '@website-naga.com'}, async({page}, testInfo)=>{
            await testInfo.setTimeout(testInfo.timeout + 20000);
            let website = new NagaCom(page)
            let localization = new getLocalization("/pageObjects/localization/Website_Naga.com_translations.json")
            await test.step(`Open ${platform} ans switch to ${language}`, async()=>{
                await website.open(platform)
                await website.checkTradeInstrument(`${type}`)
                await website.switchLanguageTo(language);
            })
            await test.step(`Check main button ${type} page`, async()=>{
                expect(await website.getBtnHeaderText(await localization.getTranslation(btn1))).toBeVisible()
                expect(await website.getBtnHeaderText(await localization.getTranslation(btn2))).toBeVisible()
            })})}

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
        test(`${testRailId} Localization of main buttons, Language-${language} on ${platform}, Pay page`,{tag: '@website-naga.com'}, async({page}, testInfo)=>{
            await testInfo.setTimeout(testInfo.timeout + 20000);
            let website = new NagaCom(page)
            let localization = new getLocalization("/pageObjects/localization/Website_Naga.com_translations.json")
            await test.step(`Open ${platform} ans switch to ${language}`, async()=>{
                await website.open(platform)
                await website.checkTradeInstrument(`${type}`)
                await website.switchLanguageTo(language);
            })
            await test.step(`Check main button ${type} page`, async()=>{
                expect(await website.getBtnHeaderTextPay(await localization.getTranslation(btn1))).toBeVisible()
            })
        })}

    type pdfTypes = {
        testRailId: string,
        type: string,
        platform: string,
        documents: string[]
    }

    const pdfParams: pdfTypes[] = [
        {testRailId: "@25218", type:'trade', platform:'https://naga.com/eu/legal-documentation', documents: ["AML and Account Verification Policy", 'Client Agreement', 'Client Categorization Policy','Cost and Charges Policy','Privacy Policy']},
        {testRailId: "@25217", type:'Trade', platform:'https://naga.com/en/legal-documentation', documents: ["Client Agreement", 'Privacy Policy','Cost and Charges Policy','FATCA']}
    ]
    for(const{testRailId, type, platform, documents}of pdfParams){
        test(`${testRailId} Check legal documents on ${type} page. Base url ${platform}`,{tag: '@website-naga.com'}, async({page}, testInfo)=>{
            await testInfo.setTimeout(testInfo.timeout + 40000);
            let website = new NagaCom(page);
            await test.step(`Open ${platform}`, async()=>{
                await website.open(platform)
            })
            await test.step('Check documents in popup', async()=>{
                for(let index in documents){
                    await website.openLegalDocument(documents[index])
                    expect(await website.getPopupHeader()).toEqual(documents[index])
                    expect(await website.checkDocumentVisibility(`${type}`, `${documents[index]}`, 'name')).toBeVisible()
                    expect(await website.checkDocumentVisibility(`${type}`, `${documents[index]}`, 'updated')).toBeVisible()
                    expect(await website.checkDocumentVisibility(`${type}`, `${documents[index]}`, 'year')).toBeVisible()
                    await website.closePopup()
                }})})
    }
})
