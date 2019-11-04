import { StoreService } from './store.service';
import { identity } from 'rxjs';

const MAP_KEY = 'redux::map';

export function Listen(path: string[], mappingFunction: (toTransform: any) => any = identity): PropertyDecorator {
    return (target: any, key: string) => {
        const getter: () => any = () => {
            const map: any = target[MAP_KEY] || {};
            target[MAP_KEY] = map;
            const obs: any = map[key] || StoreService.instance.get(path, mappingFunction);
            map[key] = obs;
            return obs;
        };
        if (delete target[key]) {
            Object.defineProperty(target, key, {
                get: getter,
                enumerable: true,
                configurable: true
            });
        }
    };
}
