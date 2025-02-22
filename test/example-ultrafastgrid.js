'use strict';

const {
    VisualGridRunner,
    Eyes,
    Target,
    Configuration,
    RectangleSize,
    BatchInfo,
    BrowserType,
    DeviceName,
    ScreenOrientation,
    RunnerOptions
} = require('@applitools/eyes-protractor');

let eyes;

describe('protractor', function () {
    let runner

    beforeAll(async () => {
        browser.waitForAngularEnabled(false)

        // Create a runner with concurrency of 1
        const runnerOptions = new RunnerOptions().testConcurrency(5)
        runner = new VisualGridRunner(runnerOptions);

        // Create Eyes object with the runner, meaning it'll be a Visual Grid eyes.
        eyes = new Eyes(runner);

        // Initialize the eyes configuration
        const configuration = new Configuration();

        // You can get your api key from the Applitools dashboard
        // configuration.setApiKey('APPLITOOLS_API_KEY')

        // create a new batch info instance and set it to the configuration
        configuration.setBatch(new BatchInfo('Ultrafast Batch'))

        // Add browsers with different viewports
        configuration.addBrowser(800, 600, BrowserType.CHROME);
        configuration.addBrowser(700, 500, BrowserType.FIREFOX);
        configuration.addBrowser(1600, 1200, BrowserType.IE_11);
        configuration.addBrowser(1024, 768, BrowserType.EDGE_CHROMIUM);
        configuration.addBrowser(800, 600, BrowserType.SAFARI);

        // Add mobile emulation devices in Portrait mode
        configuration.addDeviceEmulation(DeviceName.iPhone_X, ScreenOrientation.PORTRAIT);
        configuration.addDeviceEmulation(DeviceName.Pixel_2, ScreenOrientation.PORTRAIT);

        // Set the configuration to eyes
        eyes.setConfiguration(configuration);
    });


    it('ultraFastTest', async () => {

        // Navigate to the url we want to test
        // ⭐️ Note to see visual bugs, run the test using the above URL for the 1st run.
        // but then change the above URL to https://demo.applitools.com/index_v2.html
        // (for the 2nd run)
        await browser.get('https://demo.applitools.com');

        // Call Open on eyes to initialize a test session
        await eyes.open(browser, 'Demo App - Protractor', 'Ultrafast grid demo', new RectangleSize(800, 600));

        // check the login page with fluent api, see more info here
        // https://applitools.com/docs/topics/sdk/the-eyes-sdk-check-fluent-api.html
        await eyes.check('Login Window', Target.window().fully());

        // Click the "Log in" button.
        element(by.id("log-in")).click();

        // Check the app page
        await eyes.check('App Window', Target.window().fully());

        // Call Close on eyes to let the server know it should display the results
        await eyes.close();
    });

    afterAll(async () => {
        // If the test was aborted before eyes.close was called, ends the test as aborted.
        await eyes.abort();

        // we pass false to this method to suppress the exception that is thrown if we
        // find visual differences
        const results = await runner.getAllTestResults();
        console.log(results);
    });

});
