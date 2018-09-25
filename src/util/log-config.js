import gradient from 'gradient-string';
import chalk from 'chalk';

export const logError = gradient.fruit;
export const logSuccess = gradient.pastel;
export const logWarning = chalk.yellow.italic;
export const logProcessing = chalk.blue.italic;
export const logIntro = chalk.bgMagenta.bold;
