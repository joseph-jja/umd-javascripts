// if either of these are not enabled then we create an object that 
// one can new and get an instance of a javascript interface to this object
import * as stack from "commonUtils/stack";

function Store() {
    this.data = new stack.Stack(),
        this.keys = {};
}

Store.prototype.setItem = function ( key, value ) {
    this.data.push( key, value );
    this.keys[ key ] = value;
};

Store.prototype.getItem = function ( key ) {
    return this.data.get( key );
};

Store.prototype.removeItem = function ( key ) {
    this.keys[ key ] = undefined;
    this.data.pop( key );
};

Store.prototype.key = function ( key ) {
    return this.keys[ key ];
};

Store.prototype.clear = function () {
    this.data.clear();
    this.keys = [];
};

export {
    Store
};
