import robot from "robotjs";
import { Random, MersenneTwister19937 } from "random-js";

const engine = MersenneTwister19937.autoSeed();
const random = new Random(engine);

const screenSize = robot.getScreenSize();
const screenWidth = screenSize.width;
const screenHeight = screenSize.height;
const [posX, posY] = [screenWidth/2 - 5, screenHeight/2 - 5]

const click = async () => {
  // delay between mouse down and up. (holding down)
  const delayMs = 20 + random.integer(4, 48);
  robot.mouseToggle('down');
  await new Promise(resolve => setTimeout(resolve, delayMs));
  robot.mouseToggle('up');
};

/**
 * @returns buffer of captured rectangle/image
 */
const capture = () => {
  const img = robot.screen.capture(posX, posY, 10, 10);
  return img.image;
};

const calculateAvgColor = (buffer) => {
  let tempSum = 0;
  for (let i=0; i<buffer.length; i++) {
    tempSum += buffer[i];
  }
  return tempSum / buffer.length;
};

let earlierBuffer = capture();
while (true) {
  const newBuffer = capture();

  if (calculateAvgColor(newBuffer) !==
    calculateAvgColor(earlierBuffer)) {
      console.log("eroavaisuus");
    }

  earlierBuffer = newBuffer;
  await new Promise(resolve => setTimeout(resolve, 100));
}




//await click();
