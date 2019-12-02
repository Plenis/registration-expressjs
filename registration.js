module.exports = function RegistrationOpp(pool) {

  // var regex = /^[A-Za-z]{2}\s[-0-9\s]{3}\s[0-9]{3}$/.toUpperCase;
  // let numberPlate;
  let vehicle;
  // let plate;

  let valid_codes = ['all', 'CA', 'CY', 'CJ']

  async function addReg(regNumber) {

    regNumber = regNumber.toUpperCase();

    var townCode =  regNumber.substring(0, 2).trim()

    if(regNumber === undefined || regNumber === '' || !valid_codes.includes(townCode)){
      return fasle
    }

     vehicle = await pool.query(
        "SELECT * FROM reg_plates WHERE reg_number = $1",
        [regNumber]
      );

      if(vehicle.rowCount === 0){

        let townID = await pool.query(
          "SELECT id FROM towns WHERE reg_code = $1",
          [townCode]
        );

            await pool.query(
          "INSERT INTO reg_plates (reg_number, town_id) VALUES ($1,$2)",
          [regNumber, townID.rows[0].id]
        );
        return true;
      }

    // plate = regNumber;

    // vehicle = await pool.query(
    //   "SELECT * FROM reg_plates WHERE reg_number = $1",
    //   [plate]
    // );
  
    // let allValidTowns = await pool.query("SELECT * FROM towns");
    //   console.log(vehicle.rows.length);

    // let validTowns = allValidTowns.rows;

    // for (let index = 0; index < validTowns.length; index++) {
    //   let townCode = validTowns[index].reg_code;
    //    let townId = validTowns[index].id;
    //   if (plate.startsWith(townCode)) {
    //     await pool.query(
    //       "INSERT INTO reg_plates (reg_number, town_id) VALUES ($1,$2)",
    //       [plate, townId]
    //     );
    //   }
    // }
  }

  // async function regDuplicate(){
  //   vehicle = await pool.query(
  //     "SELECT * FROM reg_plates WHERE reg_number = $1",
  //     [plate]
  //   );
  //   return vehicle.rows.length
  // }

  async function getRegNumbers() {
    var registrationPlates = await pool.query(
      "SELECT * FROM reg_plates"
      );
    return registrationPlates.rows;
  }

  // async function getTowns() {
  //   var towns = await pool.query("SELECT * FROM towns");
  //   return towns.rows;
  // }
  
  // async function townCodes(town, code) {
  //   let getCode = await pool.query(
  //     "INSERT INTO towns (town, reg_code) VALUES ($1,$2)",
  //     [town, code]
  //   );
  //   return getCode;
  // }

   async function filter(tag) {

    if(!valid_codes.includes(tag)){
      return false;
    }

    let filteredRegNumbers = await pool.query(
      "SELECT reg_number, town_id FROM reg_plates"
    );
    
    if(tag !== 'all'){

      let townFiltered = await pool.query(
        "SELECT id FROM towns WHERE reg_code = $1",
        [tag]
      );

      return filteredRegNumbers.rows.filter(reg => reg.towns == townFiltered.rows[0].id);
    }
    else{
      return filteredRegNumbers.rows
    }
    // let regNumbers = await getRegNumbers();
    //  if(tag === 'all'){
    //    return regNumbers;
    //  }
     
    // let filteredRegNumbers = regNumbers.filter(regNumber => {
    //   return regNumber.reg_number.startsWith(tag);
    // })

    // return filteredRegNumbers;
  } 

  async function townSelected(tag) {

    let storedTowns = await pool.query(
      "SELECT town, reg_code from towns"
    );

    for (let index = 0; index < storedTowns.rowCount; index++) {
      let element = storedTowns.rows[index];
      if(element.startsWith === tag){
        element.selected = true;
      }
    }
    return storedTowns.rows;
    // var car = regex.test(code);
    // if (car === true) {
    //   numberPlate = code.toUpperCase();
    //   return numberPlate;
    // } else {
    //   numberPlate = null;
    // }
    // console.log("plate:", numberPlate);
    // return numberPlate;
  }

  async function clearReg(){
    let regDelete = await pool.query('DELETE FROM reg_plates');
    return regDelete.rows;
  }


  return {
    addReg,
    getRegNumbers,
    // regDuplicate,
    // townCodes,
    filter,
    // regCheck,
    townSelected,
    // getTowns,
    clearReg
  };
};


