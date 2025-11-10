const rand = (sz,_r) => {
  return Math.floor(_r*sz);
}

function mulberry32(seed) {
return function() {
let t = (seed += 0x6D2B79F5);
t = Math.imul(t ^ (t >>> 15), t | 1);
t ^= t + Math.imul(t ^ (t >>> 7), t | 61);
return ((t ^ (t >>> 14)) >>> 0) / 4294967296;
};
}

const exists = (_r, _matches) => {
  let check = false;
  if (_matches.length == 0){
    return false;
  }
  for (let i = 0; i< _matches.length ; i++){
    if (_r == _matches[i]){
      check = true;
      break;
    }
  }
  return check;
}

const indexOf = (val, arr) => {
  let ind = null;
  for (let i = 0; i<arr.length; i++){
    if (arr[i] == val){
      return i;
    }
  }
}

const twin = (_r, _i, _arr1) => {
  let check = false;
  if (_arr1.length == 0){
    return false;
  }
  
  if (_arr1[_r] == _i){
    check = true;
  }
  return check;
}

const genSantas = (seed) => {

  const random = mulberry32(seed);
  const p = [1,0,3,2,5,4,7,6]; // these are the partner exclusions
  
  const rec = [];

  let matches = [];

  for (let i = 0; i<8; i++){
    let tryCnt = 0;
    let r = rand(8, random());

    while (r == i || r == p[i] || exists(r, matches) || twin(r, i, matches)){
      r = rand(8, random());
      tryCnt++;
      seed++;
      if (tryCnt == 30){
        matches = [];
        i = 0;
        seed++;
      }
    }
    matches[i] = r;
  } 
  seed++;
  return matches;
}

const genString = (_pairings, _santa)=>{
    const names = ["Charlie", "Meredith", "Dean","Kristen","Matt","Juan" ,"Steve", "Marie"];
  let pairStr = "\n";
  for (let i = 0; i<8; i++){
    pairStr += names[i] + " is buying for " + names[_pairings[i]] +"\n\n";
  }
  let ind = indexOf(_santa,names);
  //console.log(pairStr);
  //return pairStr;
  let msg = names[ind] + " is buying for " + names[_pairings[ind]];
  if (names[ind] == undefined){msg = "[Select yourself from the dropdown above.]"}
  return [msg,pairStr];
}

window.onload = function(){

    const initSeed = Math.floor(Math.random()*10000);

    const seedTxt = document.getElementById("seed");
    const seedpreview = document.getElementById("seedpreview");
    const santaselect = document.getElementById("santaselect");
    const message = document.getElementById("message");

    // seedTxt.oninput = function(){

    //     let seed = 0;
    //     seed = this.value;
    //     //console.log(genString(genSantas(seed), names));

    // }



    seedpreview.innerHTML = initSeed;
    seedTxt.value = initSeed;
    let curSanta = santaselect.options[santaselect.selectedIndex].text;
    let gen = genString(genSantas(parseInt(seedTxt.value)), curSanta);

    console.log("seed " + seedTxt.value + ":\n" + gen[1]);


    seedTxt.oninput = function(){
        seedpreview.innerHTML = this.value;
        if (seedTxt.value == ""){
            seedpreview.innerHTML = 0;
            seedTxt.value = 0;
        }
        
        gen = genString(genSantas(parseInt(seedTxt.value)), curSanta);

        message.innerHTML = gen[0];
        console.log("seed " + this.value + ":\n" + gen[1]);
    }

    santaselect.oninput = function(){
        seedpreview.innerHTML = seedTxt.value;
        if (seedTxt.value == ""){
            seedpreview.innerHTML = 0;
            seedTxt.value = 0;
        }


        curSanta = santaselect.options[santaselect.selectedIndex].text;

        message.innerHTML = genString(genSantas(parseInt(seedTxt.value)), curSanta)[0];
    }



}
