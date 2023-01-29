import axios from "axios";
import crypto from "crypto";

const randomRangeInt = (start: number, end: number) => {
  return Math.round(Math.random() * (end - start) + start);
};

const accesskeyIdValue = "CAAHlEYq0USkJAHHnQguV3zr";
const secretValue = "xF7KZwXrcdV9cRu0ydkJz304EIcDQk";

// const params = {room_id: 22543273}
export default function requestDanmuku(params: any = {}) {
  const contentMd5Value = crypto
    .createHash("md5")
    .update(JSON.stringify(params))
    .digest("hex");
  const signatureNonceValue = randomRangeInt(1, 100000) + Date.now();
  const timestamp = Date.now();

  const headers: any = {
    Accept: "application/json",
    "Content-Type": "application/json",
    //   body md5 hash
    "x-bili-content-md5": contentMd5Value,
    //   timestamp, and hasn't over 10 minutes
    "x-bili-timestamp": timestamp,
    //   digital signature method
    "x-bili-signature-method": "HMAC-SHA256",
    //   signature session id，suggest use different signature for every request
    "x-bili-signature-nonce": signatureNonceValue,
    "x-bili-accesskeyid": accesskeyIdValue,
    "x-bili-signature-version": "1.0",
    //   request signature, must compute
    // Authorization,
  };

  //   request signature, must compute
  // Authorization,
  headers.Authorization = crypto
    .createHmac("sha256", secretValue)
    .update(JSON.stringify(headers))
    .digest("hex");

  //   axios.post("https://live-open.biliapi.com", params, {
  //     headers,
  //   });
  console.log(headers);
}
