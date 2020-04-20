// GET_LIMITS_WRS() constants:

// all constants are 1-indexed, aka the actual row/col numbers on the spreadsheet
const LIMITS_WR_SHEET_NAME = "Tuzan";

const LIMIT_STARTING_ROW = 16; // basic tank ffa's row
const LIMIT_STARTING_COLUMN = 'C'; // basic tank ffa's column

const LIMIT_TANK_NAMES_COLUMN = 'B';
const LIMIT_GAMEMODE_NAMES_ROW = 1;

const LIMIT_RECORDS_SHEET_NAME = "Records";
const LIMIT_SHEET_TO_DISPLAY_RESULTS_ON_NAME = "Limit's Wr's";

const LIMIT_GET_LIMITS_WRS_DISPLAY_FROM_ROW = 3;
const LIMIT_GET_LIMITS_WRS_DISPLAY_FROM_COL = 'A';



//--------------------------------

// GET_OLD_RECORD_HOLDERS constants:

// these are 1-indexed, aka the actual row/col numbers on the spreadsheet
const GETOLD_OLDEST_RECORDS_SPREADSHEET_ID = "1GRGfit3AlRHVEYL-5nhudHuBpj1nRrZqeECdNb5EBm0";
const GETOLD_SHEET_TO_DISPLAY_RESULTS_ON_NAME = "Limit's Wr's";
const GETOLD_DISPLAY_FROM_ROW = 3;
const GETOLD_DISPLAY_FROM_COL = 'D';

const LIMITS_OTHER_NAMES = ["limit", "Limit", "tuzan", "Tuzan", "limit breaker", "Limit breaker", "Limit Breaker", "jian", "Jian", "astolfo", "Astolfo"];



//--------------------------------




function GET_LIMITS_WRS() {
  
  // get wr records sheet
  const sheet = SpreadsheetApp.getActiveSpreadsheet().getSheetByName(LIMIT_RECORDS_SHEET_NAME);
  
  // getDataRange returns the entire "Records" sheet 
  const values = sheet.getDataRange().getValues();
  
  const startingRowZeroIndex = LIMIT_STARTING_ROW - 1;
  const startingColZeroIndex = LIMIT_STARTING_COLUMN.charCodeAt(0) - 'A'.charCodeAt(0);
  
  const tankNamesColZeroIndex = LIMIT_TANK_NAMES_COLUMN.charCodeAt(0) - 'A'.charCodeAt(0);
  const gamemodeNamesRowZeroIndex = LIMIT_GAMEMODE_NAMES_ROW - 1;
  
  const numRows = values.length;
  const numCols = values[startingRowZeroIndex].length;
  
  // initialize with the records that limit himself deleted for self-feeding (I only found 8, but I think theres a 9th somewhere)
  let limitArray = [
    ["Gunner", "2TDM"],
    ["Bent Hybrid", "2TDM"],
    ["Conqueror", "2TDM"],
    ["Constructor", "2TDM"],
    ["Ranger", "2TDM"],
    ["Septa Trapper", "Maze 2TDM"],
    ["Cyclone", "Maze 2TDM"],
    ["Bushwhacker", "Maze 2TDM"],
    ["Spawner", "4TDM"],
  ];
  
  // iterate through every record, and add Limit's to the array
  for (let row = startingRowZeroIndex; row < numRows; ++row) {  
    for (let col = startingColZeroIndex; col < numCols; col += 3) { // yes, its += 3
      
      // if the proof link cell is empty, then you're currently not looking at a record and should skip ahead
      // for example, the blank row between tier 1,2,3,4 tank records or the gamemode name rows
      const proofLink = values[row][col + 2];
      if (proofLink === "") {
        continue;
      }
            
      const name = values[row][col + 1];
      const formattedName = name.trim().toLowerCase();
      
      // get tank and gamemode of Limit's records, and push them to the array
      if (formattedName === LIMITS_WR_SHEET_NAME.toLowerCase()) {
        
        const tank = values[row][tankNamesColZeroIndex];
        const gamemode = values[gamemodeNamesRowZeroIndex][col + 1];
        
        limitArray.push([tank, gamemode]);
      }
    }
  }
  
  
  // these are 1-indexed
  const printRow = LIMIT_GET_LIMITS_WRS_DISPLAY_FROM_ROW;
  const printCol = LIMIT_GET_LIMITS_WRS_DISPLAY_FROM_COL.charCodeAt(0) - 'A'.charCodeAt(0) + 1;
  const printNumRows = limitArray.length;
  const printNumCols = limitArray[0].length;
  const printRange = SpreadsheetApp
                       .getActiveSpreadsheet()
                       .getSheetByName(LIMIT_SHEET_TO_DISPLAY_RESULTS_ON_NAME)
                       .getRange(printRow, printCol, printNumRows, printNumCols);
  
  printRange.setValues(limitArray); // print results

  return limitArray;
}




