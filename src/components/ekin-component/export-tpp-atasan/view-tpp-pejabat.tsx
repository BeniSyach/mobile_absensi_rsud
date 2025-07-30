import React from 'react';
import { Dimensions } from 'react-native';
import Pdf from 'react-native-pdf';

import { View } from '@/components/ui';

type ViewTPPProps = {
  uri: string;
};

export default function ViewTPPPejabat({ uri }: ViewTPPProps) {
  return (
    <View style={{ flex: 1, margin: 10 }}>
      <Pdf
        source={{ uri }}
        style={{
          flex: 1,
          width: Dimensions.get('window').width - 20,
          height: Dimensions.get('window').height * 0.6,
        }}
        trustAllCerts={true}
        onLoadComplete={(numberOfPages) => {
          console.log(`PDF Loaded: ${numberOfPages} pages`);
        }}
        onError={(error) => {
          console.error('PDF Error:', error);
        }}
      />
    </View>
  );
}
