"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const tslib_1 = require("tslib");
const function_1 = require("./function");
const sdk_1 = require("@immich/sdk");
const node_cron_1 = tslib_1.__importDefault(require("node-cron"));
const pta = new function_1.PersonToAlbum();
function main() {
    return tslib_1.__awaiter(this, void 0, void 0, function* () {
        console.log(new Date().toISOString());
        // Test connection to Immich
        let immichAvailable = false;
        const pingUrl = pta.config.immichServer + '/api/server/ping';
        try {
            const response = yield fetch(pingUrl);
            const result = yield response.json();
            immichAvailable = result.res === 'pong';
        }
        catch (e) { }
        if (!immichAvailable) {
            console.log('Unable to ping Immich API on ' + pingUrl);
            console.log('Make sure that URL is accessible to this container.');
            console.log('You can test this by running:');
            console.log(`docker exec immich-person-to-album sh -c "wget -qO- ${pingUrl}"`);
            console.log('The result should be `{"res":"pong"}`');
            return;
        }
        for (const user of pta.config.users) {
            // Init Immich SDK with the specified API key
            (0, sdk_1.init)({ baseUrl: pta.config.immichServer + '/api', apiKey: user.apiKey });
            // Process each of the person-album linkages
            for (const link of user.personLinks) {
                // Populate a truncated API key which will be used in the store.json key name
                link.apiKeyShort = user.apiKey.slice(0, 6);
                try {
                    yield pta.processPerson(link);
                }
                catch (e) {
                    console.log(e);
                }
            }
        }
        console.log('Waiting for next scheduled task...');
    });
}
// Send the correct process error code for any uncaught exceptions
// so that Docker can gracefully restart the container
process.on('uncaughtException', (err) => {
    console.error('There was an uncaught error', err);
    process.exit(1);
});
process.on('unhandledRejection', (reason, promise) => {
    console.error('Unhandled Rejection at:', promise, 'reason:', reason);
    process.exit(1);
});
process.on('SIGTERM', () => {
    console.log('Received SIGTERM. Gracefully shutting down...');
    process.exit(0);
});
// Run on startup
main()
    .then(() => {
    // Then afterwards run on a schedule
    node_cron_1.default.schedule(pta.config.schedule || '0,30 * * * *', main);
});
//# sourceMappingURL=data:application/json;base64,eyJ2ZXJzaW9uIjozLCJmaWxlIjoiaW5kZXguanMiLCJzb3VyY2VSb290IjoiIiwic291cmNlcyI6WyIuLi9zcmMvaW5kZXgudHMiXSwibmFtZXMiOltdLCJtYXBwaW5ncyI6Ijs7O0FBQUEseUNBQTBDO0FBQzFDLHFDQUFrQztBQUNsQyxrRUFBNEI7QUFFNUIsTUFBTSxHQUFHLEdBQUcsSUFBSSx3QkFBYSxFQUFFLENBQUE7QUFFL0IsU0FBZSxJQUFJOztRQUNqQixPQUFPLENBQUMsR0FBRyxDQUFDLElBQUksSUFBSSxFQUFFLENBQUMsV0FBVyxFQUFFLENBQUMsQ0FBQTtRQUVyQyw0QkFBNEI7UUFDNUIsSUFBSSxlQUFlLEdBQUcsS0FBSyxDQUFBO1FBQzNCLE1BQU0sT0FBTyxHQUFHLEdBQUcsQ0FBQyxNQUFNLENBQUMsWUFBWSxHQUFHLGtCQUFrQixDQUFBO1FBQzVELElBQUksQ0FBQztZQUNILE1BQU0sUUFBUSxHQUFHLE1BQU0sS0FBSyxDQUFDLE9BQU8sQ0FBQyxDQUFBO1lBQ3JDLE1BQU0sTUFBTSxHQUFHLE1BQU0sUUFBUSxDQUFDLElBQUksRUFBRSxDQUFBO1lBQ3BDLGVBQWUsR0FBRyxNQUFNLENBQUMsR0FBRyxLQUFLLE1BQU0sQ0FBQTtRQUN6QyxDQUFDO1FBQUMsT0FBTyxDQUFDLEVBQUUsQ0FBQyxDQUFDLENBQUM7UUFDZixJQUFJLENBQUMsZUFBZSxFQUFFLENBQUM7WUFDckIsT0FBTyxDQUFDLEdBQUcsQ0FBQywrQkFBK0IsR0FBRyxPQUFPLENBQUMsQ0FBQTtZQUN0RCxPQUFPLENBQUMsR0FBRyxDQUFDLHFEQUFxRCxDQUFDLENBQUE7WUFDbEUsT0FBTyxDQUFDLEdBQUcsQ0FBQywrQkFBK0IsQ0FBQyxDQUFBO1lBQzVDLE9BQU8sQ0FBQyxHQUFHLENBQUMsdURBQXVELE9BQU8sR0FBRyxDQUFDLENBQUE7WUFDOUUsT0FBTyxDQUFDLEdBQUcsQ0FBQyx1Q0FBdUMsQ0FBQyxDQUFBO1lBQ3BELE9BQU07UUFDUixDQUFDO1FBRUQsS0FBSyxNQUFNLElBQUksSUFBSSxHQUFHLENBQUMsTUFBTSxDQUFDLEtBQUssRUFBRSxDQUFDO1lBQ3BDLDZDQUE2QztZQUM3QyxJQUFBLFVBQUksRUFBQyxFQUFFLE9BQU8sRUFBRSxHQUFHLENBQUMsTUFBTSxDQUFDLFlBQVksR0FBRyxNQUFNLEVBQUUsTUFBTSxFQUFFLElBQUksQ0FBQyxNQUFNLEVBQUUsQ0FBQyxDQUFBO1lBRXhFLDRDQUE0QztZQUM1QyxLQUFLLE1BQU0sSUFBSSxJQUFJLElBQUksQ0FBQyxXQUFXLEVBQUUsQ0FBQztnQkFDcEMsNkVBQTZFO2dCQUM3RSxJQUFJLENBQUMsV0FBVyxHQUFHLElBQUksQ0FBQyxNQUFNLENBQUMsS0FBSyxDQUFDLENBQUMsRUFBRSxDQUFDLENBQUMsQ0FBQTtnQkFDMUMsSUFBSSxDQUFDO29CQUNILE1BQU0sR0FBRyxDQUFDLGFBQWEsQ0FBQyxJQUFJLENBQUMsQ0FBQTtnQkFDL0IsQ0FBQztnQkFBQyxPQUFPLENBQUMsRUFBRSxDQUFDO29CQUNYLE9BQU8sQ0FBQyxHQUFHLENBQUMsQ0FBQyxDQUFDLENBQUE7Z0JBQ2hCLENBQUM7WUFDSCxDQUFDO1FBQ0gsQ0FBQztRQUNELE9BQU8sQ0FBQyxHQUFHLENBQUMsb0NBQW9DLENBQUMsQ0FBQTtJQUNuRCxDQUFDO0NBQUE7QUFFRCxrRUFBa0U7QUFDbEUsc0RBQXNEO0FBQ3RELE9BQU8sQ0FBQyxFQUFFLENBQUMsbUJBQW1CLEVBQUUsQ0FBQyxHQUFHLEVBQUUsRUFBRTtJQUN0QyxPQUFPLENBQUMsS0FBSyxDQUFDLDZCQUE2QixFQUFFLEdBQUcsQ0FBQyxDQUFBO0lBQ2pELE9BQU8sQ0FBQyxJQUFJLENBQUMsQ0FBQyxDQUFDLENBQUE7QUFDakIsQ0FBQyxDQUFDLENBQUE7QUFDRixPQUFPLENBQUMsRUFBRSxDQUFDLG9CQUFvQixFQUFFLENBQUMsTUFBTSxFQUFFLE9BQU8sRUFBRSxFQUFFO0lBQ25ELE9BQU8sQ0FBQyxLQUFLLENBQUMseUJBQXlCLEVBQUUsT0FBTyxFQUFFLFNBQVMsRUFBRSxNQUFNLENBQUMsQ0FBQTtJQUNwRSxPQUFPLENBQUMsSUFBSSxDQUFDLENBQUMsQ0FBQyxDQUFBO0FBQ2pCLENBQUMsQ0FBQyxDQUFBO0FBQ0YsT0FBTyxDQUFDLEVBQUUsQ0FBQyxTQUFTLEVBQUUsR0FBRyxFQUFFO0lBQ3pCLE9BQU8sQ0FBQyxHQUFHLENBQUMsK0NBQStDLENBQUMsQ0FBQTtJQUM1RCxPQUFPLENBQUMsSUFBSSxDQUFDLENBQUMsQ0FBQyxDQUFBO0FBQ2pCLENBQUMsQ0FBQyxDQUFBO0FBRUYsaUJBQWlCO0FBRWpCLElBQUksRUFBRTtLQUNILElBQUksQ0FBQyxHQUFHLEVBQUU7SUFDVCxvQ0FBb0M7SUFDcEMsbUJBQUksQ0FBQyxRQUFRLENBQUMsR0FBRyxDQUFDLE1BQU0sQ0FBQyxRQUFRLElBQUksY0FBYyxFQUFFLElBQUksQ0FBQyxDQUFBO0FBQzVELENBQUMsQ0FBQyxDQUFBIiwic291cmNlc0NvbnRlbnQiOlsiaW1wb3J0IHsgUGVyc29uVG9BbGJ1bSB9IGZyb20gJy4vZnVuY3Rpb24nXG5pbXBvcnQgeyBpbml0IH0gZnJvbSAnQGltbWljaC9zZGsnXG5pbXBvcnQgY3JvbiBmcm9tICdub2RlLWNyb24nXG5cbmNvbnN0IHB0YSA9IG5ldyBQZXJzb25Ub0FsYnVtKClcblxuYXN5bmMgZnVuY3Rpb24gbWFpbiAoKSB7XG4gIGNvbnNvbGUubG9nKG5ldyBEYXRlKCkudG9JU09TdHJpbmcoKSlcblxuICAvLyBUZXN0IGNvbm5lY3Rpb24gdG8gSW1taWNoXG4gIGxldCBpbW1pY2hBdmFpbGFibGUgPSBmYWxzZVxuICBjb25zdCBwaW5nVXJsID0gcHRhLmNvbmZpZy5pbW1pY2hTZXJ2ZXIgKyAnL2FwaS9zZXJ2ZXIvcGluZydcbiAgdHJ5IHtcbiAgICBjb25zdCByZXNwb25zZSA9IGF3YWl0IGZldGNoKHBpbmdVcmwpXG4gICAgY29uc3QgcmVzdWx0ID0gYXdhaXQgcmVzcG9uc2UuanNvbigpXG4gICAgaW1taWNoQXZhaWxhYmxlID0gcmVzdWx0LnJlcyA9PT0gJ3BvbmcnXG4gIH0gY2F0Y2ggKGUpIHsgfVxuICBpZiAoIWltbWljaEF2YWlsYWJsZSkge1xuICAgIGNvbnNvbGUubG9nKCdVbmFibGUgdG8gcGluZyBJbW1pY2ggQVBJIG9uICcgKyBwaW5nVXJsKVxuICAgIGNvbnNvbGUubG9nKCdNYWtlIHN1cmUgdGhhdCBVUkwgaXMgYWNjZXNzaWJsZSB0byB0aGlzIGNvbnRhaW5lci4nKVxuICAgIGNvbnNvbGUubG9nKCdZb3UgY2FuIHRlc3QgdGhpcyBieSBydW5uaW5nOicpXG4gICAgY29uc29sZS5sb2coYGRvY2tlciBleGVjIGltbWljaC1wZXJzb24tdG8tYWxidW0gc2ggLWMgXCJ3Z2V0IC1xTy0gJHtwaW5nVXJsfVwiYClcbiAgICBjb25zb2xlLmxvZygnVGhlIHJlc3VsdCBzaG91bGQgYmUgYHtcInJlc1wiOlwicG9uZ1wifWAnKVxuICAgIHJldHVyblxuICB9XG5cbiAgZm9yIChjb25zdCB1c2VyIG9mIHB0YS5jb25maWcudXNlcnMpIHtcbiAgICAvLyBJbml0IEltbWljaCBTREsgd2l0aCB0aGUgc3BlY2lmaWVkIEFQSSBrZXlcbiAgICBpbml0KHsgYmFzZVVybDogcHRhLmNvbmZpZy5pbW1pY2hTZXJ2ZXIgKyAnL2FwaScsIGFwaUtleTogdXNlci5hcGlLZXkgfSlcblxuICAgIC8vIFByb2Nlc3MgZWFjaCBvZiB0aGUgcGVyc29uLWFsYnVtIGxpbmthZ2VzXG4gICAgZm9yIChjb25zdCBsaW5rIG9mIHVzZXIucGVyc29uTGlua3MpIHtcbiAgICAgIC8vIFBvcHVsYXRlIGEgdHJ1bmNhdGVkIEFQSSBrZXkgd2hpY2ggd2lsbCBiZSB1c2VkIGluIHRoZSBzdG9yZS5qc29uIGtleSBuYW1lXG4gICAgICBsaW5rLmFwaUtleVNob3J0ID0gdXNlci5hcGlLZXkuc2xpY2UoMCwgNilcbiAgICAgIHRyeSB7XG4gICAgICAgIGF3YWl0IHB0YS5wcm9jZXNzUGVyc29uKGxpbmspXG4gICAgICB9IGNhdGNoIChlKSB7XG4gICAgICAgIGNvbnNvbGUubG9nKGUpXG4gICAgICB9XG4gICAgfVxuICB9XG4gIGNvbnNvbGUubG9nKCdXYWl0aW5nIGZvciBuZXh0IHNjaGVkdWxlZCB0YXNrLi4uJylcbn1cblxuLy8gU2VuZCB0aGUgY29ycmVjdCBwcm9jZXNzIGVycm9yIGNvZGUgZm9yIGFueSB1bmNhdWdodCBleGNlcHRpb25zXG4vLyBzbyB0aGF0IERvY2tlciBjYW4gZ3JhY2VmdWxseSByZXN0YXJ0IHRoZSBjb250YWluZXJcbnByb2Nlc3Mub24oJ3VuY2F1Z2h0RXhjZXB0aW9uJywgKGVycikgPT4ge1xuICBjb25zb2xlLmVycm9yKCdUaGVyZSB3YXMgYW4gdW5jYXVnaHQgZXJyb3InLCBlcnIpXG4gIHByb2Nlc3MuZXhpdCgxKVxufSlcbnByb2Nlc3Mub24oJ3VuaGFuZGxlZFJlamVjdGlvbicsIChyZWFzb24sIHByb21pc2UpID0+IHtcbiAgY29uc29sZS5lcnJvcignVW5oYW5kbGVkIFJlamVjdGlvbiBhdDonLCBwcm9taXNlLCAncmVhc29uOicsIHJlYXNvbilcbiAgcHJvY2Vzcy5leGl0KDEpXG59KVxucHJvY2Vzcy5vbignU0lHVEVSTScsICgpID0+IHtcbiAgY29uc29sZS5sb2coJ1JlY2VpdmVkIFNJR1RFUk0uIEdyYWNlZnVsbHkgc2h1dHRpbmcgZG93bi4uLicpXG4gIHByb2Nlc3MuZXhpdCgwKVxufSlcblxuLy8gUnVuIG9uIHN0YXJ0dXBcblxubWFpbigpXG4gIC50aGVuKCgpID0+IHtcbiAgICAvLyBUaGVuIGFmdGVyd2FyZHMgcnVuIG9uIGEgc2NoZWR1bGVcbiAgICBjcm9uLnNjaGVkdWxlKHB0YS5jb25maWcuc2NoZWR1bGUgfHwgJzAsMzAgKiAqICogKicsIG1haW4pXG4gIH0pXG4iXX0=