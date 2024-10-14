import { expect } from "@playwright/test";
import { NagaCom } from "../../pageObjects/Website/NagaCom";
import { VPN } from "../../pageObjects/Website/VPN"
import {test} from "../../test-options"

test.describe('Naga.com website', async()=>{
    
    type RedirectTypes = {
        tradeInstrument: string;
        nameOfTheButton: string;
        redirectPageUrl: string;
    }
    const testRedirectToNMParams: RedirectTypes[] = [
        {tradeInstrument: 'trade', nameOfTheButton: 'Login', redirectPageUrl: 'https://nagamarkets.com/login'},
        {tradeInstrument: 'trade', nameOfTheButton: 'Get started', redirectPageUrl: 'https://nagamarkets.com/register'},
        {tradeInstrument: 'invest', nameOfTheButton: 'Login', redirectPageUrl: 'https://nagamarkets.com/login'},
        {tradeInstrument: 'invest', nameOfTheButton: 'Get started', redirectPageUrl: 'https://nagamarkets.com/register'},
        {tradeInstrument: 'crypto', nameOfTheButton: 'Login', redirectPageUrl: 'https://app.nagax.com/eu/login'},
        {tradeInstrument: 'crypto', nameOfTheButton: 'Get started', redirectPageUrl: 'https://app.nagax.com/eu/register'},
        {tradeInstrument: 'pay', nameOfTheButton: 'Get your card', redirectPageUrl: 'https://naga.com/eu/pay'},
    ]
    for(const{tradeInstrument, nameOfTheButton, redirectPageUrl}of testRedirectToNMParams){
        test(`@25194 Redirect from Naga.com to NagaMarkets platform. From ${tradeInstrument} to ${nameOfTheButton} button`, async({proxyPage})=>{
            let website = new NagaCom(proxyPage)
            await test.step('Open website Naga.com', async()=>{
                await website.open('https://naga.com/eu')
            })
            await test.step(`Choose ${tradeInstrument}. Click ${nameOfTheButton}`, async()=>{
                await website.checkTradeInstrument(`${tradeInstrument}`)
                await website.clickBtn(`${nameOfTheButton}`)
                expect(await website.checkUrl()).toContain(`${redirectPageUrl}`)
            })
        })
    }
    
    const testRedirectToNSParams: RedirectTypes[] = [
        {tradeInstrument: 'trade', nameOfTheButton: 'Login', redirectPageUrl: 'https://nagacap.com/login'},
        {tradeInstrument: 'trade', nameOfTheButton: 'Get started', redirectPageUrl: 'https://nagacap.com/register'},
        {tradeInstrument: 'invest', nameOfTheButton: 'Login', redirectPageUrl: 'https://nagacap.com/login'},
        {tradeInstrument: 'invest', nameOfTheButton: 'Get started', redirectPageUrl: 'https://nagacap.com/register'},
        {tradeInstrument: 'crypto', nameOfTheButton: 'Login', redirectPageUrl: 'https://app.nagax.com/eu/login'},
        {tradeInstrument: 'crypto', nameOfTheButton: 'Get started', redirectPageUrl: 'https://app.nagax.com/eu/register'},
        {tradeInstrument: 'pay', nameOfTheButton: 'Get your card', redirectPageUrl: 'https://naga.com/eu/pay'},
    ]
    for(const{tradeInstrument, nameOfTheButton, redirectPageUrl}of testRedirectToNSParams){
        test(`@25195 Redirect from Naga.com to Nagacapital platform. From ${tradeInstrument} to ${nameOfTheButton} button`, async({page})=>{
            let website = new NagaCom(page)
            await test.step('Open website Naga.com', async()=>{
                await website.open('https://naga.com/eu')
            })
            await test.step(`Choose ${tradeInstrument}. Click ${nameOfTheButton}`, async()=>{
                await website.checkTradeInstrument(`${tradeInstrument}`)
                await website.clickBtn(`${nameOfTheButton}`)
                expect(await website.checkUrl()).toContain(`${redirectPageUrl}`)
            })})
    }


    type languageTypes = {
        regulation: string;
        languages: string[];
        testRailId: string;
    }
    const languageParameters: languageTypes[] = [
        {testRailId: '@25197', regulation: 'eu', languages: ['English (Europe)', 'Deutsch', 'Italiano', 'Español', 'Polski', 'Čeština', 'Nederlands', 'Português']},
        {testRailId: '@25198', regulation: 'en', languages: ['English (Global)', 'Español (Latam)', 'Português', 'العربية', 'Bahasa Indonesia', '简化字', '繁體中文']},
    ]
    for(const{testRailId, regulation, languages}of languageParameters){
        test(`${testRailId} Default languages via ${regulation}`, async({page})=>{
            let website = new NagaCom(page)
            await test.step('Open Naga.com website', async()=>{
                await website.open(`https://naga.com/${regulation}`)
            })
            await test.step('Check visible language', async()=>{
                for(let language in languages){
                    
                }
            })
        })
    }

    

})