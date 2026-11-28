import { router, type Href } from 'expo-router';
import { useState, type ReactNode } from 'react';
import {
  KeyboardAvoidingView,
  Modal,
  Platform,
  Pressable,
  ScrollView,
  StyleSheet,
  Switch,
  Text,
  TextInput,
  View,
  type StyleProp,
  type TextInputProps,
  type ViewStyle,
} from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';

import { WF, WFRadius, WFSpace } from '@/constants/wireframe';

/* ---------- navigation helpers ---------- */

function go(href: Href) {
  router.push(href);
}

function goBack(fallback: Href) {
  if (router.canGoBack()) router.back();
  else router.replace(fallback);
}

/* ---------- branding / chrome ---------- */

export function Logo({ size = 40 }: { size?: number }) {
  return (
    <View style={[s.logo, { width: size, height: size, borderRadius: size / 4 }]}>
      <Text style={s.logoText}>E</Text>
    </View>
  );
}

export function AppHeader({ showProfile = true }: { showProfile?: boolean }) {
  return (
    <View style={s.header}>
      <Logo />
      <Text style={s.brand}>E.N.G.R.A.M</Text>
      {showProfile ? (
        <Pressable accessibilityLabel="Open profile" onPress={() => go('/profile')} style={s.avatarBtn}>
          <Text style={s.avatarBtnText}>P</Text>
        </Pressable>
      ) : (
        <View style={s.avatarBtn} />
      )}
    </View>
  );
}

export function TabIcon({ focused }: { focused: boolean }) {
  return <View style={[s.tabIcon, focused && s.tabIconActive]} />;
}

/* ---------- screen shells ---------- */

type ScreenProps = {
  title: string;
  subtitle?: string;
  back?: { label: string; href: Href };
  children: ReactNode;
};

export function Screen({ title, subtitle, back, children }: ScreenProps) {
  return (
    <SafeAreaView style={s.safe} edges={['top']}>
      <KeyboardAvoidingView style={s.flex} behavior={Platform.OS === 'ios' ? 'padding' : undefined}>
        <ScrollView contentContainerStyle={s.content} keyboardShouldPersistTaps="handled">
          <AppHeader />
          <Text style={s.title}>{title}</Text>
          {subtitle ? <Text style={s.subtitle}>{subtitle}</Text> : null}
          {back ? (
            <Pressable onPress={() => goBack(back.href)} style={s.backRow}>
              <Text style={s.backArrow}>{'<'}</Text>
              <Text style={s.backLabel}>{back.label}</Text>
            </Pressable>
          ) : null}
          {children}
        </ScrollView>
      </KeyboardAvoidingView>
    </SafeAreaView>
  );
}

/** Login / Sign up shell: no header, no tab bar, content centered. */
export function AuthScreen({ children }: { children: ReactNode }) {
  return (
    <SafeAreaView style={s.safe}>
      <KeyboardAvoidingView style={s.flex} behavior={Platform.OS === 'ios' ? 'padding' : undefined}>
        <ScrollView contentContainerStyle={s.authContent} keyboardShouldPersistTaps="handled">
          <View style={s.authLogo}>
            <Logo size={84} />
          </View>
          {children}
        </ScrollView>
      </KeyboardAvoidingView>
    </SafeAreaView>
  );
}

/* ---------- inputs ---------- */

type TextBoxProps = TextInputProps & { label?: string };

export function TextBox({ label, multiline, style, ...rest }: TextBoxProps) {
  return (
    <View style={s.field}>
      {label ? <Text style={s.label}>{label}</Text> : null}
      <TextInput
        placeholderTextColor={WF.gray500}
        multiline={multiline}
        textAlignVertical={multiline ? 'top' : 'center'}
        style={[s.input, multiline && s.inputMulti, style]}
        {...rest}
      />
    </View>
  );
}

type ButtonProps = {
  label: string;
  onPress?: () => void;
  href?: Href;
  variant?: 'primary' | 'secondary' | 'ghost';
  style?: StyleProp<ViewStyle>;
};

