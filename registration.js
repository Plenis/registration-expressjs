module.exports = function RegistrationOpp(pool) {
  let message = "";
  let storedReg = {};
  var regex = /^[A-Za-z]{2}\s[-0-9\s]{3}\s[0-9]{3}$/;
  let numberPlate;
  let vehicle;
  let allReg;
  let plateCA;
  let plateCY;
  let plateCJ;

  // function isValidTown(regNumber) {
  //     let regCode = ["CA", "CY", "CJ"];

  //     for (let index = 0; index < regCode.length; index++) {
  //         const plateCode = regCode[index];
  //         if (regNumber.startsWith(plateCode)) {
  //             //if reg code is valid, this process will continue
  //             return true;
  //         }
  //     }
  //     // else it will stop
  //     return false;
  // }

  async function addReg(regNumber) {
    message = "";

    if (regCheck(regNumber)) {
        vehicle = await pool.query('SELECT * FROM reg_plates WHERE reg_number = $1', [numberPlate]);
    }

    if(vehicle.rows.length === 0){

        if(numberPlate.startsWith('CA')){
            await pool.query('insert into reg_plates (reg_number, town_id) values ($1, $2)', [numberPlate, 1]);
            plateCA = await pool.query('SELECT towns.town, reg_plates.reg_number FROM towns INNER JOIN reg_plates ON towns.id = reg_plates.town_id WHERE towns.id = 1')
        }
        else if(numberPlate.startsWith('CY')){
            await pool.query('insert into reg_plates (reg_number, town_id) values ($1, $2)', [numberPlate, 2]);
          plateCY = await pool.query('SELECT towns.town, reg_plates.reg_number FROM towns INNER JOIN reg_plates ON towns.id = reg_plates.town_id WHERE towns.id = 2')

        }
        else if(numberPlate.startsWith('CJ')){
            await pool.query('insert into reg_plates (reg_number, town_id) values ($1, $2)', [numberPlate, 3])
            plateCJ = await pool.query('SELECT towns.town, reg_plates.reg_number FROM towns INNER JOIN reg_plates ON towns.id = reg_plates.town_id WHERE towns.id = 3')
        }
        else{
            message = "Invalid registration number - town not supported."
        }
    }

    // // check if this reg number already exists
    // if (storedReg[regNumber] === undefined) {
    //   if (!isValidTown(regNumber)) {
    //     message = "Invalid registration number - town not supported.";
    //     return false;
    //   }
    //   // adding valid reg
    //   storedReg[regNumber] = 0;

    //   message = "Registration number added successfully!";
    //   return true;
    // } else {
    //   // this is a duplicate
    //   message = "This registration number already exists!";
    //   return false;
    // }
    
  }

  function regMsg() {
    return message;
  }

  async function townCar(place){
    if (place === "") {
        allReg = await pool.query('select * from reg_plates');
        storedReg = allReg.rows
    }
    if (place === "CA") {
        plateCA = await pool.query('SELECT towns.town, reg_plates.reg_number FROM towns INNER JOIN reg_plates ON towns.id = reg_plates.town_id WHERE towns.id = 1')
        storedReg = plateCA.rows;
    }
    if (place === "CY") {
        plateCY = await pool.query('SELECT towns.town, reg_plates.reg_number FROM towns INNER JOIN reg_plates ON towns.id = reg_plates.town_id WHERE towns.id = 2')
        storedReg = plateCY.rows;
    }
    if (place === "CJ"){
        plateCJ = await pool.query('SELECT towns.town, reg_plates.reg_number FROM towns INNER JOIN reg_plates ON towns.id = reg_plates.town_id WHERE towns.id = 3')
        storedReg = plateCJ.rows;
    }
  }

//   function getRegNumbers() {
//     return Object.keys(storedReg);
//   }

  function filter(location) {
    var countReg = [];

    for (var plate in storedReg) {
      if (plate.startsWith(location)) {
        countReg.push(plate);
      }
    }

    return countReg;
  }

  function regCheck(code) {
    var car = regex.test(code);
    if (car === true) {
      numberPlate = code.toUpperCase();
      return numberPlate;
    } else {
      numberPlate = null;
    }
    return numberPlate;
  }

  function displayPlate() {
    return storedReg;
  }

  function getList() {
    return storedReg;
  }

  return {
    regCheck,
    filter,
    addReg,
    regMsg,
    displayPlate,
    // getRegNumbers,
    getList,
    townCar,
    // isValidTown,
    storedReg
  };
};
