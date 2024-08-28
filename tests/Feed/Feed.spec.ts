import { expect } from "playwright/test";
import { Feed } from "../../pageObjects/Feed/Feed";
import { MainPage } from "../../pageObjects/MainPage/MainPage";
import { SighIn } from "../../pageObjects/SighIn/SignInPage";
import {test} from "../../test-options"
import { UserProfile } from "../../pageObjects/UserProfile/UserProfile";
import { getLocalization } from "../../pageObjects/localization/getText";
import { VerificationPopup } from "../../pageObjects/VerificationCenter/verificationPopup";
import { MyAccounts } from "../../pageObjects/MainPage/MyAccounts";

test.describe("Feed", async()=>{
    
type testFeedtypes = {
    testRailId: string,
    brand: string,
    user: string
}
const testFeedParams: testFeedtypes[] = [
    {testRailId: '@25122', brand: '@NS', user: 'testFeedUser'},
    {testRailId: '@25143', brand: '@NM', user: 'testFeedUserMarkets'}
]
for(const{testRailId, brand, user}of testFeedParams){
    test(`${testRailId} Create , edit and delete actions for post ${brand}`, async({page})=>{
        let sighIn = new SighIn(page);
        let feed = new Feed(page)
        await test.step("login and clean feed", async()=>{
            await sighIn.goto(await sighIn.chooseBrand(brand),'login');
            await sighIn.sigInUserToPlatform(user, process.env.USER_PASSWORD || '');
            await feed.closeOpenedPost(user);
        })
        await feed.openCreatePostForm()
        await test.step("Create and edit post", async()=>{
            let previousText = await feed.addTextToPost('Hello World')
            await feed.editExistedPost(user);
            let modifiedTex = await feed.addTextToPost('Bye Bye')
            expect(previousText).not.toEqual(modifiedTex)
        })
        await test.step("Delete post", async()=>{
            await feed.deleteExistedPost(user)
        })
    })}

const testFeedParamsActions: testFeedtypes[] = [
    {testRailId: '@25123', brand: '@NS', user: 'testFeedUser'},
    {testRailId: '@25144', brand: '@NM', user: 'testFeedUserMarkets'}
]
for(const{testRailId, brand, user}of testFeedParamsActions){
    test(`${testRailId} Post actions - like action ${brand}`, async({page})=>{
    let sighIn = new SighIn(page);
    let feed = new Feed(page)
    let userProfile = new UserProfile(page)
    await test.step("login by user and clean feed", async()=>{
        await sighIn.goto(await sighIn.chooseBrand(brand),'login');
        await sighIn.sigInUserToPlatform(user, process.env.USER_PASSWORD || '');
        await feed.closeOpenedPost(user);
    })
    await test.step("Add post to feed", async()=>{
        await feed.openCreatePostForm()
        await feed.addTextToPost('Hello World')
    })
    await test.step('User likes a post', async()=>{
        await feed.likePost(user);
        expect(await feed.checkLike(user)).toEqual(user)
    })
    await test.step('Check user profile and delete post', async()=>{
        await feed.checkUserPage(user);
        expect(await userProfile.getUserNameText()).toEqual(user)
        await new MainPage(page).openHeaderMenuPoint("feed")
        await feed.deleteExistedPost(user)
    })
})
}

const testFeedCommentParams: testFeedtypes[] = [
    {testRailId: '@25124', brand: '@NS', user: 'testFeedUser'},
    {testRailId: '@25145', brand: '@NM', user: 'testFeedUserMarkets'}
]
for(const{testRailId, brand, user}of testFeedCommentParams){
    test(`${testRailId} Comment a post ${brand}`, async({page})=>{
        let feed = new Feed(page);
        let sighIn = new SighIn(page);
        await test.step("login by user and clean feed", async()=>{
            await sighIn.goto(await sighIn.chooseBrand(brand),'login');
            await sighIn.sigInUserToPlatform(user, process.env.USER_PASSWORD || '');
            await feed.closeOpenedPost(user);
        })
        await test.step("Create post with text", async()=>{
            await feed.openCreatePostForm()
            await feed.addTextToPost('Hello World')
        })
        await test.step("Comment exist post", async()=>{
            await feed.addCommentToPost(user, 'test commnet')
        })
        await test.step('Check text of comment', async()=>{
            expect(await feed.checkTextOfPost(user)).toContain('test commnet')
            await feed.closeTab()
        })
        await test.step("Close post ", async()=>{
            await feed.closeOpenedPost(user);
        })
    })
}
    
const testShareCommentParams: testFeedtypes[] = [
    {testRailId: '@25129', brand: '@NS', user: 'testFeedUser'},
    {testRailId: '@25146', brand: '@NM', user: 'testFeedUserMarkets'}
]
for(const{testRailId, brand, user}of testShareCommentParams){
    test(`${testRailId} Shared a post ${brand}`, async({page})=>{
        let feed = new Feed(page);
        let sighIn = new SighIn(page);
        await test.step("login by user and clean feed", async()=>{
            await sighIn.goto(await sighIn.chooseBrand(brand),'login');
            await sighIn.sigInUserToPlatform(user, process.env.USER_PASSWORD || '');
            await feed.closeOpenedPost(user);
        })
        await test.step("Create post with text", async()=>{
            await feed.openCreatePostForm()
            await feed.addTextToPost('Hello World')
        })
        await test.step("Shared a post function", async()=>{
            await feed.sharedToNagaFeed(user)
            await feed.addSharedTextToPost("test text")
        })
        await test.step("Delete posts", async()=>{
            await feed.deleteSharedPost('test text')
            await feed.deleteExistedPost(user)
        })
    })
}

const testParamsUserCabinet: testFeedtypes[] = [
    {testRailId: '@25132', brand: '@NS', user: 'testFeedUser'},
    {testRailId: '@25147', brand: '@NM', user: 'testFeedUserMarkets'}
]
for(const{testRailId, brand, user}of testParamsUserCabinet){
    test(`${testRailId} Check post in user cabinet ${brand}`, async({page})=>{
        let myAccounts = new MyAccounts(page);
        let userProfile = new UserProfile(page)
        let sighIn = new SighIn(page);
        let feed = new Feed(page);
        let textForPost = 'Hello World'
        await test.step("login by user and clean feed", async()=>{
            await sighIn.goto(await sighIn.chooseBrand(brand),'login');
            await sighIn.sigInUserToPlatform(user, process.env.USER_PASSWORD || '');
            await feed.closeOpenedPost(user);
        })
        await test.step("Open user profile cabinet", async()=>{
            await myAccounts.openUserMenu()
            await myAccounts.openMyAccountsMenuItem('Profile')
        })
        await test.step('Add post from user profile', async()=>{
            await userProfile.addTextToPost(textForPost);
            expect(await userProfile.getPostTextMessage()).toEqual(textForPost);
        })
        await test.step('Delete post', async()=>{
            await userProfile.deletePost()
        })
    })
}

type testFeedNotVeried = {
    testRailId: string,
    brand: string,
    user: string,
    localization: string
}
const testNotVerifieduser: testFeedNotVeried[] = [
    {testRailId: '@25131', brand: '@NS', user: 'notVerifiedUser', localization: '/pageObjects/localization/NagaCapital_Feed.json'},
    {testRailId: '@25148', brand: '@NM', user: 'testNotVerifiesUser', localization: '/pageObjects/localization/NagaMarkets_Feed.json'}
]
for(const{testRailId, brand, user, localization}of testNotVerifieduser){
    test(`${testRailId} post with not verified user ${brand}`, async({page})=>{
        let sighIn = new SighIn(page);
        let feed = new Feed(page)
        let verificationPopup = new VerificationPopup(page);
        let feedLocalization = new getLocalization(localization)
        await test.step("login to platform with not verified user", async()=>{
            await sighIn.goto(await sighIn.chooseBrand(brand),'login');
            await sighIn.sigInUserToPlatform(user, process.env.USER_PASSWORD || '');
        })
        await test.step('User tryes to meke a post without approval', async()=>{
            await feed.openCreatePostForm()
            await feed.clickOnPostZone()
            expect(await feed.getMessageForNotverifiedUser()).toEqual(await feedLocalization.getLocalizationText('NotVerifiedUserPopupMessage'))
            await feed.checkRedirectToVerification();
            expect(await verificationPopup.getUrl()).toContain('verification')
        })
    })
}

})