export function Button({ label, onPress, href, variant = 'primary', style }: ButtonProps) {
  const handle = () => {
    if (onPress) onPress();
    else if (href) go(href);
  };
  return (
    <Pressable
      accessibilityRole="button"
      onPress={handle}
      style={({ pressed }) => [s.btn, btnVariant[variant], pressed && s.pressed, style]}>
      <Text style={[s.btnText, variant === 'primary' ? s.btnTextOnDark : s.btnTextOnLight]}>{label}</Text>
    </Pressable>
  );
}

export function ChipGroup({
  options,
  value,
  onChange,
}: {
  options: string[];
  value: string;
  onChange: (v: string) => void;
}) {
  return (
    <View style={s.chips}>
      {options.map((o) => {
        const active = o === value;
        return (
          <Pressable key={o} onPress={() => onChange(o)} style={[s.chip, active && s.chipActive]}>
            <Text style={[s.chipText, active && s.chipTextActive]}>{o}</Text>
          </Pressable>
        );
      })}
    </View>
  );
}

export function ToggleRow({
  title,
  subtitle,
  value,
  onChange,
}: {
  title: string;
  subtitle?: string;
  value: boolean;
  onChange: (v: boolean) => void;
}) {
  return (
    <View style={s.listRow}>
      <View style={s.flex}>
        <Text style={s.rowTitle}>{title}</Text>
        {subtitle ? <Text style={s.rowSub}>{subtitle}</Text> : null}
      </View>
      <Switch
        value={value}
        onValueChange={onChange}
        trackColor={{ false: WF.gray300, true: WF.gray700 }}
        thumbColor={value ? WF.black : WF.white}
      />
    </View>
  );
}

/** Selectable card with a radio dot (Writing Modes). */
export function SelectCard({
  title,
  description,
  tag,
  selected,
  onPress,
}: {
  title: string;
  description: string;
  tag?: string;
  selected: boolean;
  onPress: () => void;
}) {
  return (
    <Pressable onPress={onPress} style={[s.card, selected && s.cardSelected]}>
      <View style={s.selectTop}>
        <Text style={s.cardTitle}>{title}</Text>
        <View style={[s.radio, selected && s.radioOn]} />
      </View>
      <Text style={s.rowSub}>{description}</Text>
      {tag ? <Text style={s.tag}>{tag}</Text> : null}
    </Pressable>
  );
}

/* ---------- content blocks ---------- */

export function SectionLabel({ children, action }: { children: string; action?: { label: string; href: Href } }) {
  return (
    <View style={s.sectionRow}>
      <Text style={s.sectionLabel}>{children}</Text>
      {action ? (
        <Pressable onPress={() => go(action.href)}>
          <Text style={s.link}>{action.label}</Text>
        </Pressable>
      ) : null}
    </View>
  );
}

export function Card({
  title,
  subtitle,
  children,
  style,
}: {
  title?: string;
  subtitle?: string;
  children?: ReactNode;
  style?: StyleProp<ViewStyle>;
}) {
  return (
    <View style={[s.card, style]}>
      {title ? <Text style={s.cardTitle}>{title}</Text> : null}
      {subtitle ? <Text style={s.rowSub}>{subtitle}</Text> : null}
      {children}
    </View>
  );
}

export function ListRow({
  title,
  subtitle,
  meta,
  href,
  onPress,
}: {
  title: string;
  subtitle?: string;
  meta?: string;
  href?: Href;
  onPress?: () => void;
}) {
  const tappable = Boolean(href || onPress);
  return (
    <Pressable
      disabled={!tappable}
      onPress={() => (onPress ? onPress() : href ? go(href) : undefined)}
      style={({ pressed }) => [s.listRow, pressed && s.pressed]}>
      <View style={s.iconBox} />
      <View style={s.flex}>
        <Text style={s.rowTitle}>{title}</Text>
        {subtitle ? <Text style={s.rowSub}>{subtitle}</Text> : null}
      </View>
      {meta ? <Text style={s.rowSub}>{meta}</Text> : null}
      {tappable ? <Text style={s.chevron}>{'>'}</Text> : null}
    </Pressable>
  );
}

