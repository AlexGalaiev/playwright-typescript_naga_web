import { expect } from "@playwright/test";
import { getLocalization } from "../../pageObjects/localization/getText";
import {test} from "../../test-options"

test.describe('Trading features Mobile', async()=>{

    type testTypes = {
        brand: string,
        user: string,
        localization: string
    }
    
    const AddWatchlistPatameters: testTypes[] = [
        {brand: '@Capital', user: 'testTrading3', localization: '/pageObjects/localization/NagaCapital_Trading.json'},
        {brand: '@Markets', user: 'testTrading2Markets', localization: '/pageObjects/localization/NagaMarkets_Trading.json'},
        {brand: '@Mena', user: 'testTrading@naga.com', localization: '/pageObjects/localization/NagaMarkets_Trading.json'},
        {brand: '@Africa', user: 'testTradingAfrica@naga.com', localization: '/pageObjects/localization/NagaMarkets_Trading.json'}
    ]
    for(const{ brand, user, localization}of AddWatchlistPatameters){
        test(`Mobile Add/Remove from Favorites ${brand}`,{tag:['@trading','@mobile']}, async({app, AppNAGA}, testInfo)=>{
            testInfo.setTimeout(testInfo.timeout + 20000);
            let tradeInstrument = "EUR/USD"
            let localizationPage = new getLocalization(localization)
            await test.step(`Login to ${brand} platform by ${user}`, async()=>{
                await app.signIn.goto(AppNAGA, "login");
                await app.signIn.signInUserToPlatform(user, process.env.USER_PASSWORD || '');
                await app.mainPage.openMobileMenu('Trade');
            })        
            await test.step("Check watchlist and clean from opened positions if they exist", async()=>{
                await app.instruments.openMobileFavorites();
                await app.instruments.cleanMobileWatchlist()
            })
            await test.step(`Choose ${tradeInstrument} and add to watchlist`, async()=>{
                await app.instruments.searchInstrument(tradeInstrument)
                await app.instruments.addToMobileWatchlist(tradeInstrument)
                await app.instruments.clearSearchField()
            })
            await test.step("Check instrument in watchlist. Remove instrument and check empty page", async()=>{
                await app.instruments.openMobileFavorites()
                expect(await app.instruments.getMobileWatchlistedInstrumentName()).toEqual(tradeInstrument);
                await app.instruments.removeInstrumentFromWatclist();
                expect(await localizationPage.getLocalizationText("Empty_watchlist_header")).toEqual(await app.instruments.getEmptyWatchlistHeader())
                expect(await localizationPage.getLocalizationText("Empty_watchlist_text")).toEqual(await app.instruments.getEmptyWatchlistText())
            })
        })
    }

    const priceAlertParameters: testTypes[] = [
        {brand: '@Capital', user: 'testTrading3', localization: '/pageObjects/localization/NagaCapital_Trading.json'},
        {brand: '@Markets', user: 'testTrading2Markets', localization: '/pageObjects/localization/NagaMarkets_Trading.json'},
        {brand: '@Mena', user: 'testTrading@naga.com', localization: '/pageObjects/localization/NagaMarkets_Trading.json'},
        {brand: '@Africa', user: 'testTradingAfrica@naga.com', localization: '/pageObjects/localization/NagaMarkets_Trading.json'}
    ]
    for(const{brand, user, localization}of priceAlertParameters){
        test(`Mobile Price alerts ${brand} ${user}`,{tag:['@trading','@mobile']}, async({app,AppNAGA}, testInfo)=>{
            testInfo.setTimeout(testInfo.timeout + 20000);
            let tradeInstrument = "EUR/USD"
            let localizationPage = new getLocalization(localization)
            await test.step(`Login to platform ${brand} by ${user}`, async()=>{
                await app.signIn.goto(AppNAGA, "login");
                await app.signIn.signInUserToPlatform(user, process.env.USER_PASSWORD || '');
            })     
            await test.step("Check price alert and clean if they exist", async()=>{
                await app.mainPage.openMobileBackMenuPoint('Price Alerts')
                await app.priceAlert.cleanMobilePriceAlerts()
            })
            await test.step(`Choose ${tradeInstrument} and add price alert`, async()=>{
                await app.mainPage.openMobileMenu('Trade')
                await app.instruments.searchInstrument(tradeInstrument)
                await app.instruments.addMobilePriceAlertToInstrumnet()
            })
            await test.step("Edit price alerts", async()=>{
                expect(await app.priceAlert.getInstrumentName()).toContain(tradeInstrument)
                await app.priceAlert.installPriceAlertParameters();
                await app.priceAlert.installRisesBy();
                await app.priceAlert.clickSetPriceAlert()
            })
            await test.step("Check price alert tab, remove price alerts and check empty screen", async()=>{
                await app.mainPage.openMobileBackMenuPoint('Price Alerts')
                expect(await app.priceAlert.getInstrumentNameFromTab()).toContain(tradeInstrument)
                expect(await app.priceAlert.getAlertType()).toContain("It raises by 100%")
                await app.priceAlert.cleanMobilePriceAlerts()
                expect(await app.priceAlert.getEmptyPriceAlertTabHeader()).toEqual(await localizationPage.getLocalizationText("EmptyPriceAlertTab_Header"))
                expect(await app.priceAlert.getEmptyPriceAlertTabDescription()).toEqual(await localizationPage.getLocalizationText("EmptyPriceAlertTab_Description"))
            })
    })}
})