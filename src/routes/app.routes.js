import React from "react";
import { createNativeStackNavigator } from "@react-navigation/native-stack";

import SignIn from "../pages/signIn";
import Chatroom from "../pages/chatroom";

const AppStack = createNativeStackNavigator();

function AppRoutes(){
    return(
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

        </AppStack.Navigator>
    )
}

export default AppRoutes;