export function MemoryCard({
  title,
  meta,
  preview,
  href,
}: {
  title: string;
  meta: string;
  preview: string;
  href?: Href;
}) {
  return (
    <Pressable disabled={!href} onPress={() => (href ? go(href) : undefined)} style={s.card}>
      <Text style={s.cardTitle}>{title}</Text>
      <Text style={s.rowSub}>{meta}</Text>
      <Text style={s.body}>{preview}</Text>
      <Text style={s.tag}>Original preserved · Private</Text>
    </Pressable>
  );
}

export function InfoRow({ label, value }: { label: string; value: string }) {
  return (
    <View style={s.infoRow}>
      <Text style={s.rowSub}>{label}</Text>
      <Text style={s.rowTitle}>{value}</Text>
    </View>
  );
}

export function Notice({ title, children }: { title?: string; children: string }) {
  return (
    <View style={s.notice}>
      {title ? <Text style={s.rowTitle}>{title}</Text> : null}
      <Text style={s.rowSub}>{children}</Text>
    </View>
  );
}

export function Placeholder({ label, height = 120 }: { label: string; height?: number }) {
  return (
    <View style={[s.placeholder, { height }]}>
      <Text style={s.rowSub}>{label}</Text>
    </View>
  );
}

export function Avatar({ size = 64 }: { size?: number }) {
  return <View style={[s.avatar, { width: size, height: size, borderRadius: size / 2 }]} />;
}

export function Spacer({ size = WFSpace.md }: { size?: number }) {
  return <View style={{ height: size }} />;
}

/* ---------- modal sheet ---------- */

export function SheetModal({
  visible,
  title,
  onClose,
  children,
}: {
  visible: boolean;
  title: string;
  onClose: () => void;
  children: ReactNode;
}) {
  return (
    <Modal visible={visible} transparent animationType="fade" onRequestClose={onClose}>
      <View style={s.overlay}>
        <View style={s.sheet}>
          <View style={s.sectionRow}>
            <Text style={s.cardTitle}>{title}</Text>
            <Pressable onPress={onClose}>
              <Text style={s.link}>Close</Text>
            </Pressable>
          </View>
          {children}
        </View>
      </View>
    </Modal>
  );
}

export function useToggle(initial = false) {
  const [on, setOn] = useState(initial);
  return [on, () => setOn(true), () => setOn(false)] as const;
}

/* ---------- styles ---------- */

