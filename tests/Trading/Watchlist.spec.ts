import { expect } from "@playwright/test";
import { getLocalization } from "../../pageObjects/localization/getText";
import { MainPage } from "../../pageObjects/MainPage/MainPage";
import { SignIn } from "../../pageObjects/SignIn/SignInPage";
import { AllInstruments } from "../../pageObjects/Trading/InstrumentsPage";
import { PriceAlert } from "../../pageObjects/Trading/PriceAlertsPage";
import {test} from "../../test-options"

test.describe("Trading features", async()=>{

type testTypes = {
    testRailId: string,
    brand: string,
    user: string,
    localization: string
}

const AddWatchlistPatameters: testTypes[] = [
    {testRailId: '@23951', brand: '@NS', user: 'testTrading3', localization: '/pageObjects/localization/NagaCapital_Trading.json'},
    {testRailId: '@23674', brand: '@NM', user: 'testTrading2Markets', localization: '/pageObjects/localization/NagaMarkets_Trading.json'},
    {testRailId: '@25379', brand: '@NMena', user: 'testTrading@naga.com', localization: '/pageObjects/localization/NagaMarkets_Trading.json'}
]
for(const{testRailId, brand, user, localization}of AddWatchlistPatameters){
    test(`${testRailId} Add/Remove from Favorites ${brand}`,{tag:['@trading','@prodSanity']}, async({page}, testInfo)=>{
        await testInfo.setTimeout(testInfo.timeout + 20000);
        let signIn = new SignIn(page);
        let tradeInstrument = "Dogecoin/USD"
        let localizationPage = new getLocalization(localization)
        let watchlist = new AllInstruments(page);
        await test.step(`Login to ${brand} platform by ${user}`, async()=>{
            await signIn.goto(await signIn.chooseBrand(brand), "login");
            await signIn.signInUserToPlatform(user, process.env.USER_PASSWORD || '');
            await new MainPage(page).openHeaderMenuPoint('markets');
        })        
        await test.step("Check watchlist and clean from opened positions if they exist", async()=>{
            await watchlist.openWatclistTab();
            await watchlist.cleanWatchlist()
        })
        await test.step(`Choose ${tradeInstrument} and add to watchlist`, async()=>{
            await watchlist.searchInstrument(tradeInstrument);
            await watchlist.addToWatchlist(tradeInstrument)
            await watchlist.clearSearchField()
        })
        await test.step("Check instrument in watchlist. Remove instrument and check empty page", async()=>{
            //await watchlist.openWatclistTab();
            expect(await watchlist.getWatchlistedInstrumentName()).toEqual(tradeInstrument);
            await watchlist.removeInstrumentFromWatclist();
            expect(await localizationPage.getLocalizationText("Empty_watchlist_header")).toEqual(await watchlist.getEmptyWatchlistHeader())
            expect(await localizationPage.getLocalizationText("Empty_watchlist_text")).toEqual(await watchlist.getEmptyWatchlistText())
        })
    })
}

const priceAlertParameters: testTypes[] = [
    {testRailId: '@23952', brand: '@NS', user: 'testTrading3', localization: '/pageObjects/localization/NagaCapital_Trading.json'},
    {testRailId: '@23678', brand: '@NM', user: 'testTrading2Markets', localization: '/pageObjects/localization/NagaMarkets_Trading.json'},
    {testRailId: '@25380', brand: '@NMena', user: 'testTrading@naga.com', localization: '/pageObjects/localization/NagaMarkets_Trading.json'}
]
for(const{testRailId, brand, user, localization}of priceAlertParameters){
    test(`${testRailId} Price alerts ${brand} ${user}`,{tag:'@trading'}, async({page}, testInfo)=>{
        await testInfo.setTimeout(testInfo.timeout + 20000);
        let tradeInstrument = "Dogecoin/USD"
        let localizationPage = new getLocalization(localization)
        let watchlist = new AllInstruments(page);
        let priceAlert = new PriceAlert(page)
        let signIn = new SignIn(page)
        await test.step(`Login to platform ${brand} by ${user}`, async()=>{
            await signIn.goto(await signIn.chooseBrand(brand), "login");
            await signIn.signInUserToPlatform(user, process.env.USER_PASSWORD || '');
            await new MainPage(page).openHeaderMenuPoint('markets');
        })     
        await test.step("Check price alert and clean if they exist", async()=>{
            await signIn.goto(await signIn.chooseBrand(brand), "price-alerts");
            await priceAlert.cleanPriceAlerts()
            await new MainPage(page).openHeaderMenuPoint('markets');
        })
        await test.step(`Choose ${tradeInstrument} and add price alert`, async()=>{
            await watchlist.searchInstrument(tradeInstrument);
            await watchlist.addPriceAlertToInstrumnet();
        })
        await test.step("Edit price alerts", async()=>{
            expect(await priceAlert.getInstrumentName()).toContain(tradeInstrument)
            await priceAlert.installPriceAlertParameters();
            await priceAlert.installRisesBy();
            await priceAlert.clickSetPriceAlert()
        })
        await test.step("Check price alert tab, remove price alerts and check empty screen", async()=>{
            expect(await priceAlert.getInstrumentNameFromTab()).toContain(tradeInstrument)
            expect(await priceAlert.getAlertType()).toContain("It raises by 100%")
            await priceAlert.removePriceAlert()
            expect(await priceAlert.getEmptyPriceAlertTabHeader()).toEqual(await localizationPage.getLocalizationText("EmptyPriceAlertTab_Header"))
            expect(await priceAlert.getEmptyPriceAlertTabDescription()).toEqual(await localizationPage.getLocalizationText("EmptyPriceAlertTab_Description"))
        })
    })
}    
})
