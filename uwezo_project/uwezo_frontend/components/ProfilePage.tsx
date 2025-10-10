import { Avatar, AvatarFallback, AvatarImage } from "./ui/avatar";
import { Badge } from "./ui/badge";
import { Button } from "./ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "./ui/card";
import { Input } from "./ui/input";
import { Label } from "./ui/label";
import { StatCard } from "./StatCard";
import { FileText, CheckCircle, Target } from "lucide-react";
import { useState } from "react";

export function ProfilePage() {
  const [isEditing, setIsEditing] = useState(false);
  const [formData, setFormData] = useState({
    name: "John Doe",
    email: "john.doe@uwezo.com",
    phone: "+1 (555) 123-4567",
    department: "Verification Team",
  });

  const handleSave = () => {
    setIsEditing(false);
    // Save logic here
  };

  const handleCancel = () => {
    setIsEditing(false);
    // Reset form data
  };

  return (
    <div className="space-y-6">
      <div>
        <h1>Profile</h1>
        <p className="text-muted-foreground mt-1">Manage your account information and settings</p>
      </div>

      {/* Profile Header */}
      <Card>
        <CardContent className="p-6">
          <div className="flex flex-col md:flex-row gap-6 items-start md:items-center">
            <Avatar className="w-24 h-24">
              <AvatarImage src="" alt="John Doe" />
              <AvatarFallback className="text-2xl">JD</AvatarFallback>
            </Avatar>
            <div className="flex-1">
              <div className="flex items-center gap-3 mb-2">
                <h2>{formData.name}</h2>
                <Badge className="bg-blue-100 text-blue-800 dark:bg-blue-950 dark:text-blue-300">
                  Admin
                </Badge>
              </div>
              <p className="text-muted-foreground">{formData.email}</p>
              <p className="text-sm text-muted-foreground mt-1">{formData.department}</p>
            </div>
            {!isEditing && (
              <Button onClick={() => setIsEditing(true)}>Edit Profile</Button>
            )}
          </div>
        </CardContent>
      </Card>

      {/* Account Statistics */}
      <div>
        <h3 className="mb-4">Account Statistics</h3>
        <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
          <StatCard
            title="Documents Uploaded"
            value="263"
            icon={FileText}
          />
          <StatCard
            title="Successfully Processed"
            value="243"
            icon={CheckCircle}
          />
          <StatCard
            title="Average Accuracy"
            value="94.2%"
            icon={Target}
          />
        </div>
      </div>

      {/* Personal Information */}
      <Card>
        <CardHeader>
          <CardTitle>Personal Information</CardTitle>
        </CardHeader>
        <CardContent>
          <form className="space-y-4">
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div className="space-y-2">
                <Label htmlFor="name">Full Name</Label>
                <Input
                  id="name"
                  value={formData.name}
                  onChange={(e) => setFormData({ ...formData, name: e.target.value })}
                  disabled={!isEditing}
                />
              </div>
              <div className="space-y-2">
                <Label htmlFor="email">Email Address</Label>
                <Input
                  id="email"
                  type="email"
                  value={formData.email}
                  onChange={(e) => setFormData({ ...formData, email: e.target.value })}
                  disabled={!isEditing}
                />
              </div>
              <div className="space-y-2">
                <Label htmlFor="phone">Phone Number</Label>
                <Input
                  id="phone"
                  value={formData.phone}
                  onChange={(e) => setFormData({ ...formData, phone: e.target.value })}
                  disabled={!isEditing}
                />
              </div>
              <div className="space-y-2">
                <Label htmlFor="department">Department</Label>
                <Input
                  id="department"
                  value={formData.department}
                  onChange={(e) => setFormData({ ...formData, department: e.target.value })}
                  disabled={!isEditing}
                />
              </div>
            </div>

            {isEditing && (
              <div className="flex gap-3 pt-4">
                <Button type="button" onClick={handleSave}>Save Changes</Button>
                <Button type="button" variant="outline" onClick={handleCancel}>Cancel</Button>
              </div>
            )}
          </form>
        </CardContent>
      </Card>

      {/* Security Settings */}
      <Card>
        <CardHeader>
          <CardTitle>Security</CardTitle>
        </CardHeader>
        <CardContent className="space-y-4">
          <div>
            <h4 className="mb-2">Password</h4>
            <p className="text-sm text-muted-foreground mb-3">Last changed 3 months ago</p>
            <Button variant="outline">Change Password</Button>
          </div>
          <div className="border-t pt-4">
            <h4 className="mb-2">Two-Factor Authentication</h4>
            <p className="text-sm text-muted-foreground mb-3">Add an extra layer of security to your account</p>
            <Button variant="outline">Enable 2FA</Button>
          </div>
        </CardContent>
      </Card>
    </div>
  );
}
