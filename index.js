const inputSlider=document.querySelector("[data-lenthslider]");
const lengthDisplay=document.querySelector("[data-length]");
const passwordDisplay=document.querySelector("[data-passwordDisplay]");
const copyBtn=document.querySelector("[data-copy]");
const copyMsg=document.querySelector("[data-copyMsg]");
const uppercaseCheck=document.querySelector("#uppercase");
const lowercaseCheck=document.querySelector("#lowercase");
const numbersCheck=document.querySelector("#numbers");
const symbolsCheck=document.querySelector("#symbol");
const indicator=document.querySelector("[data-indicator]");
const generateBtn=document.querySelector(".generate-button");
const allcheckBox=document.querySelectorAll("input[type=checkbox]");

const symbols='~`!@#$%^&*()_-+=|\}{[]:;"<>,.?/';
let pasword="";
let passwordLength=10;
let checkCount=0;
setIndicator("#ccc");

handerSlider();
function handerSlider(){
     inputSlider.value=passwordLength;
     lengthDisplay.innerText=passwordLength;
     const min=inputSlider.min;
     const max=inputSlider.max;
     inputSlider.style.backgroundSize=((passwordLength-min)*100/(max-min))+"% 100%";
}

function setIndicator(color){
    indicator.style.backgroundColor=color;
    indicator.style.boxShadow= `0px 0px 12px 1px ${color}`;
}

function getRandomInteger(min,max){
    // math.random() generate random no between 0 to 1
    // Math.random() * (max-min) genrate random no betwwen max-min
    // to get integer we use floor math.floor
    // to get no between min to max we have to add min
   return Math.floor(Math.random() * (max-min))+min;
   
}
function genrateRandomNumber(){
    return getRandomInteger(0,9);
}
function generateLowercase(){
    // ascii value of small a and z
    return String.fromCharCode(getRandomInteger(97,123));
}
function generateUppercase(){
    // ascii value of small a and z
    return String.fromCharCode(getRandomInteger(65,91));
}
function generateSymbols(){
    const randNum=getRandomInteger(0,symbols.length);
    return symbols.charAt(randNum);
}

function calcstrength(){
    let up=false;
    let lo=false;
    let num=false;
    let sym=false;
    if(uppercaseCheck.checked) up=true;
    if(lowercaseCheck.checked) lo=true;
    if(numbersCheck.checked) num=true;
    if(symbolsCheck.checked) sym=true;

    if(up && lo && (num||sym) && passwordLength>=8){
        setIndicator("#0f0");
    }
    else if(( lo || up ) && (num || sym) && passwordLength>=6){
        setIndicator("#ff0");
    }
    else{
        setIndicator("#f00");
    }
}

async function copyContent(){
    try {
        navigator.clipboard.writeText(passwordDisplay.value);
        copyMsg.innerText="copied";
    } catch (e) {
        copyMsg.innerText="failed";
    }
    // to make copy vala msg visiblr
    copyMsg.classList.add("active");
    setTimeout(() => {
        copyMsg.classList.remove("active");
    }, 5000);
}
function shufflePassword(array){
        // fisher yates method
    for(let i=Array.length-1;i>0;i--){
        const j=Math.floor(Math.random()*(i+1));
        const t=array[i];
        array[i]=array[j];
        array[j]=t;
    }
    let str="";
    array.forEach((el)=>(str+=el));
    return str;
}
function handleCheckBoxchange(){
    checkCount=0;
    allcheckBox.forEach((checkbox)=>{
        if(checkbox.checked){
            checkCount++;
        }
        // special condition
        if(passwordLength<checkCount){
            passwordLength=checkCount;
            handerSlider();
        }
    });
}
allcheckBox.forEach((checkbox)=>{
    checkbox.addEventListener('change',handleCheckBoxchange);
})
inputSlider.addEventListener("input",(e)=>{
    passwordLength=e.target.value;
    handerSlider();
})

copyBtn.addEventListener("click",()=>{
    if(passwordDisplay.value)
        copyContent();
})

generateBtn.addEventListener("click",()=>{
    //   none checkbox select
    if(checkCount<=0) return;

    if(passwordLength<checkCount){
        passwordLength=checkCount;
        handerSlider();
    }

    // lets genrate new password
    let password="";

    // lets put stuff
    // if(uppercaseCheck.checked){
    //     password+=generateUppercase();
    // }
    // if(lowercaseCheck.checked){
    //     password+=generateLowercase();
    // }
    // if(numbersCheck.checked){
    //     password+=genrateRandomNumber();
    // }
    // if(symbolsCheck.checked){
    //     password+=generateSymbols();
    // }
     
    let funcArr=[];
    if(uppercaseCheck.checked){
        funcArr.push(generateUppercase);
    }
    if(lowercaseCheck.checked){
        funcArr.push(generateLowercase);
    }
    if(numbersCheck.checked){
        funcArr.push(genrateRandomNumber);
    }
    if(symbolsCheck.checked){
        funcArr.push(generateSymbols);
    }
    // COMPULSORY ADDITION
    for (let i=0; i<funcArr.length; i++) {
         password+=funcArr[i]();
    }
    //  REMAINING ADDITION
    for (let i=0; i<passwordLength-funcArr.length; i++) {
        let indi=getRandomInteger(0,funcArr.length);
        password+=funcArr[indi]();
    }

    // shuffle the password
    password=shufflePassword(Array.from(password));
    // SHOW IN UI
    passwordDisplay.value=password;
    // CALCULATE STRENGTH
    calcstrength();
})