import { useState } from 'react';
import { Text, View, StyleSheet, TextInput, SafeAreaView, Platform, TouchableOpacity, Keyboard } from 'react-native';

import { useNavigation } from '@react-navigation/native';

import auth from '@react-native-firebase/auth';

export default function SignIn() {

  const navigation = useNavigation();
  const [ name, setName ] = useState('');
  const [ email, setEmail ] = useState('');
  const [ password, setPassword ] = useState('');
  const [ type, setType ] = useState(false); //False Login || True = Register


  function handleLogin(){
    if(type){
      //Cadastrar usuário

      if(name === '' || password === '' || email === '') return;

      auth().createUserWithEmailAndPassword(email, password)
      .then((snapshot) => {//Na aula é usado user.user, para evitar confusão, usei snapshot.
      
        snapshot.user.updateProfile({
          //Esse user veio de dentro da snapshot que recebe várias propriedades, o mesmo vale para displayName
          displayName: name,
        })
        .then(() => {
          navigation.goBack();
        })
      })
      .catch((err) => {
        console.log(err)
      }) 

    }else{
      //Logar usuário

      auth().signInWithEmailAndPassword(email, password)
      .then(() => {
        navigation.goBack();
      })
      .catch( err => {
        console.log( err )
      })

    }
  }

  return (

    <SafeAreaView style={styles.container}>

      <Text style={styles.logo}>HeyGrupos</Text>
      <Text style={{ marginBottom: 20, color: '#121212' }}>Ajude, colabore, faça networking</Text>

      {type && (
        <TextInput
        style={styles.input}
        value={name}
        onChangeText={(text) => setName(text)}
        placeholder='Qual seu nome?'
        placeholderTextColor='#99999b'
        />
      )}

      <TextInput
        style={styles.input}
        value={email}
        onChangeText={(text) => setEmail(text)}
        placeholder='Digite seu email'
        placeholderTextColor='#99999b'
      />

      <TextInput
        style={styles.input}
        value={password}
        onChangeText={(text) => setPassword(text)}
        placeholder='Digite sua senha'
        placeholderTextColor='#99999b'
        secureTextEntry={true}
      />

      <TouchableOpacity 
      style={[styles.buttonLogin, { backgroundColor: type ? '#f53745' : '#57dd83'}]}
      onPress={handleLogin}
      >
        <Text style={styles.buttonText}>
          {type ? 'Cadastrar' : 'Acessar'}
        </Text>
      </TouchableOpacity>

      <TouchableOpacity onPress={() => setType(!type)}>
        <Text style={{color: '#121212'}}>
          {type ? 'Já possuo uma conta' : 'Criar uma nova conta'}
        </Text>
      </TouchableOpacity>

    </SafeAreaView>
  );
}

const styles = StyleSheet.create({

  container: {
    flex: 1,
    alignItems: 'center',
    backgroundColor: '#fff',
  },
  logo:{
    marginTop: Platform.OS === 'android'? 55 : 80,
    fontSize: 28,
    fontWeight: 'bold',
    color: '#121212'
  },
  input:{
    color: '#121212',
    backgroundColor: '#ebebeb',
    width: '90%',
    borderRadius: 6,
    marginBottom: 10,
    paddingHorizontal: 8,
    height: 50,
  },
  buttonLogin:{
    width: '90%',
    height: 50,
    justifyContent: 'center',
    alignItems: 'center',
    marginBottom: 10,
    borderRadius: 6,
  },
  buttonText:{
    color: '#fff',
    fontWeight: 'bold',
    fontSize: 19
  }

})