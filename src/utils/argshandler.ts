export function argsHandler(
  flag: string,
  cb: (value: string | undefined) => void,
) {
  const args = process.argv.slice(2).filter(Boolean);
  if (args.includes(flag)) {
    const flagValue = args[args.indexOf(flag) + 1];
    cb(flagValue);
    return;
  }
  // return false;
}

export function argChecker(flag: string) {
  const args = process.argv.slice(2).filter(Boolean);
  if (args.includes(flag)) {
    return true;
  }
  return false;
}

// for node utils/argshandler p=1000 ip=10.25.23.36 like this usage
// function argsObjConverter() {
//   const args = process.argv.slice(2);
//   const argsObj: Record<string, string | undefined> = {};
//   args.forEach((arg) => {
//     const [key, value] = arg.split("=");
//     argsObj[key] = value;
//   });
//   return argsObj;
// }
