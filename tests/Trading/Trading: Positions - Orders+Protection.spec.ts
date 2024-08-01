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
import { test } from "../../test-options";

test.describe("Trading + trading protection", async () => {
type tradingTypesWithProtection = {
  testRailId: string,
  brand: string,
  user: string,
  investDirection: string,
  protection: string,
  tradeField: string
}
let tradingInstrument = "Dogecoin/USD";
let NagaProtectionValue;

const tradingParametersPositionsSL: tradingTypesWithProtection[] = [
  {testRailId: '@25165', brand: '@NS', user:'testTrading2', investDirection:'Short', protection: 'Stop Loss',tradeField: 'sl'},
  {testRailId: '@25160', brand: '@NS', user:'testTrading2', investDirection:"Long", protection: 'Take profit',tradeField: 'tp'},
  {testRailId: '@25166', brand: '@NM', user:'testTrading2Markets', investDirection:'Short', protection: 'Stop Loss', tradeField:'sl'},
  {testRailId: '@25017', brand: '@NM', user:'testTrading2Markets', investDirection:'Long', protection: 'Take profit', tradeField:'tp'},
]
for(const{testRailId, brand, user, investDirection, protection,tradeField} of tradingParametersPositionsSL){
  test(`${testRailId} Open/Close Short/Long position + Stop loss/Take profit ${brand} ${user} ${investDirection} ${protection} ${tradeField}`, async ({ page}) => {
    let sighIn = new SighIn(page);
    let mainPage = new MainPage(page);
    let myTrades = new MyTrades(page);
    let instruments = new AllInstruments(page);
    let newPosition = new NewPosition(page);
    let successPopup = new ClosePositionSuccessPopup(page);
    await test.step("Login to platfotm", async () => {
      await sighIn.goto(await sighIn.chooseBrand(brand), "login");
      await sighIn.sigInUserToPlatform(user, process.env.USER_PASSWORD || "");
    });
    await test.step("Check previously opened positions and close if they exist", async () => {
      await mainPage.openHeaderMenuPoint("my-trades");
      await myTrades.closePositionsIfExist();
    });
    await test.step("Choose instrument and open position", async () => {
      await mainPage.openHeaderMenuPoint("markets");
      await instruments.searchInstrument(tradingInstrument);
      await instruments.openPosition(investDirection);
    });
    await test.step("Open short position + Stop Loss", async () => {
      await newPosition.enableProtection(protection)
      NagaProtectionValue = await newPosition.getProtectionValue(protection)
      await newPosition.submitPosition();
    });
    await test.step("Check My-trades popup", async () => {
      await mainPage.openHeaderMenuPoint("my-trades");
      expect(await myTrades.checkStatusOfElement(await myTrades.activeTradesTab)).toContain("active");
      expect(await myTrades.getProtectionValue(tradeField)).toContain(NagaProtectionValue)
    });
    await test.step('Close position and check sucses popup', async()=>{
      await myTrades.closePosition()
      await successPopup.acceptPopup()
    })
  })}

  const tradingParametersOrders: tradingTypesWithProtection[] = [
    {testRailId: '@25167', brand: '@NS', user:'testTrading2', investDirection:'Short', protection: 'Stop Loss',tradeField: 'sl'},
    {testRailId: '@25169', brand: '@NS', user:'testTrading2', investDirection:"Long", protection: 'Take profit',tradeField: 'tp'},
    {testRailId: '@25171', brand: '@NM', user:'testTrading2Markets', investDirection:'Short', protection: 'Stop Loss', tradeField:'sl'},
    {testRailId: '@25170', brand: '@NM', user:'testTrading2Markets', investDirection:'Long', protection: 'Take profit', tradeField:'tp'}
  ]
  for(const{testRailId, brand, user, investDirection, protection, tradeField}of tradingParametersOrders){
    test(`${testRailId} Open/Close pending Short/Long posiotion+StopLoss/TakeProfit`, async({page})=>{
      let sighIn = new SighIn(page);
      let mainPage = new MainPage(page);
      let myTrades = new MyTrades(page);
      let instruments = new AllInstruments(page);
      let newPosition = new NewPosition(page);
      let successPopup = new ClosePositionSuccessPopup(page);
      await test.step("Login to platfotm", async () => {
        await sighIn.goto(await sighIn.chooseBrand(brand), "login");
        await sighIn.sigInUserToPlatform(user, process.env.USER_PASSWORD || "");
      });
      await test.step("Check previously opened orders and close if they exist", async () => {
        await mainPage.openHeaderMenuPoint("my-trades");
        await myTrades.openActivePendingOrdersTab();
        await myTrades.removeOrdersIfExist();
      });
      await test.step("Choose instrument and open position", async () => {
        await mainPage.openHeaderMenuPoint("markets");
        await instruments.searchInstrument(tradingInstrument);
        await instruments.openPosition(investDirection);
      });
      await test.step("Open short position + Stop Loss", async () => {
        await newPosition.chooseBtn(await newPosition.ratePositionBtn(`${investDirection} at Specific Rate`))
        await newPosition.enableProtection(protection)
        NagaProtectionValue = await newPosition.getProtectionValue(protection)
        await newPosition.submitPosition();
      });
      await test.step("Check My-trades popup", async () => {
        await mainPage.openHeaderMenuPoint("my-trades");
        await myTrades.openActivePendingOrdersTab();
        expect(await myTrades.checkStatusOfElement(await myTrades.activePendingOrdersTab)).toContain("active");
        expect(await myTrades.getProtectionValue(tradeField)).toContain(NagaProtectionValue)
      });
      await test.step('Close position and check sucses popup', async()=>{
        await myTrades.closePosition()
        await successPopup.acceptPopup()
      })
      })
  }
  
})
