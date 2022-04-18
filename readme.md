# Frontend Master Typescript Fundamentals (v3)

## What is Typescript?

Typescript is a syntactic superset of javascript, which means it sort of
starts with all of the javascript syntax you know as its starting point and
then layers additional concepts on top.

Typescript is an open source project maintained by microsoft, and the goals
is to add types to javascript.

So, through the use of the compiler, typescript compiles out to readable
javascript and it comes in three parts:
- The programming language.
- The language server.
- The compiler (performs analysis on our code base and makes sure everything
lines up the way it should).

## Why developers want types?

### Leave Our Intent

Types allows us, as the code author, to leave more of our intent "on the page"

If we look at this javascript example:
```javascript
function add(a, b) {
  return a + b;
}
```
is the function mean to take numbers as arguments? or strings? or both?

Now, imagine that in the future somebody came along and made something that
they thought was a non-breaking change and they add the ability for a third
upper end like this:
```javascript
function add(a, b, c = 0) {
  return a + b + c;
}
```
and then we using that function with string concatenation, we'd ended up with
zeros at the end of every string that we're combining through this function.

That's why intent matters, and whenever there's multiple interpretations of
what are the constraints, and what's going on, and what was this designed to
do, we're kinda asking for trouble.

In the typescript world, we can have something like this:
```typescript
function add(a: number, b: number): number {
  return a + b;
}
```
with that, not only the code is clearer as we read it, but we're also alerted
to any use of `add` that deviates from what the author originally intended.

### Move Errors from Runtime to Compile Time

Typescript has the potential to allow us to move some kinds of errors from
runtime (where they affect users) to compile time.

Examples of this kind of errors that we can catch are:
- Values that might or might not be there.
- Incomplete refactoring (e.g., we should have changed something in 7
places but we only changed in 6 places).
- Breakage around internal contract within our code base (e.g., an argument
becomes required).

## Compiling a Basic Typescript Program

In this section we'll:
- learn a little bit about how to use TSC compiler command.
- learn and understand how javascript language level and module type affect
the kind of thing that comes out of our compiler.
- look at other things that come out of the compiler.

> We're also gonna see some type information that we could potentially publish
> along with this code if it were a library, and that is called the
> declaration file which has the extension `.d.ts`.

This simple project consist of three files:
- package.json (the dependencies and all those stuff)
- tsconfig.json (contains all of the instructions and options for passing to
the compiler)
- src/index.ts (the program)

#### package.json
In `package.json`, we'll use something like this:
```json
{
    "name": "hello-ts",
    "license": "NOLICENSE",
    "version": "0.0.1",
    "devDependencies": {
        "typescript": "^4.3.2"
    },
    "scripts": {
        "dev": "tsc --watch --preserveWatchOutput"
    }
}
```

> `preserveWatchOutput` means that every save does not clear our console
> output.

#### tsconfig.json
For the `tsconfig.json`, we'll use something like this:
```json
{
  "compilerOptions": {
    "outDir": "dist",
    "target": "ES2017"
  },
  "include": [
    "src"
  ]
}
```

> `include` tells the compiler where to find our source code.
>
> In `tsconfig.json` above, we have two compiler options. The first is where
> are we going to put our output (the `outDir` field). By default, typescript
> will create javascript files that are side by side with the typescript
> source that created them.
>
> The second option is target property which help us describe the language
> level of our build output. By default, it's ES3.

**Everything we described in the `compilerOptions` field can be passed to the
tsc command as a cli flags**, like this:
```sh
tsc --outDir dist
```

#### src/index.ts

It's not gonna be a big program, but it contains a couple of interesting
things that will present us with some clear signals about how the compiler
response to that target property and the type of module we instruct the
compiler to make for us.

Here's the content of `index.ts` we'll be using:
```typescript
/**
 * Create a promise that resolves after some time
 * @param n number of milliseconds before promise resolves
 */
function timeout(n: number) {
  return new Promise((res) => setTimeout(res, n));
}

/**
 * Add three numbers
 * @param a first number
 * @param b second
 */
export async function addNumbers(a: number, b: number) {
  await timeout(500);
  return a + b;
}

//== Run the program ==//
(async () => {
  console.log(await addNumbers(3, 4));
})();
```

> The mechanism of `addNumber()` function is basically wait half a second
> (500 ms) and then print out a + b.

### Running The Compiler

We can run the compiler using this command:
```sh
# if using yarn
yarn dev

# if using npm
npm run dev
```

### Declaration File

The file with extension `.d.ts` is known as *declaration file*. We can
think of declaration file as the types that were stripped away from our
source code.

So we start with typescript which is a code that runs and types, and then
the compiler almost separates those two out.

A good way to think of typescript file is something like this:
- `*.ts` files contain both type information and code that runs.
- `*.js` files contain only code that runs.
- `*.d.ts` files contain only types information.

