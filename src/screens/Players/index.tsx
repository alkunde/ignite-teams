import { useState, useEffect, useRef } from 'react';
import { Alert, FlatList, TextInput } from 'react-native';
import { useNavigation, useRoute } from '@react-navigation/native';

import { AppError } from '@utils/AppError';

import { playerAddByGroup } from '@storage/player/playerAddByGroup';
import { playerGetByGroupAndTeam } from '@storage/player/playerGetByGroupAndTeam';
import { playerRemoveByGroup } from '@storage/player/playerRemoveByGroup';
import { groupRemoveByName } from '@storage/group/groupRemoveByName';
import { PlayerStorageDTO } from '@storage/player/PlayerStorageDTO';

import { Header } from '@components/Header';
import { Highlight } from '@components/Highlight';
import { Input } from '@components/Input';
import { ButtonIcon } from '@components/ButtonIcon';
import { Filter } from '@components/Filter';
import { PlayerCard } from '@components/PlayerCard';
import { ListEmpty } from '@components/ListEmpty';
import { Button } from '@components/Button';
import { Loading } from '@components/Loading';

import { Container, Form, HeaderList, NumberOfPlayers } from './styles';

type RouteParams = {
  group: string;
}

export function Players() {
  const [loading, setLoading] = useState(true);
  const [playerName, setPlayerName] = useState('');
  const [team, setTeam] = useState('time a');
  const [players, setPlayers] = useState<PlayerStorageDTO[]>([]);

  const { navigate } = useNavigation();
  const route = useRoute();
  const { group } = route.params as RouteParams;

  const playerNameInputRef = useRef<TextInput>(null);

  async function handleAddPlayer() {
    if (playerName.trim().length === 0) {
      return Alert.alert('Aviso', 'Informe o nome da pessoa para adicionar');
    }

    const newPlayer = {
      name: playerName,
      team,
    }

    try {
      await playerAddByGroup(newPlayer, group);

      playerNameInputRef.current?.blur();

      setPlayerName('');
      fetchPlayersByTeam();
    } catch(error) {
      if (error instanceof AppError) {
        Alert.alert('Aviso', error.message);
      } else {
        Alert.alert('Aviso', 'Não foi possível adicionar essa pessoa');
        console.log(error);
      }
    }
  }

  async function fetchPlayersByTeam() {
    try {
      setLoading(true);
      const playersByTeam = await playerGetByGroupAndTeam(group, team);
      setPlayers(playersByTeam);
    } catch(error) {
      console.log(error);
      Alert.alert('Aviso', 'Não foi possível filtrar as pessoas do time selecionado');
    } finally {
      setLoading(false);
    }
  }

  async function handlePlayerRemove(playerName: string) {
    try {
      await playerRemoveByGroup(playerName, group);

      fetchPlayersByTeam();
    } catch(error) {
      console.log(error);
      Alert.alert('Aviso', 'Não foi possível remover essa pessoa');
    }
  }

  async function groupRemove() {
    try {
      await groupRemoveByName(group);

      navigate('groups');
    } catch(error) {
      console.log(error);
      Alert.alert('Aviso', 'Não foi possível remover o grupo');
    }
  }

  async function handleGroupRemove() {
    Alert.alert(
      'Aviso',
      'Confirma a remoção do grupo?',
      [
        { text: 'Não', style: 'cancel' },
        { text: 'Sim', onPress: groupRemove}
      ]
    )
  }

  useEffect(() => {
    fetchPlayersByTeam();
  }, [team]);
  
  return (
    <Container>
      <Header showBackButton />

      <Highlight
        title={group}
        subtitle="adicione a galera e separe os times"
      />

      <Form>
        <Input
          inputRef={playerNameInputRef}
          value={playerName}
          onChangeText={setPlayerName}
          placeholder="Nome do participante"
          autoCorrect={false}
          onSubmitEditing={handleAddPlayer}
          returnKeyType="done"
        />

        <ButtonIcon
          icon="add"
          onPress={handleAddPlayer}
        />
      </Form>

      <HeaderList>
        <FlatList
          data={["time a", "time b"]}
          keyExtractor={item => item}
          renderItem={({ item }) => (
            <Filter
              title={item}
              isActive={item === team}
              onPress={() => setTeam(item)}
            />
          )}
          horizontal
          showsHorizontalScrollIndicator={false}
        />

        <NumberOfPlayers>
          {players.length}
        </NumberOfPlayers>
      </HeaderList>

      {loading ? <Loading /> :
        <FlatList
          data={players}
          keyExtractor={item => item.name}
          renderItem={({ item }) => (
            <PlayerCard
              name={item.name}
              onRemove={() => handlePlayerRemove(item.name)}
            />
          )}
          ListEmptyComponent={() => (
            <ListEmpty
              message="Não há pessoas nesse time"
            />
          )}
          showsVerticalScrollIndicator={false}
          contentContainerStyle={[
            { paddingBottom: 100 },
            players.length === 0 && { flex: 1 }
          ]}
        />
      }

      <Button
        title="Remover turma"
        type="SECONDARY"
        onPress={handleGroupRemove}
      />
    </Container>
  );
}