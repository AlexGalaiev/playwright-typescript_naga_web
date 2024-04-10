import { TestRailIntegration } from "./testrail_setup";


async function TestRailCreateRuns() {
    let TR = new TestRailIntegration();
    await TR.AddManualRun();
    await TR.AddAutomationRun()
}

export default TestRailCreateRuns;
    