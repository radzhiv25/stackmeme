import React from 'react';
import Login from './Login';
import Register from './Register';
import { Tabs, TabsContent, TabsList, TabsTrigger } from './ui/tabs';

const Auth: React.FC = () => {
    return (
        <div className="w-full max-w-md mx-auto">
            <Tabs defaultValue="login" className="w-full">
                <TabsList className="grid w-full grid-cols-2">
                    <TabsTrigger value="login">Sign In</TabsTrigger>
                    <TabsTrigger value="register">Sign Up</TabsTrigger>
                </TabsList>
                <TabsContent value="login">
                    <Login />
                </TabsContent>
                <TabsContent value="register">
                    <Register />
                </TabsContent>
            </Tabs>
        </div>
    );
};

export default Auth;
