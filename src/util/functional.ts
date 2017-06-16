export function id<T>(value: T): T {
    return value;
}

export function constant<T>(value: T) {
    return function(...args: any[]) {
        return value;
    };
}

export function tap<T>(callback: (value: T) => T) {
    return function(value: T) {
        callback(value);
        return value;
    }
}

export function pick<TObj, TKey extends keyof TObj>(keys: TKey[]) {
    return function(obj: TObj): Pick<TObj, TKey> {
        var result: Partial<Pick<TObj, TKey>> = {};
        for (var key of keys) {
            result[key] = obj[key];
        }
        return result as Pick<TObj, TKey>;
    }
}