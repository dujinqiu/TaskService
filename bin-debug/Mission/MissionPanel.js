var MISSIONPANEL_WIDTH = 300;
var MISSIONPANEL_HEIGHT = 150;
var LINE_SPACE = 20;
/**写得什么辣鸡 11.23 */
var MissionPanel = (function (_super) {
    __extends(MissionPanel, _super);
    function MissionPanel() {
        _super.call(this);
        this.missionList = [];
        var service = MissionService.getInstance();
        service.addObserver(this);
        var missionList = service.getMissionByCustomRule(this.rule_interactable, this);
        this.bg = new egret.Shape();
        this.bg.graphics.beginFill(0x000000);
        this.bg.graphics.drawRect(0, 0, MISSIONPANEL_WIDTH, MISSIONPANEL_HEIGHT);
        this.bg.graphics.endFill();
        this.bg.alpha = 0.5;
        this.addChild(this.bg);
    }
    var d = __define,c=MissionPanel,p=c.prototype;
    /**include  during, submittable */
    p.rule_interactable = function (missions, self) {
        for (var index in missions) {
            var status = missions[index].status;
            if (status == MissionStatus.DURING ||
                status == MissionStatus.SUBMITTABLE) {
                self.missionList.push(missions[index]);
            }
        }
        self.updateView();
    };
    p.addMission = function (mission) {
        if (this.missionList.indexOf(mission) < 0) {
            this.missionList.push(mission);
            this.sortListandUpdateView();
        }
        else
            return;
    };
    p.deleteMission = function (mission) {
        var index = this.missionList.indexOf(mission);
        if (index != -1) {
            this.missionList.splice(index, 1);
            this.sortListandUpdateView();
        }
        else
            console.error("nothing to delete");
    };
    p.onChange = function (mission) {
        var shouldDisplay = (mission.status == MissionStatus.DURING || mission.status == MissionStatus.SUBMITTABLE);
        var newElement = Boolean(this.missionList.indexOf(mission) == -1);
        if (newElement && shouldDisplay)
            this.addMission(mission);
        if (shouldDisplay)
            this.sortListandUpdateView();
        else if (!newElement && !shouldDisplay)
            this.deleteMission(mission);
    };
    p.sortListandUpdateView = function () {
        this.missionList.sort(function (a, b) {
            var valueA, valueB;
            var result = 0;
            return b.getStatus() - a.getStatus() +
                0.01 * (Number(b.getFromID()) - Number(a.getFromID())); //降序
        });
    };
    p.updateView = function () {
        for (var index in this.textFieldList) {
            this.textFieldList[index].y = Number(index) * LINE_SPACE;
        }
        if (this.missionList.length > 0) {
            this.removeChildren();
            this.addChild(this.bg);
            this.textFieldList.splice(0);
            for (var index in this.missionList) {
                var mission = this.missionList[index];
                var newText = new egret.TextField();
                newText.text = mission.getName() + " (" + mission.getStatusString() + ")";
                this.textFieldList.push(newText);
                newText.y = Number(index) * 20;
                this.addChild(newText);
            }
        }
    };
    return MissionPanel;
}(egret.DisplayObjectContainer));
egret.registerClass(MissionPanel,'MissionPanel',["Observer"]);
//# sourceMappingURL=MissionPanel.js.map