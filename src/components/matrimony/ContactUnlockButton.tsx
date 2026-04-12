import { useState, useEffect } from "react";
import { useAuth } from "@/contexts/AuthContext";
import { supabase } from "@/integrations/supabase/client";
import { Button } from "@/components/ui/button";
import { useToast } from "@/hooks/use-toast";
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogDescription, DialogFooter } from "@/components/ui/dialog";
import { Lock, Unlock, CreditCard } from "lucide-react";

interface ContactUnlockButtonProps {
  targetUserId: string;
  targetName: string;
  creditCost?: number;
}

export function ContactUnlockButton({ targetUserId, targetName, creditCost = 10 }: ContactUnlockButtonProps) {
  const { user } = useAuth();
  const { toast } = useToast();
  const [open, setOpen] = useState(false);
  const [unlocked, setUnlocked] = useState(false);
  const [loading, setLoading] = useState(false);
  const [balance, setBalance] = useState<number | null>(null);
  const [contactInfo, setContactInfo] = useState<{ phone: string | null; displayName: string | null } | null>(null);

  // Check unlock status on mount
  useEffect(() => {
    if (!user || user.id === targetUserId) return;
    supabase
      .from("contact_unlocks")
      .select("id")
      .eq("requester_id", user.id)
      .eq("target_id", targetUserId)
      .eq("revoked", false)
      .maybeSingle()
      .then(({ data }) => {
        if (data) {
          setUnlocked(true);
          // Fetch contact info
          supabase.from("profiles").select("phone, display_name").eq("user_id", targetUserId).maybeSingle()
            .then(({ data: profile }) => {
              if (profile) setContactInfo({ phone: profile.phone, displayName: profile.display_name });
            });
        }
      });
  }, [user, targetUserId]);

  async function checkUnlock() {
    if (!user) {
      toast({ title: "உள்நுழையவும்", description: "Please sign in to unlock contacts", variant: "destructive" });
      return;
    }

    if (user.id === targetUserId) {
      toast({ title: "This is your own profile", variant: "destructive" });
      return;
    }

    // Check credit balance
    const { data: credits } = await supabase
      .from("credits")
      .select("balance")
      .eq("user_id", user.id)
      .maybeSingle();

    setBalance(credits?.balance ?? 0);
    setOpen(true);
  }

  async function handleUnlock() {
    if (!user) return;
    setLoading(true);

    const currentBalance = balance ?? 0;
    if (currentBalance < creditCost) {
      toast({ title: "Insufficient credits", description: `You need ${creditCost} credits. Current balance: ${currentBalance}`, variant: "destructive" });
      setLoading(false);
      return;
    }

    // Use a server-side approach: insert unlock record first (RLS validates requester_id = auth.uid)
    // The credit deduction should ideally be atomic, but we validate balance before proceeding
    
    // Re-check balance to prevent race condition
    const { data: freshCredits } = await supabase
      .from("credits")
      .select("balance")
      .eq("user_id", user.id)
      .maybeSingle();

    const freshBalance = freshCredits?.balance ?? 0;
    if (freshBalance < creditCost) {
      toast({ title: "Insufficient credits", description: "Balance changed. Please try again.", variant: "destructive" });
      setLoading(false);
      return;
    }

    // Create unlock record
    const { error } = await supabase.from("contact_unlocks").insert({
      requester_id: user.id,
      target_id: targetUserId,
      credits_spent: creditCost,
      consent_given: true,
    });

    if (error) {
      toast({ title: "Error", description: error.message, variant: "destructive" });
      setLoading(false);
      return;
    }

    // Deduct credits
    await supabase
      .from("credits")
      .update({ balance: freshBalance - creditCost })
      .eq("user_id", user.id);

    // Log transaction
    await supabase.from("credit_transactions").insert({
      user_id: user.id,
      amount: -creditCost,
      type: "contact_unlock",
      description: `Contact unlock for ${targetName}`,
      reference_id: targetUserId,
    });

    // Audit log
    await supabase.from("audit_logs").insert({
      user_id: user.id,
      action: "contact_unlock",
      entity_type: "contact_unlocks",
      entity_id: targetUserId,
      details: { credits_spent: creditCost, target_name: targetName },
    });

    // Fetch contact info
    const { data: profile } = await supabase.from("profiles").select("phone, display_name").eq("user_id", targetUserId).maybeSingle();
    if (profile) setContactInfo({ phone: profile.phone, displayName: profile.display_name });

    setUnlocked(true);
    toast({ title: "தொடர்பு தகவல் திறக்கப்பட்டது!", description: "Contact info unlocked successfully" });
    setLoading(false);
    setOpen(false);
  }

  if (!user || user.id === targetUserId) return null;

  if (unlocked) {
    return (
      <div className="flex flex-col gap-1">
        <Button variant="outline" size="sm" className="gap-2">
          <Unlock className="h-4 w-4 text-green-600" />
          Contact Unlocked
        </Button>
        {contactInfo && (
          <div className="text-xs text-muted-foreground px-2">
            {contactInfo.displayName && <span className="block">{contactInfo.displayName}</span>}
            {contactInfo.phone && <span className="block">📞 {contactInfo.phone}</span>}
            {!contactInfo.phone && <span className="block text-amber-600">Phone not provided</span>}
          </div>
        )}
      </div>
    );
  }

  return (
    <>
      <Button onClick={checkUnlock} size="sm" className="gap-2">
        <Lock className="h-4 w-4" />
        Unlock Contact ({creditCost} credits)
      </Button>

      <Dialog open={open} onOpenChange={setOpen}>
        <DialogContent>
          <DialogHeader>
            <DialogTitle className="font-tamil">தொடர்பு தகவலை திறக்கவா?</DialogTitle>
            <DialogDescription>
              Unlock contact details for <strong>{targetName}</strong>
            </DialogDescription>
          </DialogHeader>
          <div className="py-4 space-y-3">
            <div className="flex items-center justify-between p-3 bg-muted rounded-lg">
              <span className="text-sm">Your balance</span>
              <span className="font-semibold flex items-center gap-1"><CreditCard className="h-4 w-4" />{balance} credits</span>
            </div>
            <div className="flex items-center justify-between p-3 bg-muted rounded-lg">
              <span className="text-sm">Cost</span>
              <span className="font-semibold text-destructive">-{creditCost} credits</span>
            </div>
            {(balance ?? 0) < creditCost && (
              <p className="text-sm text-destructive">Insufficient credits. Please purchase more credits.</p>
            )}
          </div>
          <DialogFooter>
            <Button variant="outline" onClick={() => setOpen(false)}>Cancel</Button>
            <Button onClick={handleUnlock} disabled={loading || (balance ?? 0) < creditCost}>
              {loading ? "Processing..." : "Confirm Unlock"}
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>
    </>
  );
}