const s = StyleSheet.create({
  flex: { flex: 1 },
  safe: { flex: 1, backgroundColor: WF.white },
  content: { padding: WFSpace.md, paddingBottom: WFSpace.xl, gap: WFSpace.md },
  authContent: { flexGrow: 1, justifyContent: 'center', padding: WFSpace.lg, gap: WFSpace.md },
  authLogo: { alignItems: 'center', marginBottom: WFSpace.lg },

  header: { flexDirection: 'row', alignItems: 'center', justifyContent: 'space-between' },
  brand: { fontSize: 14, fontWeight: '700', letterSpacing: 2, color: WF.black },
  logo: { borderWidth: 2, borderColor: WF.black, alignItems: 'center', justifyContent: 'center', backgroundColor: WF.gray100 },
  logoText: { fontWeight: '800', color: WF.black },
  avatarBtn: { width: 40, height: 40, borderRadius: 20, borderWidth: 2, borderColor: WF.black, alignItems: 'center', justifyContent: 'center' },
  avatarBtnText: { fontWeight: '700', color: WF.black },

  tabIcon: { width: 20, height: 20, borderRadius: 4, borderWidth: 2, borderColor: WF.gray500 },
  tabIconActive: { borderColor: WF.black, backgroundColor: WF.black },

  title: { fontSize: 30, fontWeight: '800', color: WF.black, marginTop: WFSpace.sm },
  subtitle: { fontSize: 15, color: WF.gray700, marginTop: -WFSpace.sm },
  backRow: { flexDirection: 'row', alignItems: 'center', gap: WFSpace.sm, borderWidth: 1, borderColor: WF.gray300, borderRadius: WFRadius.md, padding: WFSpace.md },
  backArrow: { fontSize: 16, fontWeight: '700', color: WF.black },
  backLabel: { fontSize: 14, color: WF.gray700 },

  field: { gap: 6 },
  label: { fontSize: 12, fontWeight: '700', letterSpacing: 1, color: WF.gray700, textTransform: 'uppercase' },
  input: { borderWidth: 1.5, borderColor: WF.gray500, borderRadius: WFRadius.md, backgroundColor: WF.white, paddingHorizontal: WFSpace.md, paddingVertical: 12, fontSize: 16, color: WF.black },
  inputMulti: { minHeight: 140, paddingTop: 12 },

  btn: { borderRadius: WFRadius.pill, paddingVertical: 14, paddingHorizontal: WFSpace.lg, alignItems: 'center', justifyContent: 'center', borderWidth: 1.5, borderColor: WF.black },
  btnText: { fontSize: 16, fontWeight: '700' },
  btnTextOnDark: { color: WF.white },
  btnTextOnLight: { color: WF.black },
  pressed: { opacity: 0.6 },

  chips: { flexDirection: 'row', flexWrap: 'wrap', gap: WFSpace.sm },
  chip: { borderWidth: 1.5, borderColor: WF.gray500, borderRadius: WFRadius.pill, paddingVertical: 8, paddingHorizontal: WFSpace.md, backgroundColor: WF.white },
  chipActive: { backgroundColor: WF.black, borderColor: WF.black },
  chipText: { fontSize: 14, color: WF.gray900, fontWeight: '600' },
  chipTextActive: { color: WF.white },

  sectionRow: { flexDirection: 'row', alignItems: 'center', justifyContent: 'space-between' },
  sectionLabel: { fontSize: 13, fontWeight: '800', letterSpacing: 1, color: WF.black, textTransform: 'uppercase' },
  link: { fontSize: 14, color: WF.black, textDecorationLine: 'underline' },

  card: { borderWidth: 1.5, borderColor: WF.gray300, borderRadius: WFRadius.lg, padding: WFSpace.md, gap: WFSpace.sm, backgroundColor: WF.white },
  cardSelected: { borderColor: WF.black, backgroundColor: WF.gray100 },
  cardTitle: { fontSize: 18, fontWeight: '800', color: WF.black },
  selectTop: { flexDirection: 'row', justifyContent: 'space-between', alignItems: 'center' },
  radio: { width: 22, height: 22, borderRadius: 11, borderWidth: 2, borderColor: WF.gray500 },
  radioOn: { borderColor: WF.black, backgroundColor: WF.black },
  tag: { fontSize: 12, fontWeight: '700', color: WF.gray700 },
  body: { fontSize: 15, lineHeight: 22, color: WF.gray900 },

  listRow: { flexDirection: 'row', alignItems: 'center', gap: WFSpace.md, paddingVertical: WFSpace.sm },
  iconBox: { width: 36, height: 36, borderRadius: WFRadius.sm, backgroundColor: WF.gray200 },
  rowTitle: { fontSize: 16, fontWeight: '700', color: WF.black },
  rowSub: { fontSize: 13, color: WF.gray700 },
  chevron: { fontSize: 16, color: WF.gray500 },
  infoRow: { flexDirection: 'row', justifyContent: 'space-between', alignItems: 'center', paddingVertical: WFSpace.sm, borderBottomWidth: 1, borderBottomColor: WF.gray200 },

  notice: { borderWidth: 1.5, borderStyle: 'dashed', borderColor: WF.gray500, borderRadius: WFRadius.md, padding: WFSpace.md, gap: 4, backgroundColor: WF.gray100 },
  placeholder: { borderWidth: 1.5, borderColor: WF.gray300, borderRadius: WFRadius.md, backgroundColor: WF.gray100, alignItems: 'center', justifyContent: 'center' },
  avatar: { backgroundColor: WF.gray300, borderWidth: 2, borderColor: WF.black },

  overlay: { flex: 1, backgroundColor: 'rgba(0,0,0,0.55)', justifyContent: 'center', padding: WFSpace.lg },
  sheet: { backgroundColor: WF.white, borderRadius: WFRadius.lg, padding: WFSpace.lg, gap: WFSpace.md, borderWidth: 2, borderColor: WF.black },
});

const btnVariant = StyleSheet.create({
  primary: { backgroundColor: WF.black },
  secondary: { backgroundColor: WF.white },
  ghost: { backgroundColor: WF.gray100, borderColor: WF.gray300 },
});
