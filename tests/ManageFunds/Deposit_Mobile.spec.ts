import { expect } from "@playwright/test";
import { MainPage } from "../../pageObjects/MainPage/MainPage";
import { Deposit } from "../../pageObjects/ManageFunds/Deposit";
import { SignIn } from "../../pageObjects/SignIn/SignInPage";
import { test } from "../../test-options";

test.describe('Deposit Mobile', async()=>{
    
    type depositNumber = {
        testRaildId: string,
        numberOfDepositMethods: number,
        brand: string,
        user: string
    }
    const testDepositNumber: depositNumber[] = [
        {testRaildId: '@25351', numberOfDepositMethods:6, brand: '@Capital', user: 'testTrading2'},
        {testRaildId: '@25391', numberOfDepositMethods:8, brand: '@Markets', user: 'depositTestMarkets'},
        {testRaildId: '@25392', numberOfDepositMethods:4, brand: '@Mena', user: 'depositNagaMena@naga.com'},
        {testRaildId: '@25422', numberOfDepositMethods:5, brand: '@Africa', user: 'depositNagaAfrica'},
    ]
    
    for(const{testRaildId, numberOfDepositMethods, brand, user}of testDepositNumber){
        test(`${testRaildId} Mobile ${brand} Check number of exist deposit methods`, 
        {tag:['@deposit', '@mobile']}, async({page, AppNAGA})=>{
        let signIn = new SignIn(page);
        let mainPage = new MainPage(page);
        let deposit = new Deposit(page);
        await test.step(`Login by ${user} to ${brand} platform and check number of exist methods`, async()=>{
            await signIn.goto(AppNAGA,'login');
            await signIn.signInUserToPlatform(user, process.env.USER_PASSWORD || '');
            await mainPage.openMobileBackMenuPoint('Deposit')
            await deposit.checkActiveMobileManageTab('deposit')
            expect(await deposit.getNumberOfMobileDeposits()).toEqual(numberOfDepositMethods)
        })
    })
    }

    type NStestTypes = {
        testRailId: string,
        brand: string,
        user: string,
        depositName: string,
        responseMethodKey: string
    }
    
    const testNStestParameters: NStestTypes[] = [
        {testRailId: '@24082', brand: '@Capital', user: 'testTrading2', depositName: 'light-credit-debit-cards', responseMethodKey:'Credit Card'}, 
        //{testRailId: '@24067', brand: '@Markets', user: 'testTrading2', depositName: 'perfectmoney', responseMethodKey:'Fund via Perfect Money'},
        {testRailId: '@24078', brand: '@Capital', user: 'testTrading2', depositName: 'light-neteller', responseMethodKey:'altneteller'},
        {testRailId: '@24077', brand: '@Capital', user: 'testTrading2', depositName: 'light-skrill', responseMethodKey:'skrill'},
        {testRailId: '@25393', brand: '@Mena', user: 'depositNagaMena@naga.com', depositName: 'light-credit-debit-cards', responseMethodKey:'Credit Card'},
        {testRailId: '@25394', brand: '@Mena', user: 'depositNagaMena@naga.com', depositName: 'light-ecommpay', responseMethodKey:'Credit Card'},
        {testRailId: '@25395', brand: '@Mena', user: 'depositNagaMena@naga.com', depositName: 'light-cc-applepay', responseMethodKey:'altcreditcard'},
        {testRailId: '@25396', brand: '@Mena', user: 'depositNagaMena@naga.com', depositName: 'light-neteller', responseMethodKey:'Credit Card'},
        {testRailId: '@25423', brand: '@Africa', user: 'depositNagaAfrica', depositName: 'light-credit-debit-cards', responseMethodKey:'Credit Card'},
        {testRailId: '@25424', brand: '@Africa', user: 'depositNagaAfrica', depositName: 'light-ozow', responseMethodKey:'ozow'},
        {testRailId: '@25425', brand: '@Africa', user: 'depositNagaAfrica', depositName: 'light-ecommpay', responseMethodKey:'Credit Card'},
        //{testRailId: '@24077', brand: '@Capital', user: 'testTrading2', depositName: 'match2pay', responseMethodKey:'altcrypto'},
    ]
    
    for(const{testRailId, brand, user, depositName,responseMethodKey} of testNStestParameters){
    test(`${testRailId} Mobile  ${brand} Deposit with ${depositName} deposit`, 
        {tag:['@deposit', '@mobile'], annotation:{description:'https://keywaygroup.atlassian.net/browse/RG-9088', 'type':'ticket'}}, 
        async({page,AppNAGA}, testInfo)=>{
        testInfo.setTimeout(testInfo.timeout + 45000);
        let signIn = new SignIn(page);
        let mainPage = new MainPage(page);
        let deposit = new Deposit(page);
        await test.step(`Login by ${user} to platfrom ${brand}`, async()=>{
            await signIn.goto(AppNAGA,'login');
            await signIn.signInUserToPlatform(user, process.env.USER_PASSWORD || '');
            await mainPage.openMobileBackMenuPoint('Deposit')
        });
        await test.step(`Check ${depositName} deposit`, async()=>{
            await deposit.checkActiveMobileManageTab('deposit')
            let response = await deposit.performMobileDepositWithAmount(depositName, '100', '**/api/cashier/get-payment-method-list-without-details')
            expect(await deposit.getApiPaymentMethodKey(response)).toEqual(responseMethodKey)
            expect(await deposit.getApiStatusCode(response)).toEqual(200)
        })
    })}
})

