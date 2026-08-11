"use client";

import { useEffect, useState } from "react";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import MfaSecurityCard from "@/components/auth/MfaSecurityCard";
import PasswordCard from "./PasswordCard";
import NotificationPreferences from "./NotificationPreferences";
import { Bell, ShieldCheck } from "lucide-react";

/**
 * Account settings for every shell — /dashboard, /panel and /admin all render
 * this. Security (MFA + password) moved here off the profile pages so there is
 * one place to change how the account is protected.
 *
 * ponytail: the tab deep-link is the URL hash, not a search param — no
 * Suspense boundary needed for it.
 */
export default function SettingsView() {
  const [tab, setTab] = useState("security");

  useEffect(() => {
    if (window.location.hash === "#notifications") setTab("notifications");
  }, []);

  return (
    <div className="space-y-6 max-w-3xl">
      <div>
        <h1 className="text-2xl font-bold tracking-tight">Settings</h1>
        <p className="mt-1 text-sm text-muted-foreground">
          Security and notification preferences for your account.
        </p>
      </div>

      <Tabs value={tab} onValueChange={setTab} className="gap-6">
        <TabsList className="h-10 p-1">
          <TabsTrigger value="security" className="px-4">
            <ShieldCheck className="h-4 w-4" />
            Security
          </TabsTrigger>
          <TabsTrigger value="notifications" className="px-4">
            <Bell className="h-4 w-4" />
            Notifications
          </TabsTrigger>
        </TabsList>

        <TabsContent value="security" className="space-y-6">
          <MfaSecurityCard />
          <PasswordCard />
        </TabsContent>

        <TabsContent value="notifications" className="space-y-4">
          <p className="text-sm text-muted-foreground">
            Choose what reaches you, and where. Locked rows are part of your
            account record and always send.
          </p>
          <NotificationPreferences />
        </TabsContent>
      </Tabs>
    </div>
  );
}
