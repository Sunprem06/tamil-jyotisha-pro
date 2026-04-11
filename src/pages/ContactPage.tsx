import { Header } from "@/components/layout/Header";
import { Footer } from "@/components/layout/Footer";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { Label } from "@/components/ui/label";
import { Mail, Globe } from "lucide-react";

export default function ContactPage() {
  return (
    <div className="min-h-screen flex flex-col">
      <Header />
      <main className="flex-1 py-8">
        <div className="container max-w-3xl">
          <h1 className="text-3xl font-bold font-display mb-2 text-center">
            <span className="text-gradient-sacred font-tamil">தொடர்பு கொள்ள</span>
          </h1>
          <p className="text-center text-muted-foreground mb-8">Contact Us</p>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            <div className="rasi-card">
              <h3 className="font-bold font-tamil mb-4">செய்தி அனுப்புங்கள்</h3>
              <div className="space-y-4">
                <div><Label className="font-tamil">பெயர்</Label><Input placeholder="உங்கள் பெயர்" /></div>
                <div><Label className="font-tamil">மின்னஞ்சல்</Label><Input type="email" placeholder="email@example.com" /></div>
                <div><Label className="font-tamil">செய்தி</Label><Textarea placeholder="உங்கள் செய்தியை எழுதுங்கள்" rows={4} /></div>
                <Button variant="sacred" className="w-full font-tamil">அனுப்பு</Button>
              </div>
            </div>
            <div className="rasi-card">
              <h3 className="font-bold font-tamil mb-4">நிறுவன விவரங்கள்</h3>
              <div className="space-y-4">
                <div className="flex items-center gap-3">
                  <Globe className="h-5 w-5 text-primary" />
                  <div>
                    <p className="font-bold">Maanagarram Hi Tech Solutions</p>
                    <a href="https://mhtsdigixr.com" target="_blank" rel="noopener noreferrer" className="text-sm text-primary hover:underline">mhtsdigixr.com</a>
                  </div>
                </div>
                <div className="flex items-center gap-3">
                  <Mail className="h-5 w-5 text-primary" />
                  <p className="text-sm">contact@mhtsdigixr.com</p>
                </div>
                <div className="bg-muted/50 rounded-lg p-4 mt-4">
                  <p className="text-sm font-tamil">© {new Date().getFullYear()} All Rights Reserved</p>
                  <p className="text-sm font-tamil">@ Maanagarram Hi Tech Solutions</p>
                </div>
              </div>
            </div>
          </div>
        </div>
      </main>
      <Footer />
    </div>
  );
}
