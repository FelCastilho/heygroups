import { useEffect, useState } from 'react';
import { Text, View, StyleSheet } from 'react-native';

import auth from '@react-native-firebase/auth';
import firestore from '@react-native-firebase/firestore';

export default function Messages({ route }) {

  const { thread } = route.params;
  const [ messages, setMessages ] = useState([]);

  const user = auth().currentUser.toJSON();

  useEffect(() => {

    const unSubscriberListener = firestore().collection('MESSAGE_THREADS')
    .doc(thread._id)
    .collection('MESSAGES')
    .orderBy('createdAt', 'desc')
    .onSnapshot( querySnapshot => { 
    //QuerySnapshot representa os elementos dentro de messages
      const messages = querySnapshot.docs.map( doc => {
        const firebaseData = doc.data();

        const data = {
          _id: doc.id,
          text: '',
          createdAt: firestore.FieldValue.serverTimestamp(),
          ...firebaseData,
        }

        if(!firebaseData.system){
          data.user = {
            ...firebaseData.user,
            name: firebaseData.user.displayName
          }
        }

        return data;
      })

      setMessages(messages);
      console.log(messages)
    })

    //Desmontando o componente ao sair da tela
    return () => unSubscriberListener()

  }, [])

  return (
    <View>
      <Text>Tela de mensagens</Text>
    </View>
  );
}

const styles = StyleSheet.create({

})