# ajab

ajab makes modules' private (not-exported) functions reachable and testable in testing frameworks like jest

## installing

install `ajab` by running `npm i ajab` in terminal

## using

Imagine `myModule.js` contains the following:

    module.exports.publicFunction = function publicFunction(a, b){
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
