import { expect } from "playwright/test"
import { Leaderboard } from "../../pageObjects/MainPage/Leaderboard"
import { MainPage } from "../../pageObjects/MainPage/MainPage"
import { SignIn } from "../../pageObjects/SignIn/SignInPage"
import { test } from "..//..//test-options"

test.describe('WEB', async()=>{
    type leaderBoard = {
        brand: string,
        user: string
    }

    const LeaderbordParams: leaderBoard[] = [
        {brand:'@Markets', user: 'testTrading2Markets'},
        {brand:'@Capital', user: 'testTrading2'},
        {brand:'@Mena', user: 'testTrading@naga.com'},
        {brand:'@Africa', user: 'testTradingAfrica2@naga.com'}
    ]

    for(const{brand, user} of LeaderbordParams){
        test.skip(`${brand} FIlters of trading leaders. Check visibility of exist users`, 
            {tag:['@UI', '@web'], annotation:{description:'https://keywaygroup.atlassian.net/browse/RG-10132',type:'ticket'}}, async({app, AppNAGA})=>{
        await test.step(`Login to platform by ${user}, ${brand} brand`, async()=>{
            await app.signIn.goto(AppNAGA, 'login')
            await app.signIn.signInUserToPlatform(user, process.env.USER_PASSWORD || '')
        })
        await test.step('Open LeaderBoard and check top traders page', async()=>{
            await app.mainPage.openBackMenuCategory('Top Traders')
            expect(await app.leaderboard.goldTraderVisibility()).toBeTruthy()
            expect(await app.leaderboard.silverTraderVisibility()).toBeTruthy()
            expect(await app.leaderboard.bronzeTradeVisibility()).toBeTruthy()
            await app.leaderboard.openLeaderBoardFromTopTrades()
        })
        await test.step('Check visibility of user profiles with filter This week', async()=>{
            await app.leaderboard.chooseTimeFilter('This week')
            let filters = ['Top Earners','Community Heroes','Top Earners on Cryptos','Top Earners on Gold','Top Earners on Silver','Top Earners on DAX','Top Earners on NASDAQ','Top Earners on Ether','Top Earners on Bitcoin','Top Earners on Crude Oil','Top Earners on Brent Oil','Top Earners on Dow Jones','Most Popular Leaders','Trending Leaders']
            for(let index in filters){
                await app.leaderboard.chooseLeaderboardFilter(filters[index])
                expect(await app.leaderboard.goldTraderVisibility()).toBeTruthy()
                expect(await app.leaderboard.silverTraderVisibility()).toBeTruthy()
                expect(await app.leaderboard.bronzeTradeVisibility()).toBeTruthy()
                expect(await app.leaderboard.otherTraderVisibility()).toBeTruthy()
            }})})
    }

    for(const{brand, user} of LeaderbordParams){
        test(`${brand} Top traders main page`, 
            {tag:['@UI', '@web'], annotation:{description:'https://keywaygroup.atlassian.net/browse/RG-10132',type:'ticket'}}, 
            async({app, AppNAGA})=>{
        await test.step(`Login to platform by ${user}, ${brand} brand`, async()=>{
            await app.signIn.goto(AppNAGA, 'login')
            await app.signIn.signInUserToPlatform(user, process.env.USER_PASSWORD || '')
        })
        await test.step('Open LeaderBoard and check top traders page', async()=>{
            await app.mainPage.openBackMenuCategory('Top Traders')
            expect(await app.leaderboard.goldTraderVisibility()).toBeTruthy()
            expect(await app.leaderboard.silverTraderVisibility()).toBeTruthy()
            expect(await app.leaderboard.bronzeTradeVisibility()).toBeTruthy()
            expect(await app.leaderboard.topTradersBlockIsVisible('Top Earners')).toBeTruthy()
            expect(await app.leaderboard.topTradersBlockIsVisible('Trending Leaders')).toBeTruthy()
            expect(await app.leaderboard.topTradersBlockIsVisible('Most Popular Leaders')).toBeTruthy()
            expect(await app.leaderboard.topTradersBlockIsVisible('Community Heroes')).toBeTruthy()
            expect(await app.leaderboard.topTradersBlockIsVisible('Top Earners per Category')).toBeTruthy()
        })
    })
}})

