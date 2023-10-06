import { useState } from 'react';
import { Alert } from 'react-native';
import { useNavigation } from '@react-navigation/native';

import { groupCreate } from '@storage/group/groupCreate';

import { AppError } from '@utils/AppError';

import { Header } from '@components/Header';
import { Highlight } from '@components/Highlight';
import { Input } from '@components/Input';
import { Button } from '@components/Button';

import { Container, Content, Icon } from './styles';

export function NewGroup() {
  const [group, setGroup] = useState('');

  const navigation = useNavigation();

  async function handleNewGroup() {
    try {
      if (group.trim().length === 0) {
        return Alert.alert('Aviso', 'Informe o nome do grupo');
      }

      await groupCreate(group);

      navigation.navigate('players', { group });
    } catch(error) {
      if (error instanceof AppError) {
        Alert.alert('Aviso', error.message);
      } else {
        Alert.alert('Aviso', 'Não foi possível criar um novo grupo');
        console.log(error);
      }
    }
  }

  return (
    <Container>
      <Header showBackButton />

      <Content>
        <Icon />

        <Highlight
          title="Nova turma"
          subtitle="crie uma turma para adicionar as pessoas"
        />

        <Input
          placeholder='Nome da turma'
          value={group}
          onChangeText={setGroup}
        />

        <Button
          title="Criar"
          onPress={handleNewGroup}
          style={{ marginTop: 20 }}
        />
      </Content>
    </Container>
  );
}