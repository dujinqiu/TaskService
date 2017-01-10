
//???必须放在开头，为什么？
enum MissionStatus {
    SUBMITTED,//不显示
    UNACCEPTABLE,//灰叹号
    DURING,//不显示/灰问号
    ACCEPTABLE,//黄叹号
    SUBMITTABLE,//黄问号
}

interface EventEmitter {
    observerList: Array<Observer>;
    addObserver(o: Observer);
    notify(event: any);
}

//防御式
class MissionService {
    private static instance = new MissionService();
    player: Player;

    //储存所有任务，待优化
    private observerList: Array<Observer> = new Array<Observer>();
    private missionList: missionList;

    static getInstance(): MissionService {
        if (MissionService.instance == null)
            MissionService.instance = new MissionService();
        return MissionService.instance;
    }

    loadMissions() {
        /*for (var index in missionJson) {
            missionJson[index].id//id
            missionJson[index].name//name
            missionJson[index].description//description
            missionJson[index].finishCondition.level
        }*/
        this.missionList = {};
        this.missionList = createMissionsFactory();
    }

    getMissionById(missionID: string): Mission {
        return this.missionList[missionID];
    }

    getMissionByCustomRule(rule: Function, self: any) {
        rule(this.missionList, self);
    }

    constructor() {
        //init all missions
        if (MissionService.instance)
            throw new Error("don't use constructor of MissionSystem");
        MissionService.instance = this;
    }



    notify(mission: Mission) {
        for (let i in this.observerList) {
            this.observerList[i].onChange(mission);
        }
    }

    toAcceptable(missionID: string): boolean {
        var m = this.missionList[missionID];
        if (m.toAcceptable()) {
            this.notify(m);
            return true;
        }
        console.error("can't to acceptable" + missionID);
        return false;
    }

    toAcceptable_all() {
        for (var index in this.missionList) {
            this.toAcceptable(index);
        }
    }
    acceptMission(missionID: string): boolean {
        var m = this.missionList[missionID];
        if (m.accept()) {
            this.toSubmittable(missionID);
            this.notify(m);
            return true;
        }
        return false;
    }

    toSubmittable(missionID: string): boolean {
        var m = this.missionList[missionID];
        if (m.toSubmittable()) {
            this.notify(m);
            return true;
        }
        return false;
    }

    submitMission(missionID: string, player?: Player): boolean {
        var m = this.missionList[missionID];
        if (m.submit()) {
            this.notify(m);
            return true;
        }
        return false;
    }

    addObserver(observer: Observer) {
        this.observerList.push(observer);
    }

    haveID(id: string): boolean {
        if (this.missionList[id])
            return true;
        else
            return false;
    }

    /**更新任务状态 */
    /*onChange(player: Player) {
        for (var id in this.missionList) {
            var mission = this.missionList[id];
            if (mission.status == MissionStatus.UNACCEPTABLE) {
                if (mission.toAcceptable(player))
                    this.notify(mission);
            }
            if (mission.status == MissionStatus.DURING) {
                if( mission.toSubmittable(player))
                    this.notify(mission);
            }
        }
    }*/
    /*deleteObserver(observer:MissionObserver){
        this.observerList.
    }*/
}

type missionList = {
    [id: string]: Mission
};

interface Observer {
    onChange(...a);
}

