import { expect } from "playwright/test";
import {test} from "../../test-options"

test.describe("Feed", async()=>{
    
type testFeedtypes = {
    testRailId: string,
    brand: string,
    user: string
}
const testFeedParams: testFeedtypes[] = [
   {testRailId: '@25122', brand: '@Capital', user: 'testFeedUser'},
   {testRailId: '@25143', brand: '@Markets', user: 'testFeedUserMarkets'},
   {testRailId: '@25382', brand: '@Mena', user: 'xz932923'}, //testFeedUser@naga.com
   {testRailId: '@25403', brand: '@Africa', user: 'testAfricaFeed'} //'testAfricaFeed@naga.com'
]
for(const{testRailId, brand, user}of testFeedParams){
    test(`${testRailId} Main actions for post: create, edit, delete ${brand}`,
        {tag:['@feed', '@prodSanity','@web', '@smoke']}, async({app, AppNAGA}, testInfo)=>{
        testInfo.setTimeout(testInfo.timeout + 30000);
        await test.step(`Login by ${user}. ${brand} brand`, async()=>{
            await app.signIn.goto(AppNAGA,'login');
            await app.signIn.signInUserToPlatform(user, process.env.USER_PASSWORD || '');
        })
        await test.step("Test opens user profile and delete previously created posts (if they exist)", async()=>{
            await app.myAccounts.openUserMenu()
            await app.myAccounts.openMyAccountMenuItem('My Social Profile')
            await app.feed.closeOpenedPost(user);
            await app.mainPage.openBackMenuPoint('feed')
        })
        await app.feed.openCreatePostForm()
        await test.step("Test create post with text(Hello World) and edit text to Bye Bye text", async()=>{
            let previousText = await app.feed.addTextToPost('Hello World')
            await app.feed.editExistedPost(user);
            let modifiedTex = await app.feed.addTextToPost('Bye Bye')
            expect(await previousText).not.toEqual(modifiedTex)
        })
        await test.step("Test delete post", async()=>{
            await app.feed.deleteExistedPost(user)
        })
    })} 

const testFeedParamsActions: testFeedtypes[] = [
    {testRailId: '@25123', brand: '@Capital', user: 'testFeedUser'},
    {testRailId: '@25144', brand: '@Markets', user: 'testFeedUserMarkets'}, 
    {testRailId: '@25383', brand: '@Mena', user: 'xz932923'}, //testFeedUser@naga.com
    {testRailId: '@25404', brand: '@Africa', user: 'testAfricaFeed'} //testFeedUser@naga.com
]
for(const{testRailId, brand, user}of testFeedParamsActions){
    test(`${testRailId} ${brand} Main actions for post: Action - Like`,
        {tag:['@feed','@web']}, async({app, AppNAGA}, testInfo)=>{
    testInfo.setTimeout(testInfo.timeout + 50000);
    await test.step(`login by user ${user} to ${brand} platform`, async()=>{
        await app.signIn.goto(AppNAGA,'login');
        await app.signIn.signInUserToPlatform(user, process.env.USER_PASSWORD || '');
    })
    await test.step("Closed opened posts is they exist (Test goes to User profile and delete posts)", async()=>{
        await app.myAccounts.openUserMenu()
        await app.myAccounts.openMyAccountMenuItem('My Social Profile')
        await app.feed.closeOpenedPost(user);
        await app.mainPage.openBackMenuPoint('feed')
    })
    await test.step("Add new post to feed with text Hello world", async()=>{
        await app.feed.openCreatePostForm()
        await app.feed.addTextToPost('Hello World')
    })
    await test.step('User likes a post', async()=>{
        await app.feed.likePost(user);
        expect(await app.feed.checkLike(user)).toEqual(user)
    })
    await test.step('Check user profile. Check who liked post. And delete post', async()=>{
        await app.feed.checkUserPage(user);
        expect(await app.userProfile.getUserNameText()).toEqual(user)
        await app.feed.closeOpenedPost(user);
    })
})
}

const testFeedCommentParams: testFeedtypes[] = [
    {testRailId: '@25124', brand: '@Capital', user: 'testFeedUser'},
    {testRailId: '@25145', brand: '@Markets', user: 'testFeedUserMarkets'},
    {testRailId: '@25384', brand: '@Mena', user: 'xz932923'},
    {testRailId: '@25405', brand: '@Africa', user: 'testAfricaFeed'}
]
for(const{testRailId, brand, user}of testFeedCommentParams){
    test(`${testRailId} ${brand} Main actions for post: Comment a post ${brand}`, 
        {tag:['@feed','@web']},async({app, AppNAGA}, testInfo)=>{
        testInfo.setTimeout(testInfo.timeout + 50000);
        await test.step(`login by user ${user} to ${brand} platform`, async()=>{
            await app.signIn.goto(AppNAGA,'login');
            await app.signIn.signInUserToPlatform(user, process.env.USER_PASSWORD || '');
        })
        await test.step("In user profile, closed opened posts is they exist", async()=>{
            await app.myAccounts.openUserMenu()
            await app.myAccounts.openMyAccountMenuItem('My Social Profile')
            await app.feed.closeOpenedPost(user);
            await app.mainPage.openBackMenuPoint('feed')
        })
        await test.step("Add new post to feed with text Hello world", async()=>{
            await app.feed.openCreatePostForm()
            await app.feed.addTextToPost('Hello World')
        })
        await test.step("Comment previously created post", async()=>{
            await app.feed.addCommentToPost(user, 'test commnet')
        })
        await test.step('In user profile, check text of comment', async()=>{
            await app.myAccounts.openUserMenu()
            await app.myAccounts.openMyAccountMenuItem('My Social Profile')
            expect(await app.feed.checkTextOfPost(user)).toContain('test commnet')
            await app.feed.closeTab()
        })
        await test.step("Close post ", async()=>{
            await app.feed.closeOpenedPost(user);
        })
    })
}
    
const testShareCommentParams: testFeedtypes[] = [
    {testRailId: '@25129', brand: '@Capital', user: 'testFeedUser'},
    {testRailId: '@25146', brand: '@Markets', user: 'testFeedUserMarkets'},
    {testRailId: '@25385', brand: '@Mena', user: 'xz932923'},
    {testRailId: '@25406', brand: '@Africa', user: 'testAfricaFeed'}
]
for(const{testRailId, brand, user}of testShareCommentParams){
    test(`${testRailId} ${brand} Main action for post: Share a post ${brand}`, 
        {tag:['@feed','@web']},async({app, AppNAGA}, testInfo)=>{
        testInfo.setTimeout(testInfo.timeout + 30000)
        await test.step(`login by user ${user} to ${brand} platform`, async()=>{
            await app.signIn.goto(AppNAGA,'login');
            await app.signIn.signInUserToPlatform(user, process.env.USER_PASSWORD || '');
        })
        await test.step("In user profile, close posts if they exist", async()=>{
            await app.myAccounts.openUserMenu()
            await app.myAccounts.openMyAccountMenuItem('My Social Profile')
            await app.feed.closeOpenedPost(user);
            await app.mainPage.openBackMenuPoint('feed')
        })
        await test.step("Add new post to feed with text Hello world", async()=>{
            await app.feed.openCreatePostForm()
            await app.feed.addTextToPost('Hello World')
        })
        await test.step("Share a post + adding text", async()=>{
            await app.feed.sharedToNagaFeed(user)
            await app.feed.addSharedTextToPost("test text")
        })
        await test.step("Delete posts", async()=>{
            await app.feed.deleteSharedPost('test text')
            await app.feed.deleteExistedPost(user)
        })
    })
}

const testParamsUserCabinet: testFeedtypes[] = [
    {testRailId: '@25132', brand: '@Capital', user: 'testFeedUser'},
    {testRailId: '@25147', brand: '@Markets', user: 'testFeedUserMarkets'},
    {testRailId: '@25386', brand: '@Mena', user: 'xz932923'},
    {testRailId: '@25407', brand: '@Africa', user: 'testAfricaFeed'}
]
for(const{testRailId, brand, user}of testParamsUserCabinet){
    test(`${testRailId} ${brand} Check post in user profile ${brand}`, 
        {tag:['@feed', '@web']}, async({app,AppNAGA}, testInfo)=>{
        testInfo.setTimeout(testInfo.timeout + 30000)
        let textForPost = 'Hello World'
        await test.step(`login by user ${user} to ${brand} platform`, async()=>{
            await app.signIn.goto(AppNAGA,'login');
            await app.signIn.signInUserToPlatform(user, process.env.USER_PASSWORD || '');
        })
        await test.step("Open user profile cabinet and close previously created posts", async()=>{
            await app.myAccounts.openUserMenu()
            await app.myAccounts.openMyAccountMenuItem('My Social Profile')
            await app.feed.closeOpenedPost(user);
        })
        await test.step('Add new post from user profile', async()=>{
            await app.userProfile.addTextToPost(textForPost);
            expect(await app.userProfile.getPostTextMessage()).toEqual(textForPost);
        })
        await test.step('Delete post', async()=>{
            await app.userProfile.deletePost()
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
    {testRailId: '@25131', brand: '@Capital', user: 'notVerifiedUser', localization: '/pageObjects/localization/NagaCapital_Feed.json'},
    {testRailId: '@25148', brand: '@Markets', user: 'testNotVerifiesUser', localization: '/pageObjects/localization/NagaMarkets_Feed.json'},
    {testRailId: '@25387', brand: '@Mena', user: 'notVerifiedFeed', localization: '/pageObjects/localization/NagaMarkets_Feed.json'},
    {testRailId: '@25408', brand: '@Africa', user: 'testAfricaNotVer', localization: '/pageObjects/localization/NagaMarkets_Feed.json'}
]
for(const{testRailId, brand, user, localization}of testNotVerifieduser){
    test(`${testRailId} Not verified user tries to create new post${brand}`, 
        {tag:['@feed','@web']},async({app, AppNAGA}, testInfo)=>{
        testInfo.setTimeout(testInfo.timeout + 30000)
        await test.step(`Login to ${brand} platform with not verified ${user} user`, async()=>{
            await app.signIn.goto(AppNAGA, 'login');
            await app.signIn.signInUserToPlatform(user, process.env.USER_PASSWORD || '');
        })
        await test.step("Delete previously created posts, if exist(in user profile)", async()=>{
            await app.myAccounts.openUserMenu()
            await app.myAccounts.openMyAccountMenuItem('My Social Profile')
            await app.feed.closeOpenedPost(user);
            await app.mainPage.openBackMenuPoint('feed')
        })
        await test.step('User tryes to make post without approval', async()=>{
            await app.feed.openCreatePostForm()
        })
        await test.step("Create and edit post", async()=>{
            let previousText = await app.feed.addTextToPost('Hello World')
            await app.feed.editExistedPost(user);
            let modifiedTex = await app.feed.addTextToPost('Bye Bye')
            expect(await previousText).not.toEqual(modifiedTex)
        })
        await test.step("Delete post", async()=>{
            await app.feed.deleteExistedPost(user)
        })
    })
}})
