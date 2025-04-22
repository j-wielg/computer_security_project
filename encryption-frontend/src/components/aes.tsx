import { Input, TextArea } from "@/components/ui/input";
import { Label } from "@radix-ui/react-label";
import { Button } from "@/components/ui/button";

import { useState } from "react";
import { aesEncrypt, aesDecrypt, printBlock } from "@/utils/aes";



export function AES() {
  const [aesKey, setAesKey] = useState("");
  const [aesKeyInputStatus, setAesKeyInputStatus] = useState("");
  const [aesKeyWarning, setAesKeyWarning] = useState(false);
  const [aesKeySize, setAesKeySize] = useState(128);
  const [blockMode, setBlockMode] = useState(0);
  const [aesData, setAesData] = useState("");
  const [aesDataType, setAesDataType] = useState("ascii");
  const [dataStatus, setDataStatus] = useState("");
  const [aesResult, setAesResult] = useState([] as Array<string>);
  const [initVector, setInitVector] = useState("");

  const handleAesKeyEnter = (value: string) => {
    setAesKey(value);
    if (value.length == 0) {
      setAesKeyInputStatus("");
      setAesKeyWarning(false);
      return;
    }
    let len = 0;
    if (value.startsWith("0x")) {
      let valid = "0123456789abcdefABCDEF _-\n"
      for (let c of value.slice(2)) {
        if (!valid.includes(c)) {
          setAesKeyInputStatus("Character '" + c + "' is invalid for hexadecimal input");
          return;
        } else if (c != ' ' && c != '_' && c != '-' && c != '\n') {
          ++len;
        }
      }
    } else if (value.startsWith("0b")) {
      let valid = "01 _-\n"
      for (let c of value.slice(2)) {
        if (!valid.includes(c)) {
          setAesKeyInputStatus("Character '" + c + "' is invalid for binary input");
          return;
        } else if (c != ' ' && c != '_' && c != '-' && c != '\n') {
          ++len;
        }     
      }
    } else {
      setAesKeyInputStatus("Key must start with 0b (for binary) or 0x (for hexadecimal)");
      return;
    }
    if (value.startsWith("0x")) {
      if (len < aesKeySize / 4) {
        setAesKeyWarning(true);
        setAesKeyInputStatus("");
      } else if (len == aesKeySize / 4) {
        setAesKeyWarning(false);
        setAesKeyInputStatus("");
      } else {
        setAesKeyWarning(false);
        setAesKeyInputStatus("Key cannot exceed " + aesKeySize.toString() + " bits");
      }
    } else if (value.startsWith("0b")) {
      if (len < aesKeySize) {
        setAesKeyWarning(true);
        setAesKeyInputStatus("");
      } else if (len == aesKeySize) {
        setAesKeyWarning(false);
        setAesKeyInputStatus("");
      } else {
        setAesKeyWarning(false);
        setAesKeyInputStatus("Key cannot exceed " + aesKeySize.toString() + " bits");
      }

    } else {
      setAesKeyWarning(false);
      setAesKeyInputStatus("");
    }
  }

  const handleAesDataEnter = (value: string) => {
    setAesData(value);
    setDataStatus("");
    let valid_bin = "01 -_\n";
    let valid_hex = "0123456789abcdefABCDEF -_\n";
    if (aesDataType == 'ascii') {
      for (let c of value) {
        if (c.charCodeAt(0) > 255) {
          setDataStatus("Character '" + c + "' cannot be encoded as an ASCII character");
        }
      }
    } else if (aesDataType == 'binary') {
      if (aesData.startsWith("0x")) {
        for (let c of value.slice(2)) {
          if (!valid_hex.includes(c)) {
            setDataStatus("Character '" + c + "' is not a valid hexadecimal character");
          }
        }
      } else if (aesData.startsWith("0b")) {
        for (let c of value.slice(2)) {
          if (!valid_bin.includes(c)) {
            setDataStatus("Character '" + c + "' is not a valid binary character");
          }
        }
      } else {
        for (let c of value) {
          if (!valid_hex.includes(c)) {
            setDataStatus("Character '" + c + "' is not a valid hexadecimal character");
          }
        }
      }
    }
  }

  const handleAesEncrypt = () => {
    // Step 1: Turn the key string into a bigint
    let whitespace = " _-\n";
    let bin = false;
    if (aesKey.startsWith("0x")) {
      bin = false;
    } else {
      bin = true;
    }
    let key: bigint = BigInt(0);
    for (let i=2; i < aesKey.length; ++i) {
      for (; i < aesKey.length && whitespace.includes(aesKey[i]); ++i) {}
      if (i >= aesKey.length) {break;}
      if (bin) {
        key <<= BigInt(1);
        if (aesKey[i] == '1') key |= BigInt(1);
      } else {
        key <<= BigInt(4);
        key |= BigInt(Number("0x" + aesKey[i]));
      }
    }
    // Step 2: Turn the data string into an array of bytes
    let data: number[] = [];
    if (aesDataType == 'ascii') {
      data = aesData.split("").map((x) => x.charCodeAt(0));
    } else {
      if (aesData.startsWith("0b")) {
        for (let i=2; i < aesData.length; i += 8) {
          data.push(Number("0b" + aesData.slice(i, i+8)));
        }
      } else {
        for (let i=2; i < aesData.length; i += 2) {
          data.push(Number("0x" + aesData.slice(i, i+2)));
        }
      }
    }
    // Step 3: Do the encryption
    aesEncrypt(data, blockMode, aesKeySize, key);
    // Step 4: Print the encrypted blocks
    let res: string[] = [];
    for (let i=0; i < (data.length / 16); ++i) {
      res.push(printBlock(data.slice(i*16, (i+1)*16)));
    }
    setAesResult(res);
  }

  const handleAesDecrypt = () => {
    // Step 1: Turn the key string into a bigint
    let whitespace = " _-\n";
    let bin = false;
    if (aesKey.startsWith("0x")) {
      bin = false;
    } else {
      bin = true;
    }
    let key: bigint = BigInt(0);
    for (let i=2; i < aesKey.length; ++i) {
      for (; i < aesKey.length && whitespace.includes(aesKey[i]); ++i) {}
      if (i >= aesKey.length) {break;}
      if (bin) {
        key <<= BigInt(1);
        if (aesKey[i] == '1') key |= BigInt(1);
      } else {
        key <<= BigInt(4);
        key |= BigInt(Number("0x" + aesKey[i]));
      }
    }
    // Step 2: Turn the data string into an array of bytes
    let data: number[] = [];
    if (aesData.startsWith("0b")) {
      for (let i=2; i < aesData.length; i += 8) {
        data.push(Number("0b" + aesData.slice(i, i+8)));
      }
    } else {
      for (let i=2; i < aesData.length; i += 2) {
        data.push(Number("0x" + aesData.slice(i, i+2)));
      }
    }
    // Step 3: Decrypt

  }

  return (
    <div className="space-y-4">
      <div className="space-y-2">
        <Label htmlFor="aes-type" className="block">AES Key Size</Label>
        <select 
          className="bg-muted px-2 py-2 outline"
          onChange={(e) => setAesKeySize(Number(e.target.value))}
        >
          <option value="128">AES-128</option>
          <option value="192">AES-192</option>
          <option value="256">AES-256</option>
        </select>
      </div>
      <div className="space-y-2">
        <Label htmlFor="aes-mode" className="block">AES Block Mode</Label>
        <select 
          className="bg-muted px-2 py-2 outline"
          onChange={(e) => setBlockMode(Number(e.target.value))}
        >
          <option value="0">Electronic Codebook</option>
          <option value="1">Cipherblock Chaining</option>
          <option value="2">Counter</option>
        </select>
      </div>
      <div className="space-y-2">
        <Label htmlFor="aes-datatype" className="block">Data Type</Label>
        <select 
          className="bg-muted px-2 py-2 outline"
          onChange={(e) => setAesDataType(e.target.value)}
        >
          <option value="ascii">ASCII Text</option>
          <option value="binary">Binary</option>
        </select>
      </div>
      <div className="space-y-2">
        <Label htmlFor="aes-key">AES Key</Label>
        <TextArea
          id="aes-key"
          value={aesKey}
          onChange={(e) => handleAesKeyEnter(e.target.value)}
          placeholder="Preface binary with 0b and hex with 0x"
          className={(aesKey.length > 0) ? "font-mono" : ""}
        />
        {aesKeyInputStatus.length > 0 && (
          <div>
            <p className="text-red-700 text-sm">{aesKeyInputStatus}</p>
          </div>
        )}
        {aesKeyWarning && !aesKeyInputStatus && (
          <div>
            <p className="text-yellow-700 text-sm">Keys under {aesKeySize} bits will be left-padded with zeros</p>
          </div>
        )}
      </div>
      <div className="space-y-2">
        <Label htmlFor="aes-data">Data</Label>
        <TextArea
          id="aes-data"
          value={aesData}
          onChange={(e) => handleAesDataEnter(e.target.value)}
          className={(aesDataType == "binary" && aesData.length > 0) ? "font-mono" : ""}
          placeholder={
            (aesDataType == "binary") ?
              "Enter hex (0x) or binary (0b) data" :
              "Enter text to encrypt here"
          }
        />
        {dataStatus && (
          <p className="text-red-700 text-sm">{dataStatus}</p>
        )}
      </div>
      {(blockMode > 0) && (
        <div className="space-y-2">
          <Label htmlFor="aes-iv">{(blockMode == 1) ? 
            "Initialization Vector (16 Bytes)" : "Nonce (12 Bytes)"
          }</Label>
          <Input
            id="aes-iv"
            value={initVector}
            onChange={(e) => setInitVector(e.target.value)}
            placeholder="Preface binary with 0b and hex with 0x"
            className={(initVector) ? "font-mono" : ""}
          />
        </div>
      )}
      <div className="flex gap-2">
        { (aesKeyInputStatus.length == 0) &&
          <Button onClick={handleAesEncrypt}>Encrypt</Button>
        }
        { (aesDataType != "ascii") &&
          (aesKeyInputStatus.length == 0) &&
          <Button variant="outline" onClick={handleAesDecrypt}>
            Decrypt
          </Button>
        }
      </div>
      {aesResult.length > 0 && (
        <div className="mt-4 p-4 bg-muted rounded-md">
          <p className="text-lg font-semibold underline">Result:</p>
          {aesResult.map((line, index) : any => {
            return <p className="font-mono" key={index}>{line}</p>;
          })}
        </div>
      )}
    </div>
  );
}
