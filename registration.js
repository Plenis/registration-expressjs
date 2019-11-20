module.exports = function RegistrationOpp(pool) {

  var regex = /^[A-Za-z]{2}\s[-0-9\s]{3}\s[0-9]{3}$/;
  let numberPlate;
  let vehicle;
  let plate;


  async function addReg(regNumber) {
    plate = regNumber;

    vehicle = await pool.query(
      "SELECT * FROM reg_plates WHERE reg_number = $1",
      [plate]
    );
    townCodes
    let allValidTowns = await pool.query("SELECT * FROM towns");
      console.log(vehicle.rows.length);
     // if(vehicle.rows.length === 0){

    let validTowns = allValidTowns.rows;

    for (let index = 0; index < validTowns.length; index++) {
      let townCode = validTowns[index].reg_code;
       let townId = validTowns[index].id;
      if (plate.startsWith(townCode)) {
        await pool.query(
          "INSERT INTO reg_plates (reg_number, town_id) VALUES ($1,$2)",
          [plate, townId]
        );
      }
    }
  // }
  // else{
  //   var error = ''
  // }
  }

  async function regDuplicate(){
    vehicle = await pool.query(
      "SELECT * FROM reg_plates WHERE reg_number = $1",
      [plate]
    );
    return vehicle.rows.length
  }

  async function getRegNumbers() {
    var registrationPlates = await pool.query("SELECT * FROM reg_plates");
    console.log(registrationPlates.rows);
    
    return registrationPlates.rows;
  }

  async function getTowns() {
    var towns = await pool.query("SELECT * FROM towns");
    return towns.rows;
  }
  
  async function townCodes(town, code) {
    let getCode = await pool.query(
      "INSERT INTO towns (town, reg_code) VALUES ($1,$2)",
      [town, code]
    );
    return getCode;
  }

   async function filter(tag) {
    let regNumbers = await getRegNumbers();
     if(tag === 'all'){
       return regNumbers;
     }
     
    let filteredRegNumbers = regNumbers.filter(regNumber => {
      return regNumber.reg_number.startsWith(tag);
    })

    return filteredRegNumbers;
  } 

  async function regCheck(code) {
    var car = regex.test(code);
    if (car === true) {
      numberPlate = code.toUpperCase();
      return numberPlate;
    } else {
      numberPlate = null;
    }
    console.log("plate:", numberPlate);
    return numberPlate;
  }

  async function clearReg(){
    let regDelete = await pool.query('DELETE FROM reg_plates');
    return regDelete.rows;
  }


  return {
    addReg,
    getRegNumbers,
    regDuplicate,
    townCodes,
    filter,
    regCheck,
    getTowns,
    clearReg
  };
};


