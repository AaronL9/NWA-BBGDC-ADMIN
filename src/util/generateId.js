export function generateID() {
  // Get the current timestamp in milliseconds
  const timestamp = new Date().getTime();

  // Generate a random number (between 0 and 9999)
  const randomNum = Math.floor(Math.random() * 10000);

  // Concatenate timestamp and random number to create a unique ID
  const id = `${timestamp}${randomNum}`;

  return id;
}
