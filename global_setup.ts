import { TestRailIntegration } from "./testrail_setup";

async function TestRailRunCreation() {
    let TR = await new TestRailIntegration()
    await TR.AddManualRun();
    await TR.AddAutomationRun();
};

export default TestRailRunCreation