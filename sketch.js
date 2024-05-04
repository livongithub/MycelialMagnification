// using tutorials and code by Jeff Thompson and research by D. Moore

// fungi variables with weather
let maxAge;
let lineWidVar;
let lineAlpha;
let canvAlpha;
let fungAmount;
// custom map function to put in the API ajax function
function customMap(value, start1, stop1, start2, stop2) {
  return start2 + (stop2 - start2) * ((value - start1) / (stop1 - start1));
}

let canvWidVar = 650;
let canvHeiVar = 450;


// making the substrate object array
// let substrates = []
// for(i=0; i<canvWidVar; i++){
//   for(j=0; j<canvHeiVar; j++){
//     let tempObj = {
//        posX: i,
//        posY: j,
//        amountOfSubstrate : 10
//     }
//     substrates.push(tempObj)
//   }
// }
// console.log(substrates.length)

// text input and output variables
let Acker;
let Marian;
let textInput = document.getElementById('text-input');
let textStr = "placeholder";
let inTypingPhase = true;
let fontButton = document.getElementById('font-button');
let fontCounter = 0;
let fontArray = [];
let colorButton = document.getElementById('color-button');
let colorCounter = 0;
let numOfCols = 10;
let buttonParent = document.getElementById('sub-button');
let leftSide = document.getElementById('button-side')
let typeSizeInput = document.getElementById('type-size');
let currentTypeSize = 100;
let xDistInt = document.getElementById('x-dist');
let xDistSize = 0;
let yDistInt = document.getElementById('y-dist');
let yDistSize = 225;
let lineHeightInt = document.getElementById('line-hei');
let lineHeightSize = 150;
let labels = document.querySelectorAll('label')

let numFungiSpan = document.getElementById("num-of-fung")
numFungiSpan.innerHTML = 0

let colBoolSwitch = false;

let submit2 = document.getElementById("submit-2");
submit2.addEventListener('click', generer)

let customButton = document.getElementById("customize")
let crossOut = document.getElementById("cross")

customButton.addEventListener("click", ()=>{
  console.log('click')
  leftSide.style.display = 'inline'
})

crossOut.addEventListener("click", ()=>{
  console.log('click')
  leftSide.style.display = 'none'
})

let radios = document.querySelectorAll('input[name="alignment"]');
let backgroundradio = document.querySelectorAll('input[type="radio"]::before ')
let currentAlignment = "CENTER"

radios.forEach(radio => {
  radio.addEventListener('change', logCheckedValue);
});

function logCheckedValue() {
  const checkedRadio = document.querySelector('input[name="alignment"]:checked');
  console.log(checkedRadio.value); 
  currentAlignment = checkedRadio.value
}

textInput.addEventListener('input', ()=>{
  textStr = textInput.value;
});

typeSizeInput.addEventListener('input', ()=>{
  currentTypeSize = +typeSizeInput.value;
})

yDistInt.addEventListener('input', ()=>{
  yDistSize = +yDistInt.value;
})

xDistInt.addEventListener('input', ()=>{
  xDistSize = +xDistInt.value; 
})

lineHeightInt.addEventListener('input', ()=>{
  lineHeightSize = +lineHeightInt.value; 
})

fontButton.addEventListener('click',()=>{
  fontCounter +=1; 
  if(fontCounter > fontArray.length -1){
    fontCounter = 0;
  }
});

colorButton.addEventListener('click', ()=>{
  colorCounter +=1
  if(colorCounter > numOfCols-1){
    colorCounter = 0
  }
  console.log(colorCounter)   
});


if (window.innerWidth >= 1150 ){
  canvWidVar = 650
  canvHeiVar = 450
  console.log(canvWidVar)
} else if(window.innerWidth <= 1150 && window.innerWidth >= 1020){
  canvWidVar = 575
  canvHeiVar = 425
  console.log(canvWidVar)
} else if ( window.innerWidth <= 1020 && window.innerWidth >= 900){
  canvWidVar = 470
  canvHeiVar = 350
  console.log(canvWidVar)
}

