export const limitString = (str, maxLength) => {
  if (str.length <= maxLength || window.outerWidth <= 750) {
    return str;
  } else {
    return str.slice(0, maxLength) + "...";
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
