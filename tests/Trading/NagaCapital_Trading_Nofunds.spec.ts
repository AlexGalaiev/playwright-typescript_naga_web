import { MainPage } from "../../pageObjects/MainPage/MainPage";
import { SighIn } from "../../pageObjects/SighIn/SignInPage";
import { AllInstruments } from "../../pageObjects/Trading/InstrumentsPage";
import { MyTrades } from "../../pageObjects/Trading/MyTrades";
import {test} from "..//..//test-options"

test.describe("NagaCapital. Trading", async()=>{
    test.skip("Login to platform", async({page, NagaCapital}, testinfo)=>{
        let sighIn = new SighIn(page);
        let mainPage = new MainPage(page)
        await test.step("Login to platfotm", async()=>{
            await sighIn.goto(NagaCapital, "login");
            await sighIn.sigInUserToPlatform("testTrading3", process.env.USER_PASSWORD || '');
        })
        await test.step("Check previously opened positions", async()=>{
            await new MainPage(page).chooseMyTradesMenuPoint();
            await new MyTrades(page).closePositionsIfExist()
        })
        await mainPage.chooseTradeMenuPoint();
    })
    test.skip("@25018 Open position without funds", async({page})=>{
        let tradingInstrument = "BTCEUR"
        let instruments = new AllInstruments(page)
        await test.step("Choose instrument", async()=>{
            await instruments.searchInstrument(tradingInstrument);
            await instruments.openShortPosition();
        })

    })
})