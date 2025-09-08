import { Application, extend } from '@pixi/react';
import { Container, Sprite, Graphics, Text } from 'pixi.js';
import Scene from './Scene';
import { gameStyles } from './config/gameStyles';

extend({
  Container,
  Graphics,
  Sprite,
  Text,
});

function App() {
  return (
    <Application
      backgroundColor={gameStyles.colors.background.primary}
      resizeTo={window}
      defaultTextStyle={{
        fontSize: 24,
        fill: '#fff',
        align: 'center',
      }}
    >
      <Scene />
    </Application>
  );
}

export default App;
