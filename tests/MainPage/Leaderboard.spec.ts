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
        {brand:'@Markets', user: 'testTrading2Markets'}
    ]

    for(const{brand, user} of LeaderbordParams){
        test.skip(`${brand} FIlters of trading leaders. Check visibility of exist users`, 
            {tag:['@UI', '@web']}, async({page, AppNAGA})=>{
        let signIn = new SignIn(page);
        let mainPage = new MainPage(page)
        let leaderBoard = new Leaderboard(page)
        await test.step(`Login to platform by ${user}, ${brand} brand`, async()=>{
            await signIn.goto(AppNAGA, 'login')
            await signIn.signInUserToPlatform(user, process.env.USER_PASSWORD || '')
        })
        await test.step('Open LeaderBoard and check top traders page', async()=>{
            await mainPage.openBackMenuCategory('Top Traders')
            expect(await leaderBoard.goldTrader).not.toBeVisible()
            
        })
        })
    }
})
