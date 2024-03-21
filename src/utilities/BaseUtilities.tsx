
export function ListIntersection<T>(array1: T[], array2: T[]) {
    return array1.filter(value => array2.includes(value));
}