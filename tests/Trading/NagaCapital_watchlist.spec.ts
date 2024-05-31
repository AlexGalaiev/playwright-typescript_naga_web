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
        await test.step("Choose instrument and add to warchlist", async()=>{
            await watchlist.searchInstrument(tradeInstrument);
            await watchlist.addToWatchlist(tradeInstrument)
        })
        await test.step("Check watchlist", async()=>{
            await watchlist.openWatclistTab();
            await watchlist.getWatchlistedInstrumentName() === tradeInstrument;
            await watchlist.removeInstrumentFromWatclist();
            await localization.getLocalizationText("Empty_watchlist_header") === await watchlist.getEmptyWatchlistHeader()
            await localization.getLocalizationText("Empty_watchlist_text") === await watchlist.getEmptyWatchlistText()
        })
    })
    test("@23678 Price alerts", async({page})=>{
        let tradeInstrument = "EUR/USD"
        let localization = new getLocalization(localization_trading)
        let watchlist = new AllInstruments(page);
        let priceAlert = new PriceAlert(page)
        await test.step("Choose instrument and add price alert", async()=>{
            await watchlist.searchInstrument(tradeInstrument);
            await watchlist.addPriceAlertToInstrumnet();
        })
        await test.step("Set up price alert", async()=>{
            await priceAlert.getInstrumentName() === tradeInstrument
            await priceAlert.installPriceAlertParameters();
            await priceAlert.installRisesBy();
            await priceAlert.clickSetPriceAlert()
        })
        await test.step("Check price alert tab", async()=>{
            await priceAlert.getInstrumentNameFromTab() === tradeInstrument
            await priceAlert.getAlertType() === "It raises by 100%"
            await priceAlert.removePriceAlert()
            await priceAlert.getEmptyPriceAlertTabHeader() === await localization.getLocalizationText("EmptyPriceAlertTab_Header")
            await priceAlert.getEmptyPriceAlertTabDescription() === await localization.getLocalizationText("EmptyPriceAlertTab_Description")
        })
    })
})
