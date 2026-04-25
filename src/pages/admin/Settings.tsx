import { useEffect, useState } from "react";
import AdminLayout from "@/components/admin/AdminLayout";
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { supabase } from "@/lib/supabase";
import { toast } from "sonner";
import { Save, Loader2, MessageSquare } from "lucide-react";

const Settings = () => {
  const [whatsappNumber, setWhatsappNumber] = useState("");
  const [heroTitle, setHeroTitle] = useState("");
  const [heroSubtitle, setHeroSubtitle] = useState("");
  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);

  useEffect(() => {
    const fetchSettings = async () => {
      const { data, error } = await supabase
        .from('site_settings')
        .select('key, value');
      
      if (data) {
        const whatsapp = data.find(s => s.key === 'whatsapp_number')?.value;
        const title = data.find(s => s.key === 'hero_title')?.value;
        const subtitle = data.find(s => s.key === 'hero_subtitle')?.value;
        
        if (whatsapp) setWhatsappNumber(whatsapp);
        if (title) setHeroTitle(title);
        if (subtitle) setHeroSubtitle(subtitle);
      }
      setLoading(false);
    };

    fetchSettings();
  }, []);

  const handleSave = async () => {
    setSaving(true);
    try {
      const settings = [
        { key: 'whatsapp_number', value: whatsappNumber },
        { key: 'hero_title', value: heroTitle },
        { key: 'hero_subtitle', value: heroSubtitle }
      ];

      const { error } = await supabase
        .from('site_settings')
        .upsert(settings);
      
      if (error) throw error;
      toast.success("Settings saved successfully");
    } catch (error: unknown) {
      const errorMessage = error instanceof Error ? error.message : "An error occurred";
      toast.error(errorMessage);
    } finally {
      setSaving(false);
    }
  };

  return (
    <AdminLayout>
      <div className="space-y-6">
        <div>
          <h1 className="text-3xl font-bold tracking-tight">Settings</h1>
          <p className="text-muted-foreground mt-1">Configure your store's global preferences.</p>
        </div>

        <div className="grid gap-6 max-w-2xl">
          <Card className="shadow-sm">
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <Save className="w-5 h-5 text-primary" />
                Store Configuration
              </CardTitle>
              <CardDescription>
                Manage the main content of your landing page.
              </CardDescription>
            </CardHeader>
            <CardContent className="space-y-6">
              {loading ? (
                <div className="flex justify-center py-4">
                  <Loader2 className="w-6 h-6 animate-spin text-primary" />
                </div>
              ) : (
                <>
                  <div className="space-y-2">
                    <Label htmlFor="whatsapp">WhatsApp Number</Label>
                    <Input 
                      id="whatsapp" 
                      placeholder="8801711763315" 
                      value={whatsappNumber}
                      onChange={(e) => setWhatsappNumber(e.target.value)}
                    />
                    <p className="text-xs text-muted-foreground">Include country code without the + sign.</p>
                  </div>

                  <div className="space-y-2">
                    <Label htmlFor="hero-title">Hero Title</Label>
                    <Input 
                      id="hero-title" 
                      placeholder="National Bulk Sales" 
                      value={heroTitle}
                      onChange={(e) => setHeroTitle(e.target.value)}
                    />
                  </div>

                  <div className="space-y-2">
                    <Label htmlFor="hero-subtitle">Hero Subtitle</Label>
                    <textarea 
                      id="hero-subtitle" 
                      className="w-full min-h-[100px] p-3 rounded-md border bg-background text-sm"
                      placeholder="Enter hero subtitle..." 
                      value={heroSubtitle}
                      onChange={(e) => setHeroSubtitle(e.target.value)}
                    />
                  </div>
                </>
              )}
            </CardContent>
            <CardFooter className="border-t bg-muted/20 px-6 py-4">
              <Button onClick={handleSave} disabled={saving || loading} className="gap-2">
                {saving ? <Loader2 className="w-4 h-4 animate-spin" /> : <Save className="w-4 h-4" />}
                Save Changes
              </Button>
            </CardFooter>
          </Card>
        </div>
      </div>
    </AdminLayout>
  );
};

export default Settings;
