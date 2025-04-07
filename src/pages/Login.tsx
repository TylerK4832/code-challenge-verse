
import { Auth } from "@supabase/auth-ui-react";
import { ThemeSupa } from "@supabase/auth-ui-shared";
import { supabase } from "@/integrations/supabase/client";
import { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import UsernameSetup from "@/components/UsernameSetup";
import { Code, Hexagon } from "lucide-react";

const Login = () => {
  const navigate = useNavigate();
  const [newUserId, setNewUserId] = useState<string | null>(null);
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    // Check current session on mount
    supabase.auth.getSession().then(({ data: { session } }) => {
      if (session) {
        handleAuthenticatedUser(session.user.id);
      }
      setIsLoading(false);
    });

    // Listen for auth changes
    const { data: { subscription } } = supabase.auth.onAuthStateChange(async (event, session) => {
      if (event === 'SIGNED_IN' && session) {
        handleAuthenticatedUser(session.user.id);
      } else if (event === 'SIGNED_OUT') {
        setNewUserId(null);
      }
    });

    return () => subscription.unsubscribe();
  }, [navigate]);

  const handleAuthenticatedUser = async (userId: string) => {
    // Check if user has a username
    const { data: profile } = await supabase
      .from("profiles")
      .select("username")
      .eq("id", userId)
      .single();

    if (profile?.username) {
      navigate("/problems");
    } else {
      setNewUserId(userId);
    }
  };

  if (isLoading) {
    return (
      <div className="flex items-center justify-center h-screen">
        <div className="animate-pulse text-muted-foreground">Loading...</div>
      </div>
    );
  }

  if (newUserId) {
    return <UsernameSetup userId={newUserId} />;
  }

  return (
    <div className="container max-w-lg py-8">
      <div className="space-y-6">
        <div className="space-y-2 text-center">
          <div className="flex justify-center items-center mb-3">
            <div className="flex items-center text-primary bg-muted p-2 rounded-md">
              <Hexagon className="h-8 w-8 mr-1" />
              <Code className="h-8 w-8" />
            </div>
          </div>
          <h1 className="text-3xl font-bold">Welcome to CodePrism</h1>
          <p className="text-muted-foreground">Sign in to continue to the platform</p>
        </div>
        <div className="border rounded-lg p-6 bg-card">
          <Auth
            supabaseClient={supabase}
            appearance={{
              theme: ThemeSupa,
              className: {
                container: 'space-y-4',
                button: 'w-full',
                label: 'text-sm font-medium leading-none peer-disabled:cursor-not-allowed peer-disabled:opacity-70',
                input: 'flex h-10 w-full rounded-md border border-input bg-background px-3 py-2 text-sm text-foreground ring-offset-background file:border-0 file:bg-transparent file:text-sm file:font-medium placeholder:text-muted-foreground focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2 disabled:cursor-not-allowed disabled:opacity-50',
              }
            }}
          />
        </div>
      </div>
    </div>
  );
};

export default Login;