function GAMEMODES_MATCH(limitGM, otherGM) {
  
  if (limitGM === otherGM) {return true;} // ffa, maza, 2tdm, 4tdm, etc...
  
  else if (limitGM.includes("mothership") && otherGM.includes("mothership")) {return true;}
  
  else if (limitGM.includes("domination") && otherGM.includes("domination")) {return true;}
  
  else if (limitGM === "open34tdm" && otherGM === "opentdm") {return true;}
  
  else if (limitGM === "open34tdm" && otherGM.includes("open") && otherGM.includes("tdm") && !otherGM.includes("maze")) {return true;}
  
  else if (limitGM === "maze2tdm" && otherGM === "2tdmmaze") {return true;}
  
  else if (limitGM === "maze4tdm" && otherGM === "4tdmmaze") {return true;}
  
  else if (limitGM === "openmaze4tdm" && otherGM === "open4tdmmaze") {return true;}
  
  
  
  return false;
}





function GET_OLD_RECORD_HOLDERS(limitArray) {
  
  const values = SpreadsheetApp
                   .openById(GETOLD_OLDEST_RECORDS_SPREADSHEET_ID)
                   .getSheets()[0]
                   .getDataRange()
                   .getValues();
  
  const getPreviousRecordArray = [];
  
  limitArray.forEach((record) => {
    
    const limitTank = record[0]
                        .trim() // "  Auto Tri-Angle  " --> "Auto Tri-Angle"
                        .toLowerCase() // "Auto Tri-Angle" --> "auto tri-angle"
                        .replace(/-/gi, "") // "auto tri-angle" --> "auto triangle" (uses regex to remove all dashes)
                        .replace(/ /gi, ""); // "auto triangle" --> "autotriangle" (uses regex to remove all spaces)
  
    const limitGamemode = record[1]
                            .trim() // "  Open 3/4 TDM (All)  " --> "Open 3/4 TDM (All)"
                            .toLowerCase() // "Open 3/4 TDM (All)" --> "open 3/4 tdm (all)"
                            .replace(/\//gi, "") // "open 3/4 tdm (all)" --> "open 34 tdm (all)" == uses regex to remove forward slash
                            .replace(/\(/gi, "") // "open 34 tdm (all)" --> "open 34 tdm all)" == uses regex to remove opening parenthesis
                            .replace(/\)/gi, "") // "open 34 tdm all)" --> "open 34 tdm all" == uses regex to remove closing parenthesis
                            .replace(/ /gi, ""); // "open 34 tdm all" --> "open34tdmall" == uses regex to remove spaces
  
  Logger.log(values);
  
  for (let row = values.length - 1; row >= 2; --row) { // start from row values.length-1, go up until row 2, since rows 0 and 1 are the links to other sheets, not old records
    
    const [ , status, score, name, proofLink, tank, gamemode, , ] = values[row];
    
    const formattedTank = tank
             .trim() // "  Auto Tri-Angle  " --> "Auto Tri-Angle"
             .toLowerCase() // "Auto Tri-Angle" --> "auto tri-angle"
             .replace(/-/gi, "") // "auto tri-angle" --> "auto triangle" (uses regex to remove all dashes)
             .replace(/ /gi, ""); // "auto triangle" --> "autotriangle" (uses regex to remove all spaces)
    
    const formattedGamemode = gamemode
                 .trim() // "  Auto Tri-Angle  " --> "Auto Tri-Angle"
                 .toLowerCase() // "Auto Tri-Angle" --> "auto tri-angle"
                 .replace(/-/gi, "") // "auto tri-angle" --> "auto triangle" (uses regex to remove all dashes)
                 .replace(/ /gi, ""); // "auto triangle" --> "autotriangle" (uses regex to remove all spaces)
    
    
    if (LIMITS_OTHER_NAMES.includes(name)) {continue;} // ignore anything that limit submitted
    
    
    if (formattedTank === limitTank && GAMEMODES_MATCH(limitGamemode, formattedGamemode)) {
      getPreviousRecordArray.push(values[row]);
    }
    
  }
    
  })
  
  
  // these are 1-indexed
  const printRow = GETOLD_DISPLAY_FROM_ROW;
  const printCol = GETOLD_DISPLAY_FROM_COL.charCodeAt(0) - 'A'.charCodeAt(0) + 1;
  const printNumRows = getPreviousRecordArray.length;
  const printNumCols = getPreviousRecordArray[0].length;
  const printRange = SpreadsheetApp
                       .getActiveSpreadsheet()
                       .getSheetByName(GETOLD_SHEET_TO_DISPLAY_RESULTS_ON_NAME)
                       .getRange(printRow, printCol, printNumRows, printNumCols);
  
  printRange.setValues(getPreviousRecordArray);
}



function LIMIT_MAIN() {
  
  const limitArray = GET_LIMITS_WRS();  
  GET_OLD_RECORD_HOLDERS(limitArray);
}
