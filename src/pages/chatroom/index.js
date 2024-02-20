import { Button, Text, View, TouchableOpacity, TextInput } from 'react-native';

import { useNavigation } from '@react-navigation/native';

export default function Chatroom() {

  const navigation = useNavigation();

  return (
    <View>
      
      <Text>Tela Chatroom</Text>

      <Button
        title='Login'
        onPress={() => navigation.navigate('SignIn')}
      />
    </View>
  );
}