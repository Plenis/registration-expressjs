let assert = require("assert");
let RegistrationOpp = require("../registration");
const pg = require("pg");
const Pool = pg.Pool;

const connectionString =
 process.env.DATABASE_URL || "postgresql://sino:codex123@localhost:5432/registration-opp"

 let useSSL = false;
 let local = process.env.LOCAL || false;
 if (process.env.DATABASE_URL && !local) {
     useSSL = true;
 }
 const pool = new Pool({
     connectionString,
     ssl: useSSL
 });




describe('Registration testing + database tests', function () {

    beforeEach(async function(){
        // clean the tables before each test run
        await pool.query("delete from towns;");
        await pool.query("delete from reg_plates;");
    });


    it('should display valid reg numbers containing CA for the town Cape Town', function () {
         pool.query("delete from towns;");
         pool.query("delete from reg_plates;");

        let input = RegistrationOpp(pool);
         input.addReg("CA 125258")
         input.addReg("CA 987 456")

        let townCar =  input.townCar()
        assert.deepEqual(townCar, ["CA 125258", "CA 987 456"])
    })

    // it('should display valid reg numbers containg CY for the town Bellville', function () {
    //     await pool.query("delete from towns;");
    //     await pool.query("delete from reg_plates;");

    //     let input = RegistrationOpp(pool);
    //     await input.addReg("CY 458")
    //     await input.addReg("CY 876456")
    //     await input.addReg("CY 459 008")
    //     assert.deepEqual(input.getRegNumbers(), ["CY 458", "CY 876456", "CY 459 008"])
    // })

    // it('should display valid reg numbers containing CJ for the town Paarl', function () {
    //     await pool.query("delete from towns;");
    //     await pool.query("delete from reg_plates;");

    //     let input = RegistrationOpp(pool);
    //     input.addReg("CJ 585 458")
    //     input.addReg("CJ 786 678")
    //     assert.deepEqual(input.getRegNumbers(), ["CJ 585 458", "CJ 786 678"])
    // })

    // it('should display duplicated reg numbers as one entry', function () {
    //     await pool.query("delete from towns;");
    //     await pool.query("delete from reg_plates;");

    //     let input = RegistrationOpp(pool);
    //     input.addReg("CA 125258")
    //     input.addReg("CA 125258")
    //     input.addReg("CJ 585 458")
    //     input.addReg("CJ 585 458")
    //     input.addReg("CY 458")
    //     input.addReg("CY 458")
    //     assert.deepEqual(input.getRegNumbers(), ["CA 125258", "CJ 585 458", "CY 458"])
    // })

    // it('should display reg numbers containing CA only, if filtered for Cape Town', function () {
    //     await pool.query("delete from towns;");
    //     await pool.query("delete from reg_plates;");

    //     let input = RegistrationOpp(pool);
    //     input.addReg("CA 567 890")
    //     input.addReg("CJ 246 894")
    //     input.addReg("CY 15875")
    //     input.addReg("CA 8775")
    //     assert.deepEqual(input.filter("CA"), ["CA 567 890", "CA 8775"])
    // })

    // it('should display reg numbers containing CY only, if filtered for Bellville', function () {
    //     await pool.query("delete from towns;");
    //     await pool.query("delete from reg_plates;");

    //     let input = RegistrationOpp(pool);
    //     input.addReg("CA 567 890")
    //     input.addReg("CY 246 894")
    //     input.addReg("CY 15875")
    //     input.addReg("CA 8775")
    //     assert.deepEqual(input.filter("CY"), ["CY 246 894", "CY 15875"])
    // })

    // it('should display reg numbers containing CJ only, if filtered for Paarl', function () {
    //     await pool.query("delete from towns;");
    //     await pool.query("delete from reg_plates;");

    //     let input = RegistrationOpp(pool);
    //     input.addReg("CJ 567 890")
    //     input.addReg("CJ 246 894")
    //     input.addReg("CY 15875")
    //     input.addReg("CJ 8775")
    //     input.addReg("CA 567 890")
    //     input.addReg("CL 246 894")
    //     input.addReg("CJ 15875")
    //     input.addReg("CA 8775")
    //     assert.deepEqual(input.filter("CJ"), ["CJ 567 890", "CJ 246 894", "CJ 8775", "CJ 15875"])
    // })

    // it('should display success message if reg number added is valid and town is recognised', function () {
    //     await pool.query("delete from towns;");
    //     await pool.query("delete from reg_plates;");

    //     let input = RegistrationOpp(pool);
    //     input.addReg("CA 567 890")
    //     input.addReg("CJ 246 894")
    //     input.addReg("CY 15875")
    //     input.addReg("CA 8775")
    //     assert.deepEqual(input.regMsg(), "Registration number added successfully!")
    // })

    after(function(){
        pool.end();
    })
})