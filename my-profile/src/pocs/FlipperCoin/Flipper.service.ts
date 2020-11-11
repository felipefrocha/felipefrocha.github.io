function choice<T>(arr: T[]): T {
    return arr[Math.floor(Math.random() * arr.length)];
}
export {choice as choice}