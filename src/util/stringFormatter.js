export const limitString = (inputString, maxLength) => {
  if (inputString.length > maxLength) {
    let trimmedString = inputString.substring(0, maxLength);

    while (/\s$/.test(trimmedString)) {
      trimmedString = trimmedString.substring(0, trimmedString.length - 1);
    }

    trimmedString += "...";

    return trimmedString;
  } else {
    return inputString;
  }
};

export function formatPhoneNumber(input) {
  if (/^\+639\d{9}$/.test(input) && input.length === 13) {
    return input;
  }

  if (/^09\d{9}$/.test(input) && input.length === 11) {
    return "+63" + input.slice(1);
  }

  return null;
}
