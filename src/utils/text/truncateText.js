/**
 * Function that truncates the provided text within the set limit.
 *
 * @memberof utils
 * @function truncateText
 * @param {string} text - Text to be truncated
 * @param {number} cutoff - Where to cut the text off
 * @returns {string} Returns the truncated text
 */
const truncateText = (text, cutoff = 25) => {
  if (text.length > cutoff) {
    return `${text.substring(0, cutoff)}...`;
  }
  return text;
};

export default truncateText;
