/**
 * Function that gets user-friendly text versions of documentTypes
 *
 * @memberof utils
 * @function getTypeText
 * @param {string} type - Type to be converted
 * @returns {string} Returns the converted type text
 */

const getTypeText = (type) => {
  switch (type) {
    case 'driversLicense':
      return "Driver's License";
    case 'passport':
      return 'Passport';
    case 'bankStatement':
      return 'Bank Statement';
    default:
      return 'Other';
  }
};

export default getTypeText;
