"use client";

import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { Label } from "@/components/ui/label";
import { useState, useEffect } from "react";
import { rsaEncrypt, rsaDecrypt, rsaKeyGenDefault } from "@/utils/rsa";

export function RSA() {
  const [rsaPublicKey, setRsaPublicKey] = useState("");
  const [rsaPrivateKey, setRsaPrivateKey] = useState("");
  const [rsaText, setRsaText] = useState("");
  const [rsaResult, setRsaResult] = useState("");
  const [inputDataType, setInputDataType] = useState("ascii");
  const [uploadedFile, setUploadedFile] = useState<File | null>(null);
  const [processedData, setProcessedData] = useState<Uint8Array | null>(null);
  const [e, setE] = useState<bigint>(BigInt(0));
  const [n, setN] = useState<bigint>(BigInt(0));
  const [d, setD] = useState<bigint>(BigInt(0));

  useEffect(() => {
    // Generate default keys on component mount using the test's primes
    const [defaultE, defaultN, defaultD] = rsaKeyGenDefault();
    setE(defaultE);
    setN(defaultN);
    setD(defaultD);
    setRsaPublicKey(`(${defaultE.toString()}, ${defaultN.toString()})`);
    setRsaPrivateKey(`(${defaultD.toString()}, ${defaultN.toString()})`);
  }, []);

  const handleFileUpload = (event: React.ChangeEvent<HTMLInputElement>) => {
    const file = event.target.files?.[0];
    if (file) {
      setUploadedFile(file);
      const reader = new FileReader();
      reader.onload = (e) => {
        const arrayBuffer = e.target?.result as ArrayBuffer;
        const uint8Array = new Uint8Array(arrayBuffer);
        setProcessedData(uint8Array);

        // If it's likely an encrypted file (has _encrypted in name)
        if (file.name.includes("_encrypted")) {
          // Parse as 8-byte chunks for decryption
          const chunks: bigint[] = [];
          for (let i = 0; i < uint8Array.length; i += 8) {
            const chunkBytes = uint8Array.slice(
              i,
              Math.min(i + 8, uint8Array.length)
            );
            let hexStr = "";
            for (const byte of chunkBytes) {
              hexStr += byte.toString(16).padStart(2, "0");
            }
            chunks.push(BigInt("0x" + hexStr));
          }
          setRsaText(chunks.join(","));
        } else {
          // Regular file, display as hex
          setRsaText(
            "0x" +
              Array.from(uint8Array)
                .map((b) => b.toString(16).padStart(2, "0"))
                .join("")
          );
        }
      };
      reader.readAsArrayBuffer(file);
    }
  };

  const handleDownload = () => {
    if (!processedData) return;

    // Create appropriate file type and name
    const blob = new Blob([processedData], {
      type: "application/octet-stream",
    });
    const url = URL.createObjectURL(blob);
    const a = document.createElement("a");
    a.href = url;

    // Add suffix to filename to indicate encryption/decryption
    let filename = "processed_file.bin";
    if (uploadedFile) {
      const nameParts = uploadedFile.name.split(".");
      const extension = nameParts.length > 1 ? `.${nameParts.pop()}` : "";
      const baseName = nameParts.join(".");

      // Check if we're showing result (after encryption) or original data
      if (rsaResult.includes(",")) {
        // This is encrypted data
        filename = `${baseName}_encrypted${extension}`;
      } else {
        // This is decrypted data
        filename = `${baseName}_decrypted${extension}`;
      }
    }

    a.download = filename;
    document.body.appendChild(a);
    a.click();
    document.body.removeChild(a);
    URL.revokeObjectURL(url);
  };

  const handleRsaEncrypt = () => {
    try {
      let dataToEncrypt: Uint8Array;

      if (inputDataType === "ascii") {
        // Convert ASCII text to bytes
        dataToEncrypt = new TextEncoder().encode(rsaText);
      } else {
        // For binary data, use the processed data directly
        if (!processedData) return;
        dataToEncrypt = processedData;
      }

      const chunks: bigint[] = [];

      // Encrypt each 4-byte chunk exactly as in rsaFileTest.ts
      for (let i = 0; i < dataToEncrypt.length; i += 4) {
        // Get 4 bytes or less for the last chunk
        const chunkBytes = dataToEncrypt.slice(
          i,
          Math.min(i + 4, dataToEncrypt.length)
        );

        // Convert bytes to hex and then to BigInt (padding to 4 bytes if needed)
        let hexStr = "";
        for (const byte of chunkBytes) {
          hexStr += byte.toString(16).padStart(2, "0");
        }
        // Pad to 8 hex chars (4 bytes) if needed
        while (hexStr.length < 8) {
          hexStr += "00";
        }

        const chunk = BigInt("0x" + hexStr);
        const encryptedChunk = rsaEncrypt(chunk, e, n);
        chunks.push(encryptedChunk);
      }

      // Store in comma-separated format for display
      setRsaResult(chunks.join(","));

      // Create binary representation for download (8 bytes per chunk)
      const encryptedBytes: number[] = [];
      for (const chunk of chunks) {
        // Convert each chunk to 8 bytes (64 bits)
        let hexStr = chunk.toString(16);
        // Pad to 16 hex chars (8 bytes)
        hexStr = hexStr.padStart(16, "0");

        // Convert to bytes
        for (let i = 0; i < hexStr.length; i += 2) {
          encryptedBytes.push(parseInt(hexStr.substring(i, i + 2), 16));
        }
      }

      setProcessedData(new Uint8Array(encryptedBytes));
    } catch (error) {
      setRsaResult("Error: " + (error as Error).message);
    }
  };

  const handleRsaDecrypt = () => {
    try {
      // Determine if input is comma-separated chunks or we need to parse from processedData
      let encryptedChunks: bigint[];

      if (rsaText.includes(",")) {
        // Input is already in comma-separated format
        encryptedChunks = rsaText
          .split(",")
          .map((chunk) => BigInt(chunk.trim()));
      } else if (processedData) {
        // Input is binary data, parse as 8-byte chunks
        encryptedChunks = [];
        for (let i = 0; i < processedData.length; i += 8) {
          const chunkBytes = processedData.slice(
            i,
            Math.min(i + 8, processedData.length)
          );
          let hexStr = "";
          for (const byte of chunkBytes) {
            hexStr += byte.toString(16).padStart(2, "0");
          }
          encryptedChunks.push(BigInt("0x" + hexStr));
        }
      } else {
        throw new Error("No data to decrypt");
      }

      const decryptedBytes: number[] = [];

      // Decrypt each chunk exactly as in rsaFileTest.ts
      for (const chunk of encryptedChunks) {
        const decrypted = rsaDecrypt(chunk, d, n);

        // Convert BigInt to hex string
        let hexStr = decrypted.toString(16);

        // Ensure even length
        if (hexStr.length % 2 !== 0) {
          hexStr = "0" + hexStr;
        }

        // Remove any padding zeros that are a result of the decryption process
        // but preserve original content zeros
        // Convert each byte (2 hex chars) to a number
        for (let i = 0; i < hexStr.length; i += 2) {
          const byteVal = parseInt(hexStr.substring(i, i + 2), 16);
          decryptedBytes.push(byteVal);
        }
      }

      // Remove trailing zeros that might have been added during padding
      let endIndex = decryptedBytes.length;
      while (endIndex > 0 && decryptedBytes[endIndex - 1] === 0) {
        endIndex--;
      }

      const finalDecryptedBytes = decryptedBytes.slice(0, endIndex);

      if (inputDataType === "ascii") {
        // Convert data bytes to text
        const textBytes = new Uint8Array(finalDecryptedBytes);
        try {
          const result = new TextDecoder().decode(textBytes);
          setRsaResult(result);
        } catch (e) {
          setRsaResult("Error decoding text: " + (e as Error).message);
        }
      } else {
        // For binary data, update the processed data
        const bytes = new Uint8Array(finalDecryptedBytes);
        setProcessedData(bytes);
        setRsaResult(
          "0x" +
            Array.from(bytes)
              .map((b) => b.toString(16).padStart(2, "0"))
              .join("")
        );
      }
    } catch (error) {
      setRsaResult("Error: " + (error as Error).message);
    }
  };

  return (
    <Card>
      <CardHeader>
        <CardTitle>RSA Encryption</CardTitle>
        <CardDescription>
          Encrypt or decrypt text using RSA public key cryptography
        </CardDescription>
      </CardHeader>
      <CardContent className="space-y-4">
        <div className="space-y-2">
          <Label htmlFor="rsa-public-key">Public Key</Label>
          <Input
            id="rsa-public-key"
            value={rsaPublicKey}
            onChange={(e) => setRsaPublicKey(e.target.value)}
            placeholder="Enter public key"
          />
        </div>
        <div className="space-y-2">
          <Label htmlFor="rsa-private-key">Private Key</Label>
          <Input
            id="rsa-private-key"
            value={rsaPrivateKey}
            onChange={(e) => setRsaPrivateKey(e.target.value)}
            placeholder="Enter private key"
          />
        </div>
        <div className="space-y-2">
          <Label htmlFor="rsa-datatype">Input Data Type</Label>
          <select
            id="rsa-datatype"
            className="bg-muted px-2 py-2 outline w-full"
            onChange={(e) => setInputDataType(e.target.value)}
          >
            <option value="ascii">ASCII Text</option>
            <option value="binary">Binary</option>
          </select>
        </div>
        <div className="space-y-2">
          <Label htmlFor="rsa-text">Text</Label>
          {inputDataType === "binary" ? (
            <div className="space-y-2">
              <Input
                type="file"
                onChange={handleFileUpload}
                className="w-full"
              />
              {uploadedFile && (
                <p className="text-sm text-muted-foreground">
                  Selected file: {uploadedFile.name} ({uploadedFile.size} bytes)
                </p>
              )}
            </div>
          ) : (
            <Input
              id="rsa-text"
              value={rsaText}
              onChange={(e) => setRsaText(e.target.value)}
              placeholder="Enter text to encrypt/decrypt"
            />
          )}
        </div>
        <div className="flex gap-2">
          <Button onClick={handleRsaEncrypt}>Encrypt</Button>
          <Button variant="outline" onClick={handleRsaDecrypt}>
            Decrypt
          </Button>
        </div>
        {rsaResult && (
          <div className="mt-4 p-4 bg-muted rounded-md">
            <p className="text-lg font-semibold underline">Result:</p>
            <p
              className={`${
                inputDataType === "binary" ? "font-mono" : ""
              } whitespace-pre-wrap break-all`}
            >
              {inputDataType === "binary" && rsaResult.length > 50
                ? rsaResult.substring(0, 50) + "..."
                : rsaResult}
            </p>
          </div>
        )}
        {processedData && rsaResult && (
          <div className="mt-4">
            <Button onClick={handleDownload}>Download Processed File</Button>
          </div>
        )}
      </CardContent>
    </Card>
  );
}
