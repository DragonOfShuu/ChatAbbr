import { AbbrType, getAbbrList } from "../database/abbrAPI";

type AbbrView = {
    hotkeys?: string[]
    output?: string
}

class DataStateModel {
    public abbrlist: AbbrType[] = [];
    public viewAbbrList: AbbrView[] = [];

    async initalize() {
        this.abbrlist = await getAbbrList();
        this.viewAbbrList = this.abbrlist;
    }
}

export default DataStateModel;