window.addEventListener("resize", ()=>{
  if (window.innerWidth >= 1150 ){
    canvWidVar = 650
    canvHeiVar = 450
    currentTypeSize = 100
  } else if(window.innerWidth <= 1150 && window.innerWidth >= 1020){
    canvWidVar = 575
    canvHeiVar = 425
    currentTypeSize = 75
  } else if ( window.innerWidth <= 1020 && window.innerWidth >= 900){
    canvWidVar = 470
    canvHeiVar = 350
    currentTypeSize = 50
  }
})

function windowResized() {
  resizeCanvas(canvWidVar, canvHeiVar);
}

// getting the weather data 
let temp, feelsLike, humidity, pressure, maxTemp, minTemp, speedVarHolder;
const apiKey = "850f446d9f4220e8aeb433a672cdef52";
const lat = 40.7209;
const lon = -74.0007;
const url = `https://api.openweathermap.org/data/2.5/weather?lat=${lat}&lon=${lon}&units=imperial&appid=${apiKey}`;

let humidSpan = document.getElementById("humidity-input")
let tempSpan = document.getElementById("temp-input")
let conditionsSpan = document.getElementById("cond-span")

fetch(url)
  .then(response => response.json())
  .then(data => {
    const temp = data.main.temp; 
    const feelsLike = data.main.feels_like; 
    const humidity = data.main.humidity;
    const pressure = data.main.pressure;
    const maxTemp = data.main.temp_max;
    const minTemp = data.main.temp_min;

    console.log(humidity)
    maxAge = customMap(humidity, 10, 90, 30, 60)
    lineWidVar = customMap(temp, 20, 100, 0.05, 0.4)
    speedVarHolder = customMap(humidity, 10, 90, 0.01, 0.3)
    lineAlpha = customMap(temp, 20, 100, 30, 100)
    canvAlpha = customMap(temp, 20, 100, 0, 1)
    fungAmount = customMap(humidity, 10, 90, 5000, 20000)
    console.log(maxAge, lineWidVar, speedVarHolder, lineAlpha, fungAmount)	

    humidSpan.innerHTML = `${humidity}%`
    tempSpan.innerHTML = `${temp}ºF`
    if(humidity > 60 || temp > 70){
      conditionsSpan.innerHTML = "great"
    } else if(humidity > 50 || temp > 60){
      conditionsSpan.innerHTML = "good"
    } else if(humidity > 40 || temp > 50){
      conditionsSpan.innerHTML = "ok"
    } else if(humidity > 30 || temp > 30){
      conditionsSpan.innerHTML = "bad"
    } else {
      conditionsSpan.innerHTML = "very bad"
    }
  })
  .catch(error => {
    console.error(error);
  });

let paused = false;     // so that you can start and stop the growth
let fungi = [];     // empty array to keep track of the number of branches on the screen

// functions for the buttons
let generButton;
let pauseButton;
let refreshButton;

function setup() {
  createCanvas(canvWidVar, canvHeiVar);
  // catch the fonts
  Acker = loadFont('fonts/Acker.otf'); 
  Marian = loadFont('fonts/Marian.otf');
  fontArray = [Acker, Marian, 'Arial']

  // make buttons with functions
  pauseButton = createButton('pause growing')
  pauseButton.parent(buttonParent)
  pauseButton.mousePressed(pauseGrowth)
  pauseButton.class('submition-buttons')
  pauseButton.id('pause-button')

  refreshButton = createButton('refresh page')
  refreshButton.parent(buttonParent)
  refreshButton.mousePressed(reloadPage)
  refreshButton.class('submition-buttons')

  generButton = createButton('submit')
  generButton.parent(leftSide)
  generButton.mousePressed(generer)
  generButton.class('submition-buttons')
  generButton.id('generer-button')

  smallCanvas = createGraphics(width, height);
}

function reloadPage(){
  location.reload();
}

function generer(){
  inTypingPhase = false;
  stroke(200, 10);
  fill(0, 0, 0);
  for(x=0; x<width; x+=1){
    for(y=0; y<height; y+=1){
      colorIndex = get(x, y)
      bright = (colorIndex[0]+colorIndex[1]+colorIndex[2])/3
      if(bright< 230){
        if(random(100)< 10){
          for(let i=0; i<floor(random(2, 4)); i++){
            let f = new Fungus(x, y);
            fungi.push(f);
          }
        }
      }
      
    }
  }
  background(246, 245, 231)
}

