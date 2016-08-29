
export default class ShapeCache {
    constructor() {
        this.cache = {};
    }

    set(shapeId, shapes) {
        this.cache[shapeId] = shapes;
    }

    get(shapeId) {
        if(this.cache.hasOwnProperty(shapeId)) {
            return this.cache[shapeId];
        }
        return undefined;
    }
}
