import React from 'react';

import { AciAlert } from '@/components/pelayanan-publik-component/aci/aci-alert';

import {
  AdminLaporanContent,
  LoadingView,
  NotFoundView,
} from './detail-components';
import { useAdminLaporanDetail } from './use-admin-laporan-detail';

export default function AdminLaporanDetail() {
  const {
    loading,
    report,
    user,
    regionNames,
    updateModalVisible,
    setUpdateModalVisible,
    handleUpdateSuccess,
    goBack,
    alertConfig,
  } = useAdminLaporanDetail();

  if (loading) return <LoadingView />;

  if (!report) return <NotFoundView onBack={goBack} />;

  return (
    <>
      <AdminLaporanContent
        report={report}
        user={user}
        regionNames={regionNames}
        updateModalVisible={updateModalVisible}
        setUpdateModalVisible={setUpdateModalVisible}
        handleUpdateSuccess={handleUpdateSuccess}
      />
      <AciAlert {...alertConfig} />
    </>
  );
}
