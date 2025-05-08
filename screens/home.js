import auth from '@react-native-firebase/auth';
import { useRouter } from 'expo-router';
import React, { useEffect, useState } from 'react';
import {
    Alert,
    Pressable,
    ScrollView,
    StyleSheet,
    Text,
    View,
} from 'react-native';

// Programme events with start and end times
const events = {
  friday: [
    { start: '14:00', end: '18:00', description: 'Set up camp in the Paddocks!' },
    { start: '18:30', end: '20:00', description: 'Welcome Drinks & DJ Billy at The Tikki Bar' },
    { start: '20:45', end: '22:30', description: "Kids' movies in The Shed" },
    { start: '21:00', end: '23:00', description: 'The Fever at the Main Stage' },
    { start: '23:00', end: '01:00', description: 'Westown Music Selection in the Sundown Lounge' },
  ],
  saturday: [
    { start: '10:30', end: '11:30', description: 'Adult Yoga with Aoife in the Pavilion' },
    { start: '12:00', end: '15:00', description: 'Festival Stalls in the Pavilion' },
    { start: '13:00', end: '14:00', description: 'Art with Orla in the Pavilion' },
    { start: '15:00', end: '17:00', description: 'WestFest Cup Tournament on the North Lawn' },
    { start: '17:00', end: '18:30', description: 'Lotte & Budding Artists at the Main Stage' },
    { start: '21:00', end: '23:00', description: 'Marvin & the Grooves at the Main Stage' },
  ],
  sunday: [
    { start: '10:00', end: '11:00', description: 'Westown Scavenger/Treasure Hunt' },
    { start: '11:00', end: '12:00', description: 'Time to break camp and say goodbye to #WF24!' },
  ],
};

