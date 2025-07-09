import { expect } from '@playwright/test';
import { NagaExchange } from '../../pageObjects/NagaExchange/Exchange';
import {test} from '..//..//test-options';

test.describe('WEB', async()=>{

    test.beforeEach('Login to platform', async({app, AppNAGAX}, testInfo)=>{
        testInfo.setTimeout(testInfo.timeout + 10000)
        await app.signIn.goto(AppNAGAX, 'login')
        await app.signIn.signInUserToPlatform('testTradingCrypro2@naga.com', process.env.USER_PASSWORD || "")
        await app.signIn.skip2AF()
    })

    test(`@CryptoExchange. Redirect from Naga Crypto to Naga Exchange`, {tag:['@web', '@crypto']}, async({app})=>{
        const newPage = await app.exchange.redirectToNagaExchange()
        let exchangePage = new NagaExchange(newPage)
        expect(await exchangePage.getUrl()).toEqual('https://exchange.nagax.com/eu/')
    })
})