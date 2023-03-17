# ajab

ajab makes modules' private (not-exported) functions reachable and testable in testing frameworks like jest

## installing

install `ajab` by running `npm i ajab --save-dev` in terminal

## using

If `myModule.js` contains the following:

    module.exports.publicFunction = function (a, b){
        return a + b;
    }

    function privateFunction(a, b){
        return a * b;
    }

    const anotherPrivateFunction = (a, b) => {
        return a / b;
    }

To test the private functions, in your tests, instead of `require`, import your module using `ajab` :

    const ajab = required('ajab');
    const myModule = ajab('./myModule');

`ajab` makes your private functions available just like an exported function so you can test them directly:

    // in jest:
    test("My private function should be testable", () => {
        expect(myModule.privateFunction(2, 4)).toBe(8);
    });

### module.exports assigned to a function

if `module.exports` is assigned to a function,

    module.exports = function(a, b){ return a + b; }

`ajab` puts that function in the `module.exports.public`

    // in jest:
    test("testing module.exports assigned to a function", () => {
        expect(myModule.public(2, 4)).toBe(6);
    });

### nested function

`ajab` also finds functions defined inside the public functions and adds them to module.exports

    function publicFunc(){
        const privateFunc = function(){...};
        ...
    }
