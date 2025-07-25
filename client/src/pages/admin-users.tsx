import { useState, useEffect } from "react";
import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { z } from "zod";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Dialog, DialogContent, DialogDescription, DialogHeader, DialogTitle, DialogTrigger } from "@/components/ui/dialog";
import { Form, FormControl, FormField, FormItem, FormLabel, FormMessage } from "@/components/ui/form";
import { Alert, AlertDescription } from "@/components/ui/alert";
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table";
import { UserPlus, Edit, Trash2, AlertCircle, Users } from "lucide-react";
import { apiRequest } from "@/lib/queryClient";
import { useToast } from "@/hooks/use-toast";

const userSchema = z.object({
  username: z.string().min(1, "Benutzername ist erforderlich"),
  password: z.string().min(4, "Passwort muss mindestens 4 Zeichen haben"),
});

const updateUserSchema = z.object({
  username: z.string().min(1, "Benutzername ist erforderlich").optional(),
  password: z.string().min(4, "Passwort muss mindestens 4 Zeichen haben").optional(),
});

type UserFormData = z.infer<typeof userSchema>;
type UpdateUserFormData = z.infer<typeof updateUserSchema>;

interface User {
  id: number;
  username: string;
}

function AdminUsersContent() {
  const [createDialogOpen, setCreateDialogOpen] = useState(false);
  const [editDialogOpen, setEditDialogOpen] = useState(false);
  const [editingUser, setEditingUser] = useState<User | null>(null);
  const { toast } = useToast();
  const queryClient = useQueryClient();

  // Fetch users
  const { data: users = [], isLoading } = useQuery<User[]>({
    queryKey: ["/api/admin/users"],
  });

  // Create user mutation
  const createUserMutation = useMutation({
    mutationFn: async (data: UserFormData) => {
      return await apiRequest("/api/admin/users", "POST", data);
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["/api/admin/users"] });
      setCreateDialogOpen(false);
      createForm.reset();
      toast({
        title: "Erfolg",
        description: "Neuer Admin-Benutzer wurde erstellt",
      });
    },
    onError: (error: any) => {
      toast({
        title: "Fehler",
        description: error.message || "Fehler beim Erstellen des Benutzers",
        variant: "destructive",
      });
    },
  });

  // Update user mutation
  const updateUserMutation = useMutation({
    mutationFn: async ({ id, data }: { id: number; data: UpdateUserFormData }) => {
      return await apiRequest(`/api/admin/users/${id}`, "PUT", data);
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["/api/admin/users"] });
      setEditDialogOpen(false);
      setEditingUser(null);
      updateForm.reset();
      toast({
        title: "Erfolg",
        description: "Benutzer wurde aktualisiert",
      });
    },
    onError: (error: any) => {
      toast({
        title: "Fehler",
        description: error.message || "Fehler beim Aktualisieren des Benutzers",
        variant: "destructive",
      });
    },
  });

  // Delete user mutation
  const deleteUserMutation = useMutation({
    mutationFn: async (id: number) => {
      return await apiRequest(`/api/admin/users/${id}`, "DELETE");
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["/api/admin/users"] });
      toast({
        title: "Erfolg",
        description: "Benutzer wurde gelöscht",
      });
    },
    onError: (error: any) => {
      toast({
        title: "Fehler",
        description: error.message || "Fehler beim Löschen des Benutzers",
        variant: "destructive",
      });
    },
  });

  // Forms
  const createForm = useForm<UserFormData>({
    resolver: zodResolver(userSchema),
    defaultValues: {
      username: "",
      password: "",
    },
  });

  const updateForm = useForm<UpdateUserFormData>({
    resolver: zodResolver(updateUserSchema),
    defaultValues: {
      username: "",
      password: "",
    },
  });

  const handleCreateSubmit = (data: UserFormData) => {
    createUserMutation.mutate(data);
  };

  const handleUpdateSubmit = (data: UpdateUserFormData) => {
    if (!editingUser) return;
    
    // Remove empty fields
    const cleanData = Object.fromEntries(
      Object.entries(data).filter(([_, value]) => value !== "")
    );
    
    if (Object.keys(cleanData).length === 0) {
      toast({
        title: "Fehler",
        description: "Mindestens ein Feld muss ausgefüllt werden",
        variant: "destructive",
      });
      return;
    }

    updateUserMutation.mutate({ id: editingUser.id, data: cleanData });
  };

  const handleEdit = (user: User) => {
    setEditingUser(user);
    updateForm.reset({
      username: "",
      password: "",
    });
    setEditDialogOpen(true);
  };

  const handleDelete = (user: User) => {
    if (window.confirm(`Sind Sie sicher, dass Sie den Benutzer "${user.username}" löschen möchten?`)) {
      deleteUserMutation.mutate(user.id);
    }
  };

  if (isLoading) {
    return (
      <div className="container mx-auto p-6">
        <div className="flex items-center gap-2 mb-6">
          <Users className="h-6 w-6" />
          <h1 className="text-2xl font-bold">Admin-Benutzerverwaltung</h1>
        </div>
        <Card>
          <CardContent className="p-6">
            <p>Laden...</p>
          </CardContent>
        </Card>
      </div>
    );
  }

  return (
    <div className="container mx-auto p-6">
      <div className="flex items-center justify-between mb-6">
        <div className="flex items-center gap-2">
          <Users className="h-6 w-6" />
          <h1 className="text-2xl font-bold">Admin-Benutzerverwaltung</h1>
        </div>
        
        <Dialog open={createDialogOpen} onOpenChange={setCreateDialogOpen}>
          <DialogTrigger asChild>
            <Button className="bg-purple-600 hover:bg-purple-700">
              <UserPlus className="h-4 w-4 mr-2" />
              Neuer Admin
            </Button>
          </DialogTrigger>
          <DialogContent>
            <DialogHeader>
              <DialogTitle>Neuen Admin-Benutzer erstellen</DialogTitle>
              <DialogDescription>
                Erstellen Sie einen neuen Admin-Benutzer für das System.
              </DialogDescription>
            </DialogHeader>
            <Form {...createForm}>
              <form onSubmit={createForm.handleSubmit(handleCreateSubmit)} className="space-y-4">
                <FormField
                  control={createForm.control}
                  name="username"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel>Benutzername</FormLabel>
                      <FormControl>
                        <Input placeholder="Admin-Benutzername eingeben" {...field} />
                      </FormControl>
                      <FormMessage />
                    </FormItem>
                  )}
                />
                <FormField
                  control={createForm.control}
                  name="password"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel>Passwort</FormLabel>
                      <FormControl>
                        <Input type="password" placeholder="Sicheres Passwort eingeben" {...field} />
                      </FormControl>
                      <FormMessage />
                    </FormItem>
                  )}
                />
                <div className="flex justify-end gap-2">
                  <Button 
                    type="button" 
                    variant="outline" 
                    onClick={() => setCreateDialogOpen(false)}
                  >
                    Abbrechen
                  </Button>
                  <Button 
                    type="submit" 
                    disabled={createUserMutation.isPending}
                    className="bg-purple-600 hover:bg-purple-700"
                  >
                    {createUserMutation.isPending ? "Erstelle..." : "Erstellen"}
                  </Button>
                </div>
              </form>
            </Form>
          </DialogContent>
        </Dialog>
      </div>

      <Card>
        <CardHeader>
          <CardTitle>Admin-Benutzer ({users.length})</CardTitle>
        </CardHeader>
        <CardContent>
          {users.length === 0 ? (
            <Alert>
              <AlertCircle className="h-4 w-4" />
              <AlertDescription>
                Keine Admin-Benutzer gefunden.
              </AlertDescription>
            </Alert>
          ) : (
            <Table>
              <TableHeader>
                <TableRow>
                  <TableHead>ID</TableHead>
                  <TableHead>Benutzername</TableHead>
                  <TableHead className="text-right">Aktionen</TableHead>
                </TableRow>
              </TableHeader>
              <TableBody>
                {users.map((user) => (
                  <TableRow key={user.id}>
                    <TableCell className="font-medium">{user.id}</TableCell>
                    <TableCell>{user.username}</TableCell>
                    <TableCell className="text-right">
                      <div className="flex justify-end gap-2">
                        <Button
                          variant="outline"
                          size="sm"
                          onClick={() => handleEdit(user)}
                        >
                          <Edit className="h-4 w-4" />
                        </Button>
                        <Button
                          variant="outline"
                          size="sm"
                          onClick={() => handleDelete(user)}
                          disabled={users.length <= 1}
                          className="text-red-600 hover:text-red-700"
                        >
                          <Trash2 className="h-4 w-4" />
                        </Button>
                      </div>
                    </TableCell>
                  </TableRow>
                ))}
              </TableBody>
            </Table>
          )}
        </CardContent>
      </Card>

      {/* Edit Dialog */}
      <Dialog open={editDialogOpen} onOpenChange={setEditDialogOpen}>
        <DialogContent>
          <DialogHeader>
            <DialogTitle>Admin-Benutzer bearbeiten</DialogTitle>
            <DialogDescription>
              Ändern Sie den Benutzernamen oder das Passwort von "{editingUser?.username}".
              Lassen Sie Felder leer, um sie unverändert zu lassen.
            </DialogDescription>
          </DialogHeader>
          <Form {...updateForm}>
            <form onSubmit={updateForm.handleSubmit(handleUpdateSubmit)} className="space-y-4">
              <FormField
                control={updateForm.control}
                name="username"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>Neuer Benutzername (optional)</FormLabel>
                    <FormControl>
                      <Input placeholder="Leer lassen für keine Änderung" {...field} />
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />
              <FormField
                control={updateForm.control}
                name="password"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>Neues Passwort (optional)</FormLabel>
                    <FormControl>
                      <Input type="password" placeholder="Leer lassen für keine Änderung" {...field} />
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />
              <div className="flex justify-end gap-2">
                <Button 
                  type="button" 
                  variant="outline" 
                  onClick={() => setEditDialogOpen(false)}
                >
                  Abbrechen
                </Button>
                <Button 
                  type="submit" 
                  disabled={updateUserMutation.isPending}
                  className="bg-purple-600 hover:bg-purple-700"
                >
                  {updateUserMutation.isPending ? "Aktualisiere..." : "Aktualisieren"}
                </Button>
              </div>
            </form>
          </Form>
        </DialogContent>
      </Dialog>
    </div>
  );
}

