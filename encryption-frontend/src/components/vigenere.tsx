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
import { useState } from "react";
import { vigenereEncrypt, vigenereDecrypt } from "@/utils/vigenere";

export function Vigenere() {
  const [vigenereKey, setVigenereKey] = useState("");
  const [vigenereText, setVigenereText] = useState("");
  const [vigenereResult, setVigenereResult] = useState("");

  const handleVigenereEncrypt = () => {
    const encrypted = vigenereEncrypt(vigenereText, vigenereKey);
    setVigenereResult("Encrypted: " + encrypted);
  };

  const handleVigenereDecrypt = () => {
    const decrypted = vigenereDecrypt(vigenereText, vigenereKey);
    setVigenereResult("Decrypted: " + decrypted);
  };

  return (
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
  );
}
