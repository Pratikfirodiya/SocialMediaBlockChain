const { assert } = require("chai");

const SocialNetwork = artifacts.require("./SocialNetwork.sol");
require("chai").use(require("chai-as-promised")).should();
contract("SocialNetwork", ([deployer,author,tipper]) => {
    let socialNetwork
    before(async () => {
        socialNetwork = await SocialNetwork.deployed()
    })
    describe("deployment", async () => {
        it("deploys successfully", async () => {
           
            const address= await socialNetwork.address
            assert.notEqual(address,0x0)
            assert.notEqual(address,'')
            assert.notEqual(address,null)
            assert.notEqual(address,undefined)
        })
        it('has a name', async () => {
            const name=await socialNetwork.name()
            assert.equal(name,'Pratik')
        })
    })
    describe('posts', async () => {
        let result,postcount
        before(async () => {
            result=await socialNetwork.createPost('This is my first post', { from: author })
            postcount=await socialNetwork.postcount()
        })
        it('creates post', async () => {
           
            assert.equal(postcount,1)
            const event= result.logs[0].args
            console.log(result)
            assert.equal(event.id.toNumber(), postcount.toNumber(), 'id is correct')
            assert.equal(event.content,'This is my first post','content is correct')
            assert.equal(event.tipAmount,'0','tip amount is correct')
            assert.equal(event.author,author,'author is correct')

            await socialNetwork.createPost('', { from: author }).should.be.rejected;
        })

        it('lists posts', async () =>{
            const post = await socialNetwork.posts(postcount)
            assert.equal(post.id.toNumber(), postcount.toNumber(), 'id is correct')
            assert.equal(post.content,'This is my first post','content is correct')
            assert.equal(post.tipAmount,'0','tip amount is correct')
            assert.equal(post.author,author,'author is correct')
        })
        it('allows users to tip posts', async () => {

            let oldauthorbalance
            oldauthorbalance= await web3.eth.getBalance(author)
            oldauthorbalance=new web3.utils.BN(oldauthorbalance)
            result=await socialNetwork.tipPost(postcount,{ from:tipper, value: web3.utils.toWei('1','Ether')})
            const event= result.logs[0].args
           
            assert.equal(event.id.toNumber(), postcount.toNumber(), 'id is correct')
            assert.equal(event.content,'This is my first post','content is correct')
            assert.equal(event.tipAmount,'1000000000000000000','tip amount is correct')
            assert.equal(event.author,author,'author is correct')

            let newauthorbalance
            newauthorbalance = await web3.eth.getBalance(author)
            newauthorbalance = new web3.utils.BN(newauthorbalance)
            let tipAmount
            tipAmount = web3.utils.toWei('1','Ether')
            tipAmount = new web3.utils.BN(tipAmount)

            const expectedAmount = oldauthorbalance.add(tipAmount)

            assert.equal(newauthorbalance.toString(), expectedAmount.toString())

            await socialNetwork.tipPost(99, { from: tipper, value: web3.utils.toWei('1','Ether')}).should.be.rejected;
        })
    })
})