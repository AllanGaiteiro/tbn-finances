
export class FiltersEntity {
    constructor() {
        this.month = new Date().getMonth();
        this.year = new Date().getFullYear();
        this.text = '';
        this.sortOrder = "desc";//'lastUpdateDate';
        this.sortBy = 'lastUpdateDate';
        this.status = null;
    }
}
