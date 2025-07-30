import { Pressable, Text, View } from '@/components/ui';

type TabType = 'pending' | 'disetujui' | 'ditolak';

interface TabSwitchProps {
  selectedTab: TabType;
  setSelectedTab: (tab: TabType) => void;
  setStatus: (value: string) => void;
}

export default function PilihanKegiatan({
  selectedTab,
  setSelectedTab,
  setStatus,
}: TabSwitchProps) {
  const handlePress = (tab: TabType) => {
    setSelectedTab(tab);

    // Mapping tab ke angka status
    const statusMap: Record<TabType, string> = {
      pending: '0',
      disetujui: '1',
      ditolak: '2',
    };

    setStatus(statusMap[tab]);
  };
  return (
    <View className="mt-10 w-fit flex-row self-center rounded-xl bg-gray-300 p-1">
      {(['pending', 'disetujui', 'ditolak'] as TabType[]).map((tab) => (
        <Pressable
          key={tab}
          onPress={() => handlePress(tab)}
          className={`mx-1 rounded-xl px-8 py-2 ${
            selectedTab === tab ? 'bg-[#287BDC]' : ''
          }`}
        >
          <Text
            className={`text-center text-lg font-bold ${
              selectedTab === tab ? 'text-white' : 'text-gray-600'
            }`}
          >
            {tab.charAt(0).toUpperCase() + tab.slice(1)}
          </Text>
        </Pressable>
      ))}
    </View>
  );
}
