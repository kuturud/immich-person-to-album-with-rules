"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.JSONKeyValueStore = void 0;
const tslib_1 = require("tslib");
const fs = tslib_1.__importStar(require("fs"));
const path = tslib_1.__importStar(require("path"));
class JSONKeyValueStore {
    constructor() {
        this.filePath = path.resolve('../data/store.json');
        this.cache = new Map();
        try {
            const data = fs.readFileSync(this.filePath, 'utf8');
            const parsed = JSON.parse(data);
            this.cache = new Map(Object.entries(parsed));
        }
        catch (error) {
            if (error.code !== 'ENOENT')
                throw error;
            // File doesn't exist, start with empty store
        }
    }
    persist() {
        return tslib_1.__awaiter(this, void 0, void 0, function* () {
            const obj = Object.fromEntries(this.cache);
            yield fs.promises.writeFile(this.filePath, JSON.stringify(obj, null, 2));
        });
    }
    get(key) {
        return this.cache.get(key);
    }
    set(key, value) {
        return tslib_1.__awaiter(this, void 0, void 0, function* () {
            this.cache.set(key, value);
            yield this.persist();
        });
    }
    updateKey(param) {
        return param.personId + ':' + param.albumId;
    }
}
exports.JSONKeyValueStore = JSONKeyValueStore;
exports.default = new JSONKeyValueStore();
//# sourceMappingURL=data:application/json;base64,eyJ2ZXJzaW9uIjozLCJmaWxlIjoic3RvcmUuanMiLCJzb3VyY2VSb290IjoiIiwic291cmNlcyI6WyIuLi9zcmMvc3RvcmUudHMiXSwibmFtZXMiOltdLCJtYXBwaW5ncyI6Ijs7OztBQUFBLCtDQUF3QjtBQUN4QixtREFBNEI7QUFHNUIsTUFBYSxpQkFBaUI7SUFJNUI7UUFDRSxJQUFJLENBQUMsUUFBUSxHQUFHLElBQUksQ0FBQyxPQUFPLENBQUMsb0JBQW9CLENBQUMsQ0FBQTtRQUNsRCxJQUFJLENBQUMsS0FBSyxHQUFHLElBQUksR0FBRyxFQUFhLENBQUE7UUFDakMsSUFBSSxDQUFDO1lBQ0gsTUFBTSxJQUFJLEdBQUcsRUFBRSxDQUFDLFlBQVksQ0FBQyxJQUFJLENBQUMsUUFBUSxFQUFFLE1BQU0sQ0FBQyxDQUFBO1lBQ25ELE1BQU0sTUFBTSxHQUFzQixJQUFJLENBQUMsS0FBSyxDQUFDLElBQUksQ0FBQyxDQUFBO1lBQ2xELElBQUksQ0FBQyxLQUFLLEdBQUcsSUFBSSxHQUFHLENBQUMsTUFBTSxDQUFDLE9BQU8sQ0FBQyxNQUFNLENBQUMsQ0FBQyxDQUFBO1FBQzlDLENBQUM7UUFBQyxPQUFPLEtBQVUsRUFBRSxDQUFDO1lBQ3BCLElBQUksS0FBSyxDQUFDLElBQUksS0FBSyxRQUFRO2dCQUFFLE1BQU0sS0FBSyxDQUFBO1lBQ3hDLDZDQUE2QztRQUMvQyxDQUFDO0lBQ0gsQ0FBQztJQUVhLE9BQU87O1lBQ25CLE1BQU0sR0FBRyxHQUFHLE1BQU0sQ0FBQyxXQUFXLENBQUMsSUFBSSxDQUFDLEtBQUssQ0FBQyxDQUFBO1lBQzFDLE1BQU0sRUFBRSxDQUFDLFFBQVEsQ0FBQyxTQUFTLENBQUMsSUFBSSxDQUFDLFFBQVEsRUFBRSxJQUFJLENBQUMsU0FBUyxDQUFDLEdBQUcsRUFBRSxJQUFJLEVBQUUsQ0FBQyxDQUFDLENBQUMsQ0FBQTtRQUMxRSxDQUFDO0tBQUE7SUFFRCxHQUFHLENBQUUsR0FBVztRQUNkLE9BQU8sSUFBSSxDQUFDLEtBQUssQ0FBQyxHQUFHLENBQUMsR0FBRyxDQUFDLENBQUE7SUFDNUIsQ0FBQztJQUVLLEdBQUcsQ0FBRSxHQUFXLEVBQUUsS0FBUTs7WUFDOUIsSUFBSSxDQUFDLEtBQUssQ0FBQyxHQUFHLENBQUMsR0FBRyxFQUFFLEtBQUssQ0FBQyxDQUFBO1lBQzFCLE1BQU0sSUFBSSxDQUFDLE9BQU8sRUFBRSxDQUFBO1FBQ3RCLENBQUM7S0FBQTtJQUVELFNBQVMsQ0FBRSxLQUFXO1FBQ3BCLE9BQU8sS0FBSyxDQUFDLFFBQVEsR0FBRyxHQUFHLEdBQUcsS0FBSyxDQUFDLE9BQU8sQ0FBQTtJQUM3QyxDQUFDO0NBQ0Y7QUFsQ0QsOENBa0NDO0FBRUQsa0JBQWUsSUFBSSxpQkFBaUIsRUFBRSxDQUFBIiwic291cmNlc0NvbnRlbnQiOlsiaW1wb3J0ICogYXMgZnMgZnJvbSAnZnMnXG5pbXBvcnQgKiBhcyBwYXRoIGZyb20gJ3BhdGgnXG5pbXBvcnQgeyBMaW5rIH0gZnJvbSAnLi90eXBlcydcblxuZXhwb3J0IGNsYXNzIEpTT05LZXlWYWx1ZVN0b3JlPFQgPSBhbnk+IHtcbiAgZmlsZVBhdGg6IHN0cmluZ1xuICBjYWNoZTogTWFwPHN0cmluZywgVD5cblxuICBjb25zdHJ1Y3RvciAoKSB7XG4gICAgdGhpcy5maWxlUGF0aCA9IHBhdGgucmVzb2x2ZSgnLi4vZGF0YS9zdG9yZS5qc29uJylcbiAgICB0aGlzLmNhY2hlID0gbmV3IE1hcDxzdHJpbmcsIFQ+KClcbiAgICB0cnkge1xuICAgICAgY29uc3QgZGF0YSA9IGZzLnJlYWRGaWxlU3luYyh0aGlzLmZpbGVQYXRoLCAndXRmOCcpXG4gICAgICBjb25zdCBwYXJzZWQ6IFJlY29yZDxzdHJpbmcsIFQ+ID0gSlNPTi5wYXJzZShkYXRhKVxuICAgICAgdGhpcy5jYWNoZSA9IG5ldyBNYXAoT2JqZWN0LmVudHJpZXMocGFyc2VkKSlcbiAgICB9IGNhdGNoIChlcnJvcjogYW55KSB7XG4gICAgICBpZiAoZXJyb3IuY29kZSAhPT0gJ0VOT0VOVCcpIHRocm93IGVycm9yXG4gICAgICAvLyBGaWxlIGRvZXNuJ3QgZXhpc3QsIHN0YXJ0IHdpdGggZW1wdHkgc3RvcmVcbiAgICB9XG4gIH1cblxuICBwcml2YXRlIGFzeW5jIHBlcnNpc3QgKCk6IFByb21pc2U8dm9pZD4ge1xuICAgIGNvbnN0IG9iaiA9IE9iamVjdC5mcm9tRW50cmllcyh0aGlzLmNhY2hlKVxuICAgIGF3YWl0IGZzLnByb21pc2VzLndyaXRlRmlsZSh0aGlzLmZpbGVQYXRoLCBKU09OLnN0cmluZ2lmeShvYmosIG51bGwsIDIpKVxuICB9XG5cbiAgZ2V0IChrZXk6IHN0cmluZyk6IFQgfCB1bmRlZmluZWQge1xuICAgIHJldHVybiB0aGlzLmNhY2hlLmdldChrZXkpXG4gIH1cblxuICBhc3luYyBzZXQgKGtleTogc3RyaW5nLCB2YWx1ZTogVCk6IFByb21pc2U8dm9pZD4ge1xuICAgIHRoaXMuY2FjaGUuc2V0KGtleSwgdmFsdWUpXG4gICAgYXdhaXQgdGhpcy5wZXJzaXN0KClcbiAgfVxuXG4gIHVwZGF0ZUtleSAocGFyYW06IExpbmspIHtcbiAgICByZXR1cm4gcGFyYW0ucGVyc29uSWQgKyAnOicgKyBwYXJhbS5hbGJ1bUlkXG4gIH1cbn1cblxuZXhwb3J0IGRlZmF1bHQgbmV3IEpTT05LZXlWYWx1ZVN0b3JlKClcbiJdfQ==