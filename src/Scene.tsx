import { useEffect, useRef, useState } from 'react';
import { Texture, Assets } from 'pixi.js';
import { Howl } from 'howler';
import { gsap } from 'gsap';

function Scene() {
  const [uiTexture, setUiTexture] = useState<Texture | null>(null);
  const hoverSoundRef = useRef<Howl | null>(null);
  const graphicsRef = useRef<any>(null);
  const spriteRef = useRef<any>(null);
  const textRef = useRef<any>(null);

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

  useEffect(() => {
    if (graphicsRef.current) {
      graphicsRef.current.pivot.set(25, 25);
    }
  }, []);

  const handleMouseEnter = (elementRef: React.RefObject<any>) => {
    startSpinning(elementRef);
    const sound = hoverSoundRef.current;
    if (sound) {
      if (sound.playing()) {
        sound.stop();
      }
      sound.play();
    }
  };

  const handleMouseLeave = (elementRef: React.RefObject<any>) => {
    stopSpinning(elementRef);
  };

  const startSpinning = (elementRef: React.RefObject<any>) => {
    if (elementRef.current) {
      gsap.to(elementRef.current, {
        rotation: "+=6.28",
        duration: 1,
        ease: "none",
        repeat: -1
      });
    }
  };

  const stopSpinning = (elementRef: React.RefObject<any>) => {
    if (elementRef.current) {
      gsap.killTweensOf(elementRef.current);
    }
  };

  return (
    <pixiContainer x={0} y={0}>
      <pixiGraphics
        ref={graphicsRef}
        x={700}
        y={700}
        draw={(g) => {
          g.clear();
          g.fill(0x00ff00);
          g.rect(0, 0, 50, 50);
          g.fill();
        }}
        eventMode='static'
        onMouseEnter={() => handleMouseEnter(graphicsRef)}
        onMouseLeave={() => handleMouseLeave(graphicsRef)}
      />

      {uiTexture && (
        <pixiSprite
          ref={spriteRef}
          eventMode='static'
          texture={uiTexture}
          x={600}
          y={400}
          anchor={{ x: 0.5, y: 0.5 }}
          width={200}
          height={200}
          onMouseEnter={() => handleMouseEnter(spriteRef)}
          onMouseLeave={() => handleMouseLeave(spriteRef)}
        />
      )}

      <pixiText
        ref={textRef}
        text='Hello World!'
        x={100}
        y={100}
        anchor={{ x: 0.5, y: 0.5 }}
        eventMode='static'
        onMouseEnter={() => handleMouseEnter(textRef)}
        onMouseLeave={() => handleMouseLeave(textRef)}
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
