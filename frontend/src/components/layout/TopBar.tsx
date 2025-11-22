import { Bell, Search, Globe } from "lucide-react"; // Added Globe icon
import { ThemeToggle } from "./ThemeToggle";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { TopBarProps } from "@/types";
import { User } from "@/types";


import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import { useState } from "react";

export function TopBar({ user }: TopBarProps) {
  const [language, setLanguage] = useState<"en" | "hi">("en");

  return (
    <div className="flex h-16 items-center justify-between border-b border-border bg-background px-6 sticky top-0 z-30 flex h-16 items-center gap-4 border-b bg-background px-4 md:px-6">
      <div className="flex-1 md:flex md:items-center md:gap-4 max-w-lg">
      </div>

      <div className="flex items-center gap-4">
        {/* Language Selector */}
        <DropdownMenu>
          <DropdownMenuTrigger asChild>
            <Button variant="ghost" size="icon" className="rounded-full">
              <Globe className="h-5 w-5" />
              <span className="sr-only">Toggle language</span>
            </Button>
          </DropdownMenuTrigger>
          <DropdownMenuContent align="end">
            <DropdownMenuItem 
              onClick={() => setLanguage("en")}
              className={language === "en" ? "bg-accent" : ""}
            >
              English
            </DropdownMenuItem>
            <DropdownMenuItem 
              onClick={() => setLanguage("hi")}
              className={language === "hi" ? "bg-accent" : ""}
            >
              हिंदी (Hindi)
            </DropdownMenuItem>
          </DropdownMenuContent>
        </DropdownMenu>

        <ThemeToggle />
      </div>
    </div>
  );
}