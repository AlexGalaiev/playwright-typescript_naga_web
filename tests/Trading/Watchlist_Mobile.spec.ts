import { expect } from "@playwright/test";
import { getLocalization } from "../../pageObjects/localization/getText";
import { MainPage } from "../../pageObjects/MainPage/MainPage";
import { SignIn } from "../../pageObjects/SignIn/SignInPage";
import { AllInstruments } from "../../pageObjects/Trading/InstrumentsPage";
import { PriceAlert } from "../../pageObjects/Trading/PriceAlertsPage";
import {test} from "../../test-options"
import { NewPosition } from "../../pageObjects/Trading/OpenNewPositionPage";

test.describe('Trading features Mobile', async()=>{

    type testTypes = {
        testRailId: string,
        brand: string,
        user: string,
        localization: string
    }
    
    const AddWatchlistPatameters: testTypes[] = [
        {testRailId: '@23951', brand: '@Capital', user: 'testTrading3', localization: '/pageObjects/localization/NagaCapital_Trading.json'},
        {testRailId: '@23674', brand: '@Markets', user: 'testTrading2Markets', localization: '/pageObjects/localization/NagaMarkets_Trading.json'},
        {testRailId: '@25379', brand: '@Mena', user: 'testTrading@naga.com', localization: '/pageObjects/localization/NagaMarkets_Trading.json'},
        {testRailId: '@25418', brand: '@Africa', user: 'testTradingAfrica@naga.com', localization: '/pageObjects/localization/NagaMarkets_Trading.json'}
    ]
    for(const{testRailId, brand, user, localization}of AddWatchlistPatameters){
        test(`${testRailId} Mobile Add/Remove from Favorites ${brand}`,{tag:['@trading','@mobile']}, async({page, AppNAGA}, testInfo)=>{
            testInfo.setTimeout(testInfo.timeout + 20000);
            let signIn = new SignIn(page);
            let tradeInstrument = "EUR/USD"
            let localizationPage = new getLocalization(localization)
            let watchlist = new AllInstruments(page);
            await test.step(`Login to ${brand} platform by ${user}`, async()=>{
                await signIn.goto(AppNAGA, "login");
                await signIn.signInUserToPlatform(user, process.env.USER_PASSWORD || '');
                await new MainPage(page).openMobileMenu('Trade');
            })        
            await test.step("Check watchlist and clean from opened positions if they exist", async()=>{
                await watchlist.openMobileFavorites();
                await watchlist.cleanMobileWatchlist()
            })
            await test.step(`Choose ${tradeInstrument} and add to watchlist`, async()=>{
                await watchlist.searchInstrument(tradeInstrument)
                await watchlist.addToMobileWatchlist(tradeInstrument)
                await watchlist.clearSearchField()
            })
            await test.step("Check instrument in watchlist. Remove instrument and check empty page", async()=>{
                await watchlist.openMobileFavorites()
                expect(await watchlist.getMobileWatchlistedInstrumentName()).toEqual(tradeInstrument);
                await watchlist.removeInstrumentFromWatclist();
                expect(await localizationPage.getLocalizationText("Empty_watchlist_header")).toEqual(await watchlist.getEmptyWatchlistHeader())
                expect(await localizationPage.getLocalizationText("Empty_watchlist_text")).toEqual(await watchlist.getEmptyWatchlistText())
            })
        })
    }

    const priceAlertParameters: testTypes[] = [
        {testRailId: '@23952', brand: '@Capital', user: 'testTrading3', localization: '/pageObjects/localization/NagaCapital_Trading.json'},
        {testRailId: '@23678', brand: '@Markets', user: 'testTrading2Markets', localization: '/pageObjects/localization/NagaMarkets_Trading.json'},
        {testRailId: '@25380', brand: '@Mena', user: 'testTrading@naga.com', localization: '/pageObjects/localization/NagaMarkets_Trading.json'},
        {testRailId: '@25419', brand: '@Africa', user: 'testTradingAfrica@naga.com', localization: '/pageObjects/localization/NagaMarkets_Trading.json'}
    ]
    for(const{testRailId, brand, user, localization}of priceAlertParameters){
        test(`${testRailId} Mobile Price alerts ${brand} ${user}`,{tag:['@trading','@mobile']}, async({page,AppNAGA}, testInfo)=>{
            testInfo.setTimeout(testInfo.timeout + 20000);
            let tradeInstrument = "EUR/USD"
            let localizationPage = new getLocalization(localization)
            let watchlist = new AllInstruments(page);
            let priceAlert = new PriceAlert(page)
            let signIn = new SignIn(page)
            let mainPage = new MainPage(page)
            await test.step(`Login to platform ${brand} by ${user}`, async()=>{
                await signIn.goto(AppNAGA, "login");
                await signIn.signInUserToPlatform(user, process.env.USER_PASSWORD || '');
            })     
            await test.step("Check price alert and clean if they exist", async()=>{
                await mainPage.openMobileBackMenuPoint('Price Alerts')
                await priceAlert.cleanMobilePriceAlerts()
            })
            await test.step(`Choose ${tradeInstrument} and add price alert`, async()=>{
                await mainPage.openMobileMenu('Trade')
                await watchlist.searchInstrument(tradeInstrument)
                await watchlist.addMobilePriceAlertToInstrumnet()
            })
            await test.step("Edit price alerts", async()=>{
                expect(await priceAlert.getInstrumentName()).toContain(tradeInstrument)
                await priceAlert.installPriceAlertParameters();
                await priceAlert.installRisesBy();
                await priceAlert.clickSetPriceAlert()
            })
            await test.step("Check price alert tab, remove price alerts and check empty screen", async()=>{
                await mainPage.openMobileBackMenuPoint('Price Alerts')
                expect(await priceAlert.getInstrumentNameFromTab()).toContain(tradeInstrument)
                expect(await priceAlert.getAlertType()).toContain("It raises by 100%")
                await priceAlert.cleanMobilePriceAlerts()
                expect(await priceAlert.getEmptyPriceAlertTabHeader()).toEqual(await localizationPage.getLocalizationText("EmptyPriceAlertTab_Header"))
                expect(await priceAlert.getEmptyPriceAlertTabDescription()).toEqual(await localizationPage.getLocalizationText("EmptyPriceAlertTab_Description"))
            })
    })}
})