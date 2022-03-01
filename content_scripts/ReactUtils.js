export default class ReactUtils {
    constructor () {}

    ReactKey = (elem, prefix) => {
        // Object.keys() doesn't like null and undefined
        if (elem == null || elem == undefined) {
            return;
        }
    
        // find it's react internal instance key
        let key = Object.keys(elem).find(key => key.startsWith(prefix));
    
        // get the react internal instance
        return elem[key];
    }

    ReactInternal = (elem) => {
        return this.ReactKey(elem, "__reactInternalInstance$");
    }

    ReactEvents = (elem) => {
        return this.ReactKey(elem, "__reactEventHandlers$");
    }

    ReactFiber = (elem) => {
        return this.ReactKey(elem, "__reactFiber$");
    }
    
    ReactProps = (elem) => {
        return this.ReactKey(elem, "__reactProps$");
    }
}
