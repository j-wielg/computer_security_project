import { Input, TextArea } from "@/components/ui/input";
import { Label } from "@radix-ui/react-label";
import { Button } from "@/components/ui/button";

import { useEffect, useState } from "react";
import { tdesEncrypt, tdesDecrypt } from "@/utils/3des";
import { printBlock } from "@/utils/aes";

export function DES() {
  const desKeySize = 64;
  const [desKeys, setDesKeys] = useState(["", "", ""]);
  const [desKeyInputStatuses, setDesKeyInputStatuses] = useState(["", "", ""]);
  const [desKeyWarnings, setDesKeyWarnings] = useState([false, false, false]);
  const [blockMode, setBlockMode] = useState(0);
  const [desData, setDesData] = useState("");
  const [desDataType, setDesDataType] = useState("ascii");
  const [dataStatus, setDataStatus] = useState("");
  const [desResult, setDesResult] = useState([] as Array<string>);
  const [initVector, setInitVector] = useState("");
  const [initVectorStatus, setInitVectorStatus] = useState("");
  const [resultType, setResultType] = useState("binary");
  const [desError, setDesError] = useState("");
  const [uploadedFile, setUploadedFile] = useState<File | null>(null);
  const [processedData, setProcessedData] = useState<Uint8Array | null>(null);

  useEffect(() => {
    handleDesDataEnter(desData);
  }, [desDataType]);

  useEffect(() => {
    handleDesIVEnter(initVector);
  }, [blockMode]);

  const handleDesKeyEnter = (value: string, index: number) => {
    let keys: string[] = [];
    let statuses: string[] = [];
    let warnings: boolean[] = [];
    for (let i=0; i < 3; ++i) {
      keys[i] = desKeys[i];
      statuses[i] = desKeyInputStatuses[i];
      warnings[i] = desKeyWarnings[i];
    }
    keys[index-1] = value;
    setDesKeys(keys);
    let key = keys[index];
    if (value.length == 0) {
      statuses[index - 1] = "";
      warnings[index - 1] = false;
      setDesKeyInputStatuses(statuses);
      setDesKeyWarnings(warnings);
      return;
    }
    let len = 0;
    if (value.startsWith("0x")) {
      let valid = "0123456789abcdefABCDEF _-\n";
      for (let c of value.slice(2)) {
        if (!valid.includes(c)) {
          statuses[index - 1] = "Character '" + c + "' is invalid for hexadecimal input";
          setDesKeyInputStatuses(statuses);
          return;
        } else if (c != " " && c != "_" && c != "-" && c != "\n") {
          ++len;
        }
      }
    } else if (value.startsWith("0b")) {
      let valid = "01 _-\n";
      for (let c of value.slice(2)) {
        if (!valid.includes(c)) {
          statuses[index - 1] = "Character '" + c + "' is invalid for binary input";
          setDesKeyInputStatuses(statuses);
          return;
        } else if (c != " " && c != "_" && c != "-" && c != "\n") {
          ++len;
        }
      }
    } else {
      statuses[index - 1] = "Key must start with 0b (for binary) or 0x (for hexadecimal)";
      setDesKeyInputStatuses(statuses);
      return;
    }
    if (value.startsWith("0x")) {
      if (len < desKeySize / 4) {
        warnings[index - 1] = true;
        statuses[index - 1] = "";
        setDesKeyWarnings(warnings);
        setDesKeyInputStatuses(statuses);
      } else if (len == desKeySize / 4) {
        warnings[index - 1] = false;
        statuses[index - 1] = "";
        setDesKeyWarnings(warnings);
        setDesKeyInputStatuses(statuses);
      } else {
        warnings[index - 1] = false;
        statuses[index - 1] = "Key cannot exceed " + desKeySize.toString() + " bits";
        setDesKeyWarnings(warnings);
        setDesKeyInputStatuses(statuses);
      }
    } else if (value.startsWith("0b")) {
      if (len < desKeySize) {
        warnings[index - 1] = true;
        statuses[index - 1] = "";
        setDesKeyWarnings(warnings);
        setDesKeyInputStatuses(statuses);
      } else if (len == desKeySize) {
        warnings[index - 1] = false;
        statuses[index - 1] = "";
        setDesKeyWarnings(warnings);
        setDesKeyInputStatuses(statuses);
      } else {
        warnings[index - 1] = false;
        statuses[index - 1] = "Key cannot exceed " + desKeySize.toString() + " bits";
        setDesKeyWarnings(warnings);
        setDesKeyInputStatuses(statuses);
      }
    } else {
      warnings[index - 1] = false;
      statuses[index - 1] = "";
      setDesKeyWarnings(warnings);
      setDesKeyInputStatuses(statuses);
    }
  };

  const handleDesDataEnter = (value: string) => {
    setDesData(value);
    setDataStatus("");
    let valid_bin = "01 -_\n";
    let valid_hex = "0123456789abcdefABCDEF -_\n";
    let len = 0;
    if (desDataType == "ascii") {
      for (let c of value) {
        if (c.charCodeAt(0) > 255) {
          setDataStatus(
            "Character '" + c + "' cannot be encoded as an ASCII character"
          );
        }
      }
    } else if (desDataType == "binary") {
      if (value.startsWith("0x")) {
        for (let c of value.slice(2)) {
          if (!valid_hex.includes(c)) {
            setDataStatus(
              "Character '" + c + "' is not a valid hexadecimal character"
            );
            return;
          } else if (c != " " && c != "-" && c != "_" && c != "\n") {
            ++len;
          }
        }
        if (len % 2 != 0) {
          setDataStatus("Input data must be byte-aligned");
          return;
        }
      } else if (value.startsWith("0b")) {
        for (let c of value.slice(2)) {
          if (!valid_bin.includes(c)) {
            setDataStatus(
              "Character '" + c + "' is not a valid binary character"
            );
            return;
          } else if (c != " " && c != "-" && c != "_" && c != "\n") {
            ++len;
          }
        }
        if (len % 8 != 0) {
          setDataStatus("Input data must be byte-aligned");
          return;
        }
      } else {
        for (let c of value) {
          if (!valid_hex.includes(c)) {
            setDataStatus(
              "Character '" + c + "' is not a valid hexadecimal character"
            );
            return;
          } else if (c != " " && c != "-" && c != "_" && c != "\n") {
            ++len;
          }
        }
        if (len % 2 != 0) {
          setDataStatus("Input data must be byte-aligned");
          return;
        }
      }
    }
  };

  const handleDesIVEnter = (value: string) => {
    if (blockMode == 0) {
      setInitVectorStatus("");
      return;
    }
    setInitVector(value);
    let len = 0;
    let num_bytes = blockMode == 1 ? 16 : 12;
    let valid_bin = "01";
    let valid_hex = "0123456789abcdefABCDEF";
    let target_len = 0;
    if (value.startsWith("0b")) {
      target_len = num_bytes * 8;
      for (let c of value.slice(2)) {
        if (!valid_bin.includes(c)) {
          setInitVectorStatus(
            "Character '" + c + "' is not a valid binary character"
          );
          return;
        } else {
          ++len;
        }
      }
    } else if (value.startsWith("0x")) {
      target_len = num_bytes * 2;
      for (let c of value.slice(2)) {
        if (!valid_hex.includes(c)) {
          setInitVectorStatus(
            "Character '" + c + "' is not a valid hexadecimal character"
          );
          return;
        } else {
          ++len;
        }
      }
    } else {
      target_len = num_bytes * 2;
      for (let c of value) {
        if (!valid_hex.includes(c)) {
          setInitVectorStatus(
            "Character '" + c + "' is not a valid hexadecimal character"
          );
          return;
        } else {
          ++len;
        }
      }
    }
    if (len > target_len) {
      setInitVectorStatus("Input is too long");
      return;
    } else if (len < target_len) {
      setInitVectorStatus("Input is too short");
      return;
    }
    setInitVectorStatus("");
  };

  const stringToKey = (value: string): bigint => {
    const whitespace = " _-\n";
    let bin = false;
    let desKey = value;
    if (desKey.startsWith("0x")) {
      bin = false;
    } else {
      bin = true;
    }
    let key: bigint = BigInt(0);
    for (let i = 2; i < desKey.length; ++i) {
      for (; i < desKey.length && whitespace.includes(desKey[i]); ++i) {}
      if (i >= desKey.length) {
        break;
      }
      if (bin) {
        key <<= BigInt(1);
        if (desKey[i] == "1") key |= BigInt(1);
      } else {
        key <<= BigInt(4);
        key |= BigInt(Number("0x" + desKey[i]));
      }
    }
    return key;
  }

  const getBinaryData = (): number[] => {
    const whitespace = "-_ \t\n";
    let data: number[] = [];
    let i=0;
    if (desData.startsWith("0x")) {
      i = 2;
    }
    let bytestr: string = "0x";
    for (; i < desData.length; ++i) {
      if (whitespace.includes(desData[i])) {
        continue;
      }
      bytestr += desData[i];
      if (bytestr.length == 4) {
        data.push(Number(bytestr));
        bytestr = "0x";
      }
    }
    return data;
  }

  const handleDesEncrypt = () => {
    // Step 1: Turn the key string into a bigint
    let key1 = stringToKey(desKeys[0]);
    let key2 = stringToKey(desKeys[1]);
    let key3 = stringToKey(desKeys[2]);
    // Step 2: Get the data
    let data: number[];
    if (desDataType == "ascii") {
      data = desData.split("").map((x) => x.charCodeAt(0));
    } else if (desDataType == "binary") {
      data = getBinaryData();
    } else {
      if (!processedData) {
        setDesError("No file uploaded");
        return;
      }
      data = Array.from(processedData);
    }
    // Step 3: Get the IV
    let iv = BigInt(0);
    if (initVector.startsWith("0b")) {
      for (let i = 2; i < initVector.length; i += 8) {
        iv |= (BigInt("0b" + initVector.slice(i, i + 8)));
        iv <<= BigInt(8);
      }
    } else {
      let i = 0;
      if (initVector.startsWith("0x")) {
        i += 2;
      }
      for (let i = 2; i < initVector.length; i += 2) {
        iv |= (BigInt("0x" + initVector.slice(i, i + 2)));
        iv <<= BigInt(8);
      }
    }
    // Step 4: Do the encryption
    tdesEncrypt(data, key1, key2, key3, blockMode, iv);
    // Step 5: Update processed data and result
    setProcessedData(new Uint8Array(data));
    const res: string[] = [];
    for (let i = 0; i < data.length / 16; i += 2) {
      res.push(
        printBlock(data.slice(i * 16, (i + 1) * 16)) +
          " " +
          printBlock(data.slice((i + 1) * 16, (i + 2) * 16))
      );
    }
    setDesResult(res);
    setResultType("binary");
    setDesError("");
  };

  const handleDesDecrypt = (output_type: number = 0) => {
    // Step 1: Turn the key string into a bigint
    let key1 = stringToKey(desKeys[0]);
    let key2 = stringToKey(desKeys[1]);
    let key3 = stringToKey(desKeys[2]);
    // Step 2: Get the data
    let data: number[];
    if (desDataType == "ascii") {
      data = desData.split("").map((x) => x.charCodeAt(0));
    } else if (desDataType == "binary") {
      data = getBinaryData();
    } else {
      if (!processedData) {
        setDesError("No file uploaded");
        return;
      }
      data = Array.from(processedData);
    }
    // Step 3: Get the IV
    let iv = BigInt(0);
    if (initVector.startsWith("0b")) {
      for (let i = 2; i < initVector.length; i += 8) {
        iv |= (BigInt("0b" + initVector.slice(i, i + 8)));
        iv <<= BigInt(8);
      }
    } else {
      let i = 0;
      if (initVector.startsWith("0x")) {
        i += 2;
      }
      for (let i = 2; i < initVector.length; i += 2) {
        iv |= (BigInt("0x" + initVector.slice(i, i + 2)));
        iv <<= BigInt(8);
      }
    }
    // Step 4: Decrypt
    setDesError("");
    if (!tdesDecrypt(data, key1, key2, key3, blockMode, iv)) {
      setDesError("Failed to Decrypt - Sentinel Not Found");
      setDesResult([]);
      return;
    }
    // Step 5: Update processed data and result
    setProcessedData(new Uint8Array(data));
    let res: string[] = [];
    if (output_type == 0) {
      setResultType("binary");
      for (let i = 0; i < data.length / 16; i += 2) {
        res.push(
          printBlock(data.slice(i * 16, (i + 1) * 16)) +
            " " +
            printBlock(data.slice((i + 1) * 16, (i + 2) * 16))
        );
      }
    } else if (output_type == 1) {
      setResultType("ascii");
      const s: string = data.map((x) => String.fromCharCode(x)).join("");
      res = s.split("\n");
    }
    setDesResult(res);
  };

  const handleFileUpload = (event: React.ChangeEvent<HTMLInputElement>) => {
    const file = event.target.files?.[0];
    if (file) {
      setUploadedFile(file);
      const reader = new FileReader();
      reader.onload = (e) => {
        const arrayBuffer = e.target?.result as ArrayBuffer;
        const uint8Array = new Uint8Array(arrayBuffer);
        setProcessedData(uint8Array);
        setDesData(
          "0x" +
            Array.from(uint8Array)
              .map((b) => b.toString(16).padStart(2, "0"))
              .join("")
        );
      };
      reader.readAsArrayBuffer(file);
    }
  };

  const handleDownload = () => {
    if (!processedData) return;

    const blob = new Blob([processedData], {
      type: "application/octet-stream",
    });
    const url = URL.createObjectURL(blob);
    const a = document.createElement("a");
    a.href = url;
    a.download = uploadedFile
      ? `processed_${uploadedFile.name}`
      : "processed_file.bin";
    document.body.appendChild(a);
    a.click();
    document.body.removeChild(a);
    URL.revokeObjectURL(url);
  };

  return (
    <div className="space-y-4">
      <div className="space-y-2">
        <Label htmlFor="des-mode" className="block">
          DES Block Mode
        </Label>
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
        <Label htmlFor="des-datatype" className="block">
          Input Data Type
        </Label>
        <select
          className="bg-muted px-2 py-2 outline"
          onChange={(e) => setDesDataType(e.target.value)}
        >
          <option value="ascii">ASCII Text</option>
          <option value="binary">Binary</option>
          <option value="file">File Upload</option>
        </select>
      </div>
      <div className="space-y-2">
        <Label htmlFor="des-key">Key 1</Label>
        <TextArea
          id="des-key"
          value={desKeys[0]}
          onChange={(e) => handleDesKeyEnter(e.target.value, 1)}
          placeholder="Preface binary with 0b and hex with 0x"
          className={desKeys[0].length > 0 ? "font-mono" : ""}
        />
        {desKeyInputStatuses[0].length > 0 && (
          <div>
            <p className="text-red-700 text-sm">{desKeyInputStatuses[0]}</p>
          </div>
        )}
        {desKeyWarnings[0] && !desKeyInputStatuses[0] && (
          <div>
            <p className="text-yellow-700 text-sm">
              Keys under {desKeySize} bits will be left-padded with zeros
            </p>
          </div>
        )}
      </div>
      <div className="space-y-2">
        <Label htmlFor="des-key">Key 2</Label>
        <TextArea
          id="des-key"
          value={desKeys[1]}
          onChange={(e) => handleDesKeyEnter(e.target.value, 2)}
          placeholder="Preface binary with 0b and hex with 0x"
          className={desKeys[1].length > 0 ? "font-mono" : ""}
        />
        {desKeyInputStatuses[1].length > 0 && (
          <div>
            <p className="text-red-700 text-sm">{desKeyInputStatuses[1]}</p>
          </div>
        )}
        {desKeyWarnings[1] && !desKeyInputStatuses[1] && (
          <div>
            <p className="text-yellow-700 text-sm">
              Keys under {desKeySize} bits will be left-padded with zeros
            </p>
          </div>
        )}
      </div>
      <div className="space-y-2">
        <Label htmlFor="des-key">Key 3</Label>
        <TextArea
          id="des-key"
          value={desKeys[2]}
          onChange={(e) => handleDesKeyEnter(e.target.value, 3)}
          placeholder="Preface binary with 0b and hex with 0x"
          className={desKeys[2].length > 0 ? "font-mono" : ""}
        />
        {desKeyInputStatuses[2].length > 0 && (
          <div>
            <p className="text-red-700 text-sm">{desKeyInputStatuses[2]}</p>
          </div>
        )}
        {desKeyWarnings[2] && !desKeyInputStatuses[2] && (
          <div>
            <p className="text-yellow-700 text-sm">
              Keys under {desKeySize} bits will be left-padded with zeros
            </p>
          </div>
        )}
      </div>
      <div className="space-y-2">
        <Label htmlFor="des-data">Data</Label>
        {desDataType === "file" ? (
          <div className="space-y-2">
            <Input type="file" onChange={handleFileUpload} className="w-full" />
            {uploadedFile && (
              <p className="text-sm text-muted-foreground">
                Selected file: {uploadedFile.name} ({uploadedFile.size} bytes)
              </p>
            )}
          </div>
        ) : (
          <TextArea
            id="des-data"
            value={desData}
            onChange={(e) => handleDesDataEnter(e.target.value)}
            className={
              desDataType == "binary" && desData.length > 0 ? "font-mono" : ""
            }
            placeholder="Enter text to encrypt here"
          />
        )}
        {dataStatus && <p className="text-red-700 text-sm">{dataStatus}</p>}
      </div>
      {blockMode > 0 && (
        <div className="space-y-2">
          <Label htmlFor="des-iv">
            {blockMode == 1
              ? "Initialization Vector (16 Bytes)"
              : "Nonce (12 Bytes)"}
          </Label>
          <Input
            id="des-iv"
            value={initVector}
            onChange={(e) => handleDesIVEnter(e.target.value)}
            placeholder="Preface binary with 0b and hex with 0x"
            className={initVector ? "font-mono" : ""}
          />
          {initVectorStatus && (
            <div>
              <p className="text-red-700 text-sm">{initVectorStatus}</p>
            </div>
          )}
        </div>
      )}
      <div className="flex gap-2">
        {!desKeyInputStatuses[0] 
          && !desKeyInputStatuses[1]
          && !desKeyInputStatuses[2]
          && !initVectorStatus && !dataStatus && (
          <Button onClick={handleDesEncrypt}>Encrypt</Button>
        )}
        {desDataType != "ascii" && desKeyInputStatuses[0].length == 0 && 
          desKeyInputStatuses[1].length == 0 && 
          desKeyInputStatuses[2].length == 0 && 
        (
          <div className="flex gap-2">
            <Button
              variant="outline"
              onClick={() => {
                handleDesDecrypt(0);
              }}
            >
              Decrypt
            </Button>
            <Button
              variant="outline"
              onClick={() => {
                handleDesDecrypt(1);
              }}
            >
              Decrypt as ASCII
            </Button>
          </div>
        )}
      </div>
      {desResult.length > 0 && (
        <div className="mt-4 p-4 bg-muted rounded-md">
          <p className="text-lg font-semibold underline">Result:</p>
          {resultType == "binary" ? (
            <>
              {desResult.slice(0, 3).map((line, index) => (
                <p className="font-mono" key={index}>
                  {line}
                </p>
              ))}
              {desResult.length > 3 && <p className="font-mono">...</p>}
            </>
          ) : (
            desResult.map((line, index) => <p key={index}>{line}</p>)
          )}
        </div>
      )}
      {processedData && desResult.length > 0 && (
        <div className="mt-4">
          <Button onClick={handleDownload}>Download Processed File</Button>
        </div>
      )}
      {desError && (
        <div className="mt-4 p-4 bg-muted rounded-md">
          <p className="text-lg font-semibold underline text-red-700">
            {desError}
          </p>
        </div>
      )}
    </div>
  );
}
