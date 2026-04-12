import { useState } from "react";
import { useNavigate } from "react-router-dom";
import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { useAuth } from "@/contexts/AuthContext";
import { supabase } from "@/integrations/supabase/client";
import { useToast } from "@/hooks/use-toast";
import { Check, Heart, Star } from "lucide-react";

interface Props {
  templeId: number;
  templeNameTamil: string;
}

export function VisitWishlistButtons({ templeId, templeNameTamil }: Props) {
  const { user } = useAuth();
  const { toast } = useToast();
  const navigate = useNavigate();
  const queryClient = useQueryClient();
  const [showVisitForm, setShowVisitForm] = useState(false);
  const [rating, setRating] = useState(0);
  const [notes, setNotes] = useState("");
  const [visitDate, setVisitDate] = useState(new Date().toISOString().split("T")[0]);

  const { data: existingVisit } = useQuery({
    queryKey: ["visit-check", templeId, user?.id],
    queryFn: async () => {
      if (!user) return null;
      const { data } = await supabase.from("temple_visits").select("id").eq("user_id", user.id).eq("temple_id", templeId).maybeSingle();
      return data;
    },
    enabled: !!user,
  });

  const { data: existingWish } = useQuery({
    queryKey: ["wish-check", templeId, user?.id],
    queryFn: async () => {
      if (!user) return null;
      const { data } = await supabase.from("temple_wishlist").select("id").eq("user_id", user.id).eq("temple_id", templeId).maybeSingle();
      return data;
    },
    enabled: !!user,
  });

  const addVisit = useMutation({
    mutationFn: async () => {
      if (!user) return;
      const { error } = await supabase.from("temple_visits").insert({
        user_id: user.id,
        temple_id: templeId,
        temple_name_tamil: templeNameTamil,
        visited_date: visitDate,
        rating: rating || null,
        visit_notes: notes || null,
      });
      if (error) throw error;
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["visit-check", templeId] });
      queryClient.invalidateQueries({ queryKey: ["temple-visits"] });
      setShowVisitForm(false);
      toast({ title: "யாத்திரை பதிவேட்டில் சேர்க்கப்பட்டது! 🙏" });
    },
    onError: () => toast({ title: "பிழை ஏற்பட்டது", variant: "destructive" }),
  });

  const toggleWishlist = useMutation({
    mutationFn: async () => {
      if (!user) return;
      if (existingWish) {
        await supabase.from("temple_wishlist").delete().eq("id", existingWish.id);
      } else {
        await supabase.from("temple_wishlist").insert({
          user_id: user.id,
          temple_id: templeId,
          temple_name_tamil: templeNameTamil,
        });
      }
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["wish-check", templeId] });
      queryClient.invalidateQueries({ queryKey: ["temple-wishlist"] });
    },
  });

  const handleVisitClick = () => {
    if (!user) {
      toast({ title: "யாத்திரை பதிவேட்டுக்கு உள்நுழைக" });
      navigate("/auth");
      return;
    }
    if (existingVisit) return;
    setShowVisitForm(true);
  };

  const handleWishClick = () => {
    if (!user) {
      toast({ title: "உள்நுழைக" });
      navigate("/auth");
      return;
    }
    toggleWishlist.mutate();
  };

  return (
    <div className="space-y-3">
      <div className="flex gap-2">
        <Button
          variant={existingVisit ? "secondary" : "sacred"}
          size="sm"
          className="font-tamil"
          onClick={handleVisitClick}
          disabled={!!existingVisit}
        >
          <Check className="h-4 w-4 mr-1" />
          {existingVisit ? "சென்றுள்ளேன் ✓" : "நான் இங்கு சென்றேன்"}
        </Button>
        <Button
          variant="ghost"
          size="sm"
          className="font-tamil"
          onClick={handleWishClick}
        >
          <Heart className={`h-4 w-4 mr-1 ${existingWish ? "fill-red-500 text-red-500" : ""}`} />
          {existingWish ? "பட்டியலில் உள்ளது" : "பட்டியலில் சேர்"}
        </Button>
      </div>

      {showVisitForm && (
        <div className="p-4 rounded-lg border border-primary/20 bg-primary/5 space-y-3">
          <div>
            <label className="text-xs font-tamil text-foreground">தேதி</label>
            <Input type="date" value={visitDate} onChange={(e) => setVisitDate(e.target.value)} className="h-9" />
          </div>
          <div>
            <label className="text-xs font-tamil text-foreground">மதிப்பீடு</label>
            <div className="flex gap-1 mt-1">
              {[1, 2, 3, 4, 5].map((s) => (
                <button key={s} onClick={() => setRating(s)} className="focus:outline-none">
                  <Star className={`h-5 w-5 ${s <= rating ? "text-amber-500 fill-amber-500" : "text-gray-300"}`} />
                </button>
              ))}
            </div>
          </div>
          <div>
            <label className="text-xs font-tamil text-foreground">குறிப்புகள்</label>
            <Input placeholder="உங்கள் அனுபவம்..." value={notes} onChange={(e) => setNotes(e.target.value)} className="font-tamil h-9" />
          </div>
          <div className="flex gap-2">
            <Button size="sm" className="font-tamil" onClick={() => addVisit.mutate()} disabled={addVisit.isPending}>பதிவு செய்</Button>
            <Button variant="ghost" size="sm" onClick={() => setShowVisitForm(false)} className="font-tamil">ரத்து</Button>
          </div>
        </div>
      )}
    </div>
  );
}
