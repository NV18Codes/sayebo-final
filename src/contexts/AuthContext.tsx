import { createContext, useContext, useEffect, useState, ReactNode } from 'react';
import { User, Session } from '@supabase/supabase-js';
import { supabase } from '@/integrations/supabase/client';
import { useToast } from '@/hooks/use-toast';

interface AuthContextType {
  user: User | null;
  session: Session | null;
  loading: boolean;
  signUp: (email: string, password: string, firstName: string, lastName: string, role: 'buyer' | 'seller') => Promise<{ error: any }>;
  signIn: (email: string, password: string) => Promise<{ error: any }>;
  signOut: () => Promise<void>;
}

const AuthContext = createContext<AuthContextType | undefined>(undefined);

export const useAuth = () => {
  const context = useContext(AuthContext);
  if (!context) {
    throw new Error('useAuth must be used within an AuthProvider');
  }
  return context;
};

export const AuthProvider = ({ children }: { children: ReactNode }) => {
  const [user, setUser] = useState<User | null>(null);
  const [session, setSession] = useState<Session | null>(null);
  const [loading, setLoading] = useState(true);
  const [initialized, setInitialized] = useState(false);
  const [isFromLogin, setIsFromLogin] = useState(false);
  const { toast } = useToast();

  useEffect(() => {
    let mounted = true;
    
    // Check if we're coming from login page
    setIsFromLogin(window.location.pathname === '/login');
    
    // Get initial session
    const getInitialSession = async () => {
      try {
        const { data: { session }, error } = await supabase.auth.getSession();
        if (error) {
          console.error('Error getting session:', error);
        }
        
        if (mounted) {
          setSession(session);
          setUser(session?.user ?? null);
          setLoading(false);
          setInitialized(true);
        }
      } catch (error) {
        console.error('Error in getInitialSession:', error);
        if (mounted) {
          setLoading(false);
          setInitialized(true);
        }
      }
    };

    // Set up auth state listener
    const { data: { subscription } } = supabase.auth.onAuthStateChange(
      async (event, session) => {
        if (!mounted || !initialized) return;
        
        console.log('Auth state change:', event, session?.user?.id);
        
        setSession(session);
        setUser(session?.user ?? null);
        
        // Only redirect if this is a fresh sign in AND we came from login page
        if (event === 'SIGNED_IN' && session?.user && isFromLogin) {
          const currentPath = window.location.pathname;
          
          // Only redirect if still on login page
          if (currentPath === '/login') {
            setTimeout(async () => {
              try {
                const { data: profile } = await supabase
                  .from('profiles')
                  .select('role')
                  .eq('id', session.user.id)
                  .single();

                // Redirect based on role
                if (profile?.role === 'admin') {
                  window.location.href = '/admin/dashboard';
                } else {
                  window.location.href = '/marketplace';
                }
              } catch (error) {
                console.error('Error fetching user profile:', error);
                // Fallback redirect to marketplace
                window.location.href = '/marketplace';
              }
            }, 100);
          }
          // Reset the flag after handling
          setIsFromLogin(false);
        }
      }
    );

    getInitialSession();

    return () => {
      mounted = false;
      subscription.unsubscribe();
    };
  }, [initialized, isFromLogin]);

  const signUp = async (email: string, password: string, firstName: string, lastName: string, role: 'buyer' | 'seller' = 'buyer') => {
    try {
      const { data, error } = await supabase.auth.signUp({
        email,
        password,
        options: {
          emailRedirectTo: `${window.location.origin}/`,
          data: {
            first_name: firstName,
            last_name: lastName,
            role: role
          }
        }
      });

      if (error) {
        toast({
          title: "Sign up failed",
          description: error.message,
          variant: "destructive"
        });
        return { error };
      }

      // After successful signup, explicitly create/update the profile with the correct role
      if (data.user && !error) {
        try {
          const { error: profileError } = await supabase
            .from('profiles')
            .upsert({
              id: data.user.id,
              email: email,
              first_name: firstName,
              last_name: lastName,
              role: role
            });

          if (profileError) {
            console.error('Error creating profile:', profileError);
          }
        } catch (profileError) {
          console.error('Error creating profile:', profileError);
        }
      }

      if (role === 'seller') {
        toast({
          title: "Seller account created!",
          description: "Please check your email to verify your account. Once verified, you'll have access to the seller dashboard."
        });
      } else {
        toast({
          title: "Account created successfully!",
          description: "Please check your email to verify your account."
        });
      }

      return { error: null };
    } catch (error: any) {
      return { error };
    }
  };

  const signIn = async (email: string, password: string) => {
    try {
      // Set flag that we're signing in from login page
      setIsFromLogin(true);
      
      const { error } = await supabase.auth.signInWithPassword({
        email,
        password
      });

      if (error) {
        setIsFromLogin(false); // Reset flag on error
        toast({
          title: "Sign in failed",
          description: error.message,
          variant: "destructive"
        });
        return { error };
      }

      toast({
        title: "Welcome back!",
        description: "You have successfully signed in."
      });

      return { error: null };
    } catch (error: any) {
      setIsFromLogin(false); // Reset flag on error
      return { error };
    }
  };

  const signOut = async () => {
    try {
      const { error } = await supabase.auth.signOut();
      
      if (error) {
        toast({
          title: "Error signing out",
          description: error.message,
          variant: "destructive"
        });
        return;
      }

      // Clear local state
      setUser(null);
      setSession(null);
      setIsFromLogin(false);
      
      toast({
        title: "Signed out successfully",
        description: "You have been logged out of your account."
      });

      // Redirect to home page
      window.location.href = '/';
    } catch (error: any) {
      toast({
        title: "Error signing out",
        description: error.message,
        variant: "destructive"
      });
    }
  };

  return (
    <AuthContext.Provider value={{
      user,
      session,
      loading,
      signUp,
      signIn,
      signOut
    }}>
      {children}
    </AuthContext.Provider>
  );
};
