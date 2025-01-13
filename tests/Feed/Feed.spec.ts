import { expect } from "playwright/test";
import { Feed } from "../../pageObjects/Feed/Feed";
import { MainPage } from "../../pageObjects/MainPage/MainPage";
import { SignIn } from "../../pageObjects/SignIn/SignInPage";
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
    test(`${testRailId} Main actions for post: create, edit, delete ${brand}`,{tag:['@feed', '@prodSanity']}, async({page}, testInfo)=>{
        await testInfo.setTimeout(testInfo.timeout + 30000);
        let signIn = new SignIn(page);
        let feed = new Feed(page)
        let myAccounts = new MyAccounts(page)
        await test.step(`login by existing user ${user}`, async()=>{
            await signIn.goto(await signIn.chooseBrand(brand),'login');
            await signIn.signInUserToPlatform(user, process.env.USER_PASSWORD || '');
        })
        await test.step("Delete previously created posts, if exist(in user profile)", async()=>{
            await myAccounts.openUserMenu()
            await myAccounts.openMyAccountsMenuItem('Profile')
            await feed.closeOpenedPost(user);
            await new MainPage(page).openHeaderMenuPoint('feed')
        })
        await feed.openCreatePostForm()
        await test.step("Create and edit post", async()=>{
            let previousText = await feed.addTextToPost('Hello World')
            await feed.editExistedPost(user);
            let modifiedTex = await feed.addTextToPost('Bye Bye')
            expect(await previousText).not.toEqual(modifiedTex)
        })
        await test.step("Delete post", async()=>{
            await feed.deleteExistedPost(user)
        })
    })}
type testCryptoTypes = {
    testRailId: string,
    brand: string,
    user: string,
    userId: string,
}   

const testFeedParamsActions: testFeedtypes[] = [
    {testRailId: '@25123', brand: '@NS', user: 'testFeedUser'},
    {testRailId: '@25144', brand: '@NM', user: 'testFeedUserMarkets'}
]
for(const{testRailId, brand, user}of testFeedParamsActions){
    test(`${testRailId} Main actions for post: action - Like ${brand}`,{tag:'@feed'}, async({page}, testInfo)=>{
    await testInfo.setTimeout(testInfo.timeout + 50000);
    let signIn = new SignIn(page);
    let feed = new Feed(page)
    let userProfile = new UserProfile(page)
    let myAccounts = new MyAccounts(page)
    await test.step(`login by exist user ${user}`, async()=>{
        await signIn.goto(await signIn.chooseBrand(brand),'login');
        await signIn.signInUserToPlatform(user, process.env.USER_PASSWORD || '');
    })
    await test.step("Closed opened posts is they exist(in user profile)", async()=>{
        await myAccounts.openUserMenu()
        await myAccounts.openMyAccountsMenuItem('Profile')
        await feed.closeOpenedPost(user);
        await new MainPage(page).openHeaderMenuPoint('feed')
    })
    await test.step("Add new post to feed with text Hello world", async()=>{
        await feed.openCreatePostForm()
        await feed.addTextToPost('Hello World')
    })
    await test.step('User likes a post', async()=>{
        await feed.likePost(user);
        expect(await feed.checkLike(user)).toEqual(user)
    })
    await test.step('Check user profile(who liked post) and delete post', async()=>{
        await feed.checkUserPage(user);
        expect(await userProfile.getUserNameText()).toEqual(user)
        await feed.closeOpenedPost(user);
    })
})
}

