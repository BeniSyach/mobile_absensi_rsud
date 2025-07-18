import { Pressable, Text, View } from '@/components/ui';

type TabType = 'pending' | 'disetujui' | 'ditolak';

interface TabSwitchProps {
  selectedTab: TabType;
  setSelectedTab: (tab: TabType) => void;
}

export default function PilihanKegiatan({
  selectedTab,
  setSelectedTab,
}: TabSwitchProps) {
  return (
    <View className="mt-10 w-fit flex-row self-center rounded-xl bg-gray-300 p-1">
      <Pressable
        onPress={() => setSelectedTab('pending')}
        className={`mx-1 px-8 py-2 ${
          selectedTab === 'pending' ? 'bg-[#287BDC]' : ''
        } rounded-xl`}
      >
        <Text
          className={`text-center text-lg font-bold ${
            selectedTab === 'pending' ? 'text-white' : 'text-gray-600'
          }`}
        >
          Pending
        </Text>
      </Pressable>

      <Pressable
        onPress={() => setSelectedTab('disetujui')}
        className={` mx-1   px-8 py-2 ${
          selectedTab === 'disetujui' ? 'bg-[#287BDC]' : ''
        }`}
      >
        <Text
          className={`text-center text-lg font-bold ${
            selectedTab === 'disetujui' ? 'text-white' : 'text-gray-600'
          }`}
        >
          Disetujui
        </Text>
      </Pressable>

      <Pressable
        onPress={() => setSelectedTab('ditolak')}
        className={`mx-1  rounded-xl px-8 py-2 ${
          selectedTab === 'ditolak' ? 'bg-[#287BDC]' : ''
        }`}
      >
        <Text
          className={` text-center text-lg font-bold ${
            selectedTab === 'ditolak' ? 'text-white' : 'text-gray-600'
          }`}
        >
          Ditolak
        </Text>
      </Pressable>
    </View>
  );
}
