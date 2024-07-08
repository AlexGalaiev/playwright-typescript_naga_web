import { expect } from "@playwright/test";
import { MainPage } from "../../pageObjects/MainPage/MainPage";
import { SighIn } from "../../pageObjects/SighIn/SignInPage";
import { ChangeLimitSuccessPopup } from "../../pageObjects/Trading/ChangeLimitResultPopup";
import { ChangeLimitsPopup } from "../../pageObjects/Trading/ChangeLimitsPopup";
import { ClosePositionSuccessPopup } from "../../pageObjects/Trading/closePositionSuccessPopup";
import { AllInstruments } from "../../pageObjects/Trading/InstrumentsPage";
import { MyTrades } from "../../pageObjects/Trading/MyTrades";
import { NewPosition } from "../../pageObjects/Trading/OpenNewPositionPage";
import { TradeDetails } from "../../pageObjects/Trading/TradeDetails";
import{test} from "..//..//test-options"

test.describe("Naga Capital. Trading", async()=>{
    test.beforeEach("Login to platform", async({page, NagaCapital})=>{
        let sighIn = new SighIn(page);
        let mainPage = new MainPage(page)
        let myTraders = new MyTrades(page)
        await test.step("Login to platfotm", async()=>{
            await sighIn.goto(NagaCapital, "login");
            await sighIn.sigInUserToPlatform("testTrading2", process.env.USER_PASSWORD || '');
        })
        await test.step("Check previously opened orders", async()=>{
            await new MainPage(page).openHeaderMenuPoint('my-trades');
            await myTraders.openActivePendingOrdersTab()
            await myTraders.removeOrdersIfExist()
        })
        await mainPage.openHeaderMenuPoint('markets');
    })

    test("@25016 Open pending Short order+stop loss", async({page})=>{
        let tradingInstrument = "Dogecoin/EUR"
        let instruments = new AllInstruments(page)
        let newPosition = new NewPosition(page)
        let myTrades = new MyTrades(page);
        let changeLimitPopup = new ChangeLimitsPopup(page);
        let changeLimitPopupResult = new ChangeLimitSuccessPopup(page);
        let tradeDetails = new TradeDetails(page);
        let successPopup = new ClosePositionSuccessPopup(page)
        await test.step("Choose instrument", async()=>{
            await instruments.searchInstrument(tradingInstrument);
            await instruments.openShortPosition();
        });
        await test.step("Open short pending order", async()=>{
            await newPosition.openShortOrder();
            await newPosition.submitPosition()
        })
        await test.step("Check My-trades", async()=>{
            await new MainPage(page).openHeaderMenuPoint('my-trades');
            await myTrades.openActivePendingOrdersTab();
            expect(await myTrades.checkActiveOrdersHasAttribute()).toContain('active')
        })
        await test.step("Check change limit of opened position and close position", async()=>{
            let units = await myTrades.getOrderUnits()
            let stopLoss = await myTrades.getOrderStopLoss();
            await test.step("Check change limit popup and enable Stop Loss", async()=>{
                await myTrades.openChangeLimitPopup();
                expect(await changeLimitPopup.getInstrumentName()).toContain(tradingInstrument);
                await changeLimitPopup.enableStopLoss();
            })
            await test.step("Check change limit popup", async()=>{
                expect(await changeLimitPopupResult.getDirection()).toEqual("SELL STOPPrice will fall");
                expect(await changeLimitPopupResult.getLotsAmount()).toContain(units);
                expect(await changeLimitPopupResult.getStopLossValue()).not.toEqual(stopLoss)
                await changeLimitPopupResult.acceptPopup();
            })
            await test.step("Check trade details", async()=>{
                await myTrades.openTradeDetails();
                expect(await tradeDetails.getLots()).toEqual(units);
                await tradeDetails.clickCloseTrade();
                await tradeDetails.clickCloseTradeConfirm()
            })  
            await test.step("Check success popup", async()=>{
                expect(await successPopup.getLots()).toContain(units);
                await successPopup.acceptPopup()
            })
        })})

        test("@25015 Open pending Long order + Take profit", async({page})=>{
            let tradingInstrument = "Dogecoin/EUR"
            let instruments = new AllInstruments(page)
            let newPosition = new NewPosition(page)
            let myTrades = new MyTrades(page);
            let changeLimitPopup = new ChangeLimitsPopup(page);
            let changeLimitPopupResult = new ChangeLimitSuccessPopup(page);
            let tradeDetails = new TradeDetails(page);
            let successPopup = new ClosePositionSuccessPopup(page)
            await test.step("Choose instrument", async()=>{
                await instruments.searchInstrument(tradingInstrument);
                await instruments.openLongPosition();
            });
            await test.step("Open short pending order", async()=>{
                await newPosition.openLongOrder();
                await newPosition.submitPosition()
            })
            await test.step("Check My-trades", async()=>{
                await new MainPage(page).openHeaderMenuPoint('my-trades');
                await myTrades.openActivePendingOrdersTab();
                expect(await myTrades.checkActiveOrdersHasAttribute()).toContain('active')
            })
            await test.step("Check change limit of opened position and close position", async()=>{
                let units = await myTrades.getOrderUnits()
                let stopLoss = await myTrades.getOrderTakeProfit();
                await test.step("Check change limit popup and enable Stop Loss", async()=>{
                    await myTrades.openChangeLimitPopup();
                    expect(await changeLimitPopup.getInstrumentName()).toContain(tradingInstrument);
                    await changeLimitPopup.enableTakeProgit();
                })
                await test.step("Check change limit popup", async()=>{
                    expect(await changeLimitPopupResult.getDirection()).toEqual("BUY LIMITPrice will rise");
                    expect(await changeLimitPopupResult.getLotsAmount()).toContain(units);
                    expect(await changeLimitPopupResult.getTakeProfitValue()).not.toEqual(stopLoss)
                    await changeLimitPopupResult.acceptPopup();
                })
                await test.step("Check trade details", async()=>{
                    await myTrades.openTradeDetails();
                    expect(await tradeDetails.getLots()).toEqual(units);
                    await tradeDetails.clickCloseTrade();
                    await tradeDetails.clickCloseTradeConfirm()
                })  
                await test.step("Check success popup", async()=>{
                    expect(await successPopup.getLots()).toContain(units);
                    await successPopup.acceptPopup()
                })
            })})
    })
