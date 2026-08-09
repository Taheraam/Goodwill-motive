import { useState } from 'react';
import { View, Text, StyleSheet, TouchableOpacity } from 'react-native';

export default function HomeScreen() {
  const [count, setCount] = useState(0);

  return (
    <View style={styles.container}>
      <View style={styles.header}>
        <View style={styles.logo}>
          <Text style={styles.logoText}>GM</Text>
        </View>
        <Text style={styles.title}>Goodwill Motive</Text>
      </View>

      <View style={styles.hero}>
        <Text style={styles.heroTitle}>Learn Together.{'\n'}Help Others.{'\n'}Change Real Lives.</Text>
        <Text style={styles.heroSubtitle}>
          A contribution ecosystem where your learning generates measurable humanitarian impact.
        </Text>
        <TouchableOpacity style={styles.primaryButton}>
          <Text style={styles.primaryButtonText}>Start Contributing</Text>
        </TouchableOpacity>
        <TouchableOpacity style={styles.secondaryButton}>
          <Text style={styles.secondaryButtonText}>Join the Mission</Text>
        </TouchableOpacity>
      </View>

      <View style={styles.features}>
        <View style={styles.featureCard}>
          <Text style={styles.featureEmoji}>Learn</Text>
          <Text style={styles.featureTitle}>Daily Learning</Text>
          <Text style={styles.featureDesc}>Quizzes, modules, and challenges</Text>
        </View>
        <View style={styles.featureCard}>
          <Text style={styles.featureEmoji}>Teach</Text>
          <Text style={styles.featureTitle}>Help Others</Text>
          <Text style={styles.featureDesc}>Answer questions and mentor</Text>
        </View>
        <View style={styles.featureCard}>
          <Text style={styles.featureEmoji}>Impact</Text>
          <Text style={styles.featureTitle}>Real Change</Text>
          <Text style={styles.featureDesc}>Meals, tutoring, education</Text>
        </View>
      </View>

      <View style={styles.stats}>
        <View style={styles.statItem}>
          <Text style={styles.statNumber}>12,400</Text>
          <Text style={styles.statLabel}>Meals Funded</Text>
        </View>
        <View style={styles.statItem}>
          <Text style={styles.statNumber}>54,200</Text>
          <Text style={styles.statLabel}>Quizzes Done</Text>
        </View>
        <View style={styles.statItem}>
          <Text style={styles.statNumber}>8,400</Text>
          <Text style={styles.statLabel}>Contributors</Text>
        </View>
      </View>

      <View style={styles.howItWorks}>
        <Text style={styles.sectionTitle}>How It Works</Text>
        <View style={styles.step}>
          <View style={styles.stepNumber}><Text style={styles.stepNumberText}>1</Text></View>
          <View>
            <Text style={styles.stepTitle}>Learn or Teach</Text>
            <Text style={styles.stepDesc}>Complete quizzes, answer questions</Text>
          </View>
        </View>
        <View style={styles.step}>
          <View style={styles.stepNumber}><Text style={styles.stepNumberText}>2</Text></View>
          <View>
            <Text style={styles.stepTitle}>Earn Points</Text>
            <Text style={styles.stepDesc}>Quality and consistency rewarded</Text>
          </View>
        </View>
        <View style={styles.step}>
          <View style={styles.stepNumber}><Text style={styles.stepNumberText}>3</Text></View>
          <View>
            <Text style={styles.stepTitle}>Generate Impact</Text>
            <Text style={styles.stepDesc}>Sponsor-backed humanitarian outcomes</Text>
          </View>
        </View>
      </View>

      <Text style={styles.footer}>Goodwill Motive — The internet humanity deserves.</Text>
    </View>
  );
}

const styles = StyleSheet.create({
  container: { flex: 1, backgroundColor: '#FAFAF8' },
  header: { flexDirection: 'row', alignItems: 'center', padding: 20, gap: 8 },
  logo: { width: 32, height: 32, borderRadius: 16, backgroundColor: '#E85D04', alignItems: 'center', justifyContent: 'center' },
  logoText: { color: 'white', fontWeight: '700', fontSize: 14 },
  title: { fontSize: 16, fontWeight: '600', color: '#1A1A1A' },
  hero: { alignItems: 'center', paddingHorizontal: 24, paddingVertical: 48, textAlign: 'center' },
  heroTitle: { fontSize: 32, fontWeight: '700', color: '#1A1A1A', textAlign: 'center', lineHeight: 40 },
  heroSubtitle: { fontSize: 16, color: '#6B7280', textAlign: 'center', marginTop: 12, marginBottom: 24, lineHeight: 24 },
  primaryButton: { backgroundColor: '#E85D04', paddingVertical: 14, paddingHorizontal: 32, borderRadius: 999, marginBottom: 12, width: '100%', alignItems: 'center' },
  primaryButtonText: { color: 'white', fontSize: 16, fontWeight: '600' },
  secondaryButton: { borderWidth: 1, borderColor: '#E5E7EB', paddingVertical: 14, paddingHorizontal: 32, borderRadius: 999, width: '100%', alignItems: 'center' },
  secondaryButtonText: { color: '#6B7280', fontSize: 16, fontWeight: '600' },
  features: { flexDirection: 'row', paddingHorizontal: 16, gap: 12, marginTop: 24 },
  featureCard: { flex: 1, backgroundColor: 'white', borderRadius: 16, padding: 16, alignItems: 'center', borderWidth: 1, borderColor: '#F3F4F6' },
  featureEmoji: { fontSize: 28, marginBottom: 8 },
  featureTitle: { fontSize: 14, fontWeight: '600', color: '#1A1A1A', marginBottom: 4 },
  featureDesc: { fontSize: 11, color: '#6B7280', textAlign: 'center' },
  stats: { flexDirection: 'row', justifyContent: 'space-around', paddingVertical: 32, paddingHorizontal: 16, marginTop: 24, backgroundColor: 'white' },
  statItem: { alignItems: 'center' },
  statNumber: { fontSize: 24, fontWeight: '700', color: '#E85D04' },
  statLabel: { fontSize: 12, color: '#6B7280', marginTop: 4 },
  howItWorks: { paddingHorizontal: 24, paddingVertical: 32 },
  sectionTitle: { fontSize: 20, fontWeight: '700', color: '#1A1A1A', marginBottom: 20 },
  step: { flexDirection: 'row', alignItems: 'flex-start', gap: 12, marginBottom: 16 },
  stepNumber: { width: 28, height: 28, borderRadius: 14, backgroundColor: '#FFF7ED', alignItems: 'center', justifyContent: 'center' },
  stepNumberText: { color: '#E85D04', fontWeight: '700', fontSize: 14 },
  stepTitle: { fontSize: 14, fontWeight: '600', color: '#1A1A1A' },
  stepDesc: { fontSize: 12, color: '#6B7280', marginTop: 2 },
  footer: { textAlign: 'center', padding: 16, fontSize: 12, color: '#9CA3AF' },
});