test.describe('Deposit Mobile. NS Other methods', async()=>{

    test.beforeEach(`Login by testTrading2 to platform`, async({page, AppNAGA}, testInfo)=>{
        testInfo.setTimeout(testInfo.timeout + 10000);
        let signIn = new SignIn(page);
        await test.step('Login by withdrawal user to platform and open withdrawal', async()=>{
            await signIn.goto(AppNAGA,'login');
            await signIn.signInUserToPlatform("testTrading2", process.env.USER_PASSWORD || '');
        });
    })

    test("@24068 Mobile Deposit via Crypto", 
        {tag:['@deposit', '@mobile'], annotation:{description:'https://keywaygroup.atlassian.net/browse/RG-9088', 'type':'ticket'}},async({page})=>{
        let deposit = new Deposit(page)
        let mainPage = new MainPage(page)
        await mainPage.openMobileBackMenuPoint('Deposit')
        await deposit.checkActiveMobileManageTab('deposit')
        await test.step("Check crypto deposit", async()=>{
            let response = await deposit.performMobileDepositWithAmount('crypto', '100', 'https://payapi.newagecrypto.com/assets/paynow');
            expect(await deposit.getApiStatusCode(response)).toEqual(200)
        })
    })

    test('@25352 Mobile Deposit via Wire Transfer',{tag:['@deposit', '@mobile'], annotation:{description:'https://keywaygroup.atlassian.net/browse/RG-9088', 'type':'ticket'}}, async({page})=>{
        let deposit = new Deposit(page)
        await new MainPage(page).openMobileMenu('Menu')
        await new MainPage(page).openMobileBackMenuPoint('manage-funds')
        await deposit.checkActiveMobileManageTab('deposit')
        await test.step('Check wire trannsfer deposit', async()=>{
            let response = await deposit.performMobileDepositWithoutAmount('amazonaws', '**/payment/bank_accounts')
            expect(await deposit.getSuccessStatus(response)).toEqual(true)
            expect(await deposit.getInfoCode(response)).toEqual(200)
        })
    })
})

test.describe('Deposit Mobile. NM. Other methods', async()=>{

    test(`@23995 Mobile Check Pay Pal deposit`, 
        {tag:['@deposit', '@mobile'], annotation:{description:'https://keywaygroup.atlassian.net/browse/RG-9088', 'type':'ticket'}}, 
        async({page, AppNAGA}, testInfo)=>{
        testInfo.setTimeout(testInfo.timeout + 10000);
        let signIn = new SignIn(page);
        let mainPage = new MainPage(page);
        await test.step(`Login to platform by depositTestMarkets user`, async()=>{
            await signIn.goto(AppNAGA,'login');
            await signIn.signInUserToPlatform('depositTestMarkets', process.env.USER_PASSWORD || '');
            await mainPage.openMobileMenu('Menu');
            await mainPage.openMobileBackMenuPoint('manage-funds')
            await new Deposit(page).checkActiveMobileManageTab('deposit')
        })
        await test.step('Check Pay Pal deposit', async()=>{
            let deposit = new Deposit(page);
            let response = await deposit.performMobileDepositWithAmount('paypal', '100', '**/payments/paypal/deposit_uri')
            expect(await deposit.getApiStatusCode(response)).toEqual(200)
            expect(await deposit.getCurrentUrl()).toContain('https://www.paypal.com/')
        })
    })

    type NMtestTypes = {
        testRailId: string,
        brand: string,
        user: string,
        depositName: string,
        requestURL: string,
    }

    const NMdepositTestParams: NMtestTypes[] = [
        {testRailId: '@23606', brand: '@Markets', user: 'depositTestMarkets', depositName: 'light-credit-debit-cards', requestURL: '**/payment/safecharge/url'},
        //{testRailId: '@25151', brand: '@Markets', user: 'depositTestMarkets', depositName: 'light-ewallet', requestURL: '**/payment/safecharge/url'},
        {testRailId: '@25150', brand: '@Markets', user: 'depositTestMarkets', depositName: 'light-sepa', requestURL: '**/payments/truelayer/providers'}
    ]
    
    for(const{testRailId, brand, user, depositName, requestURL} of NMdepositTestParams){    
        test(`${testRailId} Mobile ${brand} Check ${depositName} deposit`, 
        {tag:['@deposit', '@mobile'], annotation:{description:'https://keywaygroup.atlassian.net/browse/RG-9088', 'type':'ticket'}}, 
        async({page, AppNAGA}, testInfo)=>{
        testInfo.setTimeout(testInfo.timeout + 20000);
        let signIn = new SignIn(page);
        let mainPage = new MainPage(page);
        let deposit = new Deposit(page);
        await test.step(`Login by ${user} user`, async()=>{
            await signIn.goto(AppNAGA,'login');
            await signIn.signInUserToPlatform(user, process.env.USER_PASSWORD || '');
            await mainPage.openMobileMenu('Menu');
            await mainPage.openMobileBackMenuPoint('manage-funds')
            await new Deposit(page).checkActiveMobileManageTab('deposit')
        });
        await test.step(`Check ${depositName} deposit`, async()=>{
            let response = await deposit.performMobileDepositWithoutAmount(depositName, requestURL)
            expect(await deposit.getSuccessStatus(response)).toEqual(true)
            expect(await deposit.getInfoCode(response)).toEqual(200)
        })
    })
    }
})

       