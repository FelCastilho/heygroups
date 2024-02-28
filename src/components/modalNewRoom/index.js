import { useState } from 'react';
import { View, Text, StyleSheet, TextInput, TouchableWithoutFeedback, TouchableOpacity, Alert } from 'react-native';

import firestore from '@react-native-firebase/firestore';
import auth from '@react-native-firebase/auth';

export default function ModalNewRoom({ setVisible, setUpdateScreen }) {

    const [ roomName, setRoomName ] = useState('');

    const user = auth().currentUser.toJSON();


    //Criando a sala
    function handleButtonCreate(){

        if(roomName === '') return;

        //Limitando a criação de apenas 4 grupos por usuário;

        firestore().collection('MESSAGE_THREADS').get()
        .then( snapshot => {

            let myThreads = 0;

            snapshot.docs.map( docItem => {
                //Verificando se o id da pessoa que ta criando a sala é o mesmo do que está logado;
                if(docItem.data().owner === user.uid){
                    myThreads += 1
                }
            })

            if(myThreads >= 4){
                Alert.alert('Limite por usuário atingido')
            }else{
                //Criando a sala
                createRoom();
            }

        })
    }

    //Criar nova sala no firestore
    function createRoom(){  
        firestore().collection('MESSAGE_THREADS').add({
            //.add Permite gerar um ID unico para cada sala
            name: roomName,
            owner: user.uid,
            lastMessage: {
                text: `Grupo: ${roomName} criado. Bem vindo(a)`,
                //Pegando o horario do servidor
                createdAt: firestore.FieldValue.serverTimestamp()
            },
        })
        .then((docRef) => {
            docRef.collection('MESSAGES').add({
                text: `Grupo: ${roomName} criado. Bem vindo(a)`,
                createdAt: firestore.FieldValue.serverTimestamp(),
                system: true,
            })
            .then(() => {
                setVisible();
                //Informando pro useEffect que houve uma alteração na criação de sala
                setUpdateScreen();
            })
            .catch(error => console.log(error))
            
        })
        .catch(error => console.log(error))
    }

    return (

        <View style={styles.container}>

            <TouchableWithoutFeedback onPress={setVisible}>
                <View style={styles.modal}></View>
            </TouchableWithoutFeedback>
            

            <View style={styles.modalContent}>

                <Text style={styles.title}>Criar um novo grupo</Text>
                    
                <TextInput
                    value={roomName}
                    onChangeText={(text) => setRoomName(text)}
                    placeholder='Nome para sua sala'
                    style={styles.input}
                />

                <TouchableOpacity 
                style={styles.buttonCreate}
                onPress={handleButtonCreate}
                >
                    <Text style={styles.buttonText}>Criar sala</Text>
                </TouchableOpacity>

                <TouchableOpacity 
                    style={styles.backButton}
                    onPress={setVisible}
                >
                    <Text>Voltar</Text>
                </TouchableOpacity>
            </View>

        </View>
    );
}

const styles = StyleSheet.create({
    container:{
        flex: 1,
        backgroundColor: 'rgba(34, 34, 34, 0.4)'
    },
    modal:{
        flex: 1
    },
    modalContent:{
        flex: 1,
        backgroundColor: '#fff',
        padding: 15,
    },
    title:{
        marginTop: 14,
        textAlign: 'center',
        fontWeight: 'bold',
        fontSize: 19
    },
    input:{
        borderRadius: 4,
        height: 45,
        backgroundColor: '#ddd',
        marginVertical: 15,
        fontSize: 16,
        paddingHorizontal: 5
    },
    buttonCreate:{
        borderRadius: 4,
        backgroundColor: '#2e54d4',
        height: 45,
        alignItems: 'center',
        justifyContent: 'center'
    },
    buttonText: {
        fontSize: 19,
        fontWeight: 'bold',
        color: '#fff'
    },
    backButton:{
        marginTop: 10,
        alignItems: 'center',
        justifyContent: 'center'
    }
})