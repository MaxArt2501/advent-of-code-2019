const start = 123257;
const end = 647015;

function isMonotone(pwd) {
  return pwd.split('').every((digit, index) => index === 0 || digit >= pwd[index - 1]);
}

function isCandidate(pwd) {
  return /(\d)\1/.test(pwd) && isMonotone(pwd);
}

let validCount = 0;
for (let pwd = start; pwd <= end; pwd++) {
  validCount += isCandidate(String(pwd));
}

console.log(validCount);
