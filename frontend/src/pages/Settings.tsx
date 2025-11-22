
import { Save } from "lucide-react";
import { AppLayout } from "@/components/layout/AppLayout";
import { Button } from "@/components/ui/button";
import { Card } from "@/components/ui/card";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";

const Settings = () => {
  return (
    <>
      <div className="mb-6">
        <h1 className="text-2xl font-bold tracking-tight">Settings</h1>
        <p className="text-muted-foreground">
          Manage your account and application preferences
        </p>
      </div>

      <Tabs defaultValue="profile" className="space-y-4">
        <TabsList>
          <TabsTrigger value="profile">Profile</TabsTrigger>
          <TabsTrigger value="password">Password</TabsTrigger>
          <TabsTrigger value="appearance">Appearance</TabsTrigger>
          <TabsTrigger value="notifications">Notifications</TabsTrigger>
        </TabsList>

        <TabsContent value="profile">
          <Card className="p-6">
            <h3 className="text-lg font-medium mb-4">Profile Settings</h3>
            <div className="border rounded-md p-6 flex items-center justify-center h-[300px] text-muted-foreground">
              Profile settings form placeholder
            </div>
            <div className="mt-4 flex justify-end">
              <Button>
                <Save className="h-4 w-4 mr-2" />
                Save Changes
              </Button>
            </div>
          </Card>
        </TabsContent>

        <TabsContent value="password">
          <Card className="p-6">
            <h3 className="text-lg font-medium mb-4">Change Password</h3>
            <div className="border rounded-md p-6 flex items-center justify-center h-[300px] text-muted-foreground">
              Password change form placeholder
            </div>
            <div className="mt-4 flex justify-end">
              <Button>
                <Save className="h-4 w-4 mr-2" />
                Update Password
              </Button>
            </div>
          </Card>
        </TabsContent>

        <TabsContent value="appearance">
          <Card className="p-6">
            <h3 className="text-lg font-medium mb-4">Appearance</h3>
            <div className="border rounded-md p-6 flex items-center justify-center h-[300px] text-muted-foreground">
              Appearance settings placeholder
            </div>
            <div className="mt-4 flex justify-end">
              <Button>
                <Save className="h-4 w-4 mr-2" />
                Save Changes
              </Button>
            </div>
          </Card>
        </TabsContent>

        <TabsContent value="notifications">
          <Card className="p-6">
            <h3 className="text-lg font-medium mb-4">Notification Preferences</h3>
            <div className="border rounded-md p-6 flex items-center justify-center h-[300px] text-muted-foreground">
              Notification settings placeholder
            </div>
            <div className="mt-4 flex justify-end">
              <Button>
                <Save className="h-4 w-4 mr-2" />
                Save Changes
              </Button>
            </div>
          </Card>
        </TabsContent>
      </Tabs>
    </>
  );
};

export default Settings;
