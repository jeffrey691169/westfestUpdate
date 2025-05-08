import auth from '@react-native-firebase/auth';
import { createBottomTabNavigator } from '@react-navigation/bottom-tabs';
import { useRouter } from 'expo-router';
import React, { useState } from 'react';
import { Image, Modal, Pressable, StyleSheet, Text, View } from 'react-native';
import AboutUs from '../screens/aboutUs';
import Gallery from '../screens/gallery';
import Home from '../screens/home';
import Map from '../screens/map';
import Programme from '../screens/programme';

const Tab = createBottomTabNavigator();

export default function MainContainer() {
  const router = useRouter();
  const [modalVisible, setModalVisible] = useState(false);

  const user = auth().currentUser; // ✅ Fixed

  const handleSignOut = async () => {
    try {
      await auth().signOut(); // ✅ Fixed
      router.replace('/');
    } catch (error) {
      console.error('Error signing out:', error);
    } finally {
      setModalVisible(false);
    }
  };

  return (
    <>
      <Tab.Navigator
        initialRouteName="Home"
        screenOptions={{
          headerTitle: () => (
            <Image
              source={require('../assets/images/westfestLogo.png')}
              style={{ width: 120, height: 40, resizeMode: 'contain' }}
            />
          ),
          headerTitleAlign: 'center',
          headerRight: () => (
            <Pressable onPress={() => setModalVisible(true)} style={{ marginRight: 15 }}>
              <Image
                source={
                  user?.photoURL
                    ? { uri: user.photoURL }
                    : require('../assets/images/defaultpp.png') // 👈 fallback profile image
                }
                style={{ width: 32, height: 32, borderRadius: 16 }}
              />
            </Pressable>
          ),
        }}
      >
        <Tab.Screen name="Map" component={Map} />
        <Tab.Screen name="Programme" component={Programme} />
        <Tab.Screen name="Home" component={Home} />
        <Tab.Screen name="About Us" component={AboutUs} />
        <Tab.Screen name="Gallery" component={Gallery} />
      </Tab.Navigator>

      {/* Profile Modal */}
      <Modal
        transparent={true}
        visible={modalVisible}
        animationType="slide"
        onRequestClose={() => setModalVisible(false)}
      >
        <Pressable style={styles.modalBackground} onPress={() => setModalVisible(false)}>
          <View style={styles.modalContent}>
            <Image
              source={
                user?.photoURL
                  ? { uri: user.photoURL }
                  : require('../assets/images/defaultpp.png')
              }
              style={styles.profileImage}
            />
            <Text style={styles.profileName}>
              {user?.displayName ? `Hi, ${user.displayName}!` : 'Hi there!'}
            </Text>

            <Pressable
              style={styles.modalButton}
              onPress={() => {
                setModalVisible(false);
                router.push('/settings'); // 👉 you need to create /settings page
              }}
            >
              <Text style={styles.modalButtonText}>Settings ⚙️</Text>
            </Pressable>

            <Pressable style={styles.modalButton} onPress={handleSignOut}>
              <Text style={styles.modalButtonText}>Sign Out 🚪</Text>
            </Pressable>
          </View>
        </Pressable>
      </Modal>
    </>
  );
}

const styles = StyleSheet.create({
  modalBackground: {
    flex: 1,
    backgroundColor: 'rgba(0,0,0,0.4)',
    justifyContent: 'center',
    alignItems: 'center',
  },
  modalContent: {
    backgroundColor: '#fff',
    padding: 25,
    borderRadius: 10,
    alignItems: 'center',
    width: 260,
  },
  profileImage: {
    width: 80,
    height: 80,
    borderRadius: 40,
    marginBottom: 15,
  },
  profileName: {
    fontSize: 18,
    fontWeight: 'bold',
    marginBottom: 20,
  },
  modalButton: {
    marginTop: 10,
    width: '100%',
    paddingVertical: 10,
    backgroundColor: '#ff6347',
    borderRadius: 8,
    alignItems: 'center',
  },
  modalButtonText: {
    color: '#fff',
    fontSize: 16,
  },
});
