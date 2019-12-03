module.exports = function RegistrationOpp(pool) {

  let vehicle;
  let valid_codes = ['all', 'CA', 'CY', 'CJ']

  async function addReg(regNumber) {

    regNumber = regNumber.toUpperCase();

    var townCode = regNumber.substring(0, 2).trim()

    if (regNumber === undefined || regNumber === '' || !valid_codes.includes(townCode)) {
      return false
    }

    vehicle = await pool.query(
      "SELECT * FROM reg_plates WHERE reg_number = $1",
      [regNumber]
    );

    if (vehicle.rowCount === 0) {

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
  }

  async function getRegNumbers() {
    var registrationPlates = await pool.query(
      "SELECT * FROM reg_plates"
    );
    return registrationPlates.rows;
  }

  async function filter(tag) {

    // if (!valid_codes.includes(tag)) {
    //   return false;
    // }

    // let filteredRegNumbers = await pool.query(
    //   "SELECT reg_number, town_id FROM reg_plates"
    // );

    // if (tag !== 'all') {

    //   let townFiltered = await pool.query(
    //     "SELECT id FROM towns WHERE reg_code = $1",
    //     [tag]
    //   );

    //   return filteredRegNumbers.rows.filter(reg => reg.towns == townFiltered.rows[0].id);
    // } else {
    //   return filteredRegNumbers.rows
    // }

    //old filter 
    let regNumbers = await getRegNumbers();
     if(tag === 'all'){
       return regNumbers;
     }

    let filteredRegNumbers = regNumbers.filter(regNumber => {
      return regNumber.reg_number.startsWith(tag);
    })
    console.log(filteredRegNumbers);
    
    return filteredRegNumbers;
  }

  async function getTowns(){

    let allTowns = await pool.query(
      "SELECT * FROM towns"
    );
      
    if (allTowns.rowCount > 0) return allTowns.rows
    
    

  }

  async function townSelected(tag) {

    let storedTowns = await pool.query(
      "SELECT town, reg_code from towns"
    );

    for (let index = 0; index < storedTowns.rowCount; index++) {
      let element = storedTowns.rows[index];
      if (element.startsWith === tag) {
        element.selected = true;
      }
    }
    return storedTowns.rows;
  }

  async function clearReg() {
    let regDelete = await pool.query('DELETE FROM reg_plates');
    return regDelete.rows;
  }


  return {
    addReg,
    getRegNumbers,
    filter,
    townSelected,
    clearReg,
    getTowns
  };
};