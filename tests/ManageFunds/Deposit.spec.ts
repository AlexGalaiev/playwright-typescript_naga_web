import { expect } from "@playwright/test";
import { MainPage } from "../../pageObjects/MainPage/MainPage";
import { Deposit } from "../../pageObjects/ManageFunds/Deposit";
import { SignIn } from "../../pageObjects/SignIn/SignInPage";
import {test} from "../../test-options"

type NStestTypes = {
    testRailId: string,
    brand: string,
    user: string,
    depositName: string,
    responseMethodKey: string
}
test.describe("Naga Capital.", async()=>{
    let numberOfExistDeposits = 5
    test('@25351 Check number of exist deposit methods', 
        {tag:['@deposit', '@prodSanity', '@manageFunds']}, async({page, NagaCapital})=>{
        let signIn = new SignIn(page);
        let mainPage = new MainPage(page);
        let deposit = new Deposit(page);
        await test.step(`Login to platfrom by testTrading2 and check number of exist methods`, async()=>{
            await signIn.goto(NagaCapital,'login');
            await signIn.signInUserToPlatform('testTrading2', process.env.USER_PASSWORD || '');
            await mainPage.openBackMenuPoint('Manage Funds');
            await deposit.checkActiveDepositTab('deposit')
            expect(await deposit.getNumberOfDepositMethods()).toEqual(numberOfExistDeposits)
        })
    })

const testNStestParameters: NStestTypes[] = [
    {testRailId: '@24082', brand: '@NS', user: 'testTrading2', depositName: 'credit-cards', responseMethodKey:'Credit Card'}, 
    //{testRailId: '@24067', brand: '@NM', user: 'testTrading2', depositName: 'perfectmoney', responseMethodKey:'Fund via Perfect Money'},
    {testRailId: '@24078', brand: '@NS', user: 'testTrading2', depositName: 'neteller', responseMethodKey:'altneteller'},
    {testRailId: '@24077', brand: '@NS', user: 'testTrading2', depositName: 'skrill', responseMethodKey:'skrill'},
]
for(const{testRailId, brand, user, depositName,responseMethodKey} of testNStestParameters){
    test(`${testRailId} ${brand} Check deposit methods. Test of ${depositName} deposit`, 
        {tag:['@deposit', '@prodSanity', '@manageFunds', '@smoke']}, async({page}, testInfo)=>{
        await testInfo.setTimeout(testInfo.timeout + 15000);
        let signIn = new SignIn(page);
        let mainPage = new MainPage(page);
        let deposit = new Deposit(page);
        await test.step(`Login by ${user} user`, async()=>{
            await signIn.goto(await signIn.chooseBrand(brand),'login');
            await signIn.signInUserToPlatform(user, process.env.USER_PASSWORD || '');
            await mainPage.openBackMenuPoint('Manage Funds');
        });
        await test.step(`Check ${depositName} deposit`, async()=>{
            let response = await deposit.performDepositWithAmount(depositName, '100', '**/api/cashier/get-payment-method-list-without-details')
            expect(await deposit.getApiPaymentMethodKey(response)).toEqual(responseMethodKey)
            expect(await deposit.getApiStatusCode(response)).toEqual(200)
        })
    })} 
    test.describe('NagaCapital. Crypto and WireTransfer', async()=>{

        test.beforeEach(`Login by testTrading2 to platform`, async({page, NagaCapital}, testInfo)=>{
            testInfo.setTimeout(testInfo.timeout + 10000);
            let signIn = new SignIn(page);
            let mainPage = new MainPage(page);
            await test.step('Login by withdrawal user to platform and open withdrawal', async()=>{
                await signIn.goto(NagaCapital,'login');
                await signIn.signInUserToPlatform("testTrading2", process.env.USER_PASSWORD || '');
                await mainPage.openBackMenuPoint('Manage Funds');
            });
        })
        test("@24068 Deposit via Crypto", {tag:['@deposit', '@manageFunds']}, async({page})=>{
            let deposit = new Deposit(page);
            await test.step("Check crypto deposit", async()=>{
                let response = await deposit.performDepositWithAmount('crypto', '100', 'https://payapi.newagecrypto.com/assets/paynow');
                expect(await deposit.getApiStatusCode(response)).toEqual(200)
            })
        })
        test('@25352 Deposit via Wire Transfer',{tag:['@deposit', '@manageFunds']}, async({page})=>{
            let deposit = new Deposit(page);
            await test.step('Check wire trannsfer deposit', async()=>{
                let response = await deposit.performDepositWithoutAmount('amazonaws', '**/payment/bank_accounts')
                expect(await deposit.getSuccessStatus(response)).toEqual(true)
                expect(await deposit.getInfoCode(response)).toEqual(200)
            })})
    })
})
    
test.describe('Naga Markets', async()=>{
    
    type NMtestTypes = {
        testRailId: string,
        brand: string,
        user: string,
        depositName: string,
        requestURL: string,
    }

    test(`@23995 Check Pay Pal deposit`, {tag:['@deposit', '@manageFunds']}, async({page, NagaMarkets}, testInfo)=>{
        testInfo.setTimeout(testInfo.timeout + 10000);
        let signIn = new SignIn(page);
        let mainPage = new MainPage(page);
        await test.step(`Login to platform by depositTestMarkets user`, async()=>{
            await signIn.goto(NagaMarkets,'login');
            await signIn.signInUserToPlatform('depositTestMarkets', process.env.USER_PASSWORD || '');
            await mainPage.openBackMenuPoint('Manage Funds');
        })
        await test.step('Check Pay Pal deposit', async()=>{
            let deposit = new Deposit(page);
            let response = await deposit.performDepositWithAmount('paypal', '100', '**/payments/paypal/deposit_uri')
            expect(await deposit.getApiStatusCode(response)).toEqual(200)
            expect(await deposit.getCurrentUrl()).toContain('https://www.paypal.com/')
        })
    })

    const NMdepositTestParams: NMtestTypes[] = [
        {testRailId: '@23606', brand: '@NM', user: 'depositTestMarkets', depositName: 'credit-cards', requestURL: '**/payment/safecharge/url'},
        {testRailId: '@25151', brand: '@NM', user: 'depositTestMarkets', depositName: 'ewallets', requestURL: '**/payment/safecharge/url'},
        {testRailId: '@25150', brand: '@NM', user: 'depositTestMarkets', depositName: 'sepa-credit', requestURL: '**/payments/truelayer/providers'}    ]
    for(const{testRailId, brand, user, depositName, requestURL} of NMdepositTestParams){    
        test(`${testRailId} ${brand} Check ${depositName} deposit`, 
            {tag:['@deposit', '@manageFunds', '@smoke']}, async({page}, testInfo)=>{
            testInfo.setTimeout(testInfo.timeout + 10000);
            let signIn = new SignIn(page);
            let mainPage = new MainPage(page);
            let deposit = new Deposit(page);
            await test.step(`Login by ${user} user`, async()=>{
                await signIn.goto(await signIn.chooseBrand(brand),'login');
                await signIn.signInUserToPlatform(user, process.env.USER_PASSWORD || '');
                await mainPage.openBackMenuPoint('Manage Funds');
            });
            await test.step(`Check ${depositName} deposit`, async()=>{
                let response = await deposit.performDepositWithoutAmount(depositName, requestURL)
                expect(await deposit.getSuccessStatus(response)).toEqual(true)
                expect(await deposit.getInfoCode(response)).toEqual(200)
            })
        })}
    })