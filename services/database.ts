// services/database.ts
export class DatabaseService {
    private db: IDBDatabase;
    private storeName: string;
    private usesInlineKeys: boolean;

    constructor(db: IDBDatabase, storeName: string, usesInlineKeys = true) {
        this.db = db;
        this.storeName = storeName;
        this.usesInlineKeys = usesInlineKeys;
    }
    
    save<T>(value: T, key?: IDBValidKey): Promise<IDBValidKey> {
        return new Promise((resolve, reject) => {
            const transaction = this.db.transaction(this.storeName, 'readwrite');
            const store = transaction.objectStore(this.storeName);

            let request: IDBRequest;

            if (this.usesInlineKeys && key !== undefined) {
                // For stores with inline keys, merge the key into the value
                request = store.put({ ...value, id: key });
            } else if (!this.usesInlineKeys && key !== undefined) {
                // For stores without inline keys, use the explicit key
                request = store.put(value, key);
            } else {
                // Auto-increment case
                request = store.add(value);
            }

            request.onsuccess = () => resolve(request.result);
            request.onerror = () => reject(request.error);
        });
    }

    add<T>(value: T, key?: IDBValidKey): Promise<IDBValidKey> {
        return new Promise((resolve, reject) => {
            const transaction = this.db.transaction(this.storeName, 'readwrite');
            const store = transaction.objectStore(this.storeName);

            const request = key ? store.put(value, key) : store.add(value);

            request.onsuccess = () => resolve(request.result);
            request.onerror = () => reject(request.error);
        });
    }
    get<T>(key: IDBValidKey): Promise<T | undefined> {
        return new Promise((resolve, reject) => {
            // Validate the key first
            if (key === undefined || key === null) {
                reject(new Error('No key specified for get operation'));
                return;
            }

            const transaction = this.db.transaction(this.storeName, 'readonly');
            const store = transaction.objectStore(this.storeName);

            const request = store.get(key);

            request.onsuccess = () => resolve(request.result);
            request.onerror = () => reject(request.error);
        });
    }

    getAll<T>(): Promise<T[]> {
        return new Promise((resolve, reject) => {
            const transaction = this.db.transaction(this.storeName, 'readonly');
            const store = transaction.objectStore(this.storeName);

            const request = store.getAll();

            request.onsuccess = () => resolve(request.result);
            request.onerror = () => reject(request.error);
        });
    }

    delete(key: IDBValidKey): Promise<void> {
        return new Promise((resolve, reject) => {
            const transaction = this.db.transaction(this.storeName, 'readwrite');
            const store = transaction.objectStore(this.storeName);

            const request = store.delete(key);

            request.onsuccess = () => resolve();
            request.onerror = () => reject(request.error);
        });
    }

    clear(): Promise<void> {
        return new Promise((resolve, reject) => {
            const transaction = this.db.transaction(this.storeName, 'readwrite');
            const store = transaction.objectStore(this.storeName);

            const request = store.clear();

            request.onsuccess = () => resolve();
            request.onerror = () => reject(request.error);
        });
    }
}