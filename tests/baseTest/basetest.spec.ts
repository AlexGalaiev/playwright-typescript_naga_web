import test from "playwright/test"
import { TestRailRunCreation } from "../../pageObjects/global.setup"



test("base test", async()=>{
    return new TestRailRunCreation().createTestRailRuns()
})