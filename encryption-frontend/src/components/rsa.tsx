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
    // Generate default keys on component mount
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
        setRsaText(
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

  const handleRsaEncrypt = () => {
    try {
      if (inputDataType === "ascii") {
        // Convert ASCII text to bytes
        const textBytes = new TextEncoder().encode(rsaText);

        // Calculate chunk size (leaving room for sentinel)
        const maxChunkSize = Math.floor(n.toString(2).length / 8) - 3; // Convert to bytes and leave room for sentinel
        const chunks: bigint[] = [];

        // Split into chunks and encrypt each one
        for (let i = 0; i < textBytes.length; i += maxChunkSize) {
          const chunkBytes = new Uint8Array(
            Math.min(maxChunkSize + 2, textBytes.length - i + 2)
          );
          chunkBytes.set(textBytes.slice(i, i + maxChunkSize));
          // Add sentinel to last chunk only
          if (i + maxChunkSize >= textBytes.length) {
            chunkBytes[textBytes.length - i] = 0xff;
            chunkBytes[textBytes.length - i + 1] = 0xff;
          }
          const chunk = BigInt(
            "0x" +
              Array.from(chunkBytes)
                .map((b) => b.toString(16).padStart(2, "0"))
                .join("")
          );
          chunks.push(rsaEncrypt(chunk, e, n));
        }

        setRsaResult(chunks.join(","));
      } else {
        // For binary data, use the processed data directly
        if (!processedData) return;

        // Calculate chunk size
        const maxChunkSize = Math.floor(n.toString(2).length / 8); // Convert to bytes
        const chunks: bigint[] = [];

        // Split into chunks and encrypt each one
        for (let i = 0; i < processedData.length; i += maxChunkSize) {
          const chunkBytes = processedData.slice(i, i + maxChunkSize);
          const chunk = BigInt(
            "0x" +
              Array.from(chunkBytes)
                .map((b) => b.toString(16).padStart(2, "0"))
                .join("")
          );
          chunks.push(rsaEncrypt(chunk, e, n));
        }

        setRsaResult(chunks.join(","));
      }
    } catch (error) {
      setRsaResult("Error: " + (error as Error).message);
    }
  };

  const handleRsaDecrypt = () => {
    try {
      // Split the input into chunks
      const encryptedChunks = rsaText
        .split(",")
        .map((chunk) => BigInt(chunk.trim()));
      const decryptedBytes: number[] = [];

      // Decrypt each chunk
      for (const chunk of encryptedChunks) {
        const message = rsaDecrypt(chunk, d, n);
        let hexStr = message.toString(16);
        if (hexStr.length % 2 !== 0) hexStr = "0" + hexStr;

        // Convert to bytes
        for (let i = 0; i < hexStr.length; i += 2) {
          decryptedBytes.push(parseInt(hexStr.substr(i, 2), 16));
        }
      }

      if (inputDataType === "ascii") {
        // Find sentinel in the combined bytes
        let textLength = 0;
        for (let i = 0; i < decryptedBytes.length - 1; i++) {
          if (decryptedBytes[i] === 0xff && decryptedBytes[i + 1] === 0xff) {
            textLength = i;
            break;
          }
        }

        if (textLength === 0) {
          throw new Error("Invalid decrypted data - no sentinel found");
        }

        // Convert data bytes to text
        const textBytes = new Uint8Array(decryptedBytes.slice(0, textLength));
        const result = new TextDecoder().decode(textBytes);
        setRsaResult(result);
      } else {
        // For binary data, update the processed data
        const bytes = new Uint8Array(decryptedBytes);
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
