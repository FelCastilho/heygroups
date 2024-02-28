import React, { useEffect, useState } from 'react';
import { View, Text, StyleSheet, SafeAreaView, TouchableOpacity, FlatList, Modal, ActivityIndicator, Alert } from 'react-native';

import auth from '@react-native-firebase/auth';
import firestore from '@react-native-firebase/firestore';

import { useNavigation, useIsFocused } from '@react-navigation/native';

import MaterialIcons from 'react-native-vector-icons/MaterialIcons';

import FabButton from '../../components/fabButton';
import ModalNewRoom from '../../components/modalNewRoom';
import ChatList from '../../components/chatList';

export default function ChatRoom() {

  const navigation = useNavigation();
  const isFocused = useIsFocused();

  const [user, setUser] = useState(null);
  const [modalVisible, setModalVisible] = useState(false);
  const [threads, setThreads] = useState([]);
  const [loading, setLoading] = useState(true);
  //Fazendo uma verificação para quando algum grupo for atualizado
  //Colocar threads como dependencia no useEffect também funciona
  const [ updateScreen, setUpdateScreen ] = useState(false);

  useEffect(() => {

    //Verificando se tem algum usuário logado
    const hasUser = auth().currentUser ? auth().currentUser.toJSON() : null;

    setUser(hasUser);

  }, [isFocused]) //Quando a tela for TRUE

  //Buscando os chats no firestore
  useEffect(() => {

    let isActive = true;

    function getChats() {

      firestore().collection('MESSAGE_THREADS')
        .orderBy('lastMessage.createdAt', 'desc').limit(10).get()
        .then(snapshot => {

          const threads = snapshot.docs.map(documentSnapshot => {
            return {
              _id: documentSnapshot.id,
              name: '',
              lastMessage: { text: '' },
              ...documentSnapshot.data()
            }
          })

          if (isActive) {
            setThreads(threads);
            setLoading(false);

            //Retorna os grupos
            //console.log(threads)
          }

        })

    }

    getChats();

    //Quando o componente for desmontado
    //(Evita perder performance com o useEffect)
    return () => isActive = false;

  }, [isFocused, updateScreen])//Quando o componente estiver em foco

  function handleSignOut() {
    auth()
      .signOut()
      .then(() => {
        setUser(null);
        navigation.navigate("SignIn")
      })
      .catch(() => {
        console.log("NAO POSSUI NENHUM USUARIO")
      })
  }

  function deleteRoom(ownerId, idRoom){
    //Caso esteja tentando deletar uma sala onde não seja o dono
    if(ownerId !== user?.uid) return;

    Alert.alert(
      "Atenção!",
      "Você tem certeza que deseja deletar essa sala?",
      [
        {
          text: 'Cancel',
          onPress: () => {},
          style: 'cancel'
        },
        {
          text: 'Ok',
          onPress: () => handleDeleteRoom(idRoom),
        }
      ]
    )

  }

  async function handleDeleteRoom(idRoom){
    await firestore().collection('MESSAGE_THREADS').doc(idRoom).delete();
    setUpdateScreen(!updateScreen);
  }

  if(loading){
    return(
      <ActivityIndicator size='large' color="555"/>
    )
  }

  return (

    <SafeAreaView style={styles.container}>

      <View style={styles.headerRoom}>

        <View style={styles.headerRoomLeft}>

          {user && (
            <TouchableOpacity onPress={handleSignOut}>
              <MaterialIcons name="arrow-back" size={28} color="#FFF" />
            </TouchableOpacity>
          )}

          <Text style={styles.title}>Grupos</Text>

        </View>

        <TouchableOpacity>
          <MaterialIcons name="search" size={28} color="#FFF" />
        </TouchableOpacity>

      </View>

      <FlatList
      data={threads}
      keyExtractor={item => item._id} //id de cada sala
      showsVerticalScrollIndicator={false}
      renderItem={({ item }) => (
        <ChatList data={item} deleteRoom={() => deleteRoom(item.owner, item._id)} userStatus={user}/>
      )}
      />

      <FabButton setVisible={() => setModalVisible(true)} userStatus={user} />

      <Modal visible={modalVisible} animationType='fade' transparent={true}>

        <ModalNewRoom 
          setVisible={() => setModalVisible(false)} 
          setUpdateScreen={() => setUpdateScreen(!updateScreen)}
        />

      </Modal>

    </SafeAreaView>

  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#fff'
  },
  headerRoom: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    paddingTop: 40,
    paddingBottom: 20,
    paddingHorizontal: 10,
    backgroundColor: '#2E54D4',
    borderBottomRightRadius: 20,
    borderBottomLeftRadius: 20,
  },
  headerRoomLeft: {
    flexDirection: 'row',
    alignItems: 'center'
  },
  title: {
    fontSize: 26,
    fontWeight: 'bold',
    color: '#FFF',
    paddingLeft: 10,
  }
})