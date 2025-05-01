import React from "react";
import { useState } from "react";
import { Link, useLocation } from "wouter";
import { Button } from "@/components/ui/button";
import { useAuth } from "@/hooks/use-auth";
import {
  DirectionsCar,
  Menu,
  Close,
  AccountCircle,
} from "@/components/ui/icons";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";

export default function Header() {
  const [location] = useLocation();
  const { user, logoutMutation } = useAuth();
  const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false);

  const toggleMobileMenu = () => {
    setIsMobileMenuOpen(!isMobileMenuOpen);
  };

  const handleLogout = () => {
    logoutMutation.mutate();
  };

  return (
    <header className="bg-white shadow-sm sticky top-0 z-50">
      <div className="container mx-auto px-4 md:px-6">
        <div className="flex items-center justify-between h-16">
          {/* Logo */}
          <div className="flex items-center">
            <Link href="/" className="flex items-center">
              <DirectionsCar className="w-6 h-6 text-primary mr-2" />
              <span className="font-bold text-xl text-primary-800">
                AutoHaven
              </span>
            </Link>
          </div>

          {/* Desktop Navigation */}
          <nav className="hidden md:flex space-x-8">
            <Link
              href="/cars"
              className={`text-gray-700 hover:text-primary font-medium ${location === "/cars" ? "text-primary" : ""}`}
            >
              Search Cars
            </Link>
            <Link
              href={user ? "/profile" : "/auth"}
              className={`text-gray-700 hover:text-primary font-medium ${location === "/profile" ? "text-primary" : ""}`}
            >
              Sell
            </Link>
            <Link
              href="/finance-guide"
              className="text-gray-700 hover:text-primary font-medium"
            >
              Financing & Buying Guide
            </Link>
            <Link
              href="/#how-it-works"
              className="text-gray-700 hover:text-primary font-medium"
            >
              About
            </Link>
          </nav>

          {/* Auth Buttons or User Menu */}
          <div className="hidden md:flex items-center space-x-4">
            {user ? (
              <DropdownMenu>
                <DropdownMenuTrigger asChild>
                  <Button variant="ghost" className="flex items-center gap-2">
                    <AccountCircle className="w-5 h-5" />
                    <span>{user.username}</span>
                  </Button>
                </DropdownMenuTrigger>
                <DropdownMenuContent align="end">
                  <DropdownMenuItem asChild>
                    <Link href="/profile" className="w-full cursor-pointer">
                      Profile
                    </Link>
                  </DropdownMenuItem>
                  <DropdownMenuItem asChild>
                    <Link href="/messages" className="w-full cursor-pointer">
                      Messages
                    </Link>
                  </DropdownMenuItem>
                  <DropdownMenuItem
                    onClick={handleLogout}
                    className="cursor-pointer"
                  >
                    Logout
                  </DropdownMenuItem>
                </DropdownMenuContent>
              </DropdownMenu>
            ) : (
              <>
                <Link href="/auth">
                  <Button variant="ghost" className="font-medium">
                    Log in
                  </Button>
                </Link>
                <Link href="/auth">
                  <Button className="bg-primary hover:bg-primary/90 text-white">
                    Sign up
                  </Button>
                </Link>
              </>
            )}
          </div>

          {/* Mobile menu button */}
          <div className="md:hidden">
            <Button variant="ghost" size="icon" onClick={toggleMobileMenu}>
              {isMobileMenuOpen ? (
                <Close className="h-6 w-6" />
              ) : (
                <Menu className="h-6 w-6" />
              )}
            </Button>
          </div>
        </div>
      </div>

      {/* Mobile Navigation */}
      {isMobileMenuOpen && (
        <div className="md:hidden bg-white border-t">
          <div className="px-2 pt-2 pb-3 space-y-1">
            <Link
              href="/cars"
              className="block px-3 py-2 rounded-md text-base font-medium text-gray-700 hover:text-primary hover:bg-gray-50"
            >
              Search Cars
            </Link>
            <Link
              href={user ? "/profile" : "/auth"}
              className="block px-3 py-2 rounded-md text-base font-medium text-gray-700 hover:text-primary hover:bg-gray-50"
            >
              Sell
            </Link>
            <Link
              href="/finance-guide"
              className="block px-3 py-2 rounded-md text-base font-medium text-gray-700 hover:text-primary hover:bg-gray-50"
            >
              Financing & Buying Guide
            </Link>
            <Link
              href="/#how-it-works"
              className="block px-3 py-2 rounded-md text-base font-medium text-gray-700 hover:text-primary hover:bg-gray-50"
            >
              About
            </Link>
          </div>
          <div className="pt-4 pb-3 border-t border-gray-200">
            {user ? (
              <div className="flex flex-col px-4 space-y-2">
                <Link
                  href="/profile"
                  className="px-3 py-2 rounded-md text-base font-medium text-gray-700 hover:text-primary hover:bg-gray-50"
                >
                  Profile
                </Link>
                <Link
                  href="/messages"
                  className="px-3 py-2 rounded-md text-base font-medium text-gray-700 hover:text-primary hover:bg-gray-50"
                >
                  Messages
                </Link>
                <Button
                  variant="ghost"
                  className="justify-start"
                  onClick={handleLogout}
                >
                  Logout
                </Button>
              </div>
            ) : (
              <div className="flex items-center justify-between px-4">
                <Link href="/auth" className="w-full mr-2">
                  <Button variant="outline" className="w-full">
                    Log in
                  </Button>
                </Link>
                <Link href="/auth" className="w-full ml-2">
                  <Button className="w-full">Sign up</Button>
                </Link>
              </div>
            )}
          </div>
        </div>
      )}
    </header>
  );
}

// Icons are imported from icons.tsx
