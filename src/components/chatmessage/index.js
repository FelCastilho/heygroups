import { useMemo } from 'react';
import { View, Text, StyleSheet } from 'react-native';

import auth from '@react-native-firebase/auth';

function ChatMessage({ data }) {

    const user = auth().currentUser.toJSON();

    //Verificando de quem é a mensagem
    const isMyMessage = useMemo(() => {

        return data.user?._id === user.uid //Caso isso não exista ele recebe null

    }, [data])

    return (
        <View style={styles.container}>

            <View style={[
                styles.messageBox,
                {
                    backgroundColor: isMyMessage? '#dcf8c5' : '#fff',
                    marginLeft: isMyMessage ? 50 : 0,
                    marginRight: isMyMessage ? 0 : 50
                }
                ]}>

                {!isMyMessage && <Text style={styles.name}>{data?.user?.displayame}</Text>}
                

                <Text style={styles.message}>{data.text}</Text>

            </View>

        </View>
    );
}

export default ChatMessage;

const styles = StyleSheet.create({
    container: {
        padding: 10
    },
    messageBox:{
        borderRadius: 5,
        padding: 10,
    },
    name:{
        color: '#f53745',
        fontWeight: 'bold',
        marginBottom: 5,
    },
})