export default class PostViewModel {
    get id() {
        return this._id;
    }

    get description() {
        return this._description;
    }

    get createdAt() {
        return this._createdAt;
    }

    get updatedAt() {
        return this._updatedAt;
    }

    constructor(object) {
        this._id = object.id;
        this._description = object.description;
        this._createdAt = object.createdAt;
        this._updatedAt = object.updatedAt;
    }
}