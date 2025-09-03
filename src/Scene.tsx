import { useEffect, useRef, useState } from 'react';
import { useTick } from '@pixi/react';
import { Texture, Assets } from 'pixi.js';
import { Howl } from 'howler';

function Scene() {
  const [uiTexture, setUiTexture] = useState<Texture | null>(null);
  const [isSpinning, setIsSpinning] = useState(false);
  const [rotation, setRotation] = useState(0);
  const hoverSoundRef = useRef<Howl | null>(null);

  useEffect(() => {
    let isMounted = true;
    Assets.load('/assets/main/ui.png').then((res) => {
      if (!isMounted) return;
      const tex =
        res instanceof Texture ? res : Texture.from('/assets/main/ui.png');
      setUiTexture(tex);
    });
    return () => {
      isMounted = false;
    };
  }, []);

  useEffect(() => {
    const sound = new Howl({
      src: [
        '/assets/main/sounds/sfx-hover.mp3',
        '/assets/main/sounds/sfx-hover.ogg',
      ],
      volume: 0.5,
      preload: true,
    });
    hoverSoundRef.current = sound;
    return () => {
      sound.unload();
      hoverSoundRef.current = null;
    };
  }, []);

  const handleMouseEnter = () => {
    setIsSpinning(true);
    const sound = hoverSoundRef.current;
    if (sound) {
      // avoid stacking many overlapping instances
      if (sound.playing()) {
        sound.stop();
      }
      sound.play();
    }
  };

  useTick(() => {
    if (isSpinning) {
      setRotation((r) => r + 0.05);
    }
  });

  return (
    <pixiContainer x={0} y={0}>
      <pixiGraphics
        x={100}
        y={200}
        draw={(g) => {
          g.clear();
          g.fill(0x00ff00);
          g.rect(0, 0, 120, 80);
          g.fill();
        }}
        eventMode='static'
        rotation={rotation}
        onMouseEnter={handleMouseEnter}
        onMouseLeave={() => setIsSpinning(false)}
      />

      {uiTexture && (
        <pixiSprite
          eventMode='static'
          texture={uiTexture}
          x={600}
          y={400}
          anchor={{ x: 0, y: 0 }}
          width={200}
          height={200}
          rotation={rotation}
          onMouseEnter={handleMouseEnter}
          onMouseLeave={() => setIsSpinning(false)}
        />
      )}

      <pixiText
        text='Hello World!'
        x={100}
        y={100}
        onMouseEnter={handleMouseEnter}
        onMouseLeave={() => setIsSpinning(false)}
        rotation={rotation}
        style={{
          fontSize: 32,
          fill: '#ffffff',
          fontFamily: 'Arial',
        }}
      />
    </pixiContainer>
  );
}

export default Scene;
