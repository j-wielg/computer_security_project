"use client";

import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { AES } from "@/components/aes";
import { RSA } from "@/components/rsa";
import { Vigenere } from "@/components/vigenere";

export default function Home() {
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
          <Vigenere />
        </TabsContent>

        <TabsContent value="rsa">
          <RSA />
        </TabsContent>

        <TabsContent value="aes">
          <Card>
            <CardHeader>
              <CardTitle>AES (Advanced Encryption Standard) Cipher</CardTitle>
              <CardDescription>Encrypt or decrypt text</CardDescription>
            </CardHeader>
            <CardContent className="space-y-4">
              <AES />
            </CardContent>
          </Card>
        </TabsContent>
      </Tabs>
    </div>
  );
}
