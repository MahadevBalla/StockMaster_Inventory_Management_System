
import React from 'react';
import { Button } from "@/components/ui/button";
import { Barcode } from "lucide-react";
import { useToast } from "@/hooks/use-toast";

interface BarcodeGeneratorProps {
  productId: string;
  productSku: string;
}

export const BarcodeGenerator = ({ productId, productSku }: BarcodeGeneratorProps) => {
  const { toast } = useToast();

  const generateBarcode = () => {
    const timestamp = new Date().getTime();
    const uniqueBarcode = `${productSku}-${timestamp}-${Math.random().toString(36).substr(2, 5)}`;
    
    toast({
      title: "Barcode Generated",
      description: `Barcode: ${uniqueBarcode}`,
    });
    
    return uniqueBarcode;
  };

  return (
    <Button
      variant="outline"
      size="sm"
      onClick={generateBarcode}
      className="flex items-center gap-2"
    >
      <Barcode className="h-4 w-4" />
      Generate Barcode
    </Button>
  );
};
