import { Ionicons } from '@expo/vector-icons';
import { useRouter } from 'expo-router';
import { ActivityIndicator, Text, TouchableOpacity, View } from 'react-native';

import { Checkbox } from '@/components/ui';

import { AciInput } from './input-aci';

const TabSwitcher = ({
  activeTab,
  setActiveTab,
}: {
  activeTab: 'nomor_hp' | 'nik';
  setActiveTab: (tab: 'nomor_hp' | 'nik') => void;
}) => (
  <View className="mt-6 h-12 w-full flex-row rounded-full bg-[#0B2347] p-1">
    <TouchableOpacity
      className={`flex-1 items-center justify-center rounded-full ${activeTab === 'nomor_hp' ? 'bg-white' : 'bg-transparent'}`}
      onPress={() => setActiveTab('nomor_hp')}
    >
      <Text
        className={`font-semibold ${activeTab === 'nomor_hp' ? 'text-[#0B2347]' : 'text-white'}`}
      >
        Nomor HP
      </Text>
    </TouchableOpacity>
    <TouchableOpacity
      className={`flex-1 items-center justify-center rounded-full ${activeTab === 'nik' ? 'bg-white' : 'bg-transparent'}`}
      onPress={() => setActiveTab('nik')}
    >
      <Text
        className={`font-semibold ${activeTab === 'nik' ? 'text-[#0B2347]' : 'text-white'}`}
      >
        NIK
      </Text>
    </TouchableOpacity>
  </View>
);

const LoginInputs = ({
  activeTab,
  showPassword,
  setShowPassword,
  identifier,
  setIdentifier,
  password,
  setPassword,
  identifierError,
  passwordError,
}: {
  activeTab: 'nomor_hp' | 'nik';
  showPassword: boolean;
  setShowPassword: (val: boolean) => void;
  identifier: string;
  setIdentifier: (val: string) => void;
  password: string;
  setPassword: (val: string) => void;
  identifierError?: string;
  passwordError?: string;
}) => (
  <>
    <AciInput
      leftIcon={
        <Ionicons
          name={activeTab === 'nik' ? 'card-outline' : 'phone-portrait-outline'}
          size={20}
          color="#9ca3af"
        />
      }
      placeholder={
        activeTab === 'nik' ? 'Masukan 16 digit NIK' : 'Masukan nomor ponsel'
      }
      keyboardType={activeTab === 'nik' ? 'number-pad' : 'phone-pad'}
      maxLength={activeTab === 'nik' ? 16 : undefined}
      className="rounded-full border border-gray-300 bg-white py-3 pr-4"
      style={{ paddingLeft: 48 }}
      value={identifier}
      onChangeText={setIdentifier}
      error={identifierError}
    />

    <AciInput
      leftIcon={
        <Ionicons name="lock-closed-outline" size={20} color="#9ca3af" />
      }
      placeholder="Masukkan kata sandi"
      secureTextEntry={!showPassword}
      className="rounded-full border border-gray-300 bg-white py-3 pr-4"
      style={{ paddingLeft: 48 }}
      value={password}
      onChangeText={setPassword}
      error={passwordError}
      rightIcon={
        <TouchableOpacity onPress={() => setShowPassword(!showPassword)}>
          <Ionicons
            name={showPassword ? 'eye-off-outline' : 'eye-outline'}
            size={20}
            color="#9ca3af"
          />
        </TouchableOpacity>
      }
    />
  </>
);

