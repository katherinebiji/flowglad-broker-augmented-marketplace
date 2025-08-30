"use client";

import { cn } from "@/lib/utils";
import { createClient } from "@/lib/supabase/client";
import { Button } from "@/components/ui/button";
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import Link from "next/link";
import { useRouter } from "next/navigation";
import { useState } from "react";
import { Honcho } from '@honcho-ai/sdk';

export function LoginForm({
  className,
  ...props
}: React.ComponentPropsWithoutRef<"div">) {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [error, setError] = useState<string | null>(null);
  const [isLoading, setIsLoading] = useState(false);
  const router = useRouter();

  const handleLogin = async (e: React.FormEvent) => {
    e.preventDefault();
    console.log('🚀 Starting login process for email:', email);
    
    const supabase = createClient();
    setIsLoading(true);
    setError(null);

    try {
      console.log('🔐 Attempting Supabase auth login...');
      const { data, error } = await supabase.auth.signInWithPassword({
        email,
        password,
      });
      
      if (error) {
        console.error('❌ Supabase login failed:', error);
        throw error;
      }

      console.log('✅ Supabase login successful:', {
        userId: data.user?.id,
        email: data.user?.email
      });

      if (data.user) {
        console.log('👤 Setting up Honcho peer for user:', data.user.id);
        
        try {
          const honcho = new Honcho({});
          console.log('🔍 Fetching existing Honcho peer...');
          let peer = await honcho.peer(data.user.id);
          
          if (!peer) {
            console.log('🆕 No existing peer found, creating new Honcho peer...');
            peer = await honcho.peer(data.user.id);
          } else {
            console.log('✅ Found existing Honcho peer:', peer.id);
          }

          // Check if user already exists in our users table
          console.log('🔍 Checking if user exists in users table...');
          const { data: existingUser, error: fetchError } = await supabase
            .from('users')
            .select('id, honcho_id')
            .eq('id', data.user.id)
            .single();

          if (fetchError && fetchError.code !== 'PGRST116') { // PGRST116 is "not found"
            console.error('❌ Error checking existing user:', fetchError);
            throw fetchError;
          }

          if (!existingUser) {
            console.log('💾 Inserting new user data into Supabase users table...');
            const { data: insertData, error: insertError } = await supabase
              .from('users')
              .insert({
                id: data.user.id,
                honcho_id: peer.id,
              });

            if (insertError) {
              console.error('❌ Failed to insert user data:', insertError);
              throw insertError;
            }

            console.log('✅ User data inserted successfully:', {
              userId: data.user.id,
              honchoId: peer.id
            });
          } else {
            console.log('✅ User already exists in database:', {
              userId: existingUser.id,
              honchoId: existingUser.honcho_id
            });
          }

        } catch (honchoError) {
          console.error('❌ Failed to setup Honcho peer or user data:', honchoError);
          // Log the full error details for debugging
          console.error('Honcho error details:', {
            message: honchoError instanceof Error ? honchoError.message : honchoError,
            stack: honchoError instanceof Error ? honchoError.stack : undefined
          });
          // Don't throw here - allow login to continue even if Honcho setup fails
        }
      } else {
        console.warn('⚠️ No user data received from Supabase login');
      }

      console.log('🎉 Login process completed, redirecting to protected area');
      router.push("/protected");
    } catch (error: unknown) {
      console.error('❌ Login process failed:', error);
      console.error('Error details:', {
        message: error instanceof Error ? error.message : error,
        stack: error instanceof Error ? error.stack : undefined
      });
      setError(error instanceof Error ? error.message : "An error occurred");
    } finally {
      console.log('🏁 Login process completed, setting loading to false');
      setIsLoading(false);
    }
  };

  return (
    <div className={cn("flex flex-col gap-6", className)} {...props}>
      <Card>
        <CardHeader>
          <CardTitle className="text-2xl">Login</CardTitle>
          <CardDescription>
            Enter your email below to login to your account
          </CardDescription>
        </CardHeader>
        <CardContent>
          <form onSubmit={handleLogin}>
            <div className="flex flex-col gap-6">
              <div className="grid gap-2">
                <Label htmlFor="email">Email</Label>
                <Input
                  id="email"
                  type="email"
                  placeholder="m@example.com"
                  required
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                />
              </div>
              <div className="grid gap-2">
                <div className="flex items-center">
                  <Label htmlFor="password">Password</Label>
                  <Link
                    href="/auth/forgot-password"
                    className="ml-auto inline-block text-sm underline-offset-4 hover:underline"
                  >
                    Forgot your password?
                  </Link>
                </div>
                <Input
                  id="password"
                  type="password"
                  required
                  value={password}
                  onChange={(e) => setPassword(e.target.value)}
                />
              </div>
              {error && <p className="text-sm text-red-500">{error}</p>}
              <Button type="submit" className="w-full" disabled={isLoading}>
                {isLoading ? "Logging in..." : "Login"}
              </Button>
            </div>
            <div className="mt-4 text-center text-sm">
              Don&apos;t have an account?{" "}
              <Link
                href="/auth/sign-up"
                className="underline underline-offset-4"
              >
                Sign up
              </Link>
            </div>
          </form>
        </CardContent>
      </Card>
    </div>
  );
}
