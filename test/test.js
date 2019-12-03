let assert = require("assert");
let RegistrationOpp = require("../registration");
const pg = require("pg");
const Pool = pg.Pool;

const connectionString =
 process.env.DATABASE_URL || "postgresql://coder:coder123@localhost:5432/registration-opp"

 let useSSL = false;
 let local = process.env.LOCAL || false;
 if (process.env.DATABASE_URL && !local) {
     useSSL = true;
 }
 const pool = new Pool({
     connectionString,
     ssl: useSSL
 });




describe('Registration testing adding reg for each town and duplicates', function () {

    beforeEach(async function(){
        // clean the tables before each test run
        // await pool.query("delete from towns;");
        await pool.query("delete from reg_plates;");
        await pool.query('insert into towns (town, reg_code) values($1,$2)',['Cape Town', 'CA'])
        await pool.query('insert into towns (town, reg_code) values($1,$2)',['Bellville', 'CY'])
        await pool.query('insert into towns (town, reg_code) values($1,$2)',['Paarl', 'CJ'])
    });


    it('should display valid reg numbers containing CA for the town Cape Town', async function () {

        let input = RegistrationOpp(pool);
        await input.addReg("CA 125258")
       await  input.addReg("CA 987 456")

        let regCA =  await input.getRegNumbers()
        var results = regCA.map(function(registration){
            return registration.reg_number
        });
        // console.log("results:", results)
        assert.deepEqual(results, ["CA 125258", "CA 987 456"])
    })

    it('should display valid reg numbers containg CY for the town Bellville', async function () {

        let input = RegistrationOpp(pool);
        await input.addReg("CY 458")
        await input.addReg("CY 876456")
        await input.addReg("CY 459 008")

        let regCY = await input.getRegNumbers()
        var results = regCY.map(function(registration){
            return registration.reg_number
        });

        assert.deepEqual(results, ["CY 458", "CY 876456", "CY 459 008"])
    })

    it('should display valid reg numbers containing CJ for the town Paarl', async function () {

        let input = RegistrationOpp(pool);
       await input.addReg("CJ 585 458")
       await input.addReg("CJ 786 678")

       let regCJ = await input.getRegNumbers()
       var results = regCJ.map(function(registration){
           return registration.reg_number
       });

        assert.deepEqual(results, ["CJ 585 458", "CJ 786 678"])
    })

    it('should display duplicated reg numbers as one entry', async function () {

        let input = RegistrationOpp(pool);
        await input.addReg("CA 125258")
        await input.addReg("CA 125258")
        await input.addReg("CJ 585 458")
        await input.addReg("CJ 585 458")
        await input.addReg("CY 458")
        await input.addReg("CY 458")

        let regs = await input.getRegNumbers()
        var results = regs.map(function(registration){
            return registration.reg_number
        });

        assert.deepEqual(results, ["CA 125258", "CJ 585 458", "CY 458"])
    });
    

    it('should display reg numbers containing CA only, if filtered for Cape Town', async function () {
        
        let input = RegistrationOpp(pool);
        await input.addReg("CA 567 890")
        await input.addReg("CJ 246 894")
        await input.addReg("CY 15875")
        await input.addReg("CA 8775")

        var list=[]
         let filterCA = await input.filter("CA")        
        for(var i = 0;i<filterCA.length;i++){
            var check = filterCA[i]
        
        list.push(check.reg_number)
        }

        assert.deepEqual(list, ['CA 567 890',"CA 8775"])
    });

    it('should display reg numbers containing CY only, if filtered for Bellville', async function () {

        let input = RegistrationOpp(pool);
        await input.addReg("CA 567 890")
        await input.addReg("CY 246 894")
        await input.addReg("CY 15875")
        await input.addReg("CA 8775")

        var list = []
        let filterCY = await input.filter("CY")        
        for(var i = 0;i<filterCY.length;i++){
            var check = filterCY[i]
        
        list.push(check.reg_number)
        }
        assert.deepEqual(list, ["CY 246 894", "CY 15875"])
    });

    it('should display reg numbers containing CJ only, if filtered for Paarl', async function () {

        let input = RegistrationOpp(pool);
        await input.addReg("CJ 567 890")
        await input.addReg("CJ 246 894")
        await input.addReg("CY 15875")
        await input.addReg("CJ 8775")
        await input.addReg("CA 567 890")
        await input.addReg("CJ 15875")
        await input.addReg("CA 8775")

        var list = []
        let filterCJ = await input.filter("CJ")        
        for(var i = 0;i<filterCJ.length;i++){
            var check = filterCJ[i]
        
        list.push(check.reg_number)
        }
        assert.deepEqual(list, ["CJ 567 890", "CJ 246 894", "CJ 8775", "CJ 15875"])
    })

    it('should return all reg numbers, if filtered for All Towns', async function () {

        let input = RegistrationOpp(pool);
        await input.addReg("CJ 246 894")
        await input.addReg("CY 15875")
        await input.addReg("CJ 8775")
        await input.addReg("CA 567 890")
     
        var list = []
        let allRegs = await input.filter("all")
        for(var i = 0;i<allRegs.length;i++){
            var check = allRegs[i]

            list.push(check.reg_number)
        }

        assert.deepEqual(list, ["CJ 246 894", "CY 15875", "CJ 8775", "CA 567 890"])
    });

    it('should clear all data on screen and database', async function(){

        let input = RegistrationOpp(pool);
        
        await input.addReg("CJ 567 890")
        await input.addReg("CJ 246 894")
        await input.addReg("CY 15875")
        await input.addReg("CJ 8775")
        await input.addReg("CA 567 890")
        await input.addReg("CJ 15875")
        await input.addReg("CA 8775")

        let clearReg = await pool.query('delete from reg_plates')
        await pool.query('delete from towns');

        assert.deepEqual(clearReg.rows, []);
    });

    after(function(){
        pool.end();
    })
})