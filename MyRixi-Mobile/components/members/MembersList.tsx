import React from 'react';
import { FlatList, RefreshControl, StyleSheet } from 'react-native';
import { ProfileDto } from '@/types/profile';
import { useTheme } from '@/contexts/ThemeContext';
import { MemberItem } from './MemberItem';
import { MembersHeader } from './MembersHeader';
import { EmptyState } from './EmptyState';
import { LoadingIndicator } from './LoadingIndicator';

type MembersListProps = {
  members: ProfileDto[];
  searchQuery: string;
  onSearch: (text: string) => void;
  totalMembers: number;
  isLoading: boolean;
  loadingMore: boolean;
  refreshing: boolean;
  onRefresh: () => void;
  onLoadMore: () => void;
};

export const MembersList = ({
  members,
  searchQuery,
  onSearch,
  totalMembers,
  isLoading,
  loadingMore,
  refreshing,
  onRefresh,
  onLoadMore
}: MembersListProps) => {
  const { theme } = useTheme();

  const renderMember = ({ item, index }: { item: ProfileDto; index: number }) => (
    <MemberItem 
      member={item} 
      isLast={index === members.length - 1} 
    />
  );

  const renderFooter = () => {
    if (!loadingMore) return null;
    return <LoadingIndicator size="small" />;
  };

  return (
    <FlatList
      data={members}
      renderItem={renderMember}
      keyExtractor={(item) => item.id}
      onEndReached={onLoadMore}
      onEndReachedThreshold={0.3}
      refreshControl={
        <RefreshControl
          refreshing={refreshing}
          onRefresh={onRefresh}
          colors={[theme.colors.cyberPink]}
          tintColor={theme.colors.cyberPink}
        />
      }
      ListHeaderComponent={
        <MembersHeader
          searchQuery={searchQuery}
          onSearch={onSearch}
          totalMembers={totalMembers}
          isLoading={isLoading}
        />
      }
      ListFooterComponent={renderFooter}
      ListEmptyComponent={<EmptyState searchQuery={searchQuery} />}
      contentContainerStyle={styles.listContent}
    />
  );
};

const styles = StyleSheet.create({
  listContent: {
    flexGrow: 1,
    paddingBottom: 20,
  },
});
