import { Application, extend } from "@pixi/react";
import { Container, Sprite, Graphics, Text } from "pixi.js";
import Scene from "./Scene";

extend({
  Container,
  Graphics,
  Sprite,
  Text,
});

function App() {
  return (
    <Application
      backgroundColor={0x922724}
      resizeTo={window}
      defaultTextStyle={{
        fontSize: 24,
        fill: "#fff",
        align: "center",
      }}
    >
      <Scene />
    </Application>
  );
}

export default App;
