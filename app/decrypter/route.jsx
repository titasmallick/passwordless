import crypto from "crypto";

export async function POST(request) {
  // Function to derive a key from a password using PBKDF2
  function deriveKey(password, salt) {
    return crypto.pbkdf2Sync(password, salt, 100000, 32, "sha256");
  }
  // Function to generate an IV based on current time
  function generateIV() {
    const timestamp = Math.floor(Date.now() / (5 * 60 * 1000)); // Get current timestamp in 5-minute intervals
    const iv = Buffer.alloc(16); // Create a buffer for IV
    iv.writeUInt32BE(timestamp, 0); // Write the timestamp as a 32-bit big-endian integer to the buffer
    return iv;
  }

  const password = process.env.ENCRYPT_PASS; // password
  const salt = process.env.NEXT_PUBLIC_SALT; // Salt
  // Derive a key from the password and salt
  const key = deriveKey(password, salt);
  // Generate a random initialization vector (IV)
  const iv = generateIV();

  // Function to decrypt a string with a key and IV
  async function decrypt(encryptedText) {
    const decipher = crypto.createDecipheriv("aes-256-cbc", key, iv);
    let decrypted = decipher.update(encryptedText, "hex", "utf8");
    decrypted += decipher.final("utf8");
    console.log("Decrypted:", decrypted);
    return decrypted;
  }

  try {
    const requestData = await request.json(); // Extract JSON data from the request body
    console.log(requestData.encryptedData.length, "HEREEEEE");
    // const decryptedData = await decrypt(requestData.encryptedData);

    if (requestData.encryptedData && requestData.encryptedData.length === 224) {
      const decryptedData = await decrypt(requestData.encryptedData);
      // Proceed with further processing using decryptedData
      const responseData = { decryptedData: decryptedData };

      // Return a response with status 200 and JSON data
      return new Response(JSON.stringify(responseData), {
        headers: { "Content-Type": "application/json" },
        status: 200,
      });
      // ...
    } else {
      // Handle the case where requestData.encryptedData is missing or has incorrect length
      console.error("Invalid requestData.encryptedData");
      // Return an error response or perform other actions as needed
      const responseData = { decryptedData: "NOTdecryptedData" };

      // Return a response with status 200 and JSON data
      return new Response(JSON.stringify(responseData), {
        headers: { "Content-Type": "application/json" },
        status: 200,
      });
    }

    // console.log('DECRYPTED DATA-----', decryptedData);
    // Your logic for processing the request data goes here

    // Example response data
    // const responseData = { decryptedData: decryptedData };

    // // Return a response with status 200 and JSON data
    // return new Response(JSON.stringify(responseData), {
    //   headers: { "Content-Type": "application/json" },
    //   status: 200,
    // });
  } catch (error) {
    // Handle any errors that occur during processing
    console.error("Error processing request:", error);

    // Return an error response with status 500
    const responseData = { decryptedData: "NOTdecryptedData" };

    // Return a response with status 200 and JSON data
    return new Response(JSON.stringify(responseData), {
      headers: { "Content-Type": "application/json" },
      status: 200,
    });
  }
}
