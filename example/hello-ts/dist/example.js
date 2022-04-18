// let letAge = 69
// const constAge = 69
// function printCar(car: {
//   make: string,
//   model: string,
//   year: number,
// }) {
//   console.log(`${car.make} ${car.model} ${car.year}`);
// }
// printCar({ make: 'toyota', model: 'corolla', year: 2002 });
function flipCoin() {
    if (Math.random() > 0.5)
        return 'heads';
    return 'tails';
}
function maybeGetUserInfo() {
    if (flipCoin() === 'heads') {
        return [
            'success',
            { name: 'bruhtus', email: 'bruhtus@example.com' },
        ];
    }
    else {
        return [
            'error',
            new Error('the coin landed on tails'),
        ];
    }
}
const outcome = maybeGetUserInfo();
const [first, second] = outcome;
console.log(first);
// console.log(second);
