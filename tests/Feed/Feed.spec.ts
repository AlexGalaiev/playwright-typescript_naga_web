import { expect } from "playwright/test";
import { Feed } from "../../pageObjects/Feed/Feed";
import { MainPage } from "../../pageObjects/MainPage/MainPage";
import { SighIn } from "../../pageObjects/SighIn/SignInPage";
import {test} from "../../test-options"
import { UserProfile } from "../../pageObjects/UserProfile/UserProfile";
import { getLocalization } from "../../pageObjects/localization/getText";
import { VerificationPopup } from "../../pageObjects/VerificationCenter/verificationPopup";
import { MyAccounts } from "../../pageObjects/MainPage/MyAccounts";

test.describe("Naga Capital. Feed", async()=>{
    const feedUser = 'testFeedUser'
    const feedUserMarkets = 'testFeedUserMarkets'
        
    test.beforeEach("Login to platform", async({page, NagaCapital})=>{
        let sighIn = new SighIn(page);
        let feed = new Feed(page)
        await test.step("login and clean feed", async()=>{
            await sighIn.goto(NagaCapital,'login');
            await sighIn.sigInUserToPlatform(feedUser, process.env.USER_PASSWORD || '');
            await feed.closeOpenedPost(feedUser);
        })
    });

    test("@25122 Create post and main actions", async({page})=>{
        let feed = new Feed(page);
        await feed.openCreatePostForm()
        await test.step("Create and edit post", async()=>{
            let previousText = await feed.addTextToPost('Hello World')
            await feed.editExistedPost(feedUser);
            let modifiedTex = await feed.addTextToPost('Bye Bye')
            expect(previousText).not.toEqual(modifiedTex)
        })
        await test.step("Delete post", async()=>{
            await feed.deleteExistedPost(feedUser)
        })
    })

    test("@25123 Post actions - like action", async({page})=>{
        let feed = new Feed(page);
        let userProfile = new UserProfile(page)
        await feed.openCreatePostForm()
        await feed.addTextToPost('Hello World')
        await test.step('User likes a post', async()=>{
            await feed.likePost(feedUser);
            expect(await feed.checkLike(feedUser)).toEqual(feedUser)
        })
        await test.step('Check user profile and delete post', async()=>{
            await feed.checkUserPage(feedUser);
            expect(await userProfile.getUserNameText()).toEqual(feedUser)
            await new MainPage(page).openHeaderMenuPoint("feed")
            await feed.deleteExistedPost(feedUser)
        })
    })

    test("@25124 Comment a post", async({page})=>{
        let feed = new Feed(page);
        await test.step("Create post with text", async()=>{
            await feed.openCreatePostForm()
            await feed.addTextToPost('Hello World')
        })
        await test.step("Comment exist post", async()=>{
            await feed.addCommentToPost(feedUser, 'test commnet')
        })
        await test.step('Check text of comment', async()=>{
            expect(await feed.checkTextOfPost(feedUser)).toContain('test commnet')
            await feed.closeTab()
        })
        await test.step("Close post ", async()=>{
            await feed.closeOpenedPost(feedUser);
        })
    })

    test("@25129 Shared a post", async({page})=>{
        let feed = new Feed(page);
        await test.step("Create post with text", async()=>{
            await feed.openCreatePostForm()
            await feed.addTextToPost('Hello World')
        })
        await test.step("Shared a post function", async()=>{
            await feed.sharedToNagaFeed(feedUser)
            await feed.addSharedTextToPost("test text")
        })
        await test.step("Delete posts", async()=>{
            await feed.deleteSharedPost('test text')
            await feed.deleteExistedPost(feedUser)
        })
    })
    test('@23132 Check post in user cabinet', async({page})=>{
        let myAccounts = new MyAccounts(page);
        let userProfile = new UserProfile(page)
        let textForPost = 'Hello World'
        await test.step("Open user profile cabinet", async()=>{
            await myAccounts.openUserMenu()
            await myAccounts.openMyAccountsMenuItem('profile')
        })
        await test.step('Add post from user profile', async()=>{
            await userProfile.addTextToPost(textForPost);
            expect(await userProfile.getPostTextMessage()).toEqual(textForPost);
        })
        await test.step('Delete post', async()=>{
            await userProfile.deletePost()
        })
    })
})
test('@25131 Naga Capital - Feed - Post with not verified user', async({page, NagaCapital})=>{
    let sighIn = new SighIn(page);
    let feed = new Feed(page)
    let verificationPopup = new VerificationPopup(page);
    let feedLocalization = new getLocalization('/pageObjects/localization/NagaCapital_Feed.json')
    await test.step("login to platform with not verified user", async()=>{
        await sighIn.goto(NagaCapital,'login');
        await sighIn.sigInUserToPlatform('notVerifiedUser', process.env.USER_PASSWORD || '');
    })
    await test.step('User tryes to meke a post without approval', async()=>{
        await feed.openCreatePostForm()
        await feed.clickOnPostZone()
        expect(await feed.getMessageForNotverifiedUser()).toEqual(await feedLocalization.getLocalizationText('NotVerifiedUserPopupMessage'))
        await feed.checkRedirectToVerification();
        expect(await verificationPopup.verificationPoupIsDisplyed()).toBeVisible()
    })
})