### Type of Modules

When we try to run this program with node, like this:
```sh
node example/hello-ts/dist/index.js
```
node will throw an error because node expect the commonjs instead of ES
module.

We can fix that by adding the module field in `compilerOptions` like this:
```json
{
  "compilerOptions": {
    "outDir": "dist",
    "target": "ES2017",
    "module": "CommonJs"
  },
  "include": [
    "src"
  ]
}
```

## Variables and Values

In this chapter, we're gonna talk about simple `let` and `const` declaration
and the very basic of typing functions.

### Variable Declaration & Inference

In javascript, we declare variable with `let` and `const` like this:
```typescript
let age = 6;
```
and we may note that typescript is kind of figured out that is a number.

> What we're seeing is "inference", where typescript can contextually
> understand the situation. It can see that we have a variable declaration
> with an initializer.
>
> On side note, not every programming language has this, such as java and c++.

Now, if try to do this:
```typescript
let age = 6;
age = 'not a number';
```

Typescript will throw an error, because `age` was the variable that was born
with a type `number`, and if we give it a value as string, it's going to throw
an error.

**In typescript, variables are born with their types**. There are things
we can do to make these types more specific, but **it's hard to make them more
general once they've declared**.

So, **it's important to make sure that when we define our variables, they have
the types that we need them to have, and if we ever need to generalize the
variables, usually we go back to that variable declaration, and that's where
we have to make a change**.

#### Literal Types

Now, let's take a look at similar example but with `const` instead of `let`:
```typescript
const age = 6;
```

We will see that we get a different type here, and that type is `6`. What we
have here is called a **literal type**, which means a more specific kind of
type. It's not just any number, it's any number that is `6`.

So the reason that changing `let` to `const` make type like this, has to do
with two things:
1. It's the nature of `const` declaration, they can't be re-assigned. So if
the variable pointed at something, it will forever pointed to that thing.
2. `number` in javascript are immutable value types. In this case, `6` will
always be `6`, we can create new number but we can't change an existing
number.

With those two reasons in mind, typescript can make a safe more specific
assumption.

**We can think literal types as a set of allowed values**.

### Implicit `any` and Type Annotation

Sometimes we end up in situations where we have to declare a variable, and
then the variable gets its value sometime later.

Let's take a look at this example:
```typescript
// between 500 and 1000
const RANDOM_WAIT_TIME =
  Math.round(Math.random() * 500) + 500

let startTime = new Date()
let endTime

let endTime: any

setTimeout(() => {
  endTime = 0
  endTime = new Date()
}, RANDOM_WAIT_TIME)
```

The example above begins with a `timestamp` and ends up measuring a
`startTime` and then sometime later when it finishes a random wait, it'll
record and `endTime`.

So, maybe we want to have access to this `endTime` in this outer scope, but
within the `setTimeout()` function, that's when it's actually going to get its
`endTime`. In that case, we can end up with type like this:
```typescript
let endTime: any
```
If we look at the way that is defined, we can see that is of type `any`.

**`any` is the most flexible type in typescript**. We can thing of it like
javascript variable rules, where we could set it equal to a string and then a
number and then a function and then `null` and so on. There's no constraint.

So, in this case we need to add what's called **type annotation** like this:
```typescript
let endTime: Date
```

### Function Arguments and Return Values

Let's take a look at the previous example:
```typescript
function add(a, b) {
  return a + b
}
```

With that function, everything ends up with type `any`. Why any gonna be a
problem in this case? Let's take a look at another example:
```typescript
const result = add(3, '4')
const p = new Promise(result)
```

We know that the example above gonna turn into `7`, based on the `add()`
function implementation. So, we know `Promise` doesn't accept `7` as its
constructor argument but typescript seem have no problem with it.

**If we have `any` that's floating around, if that value enters well typed
code, it will break that well typed code**. So the guarantee we have around
`Promise` don't matter right now.

## Typing Functions

Do we want the problems to be surfaced at the place where we declare the
function or do we want them to be surfaced where we use the function?

Once we define a return type, we get an additional benefit and that is,
every code path that goes through the implementation of the function must
live up to what we state will happen.

> `any` does not just cause problems that have to do with itself. When `any`
> passed into a well typed code, that flexibility will compromise that well
> typed code.

## Objects, Arrays, and Tuples

Now, let's talk about collections, mutable value types. In javascript, these
are objects, arrays, and Tuples (which is a special type of array).

### Objects

When we talk about the types of objects, they are two things:
1. What properties are on this object?
2. What are the types of these properties?

