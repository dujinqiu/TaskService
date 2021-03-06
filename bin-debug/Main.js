var TIME = 0;
var Main = (function (_super) {
    __extends(Main, _super);
    function Main() {
        _super.call(this);
        this.addEventListener(egret.Event.ADDED_TO_STAGE, this.onAddToStage, this);
    }
    var d = __define,c=Main,p=c.prototype;
    /**
     * 创建游戏场景
     * Create a game scene
     */
    p.createGameScene = function () {
        //加载任务系统
        var stageW = this.stage.stageWidth;
        this.missionPanel = new MissionPanel();
        this.missionPanel.x = stageW - this.missionPanel.width;
        MissionService.getInstance().loadMissions();
        //加载状态机
        this.stateMachine = new GameStateMachine();
        //加载地图
        this.mapService = MAP.MapService.getInstance();
        this.mapService.loadNPCs();
        this.mapService.loadMap();
        this.mapService.loadMachine(this.stateMachine);
        //加载人物
        this.player = Player.getInstance();
        this.stateMachine.addState(this.player.curState);
        this.player.y = SIZE48;
        this.player.searchAgent = new AStarSearch(this.mapService.curMap.objGrid, this.mapService.curMap.creatureGrid);
        //this.player.addObserver(MissionService.getInstance());
        //add other people here
        egret.startTick(this.stateMachine.runMachine, this.stateMachine);
        //加载怪物
        MonsterService.getInstance().loadMonsters();
        this.touchEnabled = true;
        this.addChild(this.mapService);
        this.addChild(this.player);
        this.addChild(this.missionPanel);
        this.addChild(MonsterService.getInstance());
        this.addChild(UIService.getInstance());
        this.addEventListener(egret.TouchEvent.TOUCH_TAP, this.onTap, this);
        //test here
        //this.player.acceptMission("00100201");
    };
    p.onTap = function (event) {
        //    console.log(event.target);
    };
    p.onAddToStage = function (event) {
        //设置加载进度界面
        //Config to load process interface
        this.loadingView = new LoadingUI();
        this.stage.addChild(this.loadingView);
        //初始化Resource资源加载库
        //initiate Resource loading library
        RES.addEventListener(RES.ResourceEvent.CONFIG_COMPLETE, this.onConfigComplete, this);
        RES.loadConfig("resource/default.res.json", "resource/");
    };
    /**
     * 配置文件加载完成,开始预加载preload资源组。
     * configuration file loading is completed, start to pre-load the preload resource group
     */
    p.onConfigComplete = function (event) {
        RES.removeEventListener(RES.ResourceEvent.CONFIG_COMPLETE, this.onConfigComplete, this);
        RES.addEventListener(RES.ResourceEvent.GROUP_COMPLETE, this.onResourceLoadComplete, this);
        RES.addEventListener(RES.ResourceEvent.GROUP_LOAD_ERROR, this.onResourceLoadError, this);
        RES.addEventListener(RES.ResourceEvent.GROUP_PROGRESS, this.onResourceProgress, this);
        RES.addEventListener(RES.ResourceEvent.ITEM_LOAD_ERROR, this.onItemLoadError, this);
        RES.loadGroup("preload");
    };
    /**
     * preload资源组加载完成
     * Preload resource group is loaded
     */
    p.onResourceLoadComplete = function (event) {
        if (event.groupName == "preload") {
            this.stage.removeChild(this.loadingView);
            RES.removeEventListener(RES.ResourceEvent.GROUP_COMPLETE, this.onResourceLoadComplete, this);
            RES.removeEventListener(RES.ResourceEvent.GROUP_LOAD_ERROR, this.onResourceLoadError, this);
            RES.removeEventListener(RES.ResourceEvent.GROUP_PROGRESS, this.onResourceProgress, this);
            RES.removeEventListener(RES.ResourceEvent.ITEM_LOAD_ERROR, this.onItemLoadError, this);
            this.createGameScene();
        }
    };
    /**
     * 资源组加载出错
     *  The resource group loading failed
     */
    p.onItemLoadError = function (event) {
        console.warn("Url:" + event.resItem.url + " has failed to load");
    };
    /**
     * 资源组加载出错
     *  The resource group loading failed
     */
    p.onResourceLoadError = function (event) {
        console.warn("Group:" + event.groupName + " has failed to load");
        //忽略加载失败的项目
        //Ignore the loading failed projects
        this.onResourceLoadComplete(event);
    };
    /**
     * preload资源组加载进度
     * Loading process of preload resource group
     */
    p.onResourceProgress = function (event) {
        if (event.groupName == "preload") {
            this.loadingView.setProgress(event.itemsLoaded, event.itemsTotal);
        }
    };
    return Main;
}(egret.DisplayObjectContainer));
egret.registerClass(Main,'Main');
//# sourceMappingURL=Main.js.map