class UIService extends egret.DisplayObjectContainer {
    dialog:Dialog;
    private static instance;
    static getInstance(): UIService {
        if (UIService.instance == null)
            UIService.instance = new UIService();
        return UIService.instance;
    }

    constructor() {
        super();
        //this.dialog = new Dialog();
    }

    displayDialog(dialog:Dialog) {
        this.dialog = dialog;
        this.addChild(this.dialog);
        this.dialog.addEventListener(egret.TouchEvent.TOUCH_TAP,this.nextDialog,this);
    }

    nextDialog(){
        console.log("tap @ UIService");
        if(!this.dialog.nextDialog()){
            this.removeDialog();
            this.dialog.removeEventListener(egret.TouchEvent.TOUCH_TAP,this.nextDialog,this.dialog);
    }
    }
    removeDialog() {
        this.removeChild(this.dialog);
        this.removeEventListener(egret.TouchEvent.TOUCH_TAP,this.nextDialog,this);
        //todo delete
        MissionService.getInstance().submitMission(this.dialog.mission.getID());
        MissionService.getInstance().acceptMission(this.dialog.mission.getID());
        MAP.MapService.getInstance().getNPC(this.dialog.personID).addListener();
    }
}