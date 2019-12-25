const SimpleStorage = artifacts.require('SimpleStorage');

contract('Simple Storage', () => {
    it('Should set the value of data', async () => {
        const simpleStorage = await SimpleStorage.deployed();
        await simpleStorage.set('this');
        const result = await simpleStorage.get();
        assert(result === 'this');
    });
});