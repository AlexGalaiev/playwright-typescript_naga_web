import { expect } from "@playwright/test";
import { MainPage } from "../../pageObjects/MainPage/MainPage";
import { Deposit } from "../../pageObjects/ManageFunds/Deposit";
import { SighIn } from "../../pageObjects/SighIn/SignInPage";
import {test} from "..//..//test-options"


test.describe("NagaCapital. Deposit", async()=>{
    
    test.beforeEach("Login by trade user", async({page, NagaCapital })=>{
        let sighIn = new SighIn(page);
        let mainPage = new MainPage(page);
        await test.step('Login by withdrawal user to platform and open withdrawal', async()=>{
            await sighIn.goto(NagaCapital,'login');
            await sighIn.sigInUserToPlatform("n.mucibabic+testcap2@naga.com", process.env.USER_PASSWORD || '');
            await mainPage.openManageFunds();
        });
    })
    test("@24082 Deposit via CreditCard", async({page})=>{
        let deposit = new Deposit(page);
        await test.step("Check credit card deposit", async()=>{
            await deposit.chooseCreditCardDeposit();
            await deposit.performDeposit();
            await deposit.getPraxisHeaderTittle() === "Fund via Credit Card"
            await deposit.checkNameOfIframe() === "Credit and Debit Card"
        })
    })
    
    test("@24067 Deposit via Perfect money", async({page})=>{
        let deposit = new Deposit(page);
        await test.step("Check perfect money deposit", async()=>{
            await deposit.choosePerfectMoneyDeposit();
            await deposit.performDeposit();
            await deposit.getPraxisHeaderTittle() === "Fund via Perfect Money"
            await deposit.checkNameOfIframe() === "PAY WITHCREDIT AND DEBIT CARD"
        })
    })

    test("@24078 Deposit via Netteler", async({page})=>{
        let deposit = new Deposit(page);
        await test.step("Check netteler deposit", async()=>{
            await deposit.chooseNettelerDeposit();
            await deposit.performDeposit();
            await deposit.getPraxisHeaderTittle() === "Fund via Neteller";
            await deposit.checkNameOfIframe() === "PAY WITH NETELLER";
        })
    })
    test("@24077 Deposit via Skrill", async({page})=>{
        let deposit = new Deposit(page);
        await test.step("Check netteler deposit", async()=>{
            await deposit.choosekSkrillDeposit();
            await deposit.performDeposit();
            await deposit.getPraxisHeaderTittle() === "Fund via Skrill";
            await deposit.checkNameOfIframe() === "PAY WITH SKRILL";
        })
    })
    test("@24068 Deposit via Crypto", async({page})=>{
        let deposit = new Deposit(page);
        await test.step("Check crypto deposit", async()=>{
            await deposit.chooseCyproDeposit();
            await deposit.performDeposit();
            expect(await deposit.checkCryptoIframeDeposit());
        })
    })
    test("@24072 Deposit via WireTransfer", async({page})=>{
        let deposit = new Deposit(page);
        await test.step("Check crypto deposit", async()=>{
            await deposit.chooseWireTransfer();
            await deposit.getbankTransferHeaderTittle() === "Fund via Bank Transfer"
            expect(await deposit.getWireTransferBankDetails())
        })
    })
})