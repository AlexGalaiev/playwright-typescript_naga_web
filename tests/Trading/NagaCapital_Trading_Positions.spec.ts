import { expect } from "@playwright/test";
import { MainPage } from "../../pageObjects/MainPage/MainPage";
import { SighIn } from "../../pageObjects/SighIn/SignInPage";
import { AllInstruments } from "../../pageObjects/Trading/InstrumentsPage";
import { MyTrades } from "../../pageObjects/Trading/MyTrades";
import { NewPosition } from "../../pageObjects/Trading/OpenNewPositionPage";
import {test} from "../../test-options"
import { ChangeLimitsPopup } from "../../pageObjects/Trading/ChangeLimitsPopup";
import { ChangeLimitSuccessPopup } from "../../pageObjects/Trading/ChangeLimitResultPopup";
import { TradeDetails } from "../../pageObjects/Trading/TradeDetails";
import { ClosePositionSuccessPopup } from "../../pageObjects/Trading/closePositionSuccessPopup";

test.describe("Naga Capital. Trading", async()=>{
    test.beforeEach("Login to platform", async({page, NagaCapital})=>{
        let sighIn = new SighIn(page);
        let mainPage = new MainPage(page)
        await test.step("Login to platfotm", async()=>{
            await sighIn.goto(NagaCapital, "login");
            await sighIn.sigInUserToPlatform("testTrading2", process.env.USER_PASSWORD || '');
        })
        await test.step("Check previously opened positions", async()=>{
            await new MainPage(page).chooseMyTradesMenuPoint();
            await new MyTrades(page).closePositionsIfExist()
        })
        await mainPage.chooseTradeMenuPoint();
    })

    test("@23675 Open short position+Stop loss", async({page})=>{
        let tradingInstrument = "AUD/CAD"
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
        })
        await test.step("Open short position", async()=>{
            await newPosition.increaseInvestmentValue();
            await newPosition.submitPosition()
        })
        await test.step("Check My-trades", async()=>{
            await new MainPage(page).chooseMyTradesMenuPoint();
            expect(await myTrades.checkActiveTradesHasAttribute()).toContain('active')
        })
        await test.step("Check change limit of opened position and close position", async()=>{
            let depositValue = await myTrades.getDepositValue();
            let units = await myTrades.getUnits()
            let stopLoss = await myTrades.getStopLoss();
            await test.step("Check change limit popup and enable Stop Loss", async()=>{
                await myTrades.openChangeLimitPopup();
                await changeLimitPopup.getInstrumentName() === tradingInstrument;
                await changeLimitPopup.getInvestedAmount() === depositValue;
                await changeLimitPopup.enableStopLoss();
            })
            await test.step("Check change limit popup", async()=>{
                await changeLimitPopupResult.getInvesctmentsAmount() === depositValue;
                await changeLimitPopupResult.getLotsAmount() === units;
                await changeLimitPopupResult.getStopLossValue() !== stopLoss
                await changeLimitPopupResult.acceptPopup();
            })
            await test.step("Check trade details", async()=>{
                await myTrades.openTradeDetails();
                await tradeDetails.getDepositAmount() === depositValue;
                await tradeDetails.getLots() === units;
                await tradeDetails.clickCloseTrade();
                await tradeDetails.clickCloseTradeConfirm()
            })  
            await test.step("Check success popup", async()=>{
                await successPopup.getDeposit() === depositValue
                await successPopup.getLots() === units;
                await successPopup.acceptPopup()
            })
        })
    })
})
