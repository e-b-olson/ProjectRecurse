export class Action {
    title;
    complete;

    constructor(data = {}) {
        this.title = ("title" in data) ? data.title : "";
        this.complete = ("complete" in data) ? data.complete : false;
    }
}