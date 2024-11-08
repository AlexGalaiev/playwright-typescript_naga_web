import { expect } from "@playwright/test";
import { MainPage } from "../../pageObjects/MainPage/MainPage";
import { SignIn } from "../../pageObjects/SignIn/SignInPage";
import { ChangeLimitSuccessPopup } from "../../pageObjects/Trading/ChangeLimitResultPopup";
import { ChangeLimitsPopup } from "../../pageObjects/Trading/ChangeLimitsPopup";
import { ClosePositionSuccessPopup } from "../../pageObjects/Trading/closePositionSuccessPopup";
import { AllInstruments } from "../../pageObjects/Trading/InstrumentsPage";
import { MyTrades } from "../../pageObjects/Trading/MyTrades";
import { NewPosition } from "../../pageObjects/Trading/OpenNewPositionPage";
import { TradeDetails } from "../../pageObjects/Trading/TradeDetails";
import { test } from "..//..//test-options";

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
  test(`${testRailId} Open/Close position + Protection ${brand} ${user} ${investDirection} ${protection} ${tradeField}`, async ({ page}) => {
    let sighIn = new SignIn(page);
    let mainPage = new MainPage(page);
    let myTrades = new MyTrades(page);
    let instruments = new AllInstruments(page);
    let newPosition = new NewPosition(page);
    let successPopup = new ClosePositionSuccessPopup(page);
    await test.step("Login to platfotm", async () => {
      await sighIn.goto(await sighIn.chooseBrand(brand), "login");
      await sighIn.signInUserToPlatform(user, process.env.USER_PASSWORD || "");
    });
    await test.step("Check previously opened positions and close if they exist", async () => {
      await mainPage.openHeaderMenuPoint("my-trades");
      await myTrades.closePositionsIfExist();
    });
    await test.step("Choose instrument and open position", async () => {
      await mainPage.openHeaderMenuPoint("markets");
      await instruments.searchInstrument(tradingInstrument);
      await instruments.openPosition('Short');
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
})

}})
//   test("@25015 Open pending Long order + Take profit", async ({ page }) => {
//     let tradingInstrument = "Dogecoin/EUR";
//     let instruments = new AllInstruments(page);
//     let newPosition = new NewPosition(page);
//     let myTrades = new MyTrades(page);
//     let changeLimitPopup = new ChangeLimitsPopup(page);
//     let changeLimitPopupResult = new ChangeLimitSuccessPopup(page);
//     let tradeDetails = new TradeDetails(page);
//     let successPopup = new ClosePositionSuccessPopup(page);
//     await test.step("Choose instrument", async () => {
//       await instruments.searchInstrument(tradingInstrument);
//       await instruments.openPosition('Long');
//     });
//     await test.step("Open short pending order", async () => {
//       await newPosition.openLongOrder();
//       await newPosition.submitPosition();
//     });
//     await test.step("Check My-trades", async () => {
//       await new MainPage(page).openHeaderMenuPoint("my-trades");
//       await myTrades.openActivePendingOrdersTab();
//       expect(await myTrades.checkStatusOfElement(await myTrades.activePendingOrdersTab)).toContain(
//         "active"
//       );
//     });
//     await test.step("Check change limit of opened position and close position", async () => {
//       let units = await myTrades.getOrderUnits();
//       let stopLoss = await myTrades.getOrderTakeProfit();
//       await test.step("Check change limit popup and enable Stop Loss", async () => {
//         await myTrades.openChangeLimitPopup();
//         expect(await changeLimitPopup.getInstrumentName()).toContain(
//           tradingInstrument
//         );
//         await changeLimitPopup.enableTakeProgit();
//       });
//       await test.step("Check change limit popup", async () => {
//         expect(await changeLimitPopupResult.getDirection()).toEqual(
//           "BUY LIMITPrice will rise"
//         );
//         expect(await changeLimitPopupResult.getLotsAmount()).toContain(units);
//         expect(await changeLimitPopupResult.getTakeProfitValue()).not.toEqual(
//           stopLoss
//         );
//         await changeLimitPopupResult.acceptPopup();
//       });
//       await test.step("Check trade details", async () => {
//         await myTrades.openTradeDetails();
//         expect(await tradeDetails.getLots()).toEqual(units);
//         await tradeDetails.clickCloseTrade();
//         await tradeDetails.clickCloseTradeConfirm();
//       });
//       await test.step("Check success popup", async () => {
//         expect(await successPopup.getLots()).toContain(units);
//         await successPopup.acceptPopup();
//       });
//     });
//   });
// });