export default function Home() {
  const router = useRouter();
  const [countdown, setCountdown] = useState('');
  const [festivalStarted, setFestivalStarted] = useState(false);
  const [currentEvent, setCurrentEvent] = useState(null);

  const festivalStart = new Date('2025-04-25T14:00:00');

  useEffect(() => {
    const timer = setInterval(() => {
      const now = new Date();
      const diff = festivalStart - now;

      if (diff <= 0) {
        setFestivalStarted(true);
        updateCurrentEvent();
      } else {
        const hours = Math.floor(diff / (1000 * 60 * 60));
        const minutes = Math.floor((diff / (1000 * 60)) % 60);
        const seconds = Math.floor((diff / 1000) % 60);
        setCountdown(`${hours}h ${minutes}m ${seconds}s`);
      }
    }, 1000);

    return () => clearInterval(timer);
  }, []);

  const updateCurrentEvent = () => {
    const now = new Date();
    const dayOfWeek = ['sunday', 'monday', 'tuesday', 'wednesday', 'thursday', 'friday', 'saturday'][now.getDay()];
    const todayEvents = events[dayOfWeek];

    if (!todayEvents) {
      setCurrentEvent(null);
      return;
    }

    const nowMinutes = now.getHours() * 60 + now.getMinutes();

    let foundEvent = null;
    for (const event of todayEvents) {
      const [startHour, startMinute] = event.start.split(':').map(Number);
      const [endHour, endMinute] = event.end.split(':').map(Number);
      const startMinutes = startHour * 60 + startMinute;
      const endMinutes = endHour * 60 + endMinute;

      if (nowMinutes >= startMinutes && nowMinutes <= endMinutes) {
        foundEvent = event;
        break;
      }
    }

    setCurrentEvent(foundEvent);
  };

  const handleLogout = async () => {
    try {
      await auth().signOut(); // ✅ Fixed logout for native Firebase
      router.replace('/');
    } catch (error) {
      console.error('Error logging out:', error);
      Alert.alert('Error logging out. Please try again.');
    }
  };

  return (
    <ScrollView style={styles.scrollContainer}>
      <View style={styles.container}>
        <Text style={styles.title}>Welcome to Westfest!</Text>

        {!festivalStarted ? (
          <>
            <Text style={styles.sectionTitle}>Countdown to WestFest 🎉</Text>
            <Pressable onPress={() => router.push('/programme')} style={styles.countdownButton}>
              <Text style={styles.countdown}>{countdown}</Text>
              <Text style={styles.countdownHint}>Tap to view the Programme 📋</Text>
            </Pressable>
          </>
        ) : (
          <>
            <Text style={styles.sectionTitle}>What's Happening Now 🎶</Text>
            <Pressable onPress={() => router.push('/programme')} style={styles.currentEventContainer}>
              {currentEvent ? (
                <>
                  <Text style={styles.eventTime}>{currentEvent.start} - {currentEvent.end}</Text>
                  <Text style={styles.eventDescription}>{currentEvent.description}</Text>
                </>
              ) : (
                <Text style={styles.noEvent}>No event currently happening!</Text>
              )}
            </Pressable>
          </>
        )}

        <Text style={styles.welcomeText}>
          We kick off the weekend festivities at The Tikki Bar where DJ Billy and
          hosts Andy and Emmet will ensure everyone feels the aloha spirit! There
          will be fun and games for all, so grab your leis and grass skirts and
          immerse yourself at this tropical paradise! For those seeking something
          quieter, Eoin will be running a selection of movies in The Shed.
          {"\n\n"}
          Friday night we are thrilled to welcome The Fever to the Main Stage.
          This Dublin Classic Rock Band are sure to keep everyone entertained and
          create a night to remember!
          {"\n\n"}
          Saturday sees the return of our international Norwegian talent, Lotte.
          With her captivating voice, she will lead the Budding Artists showcase at
          the Main Stage. Expect acoustic magic and heartfelt lyrics.
          {"\n\n"}
          Settle into the evening with some WestFest original cocktails created by
          our talented mixologist Avril and her amazing team.
          {"\n\n"}
          This year’s theme is pure Hippie/60’s. Dust off those bell-bottoms and
          tie-dye shirts. Peace, love and retro vibes are the order of the evening.
          {"\n\n"}
          We are delighted to welcome back Murphy’s Law to the Main Stage.
          Their energetic fusion will kick off the evening festivities. Our headline
          act, Marvin & The Grooves makes a return following their sensational
          performance in 2023 and will keep you on the dance floor all night!
          {"\n\n"}
          #WF24 presents some changes to the festival activities. Aoife will lead
          the adults in a revitalizing morning Yoga session while Claire will lead the
          younger festival goers in Mindfulness and calming exercises. Don’t
          forget to bring your mat and let the soothing vibes of nature enhance
          your flow.
          {"\n\n"}
          We are also pleased to announce the inaugural WestFest Cup led by Will.
          Tournament details will be provided prior to kick-off and it is sure to be a
          firm festival favourite.
          {"\n\n"}
          We welcome back some family favourites, including the ever engaging
          Art with Orla and captivating Festival Stalls. Denise also makes a return
          with her adorable pony Woodie and farm friends.
          {"\n\n"}
          This year we introduce some new spaces and experiences. Discover our
          colourful hammocks where you can relax and unwind, enjoy the thrill of
          our Scavenger Hunt with Tommy and Daragh, or simply toss a coin in our
          Wishing Well which will make its way to our chosen charity, the Irish
          Cancer Society.
        </Text>
      </View>
    </ScrollView>
  );
}

const styles = StyleSheet.create({
  scrollContainer: {
    flex: 1,
    backgroundColor: '#fff',
  },
  container: {
    alignItems: 'center',
    paddingHorizontal: 20,
    paddingVertical: 30,
  },
  title: {
    fontSize: 32,
    fontWeight: 'bold',
    marginBottom: 20,
    textAlign: 'center',
  },
  sectionTitle: {
    fontSize: 24,
    fontWeight: 'bold',
    marginTop: 10,
    marginBottom: 10,
  },
  countdownButton: {
    alignItems: 'center',
    backgroundColor: '#ff6347',
    paddingVertical: 12,
    paddingHorizontal: 20,
    borderRadius: 10,
    marginVertical: 10,
  },
  countdown: {
    fontSize: 28,
    color: '#fff',
  },
  countdownHint: {
    fontSize: 14,
    color: '#fff',
    marginTop: 5,
  },
  currentEventContainer: {
    alignItems: 'center',
    backgroundColor: '#f9f9f9',
    paddingVertical: 12,
    paddingHorizontal: 20,
    borderRadius: 10,
    marginVertical: 10,
  },
  eventTime: {
    fontSize: 20,
    fontWeight: 'bold',
    color: '#333',
  },
  eventDescription: {
    fontSize: 18,
    marginTop: 5,
    textAlign: 'center',
    color: '#555',
  },
  noEvent: {
    fontSize: 18,
    marginTop: 5,
    color: '#999',
  },
  welcomeText: {
    fontSize: 16,
    textAlign: 'justify',
    marginTop: 30,
    lineHeight: 24,
  },
});
