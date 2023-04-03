const { ValidationError } = require("./exceptions");

exports.isValidAddress = (address) => {
  if (!address) {
    throw new ValidationError("Provided address is not valid");
  }
  if (!/^(0x)?[0-9a-fA-F]{40}$/i.test(address)) {
    // Check if it has the basic requirements of an address
    throw new ValidationError("Provided address is not valid");
  } else if (
    /^(0x)?[0-9a-fA-F]{40}$/.test(address) ||
    /^(0x)?[0-9A-Fa-f]{40}$/.test(address)
  ) {
    // If it's all small caps or all all caps, return true
    return;
  } else {
    // Otherwise check each case
    isChecksumAddress(address);
  }
};

const isChecksumAddress = (address) => {
  // Check each case
  address = address.replace("0x", "");
  const addressHash = sha3(address.toLowerCase());
  for (let i = 0; i < 40; i++) {
    // The nth letter should be uppercase if the nth digit of casemap is 1
    if (
      (parseInt(addressHash[i], 16) > 7 &&
        address[i].toUpperCase() !== address[i]) ||
      (parseInt(addressHash[i], 16) <= 7 &&
        address[i].toLowerCase() !== address[i])
    ) {
      throw new ValidationError("Provided address is not valid");
    }
  }
};

const sortValues = ["recipient", "sender"];

// For testing purposes basic validation is here
exports.isValidPage = (page) => {
  if (isNaN(Number(page))) {
    throw new ValidationError("Page parameter should be number");
  }
};
exports.isValidSort = (sort) => {
  if (!sortValues.includes(sort)) {
    throw new ValidationError(
      `Sort could include only next values: ${sortValues}`
    );
  }
};
