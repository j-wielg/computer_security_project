"use client";

import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
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
import { useState } from "react";

export default function Home() {
  const [vigenereKey, setVigenereKey] = useState("");
  const [vigenereText, setVigenereText] = useState("");
  const [vigenereResult, setVigenereResult] = useState("");
  const [rsaPublicKey, setRsaPublicKey] = useState("");
  const [rsaPrivateKey, setRsaPrivateKey] = useState("");
  const [rsaText, setRsaText] = useState("");
  const [rsaResult, setRsaResult] = useState("");

  const handleVigenereEncrypt = () => {
    // TODO: Implement Vigenere encryption
    setVigenereResult("Encrypted: " + vigenereText);
  };

  const handleVigenereDecrypt = () => {
    // TODO: Implement Vigenere decryption
    setVigenereResult("Decrypted: " + vigenereText);
  };

  const handleRsaEncrypt = () => {
    // TODO: Implement RSA encryption
    setRsaResult("Encrypted: " + rsaText);
  };

  const handleRsaDecrypt = () => {
    // TODO: Implement RSA decryption
    setRsaResult("Decrypted: " + rsaText);
  };

  return (
    <div className="container mx-auto p-4 max-w-4xl">
      <h1 className="text-3xl font-bold mb-8 text-center">Encryption Tools</h1>

      <Tabs defaultValue="vigenere" className="w-full">
        <TabsList className="grid w-full grid-cols-2">
          <TabsTrigger value="vigenere">Vigenere Cipher</TabsTrigger>
          <TabsTrigger value="rsa">RSA Encryption</TabsTrigger>
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
                  <p className="font-medium">Result:</p>
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
                  <p className="font-medium">Result:</p>
                  <p>{rsaResult}</p>
                </div>
              )}
            </CardContent>
          </Card>
        </TabsContent>
      </Tabs>
    </div>
  );
}
