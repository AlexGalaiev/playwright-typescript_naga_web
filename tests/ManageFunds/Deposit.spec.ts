import { expect } from "@playwright/test";
import { MainPage } from "../../pageObjects/MainPage/MainPage";
import { Deposit } from "../../pageObjects/ManageFunds/Deposit";
import { SighIn } from "../../pageObjects/SighIn/SignInPage";
import {test} from "../../test-options"

type NStestTypes = {
    testRailId: string,
    brand: string,
    user: string,
    depositName: string,
    pageTittle: string,
}
test.describe("Naga Capital.Deposit", async()=>{

const testNStestParameters: NStestTypes[] = [
    {testRailId: '@24082', brand: '@NS', user: 'testTrading2', depositName: 'credit-cards', pageTittle:'Fund via Credit Card'}, 
    {testRailId: '@24067', brand: '@NS', user: 'testTrading2', depositName: 'perfectmoney', pageTittle:'Fund via Perfect Money'},
    {testRailId: '@24078', brand: '@NS', user: 'testTrading2', depositName: 'neteller', pageTittle:'Fund via Neteller'},
    {testRailId: '@24077', brand: '@NS', user: 'testTrading2', depositName: 'skrill', pageTittle:'Fund via Skrill'},
]
for(const{testRailId, brand, user, depositName,pageTittle} of testNStestParameters){
    test(`${testRailId} Check deposit method ${brand} ${depositName}`, {tag:'@deposit'},async({page})=>{
        let sighIn = new SighIn(page);
        let mainPage = new MainPage(page);
        let deposit = new Deposit(page);
        await test.step('Login by compliant user', async()=>{
            await sighIn.goto(await sighIn.chooseBrand(brand),'login');
            await sighIn.sigInUserToPlatform(user, process.env.USER_PASSWORD || '');
            await mainPage.openManageFunds();
        });
        await test.step("Check credit card deposit", async()=>{
            await deposit.chooseDepositMethod(depositName);
            await deposit.performDeposit('100');
            expect(await deposit.getPraxisHeaderTittle()).toContain(pageTittle)
            expect(await deposit.checkNameOfIframe()).toContain("_cashier_iframe")
        })
    })
}   
test("@24068 Deposit via Crypto", {tag:'@deposit'},async({page, NagaCapital })=>{
    let sighIn = new SighIn(page);
    let mainPage = new MainPage(page);
    let deposit = new Deposit(page);
    await test.step('Login by withdrawal user to platform and open withdrawal', async()=>{
        await sighIn.goto(NagaCapital,'login');
        await sighIn.sigInUserToPlatform("testTrading2", process.env.USER_PASSWORD || '');
        await mainPage.openManageFunds();
    });
    await test.step("Check crypto deposit", async()=>{
        await deposit.chooseDepositMethod('crypto');
        await deposit.performDeposit('100');
        expect(await deposit.checkCryptoIframeDeposit())
    })})})
    
test.describe('Naga Markets. Deposit', async()=>{

    test.beforeEach('Login to platform', async({page, NagaMarkets})=>{
        let sighIn = new SighIn(page);
        let mainPage = new MainPage(page);
        await sighIn.goto(NagaMarkets,'login');
        await sighIn.sigInUserToPlatform('depositTestMarkets', process.env.USER_PASSWORD || '');
        await mainPage.openManageFunds();
    })

    test('@23995 Pay pal deposit', {tag:'@deposit'},async({page})=>{
        let deposit = new Deposit(page);
        await deposit.chooseDepositMethod('paypal');
        await deposit.performDeposit('1000');
        expect(await deposit.getCurrentUrl()).toContain('paypal.com')
    })

    test('@25150 Bank Transfer deposit', {tag:'@deposit'},async({page})=>{
        let deposit = new Deposit(page);
        await deposit.chooseDepositMethod('sepa-credit')
        await deposit.performDeposit('1000');
        expect(await deposit.getBankTransferForm()).toBeVisible();
    })

})
test.describe('Naga Markets. E-wallets methods', async()=>{
    
const NMdepositTestParams: NStestTypes[] = [
    {testRailId: '@23606', brand: '@NM', user: 'depositTestMarkets', depositName: 'credit-cards', pageTittle: 'Fund via Credit Card'},
    {testRailId: '@25151', brand: '@NM', user: 'depositTestMarkets', depositName: 'ewallets', pageTittle: 'Fund via E-Wallets'},
]
for(const{testRailId, brand, user, depositName, pageTittle} of NMdepositTestParams){    
    test(`${testRailId} Check ewallet methods ${brand} ${depositName}`, {tag:'@deposit'}, async({page})=>{
        let sighIn = new SighIn(page);
        let mainPage = new MainPage(page);
        let deposit = new Deposit(page);
        await test.step('Login by compliant user', async()=>{
            await sighIn.goto(await sighIn.chooseBrand(brand),'login');
            await sighIn.sigInUserToPlatform(user, process.env.USER_PASSWORD || '');
            await mainPage.openManageFunds();
        });
        await test.step("Check credit card deposit", async()=>{
            await deposit.chooseDepositMethod(depositName);
            expect(await deposit.getPraxisHeaderTittleNM()).toContain(pageTittle)
            expect(await deposit.checkNameOfiframeNM()).toContain("iframe_container")
        })
    })
}
})

  

