import { expect } from "playwright/test";
import { Feed } from "../../pageObjects/Feed/Feed";
import { MainPage } from "../../pageObjects/MainPage/MainPage";
import { SighIn } from "../../pageObjects/SighIn/SignInPage";
import {test} from "..//..//test-options"
import { UserProfile } from "../../pageObjects/UserProfile/UserProfile";

test.describe("Naga Capital. Feed", async()=>{
    const feedUser = 'testTrading'
    //testFeed need to finish registration and change user
    
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
            await new MainPage(page).openHeaderMenuPoint("Feed")
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
})