class IndexedDB {
    constructor(storeName, version = 1) {
        this.storeName = storeName;
        this.version = version || 1;
        this.db = window.indexedDB || window.mozIndexedDB || window.webkitIndexedDB || window.msIndexedDB;
        this.transaction = window.IDBTransaction || window.webkitIDBTransaction || window.msIDBTransaction;
        this.keyRange = window.IDBKeyRange || window.webkitIDBKeyRange || window.msIDBKeyRange;
    }

    onError(err) {
        console.error(err);
    }

    open() {
        return new Promise((resolve, reject) => {
            let r = this.db.open(this.storeName, this.version);
            r.onerror = (err) => {
                reject(err);
                this.onError(err);
            };
            r.onupgradeneeded = (e) => {
                let _db = e.target.result, names = _db.objectStoreNames;
                if (!names.contains(this.storeName)) {
                    _db.createObjectStore(this.storeName, {
                        keyPath: 'id',
                        autoIncrement: true
                    });
                }
            };
            r.onsuccess = (e) => {
                this.instance = r.result;
                this.instance.onerror = this.onError;
                resolve();
            };
        });
    }

    getStore(mode) {
        mode = mode || 'readonly';
        let t = this.instance.transaction([this.storeName], mode);
        let store = t.objectStore(this.storeName);
        return store;
    }

    save(data) {
        return new Promise((resolve, reject) => {
            this.open().then(() => {
                let store, request, mode = 'readwrite';
                store = this.getStore(mode), request = data.id ? store.put(data) : store.add(data);
                request.onsuccess = () => {
                    resolve();
                };
            });
        });
    }

    getAll() {
        return new Promise((resolve, reject) => {
            this.open().then(() => {
                let store = this.getStore(), cursor = store.openCursor(), data = [];
                cursor.onsuccess = (e) => {
                    var result = e.target.result;
                    if (result) {
                        data.push(result.value);
                        result.continue();
                    } else {
                        resolve(data);
                    }
                };
            });
        });
    }

    get(id) {
        return new Promise((resolve, reject) => {
            this.open().then(() => {
                id = parseInt(id);
                let store = this.getStore(), request = store.get(id);
                request.onsuccess = (e) => {
                    resolve(e.target.result);
                };
            });
        });
    }

    delete(id) {
        return new Promise((resolve, reject) => {
            this.open().then(() => {
                id = parseInt(id);
                let mode = 'readwrite', store, request;
                store = this.getStore(mode);
                request = store.delete(id);
                request.onsuccess = () => {
                    resolve();
                };
            });
        });
    }

    deleteAll() {
        return new Promise((resolve, reject) => {
            this.open().then(() => {
                let mode = 'readwrite', store, request;
                store = this.getStore(mode);
                request = store.clear();
                request.onsuccess = () => {
                    resolve();
                };
            });
        });
    }
}