function grayOut(){
  generButton.style('color', 'gray');
  generButton.style('border', '1px solid gray');
  pauseButton.style('color', '#ac936e')
  pauseButton.style('border', '1px solid #ac936e');
  fontButton.style.color = 'gray'
  fontButton.style.border = '1px solid gray'
  colorButton.style.color = 'gray'
  customButton.style.border = '1px solid gray'
  customButton.style.color = 'gray'
  submit2.style.border = '1px solid gray'
  submit2.style.color = 'gray'
  colorButton.style.border = '1px solid gray'
  xDistInt.style.border = '2px solid gray'
  yDistInt.style.border = '2px solid gray'
  lineHeightInt.style.border = '2px solid gray'
  typeSizeInput.style.border = '2px solid gray'
  labels.forEach(label =>{
    label.style.color = 'gray'
  })
  radios.forEach(radio => {
    radio.style.border = '2px solid gray'
  })
  colBoolSwitch = true;


  radios.forEach(radio => {
    // Add event listener for input changes
    radio.addEventListener('input', () => {
        // Select the slider thumb within the input range
        let thumb = radio.nextElementSibling; // Assuming the thumb is next to the input range
        // Customize the styles of the slider thumb
        thumb.style.backgroundColor = 'red';
        thumb.style.border = '2px solid blue';
        thumb.style.width = '20px';
        // Add more style customizations as needed
    });
});
}

function pauseGrowth(){
  paused = !paused;
}

function draw() {
if(inTypingPhase){
  
  background(246, 245, 231);
  textAlign(eval(currentAlignment));
  textWrap(WORD);
  textFont(fontArray[fontCounter]);

  if(colorCounter == 0){
    fill(239, 134, 48);
  } else if (colorCounter == 1){
    fill(88, 122, 172);
  }else if (colorCounter == 2){
    fill(246, 172, 177);
  }else if (colorCounter == 3){
    fill(95, 204, 133);
  }else if (colorCounter == 4){
    fill(108, 103, 249);
  }else if (colorCounter == 5){
    fill(232, 50, 50);
  }else if (colorCounter == 6){
    fill(63, 219, 203);
  }else if (colorCounter == 7){
    fill(226, 102, 152);
  }else if (colorCounter == 8){
    fill(172, 147, 110);
  }else if (colorCounter == 9){
    fill(30, 30, 30);  
  }


  // fill(0, 0, 0);
  textSize(currentTypeSize);
  text(textStr, xDistSize, yDistSize, width, height);
  textLeading(lineHeightSize);
  }else{  
  if(!paused && fungi.length < fungAmount && fungi.length != 0){
    numFungiSpan.innerHTML  = fungi.length
    if(!colBoolSwitch){  
      grayOut()
    }
    
      background(246, 245, 231, canvAlpha)
    //     using a backward for loop to account for the fact that the length of fungi is growing all the time to avoid errors
        for(let i=fungi.length-1; i>=0; i-=1){
    //       get the current object
          let f = fungi[i];
    //       call the update from the class
          f.update();
    //       remove any overaged fungi 
        

          if(f.initSporeAge > maxAge){
            f.markForRemoval = true; // Mark for removal
          }
          
          fungi = fungi.filter(f => !f.markForRemoval);
    //     call the display function from the class to draw the updated spores
          f.display();
        }
      }
}

}


