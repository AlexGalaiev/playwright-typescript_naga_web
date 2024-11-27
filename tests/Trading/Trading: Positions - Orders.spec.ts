import { expect } from "@playwright/test";
import { MainPage } from "../../pageObjects/MainPage/MainPage";
import { SignIn } from "../../pageObjects/SignIn/SignInPage";
import { AllInstruments } from "../../pageObjects/Trading/InstrumentsPage";
import { MyTrades } from "../../pageObjects/Trading/MyTrades";
import { NewPosition } from "../../pageObjects/Trading/OpenNewPositionPage";
import { test } from "../../test-options";
import { ClosePositionSuccessPopup } from "../../pageObjects/Trading/closePositionSuccessPopup";
import { getLocalization } from "../../pageObjects/localization/getText";
import { RealStockPopup } from "../../pageObjects/Trading/realStockShortPosition";

type tradingTypes = {
  testRailId: string,
  brand: string,
  user: string,
  investDirection: string
}
const tradingInstrument = "Dogecoin/USD";
const realStockInstrument = 'Agilent Technologies'
let investmentValue;
let units;
let rate;

test.describe("Trading Positions/Orders", async () => {
const tradingParamsPositions: tradingTypes[] = [
  {testRailId: '@25159', brand: '@NS', user:'testTrading2', investDirection:'Short'},
  {testRailId: '@25163', brand: '@NS', user:'testTrading2', investDirection:"Long"},
  {testRailId: '@23675', brand: '@NM', user:'testTrading2Markets', investDirection:'Short'},
  {testRailId: '@25164', brand: '@NM', user:'testTrading2Markets', investDirection:'Long'}
]
for(const{testRailId, brand, user,investDirection}of tradingParamsPositions){
  test(`${testRailId} ${brand} Open/Close ${investDirection} trading position`,{tag:['@trading', '@prodSanity']}, async ({ page }, testInfo) => {
    await testInfo.setTimeout(testInfo.timeout + 140000);
    let signIn = new SignIn(page);
    let mainPage = new MainPage(page);
    let myTrades = new MyTrades(page)
    let instruments = new AllInstruments(page);
    let newPosition = new NewPosition(page);
    let successfullClosePopup = new ClosePositionSuccessPopup(page)
    await test.step(`Login to ${brand} by ${user}`, async () => {
      await signIn.goto(await signIn.chooseBrand(brand), "login");
      await signIn.signInUserToPlatform(user,process.env.USER_PASSWORD || "");
    });
    await test.step("Check previously opened positions. Close it, if exist", async () => {
      await mainPage.openHeaderMenuPoint("my-trades");
      await myTrades.closePositionsIfExist();
    });
    await test.step(`Choose ${tradingInstrument} for trading. Open new position page`, async () => {
      await mainPage.openHeaderMenuPoint("markets");
      await instruments.openPositionOfInstrument(tradingInstrument, investDirection)
    });
    await test.step("Check parameters and open short position", async () => {
      expect(await newPosition.getStatusOfBtn(await newPosition.investmentDirectionBtn(investDirection))).toContain('active')
      expect(await newPosition.getStatusOfBtn(await newPosition.ratePositionBtn(`${investDirection} at Current Price`))).toContain('active')
      await newPosition.submitPosition();
    });
    await test.step("Check My-trades", async () => {
      await mainPage.openHeaderMenuPoint("my-trades");
      expect(await myTrades.checkStatusOfElement(await myTrades.activeTradesTab)).toContain("active");
      investmentValue = await myTrades.getDepositValue();
      units = await myTrades.getUnits();
      await myTrades.closePosition()
    });
    await test.step('Check successfull closing popup', async()=>{
      expect(Number(await successfullClosePopup.getDeposit())).toBeCloseTo(Number(investmentValue))
      expect(await successfullClosePopup.getLots()).toContain(units)
    })
  });
}
const tradingParamsOrders: tradingTypes[] = [
  {testRailId: '@25161', brand: '@NS', user:'testTrading2', investDirection:'Short'},
  {testRailId: '@25162', brand: '@NS', user:'testTrading2', investDirection:"Long"},
  {testRailId: '@25016', brand: '@NM', user:'testTrading2Markets', investDirection:'Short'},
  {testRailId: '@25015', brand: '@NM', user:'testTrading2Markets', investDirection:'Long'},
]
for(const{testRailId, brand, user,investDirection}of tradingParamsOrders){
  test(`${testRailId} ${brand} Open/Close pending ${investDirection} position`,{tag:'@trading'}, async ({ page }, testInfo) => {
    await testInfo.setTimeout(testInfo.timeout + 140000);
    let signIn = new SignIn(page);
    let mainPage = new MainPage(page);
    let myTrades = new MyTrades(page)
    let instruments = new AllInstruments(page);
    let newPosition = new NewPosition(page);
    let successfullClosePopup = new ClosePositionSuccessPopup(page)
    await test.step(`Login to ${brand} by ${user}`, async () => {
      await signIn.goto(await signIn.chooseBrand(brand), "login");
      await signIn.signInUserToPlatform(user,process.env.USER_PASSWORD || "");
    });
    await test.step("Check previously opened positions. Close it if exist", async () => {
      await mainPage.openHeaderMenuPoint("my-trades");
      await myTrades.openActivePendingOrdersTab();
      await myTrades.removeOrdersIfExist();
    });
    await test.step(`Choose ${tradingInstrument} for trading. Open new position page`, async () => {
      await mainPage.openHeaderMenuPoint("markets");
      await instruments.openPositionOfInstrument(tradingInstrument, investDirection)
    });
    await test.step('Open order', async()=>{
      await newPosition.chooseBtn(await newPosition.ratePositionBtn(`${investDirection} at Specific Rate`))
      await newPosition.submitPosition()
    })
    await test.step('Check my-trades', async()=>{
      await mainPage.openHeaderMenuPoint("my-trades");
      await myTrades.openActivePendingOrdersTab();
      units = await myTrades.getOrderUnits()
      rate = await myTrades.getOrdersRate()
      await myTrades.deleteOrder()
    })
    await test.step('Check succesfull closing order popup', async()=>{
      expect(Number(await successfullClosePopup.getRate())).toBeCloseTo(Number(rate), 3);
      expect(await successfullClosePopup.getLots()).toContain(units)
    })
})}

const tradingParameters: tradingTypes[] = [
  {testRailId: '@25175', brand: '@NS', user:'testTrading2', investDirection:'Short'},
  {testRailId: '@25174', brand: '@NM', user:'testTrading2Markets', investDirection:"Short"},
]
for(const{testRailId, brand, user, investDirection}of tradingParameters){
  test(`${testRailId} Open short position of real stock ${brand}`,{tag:'@trading'}, async({page}, testInfo)=>{
    await testInfo.setTimeout(testInfo.timeout + 140000);
    let signIn = new SignIn(page);
    let mainPage = new MainPage(page);
    let myTrades = new MyTrades(page);
    let instruments = new AllInstruments(page);
    let realStockPopup = new RealStockPopup(page)
    let localization = new getLocalization('/pageObjects/localization/NagaCapital_Trading.json')
    await test.step(`Login to ${brand} by ${user}`, async () => {
      await signIn.goto(await signIn.chooseBrand(brand), "login");
      await signIn.signInUserToPlatform(user,process.env.USER_PASSWORD || "");
    });
    await test.step("Check previously opened positions. Close it if exist", async () => {
      await mainPage.openHeaderMenuPoint("my-trades");
      await myTrades.closePositionsIfExist();
    });
    await test.step(`Choose ${realStockInstrument} for trading. Open new position page`, async () => {
      await mainPage.openHeaderMenuPoint("markets");
      await instruments.openPositionOfInstrument(realStockInstrument, investDirection)
      expect(await realStockPopup.getPopupText()).toEqual(await localization.getLocalizationText('RealStock_OpenShortPosition'))
    });
  })
}

})


