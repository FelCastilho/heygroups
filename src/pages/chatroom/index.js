import { Text, View, SafeAreaView, TouchableOpacity, FlatList, StyleSheet } from 'react-native';

import { useNavigation } from '@react-navigation/native';

import auth from '@react-native-firebase/auth';

import MaterialIcons from 'react-native-vector-icons/MaterialIcons';

export default function Chatroom() {

  const navigation = useNavigation();

  function handleSignOut(){
    auth().signOut()
    .then(() => {
      navigation.navigate('SignIn')
    })
    .catch(err => console.log(err))
  }

  return (
    <SafeAreaView>

      <View style={styles.headerRoom}>

        <View style={styles.headerRoomLeft}>

          <TouchableOpacity onPress={handleSignOut}>
            <MaterialIcons name="arrow-back" size={28} color="#fff"/>
          </TouchableOpacity>

          <Text style={styles.title}>Grupos</Text>
          
        </View>

        
        <TouchableOpacity>
          <MaterialIcons name="search" size={28} color="#fff"/>
        </TouchableOpacity>

      </View>

    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  container:{
    flex: 1
  },
  headerRoom:{
    flexDirection: 'row',
    justifyContent: 'space-between',
    paddingTop: 40,
    paddingBottom: 20,
    paddingHorizontal: 10,
    backgroundColor: '#2e54d4',
    borderBottomRightRadius: 20,
    borderBottomLeftRadius: 20,
  },
  headerRoomLeft:{
    flexDirection: 'row',
    alignItems: 'center'
  },
  title:{
    fontSize: 26,
    fontWeight: 'bold',
    color: '#fff',
    paddingLeft: 10,
  }
})