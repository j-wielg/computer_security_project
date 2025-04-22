"use client";

import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { Input, TextArea } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { Label } from "@/components/ui/label";
import { useState } from "react";
import { vigenereEncrypt, vigenereDecrypt } from "@/utils/vigenere";
import { aesEncrypt, aesDecrypt } from "@/utils/aes";

export default function Home() {
  const [vigenereKey, setVigenereKey] = useState("");
  const [vigenereText, setVigenereText] = useState("");
  const [vigenereResult, setVigenereResult] = useState("");
  const [rsaPublicKey, setRsaPublicKey] = useState("");
  const [rsaPrivateKey, setRsaPrivateKey] = useState("");
  const [rsaText, setRsaText] = useState("");
  const [rsaResult, setRsaResult] = useState("");
  const [aesKey, setAesKey] = useState("");
  const [aesKeyInputStatus, setAesKeyInputStatus] = useState("");
  const [aesKeyWarning, setAesKeyWarning] = useState(false);
  const [aesKeySize, setAesKeySize] = useState(128);
  const [blockMode, setBlockMode] = useState(0);
  const [aesData, setAesData] = useState("");
  const [aesDataType, setAesDataType] = useState("ascii");
  const [aesResult, setAesResult] = useState("");

  const handleVigenereEncrypt = () => {
    const encrypted = vigenereEncrypt(vigenereText, vigenereKey);
    setVigenereResult("Encrypted: " + encrypted);
  };

  const handleVigenereDecrypt = () => {
    const decrypted = vigenereDecrypt(vigenereText, vigenereKey);
    setVigenereResult("Decrypted: " + decrypted);
  };

  const handleRsaEncrypt = () => {
    // TODO: Implement RSA encryption
    setRsaResult("Encrypted: " + rsaText);
  };

  const handleRsaDecrypt = () => {
    // TODO: Implement RSA decryption
    setRsaResult("Decrypted: " + rsaText);
  };

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
      setAesKeyInputStatus("Key must be in either binary or hexadecimal format");
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

  const handleAesEncrypt = () => {
    // Step 1: Turn the key string into a bigint
    // Step 2: Turn the data string into an array of bytes
    //      Step 2a: If the data string is binary/hex, parse it
    //      Step 2b: If the data string is ASCII, get the char codes
    // Step 3: Do the encryption
    // Step 4: Print the encrypted blocks
  }

  const handleAesDecrypt = () => {

  }

  return (
    <div className="container mx-auto p-4 max-w-4xl">
      <h1 className="text-3xl font-bold mb-8 text-center">Encryption Tools</h1>

      <Tabs defaultValue="vigenere" className="w-full">
        <TabsList className="grid w-full grid-cols-3">
          <TabsTrigger value="vigenere">Vigenere Cipher</TabsTrigger>
          <TabsTrigger value="rsa">RSA Encryption</TabsTrigger>
          <TabsTrigger value="aes">AES Encryption</TabsTrigger>
        </TabsList>

        <TabsContent value="vigenere">
          <Card>
            <CardHeader>
              <CardTitle>Vigenere Cipher</CardTitle>
              <CardDescription>
                Encrypt or decrypt text using the Vigenere cipher method
              </CardDescription>
            </CardHeader>
            <CardContent className="space-y-4">
              <div className="space-y-2">
                <Label htmlFor="vigenere-key">Key</Label>
                <Input
                  id="vigenere-key"
                  value={vigenereKey}
                  onChange={(e) => setVigenereKey(e.target.value)}
                  placeholder="Enter encryption key"
                />
              </div>
              <div className="space-y-2">
                <Label htmlFor="vigenere-text">Text</Label>
                <Input
                  id="vigenere-text"
                  value={vigenereText}
                  onChange={(e) => setVigenereText(e.target.value)}
                  placeholder="Enter text to encrypt/decrypt"
                />
              </div>
              <div className="flex gap-2">
                <Button onClick={handleVigenereEncrypt}>Encrypt</Button>
                <Button variant="outline" onClick={handleVigenereDecrypt}>
                  Decrypt
                </Button>
              </div>
              {vigenereResult && (
                <div className="mt-4 p-4 bg-muted rounded-md">
                  <p className="text-lg font-semibold underline">Result:</p>
                  <p>{vigenereResult}</p>
                </div>
              )}
            </CardContent>
          </Card>
        </TabsContent>

        <TabsContent value="rsa">
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
                <Label htmlFor="rsa-text">Text</Label>
                <Input
                  id="rsa-text"
                  value={rsaText}
                  onChange={(e) => setRsaText(e.target.value)}
                  placeholder="Enter text to encrypt/decrypt"
                />
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
                  <p>{rsaResult}</p>
                </div>
              )}
            </CardContent>
          </Card>
        </TabsContent>

        <TabsContent value="aes">
          <Card>
            <CardHeader>
              <CardTitle>AES (Advanced Encryption Standard) Cipher</CardTitle>
              <CardDescription>
                Encrypt or decrypt text
              </CardDescription>
            </CardHeader>
            <CardContent className="space-y-4">
              <div className="space-y-2">
                <Label htmlFor="aes-type">AES Key Size</Label>
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
                <Label htmlFor="aes-mode">AES Block Mode</Label>
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
                <Label htmlFor="aes-datatype">Data Type</Label>
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
                {aesKeyWarning && aesKeyInputStatus.length == 0 && (
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
                  onChange={(e) => setAesData(e.target.value)}
                  className={(aesDataType == "binary" && aesData.length > 0) ? "font-mono" : ""}
                  placeholder={
                    (aesDataType == "binary") ?
                    "Enter hex (0x) or binary (0b) data" :
                    "Enter text to encrypt here"
                  }
                />
              </div>
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
            </CardContent>
          </Card>
        </TabsContent>
      </Tabs>
    </div>
  );
}
