class Monster extends egret.DisplayObjectContainer {
    name: string;
    status: MonsterStatus;
    appearance: egret.Bitmap;
    constructor() {
        super();
        this.name = "slime";
        this.status = MonsterStatus.ALIVE;
        this.appearance = new egret.Bitmap(RES.getRes("Slime_png"));
        this.addChild(this.appearance);
        this.touchEnabled = true;
        this.x = 150;
        this.y = 780;
    }

    goDie(){
        console.log("die");
        this.status = MonsterStatus.DEAD;
    }
    
}
enum MonsterStatus {
    ALIVE,
    DEAD
}

class MonsterService extends egret.DisplayObjectContainer implements EventEmitter {
    private static instance;
    monsterList: Array<Monster>;
    observerList: Array<Observer>;
    static getInstance():MonsterService {
        if (MonsterService.instance == null)
            MonsterService.instance = new MonsterService();
        return MonsterService.instance;
    }
    constructor() {
        super();
        this.observerList = new Array<Observer>();
        this.monsterList = new Array<Monster>();
        this.addEventListener(egret.TouchEvent.TOUCH_TAP,this.onTap,this);
    }
    
    onTap(e:egret.TouchEvent){
        console.log("tap @ monsterService");
        var monster = e.target;
        this.killMonster(monster);

    }

    killMonster(monster:Monster){
        monster.goDie();
        this.monsterList.splice(this.monsterList.indexOf(monster),1);
        this.removeChild(monster);
        this.notify(monster);
        this.addMonster();
    }

    loadMonsters() {
        this.monsterList.push(new Monster());
        this.addChild(this.monsterList[0]);
        this.updateView();
    }

    addMonster(){
        this.monsterList.push(new Monster());
        this.addChild(this.monsterList[0]);
        this.updateView();
    }

    addObserver(o: Observer) {
        this.observerList.push(o);
    }

    notify(monster: Monster) {
        for (var index in this.observerList)
            this.observerList[index].onChange(monster);
    }

    updateView() {

    }
}