const LoginFooter = ({
  rememberMe,
  setRememberMe,
  onLogin,
  isLoading,
}: {
  rememberMe: boolean;
  setRememberMe: (val: boolean) => void;
  onLogin: () => void;
  isLoading: boolean;
}) => {
  const router = useRouter();

  return (
    <>
      <View className="flex-row items-center justify-between px-1">
        <TouchableOpacity
          className="flex-row items-center gap-2"
          onPress={() => setRememberMe(!rememberMe)}
        >
          <Checkbox
            checked={rememberMe}
            onChange={setRememberMe}
            accessibilityLabel="Ingat saya"
          />
          <Text className="text-sm text-[#0B2347]">Ingat saya?</Text>
        </TouchableOpacity>
        <TouchableOpacity
          onPress={() => router.push('/pelayanan-publik/aci/forgot-password')}
        >
          <Text className="text-sm font-semibold text-[#0066FF] underline">
            Lupa kata sandi?
          </Text>
        </TouchableOpacity>
      </View>

      <TouchableOpacity
        onPress={onLogin}
        disabled={isLoading}
        className={`mt-2 items-center justify-center rounded-xl bg-[#0061e6] py-4 ${isLoading ? 'opacity-70' : ''}`}
        activeOpacity={0.8}
      >
        {isLoading ? (
          <ActivityIndicator color="white" />
        ) : (
          <Text
            className="text-center text-lg font-bold text-white"
            style={{ color: 'white' }}
          >
            Masuk
          </Text>
        )}
      </TouchableOpacity>

      <View className="mt-4 flex-row justify-center gap-1">
        <Text className="text-sm text-gray-600">Belum punya akun?</Text>
        <TouchableOpacity
          onPress={() => router.push('/pelayanan-publik/aci/register')}
        >
          <Text className="text-sm font-bold text-[#0066FF] underline">
            Daftar
          </Text>
        </TouchableOpacity>
      </View>
    </>
  );
};

const LoginForm = ({
  activeTab,
  rememberMe,
  setRememberMe,
  showPassword,
  setShowPassword,
  identifier,
  setIdentifier,
  password,
  setPassword,
  onLogin,
  errors,
  isLoading,
}: {
  activeTab: 'nomor_hp' | 'nik';
  rememberMe: boolean;
  setRememberMe: (val: boolean) => void;
  showPassword: boolean;
  setShowPassword: (val: boolean) => void;
  identifier: string;
  setIdentifier: (val: string) => void;
  password: string;
  setPassword: (val: string) => void;
  onLogin: () => void;
  errors: { identifier: string; password: string };
  isLoading: boolean;
}) => (
  <View className="mt-6 w-full gap-4">
    <LoginInputs
      activeTab={activeTab}
      showPassword={showPassword}
      setShowPassword={setShowPassword}
      identifier={identifier}
      setIdentifier={setIdentifier}
      password={password}
      setPassword={setPassword}
      identifierError={errors.identifier}
      passwordError={errors.password}
    />
    <LoginFooter
      rememberMe={rememberMe}
      setRememberMe={setRememberMe}
      onLogin={onLogin}
      isLoading={isLoading}
    />
  </View>
);

const LoginHeader = () => (
  <>
    <View className="mb-6 h-1.5 w-16 rounded-full bg-gray-400" />
    <Text className="text-base font-medium text-slate-700">
      Selamat Datang di
    </Text>
    <Text className="mt-1 text-center text-2xl font-extrabold text-[#0B2347]">
      Aksi Cepat Infrastruktur
    </Text>
    <Text className="mt-2 text-center text-sm text-slate-600">
      Silakan masuk agar laporan Anda dapat kami tindak lanjuti secara resmi.
    </Text>
  </>
);

export const AciLoginModal = ({
  activeTab,
  setActiveTab,
  rememberMe,
  setRememberMe,
  showPassword,
  setShowPassword,
  identifier,
  setIdentifier,
  password,
  setPassword,
  errors,
  isLoading,
  keyboardHeight,
  handleLogin,
}: any) => {
  return (
    <View className="absolute w-full" style={{ bottom: keyboardHeight }}>
      <View className="w-full rounded-t-[30px] bg-white p-6 shadow-lg">
        <View className="items-center">
          <LoginHeader />
          <TabSwitcher activeTab={activeTab} setActiveTab={setActiveTab} />
          <LoginForm
            activeTab={activeTab}
            rememberMe={rememberMe}
            setRememberMe={setRememberMe}
            showPassword={showPassword}
            setShowPassword={setShowPassword}
            identifier={identifier}
            setIdentifier={setIdentifier}
            password={password}
            setPassword={setPassword}
            onLogin={handleLogin}
            errors={errors}
            isLoading={isLoading}
          />
        </View>
      </View>
    </View>
  );
};
