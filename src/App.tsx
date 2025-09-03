import { Application, extend } from "@pixi/react";
import { Container, Sprite, Graphics, Texture, Assets, Text } from "pixi.js";
import { useEffect, useState } from "react";

extend({
  Container,
  Graphics,
  Sprite,
  Text,
});

function App() {
  const [uiTexture, setUiTexture] = useState<Texture | null>(null);

  useEffect(() => {
    let isMounted = true;
    Assets.load("/assets/main/ui.png").then((res) => {
      if (!isMounted) return;
      const tex =
        res instanceof Texture ? res : Texture.from("/assets/main/ui.png");
      setUiTexture(tex);
    });
    return () => {
      isMounted = false;
    };
  }, []);

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
      <pixiContainer x={0} y={0}>
        <pixiGraphics
          x={20}
          y={20}
          draw={(g) => {
            g.clear();
            g.fill(0x00ff00);
            g.rect(0, 0, 120, 80);
            g.fill();
          }}
          eventMode="static"
          onMouseEnter={() => {
            console.log("gr clck");
          }}
        />

        {uiTexture && (
          <pixiSprite
            eventMode="static"
            texture={uiTexture}
            x={600}
            y={400}
            anchor={{ x: 0, y: 0 }}
            width={200}
            height={200}
            rotation={Math.PI / 3}
            onMouseEnter={() => {
              console.log("clicked");
            }}
          />
        )}

        <pixiText
          text="Hello World!"
          x={700}
          y={800}
          style={{
            fontSize: 32,
            fill: "#ffffff",
            fontFamily: "Arial",
          }}
        />
      </pixiContainer>
    </Application>
  );
}

export default App;
