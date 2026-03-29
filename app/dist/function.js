"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.PersonToAlbum = void 0;
const tslib_1 = require("tslib");
const sdk_1 = require("@immich/sdk");
const store_1 = tslib_1.__importDefault(require("./store"));
const path_1 = tslib_1.__importDefault(require("path"));
class PersonToAlbum {
    constructor() {
        this.initConfig();
    }
    /**
     * Read the config.json file or parse the CONFIG env value to get the configuration
     */
    initConfig() {
        try {
            if (process.env.CONFIG) {
                // Attempt to parse docker-compose config string into JSON (if specified)
                this.config = JSON.parse(process.env.CONFIG);
            }
            else {
                const configJson = require(path_1.default.resolve('../data/config.json'));
                if (typeof configJson === 'object')
                    this.config = configJson;
            }
        }
        catch (e) {
            console.log(e);
            console.log('Unable to parse config file.');
        }
    }
    processPerson(link) {
        return tslib_1.__awaiter(this, void 0, void 0, function* () {
            var _a, _b, _c, _d;
            let nextPage = '1';
            let mostRecent;
            // Resolve effective person IDs (support both legacy personId and new personIds)
            const personIds = (_a = link.personIds) !== null && _a !== void 0 ? _a : (link.personId ? [link.personId] : []);
            const personIdSet = new Set(personIds);
            const minCount = (_b = link.minCount) !== null && _b !== void 0 ? _b : 1;
            if (link.description)
                console.log(`=== ${link.description} ===`);
            console.log(`Adding person(s) ${personIds.join(', ')} to album ${link.albumId}`);
            while (nextPage !== null) {
                console.log(` - Processing page ${nextPage}`);
                const res = yield (0, sdk_1.searchAssets)({
                    metadataSearchDto: {
                        // I'm using `updated` here because this is documented to be the time when
                        // the asset was updated in Immich, and nothing to do with the EXIF data.
                        // https://immich.app/docs/api/get-asset-info
                        // This may also be the case for `created`, but it doesn't specify that in the docs.
                        updatedAfter: store_1.default.get(this.getUpdateKeyName(link)),
                        page: parseInt(nextPage, 10), // why is `nextPage` a string and `page` a number? ¯\_(ツ)_/¯
                        personIds
                    }
                });
                // Track the most recent photo timestamp so we can update the store
                if (!mostRecent && res.assets.items[0])
                    mostRecent = res.assets.items[0].updatedAt;
                let assetIds;
                if (minCount <= 1) {
                    // No additional filtering needed; all found assets already contain at least one matching person
                    assetIds = res.assets.items.map(x => x.id);
                }
                else {
                    // Filter assets: only include those with at least minCount matching people from the list
                    assetIds = [];
                    for (const asset of res.assets.items) {
                        // Use people from the search result if already populated, otherwise fetch asset details
                        const people = (_d = (_c = asset.people) !== null && _c !== void 0 ? _c : (yield (0, sdk_1.getAssetInfo)({ id: asset.id })).people) !== null && _d !== void 0 ? _d : [];
                        const matchCount = people.filter(p => personIdSet.has(p.id)).length;
                        if (matchCount >= minCount) {
                            assetIds.push(asset.id);
                        }
                    }
                }
                if (assetIds.length > 0) {
                    yield (0, sdk_1.addAssetsToAlbum)({
                        id: link.albumId,
                        bulkIdsDto: {
                            ids: assetIds
                        }
                    });
                }
                nextPage = res.assets.nextPage;
            }
            // Store the most recent asset update value so we can start processing only newer items next time.
            yield store_1.default.set(this.getUpdateKeyName(link), mostRecent);
            console.log();
        });
    }
    /**
     * Get the correctly formatted key name for most-recent updated value in the store
     */
    getUpdateKeyName(link) {
        var _a;
        const personIds = (_a = link.personIds) !== null && _a !== void 0 ? _a : (link.personId ? [link.personId] : []);
        return [link.apiKeyShort, [...personIds].sort().join('+'), link.albumId].join(':');
    }
}
exports.PersonToAlbum = PersonToAlbum;
//# sourceMappingURL=data:application/json;base64,eyJ2ZXJzaW9uIjozLCJmaWxlIjoiZnVuY3Rpb24uanMiLCJzb3VyY2VSb290IjoiIiwic291cmNlcyI6WyIuLi9zcmMvZnVuY3Rpb24udHMiXSwibmFtZXMiOltdLCJtYXBwaW5ncyI6Ijs7OztBQUNBLHFDQUEwRTtBQUMxRSw0REFBMkI7QUFDM0Isd0RBQXVCO0FBRXZCLE1BQWEsYUFBYTtJQUd4QjtRQUNFLElBQUksQ0FBQyxVQUFVLEVBQUUsQ0FBQTtJQUNuQixDQUFDO0lBRUQ7O09BRUc7SUFDSCxVQUFVO1FBQ1IsSUFBSSxDQUFDO1lBQ0gsSUFBSSxPQUFPLENBQUMsR0FBRyxDQUFDLE1BQU0sRUFBRSxDQUFDO2dCQUN2Qix5RUFBeUU7Z0JBQ3pFLElBQUksQ0FBQyxNQUFNLEdBQUcsSUFBSSxDQUFDLEtBQUssQ0FBQyxPQUFPLENBQUMsR0FBRyxDQUFDLE1BQU0sQ0FBQyxDQUFBO1lBQzlDLENBQUM7aUJBQU0sQ0FBQztnQkFDTixNQUFNLFVBQVUsR0FBRyxPQUFPLENBQUMsY0FBSSxDQUFDLE9BQU8sQ0FBQyxxQkFBcUIsQ0FBQyxDQUFDLENBQUE7Z0JBQy9ELElBQUksT0FBTyxVQUFVLEtBQUssUUFBUTtvQkFBRSxJQUFJLENBQUMsTUFBTSxHQUFHLFVBQVUsQ0FBQTtZQUM5RCxDQUFDO1FBQ0gsQ0FBQztRQUFDLE9BQU8sQ0FBQyxFQUFFLENBQUM7WUFDWCxPQUFPLENBQUMsR0FBRyxDQUFDLENBQUMsQ0FBQyxDQUFBO1lBQ2QsT0FBTyxDQUFDLEdBQUcsQ0FBQyw4QkFBOEIsQ0FBQyxDQUFBO1FBQzdDLENBQUM7SUFDSCxDQUFDO0lBRUssYUFBYSxDQUFFLElBQVU7OztZQUM3QixJQUFJLFFBQVEsR0FBa0IsR0FBRyxDQUFBO1lBQ2pDLElBQUksVUFBOEIsQ0FBQTtZQUVsQyxnRkFBZ0Y7WUFDaEYsTUFBTSxTQUFTLEdBQUcsTUFBQSxJQUFJLENBQUMsU0FBUyxtQ0FBSSxDQUFDLElBQUksQ0FBQyxRQUFRLENBQUMsQ0FBQyxDQUFDLENBQUMsSUFBSSxDQUFDLFFBQVEsQ0FBQyxDQUFD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O1lBQ2xHLE1BQU0sZUFBSyxDQUFDLEdBQUcsQ0FBQyxJQUFJLENBQUMsZ0JBQWdCLENBQUMsSUFBSSxDQUFDLEVBQUUsVUFBVSxDQUFDLENBQUE7WUFDeEQsT0FBTyxDQUFDLEdBQUcsRUFBRSxDQUFBO1FBQ2YsQ0FBQztLQUFBO0lBRUQ7O09BRUc7SUFDSCxnQkFBZ0IsQ0FBRSxJQUFVOztRQUMxQixNQUFNLFNBQVMsR0FBRyxNQUFBLElBQUksQ0FBQyxTQUFTLG1DQUFJLENBQUMsSUFBSSxDQUFDLFFBQVEsQ0FBQyxDQUFDLENBQUMsQ0FBQyxJQUFJLENBQUMsUUFBUSxDQUFDLENBQUMsQ0FBQyxDQUFDLEVBQUUsQ0FBQyxDQUFBO1FBQzFFLE9BQU8sQ0FBQyxJQUFJLENBQUMsV0FBVyxFQUFFLENBQUMsR0FBRyxTQUFTLENBQUMsQ0FBQyxJQUFJLEVBQUUsQ0FBQyxJQUFJLENBQUMsR0FBRyxDQUFDLEVBQUUsSUFBSSxDQUFDLE9BQU8sQ0FBQyxDQUFDLElBQUksQ0FBQyxHQUFHLENBQUMsQ0FBQTtJQUNwRixDQUFDO0NBQ0Y7QUE5RkQsc0NBOEZDIiwic291cmNlc0NvbnRlbnQiOlsiaW1wb3J0IHsgTGluaywgQ29uZmlnIH0gZnJvbSAnLi90eXBlcydcbmltcG9ydCB7IGFkZEFzc2V0c1RvQWxidW0sIGdldEFzc2V0SW5mbywgc2VhcmNoQXNzZXRzIH0gZnJvbSAnQGltbWljaC9zZGsnXG5pbXBvcnQgc3RvcmUgZnJvbSAnLi9zdG9yZSdcbmltcG9ydCBwYXRoIGZyb20gJ3BhdGgnXG5cbmV4cG9ydCBjbGFzcyBQZXJzb25Ub0FsYnVtIHtcbiAgY29uZmlnOiBDb25maWdcblxuICBjb25zdHJ1Y3RvciAoKSB7XG4gICAgdGhpcy5pbml0Q29uZmlnKClcbiAgfVxuXG4gIC8qKlxuICAgKiBSZWFkIHRoZSBjb25maWcuanNvbiBmaWxlIG9yIHBhcnNlIHRoZSBDT05GSUcgZW52IHZhbHVlIHRvIGdldCB0aGUgY29uZmlndXJhdGlvblxuICAgKi9cbiAgaW5pdENvbmZpZyAoKSB7XG4gICAgdHJ5IHtcbiAgICAgIGlmIChwcm9jZXNzLmVudi5DT05GSUcpIHtcbiAgICAgICAgLy8gQXR0ZW1wdCB0byBwYXJzZSBkb2NrZXItY29tcG9zZSBjb25maWcgc3RyaW5nIGludG8gSlNPTiAoaWYgc3BlY2lmaWVkKVxuICAgICAgICB0aGlzLmNvbmZpZyA9IEpTT04ucGFyc2UocHJvY2Vzcy5lbnYuQ09ORklHKVxuICAgICAgfSBlbHNlIHtcbiAgICAgICAgY29uc3QgY29uZmlnSnNvbiA9IHJlcXVpcmUocGF0aC5yZXNvbHZlKCcuLi9kYXRhL2NvbmZpZy5qc29uJykpXG4gICAgICAgIGlmICh0eXBlb2YgY29uZmlnSnNvbiA9PT0gJ29iamVjdCcpIHRoaXMuY29uZmlnID0gY29uZmlnSnNvblxuICAgICAgfVxuICAgIH0gY2F0Y2ggKGUpIHtcbiAgICAgIGNvbnNvbGUubG9nKGUpXG4gICAgICBjb25zb2xlLmxvZygnVW5hYmxlIHRvIHBhcnNlIGNvbmZpZyBmaWxlLicpXG4gICAgfVxuICB9XG5cbiAgYXN5bmMgcHJvY2Vzc1BlcnNvbiAobGluazogTGluaykge1xuICAgIGxldCBuZXh0UGFnZTogc3RyaW5nIHwgbnVsbCA9ICcxJ1xuICAgIGxldCBtb3N0UmVjZW50OiBzdHJpbmcgfCB1bmRlZmluZWRcblxuICAgIC8vIFJlc29sdmUgZWZmZWN0aXZlIHBlcnNvbiBJRHMgKHN1cHBvcnQgYm90aCBsZWdhY3kgcGVyc29uSWQgYW5kIG5ldyBwZXJzb25JZHMpXG4gICAgY29uc3QgcGVyc29uSWRzID0gbGluay5wZXJzb25JZHMgPz8gKGxpbmsucGVyc29uSWQgPyBbbGluay5wZXJzb25JZF0gOiBbXSlcbiAgICBjb25zdCBwZXJzb25JZFNldCA9IG5ldyBTZXQocGVyc29uSWRzKVxuICAgIGNvbnN0IG1pbkNvdW50ID0gbGluay5taW5Db3VudCA/PyAxXG5cbiAgICBpZiAobGluay5kZXNjcmlwdGlvbikgY29uc29sZS5sb2coYD09PSAke2xpbmsuZGVzY3JpcHRpb259ID09PWApXG4gICAgY29uc29sZS5sb2coYEFkZGluZyBwZXJzb24ocykgJHtwZXJzb25JZHMuam9pbignLCAnKX0gdG8gYWxidW0gJHtsaW5rLmFsYnVtSWR9YClcblxuICAgIHdoaWxlIChuZXh0UGFnZSAhPT0gbnVsbCkge1xuICAgICAgY29uc29sZS5sb2coYCAtIFByb2Nlc3NpbmcgcGFnZSAke25leHRQYWdlfWApXG4gICAgICBjb25zdCByZXMgPSBhd2FpdCBzZWFyY2hBc3NldHMoe1xuICAgICAgICBtZXRhZGF0YVNlYXJjaER0bzoge1xuICAgICAgICAgIC8vIEknbSB1c2luZyBgdXBkYXRlZGAgaGVyZSBiZWNhdXNlIHRoaXMgaXMgZG9jdW1lbnRlZCB0byBiZSB0aGUgdGltZSB3aGVuXG4gICAgICAgICAgLy8gdGhlIGFzc2V0IHdhcyB1cGRhdGVkIGluIEltbWljaCwgYW5kIG5vdGhpbmcgdG8gZG8gd2l0aCB0aGUgRVhJRiBkYXRhLlxuICAgICAgICAgIC8vIGh0dHBzOi8vaW1taWNoLmFwcC9kb2NzL2FwaS9nZXQtYXNzZXQtaW5mb1xuICAgICAgICAgIC8vIFRoaXMgbWF5IGFsc28gYmUgdGhlIGNhc2UgZm9yIGBjcmVhdGVkYCwgYnV0IGl0IGRvZXNuJ3Qgc3BlY2lmeSB0aGF0IGluIHRoZSBkb2NzLlxuICAgICAgICAgIHVwZGF0ZWRBZnRlcjogc3RvcmUuZ2V0KHRoaXMuZ2V0VXBkYXRlS2V5TmFtZShsaW5rKSksXG4gICAgICAgICAgcGFnZTogcGFyc2VJbnQobmV4dFBhZ2UsIDEwKSwgLy8gd2h5IGlzIGBuZXh0UGFnZWAgYSBzdHJpbmcgYW5kIGBwYWdlYCBhIG51bWJlcj8gwq9cXF8o44OEKV8vwq9cbiAgICAgICAgICBwZXJzb25JZHNcbiAgICAgICAgfVxuICAgICAgfSlcblxuICAgICAgLy8gVHJhY2sgdGhlIG1vc3QgcmVjZW50IHBob3RvIHRpbWVzdGFtcCBzbyB3ZSBjYW4gdXBkYXRlIHRoZSBzdG9yZVxuICAgICAgaWYgKCFtb3N0UmVjZW50ICYmIHJlcy5hc3NldHMuaXRlbXNbMF0pIG1vc3RSZWNlbnQgPSByZXMuYXNzZXRzLml0ZW1zWzBdLnVwZGF0ZWRBdFxuXG4gICAgICBsZXQgYXNzZXRJZHM6IHN0cmluZ1tdXG4gICAgICBpZiAobWluQ291bnQgPD0gMSkge1xuICAgICAgICAvLyBObyBhZGRpdGlvbmFsIGZpbHRlcmluZyBuZWVkZWQ7IGFsbCBmb3VuZCBhc3NldHMgYWxyZWFkeSBjb250YWluIGF0IGxlYXN0IG9uZSBtYXRjaGluZyBwZXJzb25cbiAgICAgICAgYXNzZXRJZHMgPSByZXMuYXNzZXRzLml0ZW1zLm1hcCh4ID0+IHguaWQpXG4gICAgICB9IGVsc2Uge1xuICAgICAgICAvLyBGaWx0ZXIgYXNzZXRzOiBvbmx5IGluY2x1ZGUgdGhvc2Ugd2l0aCBhdCBsZWFzdCBtaW5Db3VudCBtYXRjaGluZyBwZW9wbGUgZnJvbSB0aGUgbGlzdFxuICAgICAgICBhc3NldElkcyA9IFtdXG4gICAgICAgIGZvciAoY29uc3QgYXNzZXQgb2YgcmVzLmFzc2V0cy5pdGVtcykge1xuICAgICAgICAgIC8vIFVzZSBwZW9wbGUgZnJvbSB0aGUgc2VhcmNoIHJlc3VsdCBpZiBhbHJlYWR5IHBvcHVsYXRlZCwgb3RoZXJ3aXNlIGZldGNoIGFzc2V0IGRldGFpbHNcbiAgICAgICAgICBjb25zdCBwZW9wbGUgPSBhc3NldC5wZW9wbGUgPz8gKGF3YWl0IGdldEFzc2V0SW5mbyh7IGlkOiBhc3NldC5pZCB9KSkucGVvcGxlID8/IFtdXG4gICAgICAgICAgY29uc3QgbWF0Y2hDb3VudCA9IHBlb3BsZS5maWx0ZXIocCA9PiBwZXJzb25JZFNldC5oYXMocC5pZCkpLmxlbmd0aFxuICAgICAgICAgIGlmIChtYXRjaENvdW50ID49IG1pbkNvdW50KSB7XG4gICAgICAgICAgICBhc3NldElkcy5wdXNoKGFzc2V0LmlkKVxuICAgICAgICAgIH1cbiAgICAgICAgfVxuICAgICAgfVxuXG4gICAgICBpZiAoYXNzZXRJZHMubGVuZ3RoID4gMCkge1xuICAgICAgICBhd2FpdCBhZGRBc3NldHNUb0FsYnVtKHtcbiAgICAgICAgICBpZDogbGluay5hbGJ1bUlkLFxuICAgICAgICAgIGJ1bGtJZHNEdG86IHtcbiAgICAgICAgICAgIGlkczogYXNzZXRJZHNcbiAgICAgICAgICB9XG4gICAgICAgIH0pXG4gICAgICB9XG4gICAgICBuZXh0UGFnZSA9IHJlcy5hc3NldHMubmV4dFBhZ2VcbiAgICB9XG5cbiAgICAvLyBTdG9yZSB0aGUgbW9zdCByZWNlbnQgYXNzZXQgdXBkYXRlIHZhbHVlIHNvIHdlIGNhbiBzdGFydCBwcm9jZXNzaW5nIG9ubHkgbmV3ZXIgaXRlbXMgbmV4dCB0aW1lLlxuICAgIGF3YWl0IHN0b3JlLnNldCh0aGlzLmdldFVwZGF0ZUtleU5hbWUobGluayksIG1vc3RSZWNlbnQpXG4gICAgY29uc29sZS5sb2coKVxuICB9XG5cbiAgLyoqXG4gICAqIEdldCB0aGUgY29ycmVjdGx5IGZvcm1hdHRlZCBrZXkgbmFtZSBmb3IgbW9zdC1yZWNlbnQgdXBkYXRlZCB2YWx1ZSBpbiB0aGUgc3RvcmVcbiAgICovXG4gIGdldFVwZGF0ZUtleU5hbWUgKGxpbms6IExpbmspIHtcbiAgICBjb25zdCBwZXJzb25JZHMgPSBsaW5rLnBlcnNvbklkcyA/PyAobGluay5wZXJzb25JZCA/IFtsaW5rLnBlcnNvbklkXSA6IFtdKVxuICAgIHJldHVybiBbbGluay5hcGlLZXlTaG9ydCwgWy4uLnBlcnNvbklkc10uc29ydCgpLmpvaW4oJysnKSwgbGluay5hbGJ1bUlkXS5qb2luKCc6JylcbiAgfVxufVxuIl19