class Fungus {
  constructor(x, y, angle){
//     values taken from the constructor
    this.x = x
    this.y = y
    this.prevX = x
    this.prevY = y
//     values common to all fungi
    this.angleChange = radians(10)
    this.angleSplit = radians(45)
//     more scale than speed but scale is a prewritten function oT_To
    this.speed = speedVarHolder
    this.splitChance = 2
    
//     backup value, in case the angle is not defined 
    this.angle = angle || random(0, TWO_PI)
    
//     values that change every frame
    this.distFromMiddle
    this.initSporeAge = 0
    this.markForRemoval = false; // Flag for removal

// color 1 = 239, 134, 48
// color 2 = 88, 122, 172


if(colorCounter == 0){
  this.red = map(fungi.length, 0, fungAmount, 239, 88)
  this.blue = map(fungi.length, 0, fungAmount, 48, 134)
  this.green = map(fungi.length, 0, fungAmount, 172, 122)
} else if (colorCounter == 1){
  this.red = map(fungi.length, 0, fungAmount, 88, 239)
  this.blue = map(fungi.length, 0, fungAmount, 134, 48)
  this.green = map(fungi.length, 0, fungAmount, 122, 172)
}else if (colorCounter == 2){
  this.red = map(fungi.length, 0, fungAmount, 246, 95)
  this.green = map(fungi.length, 0, fungAmount, 172, 204)
  this.blue = map(fungi.length, 0, fungAmount, 177, 133)
}else if (colorCounter == 3){
  this.red = map(fungi.length, 0, fungAmount, 95, 246)
  this.green = map(fungi.length, 0, fungAmount, 204, 172)
  this.blue = map(fungi.length, 0, fungAmount, 133, 177)
}else if (colorCounter == 4){
  this.red = map(fungi.length, 0, fungAmount, 108, 232)
  this.green = map(fungi.length, 0, fungAmount, 103, 50)
  this.blue = map(fungi.length, 0, fungAmount, 249, 50)
}else if (colorCounter == 5){
  this.red = map(fungi.length, 0, fungAmount, 232, 108)
  this.green = map(fungi.length, 0, fungAmount, 50, 103)
  this.blue = map(fungi.length, 0, fungAmount, 50, 249)
}else if (colorCounter == 6){
  fill(63, 219, 203);
  this.red = map(fungi.length, 0, fungAmount, 63, 226)
  this.green = map(fungi.length, 0, fungAmount, 219, 102)
  this.blue = map(fungi.length, 0, fungAmount, 203, 152)
}else if (colorCounter == 7){
  fill(226, 102, 152);
  this.red = map(fungi.length, 0, fungAmount, 226, 63)
  this.green = map(fungi.length, 0, fungAmount, 106, 219)
  this.blue = map(fungi.length, 0, fungAmount, 152, 203)
}else if (colorCounter == 8){
  fill(172, 147, 110);
  this.red = map(fungi.length, 0, fungAmount, 172, 30)
  this.green = map(fungi.length, 0, fungAmount, 147, 30)
  this.blue = map(fungi.length, 0, fungAmount, 110, 30)
}else if (colorCounter == 9){
  fill(30, 30, 30);  
  this.red = map(fungi.length, 0, fungAmount, 30, 172)
  this.green = map(fungi.length, 0, fungAmount, 30, 147)
  this.blue = map(fungi.length, 0, fungAmount, 30, 110)
}

    
  }
  
//   function to advance the fungi 
  update(){
//     increase the age of the spore
    this.initSporeAge +=1
    
//     tracking how big the spore has become, and if the growth needs to be stopped
//     change values for a growth that doesn't stem from the center
    // this.distFromMiddle = dist(width/2, height/2, this.x, this.y)
    
//     make the branch 'undulate' for a natural effect
    this.angle += random(-this.angleChange, this.angleChange)
    
//     calculate using vectors and trig where the next point will be assuming that the radius is the speed and a random angle 
    this.prevX = this.x
    this.prevY = this.y
    this.x += cos(this.angle) * this.speed
    this.y += sin(this.angle) * this.speed
    
//     choose whether this new branch goes left or right, and creating the sister branch
    if(random(100) < this.splitChance){
      let f = new Fungus(this.x, this.y, this.angle + this.angleSplit)
      // add this version to the array in my main JS file
      fungi.push(f)
      // i don't know either tbh add more randomness ???
      this.angle -= this.angleSplit
    }
  }
  
 // draw the fungi to the screen
  display(){
    push();
    // add some transparency or its gonna go feral
    strokeWeight(lineWidVar)
    stroke(this.red, this.green, this.blue, lineAlpha)
    line(this.prevX, this.prevY, this.x, this.y)
    pop();
  }
}