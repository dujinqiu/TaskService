var Monster = (function (_super) {
    __extends(Monster, _super);
    function Monster() {
        _super.call(this);
        this.name = "slime";
        this.status = MonsterStatus.ALIVE;
        this.appearance = new egret.Bitmap(RES.getRes("Slime_png"));
        this.addChild(this.appearance);
        this.touchEnabled = true;
        this.x = 150;
        this.y = 780;
    }
    var d = __define,c=Monster,p=c.prototype;
    p.goDie = function () {
        console.log("die");
        this.status = MonsterStatus.DEAD;
    };
    return Monster;
}(egret.DisplayObjectContainer));
egret.registerClass(Monster,'Monster');
var MonsterStatus;
(function (MonsterStatus) {
    MonsterStatus[MonsterStatus["ALIVE"] = 0] = "ALIVE";
    MonsterStatus[MonsterStatus["DEAD"] = 1] = "DEAD";
})(MonsterStatus || (MonsterStatus = {}));
var MonsterService = (function (_super) {
    __extends(MonsterService, _super);
    function MonsterService() {
        _super.call(this);
        this.observerList = new Array();
        this.monsterList = new Array();
        this.addEventListener(egret.TouchEvent.TOUCH_TAP, this.onTap, this);
    }
    var d = __define,c=MonsterService,p=c.prototype;
    MonsterService.getInstance = function () {
        if (MonsterService.instance == null)
            MonsterService.instance = new MonsterService();
        return MonsterService.instance;
    };
    p.onTap = function (e) {
        console.log("tap @ monsterService");
        var monster = e.target;
        this.killMonster(monster);
    };
    p.killMonster = function (monster) {
        monster.goDie();
        this.monsterList.splice(this.monsterList.indexOf(monster), 1);
        this.removeChild(monster);
        this.notify(monster);
        this.addMonster();
    };
    p.loadMonsters = function () {
        this.monsterList.push(new Monster());
        this.addChild(this.monsterList[0]);
        this.updateView();
    };
    p.addMonster = function () {
        this.monsterList.push(new Monster());
        this.addChild(this.monsterList[0]);
        this.updateView();
    };
    p.addObserver = function (o) {
        this.observerList.push(o);
    };
    p.notify = function (monster) {
        for (var index in this.observerList)
            this.observerList[index].onChange(monster);
    };
    p.updateView = function () {
    };
    return MonsterService;
}(egret.DisplayObjectContainer));
egret.registerClass(MonsterService,'MonsterService',["EventEmitter"]);
//# sourceMappingURL=MonsterService.js.map