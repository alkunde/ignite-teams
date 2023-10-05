import styled, { css } from 'styled-components/native';
import { TouchableOpacity } from 'react-native';

export type FilterTypeProps = {
  isActive?: boolean;
}

export const Container = styled(TouchableOpacity) <FilterTypeProps>`
  ${({ theme, isActive }) => isActive && css`
    border: 1px solid ${theme.COLORS.GREEN_700};
  `};

  border-radius: 4px;
  margin-right: 12px;

  /* padding: 8px 12px; */
  width: 70px;
  height: 38px;

  justify-content: center;
  align-items: center;
`;

export const Title = styled.Text`
  text-transform: uppercase;

  ${({ theme }) => css`
    font-family: ${theme.FONT_FAMILY.BOLD};
    font-size: ${theme.FONT_SIZE.SM}px;
    color: ${theme.COLORS.WHITE};
  `};
`;