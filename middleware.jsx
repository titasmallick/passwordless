import { NextResponse } from "next/server";

export async function middleware(request) {
  try {
    const password = process.env.ENCRYPT_PASS;
    const salt = process.env.NEXT_PUBLIC_SALT;
    const searchParams = new URLSearchParams(new URL(request.url).search);

    const urlUser = searchParams.get("u");
    const getPass = searchParams.get("p");
    // console.log("URL parameters 'u' and 'p':", urlUser, getPass);

    

    const staticDataResponse = await fetch(`http://localhost:3000/decrypter`, {
      method: "POST", // Specify POST method
      headers: {
        "Content-Type": "application/json", // Specify content type as JSON
      },
      body: JSON.stringify({
        encryptedData: getPass,
      }),
    });

    const responseData = await staticDataResponse.json(); // Wait for the JSON response
    // console.log(responseData, "-----------------O"); // Output the JSON response

    const encodedUrlPass = responseData.decryptedData;

    // console.log("Received request:", request);

    const expiryDuration = 5; // Expiry time in minutes
    let passNow = false;

    // Check if the query parameters are undefined
    if (!urlUser || !encodedUrlPass) {
      // console.log("URL parameters 'u' or 'p' are undefined.");
      passNow = false;
    } else {
      // Decoding from base64
      const decodedUrlPass = atob(encodedUrlPass);
      // console.log("Decoded 'p' parameter:", decodedUrlPass);

      // Splitting the decoded string to extract the hash and the timestamp
      const [preHashedPass, hashTimestamp] = decodedUrlPass.split(".");
      // console.log("Hash and timestamp:", preHashedPass, hashTimestamp);

      const userName = urlUser;
      // Converting the saved timestamp back to seconds for comparison
      const savedTimestamp = parseInt(hashTimestamp);
      const currentTimestamp = Math.floor(Date.now() / 1000); // Current timestamp in seconds

      // console.log("User name:", userName);
      // console.log("Saved timestamp:", savedTimestamp);
      // console.log("Current timestamp:", currentTimestamp);

      // Convert the salt to ArrayBuffer
      const saltBuffer = new TextEncoder().encode(salt);

      // Concatenate the userName, salt, and hashTimestamp
      const concatenatedData = new TextEncoder().encode(
        userName + salt + hashTimestamp
      );
      // console.log("Concatenated data:", concatenatedData);

      // Create a hash of the concatenated data using SHA-256 algorithm
      const hashBuffer = await crypto.subtle.digest(
        "SHA-256",
        concatenatedData
      );

      // Convert the hashBuffer to hex string
      const hashedUserName = Array.from(new Uint8Array(hashBuffer))
        .map((b) => b.toString(16).padStart(2, "0"))
        .join("");
      // console.log("Hashed user name:", hashedUserName);

      // Checking if the hash matches and if the current timestamp is within the 5-minute window from the saved timestamp
      if (
        `${hashedUserName}.${hashTimestamp}` === decodedUrlPass &&
        currentTimestamp - savedTimestamp <= expiryDuration * 60
      ) {
        console.log("HASH MATCHED AND WITHIN TIME LIMIT");
        passNow = true;
      } else {
        console.log("HASH EXPIRED OR INVALID");
        passNow = false;
      }
    }

    if (passNow) {
      // return NextResponse.next();
      const response = NextResponse.next();
      response.cookies.set('userIsLoggedin', true, {
        path: '/', // Specify the path for the cookie
        maxAge: 600, // Max age in seconds (10 minutes)
      });
      return response;
    } else {
      // return NextResponse.redirect(new URL("/", request.url));
      const response = NextResponse.redirect(new URL("/", request.url));
      response.cookies.set('userIsLoggedin', false, {
        path: '/', // Specify the path for the cookie
        maxAge: 600, // Max age in seconds (10 minutes)
      });
      return response;
    }
  } catch (error) {
    console.error("Error occurred:", error);
    // return NextResponse.redirect(new URL("/", request.url));
    const response = NextResponse.redirect(new URL("/", request.url));
    response.cookies.set('userIsLoggedin', false, {
      path: '/', // Specify the path for the cookie
      maxAge: 600, // Max age in seconds (10 minutes)
    });
    return response;
  }
}
// See "Matching Paths" below to learn more
export const config = {
  matcher: "/protected/:path*",
};
