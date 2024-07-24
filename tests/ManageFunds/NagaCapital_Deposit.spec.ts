import { expect } from "@playwright/test";
import { MainPage } from "../../pageObjects/MainPage/MainPage";
import { Deposit } from "../../pageObjects/ManageFunds/Deposit";
import { SighIn } from "../../pageObjects/SighIn/SignInPage";
import {test} from "..//..//test-options"


test.describe("NagaCapital. Deposit", async()=>{
    //testTrading2Markets 
    
    test.beforeEach("Login by trade user", async({page, NagaCapital })=>{
        let sighIn = new SighIn(page);
        let mainPage = new MainPage(page);
        await test.step('Login by withdrawal user to platform and open withdrawal', async()=>{
            await sighIn.goto(NagaCapital,'login');
            await sighIn.sigInUserToPlatform("testTrading2", process.env.USER_PASSWORD || '');
            await mainPage.openManageFunds();
        });
    })
    test("@24082 Deposit via CreditCard", async({page})=>{
        let deposit = new Deposit(page);
        await test.step("Check credit card deposit", async()=>{
            await deposit.chooseDepositMethod('credit-cards');
            await deposit.performDeposit();
            expect(await deposit.getPraxisHeaderTittle()).toContain("Fund via Credit Card")
            expect(await deposit.checkNameOfIframe()).toContain("_cashier_iframe")
        })
    })
    
    test("@24067 Deposit via Perfect money", async({page})=>{
        let deposit = new Deposit(page);
        await test.step("Check perfect money deposit", async()=>{
            await deposit.chooseDepositMethod('perfectmoney');
            await deposit.performDeposit();
            expect(await deposit.getPraxisHeaderTittle()).toContain("Fund via Perfect Money")
            expect(await deposit.checkNameOfIframe()).toContain("_cashier_iframe")
        })
    })

    test("@24078 Deposit via Netteler", async({page})=>{
        let deposit = new Deposit(page);
        await test.step("Check netteler deposit", async()=>{
            await deposit.chooseDepositMethod('neteller');
            await deposit.performDeposit();
            expect(await deposit.getPraxisHeaderTittle()).toContain("Fund via Neteller");
            expect(await deposit.checkNameOfIframe()).toContain("_cashier_iframe")
        })
    })
    test("@24077 Deposit via Skrill", async({page})=>{
        let deposit = new Deposit(page);
        await test.step("Check netteler deposit", async()=>{
            await deposit.chooseDepositMethod('skrill');
            await deposit.performDeposit();
            expect(await deposit.getPraxisHeaderTittle()).toContain("Fund via Skrill");
            expect(await deposit.checkNameOfIframe()).toContain("_cashier_iframe")
        })
    })
    test("@24068 Deposit via Crypto", async({page})=>{
        let deposit = new Deposit(page);
        await test.step("Check crypto deposit", async()=>{
            await deposit.chooseDepositMethod('crypto');
            await deposit.performDeposit();
            expect(await deposit.checkCryptoIframeDeposit())
        })
    })
})