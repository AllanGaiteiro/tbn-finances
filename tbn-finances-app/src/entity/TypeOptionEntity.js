export class TypeOptionEntity {
    constructor() {
        this.label = '';
        this.value = '';
        this.action = 'unica_padrao'; // unica | unica_padrao | recorrente;
        this.id = '';
    }

    static fromFirebase(data) {
        const type = new TypeOptionEntity();
        type.id = data.id;
        type.label = data.label;
        type.value = data.value;
        type.action = data.action;
        return type;
    }

    toFirestore() {
        return {
            id: this.id,
            label: this.label,
            value: this.value,
            action: this.action,
        };
    }
}
