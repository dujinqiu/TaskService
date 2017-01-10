var missionJson: MissionJsonType[] = [
    {
        id: "00200302", name: "level up!", description: ["reach level 2"],
        acceptCondition: { level: 1 }, finishCondition: { level: 5 }
    },
    {
        id: "00100201", name: "welcome", description: ["welcome to egret","wwww"]
    },
    {
        id: "00200101", name: "kill monsters for me", description: ["please kill 5 slimes and 2 brocolies for me!"],
        acceptCondition: { level: 1 }, finishCondition: { kill: { "slime": 5} }
    },
    {
        id: "00100202", name: "welcome2", description: ["welcome to egret2"],
        acceptCondition: { level: 2 }
    }
]


function createCondition(data: any): MissionCondition {
    if (!data) {
        return null;
    }
    if (data.level) {
        return new LevelMissionCondition(data.level);
    }
    if (data.kill)
        return new KillMonsterMissionCondition(data.kill);
}

function createMissionsFactory(): missionList {
    var result: missionList = {};
    for (let index in missionJson) {
        var current = missionJson[index];
        var acceptCondition = createCondition(current.acceptCondition);
        var finishCondition = createCondition(current.finishCondition);
        result[current.id] = new Mission(current.id, current.name, current.description,
            acceptCondition, finishCondition);
        result[current.id].toAcceptable();
    }
    return result;
}

interface MissionJsonType {
    id: string;
    name: string;
    description: string[];
    acceptCondition?: any;
    finishCondition?: any;
}

