var loader_util;
(function (loader_util) {
    loader_util.new2DArray = function (size1, size2) {
        var i;
        var arr = new Array(size1);
        for (i = 0; i < arr.length; i++) {
            arr[i] = new Array(size2);
        }
        return arr;
    };
    loader_util.signedByte = function (b) {
        b = b % 0x100;
        return b >= 0x80 ? b - 0x100 : b;
    };
})(loader_util || (loader_util = {}));
var loader_extractor;
(function (loader_extractor) {
    var WWADataExtractor = (function () {
        // --- methods and constructors
        function WWADataExtractor(data) {
            this._bitData = data;
            this._wwaData = new WWAData();
        }
        WWADataExtractor.prototype.extractAllData = function () {
            var mapAttrMax, objAttrMax;
            this._wwaData.version = this._bitData[WWADataExtractor.POS_VERSION];
            this._extractInitialParameters();
            if (this._wwaData.version > 29) {
                this._currentPosition = WWADataExtractor.POS_MAPDATA_TOP;
            }
            else {
                this._currentPosition = WWADataExtractor.POS_OLD_MAPDATA_TOP;
            }
            this._wwaData.map = this._getFieldDataFromBits(this._wwaData.mapPartsMax).concat();
            this._wwaData.mapObject = this._getFieldDataFromBits(this._wwaData.objPartsMax).concat();
            mapAttrMax = (this._wwaData.version > 29 ? WWAConsts.MAP_ATR_MAX : WWAConsts.OLD_MAP_ATR_MAX);
            objAttrMax = (this._wwaData.version > 29 ? WWAConsts.OBJ_ATR_MAX : WWAConsts.OLD_OBJ_ATR_MAX);
            this._wwaData.mapAttribute = this._getPartsDataFromBits(this._wwaData.mapPartsMax, mapAttrMax).concat();
            this._wwaData.objectAttribute = this._getPartsDataFromBits(this._wwaData.objPartsMax, objAttrMax).concat();
            // TODO: 下位互換拡張キャラクタ変換
            if (this._wwaData.version <= 29) {
            }
            this._replaceAllRandomObjects();
        };
        WWADataExtractor.prototype.getJSObject = function () {
            return this._wwaData;
        };
        WWADataExtractor.prototype._get1ByteNumber = function (index) {
            return this._bitData[index];
        };
        WWADataExtractor.prototype._get2BytesNumber = function (index) {
            return this._bitData[index] + this._bitData[index + 1] * 0x100;
        };
        WWADataExtractor.prototype._extractInitialParameters = function () {
            // 現行はこちら
            if (this._wwaData.version > 29) {
                this._wwaData.gameoverX = this._get2BytesNumber(WWADataExtractor.POS_GAMEOVER_X);
                this._wwaData.gameoverY = this._get2BytesNumber(WWADataExtractor.POS_GAMEOVER_Y);
                this._wwaData.playerX = this._get2BytesNumber(WWADataExtractor.POS_PLAYER_X);
                this._wwaData.playerY = this._get2BytesNumber(WWADataExtractor.POS_PLAYER_Y);
                this._wwaData.mapPartsMax = this._get2BytesNumber(WWADataExtractor.POS_MAP_COUNT);
                this._wwaData.objPartsMax = this._get2BytesNumber(WWADataExtractor.POS_OBJ_COUNT);
                this._wwaData.isOldMap = false;
            }
            else {
                this._wwaData.gameoverX = this._get1ByteNumber(WWADataExtractor.POS_OLD_GAMEOVER_X);
                this._wwaData.gameoverY = this._get1ByteNumber(WWADataExtractor.POS_OLD_GAMEOVER_Y);
                this._wwaData.playerX = this._get1ByteNumber(WWADataExtractor.POS_OLD_PLAYER_X);
                this._wwaData.playerY = this._get1ByteNumber(WWADataExtractor.POS_OLD_PLAYER_Y);
                this._wwaData.mapPartsMax = this._get1ByteNumber(WWADataExtractor.POS_OLD_MAP_COUNT);
                this._wwaData.objPartsMax = this._get1ByteNumber(WWADataExtractor.POS_OLD_OBJ_COUNT);
                this._wwaData.isOldMap = true;
            }
            this._wwaData.statusEnergyMax = this._get2BytesNumber(WWADataExtractor.POS_STATUS_ENERGY_MAX);
            this._wwaData.statusEnergy = this._get2BytesNumber(WWADataExtractor.POS_STATUS_ENERGY);
            this._wwaData.statusStrength = this._get2BytesNumber(WWADataExtractor.POS_STATUS_STRENGTH);
            this._wwaData.statusDefence = this._get2BytesNumber(WWADataExtractor.POS_STATUS_DEFENCE);
            this._wwaData.statusGold = this._get2BytesNumber(WWADataExtractor.POS_STATUS_GOLD);
            this._extractInitialItemData();
            this._wwaData.mapWidth = this._get2BytesNumber(WWADataExtractor.POS_MAP_SIZE);
            this._wwaData.messageNum = this._get2BytesNumber(WWADataExtractor.POS_MESSAGE_NUM);
            // 旧バージョン互換
            if (this._wwaData.version < 28)
                this._wwaData.mapWidth = 71;
            else if (this._wwaData.version <= 29)
                this._wwaData.mapWidth = 101;
        };
        WWADataExtractor.prototype._extractInitialItemData = function () {
            var i;
            var topIdx = (this._wwaData.version > 29 ? WWADataExtractor.POS_ITEMBOX_TOP : WWADataExtractor.POS_OLD_ITEMBOX_TOP);
            this._wwaData.itemBox = new Array(WWAConsts.ITEMBOX_SIZE);
            for (i = 0; i < WWAConsts.ITEMBOX_SIZE; i++) {
                this._wwaData.itemBox[i] = this._get1ByteNumber(topIdx + i);
            }
        };
        WWADataExtractor.prototype._getFieldDataFromBits = function (partsMax) {
            var x, y;
            var fieldArray;
            fieldArray = util.new2DArray(this._wwaData.mapWidth, this._wwaData.mapWidth);
            for (x = 0; x < this._wwaData.mapWidth; x++) {
                for (y = 0; y < this._wwaData.mapWidth; y++) {
                    if (this._wwaData.version > 29) {
                        fieldArray[x][y] = this._get2BytesNumber(this._currentPosition);
                        this._currentPosition += 2;
                    }
                    else {
                        fieldArray[x][y] = this._get1ByteNumber(this._currentPosition);
                        this._currentPosition += 1;
                    }
                }
                // 範囲外のパーツ削除
                if (fieldArray[x][y] >= partsMax) {
                    fieldArray[x][y] = 0;
                }
            }
            return fieldArray;
        };
        WWADataExtractor.prototype._getPartsDataFromBits = function (partsMax, attrMax) {
            var i, j;
            var partsData;
            partsData = util.new2DArray(partsMax, attrMax);
            for (i = 0; i < partsMax; i++) {
                for (j = 0; j < attrMax; j++) {
                    if (j === WWAConsts.ATR_CROP1 || j === WWAConsts.ATR_CROP2) {
                        partsData[i][j] = 0;
                        this._currentPosition += 2;
                        continue;
                    }
                    partsData[i][j] = this._get2BytesNumber(this._currentPosition);
                    this._currentPosition += 2;
                }
            }
            return partsData;
        };
        WWADataExtractor.prototype._extractObjectPartsData = function () {
        };
        WWADataExtractor.prototype._convertPartsDataToOldVersion = function () {
        };
        WWADataExtractor.prototype._replaceRandomObjects = function () {
        };
        WWADataExtractor.prototype._extractMessagesData = function () {
        };
        WWADataExtractor.prototype._replaceAllRandomObjects = function () {
            var x, y;
            var partsID, partsType;
            for (x = 0; x < this._wwaData.mapWidth; x++) {
                for (y = 0; y < this._wwaData.mapWidth; y++) {
                    partsID = this._wwaData.mapObject[x][y];
                    partsType = this._wwaData.objectAttribute[partsID][WWAConsts.ATR_TYPE];
                    if (partsType === WWAConsts.OBJECT_RANDOM) {
                        this._replaceRandomObject(partsID, x, y);
                    }
                }
            }
        };
        WWADataExtractor.prototype._replaceRandomObject = function (partsID, x, y) {
            var randomNum = Math.floor(Math.random() * 10);
            var afterPartsID = this._wwaData.objectAttribute[partsID][10 + randomNum];
            if (afterPartsID >= this._wwaData.objPartsMax) {
                afterPartsID = 0;
            }
            this._wwaData.mapObject[x][y] = afterPartsID;
        };
        // --- vars ---
        WWADataExtractor.POS_CHECK = 0x00; //  0
        WWADataExtractor.POS_VERSION = 0x02; //  2
        WWADataExtractor.POS_OLD_MAP_COUNT = 0x03; //  3
        WWADataExtractor.POS_OLD_OBJ_COUNT = 0x04; //  4
        WWADataExtractor.POS_OLD_PLAYER_X = 0x05; //  5
        WWADataExtractor.POS_OLD_PLAYER_Y = 0x06; //  6
        WWADataExtractor.POS_STATUS_ENERGY = 0x0a; // 10
        WWADataExtractor.POS_STATUS_STRENGTH = 0x0c; // 12
        WWADataExtractor.POS_STATUS_DEFENCE = 0x0e; // 14
        WWADataExtractor.POS_STATUS_GOLD = 0x10; // 16
        WWADataExtractor.POS_OLD_GAMEOVER_X = 0x12; // 18
        WWADataExtractor.POS_OLD_GAMEOVER_Y = 0x13; // 19
        WWADataExtractor.POS_OLD_ITEMBOX_TOP = 0x14; // 20
        WWADataExtractor.POS_STATUS_ENERGY_MAX = 0x20; // 32
        WWADataExtractor.POS_MAP_COUNT = 0x22; // 34
        WWADataExtractor.POS_OBJ_COUNT = 0x24; // 36
        WWADataExtractor.POS_PLAYER_X = 0x26; // 38
        WWADataExtractor.POS_PLAYER_Y = 0x28; // 40
        WWADataExtractor.POS_GAMEOVER_X = 0x2a; // 42
        WWADataExtractor.POS_GAMEOVER_Y = 0x2c; // 44
        WWADataExtractor.POS_MAP_SIZE = 0x2e; // 46
        WWADataExtractor.POS_MESSAGE_NUM = 0x30; // 48
        WWADataExtractor.POS_ITEMBOX_TOP = 0x3c; // 60
        WWADataExtractor.POS_MAPDATA_TOP = 0x5a; // 90
        WWADataExtractor.POS_OLD_MAPDATA_TOP = 0x64; //100
        return WWADataExtractor;
    })();
    loader_extractor.WWADataExtractor = WWADataExtractor;
})(loader_extractor || (loader_extractor = {}));
var loader_core;
(function (loader_core) {
    var DecodeResult = (function () {
        function DecodeResult(mapData, extractEndPos) {
            this.mapData = mapData;
            this.extractEndPos = extractEndPos;
        }
        return DecodeResult;
    })();
    // FIXME: 例外が正常にthrowされない
    var WWALoader = (function () {
        function WWALoader(fileName) {
            this._fileName = fileName;
        }
        WWALoader.prototype.requestMapData = function () {
            var _this = this;
            var xhr = new XMLHttpRequest();
            xhr.open("GET", this._fileName, true);
            xhr.responseType = "arraybuffer";
            xhr.onreadystatechange = (function () {
                if (xhr.readyState === XMLHttpRequest.DONE) {
                    if (xhr.status === 200) {
                        try {
                            _this.loadMapData(xhr.response);
                        }
                        catch (e) {
                            alert(e.text);
                        }
                        _this.sendDataToMainProgram();
                    }
                    else if (xhr.status === 304) {
                    }
                    else {
                        throw new Error("Mapdata XHR Failed!! HTTP Status Code is " + xhr.status + ", Mapdata file name is " + _this._fileName);
                    }
                }
            });
            xhr.send(null);
        };
        WWALoader.prototype.loadMapData = function (data) {
            try {
                this._srcData = new Uint8Array(data);
                var extResult = this.decodeMapData();
                this._dataExtractor = new WWADataExtractor(extResult.mapData);
                this._dataExtractor.extractAllData();
                this._dataJSObj = this._dataExtractor.getJSObject();
                this._currentPos = extResult.extractEndPos;
            }
            catch (e) {
                throw (e);
            }
            this._loadAllTextData();
        };
        WWALoader.prototype._loadAllTextData = function () {
            var i;
            if (this._srcData[WWADataExtractor.POS_VERSION] >= 30) {
                this._dataJSObj.worldPassword = this._getMessageFromData();
            }
            if (this._srcData[WWADataExtractor.POS_VERSION] <= 29) {
                this._dataJSObj.messageNum = WWALoader.OLDVER_MESSAGE_MAX;
            }
            this._dataJSObj.message = new Array(this._dataJSObj.messageNum);
            for (i = 0; i < this._dataJSObj.message.length; i++) {
                this._dataJSObj.message[i] = this._getMessageFromData();
            }
            this._dataJSObj.worldName = this._getMessageFromData();
            if (this._srcData[WWADataExtractor.POS_VERSION] <= 29) {
                this._dataJSObj.worldPassword = this._getMessageFromData();
            }
            else {
                this._getMessageFromData();
            }
            if (this._srcData[WWADataExtractor.POS_VERSION] >= 29) {
                this._dataJSObj.worldPassNumber = ((parseInt(this._dataJSObj.worldPassword) / 10 - 1197) / 17 - 2357);
            }
            else {
                this._dataJSObj.worldPassNumber = parseInt(this._dataJSObj.worldPassword);
            }
            this._dataJSObj.charCGName = this._getMessageFromData();
            this._dataJSObj.mapCGName = this._getMessageFromData();
            this._dataJSObj.systemMessage = new Array(WWAConsts.SYSTEM_MESSAGE_NUM);
            for (i = 0; i < WWAConsts.SYSTEM_MESSAGE_NUM; i++) {
                if (this._srcData[WWADataExtractor.POS_VERSION] >= 30) {
                    this._dataJSObj.systemMessage[i] = this._getMessageFromData();
                }
                else {
                    this._dataJSObj.systemMessage[i] = "";
                }
            }
        };
        WWALoader.prototype.sendDataToMainProgram = function () {
            postMessage(this._dataJSObj);
        };
        WWALoader.prototype.decodeMapData = function () {
            var destData = new Uint8Array(this._srcData.length);
            var srcCounter, destCounter;
            var maxim;
            var i;
            for (srcCounter = 0, destCounter = 0; srcCounter < this._srcData.length; srcCounter++) {
                if (this._srcData[srcCounter] === 0 && this._srcData[srcCounter + 1] === 0 && this._srcData[srcCounter + 2] === 0) {
                    break;
                }
                destData[destCounter++] = this._srcData[srcCounter];
                // 数字が連続していれば解凍処理
                if (this._srcData[srcCounter] === this._srcData[srcCounter + 1]) {
                    maxim = this._srcData[srcCounter + 2];
                    for (i = 0; i < maxim; i++) {
                        destData[destCounter++] = this._srcData[srcCounter];
                    }
                    srcCounter += 2;
                }
                // マップサイズとパーツ数のデータから必要領域取得
                // 最大サイズを超えそうなときは領域拡張して続行
                if (destCounter + 255 >= destData.length) {
                    var newDestData = new Uint8Array(destData.length + WWALoader.MEM_BLOCK);
                    newDestData.set(destData);
                    destData = newDestData;
                }
            }
            console.log("EXTRACT DATA = " + destCounter + " " + srcCounter);
            try {
                this.checkCompletelyDecoded(destData, destCounter);
            }
            catch (e) {
                throw e;
            }
            return new DecodeResult(destData, srcCounter + WWALoader.EXT_LAST_PADDING);
        };
        WWALoader.prototype._getMessageFromData = function () {
            var str = "";
            for (var i = 0; i < 1000; i++) {
                if (this._srcData[this._currentPos + i * 2] == 0 && this._srcData[this._currentPos + i * 2 + 1] == 0) {
                    break;
                }
                str += String.fromCharCode((this._srcData[this._currentPos + i * 2 + 1] << 8) + (this._srcData[this._currentPos + i * 2]));
            }
            this._currentPos += i * 2 + 2;
            return str;
        };
        WWALoader.prototype.checkCompletelyDecoded = function (mapData, dataLength) {
            var i;
            var checkSum = mapData[WWADataExtractor.POS_CHECK] + mapData[WWADataExtractor.POS_CHECK + 1] * 0x100;
            var sum = 0;
            if (mapData[WWADataExtractor.POS_VERSION] >= 29) {
                for (i = 2; i < dataLength; i++) {
                    sum += (util.signedByte(mapData[i]) * (i % 8 + 1));
                }
                sum = (sum % 0x10000) & 0xffff;
                if (checkSum !== sum) {
                    throw new Error("Mapdata was BROKEN! Checksum is " + checkSum + ". but " + "all bytes sum is " + sum + " in fact.");
                }
            }
        };
        WWALoader.MEM_BLOCK = 65000;
        WWALoader.EXT_LAST_PADDING = 3;
        WWALoader.OLDVER_MESSAGE_MAX = 400;
        return WWALoader;
    })();
    loader_core.WWALoader = WWALoader;
})(loader_core || (loader_core = {}));
var wwa_data;
(function (wwa_data) {
    var WWAConsts = (function () {
        function WWAConsts() {
        }
        WWAConsts.ITEMBOX_SIZE = 12;
        WWAConsts.MAP_ATR_MAX = 60;
        WWAConsts.OBJ_ATR_MAX = 60;
        WWAConsts.OLD_MAP_ATR_MAX = 40;
        WWAConsts.OLD_OBJ_ATR_MAX = 40;
        WWAConsts.ATR_CROP1 = 1;
        WWAConsts.ATR_CROP2 = 2;
        WWAConsts.ATR_TYPE = 3;
        WWAConsts.OBJECT_RANDOM = 16;
        WWAConsts.SYSTEM_MESSAGE_NUM = 20;
        return WWAConsts;
    })();
    wwa_data.WWAConsts = WWAConsts;
    var WWAData = (function () {
        function WWAData() {
            this.version = void 0;
            this.gameoverX = void 0;
            this.gameoverY = void 0;
            this.playerX = void 0;
            this.playerY = void 0;
            this.mapPartsMax = void 0;
            this.objPartsMax = void 0;
            this.isOldMap = void 0;
            this.statusEnergyMax = void 0;
            this.statusEnergy = void 0;
            this.statusStrength = void 0;
            this.statusDefence = void 0;
            this.statusGold = void 0;
            this.itemBox = void 0;
            this.mapWidth = void 0;
            this.messageNum = void 0;
            this.map = void 0;
            this.mapObject = void 0;
            this.mapAttribute = void 0;
            this.objectAttribute = void 0;
            this.worldPassword = void 0;
            this.message = void 0;
            this.worldName = void 0;
            this.worldPassNumber = void 0;
            this.charCGName = void 0;
            this.mapCGName = void 0;
            this.systemMessage = void 0;
            this.moves = 0;
        }
        return WWAData;
    })();
    wwa_data.WWAData = WWAData;
})(wwa_data || (wwa_data = {}));
/// <reference path="./loader_util.ts" />
/// <reference path="./loader_extractor.ts" />
/// <reference path="./loader_core.ts" />
/// <reference path="./wwa_data.ts" />
var util = loader_util;
var WWAConsts = wwa_data.WWAConsts;
var WWAData = wwa_data.WWAData;
var WWADataExtractor = loader_extractor.WWADataExtractor;
var WWALoader = loader_core.WWALoader;
onmessage = function (e) {
    var loader = new WWALoader(e.data.fileName);
    try {
        loader.requestMapData();
    }
    catch (e) {
        // エラー内容をpostMessageする!!!
        postMessage(e);
    }
};
//# sourceMappingURL=wwaload.js.map