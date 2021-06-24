import CryptoJS from 'react-native-crypto-js';

/**
 * Method to encrypt the data
 * @param {*} data
 */
const encrypt = data => {
  return CryptoJS.AES.encrypt(JSON.stringify(data), 'KHVpFv9Uok').toString();
};

/**
 * Method to decrypt the data
 * @param {*} data
 */
const decrypt = data => {
  let bytes = CryptoJS.AES.decrypt(data, 'KHVpFv9Uok');
  return JSON.parse(bytes.toString(CryptoJS.enc.Utf8));
};

export const crypto = {
  encrypt,
  decrypt,
};
