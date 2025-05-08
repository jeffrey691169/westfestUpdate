import { Link, useRouter } from 'expo-router';
import React, { useEffect, useState } from 'react';
import {
    ActivityIndicator,
    Button,
    Keyboard,
    StyleSheet,
    Text,
    TextInput,
    TouchableWithoutFeedback,
    View,
} from 'react-native';

// ✅ Ensure Firebase is initialized
import '@react-native-firebase/app';
import auth from '@react-native-firebase/auth';

export default function Index() {
  const router = useRouter();
  const [loading, setLoading] = useState(true);
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [isLoading, setIsLoading] = useState(false);

  // ✅ Auto-login redirect
  useEffect(() => {
    const unsubscribe = auth().onAuthStateChanged((user) => {
      if (user) {
        router.replace('/MainContainer');
      } else {
        setLoading(false);
      }
    });

    return unsubscribe;
  }, []);

  // ✅ Firebase error code mapping
  const getErrorMessage = (error) => {
    switch (error.code) {
      case 'auth/invalid-email':
        return 'Invalid email address.';
      case 'auth/user-not-found':
        return 'No account found with this email.';
      case 'auth/wrong-password':
        return 'Incorrect password.';
      default:
        return 'Something went wrong. Please try again.';
    }
  };

  // ✅ Email/password sign-in
  const handleLogin = async () => {
    if (!email || !password) {
      alert('Please enter email and password');
      return;
    }

    setIsLoading(true);
    try {
      await auth().signInWithEmailAndPassword(email, password);
      router.replace('/MainContainer');
    } catch (error) {
      console.error('Login error:', error);
      alert(getErrorMessage(error));
    } finally {
      setIsLoading(false);
    }
  };

  // ✅ Loading spinner during Firebase check
  if (loading) {
    return (
      <View style={styles.container}>
        <ActivityIndicator size="large" />
      </View>
    );
  }

  return (
    <TouchableWithoutFeedback onPress={Keyboard.dismiss}>
      <View style={styles.container}>
        <Text style={styles.title}>Login</Text>

        <Text style={styles.label}>Email</Text>
        <TextInput
          style={styles.input}
          placeholder="Email"
          keyboardType="email-address"
          value={email}
          onChangeText={setEmail}
          autoCapitalize="none"
          autoCorrect={false}
        />

        <Text style={styles.label}>Password</Text>
        <TextInput
          style={styles.input}
          placeholder="Password"
          secureTextEntry
          value={password}
          onChangeText={setPassword}
        />

        <Button
          title={isLoading ? 'Logging In...' : 'Log In'}
          onPress={handleLogin}
          disabled={isLoading}
        />

        <Link href="/signup" style={styles.link}>
          Don't have an account? Sign Up
        </Link>
      </View>
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
  link: {
    marginTop: 20,
    fontSize: 16,
    color: 'blue',
    textAlign: 'center',
    textDecorationLine: 'underline',
  },
});
