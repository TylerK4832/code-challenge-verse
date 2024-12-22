import { useParams } from 'react-router-dom';
import { useState, useEffect } from 'react';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { useIsMobile } from '@/hooks/use-mobile';
import { ResizablePanelGroup, ResizablePanel, ResizableHandle } from "@/components/ui/resizable";
import { supabase } from "@/integrations/supabase/client";
import { useToast } from "@/components/ui/use-toast";
import ProblemDescription from '@/components/problem/ProblemDescription';
import ProblemCodeEditor from '@/components/problem/ProblemCodeEditor';

const Problem = () => {
  const { id } = useParams();
  const isMobile = useIsMobile();
  const { toast } = useToast();
  const [code, setCode] = useState('');
  const [isLoading, setIsLoading] = useState(true);
  const [lastSaved, setLastSaved] = useState<Date | null>(null);

  // Load saved code draft or set default code
  useEffect(() => {
    const loadCodeDraft = async () => {
      try {
        const { data: { user } } = await supabase.auth.getUser();
        if (!user) return;

        const { data: draft, error } = await supabase
          .from('code_drafts')
          .select('code, updated_at')
          .eq('problem_id', id)
          .eq('user_id', user.id)
          .maybeSingle();

        if (error) throw error;

        if (draft) {
          setCode(draft.code);
          setLastSaved(new Date(draft.updated_at));
        } else {
          // Set default code if no draft exists
          setCode(() => {
            switch (id) {
              case 'two-sum':
                return `function twoSum(nums, target) {
  // Write your solution here
}`;
              case 'add-two-numbers':
                return `function addTwoNumbers(l1, l2) {
  // Write your solution here
}`;
              case 'longest-substring':
                return `function lengthOfLongestSubstring(s) {
  // Write your solution here
}`;
              case 'median-sorted-arrays':
                return `function findMedianSortedArrays(nums1, nums2) {
  // Write your solution here
}`;
              default:
                return '// Write your solution here';
            }
          });
        }
      } catch (error) {
        console.error('Error loading code draft:', error);
        toast({
          variant: "destructive",
          title: "Error",
          description: "Failed to load saved code",
        });
      } finally {
        setIsLoading(false);
      }
    };

    loadCodeDraft();
  }, [id, toast]);

  // Save code draft when it changes
  const handleCodeChange = async (newCode: string) => {
    setCode(newCode);
    try {
      const { data: { user } } = await supabase.auth.getUser();
      if (!user) return;

      const { error } = await supabase
        .from('code_drafts')
        .upsert({
          user_id: user.id,
          problem_id: id || '',
          code: newCode,
        }, {
          onConflict: 'user_id,problem_id'
        });

      if (error) throw error;
    } catch (error) {
      console.error('Error saving code draft:', error);
      toast({
        variant: "destructive",
        title: "Error",
        description: "Failed to save code draft",
      });
    }
  };

  if (isLoading) {
    return (
      <div className="h-[100dvh] -mt-16 pt-16 flex items-center justify-center">
        <div className="animate-pulse text-muted-foreground">Loading...</div>
      </div>
    );
  }

  if (isMobile) {
    return (
      <div className="h-[100dvh] -mt-16 pt-16">
        <Tabs defaultValue="description" className="h-full">
          <div className="border-b border-border">
            <TabsList className="w-full justify-start">
              <TabsTrigger value="description">Description</TabsTrigger>
              <TabsTrigger value="code">Code</TabsTrigger>
            </TabsList>
          </div>

          <TabsContent value="description" className="h-[calc(100%-49px)] mt-0">
            <ProblemDescription problemId={id || ''} />
          </TabsContent>

          <TabsContent value="code" className="h-[calc(100%-49px)] mt-0">
            <ProblemCodeEditor code={code} onChange={handleCodeChange} lastSaved={lastSaved} />
          </TabsContent>
        </Tabs>
      </div>
    );
  }

  return (
    <div className="h-[100dvh] -mt-16 pt-16 relative">
      <div className="absolute inset-0 pt-16 z-0">
        <ResizablePanelGroup direction="horizontal" className="h-full">
          <ResizablePanel defaultSize={35} minSize={30}>
            <ProblemDescription problemId={id || ''} />
          </ResizablePanel>
          
          <ResizableHandle withHandle />
          
          <ResizablePanel defaultSize={65} minSize={30}>
            <ProblemCodeEditor code={code} onChange={handleCodeChange} lastSaved={lastSaved} />
          </ResizablePanel>
        </ResizablePanelGroup>
      </div>
    </div>
  );
};

export default Problem;