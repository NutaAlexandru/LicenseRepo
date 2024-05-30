export class Favorites {
    constructor(
        public userId: string,
        public symbol: string,
        public symbolId: string,
        public type: 'stock' | 'crypto'
    ) {}
}
