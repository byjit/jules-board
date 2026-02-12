"use client";

import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { getInitials } from "@/lib/utils";

interface SettingsUserProfileProps {
  session: any; // Using any to match usage in original file
}

export function SettingsUserProfile({ session }: SettingsUserProfileProps) {
  return (
    <Card>
      <CardHeader>
        <CardTitle>Profile Settings</CardTitle>
        <CardDescription>Manage your personal account settings.</CardDescription>
      </CardHeader>
      <CardContent>
        <div className="space-y-4">
          <div className="flex items-center gap-4">
            <Avatar className="h-16 w-16">
              <AvatarImage src={session?.user.image ?? null} />
              <AvatarFallback>{getInitials(session?.user.name || "")}</AvatarFallback>
            </Avatar>
            <div>
              <h3 className="text-lg font-medium">{session?.user.name}</h3>
              <p className="text-sm text-muted-foreground">{session?.user.email}</p>
            </div>
          </div>
        </div>
      </CardContent>
    </Card>
  );
}
