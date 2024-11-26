// import { expect } from "@playwright/test";
// import { MainPage } from "../../pageObjects/MainPage/MainPage";
// import { SignIn } from "../../pageObjects/SignIn/SignInPage";
// import { ClosePositionSuccessPopup } from "../../pageObjects/Trading/closePositionSuccessPopup";
// import { AllInstruments } from "../../pageObjects/Trading/InstrumentsPage";
// import { MyTrades } from "../../pageObjects/Trading/MyTrades";
// import { NewPosition } from "../../pageObjects/Trading/OpenNewPositionPage";
// import { test } from "..//..//test-options";

// test.describe("Trading + trading protection", async () => {
// type tradingTypesWithProtection = {
//   testRailId: string,
//   brand: string,
//   user: string,
//   investDirection: string,
//   protection: string,
//   tradeField: string
// }
// let tradingInstrument = "Dogecoin/USD";
// let NagaProtectionValue;

// const tradingParametersPositionsSL: tradingTypesWithProtection[] = [
//   {testRailId: '@25165', brand: '@NS', user:'testTrading2', investDirection:'Short', protection: 'Stop Loss',tradeField: 'sl'},
//   {testRailId: '@25160', brand: '@NS', user:'testTrading2', investDirection:"Long", protection: 'Take profit',tradeField: 'tp'},
//   {testRailId: '@25166', brand: '@NM', user:'testTrading2Markets', investDirection:'Short', protection: 'Stop Loss', tradeField:'sl'},
//   {testRailId: '@25017', brand: '@NM', user:'testTrading2Markets', investDirection:'Long', protection: 'Take profit', tradeField:'tp'},
// ]
// for(const{testRailId, brand, user, investDirection, protection,tradeField} of tradingParametersPositionsSL){
//   test.skip(`${testRailId} ${brand} Open/Close ${investDirection} position + ${protection} protection`,{tag:['@trading', '@prodSanity']},async ({ page}) => {
//     let sighIn = new SignIn(page);
//     let mainPage = new MainPage(page);
//     let myTrades = new MyTrades(page);
//     let instruments = new AllInstruments(page);
//     let newPosition = new NewPosition(page);
//     let successPopup = new ClosePositionSuccessPopup(page);
//     await test.step(`Login to ${brand} platfotm`, async () => {
//       await sighIn.goto(await sighIn.chooseBrand(brand), "login");
//       await sighIn.signInUserToPlatform(user, process.env.USER_PASSWORD || "");
//     });
//     await test.step("Check previously opened positions and close if they exist", async () => {
//       await mainPage.openHeaderMenuPoint("my-trades");
//       await myTrades.closePositionsIfExist();
//     });
//     await test.step(`Choose ${tradingInstrument} instrument and open ${investDirection} position`, async () => {
//       await mainPage.openHeaderMenuPoint("markets");
//       await instruments.searchInstrument(tradingInstrument);
//       await instruments.openPosition(investDirection);
//     });
//     await test.step(`Open ${investDirection} position + ${protection}`, async () => {
//       await newPosition.enableProtection(protection)
//       NagaProtectionValue = await newPosition.getProtectionValue(protection)
//       await newPosition.submitPosition();
//     });
//     await test.step("Check My-trades popup", async () => {
//       await mainPage.openHeaderMenuPoint("my-trades");
//       expect(await myTrades.checkStatusOfElement(await myTrades.activeTradesTab)).toContain("active");
//       expect(await myTrades.getProtectionValue(tradeField)).toContain(NagaProtectionValue)
//     });
//     await test.step('Close position and check sucses popup', async()=>{
//       await myTrades.closePosition()
//       await successPopup.acceptPopup()
//     })
// })

// }})