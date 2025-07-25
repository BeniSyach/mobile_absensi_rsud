import React from 'react';
import WebView from 'react-native-webview';

import { View } from '@/components/ui';

export default function ViewTPP() {
  // const source = {
  //   uri: 'https://morth.nic.in/sites/default/files/dd12-13_0.pdf',
  //   cache: true,
  // };

  return (
    <View className="flex-1 bg-white">
      <WebView
        source={{
          uri: 'https://morth.nic.in/sites/default/files/dd12-13_0.pdf',
        }}
        style={{ flex: 1 }}
      />
      {/* <Pdf
        source={source}
        style={{ flex: 1, width: Dimensions.get('window').width }}
        onError={(error) => console.log('PDF error:', error)}
      /> */}
    </View>
  );
}
