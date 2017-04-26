var loader_conf;(function(c){c.conf={is_worker:!1}})(loader_conf||(loader_conf={}));var loader_util;(function(c){c.new2DArray=function(c,b){var a,e=Array(c);for(a=0;a<e.length;a++)e[a]=Array(b);return e};c.signedByte=function(c){c%=256;return 128<=c?c-256:c}})(loader_util||(loader_util={}));var loader_wwa_data;
(function(c){var f=function(){function b(){}b.ITEMBOX_SIZE=12;b.MAP_ATR_MAX=60;b.OBJ_ATR_MAX=60;b.OLD_MAP_ATR_MAX=40;b.OLD_OBJ_ATR_MAX=40;b.ATR_CROP1=1;b.ATR_CROP2=2;b.ATR_TYPE=3;b.ATR_JUMP_X=16;b.ATR_JUMP_Y=17;b.MAP_LOCALGATE=2;b.OBJECT_RANDOM=16;b.OBJECT_LOCALGATE=18;b.SYSTEM_MESSAGE_NUM=20;b.IMGPOS_DEFAULT_YESNO_X=3;b.IMGPOS_DEFAULT_YESNO_Y=1;b.IMGRELPOS_YESNO_YES_X=0;b.IMGRELPOS_YESNO_NO_X=1;b.IMGRELPOS_YESNO_YESP_X=2;b.IMGRELPOS_YESNO_NOP_X=3;b.IMGPOS_DEFAULT_PLAYER_X=2;b.IMGPOS_DEFAULT_PLAYER_Y=
0;b.IMGPOS_DEFAULT_CLICKABLE_ITEM_SIGN_X=0;b.IMGPOS_DEFAULT_CLICKABLE_ITEM_SIGN_Y=0;b.DEFAULT_DISABLE_SAVE=!1;b.DEFAULT_OLDMAP=!1;b.DEFAULT_OBJECT_NO_COLLAPSE=!1;b.DEFAULT_FRAME_COLOR_R=255;b.DEFAULT_FRAME_COLOR_G=255;b.DEFAULT_FRAME_COLOR_B=255;b.DEFAULT_FRAMEOUT_COLOR_R=96;b.DEFAULT_FRAMEOUT_COLOR_G=96;b.DEFAULT_FRAMEOUT_COLOR_B=96;b.DEFAULT_STR_COLOR_R=0;b.DEFAULT_STR_COLOR_G=0;b.DEFAULT_STR_COLOR_B=0;b.DEFAULT_STATUS_COLOR_R=0;b.DEFAULT_STATUS_COLOR_G=0;b.DEFAULT_STATUS_COLOR_B=0;return b}();
c.WWAConsts=f;f=function(){return function(){}}();c.LoaderResponse=f;f=function(){return function(){}}();c.LoaderError=f;f=function(){return function(){}}();c.LoaderProgress=f;(function(b){b[b.MAP=1]="MAP";b[b.OBJECT=0]="OBJECT"})(c.PartsType||(c.PartsType={}));(function(b){b[b.INIT=0]="INIT";b[b.MAP_LOAD=1]="MAP_LOAD";b[b.OBJ_LOAD=2]="OBJ_LOAD";b[b.MAP_ATTR=3]="MAP_ATTR";b[b.OBJ_ATTR=4]="OBJ_ATTR";b[b.RAND_PARTS=5]="RAND_PARTS";b[b.MESSAGE=6]="MESSAGE"})(c.LoadStage||(c.LoadStage={}));f=function(){function b(a,
e){void 0===a&&(a=0);void 0===e&&(e=0);this.x=a;this.y=e}b.prototype.equals=function(a){return this.x===a.x&&this.y===a.y};b.prototype.substract=function(a){return new b(this.x-a.x,this.y-a.y)};b.prototype.clone=function(){return new b(this.x,this.y)};return b}();c.Coord=f;f=function(){return function(){this.systemMessage=this.mapCGName=this.charCGName=this.worldPassNumber=this.worldName=this.message=this.worldPassword=this.objectAttribute=this.mapAttribute=this.mapObject=this.map=this.messageNum=
this.mapWidth=this.itemBox=this.statusGold=this.statusDefence=this.statusStrength=this.statusEnergy=this.statusEnergyMax=this.isOldMap=this.objPartsMax=this.mapPartsMax=this.playerY=this.playerX=this.gameoverY=this.gameoverX=this.version=void 0;this.moves=0;this.statusColorB=this.statusColorG=this.statusColorR=this.fontColorB=this.fontColorG=this.fontColorR=this.frameOutColorB=this.frameOutColorG=this.frameOutColorR=this.frameColorB=this.frameColorG=this.frameColorR=this.imgClickY=this.imgClickX=
this.bgm=this.delPlayerFlag=this.objectNoCollapseDefaultFlag=this.compatibleForOldMapFlag=this.disableSaveFlag=this.clickableItemSignImgPosY=this.clickableItemSignImgPosX=this.playerImgPosY=this.playerImgPosX=this.yesnoImgPosY=this.yesnoImgPosX=void 0}}();c.WWAData=f})(loader_wwa_data||(loader_wwa_data={}));var loader_core;
(function(c){var f=function(){return function(a,e){this.mapData=a;this.extractEndPos=e}}(),b=function(){function a(a){this._fileName=a}a.prototype.requestMapData=function(){var a=this,d=new XMLHttpRequest;try{d.open("GET",this._fileName,!0),d.responseType="arraybuffer",d.onreadystatechange=function(){try{if(d.readyState===XMLHttpRequest.DONE)if(200===d.status||304===d.status)a.loadMapData(d.response),a.sendDataToMainProgram();else{if(404===d.status)throw Error("\u30de\u30c3\u30d7\u30c7\u30fc\u30bf\u300c"+
a._fileName+"\u300d\u304c\u898b\u3064\u304b\u308a\u307e\u305b\u3093\u3067\u3057\u305f\u3002\nHTTP\u30b9\u30c6\u30fc\u30bf\u30b9\u30b3\u30fc\u30c9\u306f "+d.status+"\u3067\u3059\u3002");if(403===d.status)throw Error("\u30de\u30c3\u30d7\u30c7\u30fc\u30bf\u300c"+a._fileName+"\u300d\u3092\u8aad\u307f\u53d6\u308b\u6a29\u9650\u304c\u306a\u3044\u3088\u3046\u3067\u3059\u3002\n\u7ba1\u7406\u8005\u306e\u65b9\u3078: \u30de\u30c3\u30d7\u30c7\u30fc\u30bf\u306e\u30d1\u30fc\u30df\u30c3\u30b7\u30e7\u30f3\u3092\u78ba\u8a8d\u3057\u3066\u304f\u3060\u3055\u3044\u3002\nHTTP\u30b9\u30c6\u30fc\u30bf\u30b9\u30b3\u30fc\u30c9\u306f "+
d.status+"\u3067\u3059\u3002");throw Error("\u30de\u30c3\u30d7\u30c7\u30fc\u30bf\u300c"+a._fileName+"\u300d\u306e\u8aad\u307f\u8fbc\u307f\u306b\u5931\u6557\u3057\u307e\u3057\u305f\u3002\nHTTP\u30b9\u30c6\u30fc\u30bf\u30b9\u30b3\u30fc\u30c9\u306f "+d.status+"\u3067\u3059\u3002");}}catch(g){a.sendErrorToMainProgram(g)}},d.send(null)}catch(g){this.sendErrorToMainProgram(Error("\u30ed\u30fc\u30c9\u30a8\u30e9\u30fc: \u30ed\u30fc\u30ab\u30eb\u30c6\u30b9\u30c8\u306e\u5834\u5408\u306f\u3001\u30d6\u30e9\u30a6\u30b6\u304c\u5bfe\u5fdc\u3057\u3066\u3044\u306a\u3044\u53ef\u80fd\u6027\u304c\u3042\u308a\u307e\u3059\u3002\n"+
g.message))}};a.prototype.loadMapData=function(a){try{this._srcData=new Uint8Array(a);var d=this.decodeMapData();this._dataExtractor=new WWADataExtractor(d.mapData);this._dataExtractor.extractAllData();this._dataJSObj=this._dataExtractor.getJSObject();this._currentPos=d.extractEndPos}catch(g){throw g;}this._loadAllTextData()};a.prototype._loadAllTextData=function(){var e;30<=this._dataJSObj.version&&(this._dataJSObj.worldPassword=this._getMessageFromData());29>=this._dataJSObj.version&&(this._dataJSObj.messageNum=
a.OLDVER_MESSAGE_MAX);this._dataJSObj.message=Array(this._dataJSObj.messageNum);for(e=0;e<this._dataJSObj.message.length;e++)this._dataJSObj.message[e]=this._getMessageFromData(),0===e%200&&c.sendProgressToMainProgram(e,this._dataJSObj.message.length,loader_wwa_data.LoadStage.MESSAGE);for(;10>this._dataJSObj.messageNum;)this._dataJSObj.message.push(""),this._dataJSObj.messageNum++;c.sendProgressToMainProgram(this._dataJSObj.message.length,this._dataJSObj.message.length,loader_wwa_data.LoadStage.MESSAGE);
this._dataJSObj.worldName=this._getMessageFromData();29>=this._dataJSObj.version?this._dataJSObj.worldPassword=this._getMessageFromData():this._getMessageFromData();this._dataJSObj.worldPassNumber=""===this._dataJSObj.worldPassword?0:29<=this._dataJSObj.version?(parseInt(this._dataJSObj.worldPassword)/10-1197)/17-2357:parseInt(this._dataJSObj.worldPassword);this._dataJSObj.charCGName=this._getMessageFromData();this._dataJSObj.mapCGName=this._getMessageFromData();this._dataJSObj.systemMessage=Array(WWAConsts.SYSTEM_MESSAGE_NUM);
for(e=0;e<WWAConsts.SYSTEM_MESSAGE_NUM;e++)this._dataJSObj.systemMessage[e]=30<=this._dataJSObj.version?this._getMessageFromData():"";this._dataJSObj.yesnoImgPosX=loader_wwa_data.WWAConsts.IMGPOS_DEFAULT_YESNO_X;this._dataJSObj.yesnoImgPosY=loader_wwa_data.WWAConsts.IMGPOS_DEFAULT_YESNO_Y;this._dataJSObj.playerImgPosX=loader_wwa_data.WWAConsts.IMGPOS_DEFAULT_PLAYER_X;this._dataJSObj.playerImgPosY=loader_wwa_data.WWAConsts.IMGPOS_DEFAULT_PLAYER_Y;this._dataJSObj.clickableItemSignImgPosX=loader_wwa_data.WWAConsts.IMGPOS_DEFAULT_CLICKABLE_ITEM_SIGN_X;
this._dataJSObj.clickableItemSignImgPosY=loader_wwa_data.WWAConsts.IMGPOS_DEFAULT_CLICKABLE_ITEM_SIGN_Y;this._dataJSObj.disableSaveFlag=loader_wwa_data.WWAConsts.DEFAULT_DISABLE_SAVE;this._dataJSObj.isOldMap=loader_wwa_data.WWAConsts.DEFAULT_OLDMAP;this._dataJSObj.objectNoCollapseDefaultFlag=loader_wwa_data.WWAConsts.DEFAULT_OBJECT_NO_COLLAPSE;this._dataJSObj.delPlayerFlag=!1;this._dataJSObj.bgm=0;this._dataJSObj.effectCoords=[];this._dataJSObj.effectWaits=0;this._dataJSObj.imgClickX=0;this._dataJSObj.imgClickY=
0;this._dataJSObj.frameColorR=WWAConsts.DEFAULT_FRAME_COLOR_R;this._dataJSObj.frameColorG=WWAConsts.DEFAULT_FRAME_COLOR_G;this._dataJSObj.frameColorB=WWAConsts.DEFAULT_FRAME_COLOR_B;this._dataJSObj.frameOutColorR=WWAConsts.DEFAULT_FRAMEOUT_COLOR_R;this._dataJSObj.frameOutColorG=WWAConsts.DEFAULT_FRAMEOUT_COLOR_G;this._dataJSObj.frameOutColorB=WWAConsts.DEFAULT_FRAMEOUT_COLOR_B;this._dataJSObj.fontColorR=WWAConsts.DEFAULT_STR_COLOR_R;this._dataJSObj.fontColorG=WWAConsts.DEFAULT_STR_COLOR_G;this._dataJSObj.fontColorB=
WWAConsts.DEFAULT_STR_COLOR_B;this._dataJSObj.statusColorR=WWAConsts.DEFAULT_STATUS_COLOR_R;this._dataJSObj.statusColorG=WWAConsts.DEFAULT_STATUS_COLOR_G;this._dataJSObj.statusColorB=WWAConsts.DEFAULT_STATUS_COLOR_B};a.prototype.sendDataToMainProgram=function(){var a=new loader_wwa_data.LoaderResponse;a.progress=null;a.error=null;a.wwaData=this._dataJSObj;sendToMain(a)};a.prototype.sendErrorToMainProgram=function(a){var d=new loader_wwa_data.LoaderResponse;d.wwaData=null;d.progress=null;d.error=new loader_wwa_data.LoaderError;
d.error.name=a.name;d.error.message=a.message;sendToMain(d)};a.prototype.decodeMapData=function(){var b=new Uint8Array(this._srcData.length),d,g,k,c;for(g=d=0;d<this._srcData.length&&(0!==this._srcData[d]||0!==this._srcData[d+1]||0!==this._srcData[d+2]);d++){b[g++]=this._srcData[d];if(this._srcData[d]===this._srcData[d+1]){k=this._srcData[d+2];for(c=0;c<k;c++)b[g++]=this._srcData[d];d+=2}g+255>=b.length&&(k=new Uint8Array(b.length+a.MEM_BLOCK),k.set(b),b=k)}try{console.log("EXTRACT DATA = "+g+" "+
d)}catch(n){}try{this.checkCompletelyDecoded(b,g)}catch(n){throw n;}return new f(b,d+a.EXT_LAST_PADDING)};a.prototype._getMessageFromData=function(){for(var a="",d=0;1500>d&&(0!=this._srcData[this._currentPos+2*d]||0!=this._srcData[this._currentPos+2*d+1]);d++)a+=String.fromCharCode((this._srcData[this._currentPos+2*d+1]<<8)+this._srcData[this._currentPos+2*d]);this._currentPos+=2*d+2;return a};a.prototype.checkCompletelyDecoded=function(a,d){var b,e=a[WWADataExtractor.POS_CHECK]+256*a[WWADataExtractor.POS_CHECK+
1],c=0;if(29<=a[WWADataExtractor.POS_VERSION]){for(b=2;b<d;b++)c+=util.signedByte(a[b])*(b%8+1);c=c%65536&65535;if(e!==c)throw Error("\u30de\u30c3\u30d7\u30c7\u30fc\u30bf\u304c\u58ca\u308c\u3066\u3044\u308b\u3088\u3046\u3067\u3059\u3002\n \u30c1\u30a7\u30c3\u30af\u30b5\u30e0\u306e\u5024\u306f"+e+"\u3067\u3059\u304c\u3001\u5b9f\u969b\u306e\u548c\u306f"+c+"\u3067\u3057\u305f\u3002");}};a.MEM_BLOCK=65E3;a.EXT_LAST_PADDING=3;a.OLDVER_MESSAGE_MAX=400;return a}();c.WWALoader=b;c.sendProgressToMainProgram=
function(a,b,d){var e=new loader_wwa_data.LoaderResponse;e.error=null;e.wwaData=null;e.progress=new loader_wwa_data.LoaderProgress;e.progress.current=a;e.progress.total=b;e.progress.stage=d;sendToMain(e)}})(loader_core||(loader_core={}));var loader_extractor;
(function(c){var f=loader_wwa_data.PartsType,b=function(){function a(a){this._bitData=a;this._wwaData=new WWAData}a.prototype.extractAllData=function(){var b,d;this._wwaData.version=this._bitData[a.POS_VERSION];this._extractInitialParameters();this._currentPosition=29<this._wwaData.version?a.POS_MAPDATA_TOP:a.POS_OLD_MAPDATA_TOP;this._wwaData.map=this._getFieldDataFromBits(loader_wwa_data.PartsType.MAP,this._wwaData.mapPartsMax).concat();this._wwaData.mapObject=this._getFieldDataFromBits(loader_wwa_data.PartsType.OBJECT,
this._wwaData.objPartsMax).concat();b=29<this._wwaData.version?WWAConsts.MAP_ATR_MAX:WWAConsts.OLD_MAP_ATR_MAX;d=29<this._wwaData.version?WWAConsts.OBJ_ATR_MAX:WWAConsts.OLD_OBJ_ATR_MAX;this._wwaData.mapAttribute=this._getPartsDataFromBits(loader_wwa_data.PartsType.MAP,this._wwaData.mapPartsMax,b).concat();this._wwaData.objectAttribute=this._getPartsDataFromBits(loader_wwa_data.PartsType.OBJECT,this._wwaData.objPartsMax,d).concat();29>=this._wwaData.version&&(this._convertAttributeV2toV3(f.MAP),this._convertAttributeV2toV3(f.OBJECT));
this._replaceAllRandomObjects()};a.prototype._convertAttributeV2toV3=function(a){var b,e;if(a==f.MAP)a=this._wwaData.mapPartsMax,b=this._wwaData.mapAttribute,e=WWAConsts.MAP_LOCALGATE;else if(a==f.OBJECT)a=this._wwaData.objPartsMax,b=this._wwaData.objectAttribute,e=WWAConsts.OBJECT_LOCALGATE;else throw Error("\u8b0e\u306e\u30d1\u30fc\u30c4\u7a2e\u5225\u304c\u6307\u5b9a\u3055\u308c\u307e\u3057\u305f");for(var c=0;c<a;c++){for(var h=9;0<=h;h--){var n=b[c][20+2*h]&255,p=b[c][20+2*h]>>8,l=b[c][2*h+21]&
255,m=b[c][2*h+21]>>8;250===l?l=9E3:100<l&&(l+=9840);250===m?m=9E3:100<m&&(m+=9840);b[c][20+4*h]=n;b[c][4*h+23]=p;b[c][4*h+21]=l;b[c][4*h+22]=m}b[c][WWAConsts.ATR_TYPE]===e&&(100<b[c][WWAConsts.ATR_JUMP_X]&&(b[c][WWAConsts.ATR_JUMP_X]+=9840),100<b[c][WWAConsts.ATR_JUMP_Y]&&(b[c][WWAConsts.ATR_JUMP_Y]+=9840))}};a.prototype.getJSObject=function(){return this._wwaData};a.prototype._get1ByteNumber=function(a){return this._bitData[a]};a.prototype._get2BytesNumber=function(a){return this._bitData[a]+256*
this._bitData[a+1]};a.prototype._extractInitialParameters=function(){29<this._wwaData.version?(this._wwaData.gameoverX=this._get2BytesNumber(a.POS_GAMEOVER_X),this._wwaData.gameoverY=this._get2BytesNumber(a.POS_GAMEOVER_Y),this._wwaData.playerX=this._get2BytesNumber(a.POS_PLAYER_X),this._wwaData.playerY=this._get2BytesNumber(a.POS_PLAYER_Y),this._wwaData.mapPartsMax=this._get2BytesNumber(a.POS_MAP_COUNT),this._wwaData.objPartsMax=this._get2BytesNumber(a.POS_OBJ_COUNT),this._wwaData.isOldMap=!1):(this._wwaData.gameoverX=
this._get1ByteNumber(a.POS_OLD_GAMEOVER_X),this._wwaData.gameoverY=this._get1ByteNumber(a.POS_OLD_GAMEOVER_Y),this._wwaData.playerX=this._get1ByteNumber(a.POS_OLD_PLAYER_X),this._wwaData.playerY=this._get1ByteNumber(a.POS_OLD_PLAYER_Y),this._wwaData.mapPartsMax=this._get1ByteNumber(a.POS_OLD_MAP_COUNT),this._wwaData.objPartsMax=this._get1ByteNumber(a.POS_OLD_OBJ_COUNT),this._wwaData.isOldMap=!0);this._wwaData.statusEnergyMax=this._get2BytesNumber(a.POS_STATUS_ENERGY_MAX);this._wwaData.statusEnergy=
this._get2BytesNumber(a.POS_STATUS_ENERGY);this._wwaData.statusStrength=this._get2BytesNumber(a.POS_STATUS_STRENGTH);this._wwaData.statusDefence=this._get2BytesNumber(a.POS_STATUS_DEFENCE);this._wwaData.statusGold=this._get2BytesNumber(a.POS_STATUS_GOLD);this._extractInitialItemData();this._wwaData.mapWidth=this._get2BytesNumber(a.POS_MAP_SIZE);this._wwaData.messageNum=this._get2BytesNumber(a.POS_MESSAGE_NUM);28>this._wwaData.version?this._wwaData.mapWidth=71:29>=this._wwaData.version&&(this._wwaData.mapWidth=
101)};a.prototype._extractInitialItemData=function(){var b,c=29<this._wwaData.version?a.POS_ITEMBOX_TOP:a.POS_OLD_ITEMBOX_TOP;this._wwaData.itemBox=Array(WWAConsts.ITEMBOX_SIZE);for(b=0;b<WWAConsts.ITEMBOX_SIZE;b++)this._wwaData.itemBox[b]=this._get1ByteNumber(c+b)};a.prototype._getFieldDataFromBits=function(a,b){var c,d,e;e=util.new2DArray(this._wwaData.mapWidth,this._wwaData.mapWidth);for(c=0;c<this._wwaData.mapWidth;c++)for(d=0;d<this._wwaData.mapWidth;d++)29<this._wwaData.version?(e[c][d]=this._get2BytesNumber(this._currentPosition),
this._currentPosition+=2):(e[c][d]=this._get1ByteNumber(this._currentPosition),this._currentPosition+=1),0===(c*this._wwaData.mapWidth+d)%200&&loader_core.sendProgressToMainProgram(c*this._wwaData.mapWidth+d,this._wwaData.mapWidth*this._wwaData.mapWidth,a===loader_wwa_data.PartsType.MAP?loader_wwa_data.LoadStage.MAP_LOAD:loader_wwa_data.LoadStage.OBJ_LOAD),e[c][d]>=b&&(e[c][d]=0);loader_core.sendProgressToMainProgram(this._wwaData.mapWidth*this._wwaData.mapWidth,this._wwaData.mapWidth*this._wwaData.mapWidth,
a===loader_wwa_data.PartsType.MAP?loader_wwa_data.LoadStage.MAP_LOAD:loader_wwa_data.LoadStage.OBJ_LOAD);return e};a.prototype._getPartsDataFromBits=function(a,b,c){var d,e,f;f=util.new2DArray(b,c);for(d=0;d<b;d++)for(e=0;e<c;e++)0===(d*this._wwaData.mapWidth+e)%200&&loader_core.sendProgressToMainProgram(d*c+e,b*c,a===loader_wwa_data.PartsType.MAP?loader_wwa_data.LoadStage.MAP_ATTR:loader_wwa_data.LoadStage.OBJ_ATTR),f[d][e]=e===WWAConsts.ATR_CROP1||e===WWAConsts.ATR_CROP2?0:this._get2BytesNumber(this._currentPosition),
this._currentPosition+=2;loader_core.sendProgressToMainProgram(b*c,b*c,a===loader_wwa_data.PartsType.MAP?loader_wwa_data.LoadStage.MAP_ATTR:loader_wwa_data.LoadStage.OBJ_ATTR);return f};a.prototype._replaceAllRandomObjects=function(){loader_core.sendProgressToMainProgram(this._wwaData.mapWidth*this._wwaData.mapWidth,this._wwaData.mapWidth*this._wwaData.mapWidth,loader_wwa_data.LoadStage.RAND_PARTS)};a.prototype._replaceRandomObject=function(a,b,c){a=this._wwaData.objectAttribute[a][10+Math.floor(10*
Math.random())];a>=this._wwaData.objPartsMax&&(a=0);this._wwaData.mapObject[b][c]=a};a.POS_CHECK=0;a.POS_VERSION=2;a.POS_OLD_MAP_COUNT=3;a.POS_OLD_OBJ_COUNT=4;a.POS_OLD_PLAYER_X=5;a.POS_OLD_PLAYER_Y=6;a.POS_STATUS_ENERGY=10;a.POS_STATUS_STRENGTH=12;a.POS_STATUS_DEFENCE=14;a.POS_STATUS_GOLD=16;a.POS_OLD_GAMEOVER_X=18;a.POS_OLD_GAMEOVER_Y=19;a.POS_OLD_ITEMBOX_TOP=20;a.POS_STATUS_ENERGY_MAX=32;a.POS_MAP_COUNT=34;a.POS_OBJ_COUNT=36;a.POS_PLAYER_X=38;a.POS_PLAYER_Y=40;a.POS_GAMEOVER_X=42;a.POS_GAMEOVER_Y=
44;a.POS_MAP_SIZE=46;a.POS_MESSAGE_NUM=48;a.POS_ITEMBOX_TOP=60;a.POS_MAPDATA_TOP=90;a.POS_OLD_MAPDATA_TOP=100;return a}();c.WWADataExtractor=b})(loader_extractor||(loader_extractor={}));function sendToMain(c){loader_conf.conf.is_worker?postMessage(c):postMessage_noWorker({data:c})}var util=loader_util,WWAConsts=loader_wwa_data.WWAConsts,WWAData=loader_wwa_data.WWAData,WWADataExtractor=loader_extractor.WWADataExtractor,WWALoader=loader_core.WWALoader;
function loader_start(c){void 0!==c.data.fileName?(new WWALoader(c.data.fileName)).requestMapData():(c=new loader_wwa_data.LoaderResponse,c.wwaData=null,c.progress=null,c.error=new loader_wwa_data.LoaderError,c.error.name="",c.error.message="\u30de\u30c3\u30d7\u30c7\u30fc\u30bf\u306e\u30d5\u30a1\u30a4\u30eb\u540d\u304c\u6307\u5b9a\u3055\u308c\u3066\u3044\u307e\u305b\u3093\u3002",sendToMain(c))}loader_conf.conf.is_worker&&addEventListener("message",loader_start);