export default function AdminUsers() {
  const [isLoggedIn, setIsLoggedIn] = useState(false);
  const [user, setUser] = useState<{id: number, username: string} | null>(null);
  const [isChecking, setIsChecking] = useState(true);

  // Check if user is already logged in
  useEffect(() => {
    const checkSession = async () => {
      try {
        const response = await fetch('/api/admin/session');
        const data = await response.json();
        
        if (data.authenticated) {
          setIsLoggedIn(true);
          setUser(data.user);
        }
      } catch (error) {
        console.log('Session check failed:', error);
      } finally {
        setIsChecking(false);
      }
    };

    checkSession();
  }, []);

  if (isChecking) {
    return (
      <div className="min-h-screen bg-gray-50 flex items-center justify-center">
        <div className="text-center">
          <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-purple-600 mx-auto mb-4"></div>
          <p className="text-gray-600">Session wird überprüft...</p>
        </div>
      </div>
    );
  }

  if (!isLoggedIn) {
    return (
      <div className="min-h-screen bg-gray-50 flex items-center justify-center">
        <div className="text-center">
          <div className="bg-white p-8 rounded-lg shadow-md">
            <h2 className="text-xl font-bold mb-4">Nicht autorisiert</h2>
            <p className="text-gray-600 mb-4">Sie müssen sich erst anmelden, um die Admin-Verwaltung zu nutzen.</p>
            <a href="/admin" className="text-purple-600 hover:text-purple-800">
              ← Zurück zur Admin-Anmeldung
            </a>
          </div>
        </div>
      </div>
    );
  }

  return <AdminUsersContent />;
}