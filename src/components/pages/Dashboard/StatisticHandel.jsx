class StatisticsHandler {

    updateConstructor = (productHistory, stockProductHistory, setLast7DaysCount, last7DaysCount) => {
        this.productHistory = productHistory;
        this.stockProductHistory = stockProductHistory;
        this.setLast7DaysCount = setLast7DaysCount;
        this.last7DaysCount = last7DaysCount;
    }

    calculateOperation = (day, product) => {
        const todayUTC = new Date();
        const todayLocal = new Date(todayUTC.getTime() + (todayUTC.getTimezoneOffset() * 60000) + (6 * 60 * 60 * 1000));
        const todayStr = new Date(todayLocal.getTime() - (day * 24 * 60 * 60 * 1000)); // Get local time for the last 7 days
        const todayString = todayStr.toLocaleString('en-US', { timeZone: 'Asia/Dhaka', dateStyle: 'short' }); // Get local date in BD format


        const insertCount = product.filter((item) => {
            const productLocal = new Date(item.date);
            const productString = productLocal.toLocaleString('en-US', { timeZone: 'Asia/Dhaka', dateStyle: 'short' });
            return productString === todayString && item.operation === 'insert';
        });

        const updateCount = product.filter((item) => {
            const productLocal = new Date(item.date);
            const productString = productLocal.toLocaleString('en-US', { timeZone: 'Asia/Dhaka', dateStyle: 'short' });
            return productString === todayString && item.operation === 'update';
        });

        const deleteCount = product.filter((item) => {
            const productLocal = new Date(item.date);
            const productString = productLocal.toLocaleString('en-US', { timeZone: 'Asia/Dhaka', dateStyle: 'short' });
            return productString === todayString && item.operation === 'delete';
        });

        return {
            insertCount: insertCount,
            updateCount: updateCount,
            deleteCount: deleteCount
        }
    }

    calculateLast7Days = () => {
        this.setLast7DaysCount({
            today: {
                shortProduct: this.calculateOperation(0, this.productHistory),
                stockProduct: this.calculateOperation(0, this.stockProductHistory)
            },
            last1Day: {
                shortProduct: this.calculateOperation(1, this.productHistory),
                stockProduct: this.calculateOperation(1, this.stockProductHistory)
            },
            last2Day: {
                shortProduct: this.calculateOperation(2, this.productHistory),
                stockProduct: this.calculateOperation(2, this.stockProductHistory)
            },
            last3Day: {
                shortProduct: this.calculateOperation(3, this.productHistory),
                stockProduct: this.calculateOperation(3, this.stockProductHistory)
            },
            last4Day: {
                shortProduct: this.calculateOperation(4, this.productHistory),
                stockProduct: this.calculateOperation(4, this.stockProductHistory)
            },
            last5Day: {
                shortProduct: this.calculateOperation(5, this.productHistory),
                stockProduct: this.calculateOperation(5, this.stockProductHistory)
            },
            last6Day: {
                shortProduct: this.calculateOperation(6, this.productHistory),
                stockProduct: this.calculateOperation(6, this.stockProductHistory)
            }
        })
    }
}

export const { updateConstructor, calculateLast7Days } = new StatisticsHandler();
