export default class PostViewModel {
    get id() {
        return this._id;
    }

    get description() {
        return this._description;
    }

    get imageUrl() {
        return this._imageUrl;
    }

    get createdAt() {
        return this._createdAt;
    }

    get updatedAt() {
        return this._updatedAt;
    }

    get username(){
        return this._username;
    }

    constructor(object) {
        this._id = object.testPost.id;
        this._description = object.testPost.description;
        this._imageUrl = object.testPost.imageUrl
        this._createdAt = object.testPost.createdAt;
        this._updatedAt = object.testPost.updatedAt;
        this._username = object.username;
    }
}