import { expect } from "@playwright/test";
import { getLocalization } from "../../pageObjects/localization/getText";
import {test} from "../../test-options"

test.describe("WEB", async()=>{

type testTypes = {
    brand: string,
    user: string,
    localization: string
}

const AddWatchlistPatameters: testTypes[] = [
    { brand: '@Capital', user: 'testTrading3', localization: '/pageObjects/localization/NagaCapital_Trading.json'},
    { brand: '@Markets', user: 'testTrading2Markets', localization: '/pageObjects/localization/NagaMarkets_Trading.json'},
    { brand: '@Mena', user: 'testTrading@naga.com', localization: '/pageObjects/localization/NagaMarkets_Trading.json'},
    { brand: '@Africa', user: 'testTradingAfrica@naga.com', localization: '/pageObjects/localization/NagaMarkets_Trading.json'}
]
for(const{ brand, user, localization}of AddWatchlistPatameters){
    test(`${brand} Add/Remove from Favorites`,{tag:['@trading','@web']}, async({app, AppNAGA}, testInfo)=>{
        testInfo.setTimeout(testInfo.timeout + 20000);
        let tradeInstrument = "SOLUSD"
        let localizationPage = new getLocalization(localization)
        await test.step(`Login to ${brand} platform by ${user}`, async()=>{
            await app.signIn.goto(AppNAGA, "login");
            await app.signIn.signInUserToPlatform(user, process.env.USER_PASSWORD || '');
            await app.mainPage.openBackMenuPoint('trade');
        })        
        await test.step("Check watchlist and clean from opened positions if they exist", async()=>{
            await app.instruments.openWatclistTab();
            await app.instruments.cleanWatchlist()
        })
        await test.step(`Choose ${tradeInstrument} and add to watchlist`, async()=>{
            await app.instruments.searchInstrument(tradeInstrument)
            await app.instruments.addToWatchlist(tradeInstrument)
            await app.instruments.clearSearchField()
        })
        await test.step("Check instrument in watchlist. Remove instrument and check empty page", async()=>{
            await app.instruments.openWatclistTab()
            expect(await app.instruments.getWatchlistedInstrumentName()).toContain(tradeInstrument);
            await app.instruments.cleanWatchlist()
            expect(await localizationPage.getLocalizationText("Empty_watchlist_header")).toEqual(await app.instruments.getEmptyWatchlistHeader())
            expect(await localizationPage.getLocalizationText("Empty_watchlist_text")).toEqual(await app.instruments.getEmptyWatchlistText())
        })
    })
}

const priceAlertParameters: testTypes[] = [
    { brand: '@Capital', user: 'testTrading3', localization: '/pageObjects/localization/NagaCapital_Trading.json'},
    { brand: '@Markets', user: 'testTrading2Markets', localization: '/pageObjects/localization/NagaMarkets_Trading.json'},
    { brand: '@Mena', user: 'testTrading@naga.com', localization: '/pageObjects/localization/NagaMarkets_Trading.json'},
    { brand: '@Africa', user: 'testTradingAfrica@naga.com', localization: '/pageObjects/localization/NagaMarkets_Trading.json'}
]
for(const{ brand, user, localization}of priceAlertParameters){
    test(`Price alerts ${brand}`,{tag:['@trading', '@web']}, async({app,AppNAGA}, testInfo)=>{
        await testInfo.setTimeout(testInfo.timeout + 20000);
        let tradeInstrument = "EUR/USD"
        let localizationPage = new getLocalization(localization)
        await test.step(`Login to platform ${brand} by ${user}`, async()=>{
            await app.signIn.goto(AppNAGA, "login");
            await app.signIn.signInUserToPlatform(user, process.env.USER_PASSWORD || '');
            await app.mainPage.openBackMenuSubcategory('Trading Tools', 'Price Alerts');
        })     
        await test.step("Check price alert and clean if they exist", async()=>{
            await app.priceAlert.cleanPriceAlerts()
            await app.mainPage.openBackMenuPoint('trade');
        })
        await test.step(`Choose ${tradeInstrument} and add price alert`, async()=>{
            await app.instruments.searchInstrument(tradeInstrument);
            await app.instruments.addPriceAlertToInstrumnet();
        })
        await test.step("Edit price alerts", async()=>{
            expect(await app.priceAlert.getInstrumentName()).toContain(tradeInstrument)
            await app.priceAlert.installPriceAlertParameters();
            await app.priceAlert.installRisesBy();
            await app.priceAlert.clickSetPriceAlert()
        })
        await test.step("Check price alert tab, remove price alerts and check empty screen", async()=>{
            await app.mainPage.openBackMenuSubcategory('Trading Tools', 'Price Alerts')
            expect(await app.priceAlert.getInstrumentNameFromTab()).toContain(tradeInstrument)
            expect(await app.priceAlert.getAlertType()).toContain("It raises by 100%")
            await app.priceAlert.removePriceAlert()
            expect(await app.priceAlert.getEmptyPriceAlertTabHeader()).toEqual(await localizationPage.getLocalizationText("EmptyPriceAlertTab_Header"))
            expect(await app.priceAlert.getEmptyPriceAlertTabDescription()).toEqual(await localizationPage.getLocalizationText("EmptyPriceAlertTab_Description"))
        })
    })
}  
})
