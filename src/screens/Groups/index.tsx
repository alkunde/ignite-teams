import { useState, useCallback } from 'react';
import { Alert, FlatList } from 'react-native';
import { useNavigation, useFocusEffect } from '@react-navigation/native';

import { groupGetAll } from '@storage/group/groupGetAll';

import { Header } from '@components/Header';
import { Highlight } from '@components/Highlight';
import { GroupCard } from '@components/GroupCard';
import { ListEmpty } from '@components/ListEmpty';
import { Button } from '@components/Button';
import { Loading } from '@components/Loading';

import { Container } from './styles';

export function Groups() {
  const [loading, setLoading] = useState(true);
  const [groups, setGroups] = useState<string[]>([]);

  const { navigate } = useNavigation();

  function handleNewGroup() {
    navigate('new');
  }

  async function fetchGroups() {
    try {
      setLoading(true);

      const data = await groupGetAll();

      setGroups(data);
    } catch(error) {
      console.log(error);
      Alert.alert('Aviso', 'Não foi possível carregar as turmas');
    } finally {
      setLoading(false);
    }
  }

  function handleOpenGroup(group: string) {
    navigate('players', { group });
  }

  useFocusEffect(useCallback(() => {
    fetchGroups();
  }, []));

  return (
    <Container>
      <Header />

      <Highlight title="Turmas" subtitle="jogue com a sua turma" />

      {loading ? <Loading /> :
        <FlatList
          data={groups}
          keyExtractor={item => item}
          renderItem={({ item }) => (
            <GroupCard
              title={item}
              onPress={() => handleOpenGroup(item)}
            />
          )}
          contentContainerStyle={groups.length === 0 && { flex: 1 }}
          ListEmptyComponent={() => (
            <ListEmpty
              message="Que tal cadastrar a primeira turma?"
            />
          )}
        />
      }

      <Button
        title='Criar nova turma'
        onPress={handleNewGroup}
      />
    </Container>
  );
}
