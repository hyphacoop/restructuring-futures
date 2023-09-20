/**
 * Validates an Earthstar path according to the provided specification.
 * @param {string} path - The path to validate.
 * @returns {object} - Contains 'isValid' indicating the validity and 'errorMessage' for any error.
 */
export default function isValidPath(path) {
  let errorMessage = "";

  // Check length constraint
  if (path.length < 2 || path.length > 512) {
    errorMessage = "Path length must be between 2 and 512 characters.";
    return { isValid: false, errorMessage };
  }

  // Check for spaces
  if (path.includes(" ")) {
    errorMessage = "Spaces are not allowed in paths.";
    return { isValid: false, errorMessage };
  }

  // Check for a leading /
  if (!path.startsWith("/")) {
    errorMessage = "Path must start with a '/'.";
    return { isValid: false, errorMessage };
  }

  // Check for ending /
  if (path.endsWith("/")) {
    errorMessage = "Path can not end with a '/'.";
    return { isValid: false, errorMessage };
  }

  // Check for beginning with /@
  if (path.startsWith("/@")) {
    errorMessage = "Path can not begin with a '/@'.";
    return { isValid: false, errorMessage };
  }

  // Check for double slashes
  if (path.includes("//")) {
    errorMessage = "Double slashes are not allowed in paths.";
    return { isValid: false, errorMessage };
  }

  // Define allowed characters
  const PATH_PUNCTUATION = "/'()-._~!$&+,:=@%";
  const PATH_CHARACTER =
    "abcdefghijklmnopqrstuvwxyzABCDEFGHIJKLMNOPQRSTUVWXYZ0123456789" +
    PATH_PUNCTUATION;

  // Iterate over each character in the path to ensure it's part of the allowed set
  for (let char of path) {
    if (!PATH_CHARACTER.includes(char)) {
      errorMessage = `Character '${char}' is not allowed in the path.`;
      return { isValid: false, errorMessage };
    }
  }

  // Check each segment of the path
  const segments = path.split("/");
  for (let segment of segments) {
    if (segment.length === 0) {
      errorMessage = "Segment cannot be empty.";
      return { isValid: false, errorMessage };
    }
  }

  return { isValid: true, errorMessage: "" };
}
