import robot from "robotjs";
import { Random, MersenneTwister19937 } from "random-js";

const REACTION_TIME_MS = 200;
const SCAN_SCREEN_MS = 50; // scan screen every x ms
const PIXEL_CHANGE_THRESHOLD = 7;

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

const calcAvgColor = (buffer) => {
  let tempSum = 0;
  for (let i=0; i<buffer.length; i++) {
    tempSum += buffer[i];
  }
  return tempSum / buffer.length;
};

let shootCount = 0;
let earlierBuffer = capture();
while (true) {
  const newBuffer = capture();
  const difference = Math.abs(calcAvgColor(newBuffer) -
    calcAvgColor(earlierBuffer));
  if (difference > PIXEL_CHANGE_THRESHOLD) {
    // "reaction time" delay with randomness
    const delay = REACTION_TIME_MS + random.integer(-20, 30);
    await new Promise(resolve => setTimeout(resolve, delay));
    console.log("shoot", shootCount++);
    await click();
  }
  earlierBuffer = newBuffer;
  await new Promise(resolve => setTimeout(resolve, SCAN_SCREEN_MS));
}
