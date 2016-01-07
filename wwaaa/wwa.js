var __extends = this.__extends || function (d, b) {
    for (var p in b) if (b.hasOwnProperty(p)) d[p] = b[p];
    function __() { this.constructor = d; }
    __.prototype = b.prototype;
    d.prototype = new __();
};
var wwa_data;
(function (wwa_data) {
    var EquipmentStatus = (function () {
        function EquipmentStatus(s, d) {
            this.strength = s;
            this.defence = d;
        }
        EquipmentStatus.prototype.add = function (s) {
            this.strength += s.strength;
            this.defence += s.defence;
            return this;
        };
        EquipmentStatus.prototype.plus = function (s) {
            return new EquipmentStatus(this.strength + s.strength, this.defence + s.defence);
        };
        EquipmentStatus.prototype.minus = function (s) {
            return new EquipmentStatus(this.strength - s.strength, this.defence - s.defence);
        };
        EquipmentStatus.prototype.equals = function (e) {
            return this.strength === e.strength && this.defence === e.defence;
        };
        return EquipmentStatus;
    })();
    wwa_data.EquipmentStatus = EquipmentStatus;
    var Status = (function (_super) {
        __extends(Status, _super);
        function Status(e, s, d, g) {
            this.energy = e;
            this.gold = g;
            _super.call(this, s, d);
        }
        Status.prototype.add = function (s) {
            if (s instanceof Status) {
                this.energy += s.energy;
                this.gold += s.gold;
            }
            this.strength += s.strength;
            this.defence += s.defence;
            return this;
        };
        Status.prototype.plus = function (s) {
            if (s instanceof Status) {
                return new Status(this.energy + s.energy, this.strength + s.strength, this.defence + s.defence, this.gold + s.gold);
            }
            return new Status(this.energy, this.strength + s.strength, this.defence + s.defence, this.gold);
        };
        Status.prototype.minus = function (s) {
            if (s instanceof Status) {
                return new Status(this.energy - s.energy, this.strength - s.strength, this.defence - s.defence, this.gold - s.gold);
            }
            return new Status(this.energy, this.strength - s.strength, this.defence - s.defence, this.gold);
        };
        Status.prototype.equals = function (e) {
            return this.energy === e.energy && this.strength === e.strength && this.defence === e.defence && this.gold === e.gold;
        };
        return Status;
    })(EquipmentStatus);
    wwa_data.Status = Status;
    /**
        Coordは座標(coordinate)を示す変数２つ組です。
        パーツ座標や、画面座標を用いるのに使用します。
    */
    var Coord = (function () {
        function Coord(x, y) {
            if (x === void 0) { x = 0; }
            if (y === void 0) { y = 0; }
            this.x = x;
            this.y = y;
        }
        Coord.prototype.equals = function (coord) {
            return this.x === coord.x && this.y === coord.y;
        };
        Coord.prototype.substract = function (c) {
            return new Coord(this.x - c.x, this.y - c.y);
        };
        Coord.prototype.clone = function () {
            return new Coord(this.x, this.y);
        };
        Coord.prototype.convertIntoPosition = function (wwa) {
            return new Position(wwa, this.x, this.y, 0, 0);
        };
        Coord.prototype.getDirectionTo = function (dest) {
            if (this.x < dest.x) {
                if (this.y > dest.y) {
                    return 7 /* RIGHT_UP */;
                }
                if (this.y === dest.y) {
                    return 1 /* RIGHT */;
                }
                return 6 /* RIGHT_DOWN */;
            }
            if (this.x === dest.x) {
                if (this.y > dest.y) {
                    return 3 /* UP */;
                }
                if (this.y === dest.y) {
                    return 8 /* NO_DIRECTION */;
                }
                return 2 /* DOWN */;
            }
            if (this.y > dest.y) {
                return 5 /* LEFT_UP */;
            }
            if (this.y === dest.y) {
                return 0 /* LEFT */;
            }
            return 4 /* LEFT_DOWN */;
        };
        return Coord;
    })();
    wwa_data.Coord = Coord;
    var Position = (function () {
        function Position(wwa, x, y, offsetX, offsetY) {
            if (offsetX === void 0) { offsetX = 0; }
            if (offsetY === void 0) { offsetY = 0; }
            this._wwa = wwa;
            if (this._wwa === void 0) {
                throw new Error("WWAのインスタンスが存在しません. ");
            }
            var w = this._wwa.getMapWidth();
            if (x < 0 || x >= w || x >= w - 1 && offsetX > 0 || y < 0 || y >= w || y >= w - 1 && offsetY > 0) {
                throw new Error("範囲外の座標です!! parts:(" + x + ", " + y + "), offset:(" + offsetX + ", " + offsetY + "), mapWidth = " + w);
            }
            this._partsCoord = new Coord(x, y);
            this._offsetCoord = new Coord(offsetX, offsetY);
        }
        Position.prototype.getPartsCoord = function () {
            return this._partsCoord;
        };
        Position.prototype.getOffsetCoord = function () {
            return this._offsetCoord;
        };
        Position.prototype.getScreenTopPosition = function () {
            var newX = Math.floor(this._partsCoord.x / (WWAConsts.H_PARTS_NUM_IN_WINDOW - 1)) * (WWAConsts.H_PARTS_NUM_IN_WINDOW - 1);
            var newY = Math.floor(this._partsCoord.y / (WWAConsts.V_PARTS_NUM_IN_WINDOW - 1)) * (WWAConsts.V_PARTS_NUM_IN_WINDOW - 1);
            return new Position(this._wwa, newX, newY, 0, 0);
        };
        Position.prototype.getNextJustPosition = function (dir) {
            // 方向指定時は、その方向の次のPartsCoordを返す
            if (dir !== void 0) {
                var p = this._partsCoord;
                return new Position(this._wwa, p.x + wwa_data.vx[dir], p.y + wwa_data.vy[dir], 0, 0);
            }
            // 方向未指定時は、offsetの方向の次のPartsCoordを返す。
            var x = this._partsCoord.x, y = this._partsCoord.y;
            if (this._offsetCoord.x < 0) {
                x--;
            }
            else if (this._offsetCoord.x > 0) {
                x++;
            }
            if (this._offsetCoord.y < 0) {
                y--;
            }
            else if (this._offsetCoord.y > 0) {
                y++;
            }
            return new Position(this._wwa, x, y, 0, 0);
        };
        Position.prototype.getNextFramePosition = function (dir, speedX, speedY) {
            var nx = this._partsCoord.x;
            var ny = this._partsCoord.y;
            var nox = this._offsetCoord.x + (wwa_data.vx[dir] * speedX);
            var noy = this._offsetCoord.y + (wwa_data.vy[dir] * speedY);
            if (nox < 0) {
                var dx = Math.floor(Math.abs(nox) / WWAConsts.CHIP_SIZE);
                nx -= dx;
                nox = (nox + dx * WWAConsts.CHIP_SIZE) % WWAConsts.CHIP_SIZE;
            }
            if (noy < 0) {
                var dy = Math.floor(Math.abs(noy) / WWAConsts.CHIP_SIZE);
                ny -= dy;
                noy = (noy + dy * WWAConsts.CHIP_SIZE) % WWAConsts.CHIP_SIZE;
            }
            if (nox >= WWAConsts.CHIP_SIZE) {
                nx += Math.floor(nox / WWAConsts.CHIP_SIZE);
                nox = (nox + WWAConsts.CHIP_SIZE) % WWAConsts.CHIP_SIZE;
            }
            if (noy >= WWAConsts.CHIP_SIZE) {
                ny += Math.floor(noy / WWAConsts.CHIP_SIZE);
                noy = (noy + WWAConsts.CHIP_SIZE) % WWAConsts.CHIP_SIZE;
            }
            return new Position(this._wwa, nx, ny, nox, noy);
        };
        Position.prototype.isJustPosition = function () {
            return this._offsetCoord.x == 0 && this._offsetCoord.y == 0;
        };
        Position.prototype.isScreenTopPosition = function () {
            var stp = this.getScreenTopPosition();
            return this.equals(stp);
        };
        Position.prototype.equals = function (pos) {
            return (this._partsCoord.equals(pos.getPartsCoord()) && this._offsetCoord.equals(pos.getOffsetCoord()));
        };
        Position.prototype.isInCameraRange = function (camera) {
            var camPos = camera.getPosition()._partsCoord;
            var x = this._partsCoord.x;
            var y = this._partsCoord.y;
            return (camPos.x <= x && x < camPos.x + WWAConsts.H_PARTS_NUM_IN_WINDOW && camPos.y <= y && y < camPos.y + WWAConsts.V_PARTS_NUM_IN_WINDOW);
        };
        Position.prototype.hasLocalGate = function () {
            return (this._wwa.getMapTypeByPosition(this) === WWAConsts.MAP_LOCALGATE || this._wwa.getObjectTypeByPosition(this) === WWAConsts.OBJECT_LOCALGATE);
        };
        Position.prototype.clone = function () {
            return new Position(this._wwa, this._partsCoord.x, this._partsCoord.y, this._offsetCoord.x, this._offsetCoord.y);
        };
        return Position;
    })();
    wwa_data.Position = Position;
    (function (Direction) {
        Direction[Direction["LEFT"] = 0] = "LEFT";
        Direction[Direction["RIGHT"] = 1] = "RIGHT";
        Direction[Direction["DOWN"] = 2] = "DOWN";
        Direction[Direction["UP"] = 3] = "UP";
        // ここから下はプレイヤー使用不可
        Direction[Direction["LEFT_DOWN"] = 4] = "LEFT_DOWN";
        Direction[Direction["LEFT_UP"] = 5] = "LEFT_UP";
        Direction[Direction["RIGHT_DOWN"] = 6] = "RIGHT_DOWN";
        Direction[Direction["RIGHT_UP"] = 7] = "RIGHT_UP";
        Direction[Direction["NO_DIRECTION"] = 8] = "NO_DIRECTION";
    })(wwa_data.Direction || (wwa_data.Direction = {}));
    var Direction = wwa_data.Direction;
    ;
    wwa_data.vx = [-1, 1, 0, 0, -1, -1, 1, 1, 0];
    wwa_data.vy = [0, 0, 1, -1, 1, -1, 1, -1, 0];
    wwa_data.dirToPos = [6, 8, 4, 2]; // 仮
    (function (YesNoState) {
        YesNoState[YesNoState["YES"] = 0] = "YES";
        YesNoState[YesNoState["NO"] = 1] = "NO";
        YesNoState[YesNoState["UNSELECTED"] = 2] = "UNSELECTED";
    })(wwa_data.YesNoState || (wwa_data.YesNoState = {}));
    var YesNoState = wwa_data.YesNoState;
    ;
    (function (AppearanceTriggerType) {
        AppearanceTriggerType[AppearanceTriggerType["MAP"] = 0] = "MAP";
        AppearanceTriggerType[AppearanceTriggerType["OBJECT"] = 1] = "OBJECT";
        //        USE_ITEM,
        AppearanceTriggerType[AppearanceTriggerType["CHOICE_YES"] = 2] = "CHOICE_YES";
        AppearanceTriggerType[AppearanceTriggerType["CHOICE_NO"] = 3] = "CHOICE_NO";
    })(wwa_data.AppearanceTriggerType || (wwa_data.AppearanceTriggerType = {}));
    var AppearanceTriggerType = wwa_data.AppearanceTriggerType;
    ;
    (function (ItemMode) {
        ItemMode[ItemMode["NORMAL"] = 0] = "NORMAL";
        ItemMode[ItemMode["CAN_USE"] = 1] = "CAN_USE";
        ItemMode[ItemMode["NOT_DISAPPEAR"] = 2] = "NOT_DISAPPEAR";
    })(wwa_data.ItemMode || (wwa_data.ItemMode = {}));
    var ItemMode = wwa_data.ItemMode;
    ;
    (function (PartsType) {
        PartsType[PartsType["MAP"] = 1] = "MAP";
        PartsType[PartsType["OBJECT"] = 0] = "OBJECT";
    })(wwa_data.PartsType || (wwa_data.PartsType = {}));
    var PartsType = wwa_data.PartsType;
    (function (ChoiceCallInfo) {
        ChoiceCallInfo[ChoiceCallInfo["NONE"] = 0] = "NONE";
        ChoiceCallInfo[ChoiceCallInfo["CALL_BY_MAP_PARTS"] = 1] = "CALL_BY_MAP_PARTS";
        ChoiceCallInfo[ChoiceCallInfo["CALL_BY_OBJECT_PARTS"] = 2] = "CALL_BY_OBJECT_PARTS";
        ChoiceCallInfo[ChoiceCallInfo["CALL_BY_ITEM_USE"] = 3] = "CALL_BY_ITEM_USE";
        ChoiceCallInfo[ChoiceCallInfo["CALL_BY_QUICK_SAVE"] = 4] = "CALL_BY_QUICK_SAVE";
        ChoiceCallInfo[ChoiceCallInfo["CALL_BY_QUICK_LOAD"] = 5] = "CALL_BY_QUICK_LOAD";
        ChoiceCallInfo[ChoiceCallInfo["CALL_BY_RESTART_GAME"] = 6] = "CALL_BY_RESTART_GAME";
        ChoiceCallInfo[ChoiceCallInfo["CALL_BY_GOTO_WWA"] = 7] = "CALL_BY_GOTO_WWA";
    })(wwa_data.ChoiceCallInfo || (wwa_data.ChoiceCallInfo = {}));
    var ChoiceCallInfo = wwa_data.ChoiceCallInfo;
    (function (SidebarButton) {
        SidebarButton[SidebarButton["QUICK_LOAD"] = 0] = "QUICK_LOAD";
        SidebarButton[SidebarButton["QUICK_SAVE"] = 1] = "QUICK_SAVE";
        SidebarButton[SidebarButton["RESTART_GAME"] = 2] = "RESTART_GAME";
        SidebarButton[SidebarButton["GOTO_WWA"] = 3] = "GOTO_WWA";
    })(wwa_data.SidebarButton || (wwa_data.SidebarButton = {}));
    var SidebarButton = wwa_data.SidebarButton;
    (function (LoadType) {
        LoadType[LoadType["QUICK_LOAD"] = 0] = "QUICK_LOAD";
        LoadType[LoadType["RESTART_GAME"] = 1] = "RESTART_GAME";
    })(wwa_data.LoadType || (wwa_data.LoadType = {}));
    var LoadType = wwa_data.LoadType;
    (function (MoveType) {
        MoveType[MoveType["STATIC"] = 0] = "STATIC";
        MoveType[MoveType["CHASE_PLAYER"] = 1] = "CHASE_PLAYER";
        MoveType[MoveType["RUN_OUT"] = 2] = "RUN_OUT";
        MoveType[MoveType["HANG_AROUND"] = 3] = "HANG_AROUND";
    })(wwa_data.MoveType || (wwa_data.MoveType = {}));
    var MoveType = wwa_data.MoveType;
    (function (SecondCandidateMoveType) {
        SecondCandidateMoveType[SecondCandidateMoveType["MODE_X"] = 0] = "MODE_X";
        SecondCandidateMoveType[SecondCandidateMoveType["MODE_Y"] = 1] = "MODE_Y";
        SecondCandidateMoveType[SecondCandidateMoveType["UNDECIDED"] = 2] = "UNDECIDED";
    })(wwa_data.SecondCandidateMoveType || (wwa_data.SecondCandidateMoveType = {}));
    var SecondCandidateMoveType = wwa_data.SecondCandidateMoveType;
    wwa_data.sidebarButtonCellElementID = ["cell-load", "cell-save", "cell-restart", "cell-gotowwa"];
    (function (SystemMessage1) {
        SystemMessage1[SystemMessage1["ASK_LINK"] = 5] = "ASK_LINK";
        SystemMessage1[SystemMessage1["NO_MONEY"] = 6] = "NO_MONEY";
        SystemMessage1[SystemMessage1["NO_ITEM"] = 7] = "NO_ITEM";
        SystemMessage1[SystemMessage1["USE_ITEM"] = 8] = "USE_ITEM";
    })(wwa_data.SystemMessage1 || (wwa_data.SystemMessage1 = {}));
    var SystemMessage1 = wwa_data.SystemMessage1;
    (function (SystemMessage2) {
        SystemMessage2[SystemMessage2["CLICKABLE_ITEM"] = 0] = "CLICKABLE_ITEM";
        SystemMessage2[SystemMessage2["FULL_ITEM"] = 1] = "FULL_ITEM";
        SystemMessage2[SystemMessage2["LOAD_SE"] = 2] = "LOAD_SE";
    })(wwa_data.SystemMessage2 || (wwa_data.SystemMessage2 = {}));
    var SystemMessage2 = wwa_data.SystemMessage2;
    var WWAConsts = (function () {
        function WWAConsts() {
        }
        WWAConsts.VERSION_WWAJS = "C.10";
        WWAConsts.WWA_HOME = "http://wwajp.com";
        WWAConsts.ITEMBOX_SIZE = 12;
        WWAConsts.MAP_ATR_MAX = 60;
        WWAConsts.OBJ_ATR_MAX = 60;
        WWAConsts.OLD_MAP_ATR_MAX = 40;
        WWAConsts.OLD_OBJ_ATR_MAX = 40;
        /*
        static ATR_CROP1: number = 1;
        static ATR_CROP2: number = 2;
        */
        WWAConsts.ATR_TYPE = 3;
        WWAConsts.ATR_MODE = 4;
        WWAConsts.ATR_STRING = 5;
        WWAConsts.ATR_X = 6;
        WWAConsts.ATR_Y = 7;
        WWAConsts.ATR_X2 = 8;
        WWAConsts.ATR_Y2 = 9;
        WWAConsts.ATR_ENERGY = 10;
        WWAConsts.ATR_STRENGTH = 11;
        WWAConsts.ATR_DEFENCE = 12;
        WWAConsts.ATR_GOLD = 13;
        WWAConsts.ATR_ITEM = 14;
        WWAConsts.ATR_NUMBER = 15;
        WWAConsts.ATR_JUMP_X = 16;
        WWAConsts.ATR_MOVE = 16;
        WWAConsts.ATR_JUMP_Y = 17;
        WWAConsts.ATR_APPERANCE_BASE = 20;
        WWAConsts.REL_ATR_APPERANCE_ID = 0;
        WWAConsts.REL_ATR_APPERANCE_X = 1;
        WWAConsts.REL_ATR_APPERANCE_Y = 2;
        WWAConsts.REL_ATR_APPERANCE_TYPE = 3;
        WWAConsts.REL_ATR_APPERANCE_UNIT_LENGTH = 4;
        WWAConsts.ATR_RANDOM_BASE = 10;
        WWAConsts.RANDOM_ATR_NUM = 10;
        WWAConsts.RANDOM_ITERATION_MAX = 10;
        WWAConsts.MAP_STREET = 0;
        WWAConsts.MAP_WALL = 1;
        WWAConsts.MAP_LOCALGATE = 2;
        WWAConsts.MAP_URLGATE = 4;
        WWAConsts.OBJECT_NORMAL = 0;
        WWAConsts.OBJECT_MESSAGE = 1;
        WWAConsts.OBJECT_URLGATE = 2;
        WWAConsts.OBJECT_STATUS = 3;
        WWAConsts.OBJECT_ITEM = 4;
        WWAConsts.OBJECT_DOOR = 5;
        WWAConsts.OBJECT_MONSTER = 6;
        WWAConsts.OBJECT_SCORE = 11;
        WWAConsts.OBJECT_SELL = 14;
        WWAConsts.OBJECT_BUY = 15;
        WWAConsts.OBJECT_RANDOM = 16;
        WWAConsts.OBJECT_SELECT = 17;
        WWAConsts.OBJECT_LOCALGATE = 18;
        WWAConsts.SYSTEM_MESSAGE_NUM = 20;
        WWAConsts.SPLASH_SCREEN_DISP_FRAME_NUM = 500; // ms
        WWAConsts.DEFAULT_FRAME_INTERVAL = 20; // ms
        WWAConsts.GAMEOVER_FRAME_INTERVAL = 50; // ms
        WWAConsts.YESNO_PRESS_DISP_FRAME_NUM = 20; // f
        WWAConsts.CHIP_SIZE = 40;
        WWAConsts.MAP_WINDOW_WIDTH = 440;
        WWAConsts.MAP_WINDOW_HEIGHT = 440;
        WWAConsts.H_PARTS_NUM_IN_WINDOW = WWAConsts.MAP_WINDOW_WIDTH / WWAConsts.CHIP_SIZE;
        WWAConsts.V_PARTS_NUM_IN_WINDOW = WWAConsts.MAP_WINDOW_HEIGHT / WWAConsts.CHIP_SIZE;
        WWAConsts.DEFAULT_SPEED = 20;
        WWAConsts.H_DEFAULT_CAMERA_SPEED = WWAConsts.DEFAULT_SPEED * (WWAConsts.H_PARTS_NUM_IN_WINDOW - 1);
        WWAConsts.V_DEFAULT_CAMERA_SPEED = WWAConsts.DEFAULT_SPEED * (WWAConsts.V_PARTS_NUM_IN_WINDOW - 1);
        WWAConsts.ANIMATION_REP_HALF_FRAME = 22;
        WWAConsts.RELATIVE_COORD_BIAS = 10000;
        WWAConsts.RELATIVE_COORD_LOWER = WWAConsts.RELATIVE_COORD_BIAS - 1000;
        WWAConsts.PLAYER_COORD = WWAConsts.RELATIVE_COORD_BIAS - 1000;
        WWAConsts.LOCALGATE_PLAYER_WAIT_FRAME = 5;
        WWAConsts.STATUS_CHANGED_EFFECT_FRAME_NUM = 20;
        WWAConsts.PASSABLE_OBJECT = 1;
        WWAConsts.APPERANCE_PARTS_MIN_INDEX = 0;
        WWAConsts.APPERANCE_PARTS_MAX_INDEX = 9;
        WWAConsts.APPERANCE_PARTS_MIN_INDEX_NO = 5;
        WWAConsts.APPERANCE_PARTS_MAX_INDEX_YES = 4;
        WWAConsts.FADEOUT_SPEED = 8;
        WWAConsts.STATUS_MINUS_BORDER = 30000;
        WWAConsts.ITEMBOX_IS_FULL = -1;
        WWAConsts.BATTLE_INTERVAL_FRAME_NUM = 10; // f [200/20]
        WWAConsts.BATTLE_SPEED_CHANGE_TURN_NUM = 40; // モンスターターンを含む, バトルを早送りにするまでのターン数
        WWAConsts.RANDOM_MOVE_ITERATION_NUM = 50;
        WWAConsts.BATTLE_ESTIMATE_MONSTER_TYPE_MAX = 8;
        WWAConsts.ITEM_BORDER_IMG_DATA_URL = "data:image/png;base64,iVBORw0KGgoAAAANSUhEUgAAACgAAAAoCAYAAACM/rhtAAAArklEQVRYR" + "+2Y0QqAIAxFt///aENJHwxxuJUSxzeh3S7HXaNpEkly4FIRzba0GEyHeVTN7jqDWvb7V4Y1NLibZIY0" + "NbiL5G3MZLCe / 1fn3XJgJYjB7mgg6O1VCEKwXo79JeklY62nB62kRs9BEIKkeNIDhISQEBJC4k0BB" + "CF4D7D4cV9shf99ixdB + MrM0y3fa3zV05D45GOqhwPMGPkYlccIOEY2VKUN0UNVXxC7ADj7mDi9aF" + "ZZAAAAAElFTkSuQmCC";
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
            this.moves = void 0;
        }
        return WWAData;
    })();
    wwa_data.WWAData = WWAData;
})(wwa_data || (wwa_data = {}));
/// <reference path="./wwa_data.ts" />
var wwa_camera;
(function (wwa_camera) {
    var Consts = wwa_data.WWAConsts;
    var Camera = (function () {
        /**
          現在のプレイヤー座標が含まれるカメラ位置(表示画面左上)を含むカメラを作ります.
          @param position: wwa_data.Position 現在のプレイヤー座標
        */
        function Camera(position) {
            this._position = null;
            this.reset(position);
        }
        Camera.prototype.isResetting = function () {
            return this._isResetting;
        };
        Camera.prototype.getPosition = function () {
            return this._position;
        };
        Camera.prototype.getPreviousPosition = function () {
            return this._positionPrev;
        };
        Camera.prototype.resetPreviousPosition = function () {
            this._positionPrev = null;
        };
        // throws OutOfWWAMapRangeError;
        Camera.prototype.move = function (dir) {
            this._position = this._position.getNextFramePosition(dir, Consts.H_DEFAULT_CAMERA_SPEED, Consts.V_DEFAULT_CAMERA_SPEED);
        };
        Camera.prototype.getTransitionStepNum = function () {
            return this._transitionStep;
        };
        Camera.prototype.advanceTransitionStepNum = function () {
            ++this._transitionStep;
            if (this._transitionStep === wwa_data.WWAConsts.V_PARTS_NUM_IN_WINDOW) {
                this._isResetting = false;
                this._transitionStep = 0;
            }
            return this._transitionStep;
        };
        Camera.prototype.isFinalStep = function () {
            if (this._isResetting === false) {
                throw new Error("リセット中ではありません。");
            }
            return this._transitionStep === wwa_data.WWAConsts.V_PARTS_NUM_IN_WINDOW - 1;
        };
        Camera.prototype.reset = function (position) {
            this._positionPrev = this._position;
            this._position = position.getScreenTopPosition();
            this._transitionStep = 0;
            this._isResetting = true;
        };
        return Camera;
    })();
    wwa_camera.Camera = Camera;
})(wwa_camera || (wwa_camera = {}));
/// <reference path="./wwa_data.ts" />
var wwa_cgmanager;
(function (wwa_cgmanager) {
    var Consts = wwa_data.WWAConsts;
    var CGManager = (function () {
        function CGManager(ctx, ctxSub, fileName, loadCompleteCallBack) {
            this._isLoaded = false;
            this._ctx = ctx;
            this._ctxSub = ctxSub;
            this._fileName = fileName;
            this._loadCompleteCallBack = loadCompleteCallBack;
            this._load();
        }
        CGManager.prototype._load = function () {
            var _this = this;
            if (this._isLoaded) {
                return;
            }
            this._image = new Image();
            this._image.addEventListener("load", function () {
                _this._loadCompleteCallBack();
            });
            this._image.addEventListener("error", function () {
                throw new Error("Image Load Failed!!\nfile name:" + _this._fileName);
            });
            this._image.src = this._fileName;
            this._isLoaded = true;
        };
        CGManager.prototype.drawCanvas = function (chipX, chipY, canvasX, canvasY, isSub) {
            if (isSub === void 0) { isSub = false; }
            var ctx = isSub ? this._ctxSub : this._ctx;
            if (!this._isLoaded) {
                throw new Error("No image was loaded.");
            }
            ctx.drawImage(this._image, Consts.CHIP_SIZE * chipX, Consts.CHIP_SIZE * chipY, Consts.CHIP_SIZE, Consts.CHIP_SIZE, canvasX, canvasY, Consts.CHIP_SIZE, Consts.CHIP_SIZE);
        };
        CGManager.prototype.drawCanvasWithUpperYLimit = function (chipX, chipY, canvasX, canvasY, yLimit, isSub) {
            if (isSub === void 0) { isSub = false; }
            var ctx = isSub ? this._ctxSub : this._ctx;
            if (!this._isLoaded) {
                throw new Error("No image was loaded.");
            }
            var delLength = Math.max(0, canvasY + Consts.CHIP_SIZE - yLimit);
            if (delLength >= Consts.CHIP_SIZE) {
                return;
            }
            ctx.drawImage(this._image, Consts.CHIP_SIZE * chipX, Consts.CHIP_SIZE * chipY, Consts.CHIP_SIZE, Consts.CHIP_SIZE - delLength, canvasX, canvasY, Consts.CHIP_SIZE, Consts.CHIP_SIZE);
        };
        CGManager.prototype.drawCanvasWithLowerYLimit = function (chipX, chipY, canvasX, canvasY, yLimit, isSub) {
            if (isSub === void 0) { isSub = false; }
            var ctx = isSub ? this._ctxSub : this._ctx;
            if (!this._isLoaded) {
                throw new Error("No image was loaded.");
            }
            var delLength = Math.max(0, yLimit - canvasY);
            if (delLength >= Consts.CHIP_SIZE) {
                return;
            }
            ctx.drawImage(this._image, Consts.CHIP_SIZE * chipX, Consts.CHIP_SIZE * chipY + delLength, Consts.CHIP_SIZE, Consts.CHIP_SIZE - delLength, canvasX, canvasY + delLength, Consts.CHIP_SIZE, Consts.CHIP_SIZE);
        };
        CGManager.prototype.clearCanvas = function (x, y, w, h, isSub) {
            if (isSub === void 0) { isSub = false; }
            var ctx = isSub ? this._ctxSub : this._ctx;
            ctx.clearRect(x, y, w, h);
        };
        CGManager.prototype.drawBase = function (x, y, w, h, isSub) {
            if (isSub === void 0) { isSub = false; }
            var ctx = isSub ? this._ctxSub : this._ctx;
            ctx.fillStyle = "#9E9E9E";
            ctx.fillRect(x, y, w, h);
        };
        return CGManager;
    })();
    wwa_cgmanager.CGManager = CGManager;
})(wwa_cgmanager || (wwa_cgmanager = {}));
var wwa_estimate_battle;
(function (wwa_estimate_battle) {
    var EstimateDisplayElements = (function () {
        function EstimateDisplayElements(id, imgFileName, parent) {
            this.id = id;
            this.imgFileName = imgFileName;
            this.parent = parent;
            this.elem = document.createElement("div");
            this.elem.classList.add("est");
            this.elem.setAttribute("id", "wwa-est-" + id);
            this.imgElem = document.createElement("div");
            this.imgElem.classList.add("est-img-wrapper");
            this.imgElem.style.backgroundImage = "url(" + this.imgFileName.replace("(", "\\(").replace(")", "\\)") + ")";
            this.statusElem = document.createElement("div");
            this.statusElem.classList.add("est-status-wrapper");
            this.energyElem = document.createElement("div");
            this.energyElem.classList.add("est-energy");
            this.energyDispElem = document.createElement("span");
            this.energyDispElem.classList.add("est-energy-disp");
            this.energyElem.appendChild(this.energyDispElem);
            this.statusElem.appendChild(this.energyElem);
            this.strengthElem = document.createElement("div");
            this.strengthElem.classList.add("est-strength");
            this.strengthDispElem = document.createElement("span");
            this.strengthDispElem.classList.add("est-strength-disp");
            this.strengthElem.appendChild(this.strengthDispElem);
            this.statusElem.appendChild(this.strengthElem);
            this.defenceElem = document.createElement("div");
            this.defenceElem.classList.add("est-defence");
            this.defenceDispElem = document.createElement("span");
            this.defenceDispElem.classList.add("est-defence-disp");
            this.defenceElem.appendChild(this.defenceDispElem);
            this.statusElem.appendChild(this.defenceElem);
            this.damageElem = document.createElement("div");
            this.damageElem.classList.add("est-damage");
            this.damageDispElem = document.createElement("span");
            this.damageDispElem.classList.add("est-damage-disp");
            this.damageElem.appendChild(this.damageDispElem);
            this.statusElem.appendChild(this.damageElem);
            this.elem.appendChild(this.imgElem);
            this.elem.appendChild(this.statusElem);
        }
        EstimateDisplayElements.prototype.hide = function () {
            this.elem.style.display = "none";
        };
        EstimateDisplayElements.prototype.show = function () {
            this.elem.style.display = "block";
        };
        EstimateDisplayElements.prototype.setResult = function (enemyImgPos, enemyStatus, result) {
            this.imgElem.style.backgroundPosition = "-" + enemyImgPos.x + "px -" + enemyImgPos.y + "px";
            this.energyDispElem.textContent = "生命力 " + enemyStatus.energy;
            this.strengthDispElem.textContent = "攻撃力 " + enemyStatus.strength;
            this.defenceDispElem.textContent = "防御力 " + enemyStatus.defence;
            if (result.isNoEffect) {
                this.damageDispElem.textContent = "攻撃無効";
            }
            else if (result.isOverMaxTurn) {
                this.damageDispElem.textContent = "長期戦が予想されます";
            }
            else {
                this.damageDispElem.textContent = "予想ダメージ " + result.damage;
            }
        };
        return EstimateDisplayElements;
    })();
    var BattleEstimateWindow = (function () {
        function BattleEstimateWindow(_wwa, _imgFileName, _parent) {
            var _this = this;
            this._wwa = _wwa;
            this._imgFileName = _imgFileName;
            this._parent = _parent;
            var ede;
            this._element = document.createElement("div");
            this._element.setAttribute("id", "wwa-battle-estimate");
            this._element.style.display = "none";
            this._edes = [];
            for (var i = 0; i < wwa_data.WWAConsts.BATTLE_ESTIMATE_MONSTER_TYPE_MAX; i++) {
                ede = new EstimateDisplayElements(i, this._imgFileName, this._element);
                this._edes.push(ede);
                this._element.appendChild(ede.elem);
            }
            this._element.addEventListener("click", function () {
                _this._wwa.hideBattleEstimateWindow();
            });
            this._parent.appendChild(this._element);
        }
        BattleEstimateWindow.prototype.update = function (playerStatus, monsters) {
            for (var i = 0; i < wwa_data.WWAConsts.BATTLE_ESTIMATE_MONSTER_TYPE_MAX; i++) {
                if (i >= monsters.length) {
                    // 非表示処理
                    this._edes[i].hide();
                    continue;
                }
                var imgx = this._wwa.getObjectAttributeById(monsters[i], wwa_data.WWAConsts.ATR_X);
                var imgy = this._wwa.getObjectAttributeById(monsters[i], wwa_data.WWAConsts.ATR_Y);
                var imgPos = new wwa_data.Coord(imgx, imgy);
                var eng = this._wwa.getObjectAttributeById(monsters[i], wwa_data.WWAConsts.ATR_ENERGY);
                var str = this._wwa.getObjectAttributeById(monsters[i], wwa_data.WWAConsts.ATR_STRENGTH);
                var def = this._wwa.getObjectAttributeById(monsters[i], wwa_data.WWAConsts.ATR_DEFENCE);
                var enemyStatus = new wwa_data.Status(eng, str, def, 0);
                var result = calc(playerStatus, enemyStatus);
                this._edes[i].setResult(imgPos, enemyStatus, result);
                this._edes[i].show();
            }
        };
        BattleEstimateWindow.prototype.show = function () {
            this._element.style.display = "block";
        };
        BattleEstimateWindow.prototype.hide = function () {
            this._element.style.display = "none";
        };
        return BattleEstimateWindow;
    })();
    wwa_estimate_battle.BattleEstimateWindow = BattleEstimateWindow;
    var EstimateResult = (function () {
        function EstimateResult(isNoEffect, isOverMaxTurn, damage) {
            this.isNoEffect = isNoEffect;
            this.isOverMaxTurn = isOverMaxTurn;
            this.damage = damage;
        }
        return EstimateResult;
    })();
    function calc(playerStatus, enemyStatus) {
        var energyE = enemyStatus.energy;
        var attackP = playerStatus.strength - enemyStatus.defence;
        var attackE = Math.max(0, enemyStatus.strength - playerStatus.defence);
        var turn = 0;
        var damage = 0;
        if (attackP > 0) {
            while (1) {
                turn++;
                energyE -= attackP;
                if (energyE <= 0) {
                    return new EstimateResult(false, false, damage);
                }
                damage += attackE;
                if (turn > 10000) {
                    return new EstimateResult(false, true, 0);
                }
            }
        }
        else {
            return new EstimateResult(true, false, 0);
        }
    }
})(wwa_estimate_battle || (wwa_estimate_battle = {}));
// FIXME: innerHTML使う実装、あんまりよくないけど、許して。
// 入力値を扱う時はセキュリティに気をつける!!
var wwa_inject_html;
(function (wwa_inject_html) {
    var inject_html = "\
            <canvas id=\"wwa-map\" class=\"wwa-canvas\" width=\"440\" height=\"440\">\
                このブラウザは、Canvas要素をサポートしていません。\
            </canvas>\
            <canvas id=\"wwa-map-sub\" class=\"wwa-canvas\" width=\"440\" height=\"440\"></canvas>\
            <div id=\"wwa-sidebar\">\
                <div class=\"wide-cell-row\" id=\"disp-energy\"><div class=\"status-icon\"></div><div class=\"status-value-box\">0</div></div>\
                <div class=\"wide-cell-row\" id=\"disp-strength\"><div class=\"status-icon\"></div><div class=\"status-value-box\"> 0 </div></div>\
                <div class=\"wide-cell-row\" id=\"disp-defence\"><div class=\"status-icon\"></div><div class=\"status-value-box\">0</div></div>\
                <div class=\"wide-cell-row\" id=\"disp-gold\"><div class=\"status-icon\"></div><div class=\"status-value-box\">0</div></div>\
                <div class=\"item-cell\" id=\"item0\"><div class=\"item-disp\"></div></div>\
                <div class=\"item-cell\" id=\"item1\"><div class=\"item-disp\"></div></div>\
                <div class=\"item-cell\" id=\"item2\"><div class=\"item-disp\"></div></div>\
                <div class=\"item-cell\" id=\"item3\"><div class=\"item-disp\"></div></div>\
                <div class=\"item-cell\" id=\"item4\"><div class=\"item-disp\"></div></div>\
                <div class=\"item-cell\" id=\"item5\"><div class=\"item-disp\"></div></div>\
                <div class=\"item-cell\" id=\"item6\"><div class=\"item-disp\"></div></div>\
                <div class=\"item-cell\" id=\"item7\"><div class=\"item-disp\"></div></div>\
                <div class=\"item-cell\" id=\"item8\"><div class=\"item-disp\"></div></div>\
                <div class=\"item-cell\" id=\"item9\"><div class=\"item-disp\"></div></div>\
                <div class=\"item-cell\" id=\"item10\"><div class=\"item-disp\"></div></div>\
                <div class=\"item-cell\" id=\"item11\"><div class=\"item-disp\"></div></div>\
                <div class=\"wide-cell-row\" id=\"cell-load\">Quick Load</div><div class=\"wide-button\" id=\"button-load\"></div>\
                <div class=\"wide-cell-row\" id=\"cell-save\">Quick Save</div><div class=\"wide-button\" id=\"button-save\"></div>\
                <div class=\"wide-cell-row\" id=\"cell-restart\">Restart Game</div><div class=\"wide-button\" id=\"button-restart\"></div>\
                <div class=\"wide-cell-row\" id=\"cell-gotowwa\">Go to WWA</div><div class=\"wide-button\" id=\"button-gotowwa\"></div>\
            </div>\
            <div id=\"wwa-controller\"></div>\
            <div id=\"wwa-fader\"></div>\
            <div id=\"wwa-cover\"><img src=\"cover.gif\" /></div>\
    ";
    function inject(parent) {
        parent.innerHTML = inject_html;
    }
    wwa_inject_html.inject = inject;
})(wwa_inject_html || (wwa_inject_html = {}));
var wwa_input;
(function (wwa_input) {
    (function (KeyState) {
        KeyState[KeyState["NONE"] = 0] = "NONE";
        KeyState[KeyState["KEYDOWN"] = 1] = "KEYDOWN";
        KeyState[KeyState["KEYPRESS"] = 2] = "KEYPRESS";
        KeyState[KeyState["KEYUP"] = 3] = "KEYUP";
    })(wwa_input.KeyState || (wwa_input.KeyState = {}));
    var KeyState = wwa_input.KeyState;
    (function (KeyCode) {
        KeyCode[KeyCode["KEY_ENTER"] = 13] = "KEY_ENTER";
        KeyCode[KeyCode["KEY_SHIFT"] = 16] = "KEY_SHIFT";
        KeyCode[KeyCode["KEY_ESC"] = 27] = "KEY_ESC";
        KeyCode[KeyCode["KEY_SPACE"] = 32] = "KEY_SPACE";
        KeyCode[KeyCode["KEY_LEFT"] = 37] = "KEY_LEFT";
        KeyCode[KeyCode["KEY_UP"] = 38] = "KEY_UP";
        KeyCode[KeyCode["KEY_RIGHT"] = 39] = "KEY_RIGHT";
        KeyCode[KeyCode["KEY_DOWN"] = 40] = "KEY_DOWN";
        KeyCode[KeyCode["KEY_1"] = 49] = "KEY_1";
        KeyCode[KeyCode["KEY_2"] = 50] = "KEY_2";
        KeyCode[KeyCode["KEY_3"] = 51] = "KEY_3";
        KeyCode[KeyCode["KEY_A"] = 65] = "KEY_A";
        KeyCode[KeyCode["KEY_C"] = 67] = "KEY_C";
        KeyCode[KeyCode["KEY_D"] = 68] = "KEY_D";
        KeyCode[KeyCode["KEY_E"] = 69] = "KEY_E";
        KeyCode[KeyCode["KEY_M"] = 77] = "KEY_M";
        KeyCode[KeyCode["KEY_N"] = 78] = "KEY_N";
        KeyCode[KeyCode["KEY_Q"] = 81] = "KEY_Q";
        KeyCode[KeyCode["KEY_S"] = 83] = "KEY_S";
        KeyCode[KeyCode["KEY_W"] = 87] = "KEY_W";
        KeyCode[KeyCode["KEY_X"] = 88] = "KEY_X";
        KeyCode[KeyCode["KEY_Y"] = 89] = "KEY_Y";
        KeyCode[KeyCode["KEY_Z"] = 90] = "KEY_Z";
        KeyCode[KeyCode["KEY_F1"] = 112] = "KEY_F1";
        KeyCode[KeyCode["KEY_F3"] = 114] = "KEY_F3";
        KeyCode[KeyCode["KEY_F4"] = 115] = "KEY_F4";
        KeyCode[KeyCode["KEY_F5"] = 116] = "KEY_F5";
        KeyCode[KeyCode["KEY_F6"] = 117] = "KEY_F6";
        KeyCode[KeyCode["KEY_F7"] = 118] = "KEY_F7";
        KeyCode[KeyCode["KEY_F8"] = 119] = "KEY_F8";
        KeyCode[KeyCode["KEY_F12"] = 123] = "KEY_F12";
    })(wwa_input.KeyCode || (wwa_input.KeyCode = {}));
    var KeyCode = wwa_input.KeyCode;
    var KeyStore = (function () {
        function KeyStore() {
            var i;
            this._nextKeyState = new Array(KeyStore.KEY_BUFFER_MAX);
            this._keyState = new Array(KeyStore.KEY_BUFFER_MAX);
            this._prevKeyState = new Array(KeyStore.KEY_BUFFER_MAX);
            for (i = 0; i < KeyStore.KEY_BUFFER_MAX; i++) {
                this._nextKeyState[i] = false;
                this._keyState[i] = false;
                this._prevKeyState[i] = false;
            }
        }
        KeyStore.prototype.checkHitKey = function (keyCode) {
            var s = this.getKeyState(keyCode);
            return (s === 1 /* KEYDOWN */ || s === 2 /* KEYPRESS */);
        };
        KeyStore.prototype.getKeyState = function (keyCode) {
            if (this._prevKeyState[keyCode]) {
                if (this._keyState[keyCode]) {
                    return 2 /* KEYPRESS */;
                }
                return 3 /* KEYUP */;
            }
            else {
                if (this._keyState[keyCode]) {
                    return 1 /* KEYDOWN */;
                }
                return 0 /* NONE */;
            }
        };
        KeyStore.prototype.setPressInfo = function (keyCode) {
            this._nextKeyState[keyCode] = true;
        };
        KeyStore.prototype.setReleaseInfo = function (keyCode) {
            this._nextKeyState[keyCode] = false;
        };
        KeyStore.prototype.update = function () {
            this._prevKeyState = this._keyState.slice();
            this._keyState = this._nextKeyState.slice();
        };
        KeyStore.prototype.allClear = function () {
            this._nextKeyState = new Array(KeyStore.KEY_BUFFER_MAX);
        };
        KeyStore.KEY_BUFFER_MAX = 256;
        return KeyStore;
    })();
    wwa_input.KeyStore = KeyStore;
    (function (MouseState) {
        MouseState[MouseState["NONE"] = 0] = "NONE";
        MouseState[MouseState["MOUSEDOWN"] = 1] = "MOUSEDOWN";
        MouseState[MouseState["MOUSEPRESS"] = 2] = "MOUSEPRESS";
        MouseState[MouseState["MOUSEUP"] = 3] = "MOUSEUP";
    })(wwa_input.MouseState || (wwa_input.MouseState = {}));
    var MouseState = wwa_input.MouseState;
    var MouseStore = (function () {
        function MouseStore() {
            this._prevMouseState = false;
            this._mouseState = false;
            this._nextMouseState = false;
        }
        MouseStore.prototype.checkClickMouse = function (dir) {
            var s;
            if (dir !== void 0) {
                s = this.getMouseState(dir);
            }
            else {
                s = this.getMouseState();
            }
            return (s === 1 /* MOUSEDOWN */ || s === 2 /* MOUSEPRESS */);
        };
        MouseStore.prototype.getMouseState = function (dir) {
            if (dir !== void 0) {
                if (this._inputDir !== dir) {
                    return 0 /* NONE */;
                }
            }
            if (this._prevMouseState) {
                if (this._mouseState) {
                    return 2 /* MOUSEPRESS */;
                }
                return 3 /* MOUSEUP */;
            }
            else {
                if (this._mouseState) {
                    return 1 /* MOUSEDOWN */;
                }
                return 0 /* NONE */;
            }
        };
        MouseStore.prototype.setPressInfo = function (dir) {
            this._nextMouseState = true;
            this._inputDir = dir;
        };
        MouseStore.prototype.setReleaseInfo = function () {
            this._nextMouseState = false;
        };
        MouseStore.prototype.update = function () {
            this._prevMouseState = this._mouseState;
            this._mouseState = this._nextMouseState;
        };
        MouseStore.prototype.clear = function () {
            this._nextMouseState = false;
        };
        return MouseStore;
    })();
    wwa_input.MouseStore = MouseStore;
})(wwa_input || (wwa_input = {}));
var wwa_util;
(function (wwa_util) {
    wwa_util.$id = function (id) {
        return document.getElementById(id);
    };
    wwa_util.$class = function (className) {
        return document.getElementsByClassName(className);
    };
    wwa_util.$tag = function (tagName) {
        return document.getElementsByTagName(tagName);
    };
    wwa_util.$qs = function (selector) {
        return document.querySelector(selector);
    };
    wwa_util.$qsh = function (selector) {
        return document.querySelector(selector);
    };
    wwa_util.$qsAll = function (selector) {
        return document.querySelectorAll(selector);
    };
    wwa_util.$localPos = function (mouseX, mouseY) {
        var cx, cy;
        var sx = window.pageXOffset || document.body.scrollLeft || document.documentElement.scrollLeft;
        var sy = window.pageYOffset || document.body.scrollTop || document.documentElement.scrollTop;
        cx = mouseX - wwa_util.$id("wwa-wrapper").offsetLeft + sx;
        cy = mouseY - wwa_util.$id("wwa-wrapper").offsetTop + sy;
        return new wwa_data.Coord(cx, cy);
    };
    // FIXME: この実装、大丈夫？
    wwa_util.$escapedURI = function (uri) {
        if (uri.match(/^https?:\/\//) || uri.match(/^\.\.\//)) {
            return uri;
        }
        else {
            return location.href = "./" + uri;
        }
    };
})(wwa_util || (wwa_util = {}));
var wwa_message;
(function (wwa_message) {
    var TextWindow = (function () {
        function TextWindow(_wwa, _coord, _width, _height, _isVisible, _parentElement, zIndex) {
            this._wwa = _wwa;
            this._coord = _coord;
            this._width = _width;
            this._height = _height;
            this._isVisible = _isVisible;
            this._parentElement = _parentElement;
            this._element = document.createElement("div");
            this._element.style.position = "absolute";
            this._element.style.border = "1px solid #000000";
            this._element.style.borderRadius = "5px";
            this._element.style.backgroundColor = "#FFFFFF";
            this._element.style.zIndex = zIndex + "";
            this._element.style.opacity = "1";
            this._element.style.left = this._coord.x + "px";
            this._element.style.top = this._coord.y + "px";
            this._element.style.width = this._width + "px";
            this._element.style.height = this._height + "px";
            this._parentElement.appendChild(this._element);
        }
        TextWindow.prototype.update = function (a) {
            /* サブクラスで実装してください。*/
        };
        TextWindow.prototype.show = function () {
            this._isVisible = true;
            this._element.style.display = "block";
            this.update();
        };
        TextWindow.prototype.hide = function () {
            this._isVisible = false;
            this._element.style.display = "none";
            this.update();
        };
        TextWindow.prototype.isVisible = function () {
            return this._isVisible;
        };
        return TextWindow;
    })();
    var MosterWindow = (function (_super) {
        __extends(MosterWindow, _super);
        function MosterWindow(wwa, coord, width, height, isVisible, parentElement, _cgFileName) {
            _super.call(this, wwa, new wwa_data.Coord(coord.x, coord.y), width, height, isVisible, parentElement, 201);
            this._cgFileName = _cgFileName;
            this._monsterBox = document.createElement("div");
            this._monsterBox.style.width = wwa_data.WWAConsts.CHIP_SIZE + "px";
            this._monsterBox.style.height = wwa_data.WWAConsts.CHIP_SIZE + "px";
            this._monsterBox.style.position = "absolute";
            this._monsterBox.style.left = "10px";
            this._monsterBox.style.top = "10px";
            this._monsterBox.style.backgroundImage = "url(" + this._cgFileName.replace("(", "\\(").replace(")", "\\)") + ")";
            this._monsterBox.style.backgroundPosition = "0 0";
            this._element.appendChild(this._monsterBox);
            this._energyBox = document.createElement("div");
            this._energyBox.style.position = "absolute";
            this._energyBox.style.left = "80px";
            this._energyBox.style.top = "10px";
            this._energyBox.textContent = "生命力 0";
            this._element.appendChild(this._energyBox);
            this._strengthBox = document.createElement("div");
            this._strengthBox.style.position = "absolute";
            this._strengthBox.style.left = "80px";
            this._strengthBox.style.top = "30px";
            this._strengthBox.textContent = "攻撃力 0";
            this._element.appendChild(this._strengthBox);
            this._defenceBox = document.createElement("div");
            this._defenceBox.style.position = "absolute";
            this._defenceBox.style.left = "180px";
            this._defenceBox.style.top = "30px";
            this._defenceBox.textContent = "防御力 0";
            this._element.appendChild(this._defenceBox);
            if (this._isVisible) {
                this._element.style.display = "block";
            }
            else {
                this._element.style.display = "none";
            }
        }
        MosterWindow.prototype.update = function (monster) {
            if (monster !== void 0) {
                this._monsterBox.style.backgroundPosition = "-" + monster.imgCoord.x + "px -" + monster.imgCoord.y + "px";
                this._energyBox.textContent = "生命力 " + monster.status.energy;
                this._strengthBox.textContent = "攻撃力 " + monster.status.strength;
                this._defenceBox.textContent = "防御力 " + monster.status.defence;
            }
        };
        return MosterWindow;
    })(TextWindow);
    wwa_message.MosterWindow = MosterWindow;
    var ScoreWindow = (function (_super) {
        __extends(ScoreWindow, _super);
        function ScoreWindow(wwa, coord, isVisible, parentElement) {
            _super.call(this, wwa, new wwa_data.Coord(coord.x, coord.y), 340, 30, isVisible, parentElement, 202);
            this._element.style.textAlign = "center";
            if (this._isVisible) {
                this._element.style.display = "block";
            }
            else {
                this._element.style.display = "none";
            }
            this.update(0);
        }
        ScoreWindow.prototype.update = function (score) {
            if (score !== void 0) {
                this._element.textContent = "Score: " + score;
            }
        };
        return ScoreWindow;
    })(TextWindow);
    wwa_message.ScoreWindow = ScoreWindow;
    var MessageWindow = (function () {
        // TODO 高さの自動調節, overflowの処遇, ボタンが必ず見えるように
        function MessageWindow(wwa, x, y, width, height, message, cgFileName, isVisible, isYesno, parentElement) {
            var thisA = this;
            var escapedFilename = cgFileName.replace("(", "\\(").replace(")", "\\)");
            this._wwa = wwa;
            this._cgFileName = cgFileName;
            this._x = x;
            this._y = y;
            this._width = width;
            this._height = height;
            this._message = message;
            this._isVisible = isVisible;
            this._isYesno = isYesno;
            this._element = document.createElement("div");
            this._element.style.position = "absolute";
            this._element.style.border = "1px solid #000000";
            this._element.style.borderRadius = "5px";
            this._element.style.backgroundColor = "#FFFFFF";
            this._element.style.zIndex = "200";
            this._element.style.opacity = "1";
            this._msgWrapperElement = document.createElement("div");
            this._msgWrapperElement.style.padding = "5px";
            this._msgWrapperElement.style.margin = "0";
            this._msgWrapperElement.style.textAlign = "left";
            this._msgWrapperElement.style.wordWrap = "break-word";
            this._element.appendChild(this._msgWrapperElement);
            this._dummyElement = document.createElement("div");
            this._dummyElement.style.display = "none";
            this._dummyElement.style.padding = "0";
            this._dummyElement.style.margin = "0";
            this._dummyElement.style.height = "55px";
            this._element.appendChild(this._dummyElement);
            this._ynWrapperElement = document.createElement("div");
            this._ynWrapperElement.style.padding = "0";
            this._ynWrapperElement.style.margin = "0";
            this._ynWrapperElement.style.position = "absolute";
            this._ynWrapperElement.style.left = "246px";
            this._ynWrapperElement.style.bottom = "10px";
            this._ynWrapperElement.style.width = "80px";
            this._ynWrapperElement.style.height = "40px";
            this._ynWrapperElement.style.zIndex = "10";
            this._element.appendChild(this._ynWrapperElement);
            this._parentElement = parentElement;
            this._parentElement.appendChild(this._element);
            this._divYesElement = document.createElement("div");
            this._divYesElement.style.padding = "0";
            this._divYesElement.style.margin = "0";
            this._divYesElement.style.cssFloat = "left";
            this._divYesElement.style.width = "40px";
            this._divYesElement.style.height = "40px";
            this._divYesElement.style.background = "url(" + escapedFilename + ")";
            this._divYesElement.onclick = function () {
                if (!thisA._isInputDisable) {
                    wwa.setYesNoInput(0 /* YES */);
                    thisA.update();
                }
            };
            this._divYesElement.style.cursor = "pointer";
            this._divNoElement = document.createElement("div");
            this._divNoElement.style.padding = "0";
            this._divNoElement.style.margin = "0";
            this._divNoElement.style.cssFloat = "left";
            this._divNoElement.style.width = "40px";
            this._divNoElement.style.height = "40px";
            this._divNoElement.style.background = "url(" + escapedFilename + ")";
            this._divNoElement.onclick = function () {
                if (!thisA._isInputDisable) {
                    wwa.setYesNoInput(1 /* NO */);
                    thisA.update();
                }
            };
            this._divNoElement.style.cursor = "pointer";
            this._ynWrapperElement.appendChild(this._divYesElement);
            this._ynWrapperElement.appendChild(this._divNoElement);
            thisA._isInputDisable = false;
            this.update();
        }
        MessageWindow.prototype.setPosition = function (x, y, width, height) {
            this._x = x;
            this._y = y;
            this._width = width;
            this._height = height;
            this.update();
        };
        MessageWindow.prototype.setMessage = function (message) {
            this._message = message;
            this.update();
        };
        MessageWindow.prototype.setYesNoChoice = function (isYesNo) {
            this._isInputDisable = false;
            this._isYesno = isYesNo;
            this.update();
            return this._isYesno;
        };
        MessageWindow.prototype.isYesNoChoice = function () {
            return this._isYesno;
        };
        MessageWindow.prototype.setInputDisable = function () {
            this._isInputDisable = true;
        };
        MessageWindow.prototype.isInputDisable = function () {
            return this._isInputDisable;
        };
        MessageWindow.prototype.show = function () {
            this._isVisible = true;
            this.update();
        };
        MessageWindow.prototype.hide = function () {
            this._isVisible = false;
            this.update();
        };
        MessageWindow.prototype.isVisible = function () {
            return this._isVisible;
        };
        MessageWindow.prototype.update = function () {
            if (this._isYesno) {
                if (this._wwa.getYesNoState() === 0 /* YES */) {
                    this._divYesElement.style.backgroundPosition = "-200px -40px";
                    this._divNoElement.style.backgroundPosition = "-160px -40px";
                }
                else if (this._wwa.getYesNoState() === 1 /* NO */) {
                    this._divYesElement.style.backgroundPosition = "-120px -40px";
                    this._divNoElement.style.backgroundPosition = "-240px -40px";
                }
                else {
                    this._divYesElement.style.backgroundPosition = "-120px -40px";
                    this._divNoElement.style.backgroundPosition = "-160px -40px";
                }
                this._ynWrapperElement.style.display = "block";
            }
            else {
                this._ynWrapperElement.style.display = "none";
            }
            this._msgWrapperElement.textContent = "";
            var mesArray = this._message.split("\n");
            for (var i = 0; i < mesArray.length; i++) {
                var sp = document.createElement("span");
                sp.textContent = mesArray[i];
                this._msgWrapperElement.appendChild(sp);
                this._msgWrapperElement.appendChild(document.createElement("br"));
            }
            //            this._msgWrapperElement.textContent = this._message;
            this._element.style.left = this._x + "px";
            this._element.style.top = this._y + "px";
            this._element.style.width = this._width + "px";
            this._element.style.minHeight = this._height + "px"; // minなのでoverflowしても安心!!!
            this._dummyElement.style.display = this._isYesno ? "block" : "none";
            this._element.style.display = this._isVisible ? "block" : "none";
        };
        return MessageWindow;
    })();
    wwa_message.MessageWindow = MessageWindow;
})(wwa_message || (wwa_message = {}));
/// <reference path="./wwa_input.ts" />
/// <reference path="./wwa_cgmanager.ts" />
/// <reference path="./wwa_data.ts" />
/// <reference path="./wwa_util.ts" />
/// <reference path="./wwa_parts_player.ts" />
/// <reference path="./wwa_message.ts" />
var wwa_main;
(function (wwa_main) {
    var KeyCode = wwa_input.KeyCode;
    var KeyState = wwa_input.KeyState;
    var KeyStore = wwa_input.KeyStore;
    var MouseState = wwa_input.MouseState;
    var MouseStore = wwa_input.MouseStore;
    var CGManager = wwa_cgmanager.CGManager;
    var Consts = wwa_data.WWAConsts;
    var Coord = wwa_data.Coord;
    var Position = wwa_data.Position;
    var Camera = wwa_camera.Camera;
    var util = wwa_util;
    var wwa;
    var WWA = (function () {
        ////////////////////////
        function WWA(mapFileName, workerFileName, urlgateEnabled) {
            var _this = this;
            if (urlgateEnabled === void 0) { urlgateEnabled = false; }
            util.$id("version").textContent = Consts.VERSION_WWAJS;
            this._isURLGateEnable = urlgateEnabled;
            this._mainCallCounter = 0;
            this._animationCounter = 0;
            this._statusPressCounter = new wwa_data.Status(0, 0, 0, 0);
            var t_start = new Date().getTime();
            var loadWorker = new Worker(workerFileName + "?date=" + t_start);
            loadWorker.postMessage({ "fileName": mapFileName });
            loadWorker.addEventListener("message", function (e) {
                _this._wwaData = e.data;
                _this._restartData = JSON.parse(JSON.stringify(_this._wwaData));
                var escapedFilename = _this._wwaData.mapCGName.replace("(", "\\(").replace(")", "\\)");
                Array.prototype.forEach.call(util.$qsAll("div.item-cell"), function (node) {
                    node.style.backgroundPosition = "-40px -80px";
                    node.style.backgroundImage = "url(" + escapedFilename + ")";
                });
                Array.prototype.forEach.call(util.$qsAll("div.wide-cell-row"), function (node) {
                    node.style.backgroundPosition = "-160px -120px";
                    node.style.backgroundImage = "url(" + escapedFilename + ")";
                });
                Array.prototype.forEach.call(util.$qsAll(".item-cell>.item-disp"), function (node) {
                    node.style.backgroundImage = "url(" + escapedFilename + ")";
                    var imgel = new Image();
                    imgel.src = Consts.ITEM_BORDER_IMG_DATA_URL;
                    node.appendChild(imgel);
                    imgel.style.display = "none";
                    imgel.style.cursor = "pointer";
                });
                var iconNode_energy = util.$qsh("#disp-energy>.status-icon");
                iconNode_energy.style.backgroundPosition = "-120px -80px";
                iconNode_energy.style.backgroundImage = "url(" + escapedFilename + ")";
                var iconNode_strength = util.$qsh("#disp-strength>.status-icon");
                iconNode_strength.style.backgroundPosition = "-160px -80px";
                iconNode_strength.style.backgroundImage = "url(" + escapedFilename + ")";
                var iconNode_defence = util.$qsh("#disp-defence>.status-icon");
                iconNode_defence.style.backgroundPosition = "-200px -80px";
                iconNode_defence.style.backgroundImage = "url(" + escapedFilename + ")";
                var iconNode_gold = util.$qsh("#disp-gold>.status-icon");
                iconNode_gold.style.backgroundPosition = "-240px -80px";
                iconNode_gold.style.backgroundImage = "url(" + escapedFilename + ")";
                _this._replaceAllRandomObjects();
                var t_end = new Date().getTime();
                console.log("Loading Complete!" + (t_end - t_start) + "ms");
                _this._cvs = util.$id("wwa-map");
                _this._cvsSub = util.$id("wwa-map-sub");
                var ctx = _this._cvs.getContext("2d");
                var ctxSub = _this._cvsSub.getContext("2d");
                ctx.fillStyle = "rgba( 255, 255, 255, 0.5)";
                ctx.fillRect(0, 0, 440, 440);
                var playerPosition = new Position(_this, _this._wwaData.playerX, _this._wwaData.playerY);
                _this._camera = new Camera(playerPosition);
                var status = new wwa_data.Status(_this._wwaData.statusEnergy, _this._wwaData.statusStrength, _this._wwaData.statusDefence, _this._wwaData.statusGold);
                _this._objectMovingDataManager = new wwa_motion.ObjectMovingDataManager(_this);
                _this._player = new wwa_parts_player.Player(_this, playerPosition, _this._camera, status, _this._wwaData.statusEnergyMax);
                _this._keyStore = new KeyStore();
                _this._mouseStore = new MouseStore();
                _this._messageQueue = [];
                _this._yesNoJudge = 2 /* UNSELECTED */;
                _this._yesNoChoiceCallInfo = 0 /* NONE */;
                _this._prevFrameEventExected = false;
                window.addEventListener("keydown", function (e) {
                    _this._keyStore.setPressInfo(e.keyCode);
                    if (e.keyCode === 40 /* KEY_DOWN */ || e.keyCode === 37 /* KEY_LEFT */ || e.keyCode === 39 /* KEY_RIGHT */ || e.keyCode === 38 /* KEY_UP */ || e.keyCode === 16 /* KEY_SHIFT */ || e.keyCode === 13 /* KEY_ENTER */ || e.keyCode === 49 /* KEY_1 */ || e.keyCode === 50 /* KEY_2 */ || e.keyCode === 51 /* KEY_3 */ || e.keyCode === 65 /* KEY_A */ || e.keyCode === 67 /* KEY_C */ || e.keyCode === 68 /* KEY_D */ || e.keyCode === 69 /* KEY_E */ || e.keyCode === 77 /* KEY_M */ || e.keyCode === 78 /* KEY_N */ || e.keyCode === 81 /* KEY_Q */ || e.keyCode === 83 /* KEY_S */ || e.keyCode === 87 /* KEY_W */ || e.keyCode === 88 /* KEY_X */ || e.keyCode === 89 /* KEY_Y */ || e.keyCode === 90 /* KEY_Z */ || e.keyCode === 27 /* KEY_ESC */ || e.keyCode === 112 /* KEY_F1 */ || e.keyCode === 114 /* KEY_F3 */ || e.keyCode === 115 /* KEY_F4 */ || e.keyCode === 116 /* KEY_F5 */ || e.keyCode === 117 /* KEY_F6 */ || e.keyCode === 118 /* KEY_F7 */ || e.keyCode === 119 /* KEY_F8 */ || e.keyCode === 123 /* KEY_F12 */ || e.keyCode === 32 /* KEY_SPACE */) {
                        e.preventDefault();
                    }
                });
                window.addEventListener("keyup", function (e) {
                    _this._keyStore.setReleaseInfo(e.keyCode);
                    if (e.keyCode === 40 /* KEY_DOWN */ || e.keyCode === 37 /* KEY_LEFT */ || e.keyCode === 39 /* KEY_RIGHT */ || e.keyCode === 38 /* KEY_UP */ || e.keyCode === 16 /* KEY_SHIFT */ || e.keyCode === 13 /* KEY_ENTER */ || e.keyCode === 49 /* KEY_1 */ || e.keyCode === 50 /* KEY_2 */ || e.keyCode === 51 /* KEY_3 */ || e.keyCode === 65 /* KEY_A */ || e.keyCode === 67 /* KEY_C */ || e.keyCode === 68 /* KEY_D */ || e.keyCode === 69 /* KEY_E */ || e.keyCode === 77 /* KEY_M */ || e.keyCode === 78 /* KEY_N */ || e.keyCode === 81 /* KEY_Q */ || e.keyCode === 83 /* KEY_S */ || e.keyCode === 87 /* KEY_W */ || e.keyCode === 88 /* KEY_X */ || e.keyCode === 89 /* KEY_Y */ || e.keyCode === 90 /* KEY_Z */ || e.keyCode === 27 /* KEY_ESC */ || e.keyCode === 112 /* KEY_F1 */ || e.keyCode === 114 /* KEY_F3 */ || e.keyCode === 115 /* KEY_F4 */ || e.keyCode === 116 /* KEY_F5 */ || e.keyCode === 117 /* KEY_F6 */ || e.keyCode === 118 /* KEY_F7 */ || e.keyCode === 119 /* KEY_F8 */ || e.keyCode === 123 /* KEY_F12 */ || e.keyCode === 32 /* KEY_SPACE */) {
                        e.preventDefault();
                    }
                });
                ;
                window.addEventListener("blur", function (e) {
                    _this._keyStore.allClear();
                    _this._mouseStore.clear();
                });
                window.addEventListener("contextmenu", function (e) {
                    _this._keyStore.allClear();
                    _this._mouseStore.clear();
                });
                // IEのF1キー対策
                window.addEventListener("help", function (e) {
                    e.preventDefault();
                });
                _this._wwaWrapperElement = (wwa_util.$id("wwa-wrapper"));
                _this._mouseControllerElement = (wwa_util.$id("wwa-controller"));
                _this._mouseControllerElement.addEventListener("mousedown", function (e) {
                    if (e.which === 1) {
                        var mousePos = wwa_util.$localPos(e.clientX, e.clientY);
                        var playerPos = _this._player.getDrawingCenterPosition();
                        var dist = mousePos.substract(playerPos);
                        var dx = Math.abs(dist.x);
                        var dy = Math.abs(dist.y);
                        var dir;
                        if (dist.y > 0 && dy > dx) {
                            dir = 2 /* DOWN */;
                        }
                        else if (dist.y < 0 && dy > dx) {
                            dir = 3 /* UP */;
                        }
                        else if (dist.x > 0 && dy < dx) {
                            dir = 1 /* RIGHT */;
                        }
                        else if (dist.x < 0 && dy < dx) {
                            dir = 0 /* LEFT */;
                        }
                        _this._mouseStore.setPressInfo(dir);
                        e.preventDefault();
                    }
                });
                _this._mouseControllerElement.addEventListener("mouseleave", function (e) {
                    _this._mouseStore.clear();
                });
                _this._mouseControllerElement.addEventListener("mouseup", function (e) {
                    if (e.which === 1) {
                        _this._mouseStore.setReleaseInfo();
                        e.preventDefault();
                    }
                });
                util.$id("button-load").addEventListener("click", function () {
                    if (_this._player.isControllable()) {
                        _this.onselectbutton(0 /* QUICK_LOAD */);
                    }
                });
                util.$id("button-save").addEventListener("click", function () {
                    if (_this._player.isControllable()) {
                        _this.onselectbutton(1 /* QUICK_SAVE */);
                    }
                });
                util.$id("button-restart").addEventListener("click", function () {
                    if (_this._player.isControllable()) {
                        _this.onselectbutton(2 /* RESTART_GAME */);
                    }
                });
                util.$id("button-gotowwa").addEventListener("click", function () {
                    if (_this._player.isControllable()) {
                        _this.onselectbutton(3 /* GOTO_WWA */);
                    }
                });
                Array.prototype.forEach.call(util.$qsAll(".wide-cell-row"), function (node) {
                    node.addEventListener("click", function () {
                        _this._displayHelp();
                    });
                });
                _this._battleEstimateWindow = new wwa_estimate_battle.BattleEstimateWindow(_this, _this._wwaData.mapCGName, wwa_util.$id("aawwa-wrapper"));
                _this._cgManager = new CGManager(ctx, ctxSub, _this._wwaData.mapCGName, function () {
                    util.$id("wwa-cover").style.opacity = "0";
                    _this._messageWindow = new wwa_message.MessageWindow(_this, 50, 180, 340, 75, "", _this._wwaData.mapCGName, false, true, util.$id("aawwa-wrapper"));
                    _this._monsterWindow = new wwa_message.MosterWindow(_this, new Coord(50, 180), 340, 60, false, util.$id("aawwa-wrapper"), _this._wwaData.mapCGName);
                    _this._scoreWindow = new wwa_message.ScoreWindow(_this, new Coord(50, 50), false, util.$id("aawwa-wrapper"));
                    setTimeout(function () {
                        util.$id("wwa-wrapper").removeChild(util.$id("wwa-cover"));
                        // TODO: これが表示終わるまでプレイヤーをcontrollableにしない
                    }, Consts.SPLASH_SCREEN_DISP_FRAME_NUM);
                    setTimeout(_this.mainCaller, Consts.DEFAULT_FRAME_INTERVAL, _this);
                });
            });
        }
        /**
          何でこんなことしてるの?
           setTimeout で関数を呼んだ時, this が window になることを防ぐため!
        */
        WWA.prototype.mainCaller = function (self) {
            self._main();
        };
        WWA.prototype.onselectitem = function (itemPos) {
            if (this._player.canUseItem(itemPos)) {
                var bg = (wwa_util.$id("item" + (itemPos - 1)));
                bg.classList.add("onpress");
                this.setMessageQueue(this._wwaData.message[8 /* USE_ITEM */] === "" ? "このアイテムを使用します。\nよろしいですか?" : this._wwaData.message[8 /* USE_ITEM */], true);
                this._yesNoChoiceCallInfo = 3 /* CALL_BY_ITEM_USE */;
                this._yesNoUseItemPos = itemPos;
            }
        };
        WWA.prototype.onselectbutton = function (button) {
            var bg = (wwa_util.$id(wwa_data.sidebarButtonCellElementID[button]));
            bg.classList.add("onpress");
            if (button === 0 /* QUICK_LOAD */) {
                if (this._quickSaveData !== void 0) {
                    this.setMessageQueue("データを読み込みますか？\n※パスワードロードは、現在ご利用になれません。", true);
                    this._yesNoChoiceCallInfo = 5 /* CALL_BY_QUICK_LOAD */;
                }
                else {
                    this.setMessageQueue("セーブデータがありません。\n※パスワードロードは、現在ご利用になれません。", false);
                }
            }
            else if (button === 1 /* QUICK_SAVE */) {
                this.setMessageQueue("データの一時保存をします。\nよろしいですか？\n※パスワードセーブは、現在ご利用になれません。", true);
                this._yesNoChoiceCallInfo = 4 /* CALL_BY_QUICK_SAVE */;
            }
            else if (button === 2 /* RESTART_GAME */) {
                this.setMessageQueue("初めからスタートしなおしますか？", true);
                this._yesNoChoiceCallInfo = 6 /* CALL_BY_RESTART_GAME */;
            }
            else if (button === 3 /* GOTO_WWA */) {
                this.setMessageQueue("ＷＷＡの公式サイトを開きますか？", true);
                this._yesNoChoiceCallInfo = 7 /* CALL_BY_GOTO_WWA */;
            }
        };
        WWA.prototype._main = function () {
            var _this = this;
            this._waitTimeInCurrentFrame = Consts.DEFAULT_FRAME_INTERVAL;
            this._stopUpdateByLoadFlag = false;
            // キー情報のアップデート
            this._keyStore.update();
            this._mouseStore.update();
            // メッセージウィンドウによる入力割り込みが発生した時
            if (this._yesNoJudgeInNextFrame !== void 0) {
                this._yesNoJudge = this._yesNoJudgeInNextFrame;
                this._yesNoJudgeInNextFrame = void 0;
            }
            // キー入力とプレイヤー移動
            ////////////// DEBUG IMPLEMENTATION //////////////////////
            /////// 本番では必ず消すこと /////////////////////////////
            this.debug = this._keyStore.checkHitKey(16 /* KEY_SHIFT */);
            //////////////////////////////////////////////////////////
            var prevPosition = this._player.getPosition();
            if (this._player.isControllable()) {
                if (this._keyStore.checkHitKey(37 /* KEY_LEFT */) || this._mouseStore.checkClickMouse(0 /* LEFT */)) {
                    this._player.controll(0 /* LEFT */);
                    this._objectMovingDataManager.update();
                }
                else if (this._keyStore.checkHitKey(38 /* KEY_UP */) || this._mouseStore.checkClickMouse(3 /* UP */)) {
                    this._player.controll(3 /* UP */);
                    this._objectMovingDataManager.update();
                }
                else if (this._keyStore.checkHitKey(39 /* KEY_RIGHT */) || this._mouseStore.checkClickMouse(1 /* RIGHT */)) {
                    this._player.controll(1 /* RIGHT */);
                    this._objectMovingDataManager.update();
                }
                else if (this._keyStore.checkHitKey(40 /* KEY_DOWN */) || this._mouseStore.checkClickMouse(2 /* DOWN */)) {
                    this._player.controll(2 /* DOWN */);
                    this._objectMovingDataManager.update();
                }
                else if (this._keyStore.checkHitKey(49 /* KEY_1 */)) {
                    this.onselectitem(1);
                }
                else if (this._keyStore.checkHitKey(50 /* KEY_2 */)) {
                    this.onselectitem(2);
                }
                else if (this._keyStore.checkHitKey(51 /* KEY_3 */)) {
                    this.onselectitem(3);
                }
                else if (this._keyStore.checkHitKey(81 /* KEY_Q */)) {
                    this.onselectitem(4);
                }
                else if (this._keyStore.checkHitKey(87 /* KEY_W */)) {
                    this.onselectitem(5);
                }
                else if (this._keyStore.checkHitKey(69 /* KEY_E */)) {
                    this.onselectitem(6);
                }
                else if (this._keyStore.checkHitKey(65 /* KEY_A */)) {
                    this.onselectitem(7);
                }
                else if (this._keyStore.checkHitKey(83 /* KEY_S */)) {
                    this.onselectitem(8);
                }
                else if (this._keyStore.checkHitKey(68 /* KEY_D */)) {
                    this.onselectitem(9);
                }
                else if (this._keyStore.checkHitKey(90 /* KEY_Z */)) {
                    this.onselectitem(10);
                }
                else if (this._keyStore.checkHitKey(88 /* KEY_X */)) {
                    this.onselectitem(11);
                }
                else if (this._keyStore.checkHitKey(67 /* KEY_C */)) {
                    this.onselectitem(12);
                }
                else if (this._keyStore.checkHitKey(112 /* KEY_F1 */) || this._keyStore.checkHitKey(77 /* KEY_M */)) {
                    // 戦闘結果予測 
                    if (this.launchBattleEstimateWindow()) {
                    }
                }
                else if (this._keyStore.checkHitKey(114 /* KEY_F3 */)) {
                }
                else if (this._keyStore.checkHitKey(115 /* KEY_F4 */)) {
                }
                else if (this._keyStore.checkHitKey(116 /* KEY_F5 */)) {
                    this.onselectbutton(0 /* QUICK_LOAD */);
                }
                else if (this._keyStore.checkHitKey(117 /* KEY_F6 */)) {
                    this.onselectbutton(1 /* QUICK_SAVE */);
                }
                else if (this._keyStore.checkHitKey(118 /* KEY_F7 */)) {
                    this.onselectbutton(2 /* RESTART_GAME */);
                }
                else if (this._keyStore.checkHitKey(119 /* KEY_F8 */)) {
                    this.onselectbutton(3 /* GOTO_WWA */);
                }
                else if (this._keyStore.checkHitKey(123 /* KEY_F12 */)) {
                    // コマンドのヘルプ 
                    this._displayHelp();
                }
            }
            else if (this._player.isJumped()) {
                if (!this._camera.isResetting()) {
                    this._player.processAfterJump();
                }
            }
            else if (this._player.isMoving()) {
                this._player.move();
                this._objectMovingDataManager.update();
            }
            else if (this._player.isWaitingMessage()) {
                if (!this._messageWindow.isVisible()) {
                    this._messageWindow.show();
                }
                if (!this._messageWindow.isYesNoChoice()) {
                    if (this._keyStore.getKeyState(13 /* KEY_ENTER */) === 1 /* KEYDOWN */ || this._keyStore.getKeyState(32 /* KEY_SPACE */) === 1 /* KEYDOWN */ || this._mouseStore.getMouseState() === 1 /* MOUSEDOWN */) {
                        for (var i = 0; i < wwa_data.sidebarButtonCellElementID.length; i++) {
                            var elm = (wwa_util.$id(wwa_data.sidebarButtonCellElementID[i]));
                            if (elm.classList.contains("onpress")) {
                                elm.classList.remove("onpress");
                            }
                        }
                        if (this._scoreWindow.isVisible()) {
                            this._scoreWindow.hide();
                        }
                        if (this._messageQueue.length === 0) {
                            if (this._player.isReadyToUseItem()) {
                                this._player.useItem();
                            }
                            this._messageWindow.hide();
                            this._mouseStore.clear();
                            this._player.clearMessageWaiting();
                        }
                        else {
                            this._messageWindow.setMessage(this._messageQueue.shift());
                        }
                    }
                }
                else {
                    if (!this._messageWindow.isInputDisable()) {
                        if (this._yesNoJudge === 2 /* UNSELECTED */) {
                            if (this._keyStore.getKeyState(13 /* KEY_ENTER */) === 1 /* KEYDOWN */ || this._keyStore.getKeyState(89 /* KEY_Y */) === 1 /* KEYDOWN */) {
                                this._yesNoJudge = 0 /* YES */;
                            }
                            else if (this._keyStore.getKeyState(78 /* KEY_N */) === 1 /* KEYDOWN */ || this._keyStore.getKeyState(27 /* KEY_ESC */) === 1 /* KEYDOWN */) {
                                this._yesNoJudge = 1 /* NO */;
                            }
                        }
                        if (this._yesNoJudge === 0 /* YES */) {
                            this._yesNoDispCounter = Consts.YESNO_PRESS_DISP_FRAME_NUM;
                            this._messageWindow.setInputDisable();
                            this._messageWindow.update();
                        }
                        else if (this._yesNoJudge === 1 /* NO */) {
                            this._yesNoDispCounter = Consts.YESNO_PRESS_DISP_FRAME_NUM;
                            this._messageWindow.setInputDisable();
                            this._messageWindow.update();
                        }
                    }
                }
            }
            else if (this._player.isWatingEstimateWindow()) {
                if (this._keyStore.getKeyState(13 /* KEY_ENTER */) === 1 /* KEYDOWN */ || this._keyStore.getKeyState(32 /* KEY_SPACE */) === 1 /* KEYDOWN */) {
                    this.hideBattleEstimateWindow();
                }
            }
            else if (this._player.isFighting()) {
                this._player.fight();
                this._monsterWindow.update(this._monster);
            }
            if (this._player.isPartsAppearedTime()) {
                this._player.clearPartsAppearedFlag();
            }
            var p = this._player.getPosition().getPartsCoord();
            var o = this._player.getPosition().getOffsetCoord();
            this._prevFrameEventExected = false;
            if (this._player.getPosition().isJustPosition() && this._camera.getPosition().isScreenTopPosition()) {
                if (!this._player.isJumped() && !this._player.isWaitingMessage()) {
                    // ランダムパーツのまま残っている画面内のパーツを全置換(したい)
                    this._replaceRandomObjectsInScreen();
                    // 当該座標の背景パーツ判定
                    var eventExecuted = this.checkMap();
                    if (!eventExecuted) {
                        // 当該座標の物体パーツ判定
                        this.checkObject();
                    }
                    this._prevFrameEventExected = eventExecuted;
                }
                // 選択系イベント( 物の売買, 二者択一 )の処理
                if (this._player.isWaitingMessage() && this._messageWindow.isYesNoChoice() && this._yesNoJudge !== 2 /* UNSELECTED */) {
                    this._execChoiceWindowRunningEvent();
                }
            }
            // draw
            this._drawAll();
            this._drawAA();
            this._mainCallCounter++;
            this._animationCounter = (this._animationCounter + 1) % (Consts.ANIMATION_REP_HALF_FRAME * 2);
            if (this._camera.isResetting()) {
                this._camera.advanceTransitionStepNum();
            }
            if (!this._player.isWaitingMessage()) {
                if (this._statusPressCounter.energy > 0 && --this._statusPressCounter.energy === 0) {
                    wwa_util.$id("disp-energy").classList.remove("onpress");
                }
                if (this._statusPressCounter.strength > 0 && --this._statusPressCounter.strength === 0) {
                    wwa_util.$id("disp-strength").classList.remove("onpress");
                }
                if (this._statusPressCounter.defence > 0 && --this._statusPressCounter.defence === 0) {
                    wwa_util.$id("disp-defence").classList.remove("onpress");
                }
                if (this._statusPressCounter.gold > 0 && --this._statusPressCounter.gold === 0) {
                    wwa_util.$id("disp-gold").classList.remove("onpress");
                }
            }
            if (!this._stopUpdateByLoadFlag) {
                setTimeout(this.mainCaller, this._waitTimeInCurrentFrame, this);
            }
            else {
                this._fadeout(function () {
                    if (_this._loadType === 0 /* QUICK_LOAD */) {
                        _this._quickLoad();
                    }
                    else if (_this._loadType === 1 /* RESTART_GAME */) {
                        _this._restartGame();
                    }
                    setTimeout(_this.mainCaller, _this._waitTimeInCurrentFrame, _this);
                });
            }
        };
        WWA.prototype._drawAll = function () {
            var cpParts = this._camera.getPosition().getPartsCoord();
            var cpOffset = this._camera.getPosition().getOffsetCoord();
            var yLimit = Consts.MAP_WINDOW_HEIGHT;
            var targetX;
            var targetY;
            var ppos = this._player.getPosition().getPartsCoord();
            this._cgManager.clearCanvas(0, 0, Consts.MAP_WINDOW_WIDTH, Consts.MAP_WINDOW_HEIGHT);
            this._cgManager.drawBase(0, 0, Consts.MAP_WINDOW_WIDTH, Consts.MAP_WINDOW_HEIGHT);
            if (this._camera.isResetting()) {
                if (this._camera.getPreviousPosition() !== null) {
                    var cpPartsPrev = this._camera.getPreviousPosition().getPartsCoord();
                    var cpOffsetPrev = this._camera.getPreviousPosition().getOffsetCoord();
                }
                yLimit = this._camera.getTransitionStepNum() * Consts.CHIP_SIZE;
                this._drawMap(cpPartsPrev, cpOffsetPrev, yLimit, true);
                this._drawPlayer(cpPartsPrev, cpOffsetPrev, yLimit, true);
                this._drawObjects(cpPartsPrev, cpOffsetPrev, yLimit, true);
                if (this._camera.isFinalStep()) {
                    var opacity = 255;
                    var timer = setInterval(function () {
                        var elm = wwa_util.$id("wwa-fader");
                        opacity -= Consts.FADEOUT_SPEED * 3;
                        if (opacity <= 0) {
                            clearInterval(timer);
                            elm.style.backgroundColor = "transparent";
                            elm.removeAttribute("style");
                            elm.style.display = "none";
                            return;
                        }
                        elm.style.opacity = (opacity / 255) + "";
                    }, 20);
                }
            }
            this._drawMap(cpParts, cpOffset, yLimit);
            this._drawPlayer(cpParts, cpOffset, yLimit);
            this._drawObjects(cpParts, cpOffset, yLimit);
            // 攻撃エフェクト描画
            if (this._player.isFighting()) {
                targetX = this._player.isTurn() ? this._monster.position.x : ppos.x;
                targetY = this._player.isTurn() ? this._monster.position.y : ppos.y;
                this._cgManager.drawCanvas(3, 3, Consts.CHIP_SIZE * (targetX - cpParts.x) - cpOffset.x, Consts.CHIP_SIZE * (targetY - cpParts.y) - cpOffset.y, false);
            }
            this._drawFrame();
        };
        // 背景描画
        WWA.prototype._drawMap = function (cpParts, cpOffset, yLimit, isPrevCamera) {
            if (isPrevCamera === void 0) { isPrevCamera = false; }
            if (cpParts === void 0) {
                return;
            }
            var xLeft = Math.max(0, cpParts.x - 1);
            var xRight = Math.min(this._wwaData.mapWidth - 1, cpParts.x + Consts.H_PARTS_NUM_IN_WINDOW);
            var yTop = Math.max(0, cpParts.y - 1);
            var yBottom = Math.min(this._wwaData.mapWidth - 1, cpParts.y + Consts.V_PARTS_NUM_IN_WINDOW);
            for (var x = xLeft; x <= xRight; x++) {
                for (var y = yTop; y <= yBottom; y++) {
                    var partsID = this._wwaData.map[y][x];
                    var ppx = this._wwaData.mapAttribute[partsID][Consts.ATR_X] / Consts.CHIP_SIZE;
                    var ppy = this._wwaData.mapAttribute[partsID][Consts.ATR_Y] / Consts.CHIP_SIZE;
                    var canvasX = Consts.CHIP_SIZE * (x - cpParts.x) - cpOffset.x;
                    var canvasY = Consts.CHIP_SIZE * (y - cpParts.y) - cpOffset.y;
                    if (isPrevCamera) {
                        this._cgManager.drawCanvasWithLowerYLimit(ppx, ppy, canvasX, canvasY, yLimit);
                    }
                    else {
                        this._cgManager.drawCanvasWithUpperYLimit(ppx, ppy, canvasX, canvasY, yLimit);
                    }
                }
            }
        };
        // プレイヤー描画
        WWA.prototype._drawPlayer = function (cpParts, cpOffset, yLimit, isPrevCamera) {
            if (isPrevCamera === void 0) { isPrevCamera = false; }
            if (cpParts === void 0) {
                return;
            }
            var pos = this._player.getPosition().getPartsCoord();
            var poso = this._player.getPosition().getOffsetCoord();
            var pcrop = wwa_data.dirToPos[this._player.getDir()];
            var canvasX = (pos.x - cpParts.x) * Consts.CHIP_SIZE + poso.x - cpOffset.x;
            var canvasY = (pos.y - cpParts.y) * Consts.CHIP_SIZE + poso.y - cpOffset.y;
            if (isPrevCamera) {
                this._cgManager.drawCanvasWithLowerYLimit(pcrop, 0, canvasX, canvasY, yLimit);
            }
            else {
                this._cgManager.drawCanvasWithUpperYLimit(pcrop, 0, canvasX, canvasY, yLimit);
            }
        };
        // 物体描画
        WWA.prototype._drawObjects = function (cpParts, cpOffset, yLimit, isPrevCamera) {
            if (isPrevCamera === void 0) { isPrevCamera = false; }
            if (cpParts === void 0) {
                return;
            }
            var xLeft = Math.max(0, cpParts.x - 1);
            var xRight = Math.min(this._wwaData.mapWidth - 1, cpParts.x + Consts.H_PARTS_NUM_IN_WINDOW);
            var yTop = Math.max(0, cpParts.y - 1);
            var yBottom = Math.min(this._wwaData.mapWidth - 1, cpParts.y + Consts.V_PARTS_NUM_IN_WINDOW);
            var offset;
            for (var x = xLeft; x <= xRight; x++) {
                for (var y = yTop; y <= yBottom; y++) {
                    if (this._player.isFighting() && this._player.isTurn() && this._player.getPosition().getPartsCoord().equals(this._monster.position) && new wwa_data.Coord(x, y).equals(this._monster.position)) {
                        continue;
                    }
                    var partsIDObj = this._wwaData.mapObject[y][x];
                    offset = new Coord(0, 0);
                    if (this._wwaData.objectAttribute[partsIDObj][Consts.ATR_MOVE] !== 0 /* STATIC */) {
                        var result = this._objectMovingDataManager.getOffsetByBeforePartsCoord(new Coord(x, y));
                        if (result !== null) {
                            offset = result;
                        }
                    }
                    var imgType = (this._animationCounter > Consts.ANIMATION_REP_HALF_FRAME || this._wwaData.objectAttribute[partsIDObj][Consts.ATR_X2] === 0 && this._wwaData.objectAttribute[partsIDObj][Consts.ATR_Y2] === 0);
                    var ppxo = this._wwaData.objectAttribute[partsIDObj][imgType ? Consts.ATR_X : Consts.ATR_X2] / Consts.CHIP_SIZE;
                    var ppyo = this._wwaData.objectAttribute[partsIDObj][imgType ? Consts.ATR_Y : Consts.ATR_Y2] / Consts.CHIP_SIZE;
                    var canvasX = Consts.CHIP_SIZE * (x - cpParts.x) + offset.x - cpOffset.x;
                    var canvasY = Consts.CHIP_SIZE * (y - cpParts.y) + offset.y - cpOffset.y;
                    var type = this._wwaData.objectAttribute[partsIDObj][Consts.ATR_TYPE];
                    var num = this._wwaData.objectAttribute[partsIDObj][Consts.ATR_NUMBER];
                    if (partsIDObj !== 0 && !this._checkNoDrawObject(new Coord(x, y), type, num)) {
                        if (isPrevCamera) {
                            this._cgManager.drawCanvasWithLowerYLimit(ppxo, ppyo, canvasX, canvasY, yLimit);
                        }
                        else {
                            this._cgManager.drawCanvasWithUpperYLimit(ppxo, ppyo, canvasX, canvasY, yLimit);
                        }
                    }
                }
            }
        };
        WWA.prototype._drawFrame = function () {
            // 左上端
            this._cgManager.drawCanvas(0, 1, 0, 0, false);
            // 右上端
            this._cgManager.drawCanvas(2, 1, Consts.MAP_WINDOW_WIDTH - Consts.CHIP_SIZE, 0, false);
            // 左下端
            this._cgManager.drawCanvas(0, 3, 0, Consts.MAP_WINDOW_HEIGHT - Consts.CHIP_SIZE, false);
            // 右下端
            this._cgManager.drawCanvas(2, 3, Consts.MAP_WINDOW_WIDTH - Consts.CHIP_SIZE, Consts.MAP_WINDOW_HEIGHT - Consts.CHIP_SIZE, false);
            for (var i = 1; i < Consts.H_PARTS_NUM_IN_WINDOW - 1; i++) {
                // 上
                this._cgManager.drawCanvas(1, 1, Consts.CHIP_SIZE * i, 0, false);
                // 下
                this._cgManager.drawCanvas(1, 3, Consts.CHIP_SIZE * i, Consts.MAP_WINDOW_HEIGHT - Consts.CHIP_SIZE, false);
            }
            for (var i = 1; i < Consts.V_PARTS_NUM_IN_WINDOW - 1; i++) {
                // 左
                this._cgManager.drawCanvas(0, 2, 0, Consts.CHIP_SIZE * i, false);
                // 右
                this._cgManager.drawCanvas(2, 2, Consts.MAP_WINDOW_WIDTH - Consts.CHIP_SIZE, Consts.CHIP_SIZE * i, false);
            }
        };
        WWA.prototype._checkNoDrawObject = function (objCoord, objType, atrNumber) {
            var pPos = this._player.getPosition();
            var pCoord = pPos.getPartsCoord();
            if (!pPos.isJustPosition() || pCoord.x !== objCoord.x || pCoord.y !== objCoord.y) {
                return false;
            }
            if (objType === Consts.OBJECT_DOOR && atrNumber === 0) {
                return true;
            }
            return (objType === Consts.OBJECT_STATUS || objType === Consts.OBJECT_MESSAGE || objType === Consts.OBJECT_ITEM || objType === Consts.OBJECT_SELL || objType === Consts.OBJECT_BUY || objType === Consts.OBJECT_SELL || objType === Consts.OBJECT_LOCALGATE);
        };
        WWA.prototype.getMapWidth = function () {
            if (this._wwaData === void 0) {
                throw new Error("マップデータがロードされていません");
            }
            return this._wwaData.mapWidth;
        };
        WWA.prototype.getMapIdByPosition = function (pos) {
            var pc = pos.getPartsCoord();
            return this._wwaData.map[pc.y][pc.x];
        };
        WWA.prototype.getObjectIdByPosition = function (pos) {
            var pc = pos.getPartsCoord();
            return this._wwaData.mapObject[pc.y][pc.x];
        };
        WWA.prototype.getMapTypeByPosition = function (pos) {
            var pc = pos.getPartsCoord();
            var pid = this._wwaData.map[pc.y][pc.x];
            return this._wwaData.mapAttribute[pid][Consts.ATR_TYPE];
        };
        WWA.prototype.getObjectTypeByPosition = function (pos) {
            var pc = pos.getPartsCoord();
            var pid = this._wwaData.mapObject[pc.y][pc.x];
            return this._wwaData.objectAttribute[pid][Consts.ATR_TYPE];
        };
        WWA.prototype.getMapAttributeByPosition = function (pos, attr) {
            var pc = pos.getPartsCoord();
            var pid = this._wwaData.map[pc.y][pc.x];
            return this._wwaData.mapAttribute[pid][attr];
        };
        WWA.prototype.isCurrentPosMapPartsIncludingMessage = function (pos) {
            var mesid = this.getMapAttributeByPosition(pos, Consts.ATR_STRING);
            return mesid !== 0;
        };
        WWA.prototype.getObjectAttributeByPosition = function (pos, attr) {
            var pc = pos.getPartsCoord();
            var pid = this._wwaData.mapObject[pc.y][pc.x];
            return this._wwaData.objectAttribute[pid][attr];
        };
        WWA.prototype.getMapAttributeById = function (id, attr) {
            return this._wwaData.mapAttribute[id][attr];
        };
        WWA.prototype.getObjectAttributeById = function (id, attr) {
            return this._wwaData.objectAttribute[id][attr];
        };
        WWA.prototype.getObjectCropXById = function (id) {
            return this._wwaData.objectAttribute[id][Consts.ATR_X];
        };
        WWA.prototype.getObjectCropYById = function (id) {
            return this._wwaData.objectAttribute[id][Consts.ATR_Y];
        };
        WWA.prototype.getMessageById = function (messageID) {
            return this._wwaData.message[messageID];
        };
        WWA.prototype.getSystemMessageById = function (messageID) {
            return this._wwaData.systemMessage[messageID];
        };
        // 背景パーツ判定
        WWA.prototype.checkMap = function (pos) {
            var playerPos = this._player.getPosition().getPartsCoord();
            pos = (pos !== void 0 && pos !== null) ? pos : playerPos;
            var partsID = this._wwaData.map[pos.y][pos.x];
            var mapAttr = this._wwaData.mapAttribute[partsID][Consts.ATR_TYPE];
            var isPlayerPositionExec = (pos.x === playerPos.x && pos.y === playerPos.y);
            var eventExecuted = false;
            if (isPlayerPositionExec) {
                if (this._player.getLastExecPartsIDOnSamePosition(1 /* MAP */) === partsID) {
                    return false;
                }
            }
            // 道
            if (mapAttr === Consts.MAP_STREET) {
                eventExecuted = this._execMapStreetEvent(pos, partsID, mapAttr);
            }
            else if (mapAttr === Consts.MAP_WALL) {
                eventExecuted = this._execMapWallEvent(pos, partsID, mapAttr);
            }
            else if (mapAttr === Consts.MAP_LOCALGATE) {
                eventExecuted = this._execMapLocalGateEvent(pos, partsID, mapAttr);
            }
            else if (mapAttr === Consts.MAP_URLGATE) {
                eventExecuted = this._execMapUrlGateEvent(pos, partsID, mapAttr);
            }
            if (isPlayerPositionExec && !this._player.isJumped()) {
                this._player.setLastExecInfoOnSamePosition(1 /* MAP */, partsID);
            }
            return eventExecuted;
        };
        // 物体パーツ判定
        WWA.prototype.checkObject = function (pos) {
            var playerPos = this._player.getPosition().getPartsCoord();
            pos = (pos !== void 0 && pos !== null) ? pos : playerPos;
            var partsID = this._wwaData.mapObject[pos.y][pos.x];
            var objAttr = this._wwaData.objectAttribute[partsID][Consts.ATR_TYPE];
            var isPlayerPositionExec = (pos.x === playerPos.x && pos.y === playerPos.y);
            if (isPlayerPositionExec) {
                if (this._player.getLastExecPartsIDOnSamePosition(0 /* OBJECT */) === partsID) {
                    return;
                }
            }
            // 通常物体
            if (objAttr === Consts.OBJECT_NORMAL) {
                this._execObjectNormalEvent(pos, partsID, objAttr);
            }
            else if (objAttr === Consts.OBJECT_MESSAGE) {
                this._execObjectMessageEvent(pos, partsID, objAttr);
            }
            else if (objAttr === Consts.OBJECT_MONSTER) {
                this._execObjectMonsterEvent(pos, partsID, objAttr);
            }
            else if (objAttr === Consts.OBJECT_ITEM) {
                this._execObjectItemEvent(pos, partsID, objAttr);
            }
            else if (objAttr === Consts.OBJECT_DOOR) {
                this._execObjectDoorEvent(pos, partsID, objAttr);
            }
            else if (objAttr === Consts.OBJECT_STATUS) {
                this._execObjectStatusEvent(pos, partsID, objAttr);
            }
            else if (objAttr === Consts.OBJECT_BUY) {
                this._execObjectBuyEvent(pos, partsID, objAttr);
            }
            else if (objAttr === Consts.OBJECT_SELL) {
                this._execObjectSellEvent(pos, partsID, objAttr);
            }
            else if (objAttr === Consts.OBJECT_URLGATE) {
                this._execObjectUrlGateEvent(pos, partsID, objAttr);
            }
            else if (objAttr === Consts.OBJECT_SCORE) {
                this._execObjectScoreEvent(pos, partsID, objAttr);
            }
            else if (objAttr === Consts.OBJECT_SELECT) {
                this._execObjectYesNoChoiceEvent(pos, partsID, objAttr);
            }
            else if (objAttr === Consts.OBJECT_LOCALGATE) {
                this._execObjectLocalGateEvent(pos, partsID, objAttr);
            }
            if (isPlayerPositionExec && !this._player.isJumped()) {
                this._player.setLastExecInfoOnSamePosition(0 /* OBJECT */, partsID);
            }
        };
        WWA.prototype._execMapStreetEvent = function (pos, partsID, mapAttr) {
            var itemID = this._wwaData.mapAttribute[partsID][Consts.ATR_ITEM];
            if (itemID !== 0 && !this._player.hasItem(itemID)) {
                return false;
            }
            this.appearParts(pos, 0 /* MAP */);
            var messageID = this._wwaData.mapAttribute[partsID][Consts.ATR_STRING];
            var message = this._wwaData.message[messageID];
            // 待ち時間
            this._waitTimeInCurrentFrame += this._wwaData.mapAttribute[partsID][Consts.ATR_NUMBER] * 100;
            this.setMessageQueue(message);
            return messageID !== 0;
        };
        WWA.prototype._execMapWallEvent = function (pos, partsID, mapAttr) {
            this.appearParts(pos, 0 /* MAP */);
            var messageID = this._wwaData.mapAttribute[partsID][Consts.ATR_STRING];
            var message = this._wwaData.message[messageID];
            this.setMessageQueue(message);
            return false;
        };
        WWA.prototype._execMapLocalGateEvent = function (pos, partsID, mapAttr) {
            // TODO: ジャンプ後のプレイヤーの向き 物体との処理共通化
            var jx = this._wwaData.mapAttribute[partsID][Consts.ATR_JUMP_X];
            var jy = this._wwaData.mapAttribute[partsID][Consts.ATR_JUMP_Y];
            if (jx > Consts.RELATIVE_COORD_LOWER) {
                jx = pos.x + jx - Consts.RELATIVE_COORD_BIAS;
            }
            if (jy > Consts.RELATIVE_COORD_LOWER) {
                jy = pos.y + jy - Consts.RELATIVE_COORD_BIAS;
            }
            this.appearParts(pos, 0 /* MAP */);
            if (0 <= jx && 0 <= jy && jx < this._wwaData.mapWidth && jy < this._wwaData.mapWidth) {
                this._player.jumpTo(new Position(this, jx, jy, 0, 0));
            }
            return true;
        };
        WWA.prototype._execMapUrlGateEvent = function (pos, partsID, mapAttr) {
            var messageID = this._wwaData.mapAttribute[partsID][Consts.ATR_STRING];
            if (!this._isURLGateEnable) {
                return true;
            }
            this.setMessageQueue(this._wwaData.message[5 /* ASK_LINK */] === "" ? "他のページにリンクします。\nよろしいですか？" : this._wwaData.message[5 /* ASK_LINK */], true);
            this._yesNoChoicePartsCoord = pos;
            this._yesNoChoicePartsID = partsID;
            this._yesNoChoiceCallInfo = 1 /* CALL_BY_MAP_PARTS */;
            this._yesNoURL = this._wwaData.message[messageID].split(/\s/g)[0];
            return true;
        };
        WWA.prototype._execObjectNormalEvent = function (pos, partsID, objAttr) {
            // 何もしない
        };
        WWA.prototype._execObjectMessageEvent = function (pos, partsID, objAttr) {
            var messageID = this._wwaData.objectAttribute[partsID][Consts.ATR_STRING];
            var message = this._wwaData.message[messageID];
            var playerPos = this._player.getPosition().getPartsCoord();
            this.setMessageQueue(message);
            // プレイヤー座標と同一なら削除（踏み潰し判定）
            if (pos.x === playerPos.x && pos.y === playerPos.y) {
                this._wwaData.mapObject[pos.y][pos.x] = 0;
            }
            // 待ち時間
            this._waitTimeInCurrentFrame += this._wwaData.objectAttribute[partsID][Consts.ATR_NUMBER] * 100;
            this.appearParts(pos, 1 /* OBJECT */, partsID);
        };
        WWA.prototype._execObjectStatusEvent = function (pos, partsID, objAttr) {
            var status = new wwa_data.Status(this._wwaData.objectAttribute[partsID][Consts.ATR_ENERGY], this._wwaData.objectAttribute[partsID][Consts.ATR_STRENGTH], this._wwaData.objectAttribute[partsID][Consts.ATR_DEFENCE], this._wwaData.objectAttribute[partsID][Consts.ATR_GOLD]);
            var messageID = this._wwaData.objectAttribute[partsID][Consts.ATR_STRING];
            var message = this._wwaData.message[messageID];
            var pstatus = this._player.getStatusWithoutEquipments();
            // マイナス判定 ステータスがマイナスになる場合は、引かないこと！！
            if (status.strength > Consts.STATUS_MINUS_BORDER && pstatus.strength < status.strength - Consts.STATUS_MINUS_BORDER || status.defence > Consts.STATUS_MINUS_BORDER && pstatus.defence < status.defence - Consts.STATUS_MINUS_BORDER || status.gold > Consts.STATUS_MINUS_BORDER && pstatus.gold < status.gold - Consts.STATUS_MINUS_BORDER) {
                this._wwaData.mapObject[pos.y][pos.x] = 0;
                return;
            }
            status.energy = status.energy > Consts.STATUS_MINUS_BORDER ? Consts.STATUS_MINUS_BORDER - status.energy : status.energy;
            status.strength = status.strength > Consts.STATUS_MINUS_BORDER ? Consts.STATUS_MINUS_BORDER - status.strength : status.strength;
            status.defence = status.defence > Consts.STATUS_MINUS_BORDER ? Consts.STATUS_MINUS_BORDER - status.defence : status.defence;
            status.gold = status.gold > Consts.STATUS_MINUS_BORDER ? Consts.STATUS_MINUS_BORDER - status.gold : status.gold;
            this._player.addStatusAll(status);
            this.setStatusChangedEffect(status);
            //  ゲームオーバー
            if (this._player.isDead() && this._wwaData.objectAttribute[partsID][Consts.ATR_ENERGY] !== 0) {
                this.gameover();
                return;
            }
            this.setMessageQueue(message);
            this._wwaData.mapObject[pos.y][pos.x] = 0;
            this.appearParts(pos, 1 /* OBJECT */, partsID);
        };
        WWA.prototype._execObjectMonsterEvent = function (pos, partsID, objAttr) {
            var _this = this;
            var monsterImgCoord = new wwa_data.Coord(this._wwaData.objectAttribute[partsID][Consts.ATR_X], this._wwaData.objectAttribute[partsID][Consts.ATR_Y]);
            var monsterStatus = new wwa_data.Status(this._wwaData.objectAttribute[partsID][Consts.ATR_ENERGY], this._wwaData.objectAttribute[partsID][Consts.ATR_STRENGTH], this._wwaData.objectAttribute[partsID][Consts.ATR_DEFENCE], this._wwaData.objectAttribute[partsID][Consts.ATR_GOLD]);
            var monsterMessage = this._wwaData.message[this._wwaData.objectAttribute[partsID][Consts.ATR_STRING]];
            var monsterItemID = this._wwaData.objectAttribute[partsID][Consts.ATR_ITEM];
            this._monster = new wwa_monster.Monster(partsID, pos, monsterImgCoord, monsterStatus, monsterMessage, monsterItemID, function () {
                _this._monsterWindow.hide();
            });
            this._player.startBattleWith(this._monster);
            this._monsterWindow.show();
        };
        WWA.prototype._execObjectBuyEvent = function (pos, partsID, objAttr) {
            var messageID = this._wwaData.objectAttribute[partsID][Consts.ATR_STRING];
            var message = this._wwaData.message[messageID];
            var playerPos = this._player.getPosition().getPartsCoord();
            this.setMessageQueue(message, true);
            // プレイヤー座標と同一なら削除（踏み潰し判定）
            if (pos.x === playerPos.x && pos.y === playerPos.y) {
                this._wwaData.mapObject[pos.y][pos.x] = 0;
            }
            this._yesNoChoicePartsCoord = pos;
            this._yesNoChoicePartsID = partsID;
            this._yesNoChoiceCallInfo = 2 /* CALL_BY_OBJECT_PARTS */;
        };
        WWA.prototype._execObjectSellEvent = function (pos, partsID, objAttr) {
            var messageID = this._wwaData.objectAttribute[partsID][Consts.ATR_STRING];
            var message = this._wwaData.message[messageID];
            var playerPos = this._player.getPosition().getPartsCoord();
            this.setMessageQueue(message, true);
            // プレイヤー座標と同一なら削除（踏み潰し判定）
            if (pos.x === playerPos.x && pos.y === playerPos.y) {
                this._wwaData.mapObject[pos.y][pos.x] = 0;
            }
            this._yesNoChoicePartsCoord = pos;
            this._yesNoChoicePartsID = partsID;
            this._yesNoChoiceCallInfo = 2 /* CALL_BY_OBJECT_PARTS */;
        };
        WWA.prototype._execObjectItemEvent = function (pos, partsID, objAttr) {
            var messageID = this._wwaData.objectAttribute[partsID][Consts.ATR_STRING];
            var message = this._wwaData.message[messageID];
            try {
                this._player.addItem(partsID, this._wwaData.objectAttribute[partsID][Consts.ATR_NUMBER]);
                this._wwaData.mapObject[pos.y][pos.x] = 0;
                // 使用型アイテム 未実装
                if (this._wwaData.objectAttribute[partsID][Consts.ATR_MODE] !== 0) {
                }
                else {
                    this.setMessageQueue(message);
                    this.appearParts(pos, 1 /* OBJECT */, partsID);
                }
            }
            catch (e) {
                // これ以上、アイテムを持てません
                this.setMessageQueue(this._wwaData.systemMessage[1 /* FULL_ITEM */] === "" ? "これ以上、アイテムを持てません。" : this._wwaData.systemMessage[1 /* FULL_ITEM */]);
            }
        };
        WWA.prototype._execObjectDoorEvent = function (pos, partsID, objAttr) {
            var itemID = this._wwaData.objectAttribute[partsID][Consts.ATR_ITEM];
            var messageID = this._wwaData.objectAttribute[partsID][Consts.ATR_STRING];
            var message = this._wwaData.message[messageID];
            if (this._player.hasItem(itemID)) {
                if (this._wwaData.objectAttribute[partsID][Consts.ATR_MODE] === 0) {
                    this._player.removeItemByPartsID(itemID);
                }
                this.setMessageQueue(message);
                this._wwaData.mapObject[pos.y][pos.x] = 0;
                this.appearParts(pos, 1 /* OBJECT */, partsID);
            }
        };
        WWA.prototype._execObjectYesNoChoiceEvent = function (pos, partsID, objAttr) {
            var messageID = this._wwaData.objectAttribute[partsID][Consts.ATR_STRING];
            var message = this._wwaData.message[messageID];
            var playerPos = this._player.getPosition().getPartsCoord();
            this.setMessageQueue(message, true);
            // プレイヤー座標と同一なら削除（踏み潰し判定）
            if (pos.x === playerPos.x && pos.y === playerPos.y) {
                this._wwaData.mapObject[pos.y][pos.x] = 0;
            }
            this._yesNoChoicePartsCoord = pos;
            this._yesNoChoicePartsID = partsID;
            this._yesNoChoiceCallInfo = 2 /* CALL_BY_OBJECT_PARTS */;
        };
        WWA.prototype._execObjectLocalGateEvent = function (pos, partsID, mapAttr) {
            var playerPos = this._player.getPosition().getPartsCoord();
            // プレイヤー座標と同一なら削除（踏み潰し判定）
            if (pos.x === playerPos.x && pos.y === playerPos.y) {
                this._wwaData.mapObject[pos.y][pos.x] = 0;
            }
            // TODO: ジャンプ後のプレイヤーの向き 背景との処理共通化
            var jx = this._wwaData.objectAttribute[partsID][Consts.ATR_JUMP_X];
            var jy = this._wwaData.objectAttribute[partsID][Consts.ATR_JUMP_Y];
            if (jx > Consts.RELATIVE_COORD_LOWER) {
                jx = pos.x + jx - Consts.RELATIVE_COORD_BIAS;
            }
            if (jy > Consts.RELATIVE_COORD_LOWER) {
                jy = pos.y + jy - Consts.RELATIVE_COORD_BIAS;
            }
            this.appearParts(pos, 1 /* OBJECT */, partsID);
            if (0 <= jx && 0 <= jy && jx < this._wwaData.mapWidth && jy < this._wwaData.mapWidth) {
                this._player.jumpTo(new Position(this, jx, jy, 0, 0));
            }
        };
        WWA.prototype._execObjectUrlGateEvent = function (pos, partsID, mapAttr) {
            var messageID = this._wwaData.objectAttribute[partsID][Consts.ATR_STRING];
            if (!this._isURLGateEnable) {
                return;
            }
            this.setMessageQueue(this._wwaData.message[5 /* ASK_LINK */] === "" ? "他のページにリンクします。\nよろしいですか？" : this._wwaData.message[5 /* ASK_LINK */], true);
            this._yesNoChoicePartsCoord = pos;
            this._yesNoChoicePartsID = partsID;
            this._yesNoChoiceCallInfo = 2 /* CALL_BY_OBJECT_PARTS */;
            this._yesNoURL = this._wwaData.message[messageID].split(/\s/g)[0];
        };
        WWA.prototype._execObjectScoreEvent = function (pos, partsID, mapAttr) {
            var messageID = this._wwaData.objectAttribute[partsID][Consts.ATR_STRING];
            var playerPos = this._player.getPosition().getPartsCoord();
            var playerStatus = this._player.getStatus();
            var score = 0;
            score += this._wwaData.objectAttribute[partsID][Consts.ATR_ENERGY] * playerStatus.energy;
            score += this._wwaData.objectAttribute[partsID][Consts.ATR_STRENGTH] * playerStatus.strength;
            score += this._wwaData.objectAttribute[partsID][Consts.ATR_DEFENCE] * playerStatus.defence;
            score += this._wwaData.objectAttribute[partsID][Consts.ATR_GOLD] * playerStatus.gold;
            this._scoreWindow.update(score);
            this._scoreWindow.show();
            this.setMessageQueue(messageID === 0 ? "スコアを表示します。" : this._wwaData.message[messageID], false);
        };
        WWA.prototype._execChoiceWindowRunningEvent = function () {
            var partsType;
            var gold;
            if (--this._yesNoDispCounter === 0) {
                if (this._yesNoJudge === 0 /* YES */) {
                    if (this._yesNoChoiceCallInfo === 1 /* CALL_BY_MAP_PARTS */) {
                        partsType = this._wwaData.mapAttribute[this._yesNoChoicePartsID][Consts.ATR_TYPE];
                        if (partsType === Consts.MAP_URLGATE) {
                            location.href = wwa_util.$escapedURI(this._yesNoURL);
                        }
                    }
                    else if (this._yesNoChoiceCallInfo === 2 /* CALL_BY_OBJECT_PARTS */) {
                        partsType = this._wwaData.objectAttribute[this._yesNoChoicePartsID][Consts.ATR_TYPE];
                        if (partsType === Consts.OBJECT_BUY) {
                            if (this._player.hasItem(this._wwaData.objectAttribute[this._yesNoChoicePartsID][Consts.ATR_ITEM])) {
                                this._player.removeItemByPartsID(this._wwaData.objectAttribute[this._yesNoChoicePartsID][Consts.ATR_ITEM]);
                                gold = this._wwaData.objectAttribute[this._yesNoChoicePartsID][Consts.ATR_GOLD];
                                this._player.earnGold(gold);
                                this.setStatusChangedEffect(new wwa_data.Status(0, 0, 0, gold));
                                this.appearParts(this._yesNoChoicePartsCoord, 1 /* OBJECT */, this._yesNoChoicePartsID);
                            }
                            else {
                                // アイテムを持っていない
                                if (this._wwaData.message[7 /* NO_ITEM */] !== "BLANK") {
                                    this._messageQueue.push(this._wwaData.message[7 /* NO_ITEM */] === "" ? "アイテムをもっていない。" : this._wwaData.message[7 /* NO_ITEM */]);
                                }
                                ;
                            }
                        }
                        else if (partsType === Consts.OBJECT_SELL) {
                            if (this._player.hasGold(this._wwaData.objectAttribute[this._yesNoChoicePartsID][Consts.ATR_GOLD])) {
                                if (this._player.canHaveMoreItems()) {
                                    this._player.addItem(this._wwaData.objectAttribute[this._yesNoChoicePartsID][Consts.ATR_ITEM]);
                                    var status = new wwa_data.Status(this._wwaData.objectAttribute[this._yesNoChoicePartsID][Consts.ATR_ENERGY], this._wwaData.objectAttribute[this._yesNoChoicePartsID][Consts.ATR_STRENGTH], this._wwaData.objectAttribute[this._yesNoChoicePartsID][Consts.ATR_DEFENCE], -this._wwaData.objectAttribute[this._yesNoChoicePartsID][Consts.ATR_GOLD]);
                                    var pstatus = this._player.getStatusWithoutEquipments();
                                    status.energy = status.energy > Consts.STATUS_MINUS_BORDER ? Consts.STATUS_MINUS_BORDER - status.energy : status.energy;
                                    this.setStatusChangedEffect(status);
                                    this._player.addStatusAll(status);
                                    //  ゲームオーバー
                                    if (this._player.isDead() && this._wwaData.objectAttribute[this._yesNoChoicePartsID][Consts.ATR_ENERGY] !== 0) {
                                        this.gameover();
                                        return;
                                    }
                                    this.appearParts(this._yesNoChoicePartsCoord, 1 /* OBJECT */, this._yesNoChoicePartsID);
                                }
                                else {
                                    // アイテムをボックスがいっぱい
                                    this._messageQueue.push("これ以上、アイテムを持てません。");
                                }
                            }
                            else {
                                // 所持金が足りない
                                if (this._wwaData.message[6 /* NO_MONEY */] !== "BLANK") {
                                    this._messageQueue.push(this._wwaData.message[6 /* NO_MONEY */] === "" ? "所持金が足りない。" : this._wwaData.message[6 /* NO_MONEY */]);
                                }
                            }
                        }
                        else if (partsType === Consts.OBJECT_SELECT) {
                            this.appearParts(this._yesNoChoicePartsCoord, 2 /* CHOICE_YES */, this._yesNoChoicePartsID);
                        }
                        else if (partsType === Consts.OBJECT_URLGATE) {
                            location.href = wwa_util.$escapedURI(this._yesNoURL);
                        }
                    }
                    else if (this._yesNoChoiceCallInfo === 3 /* CALL_BY_ITEM_USE */) {
                        this._player.readyToUseItem(this._yesNoUseItemPos);
                    }
                    else if (this._yesNoChoiceCallInfo === 5 /* CALL_BY_QUICK_LOAD */) {
                        (wwa_util.$id(wwa_data.sidebarButtonCellElementID[0 /* QUICK_LOAD */])).classList.remove("onpress");
                        this._stopUpdateByLoadFlag = true;
                        this._loadType = 0 /* QUICK_LOAD */;
                    }
                    else if (this._yesNoChoiceCallInfo === 4 /* CALL_BY_QUICK_SAVE */) {
                        (wwa_util.$id(wwa_data.sidebarButtonCellElementID[1 /* QUICK_SAVE */])).classList.remove("onpress");
                        this._quickSave();
                    }
                    else if (this._yesNoChoiceCallInfo === 6 /* CALL_BY_RESTART_GAME */) {
                        (wwa_util.$id(wwa_data.sidebarButtonCellElementID[2 /* RESTART_GAME */])).classList.remove("onpress");
                        this._stopUpdateByLoadFlag = true;
                        this._loadType = 1 /* RESTART_GAME */;
                    }
                    else if (this._yesNoChoiceCallInfo === 7 /* CALL_BY_GOTO_WWA */) {
                        location.href = wwa_util.$escapedURI(Consts.WWA_HOME);
                        (wwa_util.$id(wwa_data.sidebarButtonCellElementID[3 /* GOTO_WWA */])).classList.remove("onpress");
                    }
                    this._yesNoJudge = 2 /* UNSELECTED */;
                    if (this._messageQueue.length === 0) {
                        this._messageWindow.hide();
                        this._mouseStore.clear();
                        this._player.clearMessageWaiting();
                        if (this._player.isReadyToUseItem()) {
                            this._player.useItem();
                        }
                    }
                    else {
                        this._messageWindow.setMessage(this._messageQueue.shift());
                    }
                    this._yesNoChoicePartsCoord = void 0;
                    this._yesNoChoicePartsID = void 0;
                    this._yesNoUseItemPos = void 0;
                    this._yesNoChoiceCallInfo = 0 /* NONE */;
                    this._messageWindow.setYesNoChoice(false);
                }
                else if (this._yesNoJudge === 1 /* NO */) {
                    if (this._yesNoChoiceCallInfo === 1 /* CALL_BY_MAP_PARTS */) {
                        partsType = this._wwaData.mapAttribute[this._yesNoChoicePartsID][Consts.ATR_TYPE];
                        if (partsType === Consts.MAP_URLGATE) {
                        }
                    }
                    else if (this._yesNoChoiceCallInfo === 2 /* CALL_BY_OBJECT_PARTS */) {
                        partsType = this._wwaData.objectAttribute[this._yesNoChoicePartsID][Consts.ATR_TYPE];
                        if (partsType === Consts.OBJECT_BUY) {
                        }
                        else if (partsType === Consts.OBJECT_SELL) {
                        }
                        else if (partsType === Consts.OBJECT_SELECT) {
                            this.appearParts(this._yesNoChoicePartsCoord, 3 /* CHOICE_NO */, this._yesNoChoicePartsID);
                        }
                        else if (partsType === Consts.OBJECT_URLGATE) {
                        }
                    }
                    else if (this._yesNoChoiceCallInfo === 3 /* CALL_BY_ITEM_USE */) {
                        var bg = (wwa_util.$id("item" + (this._yesNoUseItemPos - 1)));
                        bg.classList.remove("onpress");
                    }
                    else if (this._yesNoChoiceCallInfo === 5 /* CALL_BY_QUICK_LOAD */) {
                        (wwa_util.$id(wwa_data.sidebarButtonCellElementID[0 /* QUICK_LOAD */])).classList.remove("onpress");
                    }
                    else if (this._yesNoChoiceCallInfo === 4 /* CALL_BY_QUICK_SAVE */) {
                        (wwa_util.$id(wwa_data.sidebarButtonCellElementID[1 /* QUICK_SAVE */])).classList.remove("onpress");
                    }
                    else if (this._yesNoChoiceCallInfo === 6 /* CALL_BY_RESTART_GAME */) {
                        (wwa_util.$id(wwa_data.sidebarButtonCellElementID[2 /* RESTART_GAME */])).classList.remove("onpress");
                    }
                    else if (this._yesNoChoiceCallInfo === 7 /* CALL_BY_GOTO_WWA */) {
                        (wwa_util.$id(wwa_data.sidebarButtonCellElementID[3 /* GOTO_WWA */])).classList.remove("onpress");
                    }
                    this._yesNoJudge = 2 /* UNSELECTED */;
                    if (this._scoreWindow.isVisible()) {
                        this._scoreWindow.hide();
                    }
                    if (this._messageQueue.length === 0) {
                        this._messageWindow.hide();
                        this._mouseStore.clear();
                        this._player.clearMessageWaiting();
                    }
                    else {
                        this._messageWindow.setMessage(this._messageQueue.shift());
                    }
                    this._yesNoChoicePartsCoord = void 0;
                    this._yesNoChoicePartsID = void 0;
                    this._yesNoUseItemPos = void 0;
                    this._yesNoChoiceCallInfo = 0 /* NONE */;
                    this._messageWindow.setYesNoChoice(false);
                }
            }
        };
        WWA.prototype.setMessageQueue = function (message, showChoice) {
            if (showChoice === void 0) { showChoice = false; }
            // コメント削除
            var messageMain = message.split(/\<c\>/i)[0].replace(/\<p\>\n/ig, "<P>");
            this._messageQueue = messageMain.split(/\<p\>/ig).filter(function (s) {
                return s !== "";
            });
            if (this._messageQueue.length !== 0) {
                this._messageWindow.setMessage(this._messageQueue.shift());
                this._messageWindow.setYesNoChoice(showChoice);
                this._player.setMessageWaiting();
                return true;
            }
            return false;
        };
        WWA.prototype.enqueueMessage = function (message) {
            var messageMain = message.split(/\<c\>/i)[0].replace(/\<p\>\n/ig, "<P>");
            var messages = messageMain.split(/\<p\>/ig).filter(function (s) {
                return s !== "";
            });
            this._messageQueue = this._messageQueue.concat(messages);
        };
        WWA.prototype.appearParts = function (pos, triggerType, triggerPartsID) {
            if (triggerPartsID === void 0) { triggerPartsID = 0; }
            var triggerPartsType;
            var rangeMin = (triggerType === 3 /* CHOICE_NO */) ? Consts.APPERANCE_PARTS_MIN_INDEX_NO : Consts.APPERANCE_PARTS_MIN_INDEX;
            var rangeMax = (triggerType === 2 /* CHOICE_YES */) ? Consts.APPERANCE_PARTS_MAX_INDEX_YES : Consts.APPERANCE_PARTS_MAX_INDEX;
            var targetPartsID;
            var targetPartsType;
            var targetX;
            var targetY;
            var targetPos;
            var i;
            if (triggerType === 0 /* MAP */) {
                triggerPartsID = (triggerPartsID === 0) ? this._wwaData.map[pos.y][pos.x] : triggerPartsID;
                triggerPartsType = 1 /* MAP */;
            }
            else {
                triggerPartsID = (triggerPartsID === 0) ? this._wwaData.mapObject[pos.y][pos.x] : triggerPartsID;
                triggerPartsType = 0 /* OBJECT */;
            }
            for (i = rangeMin; i <= rangeMax; i++) {
                var base = Consts.ATR_APPERANCE_BASE + i * Consts.REL_ATR_APPERANCE_UNIT_LENGTH;
                var idxID = base + Consts.REL_ATR_APPERANCE_ID;
                var idxX = base + Consts.REL_ATR_APPERANCE_X;
                var idxY = base + Consts.REL_ATR_APPERANCE_Y;
                var idxType = base + Consts.REL_ATR_APPERANCE_TYPE;
                targetPartsID = (triggerPartsType === 1 /* MAP */) ? this._wwaData.mapAttribute[triggerPartsID][idxID] : this._wwaData.objectAttribute[triggerPartsID][idxID];
                targetPartsType = (triggerPartsType === 1 /* MAP */) ? this._wwaData.mapAttribute[triggerPartsID][idxType] : this._wwaData.objectAttribute[triggerPartsID][idxType];
                targetX = (triggerPartsType === 1 /* MAP */) ? this._wwaData.mapAttribute[triggerPartsID][idxX] : this._wwaData.objectAttribute[triggerPartsID][idxX];
                targetY = (triggerPartsType === 1 /* MAP */) ? this._wwaData.mapAttribute[triggerPartsID][idxY] : this._wwaData.objectAttribute[triggerPartsID][idxY];
                if (targetX === Consts.PLAYER_COORD) {
                    targetX = this._player.getPosition().getPartsCoord().x;
                    this._player.resetEventExecutionInfo();
                }
                else if (targetX > Consts.RELATIVE_COORD_LOWER) {
                    targetX = pos.x + targetX - Consts.RELATIVE_COORD_BIAS;
                }
                if (targetY === Consts.PLAYER_COORD) {
                    targetY = this._player.getPosition().getPartsCoord().y;
                    this._player.resetEventExecutionInfo();
                }
                else if (targetY > Consts.RELATIVE_COORD_LOWER) {
                    targetY = pos.y + targetY - Consts.RELATIVE_COORD_BIAS;
                }
                if (targetX === 0 && targetY === 0) {
                    continue;
                }
                try {
                    targetPos = new wwa_data.Position(this, targetX, targetY, 0, 0);
                    if (targetPartsType === 1 /* MAP */) {
                        if (targetPartsID >= this._wwaData.mapPartsMax) {
                            throw new Error("背景パーツの範囲外IDが指定されました");
                        }
                        this._wwaData.map[targetY][targetX] = targetPartsID;
                    }
                    else {
                        if (targetPartsID >= this._wwaData.objPartsMax) {
                            throw new Error("物体パーツの範囲外IDが指定されました");
                        }
                        this._wwaData.mapObject[targetY][targetX] = targetPartsID;
                        this._replaceRandomObject(new Coord(targetX, targetY));
                        if (targetX === this._player.getPosition().getPartsCoord().x && targetY === this._player.getPosition().getPartsCoord().y) {
                            this._player.setPartsAppearedFlag();
                        }
                    }
                }
                catch (e) {
                }
            }
        };
        WWA.prototype._replaceRandomObject = function (pos) {
            var id = this._wwaData.mapObject[pos.y][pos.x];
            var type = this._wwaData.objectAttribute[id][Consts.ATR_TYPE];
            var newId;
            var randv;
            if (type !== Consts.OBJECT_RANDOM) {
                return;
            }
            for (var i = 0; i < Consts.RANDOM_ITERATION_MAX; i++) {
                randv = Math.floor(Math.random() * 10);
                newId = this._wwaData.objectAttribute[id][Consts.ATR_RANDOM_BASE + randv];
                if (newId >= this._wwaData.objPartsMax) {
                    newId = 0;
                    break;
                }
                if (this._wwaData.objectAttribute[newId][Consts.ATR_TYPE] !== Consts.OBJECT_RANDOM) {
                    break;
                }
                id = newId;
            }
            this._wwaData.mapObject[pos.y][pos.x] = newId;
        };
        WWA.prototype._replaceRandomObjectsInScreen = function () {
            var camPos = this._camera.getPosition().getPartsCoord();
            var xLeft = Math.max(0, camPos.x - 1);
            var xRight = Math.min(this._wwaData.mapWidth - 1, camPos.x + Consts.H_PARTS_NUM_IN_WINDOW);
            var yTop = Math.max(0, camPos.y - 1);
            var yBottom = Math.min(this._wwaData.mapWidth - 1, camPos.y + Consts.V_PARTS_NUM_IN_WINDOW);
            for (var x = xLeft; x <= xRight; x++) {
                for (var y = yTop; y < yBottom; y++) {
                    this._replaceRandomObject(new Coord(x, y));
                }
            }
        };
        WWA.prototype._replaceAllRandomObjects = function () {
            for (var x = 0; x < this._wwaData.mapWidth; x++) {
                for (var y = 0; y < this._wwaData.mapWidth; y++) {
                    this._replaceRandomObject(new Coord(x, y));
                }
            }
        };
        WWA.prototype.gameover = function () {
            var jx = this._wwaData.gameoverX;
            var jy = this._wwaData.gameoverY;
            this._waitTimeInCurrentFrame = Consts.GAMEOVER_FRAME_INTERVAL;
            this._player.jumpTo(new Position(this, jx, jy, 0, 0));
        };
        WWA.prototype.setYesNoInput = function (yesNo) {
            this._yesNoJudgeInNextFrame = yesNo;
        };
        WWA.prototype.getYesNoState = function () {
            if (this._yesNoJudgeInNextFrame !== void 0) {
                return this._yesNoJudgeInNextFrame;
            }
            return this._yesNoJudge;
        };
        WWA.prototype.setStatusChangedEffect = function (additionalStatus) {
            if (additionalStatus.strength !== 0) {
                wwa_util.$id("disp-strength").classList.add("onpress");
                this._statusPressCounter.strength = Consts.STATUS_CHANGED_EFFECT_FRAME_NUM;
            }
            if (additionalStatus.defence !== 0) {
                wwa_util.$id("disp-defence").classList.add("onpress");
                this._statusPressCounter.defence = Consts.STATUS_CHANGED_EFFECT_FRAME_NUM;
            }
            if (additionalStatus instanceof wwa_data.Status) {
                if (additionalStatus.energy !== 0) {
                    wwa_util.$id("disp-energy").classList.add("onpress");
                    this._statusPressCounter.energy = Consts.STATUS_CHANGED_EFFECT_FRAME_NUM;
                }
                if (additionalStatus.gold !== 0) {
                    wwa_util.$id("disp-gold").classList.add("onpress");
                    this._statusPressCounter.gold = Consts.STATUS_CHANGED_EFFECT_FRAME_NUM;
                }
            }
        };
        WWA.prototype.setPartsOnPosition = function (partsType, id, pos) {
            if (partsType === 1 /* MAP */) {
                if (id >= this._wwaData.mapPartsMax) {
                    this._wwaData.map[pos.y][pos.x] = 0;
                }
                this._wwaData.map[pos.y][pos.x] = id;
            }
            else {
                if (id >= this._wwaData.objPartsMax) {
                    this._wwaData.mapObject[pos.y][pos.x] = 0;
                }
                this._wwaData.mapObject[pos.y][pos.x] = id;
            }
        };
        WWA.prototype._quickSave = function () {
            var qd = JSON.parse(JSON.stringify(this._wwaData));
            var pc = this._player.getPosition().getPartsCoord();
            var st = this._player.getStatusWithoutEquipments();
            qd.itemBox = this._player.getCopyOfItemBox();
            qd.playerX = pc.x;
            qd.playerY = pc.y;
            qd.statusEnergyMax = this._player.getEnergyMax();
            qd.statusEnergy = st.energy;
            qd.statusStrength = st.strength;
            qd.statusDefence = st.defence;
            qd.statusGold = st.gold;
            qd.moves = this._player.getMoveCount();
            this._quickSaveData = qd;
        };
        WWA.prototype._quickLoad = function (restart) {
            if (restart === void 0) { restart = false; }
            if (!restart && this._quickSaveData === void 0) {
                throw new Error("セーブデータがありません。");
            }
            this._wwaData = JSON.parse(JSON.stringify(restart ? this._restartData : this._quickSaveData));
            this._player.setEnergyMax(this._wwaData.statusEnergyMax);
            this._player.setEnergy(this._wwaData.statusEnergy);
            this._player.setStrength(this._wwaData.statusStrength);
            this._player.setDefence(this._wwaData.statusDefence);
            this._player.setGold(this._wwaData.statusGold);
            this._player.setMoveCount(this._wwaData.moves);
            this._player.clearItemBox();
            for (var i = 0; i < this._wwaData.itemBox.length; i++) {
                this._player.addItem(this._wwaData.itemBox[i]);
            }
            this._player.systemJumpTo(new wwa_data.Position(this, this._wwaData.playerX, this._wwaData.playerY, 0, 0));
        };
        WWA.prototype._restartGame = function () {
            this._quickLoad(true);
        };
        WWA.prototype._fadeout = function (callback) {
            var borderWidth = 0;
            var size = Consts.MAP_WINDOW_WIDTH;
            var v = Consts.FADEOUT_SPEED; // borderの一本が増える速さ
            var elm = wwa_util.$id("wwa-fader");
            elm.style.display = "block";
            var timer = setInterval(function () {
                borderWidth += v;
                size -= v * 2;
                if (size <= 0 || borderWidth * 2 > Consts.MAP_WINDOW_WIDTH) {
                    elm.removeAttribute("style");
                    elm.style.display = "block";
                    elm.style.borderWidth = "0";
                    elm.style.width = Consts.MAP_WINDOW_WIDTH + "px";
                    elm.style.height = Consts.MAP_WINDOW_HEIGHT + "px";
                    elm.style.backgroundColor = "#808080";
                    clearInterval(timer);
                    callback();
                    return;
                }
                elm.style.width = size + "px";
                elm.style.height = size + "px";
                elm.style.borderWidth = borderWidth + "px";
            }, 20);
        };
        WWA.prototype.moveObjects = function () {
            var camPos = this._camera.getPosition();
            var pPos = this._player.getPosition();
            var camCoord = camPos.getPartsCoord();
            // 物体が動く範囲は、カメラ内の11*11の1周外側も含む13*13
            var leftX = camPos.getPartsCoord().x;
            var topY = camPos.getPartsCoord().y;
            var objectsInNextFrame; // y - x
            var localX, localY;
            if (this.getMapAttributeByPosition(this._player.getPosition(), Consts.ATR_TYPE) === Consts.MAP_LOCALGATE || this.getObjectAttributeByPosition(this._player.getPosition(), Consts.ATR_TYPE) === Consts.OBJECT_LOCALGATE) {
                return;
            }
            objectsInNextFrame = new Array(Consts.V_PARTS_NUM_IN_WINDOW + 2);
            this.hoge = new Array(Consts.V_PARTS_NUM_IN_WINDOW + 2);
            for (localY = -1; localY <= Consts.V_PARTS_NUM_IN_WINDOW; localY++) {
                objectsInNextFrame[localY + 1] = new Array(Consts.H_PARTS_NUM_IN_WINDOW + 2);
                this.hoge[localY + 1] = new Array(Consts.H_PARTS_NUM_IN_WINDOW + 2);
                for (localX = -1; localX <= Consts.H_PARTS_NUM_IN_WINDOW; localX++) {
                    if (topY + localY < 0 || topY + localY >= this._wwaData.mapWidth || leftX + localX < 0 || leftX + localX >= this._wwaData.mapWidth) {
                        objectsInNextFrame[localY + 1][localX + 1] = 0;
                        this.hoge[localY + 1][localX + 1] = 0;
                        continue;
                    }
                    try {
                        var pos = new Position(this, leftX + localX, topY + localY, 0, 0);
                        var posc = pos.getPartsCoord();
                    }
                    catch (e) {
                        objectsInNextFrame[localY + 1][localX + 1] = 0;
                        this.hoge[localY + 1][localX + 1] = 0;
                        continue;
                    }
                    var objID = this._wwaData.mapObject[posc.y][posc.x];
                    if (this._wwaData.objectAttribute[objID][Consts.ATR_MOVE] === 0 /* STATIC */) {
                        objectsInNextFrame[localY + 1][localX + 1] = this._wwaData.mapObject[posc.y][posc.x];
                        this.hoge[localY + 1][localX + 1] = -this._wwaData.mapObject[posc.y][posc.x];
                    }
                    else {
                        objectsInNextFrame[localY + 1][localX + 1] = 0;
                        this.hoge[localY + 1][localX + 1] = 0;
                    }
                }
            }
            for (localY = -1; localY <= Consts.V_PARTS_NUM_IN_WINDOW; localY++) {
                if (topY + localY < 0 || topY + localY >= this._wwaData.mapWidth) {
                    continue;
                }
                for (localX = -1; localX <= Consts.H_PARTS_NUM_IN_WINDOW; localX++) {
                    if (leftX + localX < 0 || leftX + localX >= this._wwaData.mapWidth) {
                        continue;
                    }
                    try {
                        var pos = new Position(this, leftX + localX, topY + localY, 0, 0);
                        var posc = pos.getPartsCoord();
                    }
                    catch (e) {
                        continue;
                    }
                    var partsID = this._wwaData.mapObject[posc.y][posc.x];
                    if (partsID === 0 || this._wwaData.objectAttribute[partsID][Consts.ATR_MOVE] === 0 /* STATIC */ || this._wwaData.objectAttribute[partsID][Consts.ATR_TYPE] === Consts.OBJECT_LOCALGATE) {
                        continue;
                    }
                    var moveMode = this._wwaData.objectAttribute[partsID][Consts.ATR_MOVE];
                    if (moveMode !== 3 /* HANG_AROUND */) {
                        var candCoord = this._getCandidateCoord(pos, moveMode);
                        var xCand = new Coord(candCoord.x, posc.y);
                        var yCand = new Coord(posc.x, candCoord.y);
                        var thirdCand = null;
                        var randomCand;
                        if (this._objectCanMoveTo(candCoord, objectsInNextFrame)) {
                            this._setObjectsInNextFrame(posc, candCoord, leftX, topY, objectsInNextFrame, partsID);
                        }
                        else {
                            var mode = this._getSecondCandidateMoveMode(posc, candCoord, xCand, yCand, this._wwaData.objectAttribute[partsID][Consts.ATR_TYPE] === Consts.OBJECT_MONSTER, objectsInNextFrame);
                            if (mode === 0 /* MODE_X */) {
                                this._setObjectsInNextFrame(posc, xCand, leftX, topY, objectsInNextFrame, partsID);
                            }
                            else if (mode === 1 /* MODE_Y */) {
                                this._setObjectsInNextFrame(posc, yCand, leftX, topY, objectsInNextFrame, partsID);
                            }
                            else {
                                thirdCand = this._getThirdCandidate(pos, candCoord, moveMode, objectsInNextFrame);
                                if (thirdCand !== null) {
                                    this._setObjectsInNextFrame(posc, thirdCand, leftX, topY, objectsInNextFrame, partsID);
                                }
                                else {
                                    // うろうろする
                                    randomCand = this._getRandomMoveCoord(pos, objectsInNextFrame);
                                    this._setObjectsInNextFrame(posc, randomCand, leftX, topY, objectsInNextFrame, partsID);
                                }
                            }
                        }
                    }
                    else {
                        // うろうろする
                        randomCand = this._getRandomMoveCoord(pos, objectsInNextFrame);
                        this._setObjectsInNextFrame(posc, randomCand, leftX, topY, objectsInNextFrame, partsID);
                    }
                }
            }
        };
        WWA.prototype._getCandidateCoord = function (currentPos, moveType) {
            var currentCoord = currentPos.getPartsCoord();
            var playerOffsetCoord = this._player.getPosition().getOffsetCoord();
            var playerCoord = this._player.getPosition().getPartsCoord();
            try {
                var playerNextCoord = this._player.getPosition().getNextJustPosition().getPartsCoord();
            }
            catch (e) {
                throw new Error("予期せぬ方向への移動のようです。");
            }
            var candidateCoord = currentCoord.clone();
            var dx = 0;
            var dy = 0;
            if (moveType === 1 /* CHASE_PLAYER */) {
                dx = currentCoord.x > playerNextCoord.x ? 1 : currentCoord.x < playerNextCoord.x ? -1 : 0;
                dy = currentCoord.y > playerNextCoord.y ? 1 : currentCoord.y < playerNextCoord.y ? -1 : 0;
            }
            else if (moveType === 2 /* RUN_OUT */) {
                dx = currentCoord.x > playerNextCoord.x ? -1 : currentCoord.x < playerNextCoord.x ? 1 : 0;
                dy = currentCoord.y > playerNextCoord.y ? -1 : currentCoord.y < playerNextCoord.y ? 1 : 0;
            }
            candidateCoord.x -= dx;
            candidateCoord.y -= dy;
            candidateCoord.x = Math.min(this._wwaData.mapWidth - 1, Math.max(0, candidateCoord.x));
            candidateCoord.y = Math.min(this._wwaData.mapWidth - 1, Math.max(0, candidateCoord.y));
            return candidateCoord;
        };
        WWA.prototype._getSecondCandidateMoveMode = function (current, firstCandidate, xCand, yCand, isMonster, objectsInNextFrame) {
            if ((this._player.getDir() === 3 /* UP */ || this._player.getDir() === 2 /* DOWN */) && isMonster || (this._player.getDir() === 0 /* LEFT */ || this._player.getDir() === 1 /* RIGHT */) && !isMonster) {
                // 移動Yモード
                if (this._objectCanMoveTo(yCand, objectsInNextFrame)) {
                    return 1 /* MODE_Y */;
                }
                if (this._objectCanMoveTo(xCand, objectsInNextFrame)) {
                    return 0 /* MODE_X */;
                }
                return 2 /* UNDECIDED */;
            }
            // 移動Xモード
            if (this._objectCanMoveTo(xCand, objectsInNextFrame)) {
                return 0 /* MODE_X */;
            }
            if (this._objectCanMoveTo(yCand, objectsInNextFrame)) {
                return 1 /* MODE_Y */;
            }
            return 2 /* UNDECIDED */;
        };
        WWA.prototype._getThirdCandidate = function (currentPos, firstCandidate, mode, objectsInNextFrame) {
            var dir = mode === 1 /* CHASE_PLAYER */ ? 1 : mode === 2 /* RUN_OUT */ ? -1 : 0;
            var npCoord = this._player.getPosition().getNextJustPosition().getPartsCoord();
            var currentCoord = currentPos.getPartsCoord();
            var testCoord;
            if (npCoord.x !== currentCoord.x) {
                testCoord = new Coord(firstCandidate.x, currentCoord.y + 1 * dir);
                if (this._objectCanMoveTo(testCoord, objectsInNextFrame)) {
                    return testCoord;
                }
                testCoord = new Coord(firstCandidate.x, currentCoord.y - 1 * dir);
                if (this._objectCanMoveTo(testCoord, objectsInNextFrame)) {
                    return testCoord;
                }
                testCoord = new Coord(currentCoord.x, currentCoord.y + 1 * dir);
                if (this._objectCanMoveTo(testCoord, objectsInNextFrame)) {
                    return testCoord;
                }
                testCoord = new Coord(currentCoord.x, currentCoord.y - 1 * dir);
                if (this._objectCanMoveTo(testCoord, objectsInNextFrame)) {
                    return testCoord;
                }
            }
            if (npCoord.y !== currentCoord.y) {
                testCoord = new Coord(currentCoord.x + 1 * dir, firstCandidate.y);
                if (this._objectCanMoveTo(testCoord, objectsInNextFrame)) {
                    return testCoord;
                }
                testCoord = new Coord(currentCoord.x - 1 * dir, firstCandidate.y);
                if (this._objectCanMoveTo(testCoord, objectsInNextFrame)) {
                    return testCoord;
                }
                testCoord = new Coord(currentCoord.x + 1 * dir, currentCoord.y);
                if (this._objectCanMoveTo(testCoord, objectsInNextFrame)) {
                    return testCoord;
                }
                testCoord = new Coord(currentCoord.x - 1 * dir, currentCoord.y);
                if (this._objectCanMoveTo(testCoord, objectsInNextFrame)) {
                    return testCoord;
                }
            }
            return null;
        };
        WWA.prototype._getRandomMoveCoord = function (currentPos, objectsInNextFrame) {
            var currentCoord = currentPos.getPartsCoord();
            var resultCoord = currentCoord.clone();
            for (var i = 0; i < Consts.RANDOM_MOVE_ITERATION_NUM; i++) {
                var rand = Math.floor(Math.random() * 8);
                resultCoord.x = currentCoord.x + wwa_data.vx[rand];
                resultCoord.y = currentCoord.y + wwa_data.vy[rand];
                if (this._objectCanMoveTo(resultCoord, objectsInNextFrame)) {
                    return resultCoord;
                }
            }
            return currentCoord;
        };
        WWA.prototype.isPrevFrameEventExecuted = function () {
            return this._prevFrameEventExected;
        };
        WWA.prototype._objectCanMoveTo = function (candCoord, objectsInNextFrame) {
            var mapID = this._wwaData.map[candCoord.y][candCoord.x];
            var objID = this._wwaData.mapObject[candCoord.y][candCoord.x];
            var mapType = this._wwaData.mapAttribute[mapID][Consts.ATR_TYPE];
            var objMoveType = this._wwaData.objectAttribute[objID][Consts.ATR_MOVE];
            var camPos = this._camera.getPosition();
            var leftX = camPos.getPartsCoord().x;
            var topY = camPos.getPartsCoord().y;
            if (mapID === 0 || mapType === Consts.MAP_WALL) {
                return false;
            }
            if (objID !== 0) {
                return false;
            }
            var targetX = candCoord.x - leftX + 1;
            var targetY = candCoord.y - topY + 1;
            if (0 < targetX && 0 < targetY && targetX < objectsInNextFrame.length && targetY < objectsInNextFrame.length) {
                if (objectsInNextFrame[targetY][targetX] !== 0) {
                    return false;
                }
            }
            else {
                if (objID !== 0) {
                    return false;
                }
            }
            if (this._player.getPosition().getNextJustPosition().getPartsCoord().equals(candCoord)) {
                return false;
            }
            return true;
        };
        WWA.prototype._setObjectsInNextFrame = function (currentCoord, candCoord, leftX, topY, objectsInNextFrame, partsID) {
            var targetX = candCoord.x - leftX + 1;
            var targetY = candCoord.y - topY + 1;
            if (0 <= candCoord.x && candCoord.x <= this._wwaData.mapWidth && 0 < candCoord.y && candCoord.y <= this._wwaData.mapWidth) {
                if (0 <= targetX && targetX < objectsInNextFrame.length && 0 <= targetY && targetY < objectsInNextFrame.length) {
                    objectsInNextFrame[candCoord.y - topY + 1][candCoord.x - leftX + 1] = partsID;
                    this.hoge[candCoord.y - topY + 1][candCoord.x - leftX + 1] = partsID;
                }
                this._objectMovingDataManager.add(partsID, currentCoord.convertIntoPosition(this), candCoord.convertIntoPosition(this), currentCoord.getDirectionTo(candCoord));
            }
        };
        WWA.prototype.launchBattleEstimateWindow = function () {
            var cpParts = this._camera.getPosition().getPartsCoord();
            var xLeft = Math.max(0, cpParts.x);
            var xRight = Math.min(this._wwaData.mapWidth - 1, cpParts.x + Consts.H_PARTS_NUM_IN_WINDOW - 1);
            var yTop = Math.max(0, cpParts.y);
            var yBottom = Math.min(this._wwaData.mapWidth - 1, cpParts.y + Consts.V_PARTS_NUM_IN_WINDOW) - 1;
            var monsterList = [];
            for (var x = xLeft; x <= xRight; x++) {
                for (var y = yTop; y <= yBottom; y++) {
                    var pid = this._wwaData.mapObject[y][x];
                    if (this._wwaData.objectAttribute[pid][Consts.ATR_TYPE] === Consts.OBJECT_MONSTER) {
                        if (monsterList.indexOf(pid) === -1) {
                            monsterList.push(pid);
                        }
                    }
                }
            }
            if (monsterList.length === 0) {
                return false;
            }
            this._battleEstimateWindow.update(this._player.getStatus(), monsterList);
            this._battleEstimateWindow.show();
            this._player.setEstimateWindowWating();
            return true;
        };
        WWA.prototype.hideBattleEstimateWindow = function () {
            this._battleEstimateWindow.hide();
            this._player.clearEstimateWindowWaiting();
        };
        WWA.prototype._displayHelp = function () {
            if (this._player.isControllable()) {
                this.setMessageQueue("【ショートカットキーの一覧】\n" + "Ｆ１、Ｍ：戦闘結果予測の表示\n" + "Ｆ５：一時保存データの読み込み\n" + "Ｆ６：データの一時保存\n" + "Ｆ７：初めからスタート\n" + "Ｆ８：ＷＷＡ公式ページにリンク\n" + "Ｆ１２：このリストの表示\n" + "キーボードの「１２３、ＱＷＥ、ＡＳＤ、ＺＸＣ」は右のアイテムボックスに対応。\n" + "「Ｅｎｔｅｒ、Ｙ」はＹｅｓ,「Ｅｓｃ、Ｎ」はＮｏに対応。\n" + "現在の移動回数：" + this._player.getMoveCount());
            }
        };
        WWA.prototype._drawAA = function () {
            var field = util.$id("aa-field");
            field.innerHTML = "";
            var ppos = this._player.getPosition().getPartsCoord();
            var cpos = this._camera.getPosition().getPartsCoord();
            for (var y = cpos.y - 25; y < cpos.y + 25; y++) {
                var line = "";
                for (var x = cpos.x - 20; x < cpos.x + 20; x++) {
                    if (x < 0 || x >= this._wwaData.mapWidth || y < 0 || y >= this._wwaData.mapWidth) {
                        line += "■";
                        continue;
                    }
                    if (x === ppos.x && y === ppos.y) {
                        line += "<span style=\"color: red\">Ｐ</span>";
                        continue;
                    }
                    var objID = this._wwaData.mapObject[y][x];
                    var mapID = this._wwaData.map[y][x];
                    var objType = this._wwaData.objectAttribute[objID][Consts.ATR_TYPE];
                    var mapType = this._wwaData.mapAttribute[mapID][Consts.ATR_TYPE];
                    if (objID === 0) {
                        if (mapID === 0) {
                            line += "■";
                            continue;
                        }
                        if (mapType === Consts.MAP_STREET) {
                            line += "　";
                            continue;
                        }
                        if (mapType === Consts.MAP_WALL) {
                            line += "□";
                            continue;
                        }
                        if (mapType === Consts.MAP_LOCALGATE) {
                            line += "◎";
                            continue;
                        }
                        if (mapType === Consts.MAP_URLGATE) {
                            line += "＊";
                            continue;
                        }
                    }
                    if (objType === Consts.OBJECT_NORMAL) {
                        if (this._wwaData.objectAttribute[objID][Consts.ATR_MODE] === Consts.PASSABLE_OBJECT) {
                            line += "通";
                            continue;
                        }
                        line += "物";
                        continue;
                    }
                    if (objType === Consts.OBJECT_MESSAGE) {
                        line += "Ｍ";
                        continue;
                    }
                    if (objType === Consts.OBJECT_MONSTER) {
                        line += "怪";
                        continue;
                    }
                    if (objType === Consts.OBJECT_ITEM) {
                        line += "ア";
                        continue;
                    }
                    if (objType === Consts.OBJECT_DOOR) {
                        line += "扉";
                        continue;
                    }
                    if (objType === Consts.OBJECT_STATUS) {
                        line += "ス";
                        continue;
                    }
                    if (objType === Consts.OBJECT_SELL) {
                        line += "売";
                        continue;
                    }
                    if (objType === Consts.OBJECT_BUY) {
                        line += "買";
                        continue;
                    }
                    if (objType === Consts.OBJECT_URLGATE) {
                        line += "Ｕ";
                        continue;
                    }
                    if (objType === Consts.OBJECT_SCORE) {
                        line += "点";
                        continue;
                    }
                    if (objType === Consts.OBJECT_RANDOM) {
                        line += "乱";
                        continue;
                    }
                    if (objType === Consts.OBJECT_SELECT) {
                        line += "択";
                        continue;
                    }
                    if (objType === Consts.OBJECT_LOCALGATE) {
                        line += "Ｊ";
                        continue;
                        ;
                    }
                }
                field.innerHTML = field.innerHTML + line + "<br />";
            }
        };
        return WWA;
    })();
    wwa_main.WWA = WWA;
    window.addEventListener("load", function () {
        wwa_inject_html.inject(util.$id("wwa-wrapper"));
        var mapFileName = util.$id("wwa-wrapper").getAttribute("data-wwa-mapdata");
        var loaderFileName = util.$id("wwa-wrapper").getAttribute("data-wwa-loader");
        var urlgateEnabled = true;
        if (util.$id("wwa-wrapper").getAttribute("data-wwa-urlgate-enable").match(/^false$/i)) {
            urlgateEnabled = false;
        }
        wwa = new WWA(mapFileName, loaderFileName, urlgateEnabled);
    });
})(wwa_main || (wwa_main = {}));
/// <reference path="./wwa_data.ts" />
/// <reference path="./wwa_camera.ts" />
/// <reference path="./wwa_main.ts" />
var wwa_parts_player;
(function (wwa_parts_player) {
    var Direction = wwa_data.Direction;
    var Consts = wwa_data.WWAConsts;
    var Parts = (function () {
        function Parts(pos) {
            this._position = pos;
        }
        Parts.prototype.getPosition = function () {
            return this._position;
        };
        return Parts;
    })();
    var PartsObject = (function (_super) {
        __extends(PartsObject, _super);
        function PartsObject(pos) {
            _super.call(this, pos);
        }
        return PartsObject;
    })(Parts);
    wwa_parts_player.PartsObject = PartsObject;
    var PartsMap = (function (_super) {
        __extends(PartsMap, _super);
        function PartsMap(pos) {
            _super.call(this, pos);
        }
        return PartsMap;
    })(Parts);
    wwa_parts_player.PartsMap = PartsMap;
    var PlayerState;
    (function (PlayerState) {
        PlayerState[PlayerState["CONTROLLABLE"] = 0] = "CONTROLLABLE";
        PlayerState[PlayerState["MOVING"] = 1] = "MOVING";
        PlayerState[PlayerState["CAMERA_MOVING"] = 2] = "CAMERA_MOVING";
        PlayerState[PlayerState["MESSAGE_WAITING"] = 3] = "MESSAGE_WAITING";
        PlayerState[PlayerState["LOCALGATE_JUMPED"] = 4] = "LOCALGATE_JUMPED";
        PlayerState[PlayerState["BATTLE"] = 5] = "BATTLE";
        PlayerState[PlayerState["ESTIMATE_WINDOW_WAITING"] = 6] = "ESTIMATE_WINDOW_WAITING";
    })(PlayerState || (PlayerState = {}));
    var Player = (function (_super) {
        __extends(Player, _super);
        function Player(wwa, pos, camera, status, em) {
            this._status = status;
            this._equipStatus = new wwa_data.EquipmentStatus(0, 0);
            this._itemBox = new Array(Consts.ITEMBOX_SIZE);
            this._itemBoxElement = new Array(Consts.ITEMBOX_SIZE);
            this._itemUsingEvent = new Array(Consts.ITEMBOX_SIZE);
            for (var i = 0; i < this._itemBox.length; i++) {
                this._itemBox[i] = 0;
                wwa_util.$qsh("#aa-item-" + i).textContent = "-";
                this._itemBoxElement[i] = wwa_util.$qsh("#item" + i + ">.item-disp");
            }
            this.updateItemBox();
            this._energyMax = em;
            this._dir = 2 /* DOWN */;
            this._wwa = wwa;
            this._state = 0 /* CONTROLLABLE */;
            this._camera = camera;
            this._isPartsEventExecuted = false;
            this._energyValueElement = wwa_util.$qsh("#aa-eng");
            this._strengthValueElement = wwa_util.$qsh("#aa-str");
            this._defenceValueElement = wwa_util.$qsh("#aa-def");
            this._goldValueElement = wwa_util.$qsh("#aa-gld");
            this._isReadyToUseItem = false;
            this._isClickableItemGot = false;
            this._moves = 0;
            this.updateStatusValueBox();
            _super.call(this, pos);
        }
        Player.prototype.move = function () {
            if (this.isControllable()) {
                this.controll(this._dir);
                return;
            }
            if (this._state === 2 /* CAMERA_MOVING */) {
                try {
                    this._camera.move(this._dir);
                }
                catch (e) {
                }
                if (this._isOnCameraStopPosition()) {
                    this._state = 0 /* CONTROLLABLE */;
                }
            }
            else if (this._state === 1 /* MOVING */) {
                try {
                    var next = this._position.getNextFramePosition(this._dir, Consts.DEFAULT_SPEED, Consts.DEFAULT_SPEED);
                }
                catch (e) {
                }
                if (next.isJustPosition()) {
                    this._state = 0 /* CONTROLLABLE */;
                    this._moves++;
                    this._isPartsEventExecuted = false;
                    this._samePosLastExecutedMapID = void 0;
                    this._samePosLastExecutedObjID = void 0;
                }
                this._position = next;
            }
        };
        Player.prototype.controll = function (moveDir) {
            var nextFramePos;
            var nextJustPos;
            if (this.isControllable()) {
                this._dir = moveDir;
                try {
                    nextFramePos = this._position.getNextFramePosition(this._dir, Consts.DEFAULT_SPEED, Consts.DEFAULT_SPEED);
                    nextJustPos = this._position.getNextJustPosition(moveDir);
                }
                catch (e) {
                    // 範囲外座標
                    return;
                }
                if (this._isOnCameraMovingPosition()) {
                    ////////////////////// 本番ではデバッグ消すこと！！！//////////////////////
                    if (this._wwa.getMapIdByPosition(nextJustPos) !== 0 || this._wwa.debug) {
                        try {
                            this._camera.move(this._dir);
                            this._state = 2 /* CAMERA_MOVING */;
                        }
                        catch (e) {
                            // 範囲外座標
                            this._state = 0 /* CONTROLLABLE */;
                        }
                    }
                    return;
                }
                if (!this.canMoveTo(nextJustPos)) {
                    if (this._wwa.getMapTypeByPosition(nextJustPos) === Consts.MAP_WALL) {
                        this._wwa.checkMap(nextJustPos.getPartsCoord());
                    }
                    this._wwa.checkObject(nextJustPos.getPartsCoord());
                    return;
                }
                // カメラが動く場所(画面端)でなくて、移動可能なら移動モードに入って終わり
                this._position = nextFramePos;
                this._state = 1 /* MOVING */;
                this._wwa.moveObjects();
            }
        };
        // 座標posに移動できるならtrue, 移動できないならfalse       
        Player.prototype.canMoveTo = function (pos) {
            if (pos === null) {
                return false;
            }
            /////////// DEBUG //////////////
            if (this._wwa.debug) {
                return true;
            }
            ////////////////////////////////
            var w = this._wwa.getMapWidth();
            var pc = pos.getPartsCoord();
            var po = pos.getOffsetCoord();
            // 背景衝突判定1: 背景がない場合
            if (this._wwa.getMapIdByPosition(pos) === 0) {
                return false;
            }
            // 背景衝突判定2: 壁
            if (this._wwa.getMapTypeByPosition(pos) === Consts.MAP_WALL) {
                return false;
            }
            // 物体衝突判定1: 物体がない場合
            if (this._wwa.getObjectIdByPosition(pos) === 0) {
                return true;
            }
            // 物体衝突判定2: 通り抜け可能通常物体
            if (this._wwa.getObjectTypeByPosition(pos) === Consts.OBJECT_NORMAL && this._wwa.getObjectAttributeByPosition(pos, Consts.ATR_MODE) === Consts.PASSABLE_OBJECT) {
                return true;
            }
            // 物体衝突判定3: 通り抜け可能扉 (鍵アイテム所持時はアイテム処理を行うため通り抜け不可）
            if (this._wwa.getObjectTypeByPosition(pos) === Consts.OBJECT_DOOR && this._wwa.getObjectAttributeByPosition(pos, Consts.ATR_NUMBER) === Consts.PASSABLE_OBJECT) {
                if (this.hasItem(this._wwa.getObjectAttributeByPosition(pos, Consts.ATR_ITEM))) {
                    return false;
                }
                return true;
            }
            // その他の物体
            return false;
        };
        // プレイヤーが動いているかどうか。カメラが動いている場合も動いているとする。
        Player.prototype.isMoving = function () {
            return this._state == 1 /* MOVING */ || this._state == 2 /* CAMERA_MOVING */;
        };
        Player.prototype._isOnCameraMovingPosition = function () {
            var camPos = this._camera.getPosition().getPartsCoord();
            var pPos = this.getPosition().getPartsCoord();
            return ((pPos.x - camPos.x === Consts.H_PARTS_NUM_IN_WINDOW - 1 && this._dir === 1 /* RIGHT */) || (pPos.x === camPos.x && this._dir === 0 /* LEFT */) || (pPos.y - camPos.y === Consts.V_PARTS_NUM_IN_WINDOW - 1 && this._dir === 2 /* DOWN */) || (pPos.y === camPos.y && this._dir === 3 /* UP */));
        };
        Player.prototype._isOnCameraStopPosition = function () {
            var camPos = this._camera.getPosition().getPartsCoord();
            var pPos = this.getPosition().getPartsCoord();
            return ((pPos.x - camPos.x === Consts.H_PARTS_NUM_IN_WINDOW - 1 && this._dir === 0 /* LEFT */) || (pPos.x === camPos.x && this._dir === 1 /* RIGHT */) || (pPos.y - camPos.y === Consts.V_PARTS_NUM_IN_WINDOW - 1 && this._dir === 3 /* UP */) || (pPos.y === camPos.y && this._dir === 2 /* DOWN */));
        };
        Player.prototype.isControllable = function () {
            //            return this._state == PlayerState.CONTROLLABLE  && !( this._partsAppeared && this._wwa.getObjectIdByPosition(this._position)!== 0 ) ;
            return (this._state === 0 /* CONTROLLABLE */ && !this._partsAppeared && ((this._wwa.getMapTypeByPosition(this._position) !== Consts.MAP_LOCALGATE && this._wwa.getMapTypeByPosition(this._position) !== Consts.MAP_URLGATE) || !this._wwa.isPrevFrameEventExecuted()));
        };
        Player.prototype.getCopyOfItemBox = function () {
            return this._itemBox.slice();
        };
        Player.prototype.getDir = function () {
            return this._dir;
        };
        Player.prototype.getEnergyMax = function () {
            return this._energyMax;
        };
        Player.prototype.isJumped = function () {
            return this._state === 4 /* LOCALGATE_JUMPED */;
        };
        Player.prototype.setMessageWaiting = function () {
            this._state = 3 /* MESSAGE_WAITING */;
        };
        Player.prototype.isWaitingMessage = function () {
            return this._state === 3 /* MESSAGE_WAITING */;
        };
        Player.prototype.clearMessageWaiting = function () {
            if (this._state === 3 /* MESSAGE_WAITING */) {
                this._state = 0 /* CONTROLLABLE */;
                this._isPartsEventExecuted = true;
            }
        };
        Player.prototype.setEstimateWindowWating = function () {
            this._state = 6 /* ESTIMATE_WINDOW_WAITING */;
        };
        Player.prototype.isWatingEstimateWindow = function () {
            return this._state === 6 /* ESTIMATE_WINDOW_WAITING */;
        };
        Player.prototype.clearEstimateWindowWaiting = function () {
            if (this._state === 6 /* ESTIMATE_WINDOW_WAITING */) {
                this._state = 0 /* CONTROLLABLE */;
            }
        };
        Player.prototype.isPartsEventExecuted = function () {
            return this._isPartsEventExecuted;
        };
        Player.prototype.resetEventExecutionInfo = function () {
            this._isPartsEventExecuted = false;
        };
        Player.prototype.getLastExecPartsIDOnSamePosition = function (type) {
            return type === 1 /* MAP */ ? this._samePosLastExecutedMapID : this._samePosLastExecutedObjID;
        };
        Player.prototype.setLastExecInfoOnSamePosition = function (type, id) {
            if (type === 1 /* MAP */) {
                this._samePosLastExecutedMapID = id;
            }
            else {
                this._samePosLastExecutedObjID = id;
            }
        };
        Player.prototype.processAfterJump = function () {
            if (this._state !== 4 /* LOCALGATE_JUMPED */) {
                return;
            }
            if (--this._jumpWaitFramesRemain === 0) {
                this._state = 0 /* CONTROLLABLE */;
            }
        };
        Player.prototype.jumpTo = function (pos) {
            this._position = pos;
            if (!pos.isInCameraRange(this._camera)) {
                this._camera.reset(pos);
            }
            this._state = 4 /* LOCALGATE_JUMPED */;
            this._jumpWaitFramesRemain = Consts.LOCALGATE_PLAYER_WAIT_FRAME;
            this._samePosLastExecutedMapID = void 0;
            this._samePosLastExecutedObjID = void 0;
            // ジャンプ先がジャンプゲートの場合、下向きに設定
            if (pos.hasLocalGate()) {
                this._dir = 2 /* DOWN */;
            }
            else if (pos.getNextJustPosition(2 /* DOWN */).hasLocalGate()) {
                this._dir = 3 /* UP */;
            }
            else if (pos.getNextJustPosition(3 /* UP */).hasLocalGate()) {
                this._dir = 2 /* DOWN */;
            }
            else if (pos.getNextJustPosition(1 /* RIGHT */).hasLocalGate()) {
                this._dir = 0 /* LEFT */;
            }
            else if (pos.getNextJustPosition(0 /* LEFT */).hasLocalGate()) {
                this._dir = 1 /* RIGHT */;
            }
            else {
                this._dir = 2 /* DOWN */;
            }
        };
        // システムジャンプ (ロードなどによる強制移動)
        Player.prototype.systemJumpTo = function (pos) {
            this._position = pos;
            this._camera.reset(pos);
            this._camera.resetPreviousPosition();
            this._state = 4 /* LOCALGATE_JUMPED */;
            this._jumpWaitFramesRemain = Consts.LOCALGATE_PLAYER_WAIT_FRAME;
            this._samePosLastExecutedMapID = void 0;
            this._samePosLastExecutedObjID = void 0;
            this._dir = 2 /* DOWN */; // 向きは仮
        };
        Player.prototype.addStatusAll = function (s) {
            this._status.add(s);
            if (this.isDead()) {
                this._status.energy = 0;
            }
            if (this._energyMax !== 0) {
                this._status.energy = Math.min(this._status.energy, this._energyMax);
            }
            this.updateStatusValueBox();
            return this._status;
        };
        Player.prototype.setEnergyMax = function (em) {
            this._energyMax = em;
            this.updateStatusValueBox();
            return em;
        };
        Player.prototype.setEnergy = function (e) {
            this._status.energy = e;
            if (this.isDead()) {
                this._status.energy = 0;
            }
            if (this._energyMax !== 0) {
                this._status.energy = Math.min(this._status.energy, this._energyMax);
            }
            this.updateStatusValueBox();
            return e;
        };
        Player.prototype.damage = function (amount) {
            this._status.energy = Math.max(0, this._status.energy - amount);
            if (this.isDead()) {
                this._status.energy = 0;
            }
            if (this._energyMax !== 0) {
                this._status.energy = Math.min(this._status.energy, this._energyMax);
            }
            this.updateStatusValueBox();
        };
        Player.prototype.setStrength = function (s) {
            this._status.strength = s;
            return s;
        };
        Player.prototype.setDefence = function (d) {
            this._status.defence = d;
            this.updateStatusValueBox();
            return d;
        };
        Player.prototype.setGold = function (g) {
            this._status.gold = g;
            this.updateStatusValueBox();
            return g;
        };
        Player.prototype.getStatus = function () {
            return this._status.plus(this._equipStatus);
        };
        Player.prototype.getStatusWithoutEquipments = function () {
            // クローンハック
            return this._status.plus(new wwa_data.EquipmentStatus(0, 0));
        };
        Player.prototype.updateStatusValueBox = function () {
            var totalStatus = this._status.plus(this._equipStatus);
            var e = totalStatus.energy;
            var s = totalStatus.strength;
            var d = totalStatus.defence;
            var g = totalStatus.gold;
            this._energyValueElement.textContent = e + "";
            this._strengthValueElement.textContent = s + "";
            this._defenceValueElement.textContent = d + "";
            this._goldValueElement.textContent = g + "";
        };
        Player.prototype.updateItemBox = function () {
            var cx, cy;
            for (var i = 0; i < this._itemBoxElement.length; i++) {
                if (this._itemBox[i] === 0) {
                    this._itemBoxElement[i].style.backgroundPosition = "-40px 0px";
                }
                else {
                    cx = this._wwa.getObjectCropXById(this._itemBox[i]);
                    cy = this._wwa.getObjectCropYById(this._itemBox[i]);
                    this._itemBoxElement[i].style.backgroundPosition = "-" + cx + "px -" + cy + "px";
                }
            }
        };
        Player.prototype.isDead = function () {
            return this._status.energy <= 0;
        };
        Player.prototype.addItem = function (objID, itemPos) {
            var _this = this;
            if (itemPos === void 0) { itemPos = 0; }
            var insertPos;
            var oldObjID;
            var itemType;
            var border;
            // 任意位置挿入
            if (itemPos === 0) {
                if (objID === 0) {
                    return;
                }
                insertPos = this._getBlankItemPos();
                if (insertPos === Consts.ITEMBOX_IS_FULL) {
                    throw new Error("これ以上、アイテムを持てません。");
                }
                this._itemBox[insertPos - 1] = objID;
            }
            else {
                oldObjID = this._itemBox[itemPos - 1];
                this._itemBox[itemPos - 1] = objID;
                insertPos = this._getBlankItemPos();
                if (insertPos !== Consts.ITEMBOX_IS_FULL) {
                    insertPos = oldObjID;
                }
            }
            itemType = this._wwa.getObjectAttributeById(objID, Consts.ATR_MODE);
            if (itemType !== 0 /* NORMAL */) {
                wwa_util.$qsh("#aa-item-" + (insertPos - 1)).textContent = objID + "（使用可）";
                var mes = this._wwa.getSystemMessageById(0 /* CLICKABLE_ITEM */);
                if (!this._isClickableItemGot) {
                    if (mes !== "BLANK") {
                        this._wwa.setMessageQueue(mes === "" ? "このアイテムは右のボックスをクリックすることで使用できます。\n" + "使用できるアイテムは色枠で囲まれます。" : mes);
                    }
                    this._isClickableItemGot = true;
                }
                border = wwa_util.$qsh("#item" + (insertPos - 1) + ">.item-disp>img");
                border.style.display = "inline";
                this._itemUsingEvent[insertPos - 1] = function () {
                    console.log(_this.isControllable());
                    if (_this.isControllable()) {
                        _this._wwa.onselectitem(insertPos);
                    }
                };
                border.addEventListener("click", this._itemUsingEvent[insertPos - 1]);
            }
            else {
                wwa_util.$qsh("#aa-item-" + (insertPos - 1)).textContent = objID + "";
            }
            this._updateEquipmentStatus();
            this.updateItemBox();
        };
        Player.prototype._getBlankItemPos = function () {
            var insertPos;
            for (insertPos = 1; insertPos < this._itemBox.length + 1; insertPos++) {
                if (this._itemBox[insertPos - 1] === 0) {
                    return insertPos;
                }
            }
            return Consts.ITEMBOX_IS_FULL;
        };
        Player.prototype._updateEquipmentStatus = function () {
            var i;
            var newStatus = new wwa_data.EquipmentStatus(0, 0);
            for (i = 0; i < Consts.ITEMBOX_SIZE; i++) {
                if (this._itemBox[i] !== 0) {
                    newStatus.strength += this._wwa.getObjectAttributeById(this._itemBox[i], Consts.ATR_STRENGTH);
                    newStatus.defence += this._wwa.getObjectAttributeById(this._itemBox[i], Consts.ATR_DEFENCE);
                }
            }
            var diff = newStatus.minus(this._equipStatus);
            this._wwa.setStatusChangedEffect(diff);
            this._equipStatus = newStatus;
            this.updateStatusValueBox();
        };
        Player.prototype.hasItem = function (partsID) {
            for (var i = 0; i < Consts.ITEMBOX_SIZE; i++) {
                if (this._itemBox[i] === partsID) {
                    return true;
                }
            }
            return false;
        };
        Player.prototype.canUseItem = function (itemPos) {
            var partsID = this._itemBox[itemPos - 1];
            if (partsID === 0) {
                return false;
            }
            if (this._wwa.getObjectAttributeById(partsID, Consts.ATR_MODE) === 0 /* NORMAL */) {
                return false;
            }
            return true;
        };
        Player.prototype.useItem = function () {
            var itemID;
            var messageID;
            itemID = this._itemBox[this._readyToUseItemPos - 1];
            if (this._wwa.getObjectAttributeById(itemID, Consts.ATR_MODE) !== 2 /* NOT_DISAPPEAR */) {
                this.removeItemByItemPosition(this._readyToUseItemPos);
            }
            var bg = (wwa_util.$id("item" + (this._readyToUseItemPos - 1)));
            bg.classList.remove("onpress");
            this._isReadyToUseItem = false;
            this._readyToUseItemPos = void 0;
        };
        Player.prototype.canHaveMoreItems = function () {
            return this._getBlankItemPos() !== Consts.ITEMBOX_IS_FULL;
        };
        Player.prototype.removeItemByItemPosition = function (itemPos) {
            var border;
            if (this._itemBox[itemPos - 1] === 0) {
                return;
            }
            if (this._wwa.getObjectAttributeById(this._itemBox[itemPos - 1], Consts.ATR_MODE) !== 0 /* NORMAL */) {
                border = wwa_util.$qsh("#item" + (itemPos - 1) + ">.item-disp>img");
                border.removeEventListener("click", this._itemUsingEvent[itemPos - 1]);
                border.style.display = "none";
            }
            this._itemBox[itemPos - 1] = 0;
            wwa_util.$qsh("#aa-item-" + (itemPos - 1)).textContent = "-";
            this._updateEquipmentStatus();
            this.updateItemBox();
        };
        Player.prototype.removeItemByPartsID = function (partsID) {
            var border;
            if (!this.hasItem(partsID)) {
                throw new Error("アイテムを持っていない");
            }
            for (var i = 0; i < Consts.ITEMBOX_SIZE; i++) {
                if (this._itemBox[i] === partsID) {
                    if (this._wwa.getObjectAttributeById(this._itemBox[i], Consts.ATR_MODE) !== 0 /* NORMAL */) {
                        border = wwa_util.$qsh("#item" + i + ">.item-disp>img");
                        border.removeEventListener("click", this._itemUsingEvent[i]);
                        border.style.display = "none";
                    }
                    this._itemBox[i] = 0;
                    wwa_util.$qsh("#aa-item-" + i).textContent = "-";
                    this._updateEquipmentStatus();
                    this.updateItemBox();
                    return;
                }
            }
        };
        Player.prototype.clearItemBox = function () {
            for (var i = 1; i <= Consts.ITEMBOX_SIZE; i++) {
                this.removeItemByItemPosition(i);
            }
            this._updateEquipmentStatus();
            this.updateItemBox();
        };
        Player.prototype.hasGold = function (gold) {
            return this._status.gold >= gold;
        };
        Player.prototype.payGold = function (gold) {
            if (!this.hasGold(gold)) {
                throw new Error("お金が足りない");
            }
            this.setGold(this._status.gold - gold);
        };
        Player.prototype.earnGold = function (gold) {
            this.setGold(this._status.gold + gold);
        };
        Player.prototype.setPartsAppearedFlag = function () {
            this._partsAppeared = true;
        };
        Player.prototype.clearPartsAppearedFlag = function () {
            this._partsAppeared = false;
        };
        Player.prototype.isPartsAppearedTime = function () {
            return this._partsAppeared === true;
        };
        Player.prototype.startBattleWith = function (enemy) {
            this._isPlayerTurn = true;
            this._battleFrameCounter = Consts.BATTLE_INTERVAL_FRAME_NUM;
            this._battleTurnNum = 0;
            this._enemy = enemy;
            this._state = 5 /* BATTLE */;
        };
        Player.prototype.isFighting = function () {
            return this._state === 5 /* BATTLE */;
        };
        Player.prototype.isTurn = function () {
            return this._isPlayerTurn;
        };
        Player.prototype.fight = function () {
            if (!this.isFighting()) {
                throw new Error("バトルが開始されていません。");
            }
            if (--this._battleFrameCounter > 0) {
                return;
            }
            if (++this._battleTurnNum > Consts.BATTLE_SPEED_CHANGE_TURN_NUM) {
                this._battleFrameCounter = 1;
            }
            else {
                this._battleFrameCounter = Consts.BATTLE_INTERVAL_FRAME_NUM;
            }
            var playerStatus = this.getStatus();
            var enemyStatus = this._enemy.status;
            if (this._isPlayerTurn) {
                // プレイヤーターン
                if (playerStatus.strength > enemyStatus.defence || playerStatus.defence < enemyStatus.strength) {
                    // モンスターがこのターンで死なない場合
                    if (enemyStatus.energy > playerStatus.strength - enemyStatus.defence) {
                        if (playerStatus.strength > enemyStatus.defence) {
                            this._enemy.damage(playerStatus.strength - enemyStatus.defence);
                        }
                    }
                    else {
                        this._wwa.appearParts(this._enemy.position, 1 /* OBJECT */, this._enemy.partsID);
                        this.earnGold(enemyStatus.gold);
                        this._wwa.setStatusChangedEffect(new wwa_data.Status(0, 0, 0, enemyStatus.gold));
                        this._wwa.setPartsOnPosition(0 /* OBJECT */, this._enemy.item, this._enemy.position);
                        this._state = 0 /* CONTROLLABLE */; // メッセージキューへのエンキュー前にやるのが大事!!(エンキューするとメッセージ待ちになる可能性がある）
                        this._wwa.setMessageQueue(this._enemy.message, false);
                        this._enemy.battleEndProcess();
                        this._battleTurnNum = 0;
                        this._enemy = null;
                    }
                    this._isPlayerTurn = false;
                    return;
                }
                this._enemy.battleEndProcess();
                this._wwa.setMessageQueue("相手の防御能力が高すぎる！");
                this._battleTurnNum = 0;
                this._enemy = null;
            }
            else {
                // モンスターターン
                if (enemyStatus.strength > playerStatus.defence) {
                    // プレイヤーがまだ生きてる
                    if (playerStatus.energy > enemyStatus.strength - playerStatus.defence) {
                        this.damage(enemyStatus.strength - playerStatus.defence);
                    }
                    else {
                        this.setEnergy(0);
                        this._enemy.battleEndProcess();
                        this._state = 0 /* CONTROLLABLE */;
                        this._battleTurnNum = 0;
                        this._enemy = null;
                        this._wwa.gameover();
                    }
                }
            }
            this._isPlayerTurn = true;
        };
        Player.prototype.readyToUseItem = function (itemPos) {
            var itemID;
            var messageID;
            if (!this.canUseItem(itemPos)) {
                throw new Error("アイテムがないか、アイテムが使えません。");
            }
            itemID = this._itemBox[itemPos - 1];
            messageID = this._wwa.getObjectAttributeById(itemID, Consts.ATR_STRING);
            this._wwa.enqueueMessage(this._wwa.getMessageById(messageID));
            this._wwa.appearParts(this._position.getPartsCoord(), 1 /* OBJECT */, itemID);
            this._readyToUseItemPos = itemPos;
            this._isReadyToUseItem = true;
        };
        Player.prototype.isReadyToUseItem = function () {
            return this._isReadyToUseItem;
        };
        Player.prototype.getDrawingCenterPosition = function () {
            var pos = this._position.getPartsCoord();
            var poso = this._position.getOffsetCoord();
            var cameraPos = this._camera.getPosition();
            var cpParts = cameraPos.getPartsCoord();
            var cpOffset = cameraPos.getOffsetCoord();
            var targetX = (pos.x - cpParts.x) * Consts.CHIP_SIZE + poso.x - cpOffset.x + Consts.CHIP_SIZE / 2;
            var targetY = (pos.y - cpParts.y) * Consts.CHIP_SIZE + poso.y - cpOffset.y + Consts.CHIP_SIZE / 2;
            return new wwa_data.Coord(targetX, targetY);
        };
        Player.prototype.getMoveCount = function () {
            return this._moves;
        };
        Player.prototype.setMoveCount = function (count) {
            return this._moves = count;
        };
        return Player;
    })(PartsObject);
    wwa_parts_player.Player = Player;
})(wwa_parts_player || (wwa_parts_player = {}));
var wwa_monster;
(function (wwa_monster) {
    var Monster = (function () {
        function Monster(_partsID, _position, _imgCoord, _status, _message, _item, _battleEndCallback) {
            this._partsID = _partsID;
            this._position = _position;
            this._imgCoord = _imgCoord;
            this._status = _status;
            this._message = _message;
            this._item = _item;
            this._battleEndCallback = _battleEndCallback;
        }
        Object.defineProperty(Monster.prototype, "partsID", {
            get: function () {
                return this._partsID;
            },
            enumerable: true,
            configurable: true
        });
        Object.defineProperty(Monster.prototype, "position", {
            get: function () {
                return this._position;
            },
            enumerable: true,
            configurable: true
        });
        Object.defineProperty(Monster.prototype, "imgCoord", {
            get: function () {
                return this._imgCoord;
            },
            enumerable: true,
            configurable: true
        });
        Object.defineProperty(Monster.prototype, "status", {
            get: function () {
                return this._status;
            },
            enumerable: true,
            configurable: true
        });
        Object.defineProperty(Monster.prototype, "message", {
            get: function () {
                return this._message;
            },
            enumerable: true,
            configurable: true
        });
        Object.defineProperty(Monster.prototype, "item", {
            get: function () {
                return this._item;
            },
            enumerable: true,
            configurable: true
        });
        Monster.prototype.damage = function (amount) {
            this._status.energy = Math.max(0, this._status.energy - amount);
        };
        Monster.prototype.battleEndProcess = function () {
            this._battleEndCallback();
        };
        return Monster;
    })();
    wwa_monster.Monster = Monster;
})(wwa_monster || (wwa_monster = {}));
var wwa_motion;
(function (wwa_motion) {
    var ObjectMovingData = (function () {
        function ObjectMovingData(_objectID, _srcPos, _destPos, _dir) {
            this._objectID = _objectID;
            this._srcPos = _srcPos;
            this._destPos = _destPos;
            this._dir = _dir;
            this._currentPos = this._srcPos.clone();
        }
        ObjectMovingData.prototype.update = function () {
            this._currentPos = this._currentPos.getNextFramePosition(this._dir, wwa_data.WWAConsts.DEFAULT_SPEED, wwa_data.WWAConsts.DEFAULT_SPEED);
            return this._currentPos;
        };
        Object.defineProperty(ObjectMovingData.prototype, "isAchievedDestination", {
            get: function () {
                return this._currentPos.equals(this._destPos);
            },
            enumerable: true,
            configurable: true
        });
        Object.defineProperty(ObjectMovingData.prototype, "currentPosition", {
            get: function () {
                return this._currentPos;
            },
            enumerable: true,
            configurable: true
        });
        Object.defineProperty(ObjectMovingData.prototype, "beforePosition", {
            get: function () {
                return this._srcPos;
            },
            enumerable: true,
            configurable: true
        });
        Object.defineProperty(ObjectMovingData.prototype, "destination", {
            get: function () {
                return this._destPos;
            },
            enumerable: true,
            configurable: true
        });
        Object.defineProperty(ObjectMovingData.prototype, "objID", {
            get: function () {
                return this._objectID;
            },
            enumerable: true,
            configurable: true
        });
        return ObjectMovingData;
    })();
    wwa_motion.ObjectMovingData = ObjectMovingData;
    var ObjectMovingDataManager = (function () {
        // TODO: シングルトンにする
        function ObjectMovingDataManager(_wwa) {
            this._wwa = _wwa;
            this.clear();
        }
        ObjectMovingDataManager.prototype.add = function (objectID, srcPos, destPos, dir) {
            this._queue.push(new ObjectMovingData(objectID, srcPos, destPos, dir));
        };
        //  動き終わったオブジェクトからなる配列を返します。
        ObjectMovingDataManager.prototype.update = function () {
            var endObjects = [];
            var continueObjects = [];
            for (var i = 0; i < this._queue.length; i++) {
                this._queue[i].update();
                if (this._queue[i].isAchievedDestination) {
                    endObjects.push(this._queue[i]);
                    this._wwa.setPartsOnPosition(0 /* OBJECT */, 0, this._queue[i].beforePosition.getPartsCoord());
                    this._wwa.setPartsOnPosition(0 /* OBJECT */, this._queue[i].objID, this._queue[i].destination.getPartsCoord());
                }
                else {
                    continueObjects.push(this._queue[i]);
                }
            }
            this._queue = continueObjects;
            return endObjects;
        };
        ObjectMovingDataManager.prototype.clear = function () {
            this._queue = [];
        };
        Object.defineProperty(ObjectMovingDataManager.prototype, "objectMovingData", {
            // crop座標と描画先座標の組の配列を返すメソッドを実装せよ
            get: function () {
                return this.objectMovingData;
            },
            enumerable: true,
            configurable: true
        });
        // 本当はnullを返したくはないんだけど、例外を投げると重くなるので
        ObjectMovingDataManager.prototype.getOffsetByBeforePartsCoord = function (coord) {
            var result = this._queue.filter(function (x) {
                return x.beforePosition.getPartsCoord().equals(coord);
            });
            if (result.length === 0) {
                return null;
            }
            return result[0].currentPosition.getOffsetCoord();
        };
        return ObjectMovingDataManager;
    })();
    wwa_motion.ObjectMovingDataManager = ObjectMovingDataManager;
})(wwa_motion || (wwa_motion = {}));
//# sourceMappingURL=wwa.js.map