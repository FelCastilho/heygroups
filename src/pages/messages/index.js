import { Text, View } from 'react-native';

export default function Messages({ route }) {

  const { threads } = route.params;

  return (
    <View>
      <Text>Tela de mensagens</Text>
    </View>
  );
}