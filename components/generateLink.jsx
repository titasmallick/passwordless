"use client";
import {
  Input,
  Button,
  Snippet,
  Card,
  CardHeader,
  CardBody,
  CardFooter,
  Divider,
} from "@nextui-org/react";
import { useState, useEffect, useRef } from "react";
import crypto from "crypto";
import { useSearchParams } from "next/navigation";
import { encrypt, decrypt } from "@/components/encrypt";

const GenerateLink = () => {
  const [presigned, setPresigned] = useState(false);
  const searchParams = useSearchParams();

  useEffect(() => {
    const expiryDuration = 5; // Expiry time in minutes
    const salt = process.env.NEXT_PUBLIC_SALT;
    const urlUser = searchParams.get("u");
    const encodedUrlPass = searchParams.get("p");
    
    // Check if the query parameters are undefined
    if (!urlUser || !encodedUrlPass) {
      console.log("URL parameters 'u' or 'p' are undefined.");
      return; // Exit early if parameters are not defined
    }
    decrypt(encodedUrlPass).then((res) => {
      // Decoding from base64
      const decodedUrlPass = Buffer.from(res, "base64").toString(
        "ascii"
      );
      // Splitting the decoded string to extract the hash and the timestamp
      const [preHashedPass, hashTimestamp] = decodedUrlPass.split(".");
      const userName = urlUser;
      // Converting the saved timestamp back to seconds for comparison
      const savedTimestamp = parseInt(hashTimestamp);
      const currentTimestamp = Math.floor(Date.now() / 1000); // Current timestamp in seconds

      const hash = crypto.createHash("sha256");
      hash.update(userName + salt + hashTimestamp);
      const hashedUserName = hash.digest("hex");

      // Checking if the hash matches and if the current timestamp is within the 5-minute window from the saved timestamp
      if (
        `${hashedUserName}.${hashTimestamp}` === decodedUrlPass &&
        currentTimestamp - savedTimestamp <= expiryDuration * 60
      ) {
        console.log("HASH MATCHED AND WITHIN TIME LIMIT");
        setPresigned(true);
      } else {
        console.log("HASH EXPIRED OR INVALID");
        setPresigned(false);
      }
    });

  }, []);

  const [formData, setFormData] = useState({});
  const [hashedLink, setHashedLink] = useState("");
  const handleInputChange = (e) => {
    const { name, value } = e.target;
    setFormData({ ...formData, [name]: value.replace(/\s+/g, "") });
    setHashedLink("");
  };
  const handleSubmit = async (e) => {
    e.preventDefault();
    setHashedLink("");
    if (formData.username) {
      const expiryDuration = 5; // Expiry time in minutes
      const salt = process.env.NEXT_PUBLIC_SALT;
      const timestamp = Math.floor(Date.now() / 1000); // Current timestamp in seconds
      const userName = formData.username;
      const hash = crypto.createHash("sha256");
      // Adding the timestamp for expiry verification later
      hash.update(userName + salt + timestamp);
      const hashedUserName = hash.digest("hex");
      // Creating a string that includes the hash, a separator, and the timestamp
      const hashWithTimestamp = `${hashedUserName}.${timestamp}`;
      // Encoding the combined string as base64 for URL usage
      const encodedHash = Buffer.from(hashWithTimestamp).toString("base64");
      const serverEncrypted = await encrypt(encodedHash);
      setHashedLink(serverEncrypted);
      decrypt(serverEncrypted);
    }
  };

  return (
    <section className="w-full p-5">
      <Card className="my-1 mx-auto md:mt-0 md:flex-nowrap md:justify-center md:items-center w-full md:w-[400px] p-8">
        <CardHeader>
          <p className="text-2xl font-bold dark:text-white">
            Generate a pre-signed link:
          </p>
        </CardHeader>
        <Divider />
        <CardBody>
          <form className="flex flex-col w-full" onSubmit={handleSubmit}>
            <Input
              label="Enter UserName"
              className="mt-5 mb-2.5"
              name="username"
              isRequired
              onChange={handleInputChange} // You need to define handleInputChange function
            />
            <Button type="submit" color="primary" className="mt-.5">
              Generate new link
            </Button>
          </form>
        </CardBody>
        <Divider />
        <CardFooter>
          {hashedLink && (
            <Snippet className="w-full" symbol="">
              <span className="my-2 italic overflow-hidden whitespace-pre-line break-all">{`http://localhost:3000/protected?u=${formData.username}&p=${hashedLink}`}</span>
            </Snippet>
          )}
          {!hashedLink && (
            <p className="text-sm italic text-gray-500">
              Your link will be generated here.
            </p>
          )}
        </CardFooter>
      </Card>

      {!presigned ? (
        <p className="text-sm italic text-gray-500 w-full text-center">
          This user is NOT using a pre-signed link
        </p>
      ) : (
        <p className="text-sm italic text-gray-500 w-full text-center">
          This user is using a pre-signed link
        </p>
      )}
    </section>
  );
};

export default GenerateLink;