For example, if we had a concept of a `car` like `2002 toyota corolla` which
has properties like this:
- `make`: the manufacturer (in this case, it's "toyota").
- `model`: the particular product (in this case, it's "corolla").
- `year`: the model year of the product (in this case, it's "2002").

We could create a javascript object to represent this information like this:
```javascript
{
  make: 'toyota',
  model: 'corolla',
  year: 2002,
}
```

So we can describe those object types as follow:
```typescript
{
  make: string,
  model: string,
  year: number,
}
```

We can use that type with a variable like this:
```typescript
let car: {
  make: string,
  model: string,
  year: number,
}
```

#### Optional Properties

Let's extend our model of a car and we'll say sometimes we have an electric
car and they wanna charge at a particular voltage. With that in mind, we need
to add new property like `chargeVoltage`.

Now, `chargeVoltage` doesn't make any sense for a car that runs on gasoline.
So, let's say that for electric cars, we will find this value but for
non-electric car, this value will be missing.

We can state that `chargeVoltage` is optional using this `?` operator like
this:
```typescript
function printCar(car: {
  make: string,
  model: string,
  year: number,
  chargeVoltage?: number
}) {
  let str = `${car.make} ${car.model} (${car.year})`;
  car.chargeVoltage;

  // this is what's called a "type guard".
  if (typeof car.chargeVoltage !== 'undefined') {
    str += `// ${car.chargeVoltage}v`;
  }

  console.log(str);
}
```

If we hover at `chargeVoltage` using our LSP, we'll see that `chargeVoltage`
have two types like this: `(property) chargeVoltage?: number | undefined`, and
if we use this condition:
```typescript
if (typeof car.chargeVoltage !== 'undefined')
```

It will eliminate the `undefined` type and `chargeVoltage` become like this:
`(property) chargeVoltage?: number`.

That condition is called a **type guard**. If we remove that and we give a
fixed number value, typescript will throw an error because `chargeVoltage`
can be `undefined` too, so we can't give a fixed value to multiple type.

> Read typescript errors from the bottom-up because they're kind of like stack
> stack traces where the lowest line will tell us the cause of the error.

There's a difference between optional properties and properties that has the
potential to have an undefined value. Optional properties can be left out, but
if we give properties that has the potential to have an undefined value,
someone need to pass an undefined value which is weird.

Here's an example of properties that has potential undefined value:
```typescript
function printCar(car: {
  make: string,
  model: string,
  year: number,
  chargeVoltage: number | undefined
}) {
  let str = `${car.make} ${car.model} (${car.year})`;
  car.chargeVoltage;

  // this is what's called a "type guard".
  if (typeof car.chargeVoltage !== 'undefined') {
    str += `// ${car.chargeVoltage}v`;
  }

  console.log(str);
}
```

With that example, we need to give a `printCar()` function an argument like
this:
```typescript
printCar({
  make: 'toyota',
  model: 'corolla',
  year: 2002,
  chargeVoltage: undefined,
});
```

#### Excess Property Checking

Let's say that someone so eager and they give the color of the car for
`printCar()` function like this:
```typescript
function printCar(car: {
  make: string,
  model: string,
  year: number,
  chargeVoltage?: number
}) {
  let str = `${car.make} ${car.model} (${car.year})`;
  car.chargeVoltage;

  // this is what's called a "type guard".
  if (typeof car.chargeVoltage !== 'undefined') {
    str += `// ${car.chargeVoltage}v`;
  }

  console.log(str);
}

printCar({
  make: 'tesla',
  model: 'model 3',
  year: 2020,
  chargeVoltage: 220,
  color: 'red',
});
```

That person will get, what's called *excess property error*. The keyword is
something like this `Object literal may only specify known properties, and
'color' does not exist in type ...`.

That won't break our code, so why are we being alerted? If we started to use
object `car` in `printCar()` function, there's no way to safely access that
`color` property. So in case we have that `color` property there, we're
setting ourselves up to never be able to safely access that extra thing. It
serves no purpose and can safely be eliminated.

There are three things we can do to handle this case:
1. Remove the `color` property from the object.
2. Add a `color?: string` to the `printCar()` function argument type.
3. Create a variable to hold this value, and then pass the variable into the
`printCar()` function (so that we can access the `color` property).

> We only get the error when it can be proven that property is pointless and
> we can't access it anywhere.

#### Index Signatures

Sometimes we need to represent a type for dictionaries where values of a
consistent type are retrievable by keys.

Let's imagine an address book situation like this:
```typescript
const phones = {
  home: { country: '+1', area: '211', number: '652-4515' },
  work: { country: '+1', area: '670', number: '752-5856' },
  fax: { country: '+1', area: '322', number: '525-4357' },
}
```

In that situation, we have a consistent type of value that is stored under an
arbitrary key. So we have this nice way to easily look up values by key.

In order to give type to `phones` object, we need something called **an
index signature** and here's what that's look like:
```typescript
const phone: {
  [k: string]: {
    country: string,
    area: string,
    number: string,
  }
} = {}

phones.fax
```

Now, no matter what key we lookup, we get an object that represents a phone
number.

### Arrays

For simple types of array, all we have to do is add a pair of square brackets
after the type of the member of the array, like this:
```typescript
const fileExtensions: string[] = ['js', 'ts'];
```

We could use the object type as well, like this:
```typescript
const cars: {
  make: string,
  model: string,
  year: number,
}[] = [
  {
    make: 'toyota',
    model: 'corolla',
    year: 2002,
  }
]
```

### Tuples

Sometimes we may want to work with a multi-element, ordered data structure
where position of each item has some special meaning or convention. This kind
of structure is often called *tuple*.

Let's imagine that we define a convention where we can represent "2002 toyota
corolla" the same as this:
```typescript
let myCar = [2002, 'toyota', 'corolla']:
const [year, make, model] = myCar;
```

That makes destructured assignment really nice because we can then pull out
the individual little parts of this compound value.

Let's see how typescript handles inference in this case:
```typescript
let myCar = [2002, 'toyota', 'corolla']
```

Typescript inference of the variable `myCar` would be something like this:
```typescript
let myCar: (string | number)[]
```

Which means that typescript decided that what we're trying to do is create a
mixed array of arbitrary length that contains some mix of strings and numbers,
and that's gonna be a problem for us. Why? We could add an additional element
like this:
```typescript
let myCar = [2002, 'toyota', 'corolla']

myCar = ['honda', 2017, 'accord', 'sedan']
```

Which doesn't have the same convention or length as the previous value, like
the year should be the first element instead of the second element.

> Now, the question is, what do we want, most of the time?
> 1. `[2002, 'toyota', 'corolla']` should be assumed to be a mixed array of
> numbers and strings.
> 2. `[2002, 'toyota', 'corolla']` should be assumed to be a tuple of fixed
> length of 3.

Below is how we explicitly state the type of tuple whenever we declare one:
```typescript
let myCar: [number, string, string] = [
  2002,
  'toyota',
  'corolla',
];
```

With that kind of type, when we try to do this:
```typescript
myCar = ['honda', 2017, 'accord'];
```

Typescript will throw an error because it's not the right convention.

## Structural Vs Nominal Types

Now, we're gonna step back and consider different kinds of type systems,
and more specifically **how do we categorize different kinds of types
systems?**

### What is Type Checking?

Type checking has something to do with answering a question about type
equivalence as in, when we're using a `foo()` function like this:
```typescript
function foo(x) {
  // ... mystery code ...
}
//
// TYPE CHECKING
// -------------
// Is `myValue` type-equivalent to
//     what `foo` whats to receive?
foo(myValue)
```

Is the value we're passing in to the function `foo()` equivalent to what the
function is designed to accept? It's a comparison.

This also happens when we assign things like this:
```typescript
x = y
```

Is the value that `y` holds type-equivalent to what `x` wants to hold? And if
so, this assignment may proceed without an objection. But if `x` wants a
`number` and `y` hold a `string`, that will cause an objection.

With that in mind, let's think about different kinds of type systems and how
they answer this question.

### Static Vs Dynamic

So, the first way to categorize different types systems is static versus
dynamic.

**Static type systems have us write types in our code**. Typescript, java,
c++, c#, any of these things are static type systems.

**Dynamic type systems perform their type-equivalence check at runtime**.
Javascript, python, ruby, perl, and php, fall into this category.

### Nominal Vs Structural

We can also think about type system as either nominal or structural.

**Nominal type systems are all about the name**. So, here's an example of java
code:
```java
public class Car {
  String make;
  String model;
  int make;
}
public class CarChecker {
  // takes a `Car` argument, returns a `String`
  public static String printCar(Car car) {  }
}
Car myCar = new Car();
// TYPE CHECKING
// -------------
// Is `myCar` type-equivalent to
//     what `checkCar` wants as an argument?
CarChecker.checkCar(myCar);
```

The type-equivalence evaluation would be like "did `myCar` come out of a
constructor called `Car`? Is your class named `Car`". That's a nominal type
systems.

**Structural type systems are all about structure or shape**. Let's take a
look at a typescript example:
```typescript
class Car {
  make: string
  model: string
  year: number
  isElectric: boolean
}

class Truck {
  make: string
  model: string
  year: number
  towingCapacity: number
}

const vehicle = {
  make: "Honda",
  model: "Accord",
  year: 2017,
}

function printCar(car: {
  make: string
  model: string
  year: number
}) {
  console.log(`${car.make} ${car.model} (${car.year})`)
}

printCar(new Car()) // Fine
printCar(new Truck()) // Fine
printCar(vehicle) // Fine
```

Everything gonna work with `printCar()` because all `printCar()` cares about
here is "do you have `make`, `model`, and `year`?". It doesn't matter if
you're an instance of a class, or you're just a regular object, or maybe
you're some weird function with some properties hanging off of it,
`printCar()` will work with any of them.

### Duck Typing

"Duck typing" gets its name from the "duck test".

> "If it looks like a duck, swims like a duck, and quack like a duck, then it
> probably is a duck".

Duck typing is kind of another way of saying dynamic typing where we kind of
attempt to go ahead and use something, and if it works out, then it's ok, and
if it doesn't, we'll throw an error at runtime.

## Union Types

We can think of union types as **OR** operator for types. Basically everything
that could be in either category.

Union types in typescript can be described using the `|` (pipe) operator.

For example, if we had a type that could be one of the two strings,
`'success'` or `'error'`, we could define it as:
```typescript
'success' | 'error'
```

Another example, the `flipCoin()` function below will return `'heads'` if a
number selected from `(0, 1)` is > 0.5, or `'tails'` if <= 0.5:
```typescript
function flipCoin(): 'heads' | 'tails' {
  if (Math.random() > 0.5) return 'heads';
  return 'tails';
}

const outcome = flipCoin();
console.log(outcome);
```

Let's get things more interesting, like this:
```typescript
function flipCoin(): 'heads' | 'tails' {
  if (Math.random() > 0.5) return 'heads';
  return 'tails';
}

function maybeGetUserInfo():
  ['error', Error] | ['success', { name: string, email: string }] {
  if (flipCoin() === 'heads') {
    return [
      'success',
      { name: 'bruhtus', email: 'bruhtus@example.com' },
    ]
  } else {
    return [
      'error',
      new Error('the coin landed on tails'),
    ]
  }
}

const outcome = maybeGetUserInfo();
console.log(outcome);
```

The `maybeGetUserInfo()` function above is basically return a tuple of string
and object. If `flipCoin()` return `'heads'`, it will return:
```sh
[ 'success', { name: 'bruhtus', email: 'bruhtus@example.com' } ]
```

If `flipCoin()` return `'tails'`, it will return:
```sh
[ 'error', new Error('the coin landed on tails') ]
```

Now, let's destructure the tuple and see what typescript has to say about its
members:
```typescript
function flipCoin(): 'heads' | 'tails' {
  if (Math.random() > 0.5) return 'heads';
  return 'tails';
}

function maybeGetUserInfo():
  ['error', Error] | ['success', { name: string, email: string }] {
  if (flipCoin() === 'heads') {
    return [
      'success',
      { name: 'bruhtus', email: 'bruhtus@example.com' },
    ]
  } else {
    return [
      'error',
      new Error('the coin landed on tails'),
    ]
  }
}

const outcome = maybeGetUserInfo();

const [first, second] = outcome;
```

If we looked at each element of this tuple by itself, this union type concept
has sort of propagated through each member of the tuple. Like the `first`
element of the tuple is one of these two strings:
```typescript
const first: 'error' | 'success'
```

And then the `second` element is either an error object or custom object:
```typescript
const second: Error | { name: string, email: string }
```

So, each of the tuple element by themself have this duality until we
straighten out what's going on.

What's interesting is, **why would we need to narrow things down? Why can't
we handle this value directly?**

If we look at the `first` element of the tuple, which is either string
`'error'` or `'success'`, we have a lot of stuff in our completion that
indicates that the `first` element gonna be string.

If we look at the `second` element of the tuple, which is either an error
object or a custom object. It turns out that all we can access through
completion is `name`, why is that? Because the error object has the property
called `name` and the custom object also has property called `name`, and in
both cases they're strings. So, all that we're able to access here is the
guaranteed stuff that will be there regardless of whether it's an error object
or the custom object.

**We're very limited in terms of what we can do, as long as it's sort of in
the state where we're not sure what it is**.

**When a value has a type that includes a union, we're only able to use this
common behavior that's guaranteed to be there, no matter which type where
are in**.

### Narrowing with Type Guards

Narrowing is a process of using some condition with control flow, so we define
a branch of code that will only be taken if we're in our first case or second
case.

Type guards are expressions which when used with control flow statement, allow
us to have a more specific type for a particular value.

With that in mind, we can do something like this:
```typescript
function flipCoin(): 'heads' | 'tails' {
  if (Math.random() > 0.5) return 'heads';
  return 'tails';
}

function maybeGetUserInfo():
  ['error', Error] | ['success', { name: string, email: string }] {
  if (flipCoin() === 'heads') {
    return [
      'success',
      { name: 'bruhtus', email: 'bruhtus@example.com' },
    ]
  } else {
    return [
      'error',
      new Error('the coin landed on tails'),
    ]
  }
}

const outcome = maybeGetUserInfo();

const [first, second] = outcome;

if (second instanceof Error) {
  second
} else {
  second
}
```

The `second` element in the if-statement, will only enter for the error
case. And then, the `second` element in the else-statement will get everything
that leftover.

### Discriminated or Tagged Unions

We can talk about how this tuple give us some benefit via this concept called
*discriminated unions*.

Now, let take a look at this example:
```typescript
function flipCoin(): 'heads' | 'tails' {
  if (Math.random() > 0.5) return 'heads';
  return 'tails';
}

function maybeGetUserInfo():
  ['error', Error] | ['success', { name: string, email: string }] {
  if (flipCoin() === 'heads') {
    return [
      'success',
      { name: 'bruhtus', email: 'bruhtus@example.com' },
    ]
  } else {
    return [
      'error',
      new Error('the coin landed on tails'),
    ]
  }
}

const outcome = maybeGetUserInfo();

if (outcome[0] === 'error') {
  outcome
} else {
  outcome
}
```

In the example above, first we're looking at the first element of the tuple if
it exactly match our specific string and then the entire tuple is in the error
case. And then in the else-statement, we have the rest of the case.

## Intersection Types

We can think of intersection types as **AND** operator for types. Basically it
means that the only things that are allowed is the things that are in the left
side and the right side.

For example, what if we had a `Promise` that has extra `startTime` and
`endTime` properties added to it?
```typescript
function makeWeek(): Date & { end: Date } {
  const start = new Date();
  const end = new Date(start.valueOf() + ONE_WEEK)

  return { ...start, end };
}

const thisWeek = makeWeek();
thisWeek.toISOString();
thisWeek.end.toISOString();
```

If we look at the behavior that's available to us by union types and
intersection types, this feels like the labels for these types are kind of
reversed.

But, if we think about these, in terms of the values that we're allowed to
have, that's where this makes sense.

## Type Aliases

Typescript provides two mechanisms for centrally defining types and giving
them useful and meaningful names, that is:
1. Interfaces.
2. Type aliases.

> Remember, we're still operating within a structural type system here. So,
> the fact that we call our interface "car", "fruit", or whatever it is,
> that's for us and other people that contribute to our code base. It's just
> a friendly name.

Type aliases allowing us to:
- Define a more meaningful name for the type.
- Declare a type alias in a single place.
- Import and export just as if it were a value, the same way as import and
export function or constants or anything like that.

Here's an example:
```typescript
// @filename: types.ts
export type UserContactInfo = {
  name: string;
  email: string;
}
```

A few things to point out here:
1. This is a rare occasion where we see type information on the right hand
side of the assignment operator (`=`).
2. We're using `TitleCase` to format the alias' name. This is common
convention.
3. We can only have one type alias of a given name and a given scope, just
like how `let` and `const` variable declaration works.

### Inheritance in Type Aliases

We can create type aliases that combine existing types with new behavior by
using intersection (`&`) types, like this:
```typescript
type SpecialDate = Date & { getReason(): string }
```

## Interfaces

Interfaces are more limited than type aliases. Interface can only be used to
define what we call object types, and object types are things that are
conceivably look like a class instance or an object with properties.

> Important to realize that union type operators make something not an object
> type.

Like type aliases, interfaces can be imported/exported between modules just
like values, and they serve to provide a name for a specific type.

**Interfaces are a great way to define contracts between things**.

### Inheritance in Interfaces

#### Extends

Extends is used to describe inheritance between like things.

Just like in javascript, a subclass extends from a base class. Additionally,
**a sub-interface extends from a base interface** like example below:
```typescript
interface Animal {
  isAlive(): boolean;
}

interface Mammal extends Animal {
  getFurOrHairColor(): string
}
```

#### Implements

Implements is used to describe inheritance between unlike things.

When working with classes and interfaces, that's when we're gonna want to use
`implements` keyword. Here's an example:
```typescript
interface AnimalLike {
  eat(food): void;
}

class Dog implements AnimalLike {
  bark() {
    return 'woof';
  }

  eat(food) {
    consumeFood(food);
  }
}
```

### Open Interfaces

Interfaces are open means that, unlike type aliases, we can have multiple
declaration with a given name and a given scope like this:
```typescript
interface AnimalLike {
  isAlive(): boolean;
}

function feed(animal: AnimalLike) {
  animal.eat;
  animal.isAlive;
}

// second declaration of the same name
interface AnimalLike {
  eat(food): void;
}
```

**Where and how is this useful?** We'll find that we're using some library,
the type information is incomplete and we just wanna tack this one thing on,
this is a good way to do it.

## Which to Use, Type Aliases or Interfaces?

Here's a couple of clear choices to make in some scenarios:
1. If we're using anything that doesn't align with this idea of an object
type (e.g., use of union type operator), we must use a type alias.
2. If we want to use something that designed for a class to consume, it's
best to use an interface.
3. If we want to allow the consumers of our types to augment them, we must
use an interface.

Does Augmentation of interfaces persist across files? Yes, **type checking
should be a holistic operation that's performed on our entire app at once**.
So, there's no such thing as local augmentation of an interface.

## Recursive Types

Recursive types are types that are self-referential. Here's an example:
```typescript
type NestedNumbers = number | NestedNumbers[];

const val: NestedNumbers = [3, 4, [5, 6, [7], 59], 221];

if (typeof val !== 'number') {
  val.push(41);
}
```

## Callable Types

Both type aliases and interfaces offer the capability to describe *call
signatures* like this:
```typescript
// in the interface form
interface TwoNumberCalculation {
  (x: number, y: number): number;
}

// in the type alias form
type TwoNumberCalc = (x: number, y: number) => number;
```

The benefit of having defined call signatures is that we don't need to have
type annotations on function arguments like this:
```typescript
const add: TwoNumberCalculation = (a, b) => a + b;
```

This is usually useful for callbacks where this saves us from having to add
more and more type annotations.

## Void

Sometimes, we don't return anything from functions. If a function don't return
a value, what we get when we attempt to use their return value is `undefined`.
Typescript has a way to describe this with a `void` return type, and this
means specifically that **the return type of this function should not be
used, it should be ignored**.

Here's the difference between `undefined` type and `void` return type:
```typescript
function invokeInFourSeconds(callback: () => undefined) {
  setTimeout(callback, 4000);
}

function invokeInFiveSeconds(callback: () => void) {
  setTimeout(callback, 5000);
}

const values: number[] = [];

// this will throw an error because ti return something, array.push actually
// return a number.
invokeInFourSeconds(() => values.push(4));

invokeInFiveSeconds(() => values.push(4));
```

In the example above, the `undefined` case will throw an error because
`array.push` actually return an array. Meanwhile, the `void` case doesn't
throw an error.

So, there's a difference saying the return value of this function should be
ignored versus we may not return something.

**Void should only appear as a function return type**, we should not using it
anywhere else because what it means is the return value of this function
should be ignored and left unused.

## Construct Signatures

Construct signatures are similar to call signatures, except they describe what
should happen with the `new` keyword. Here's an example of it:
```typescript
interface DateConstructor {
  new (value: number): Date;
}

let myDateConstructor: DateConstructor = Date;
const d = new myDateConstructor();
```

## Function Overloads

Let's imagine a situation where we wanted to create a function that allow us
to register what we're calling a main event listener where that means the
primary event of whatever DOM element we appear to be referring to:
- If we are passed a `iframe` element, we strictly use registration of a
`postMessage` callback.
- If we are passed a `form` element, we strictly use registration of a
`submit` callback.

We can do that using a function overload, like this:
```typescript
type FormSubmitHandler = (data: FormData) => void
type MessageHandler = (evt: MessageEvent) => void

// head of the function
function handleMainEvent(
  elem: HTMLFormElement,
  handler: FormSubmitHandler
)

// head of the function
function handleMainEvent(
  elem: HTMLIFrameElement,
  handler: MessageHandler
)

// implementation of the function
function handleMainEvent(
  elem: HTMLFormElement | HTMLIFrameElement,
  handler: FormSubmitHandler | MessageHandler
) {};

const myFrame = document.getElementsByTagName("iframe")[0];
const myForm = document.getElementsByTagName("form")[0];
handleMainEvent(myFrame, (val) => {});
handleMainEvent(myForm, (val) => {});
```

An important thing to think about as we consider using a function overloads is
that **the implementation has to be compatible with the heads function**.

## `this` Types

When we talk about `this` type is the type of `this` when a function is
invoked.

This has the most relevance when talking about freestanding functions, because
methods on class already have `this` wired up in a convenient way.

Here's an example:
```typescript
function myClickHandler(
  this: HTMLButtomElement,
  event: Event
) {
  this.disabled = true;
}

const myButton = document.getElementsByTagName('button')[0];
const boundHandler = myClickHandler.bind(myButton);

boundHandler(new Event('click')) // bound version ok
myClickHandler.call(myButton, new Event('click')) // also ok
```

> Typescript understands that `.bind`, `.call`, and `.apply` will result in
> the proper `this` being passed to the function as part of its invocation.

## Function Type Best Practices

**Explicitly define return types**.

## Class in Typescript

Here's an example of class with a type:
```typescript
class Car {
  make: string;
  model: string;
  year: string;

  constructor(make: string, model: string, year: number) {
    this.make = make;
    this.model = model;
    this.year = year;
  }
}

// this is ok
let sedan = new Car('honda', 'accord', 2017);

// this will throw an error, because `activateTurnSignal` doesn't exist
// on Car class
sedan.activateTurnSignal('left');

// this will throw an error because the order is not right
new Car(2017, 'honda', 'accord');
```

## Access Modifier Keywords

Keyword               | Who can access
---                   | ---
`public`              | Everyone (this is the default)
`protected`           | The instance itself and subclasses
`private` or `#`field | Only the instance itself

Also, there's `readonly` which is kind of access modifier keywords. What
basically it do is prevent a re-assign a variable, similar to how `const` is.

## Top and Bottom Types

We can think about **types as defining a set of values that a variable or a
function parameters** might be.

For example:
```typescript
let x: boolean
```

`x` could be either item from the following set `{ true, false }`. Another
example:
```typescript
let c: {
  favoriteFruit?: 'pineapple',
}
```

`favoriteFruit` could be either item from the following set
`{ 'pineapple', undefined }`.

### Top Types

Top types are types to describe anything. Typescript provides two of these
types: `any` and `unknown`.

`any` type basically means we can accept any value, just like the name
suggest.

`unknown` is similar to `any` but **values with an `unknown` type cannot be
used without first applying a type guard**.

### Bottom Types

Bottom types are type to describe things that can hold no possible value.
Typescript provides one of these type: `never`.

One of the scenario where this could be useful is called *exhaustive
conditional* like this:
```typescript
class Car {
  drive() {
    console.log("vroom")
  }
}

class Truck {
  tow() {
    console.log("dragging something")
  }
}

type Vehicle = Truck | Car

let myVehicle: Vehicle = obtainRandomVehicle()

// The exhaustive conditional
if (myVehicle instanceof Truck) {
  myVehicle.tow() // Truck
} else if (myVehicle instanceof Car) {
  myVehicle.drive() // Car
} else {
  // NEITHER!
  const neverValue: never = myVehicle
}
```

## Nullish Value

### `null`

`null` indicates that there is a value for something and that value is
nothing.

### `undefined`

`undefined` means that either we haven't gotten to providing a value or
we're not going to providing a value.

### Non-null Assertion Operator

The non-null assertion operator (`!.`) is used to cast away the possibility
that a value might be `null` or `undefined`.

### Definite Assignment Operator

The definite assignment operator (`!:`) is used to suppress typescript's
objections about a class field being used when it can't be proven that it was
initialized.

## Generics

Generics are a way of creating types that are expressed in terms of other
types. The benefit of doing this, is allows for greater opportunity to reuse
code across our app.

Sometimes it is more convenient to organize our data in dictionaries and
sometimes it's convenient to organize data in arrays. So, it would be nice
if we had some sort of utility that let us transform data that was in one type
of collection into the other.

We need a mechanism of allowing flexibility without giving up all of our type
information, and generics provide the ability to do that.

Let's say we have this function:
```typescript
function listToDict(
  list: PhoneInfo[], // take the list as an argument
  idGen: (arg: PhoneInfo) => string // a callback to get Ids
): { [k: string]: PhoneInfo } {
  // create an empty dictionary
  const dict: { [k: string]: PhoneInfo } = {}

  // Loop through the array
  list.forEach((element) => {
    const dictKey = idGen(element)
    dict[dictKey] = element // store element under key
  })

  // return the dictionary
  return dict
}
```

And we want to make those function more flexible so that we can use it with
other types. So, the first thing we need to do is define a type parameter.
We can think of a type parameter as argument for type, they're kind of like
function argument but for type.

Just like functions can return different values given different arguments
passed to them, type parameters can influence what generic types end up being.

With that in mind, we can do something like this:
```typescript
function listToDict<T>(
  list: T[],
  idGen: (arg: T) => string
): { [k: string]: T } {
  const dict: { [k: string]: T } = {};
  return dict;
}
```

Now, let's look at what this code means:
- `<T>` to the right of `listToDict`: It is the type parameter list with one
type parameter in it. We can think of it like the round parenthesis for a
function parameter list.

- `list: T[]` as first argument: What's going to happen is, on a per
invocation basis, we might end up with a different type `T`. So, if we're
passing this a list of `phoneInfo[]`, `T` would be `phoneInfo`. If we're
passing it a list of `string[]`, `T` would be `string`.

- `idGen: (arg: T) => string`: It is a callback that also uses `T` as an
argument type. This means that we're going to get the use of type checking
within this callback, and we're going to effectively ensure that the type of
thing our callback is designed to work with, is the same thing as the array
has within it.

- `{ [k: string]: T }`: Based on the way we have defined this function, a
`T[]` will be turned into a dictionary for any `T` of our choosing.

### Best Practices

Make sure to remember that the point of **these type parameters of generic
types is to relate multiple things**. If we're not using type parameters more
than once, we can end up forcing typescript to regard something we have as a
different type.

Here's an example:
```typescript
function returnAs<T>(arg: any): T {
  return arg // 🚨 an `any` that will _seem_ like a `T`
}

// DANGER!
const first = returnAs<number>(window)
const sameAs = window as any as number
```

Also, don't make things generic unless there's real value in doing so.
Premature abstraction is bad, it makes understanding our code harder.

## References

- [Course website](https://www.typescript-training.com/course/fundamentals-v3).
- [Course repo](https://github.com/mike-north/ts-fundamentals-v3).
