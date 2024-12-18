import { Auth } from "@supabase/auth-ui-react";
import { ThemeSupa } from "@supabase/auth-ui-shared";
import { supabase } from "@/integrations/supabase/client";
import { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import UsernameSetup from "@/components/UsernameSetup";

const Login = () => {
  const navigate = useNavigate();
  const [newUserId, setNewUserId] = useState<string | null>(null);

  useEffect(() => {
    const { data: { subscription } } = supabase.auth.onAuthStateChange(async (event, session) => {
      if (session) {
        // Check if user has a username
        const { data: profile } = await supabase
          .from("profiles")
          .select("username")
          .eq("id", session.user.id)
          .single();

        if (profile?.username) {
          navigate("/problems");
        } else {
          setNewUserId(session.user.id);
        }
      }
    });

    return () => subscription.unsubscribe();
  }, [navigate]);

  if (newUserId) {
    return <UsernameSetup userId={newUserId} />;
  }

  return (
    <div className="container max-w-lg py-8">
      <div className="space-y-6">
        <div className="space-y-2 text-center">
          <h1 className="text-3xl font-bold">Welcome to CodeVerse</h1>
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