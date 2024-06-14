import { expect } from "@playwright/test";
import { getLocalization } from "../../pageObjects/localization/getText";
import { MainPage } from "../../pageObjects/MainPage/MainPage";
import { SighIn } from "../../pageObjects/SighIn/SignInPage";
import { AllInstruments } from "../../pageObjects/Trading/InstrumentsPage";
import { PriceAlert } from "../../pageObjects/Trading/PriceAlertsPage";
import {test} from "..//..//test-options"

let localization_trading = "/pageObjects/localization/NagaCapital_Trading.json"

test.describe("NagaCapital", async()=>{
    test.beforeEach("Login by trading account", async({page, NagaCapital})=>{
        let sighIn = new SighIn(page);
        await sighIn.goto(NagaCapital, "login");
        await sighIn.sigInUserToPlatform("testTrading", process.env.USER_PASSWORD || '');
        await new MainPage(page).chooseTradeMenuPoint();
    })
    test("@23674 Add to watchlist", async({page})=>{
        let tradeInstrument = "EUR/USD"
        let localization = new getLocalization(localization_trading)
        let watchlist = new AllInstruments(page);
        await test.step("Check watchlist and clean", async()=>{
            await watchlist.openWatclistTab();
            await watchlist.cleanWatchlist()
        })
        await test.step("Choose instrument and add to warchlist", async()=>{
            await watchlist.searchInstrument(tradeInstrument);
            await watchlist.addToWatchlist(tradeInstrument)
        })
        await test.step("Check watchlist", async()=>{
            await watchlist.openWatclistTab();
            expect(await watchlist.getWatchlistedInstrumentName()).toEqual(tradeInstrument);
            await watchlist.removeInstrumentFromWatclist();
            expect(await localization.getLocalizationText("Empty_watchlist_header")).toEqual(await watchlist.getEmptyWatchlistHeader())
            expect(await localization.getLocalizationText("Empty_watchlist_text")).toEqual(await watchlist.getEmptyWatchlistText())
        })
    })
    test("@23678 Price alerts", async({page, NagaCapital})=>{
        let tradeInstrument = "EUR/USD"
        let localization = new getLocalization(localization_trading)
        let watchlist = new AllInstruments(page);
        let priceAlert = new PriceAlert(page)
        await test.step("Check price alert and clean", async()=>{
            await new SighIn(page).goto(NagaCapital, "price-alerts");
            await priceAlert.cleanPriceAlerts()
            await new MainPage(page).chooseTradeMenuPoint();
        })
        await test.step("Choose instrument and add price alert", async()=>{
            await watchlist.searchInstrument(tradeInstrument);
            await watchlist.addPriceAlertToInstrumnet();
        })
        await test.step("Set up price alert", async()=>{
            expect(await priceAlert.getInstrumentName()).toContain(tradeInstrument)
            await priceAlert.installPriceAlertParameters();
            await priceAlert.installRisesBy();
            await priceAlert.clickSetPriceAlert()
        })
        await test.step("Check price alert tab", async()=>{
            expect(await priceAlert.getInstrumentNameFromTab()).toContain(tradeInstrument)
            expect(await priceAlert.getAlertType()).toContain("It raises by 100%")
            await priceAlert.removePriceAlert()
            expect(await priceAlert.getEmptyPriceAlertTabHeader()).toEqual(await localization.getLocalizationText("EmptyPriceAlertTab_Header"))
            expect(await priceAlert.getEmptyPriceAlertTabDescription()).toEqual(await localization.getLocalizationText("EmptyPriceAlertTab_Description"))
        })
    })
})
