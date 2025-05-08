import { useRouter } from 'expo-router';
import React, { useEffect, useState } from 'react';
import {
    ActivityIndicator,
    Alert,
    Button,
    Image,
    Keyboard,
    KeyboardAvoidingView,
    Platform,
    StyleSheet,
    Text,
    TextInput,
    TouchableWithoutFeedback,
    View,
} from 'react-native';

import auth from '@react-native-firebase/auth';
import firestore from '@react-native-firebase/firestore';
import storage from '@react-native-firebase/storage';

import * as ImageManipulator from 'expo-image-manipulator';
import * as ImagePicker from 'expo-image-picker';

export default function SignUpPage() {
  const router = useRouter();
  const [name, setName] = useState('');
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [confirmPassword, setConfirmPassword] = useState('');
  const [profileImage, setProfileImage] = useState(null);
  const [uploadError, setUploadError] = useState(null);
  const [isLoading, setIsLoading] = useState(false);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const unsubscribe = auth().onAuthStateChanged((user) => {
      if (user) router.replace('/MainContainer');
      else setLoading(false);
    });
    return unsubscribe;
  }, []);

  const getErrorMessage = (error) => {
    if (!error || !error.code) return 'Unexpected error occurred.';
    switch (error.code) {
      case 'auth/invalid-email':
        return 'Invalid email address.';
      case 'auth/email-already-in-use':
        return 'Email is already in use.';
      case 'auth/weak-password':
        return 'Password should be at least 6 characters.';
      default:
        return error.message || 'Something went wrong. Please try again.';
    }
  };

  const pickFromGallery = async () => {
    const { status } = await ImagePicker.requestMediaLibraryPermissionsAsync();
    if (status !== 'granted') {
      Alert.alert('Permission Denied', 'We need access to your gallery.');
      return;
    }

    try {
      const result = await ImagePicker.launchImageLibraryAsync({
        mediaTypes: ImagePicker.MediaTypeOptions.Images,
        allowsEditing: true,
        aspect: [1, 1],
        quality: 0.5,
      });

      if (!result.canceled) {
        const resized = await ImageManipulator.manipulateAsync(
          result.assets[0].uri,
          [{ resize: { width: 600 } }],
          { compress: 0.5, format: ImageManipulator.SaveFormat.JPEG }
        );
        setProfileImage(resized.uri);
        console.log('✅ Image selected and resized:', resized.uri);
      }
    } catch (err) {
      console.error('❌ Image Picker or Manipulation Error:', err);
      Alert.alert('Image Error', err.message || 'Failed to process image.');
    }
  };

  const uploadImageToStorage = async (uri, uid) => {
    try {
      if (!uri || !uid) throw new Error('Invalid image URI or user ID.');
      const reference = storage().ref(`users/${uid}/profile.jpg`);
      await reference.putFile(uri);
      const downloadURL = await reference.getDownloadURL();
      return downloadURL;
    } catch (err) {
      console.error('❌ Upload error:', err);
      setUploadError(err.message || 'Upload failed. Please try again.');
      Alert.alert('Image Upload Error', err.message || 'Unknown error.');
      return null;
    }
  };

  const handleSignUp = async (skipPhoto = false) => {
    if (!email || !password || !confirmPassword || !name) {
      return Alert.alert('Missing Fields', 'Please fill all fields.');
    }
    if (password !== confirmPassword) {
      return Alert.alert('Password Mismatch', 'Passwords do not match.');
    }

    setIsLoading(true);
    setUploadError(null);

    try {
      const userCredential = await auth().createUserWithEmailAndPassword(email, password);
      const uid = userCredential?.user?.uid;
      if (!uid) throw new Error('No UID returned from Firebase Auth.');

      let photoURL = null;
      if (!skipPhoto && profileImage) {
        photoURL = await uploadImageToStorage(profileImage, uid);
        if (!photoURL) {
          setIsLoading(false);
          return;
        }
      }

      await userCredential.user.updateProfile({
        displayName: name,
        photoURL: photoURL || null,
      });

      await firestore().collection('users').doc(uid).set({
        uid,
        displayName: name,
        email,
        photoURL: photoURL || null,
        createdAt: firestore.FieldValue.serverTimestamp(),
      });

      Alert.alert('Success 🎉', 'Your account has been created.');
      router.replace('/MainContainer');
    } catch (error) {
      console.error('❌ Sign-up process error:', error);
      Alert.alert('Signup Failed', getErrorMessage(error));
    } finally {
      setIsLoading(false);
    }
  };

  if (loading) {
    return (
      <View style={styles.container}>
        <ActivityIndicator size="large" />
      </View>
    );
  }

  return (
    <TouchableWithoutFeedback onPress={Keyboard.dismiss}>
      <KeyboardAvoidingView
        style={{ flex: 1 }}
        behavior={Platform.OS === 'ios' ? 'padding' : 'height'}
      >
        <View style={styles.container}>
          <Text style={styles.title}>Sign Up</Text>

          <Text style={styles.label}>Name</Text>
          <TextInput style={styles.input} placeholder="Name" value={name} onChangeText={setName} />

          <Text style={styles.label}>Email</Text>
          <TextInput
            style={styles.input}
            placeholder="Email"
            keyboardType="email-address"
            value={email}
            onChangeText={setEmail}
            autoComplete="off"
            textContentType="username"
          />

          <Text style={styles.label}>Password</Text>
          <TextInput
            style={styles.input}
            placeholder="Password"
            secureTextEntry
            value={password}
            onChangeText={setPassword}
            autoComplete="off"
            textContentType="password"
          />

          <Text style={styles.label}>Confirm Password</Text>
          <TextInput
            style={styles.input}
            placeholder="Confirm Password"
            secureTextEntry
            value={confirmPassword}
            onChangeText={setConfirmPassword}
            autoComplete="off"
            textContentType="password"
          />

          <Button title="Choose Profile Picture 🖼️" onPress={pickFromGallery} />
          {profileImage && <Image source={{ uri: profileImage }} style={styles.profileImage} />}
          {uploadError && <Text style={{ color: 'red', marginVertical: 8 }}>{uploadError}</Text>}

          <Button
            title={isLoading ? 'Signing Up...' : 'Sign Up with Photo'}
            onPress={() => handleSignUp(false)}
            disabled={isLoading}
          />
          <Button
            title="Skip Photo and Sign Up 🚀"
            onPress={() => handleSignUp(true)}
            disabled={isLoading}
            color="#777"
          />
        </View>
      </KeyboardAvoidingView>
    </TouchableWithoutFeedback>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#fff',
    justifyContent: 'center',
    paddingHorizontal: 20,
  },
  title: {
    fontSize: 32,
    fontWeight: 'bold',
    marginBottom: 20,
    alignSelf: 'center',
  },
  label: {
    fontSize: 16,
    fontWeight: '500',
    marginBottom: 5,
  },
  input: {
    height: 50,
    borderColor: '#ccc',
    borderWidth: 1,
    marginBottom: 15,
    paddingHorizontal: 10,
    borderRadius: 8,
  },
  profileImage: {
    width: 100,
    height: 100,
    borderRadius: 50,
    alignSelf: 'center',
    marginVertical: 15,
  },
});
