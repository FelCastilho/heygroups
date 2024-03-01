import React from "react";
import { createNativeStackNavigator } from "@react-navigation/native-stack";

import SignIn from "../pages/signIn";
import Chatroom from "../pages/chatroom";
import Messages from "../pages/messages";
import Search from "../pages/search";

const AppStack = createNativeStackNavigator();

function AppRoutes() {
    return (
        <AppStack.Navigator initialRouteName="Chatroom">

            <AppStack.Screen
                name="SignIn"
                component={SignIn}
                options={{
                    title: 'Faça o login'
                }}
            />

            <AppStack.Screen
                name="Chatroom"
                component={Chatroom}
                options={{
                    headerShown: false,
                }}
            />

            <AppStack.Screen
                name="Messages"
                component={Messages}
                options={({ route }) => ({
                    title: route.params.thread.name
                })}
            />

            <AppStack.Screen
                name="Search"
                component={Search}
                options={{
                    title: 'Procurando algum grupo?'
                }}
            />

        </AppStack.Navigator>
    )
}

export default AppRoutes;