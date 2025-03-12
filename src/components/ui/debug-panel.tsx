import React, { useState, useEffect } from "react";
import { Button } from "./button";
import { Card, CardContent, CardHeader, CardTitle } from "./card";

const DebugPanel = () => {
  const [users, setUsers] = useState<any[]>([]);
  const [isVisible, setIsVisible] = useState(false);

  useEffect(() => {
    // Load users from localStorage
    const loadUsers = () => {
      const storedUsers = localStorage.getItem("registeredUsers");
      if (storedUsers) {
        setUsers(JSON.parse(storedUsers));
      }
    };

    loadUsers();
    // Set up interval to refresh data
    const interval = setInterval(loadUsers, 2000);
    return () => clearInterval(interval);
  }, []);

  const clearUsers = () => {
    localStorage.removeItem("registeredUsers");
    setUsers([]);
  };

  const toggleVisibility = () => {
    setIsVisible(!isVisible);
  };

  if (!isVisible) {
    return (
      <div className="fixed bottom-4 right-4">
        <Button onClick={toggleVisibility} variant="outline" size="sm">
          Show Debug Panel
        </Button>
      </div>
    );
  }

  return (
    <Card className="fixed bottom-4 right-4 w-96 max-h-96 overflow-auto shadow-lg">
      <CardHeader className="pb-2">
        <div className="flex justify-between items-center">
          <CardTitle className="text-sm">
            Debug Panel - Registered Users
          </CardTitle>
          <Button onClick={toggleVisibility} variant="ghost" size="sm">
            Hide
          </Button>
        </div>
      </CardHeader>
      <CardContent>
        <div className="space-y-2">
          {users.length > 0 ? (
            <>
              {users.map((user, index) => (
                <div key={index} className="text-xs p-2 border rounded">
                  <div>
                    <strong>Username:</strong> {user.username}
                  </div>
                  <div>
                    <strong>Email:</strong> {user.email}
                  </div>
                  <div>
                    <strong>Password:</strong> {user.password}
                  </div>
                  <div>
                    <strong>Role:</strong> {user.role}
                  </div>
                  {user.patientId && (
                    <div>
                      <strong>Patient ID:</strong> {user.patientId}
                    </div>
                  )}
                </div>
              ))}
              <Button
                onClick={clearUsers}
                variant="destructive"
                size="sm"
                className="w-full mt-2"
              >
                Clear All Users
              </Button>
            </>
          ) : (
            <div className="text-center text-gray-500 text-sm">
              No registered users
            </div>
          )}
        </div>
      </CardContent>
    </Card>
  );
};

export default DebugPanel;
