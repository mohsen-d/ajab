# ajab

ajab enables developers to test their modules' private functions.

## installing

install `ajab` by running `npm i ajab` in terminal

## using

If `myModule.js` contains the following:

    module.exports.publicFunction = function publicFunction(a, b){
        return a + b;
    }

    function privateFunction(a, b){
        return a * b;
    }

instead of `require`, import your module using `ajab` :

    const ajab = required('ajab');
    const myModule = ajab('./myModule');

This way your private functions will be available just like an exported function:

    // in jest:
    test("My private function should be testable", () => {
        expect(myModule.privateFunction(2, 4)).toBe(8);
    });
