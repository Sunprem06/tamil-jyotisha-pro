import { useState } from "react";
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

  async function checkUnlock() {
    if (!user) return;

    // Check if already unlocked
    const { data: existing } = await supabase
      .from("contact_unlocks")
      .select("id")
      .eq("requester_id", user.id)
      .eq("target_id", targetUserId)
      .eq("revoked", false)
      .maybeSingle();

    if (existing) {
      setUnlocked(true);
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

    // Deduct credits
    const { error: creditError } = await supabase
      .from("credits")
      .update({ balance: currentBalance - creditCost })
      .eq("user_id", user.id);

    if (creditError) {
      toast({ title: "Error", description: creditError.message, variant: "destructive" });
      setLoading(false);
      return;
    }

    // Log transaction
    await supabase.from("credit_transactions").insert({
      user_id: user.id,
      amount: -creditCost,
      type: "contact_unlock",
      description: `Contact unlock for ${targetName}`,
      reference_id: targetUserId,
    });

    // Create unlock record
    const { error } = await supabase.from("contact_unlocks").insert({
      requester_id: user.id,
      target_id: targetUserId,
      credits_spent: creditCost,
      consent_given: true,
    });

    if (error) {
      toast({ title: "Error", description: error.message, variant: "destructive" });
    } else {
      // Log to audit
      await supabase.from("audit_logs").insert({
        user_id: user.id,
        action: "contact_unlock",
        entity_type: "contact_unlocks",
        entity_id: targetUserId,
        details: { credits_spent: creditCost, target_name: targetName },
      });

      setUnlocked(true);
      toast({ title: "தொடர்பு தகவல் திறக்கப்பட்டது!", description: "Contact info unlocked successfully" });
    }

    setLoading(false);
    setOpen(false);
  }

  if (unlocked) {
    return (
      <Button variant="outline" size="sm" className="gap-2">
        <Unlock className="h-4 w-4 text-green-600" />
        Contact Unlocked
      </Button>
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
