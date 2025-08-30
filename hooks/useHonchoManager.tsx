'use client';

import { useState, useEffect, useRef, useCallback } from 'react';
import { Honcho } from '@honcho-ai/sdk';
import { createClient } from '@/lib/supabase/client';

interface Peer {
  id: string;
  name?: string;
  [key: string]: any;
}

interface Session {
  id: string;
  [key: string]: any;
}

export function useHonchoManager() {
  const [peer, setPeer] = useState<Peer | null>(null);
  const [session, setSession] = useState<Session | null>(null);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [user, setUser] = useState<any>(null);
  
  const honchoRef = useRef<any>(null);
  const supabase = createClient();

  useEffect(() => {
    const getUser = async () => {
      const { data: { user } } = await supabase.auth.getUser();
      setUser(user);
    };
    
    getUser();

    const { data: { subscription } } = supabase.auth.onAuthStateChange(
      (event, session) => {
        setUser(session?.user ?? null);
      }
    );

    return () => subscription.unsubscribe();
  }, []);

  const initializeHoncho = useCallback(async () => {
    if (!user) return;
    
    setLoading(true);
    setError(null);
    
    try {
      if (!honchoRef.current) {
        honchoRef.current = new Honcho({});
      }

      const { data: userData, error: userError } = await supabase
        .from('users')
        .select('honcho_id')
        .eq('id', user.id)
        .single();

      if (userError) {
        throw new Error(`Failed to fetch user data: ${userError.message}`);
      }

      if (!userData?.honcho_id) {
        throw new Error('No honcho_id found for user');
      }

      let peer = await honchoRef.current.peer(userData.honcho_id);
      
      if (!peer) {
        throw new Error('Peer not found in Honcho');
      }
      
      setPeer(peer);
      
      const session = await honchoRef.current.createSession({ peerId: peer.id });
      setSession(session);
      
    } catch (err: any) {
      setError(err.message || 'Failed to initialize Honcho');
    } finally {
      setLoading(false);
    }
  }, [user, supabase]);

  useEffect(() => {
    if (user) {
      initializeHoncho();
    }
  }, [user, initializeHoncho]);

    const createNewSession = useCallback(async () => {
    if (!peer || !honchoRef.current) {
      throw new Error('Peer not initialized');
    }

    const newSession = await honchoRef.current.createSession({ peerId: peer.id });
    setSession(newSession);
    return newSession;
  }, [peer]);

  return {
    peer,
    session,
    loading,
    error,
    user,
    honchoRef,
    createNewSession,
    initializeHoncho,
  };
}