const testFeedCommentParams: testFeedtypes[] = [
    {testRailId: '@25124', brand: '@NS', user: 'testFeedUser'},
    {testRailId: '@25145', brand: '@NM', user: 'testFeedUserMarkets'}
]
for(const{testRailId, brand, user}of testFeedCommentParams){
    test(`${testRailId} Main actions for post: Comment a post ${brand}`, {tag:'@feed'},async({page}, testInfo)=>{
        await testInfo.setTimeout(testInfo.timeout + 50000);
        let feed = new Feed(page);
        let signIn = new SignIn(page);
        let myAccounts = new MyAccounts(page)
        await test.step(`login by existing user ${user}`, async()=>{
            await signIn.goto(await signIn.chooseBrand(brand),'login');
            await signIn.signInUserToPlatform(user, process.env.USER_PASSWORD || '');
        })
        await test.step("In user profile, closed opened posts is they exist", async()=>{
            await myAccounts.openUserMenu()
            await myAccounts.openMyAccountsMenuItem('Profile')
            await feed.closeOpenedPost(user);
            await new MainPage(page).openHeaderMenuPoint('feed')
        })
        await test.step("Add new post to feed with text Hello world", async()=>{
            await feed.openCreatePostForm()
            await feed.addTextToPost('Hello World')
        })
        await test.step("Comment reviously created post", async()=>{
            await feed.addCommentToPost(user, 'test commnet')
        })
        await test.step('In user profile, check text of comment', async()=>{
            await myAccounts.openUserMenu()
            await myAccounts.openMyAccountsMenuItem('Profile')
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
    test(`${testRailId} Main action for post: Share a post ${brand}`, {tag:['@feed', '@prodSanity']},async({page}, testInfo)=>{
        await testInfo.setTimeout(testInfo.timeout + 30000);
        let feed = new Feed(page);
        let signIn = new SignIn(page);
        let myAccounts = new MyAccounts(page)
        await test.step("login by user", async()=>{
            await signIn.goto(await signIn.chooseBrand(brand),'login');
            await signIn.signInUserToPlatform(user, process.env.USER_PASSWORD || '');
        })
        await test.step("In user profile, close posts if they exist", async()=>{
            await myAccounts.openUserMenu()
            await myAccounts.openMyAccountsMenuItem('Profile')
            await feed.closeOpenedPost(user);
            await new MainPage(page).openHeaderMenuPoint('feed')
        })
        await test.step("Add new post to feed with text Hello world", async()=>{
            await feed.openCreatePostForm()
            await feed.addTextToPost('Hello World')
        })
        await test.step("Share a post + adding text", async()=>{
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
    test(`${testRailId} Check post in user profile ${brand}`, {tag:'@feed'}, async({page}, testInfo)=>{
        await testInfo.setTimeout(testInfo.timeout + 30000);
        let myAccounts = new MyAccounts(page);
        let userProfile = new UserProfile(page)
        let signIn = new SignIn(page);
        let feed = new Feed(page);
        let textForPost = 'Hello World'
        await test.step("login by user", async()=>{
            await signIn.goto(await signIn.chooseBrand(brand),'login');
            await signIn.signInUserToPlatform(user, process.env.USER_PASSWORD || '');
        })
        await test.step("Open user profile cabinet and close previously created posts", async()=>{
            await myAccounts.openUserMenu()
            await myAccounts.openMyAccountsMenuItem('Profile')
            await feed.closeOpenedPost(user);
        })
        await test.step('Add new post from user profile', async()=>{
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
    test(`${testRailId} Not verified user tries to create new post${brand}`, {tag:'@feed'},async({page}, testInfo)=>{
        await testInfo.setTimeout(testInfo.timeout + 30000);
        let signIn = new SignIn(page);
        let feed = new Feed(page)
        let myAccounts = new MyAccounts(page)
        await test.step("login to platform with not verified user", async()=>{
            await signIn.goto(await signIn.chooseBrand(brand),'login');
            await signIn.signInUserToPlatform(user, process.env.USER_PASSWORD || '');
        })
        await test.step("Delete previously created posts, if exist(in user profile)", async()=>{
            await myAccounts.openUserMenu()
            await myAccounts.openMyAccountsMenuItem('Profile')
            await feed.closeOpenedPost(user);
            await new MainPage(page).openHeaderMenuPoint('feed')
        })
        await test.step('User tryes to meke a post without approval', async()=>{
            await feed.openCreatePostForm()
        })
        await test.step("Create and edit post", async()=>{
            let previousText = await feed.addTextToPost('Hello World')
            await feed.editExistedPost(user);
            let modifiedTex = await feed.addTextToPost('Bye Bye')
            expect(await previousText).not.toEqual(modifiedTex)
        })
        await test.step("Delete post", async()=>{
                await feed.deleteExistedPost(user)
        })
    })
    }})
