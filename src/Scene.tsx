import { useEffect, useRef, useState } from 'react';
import { Texture, Assets } from 'pixi.js';
import { Howl } from 'howler';
import { gsap } from 'gsap';
import { useDiceState } from './hooks/useDiceState';

function Scene() {
  const [uiTexture, setUiTexture] = useState<Texture | null>(null);
  const [audioTexture, setAudioTexture] = useState<Texture | null>(null);
  const [audioEnabled, setAudioEnabled] = useState<boolean>(false);
  const hoverSoundRef = useRef<Howl | null>(null);
  const bgmSoundRef = useRef<Howl | null>(null);
  const graphicsRef = useRef<any>(null);
  const spriteRef = useRef<any>(null);
  const textRef = useRef<any>(null);
  const audioSpriteRef = useRef<any>(null);
  const audioTextRef = useRef<any>(null);
  
  const { diceState, rollDice, isMockMode } = useDiceState();

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
    let isMounted = true;
    Assets.load('/assets/main/audio.png').then((res) => {
      if (!isMounted) return;
      const tex =
        res instanceof Texture ? res : Texture.from('/assets/main/audio.png');
      setAudioTexture(tex);
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
    const bgm = new Howl({
      src: ['/assets/main/sounds/komari.mp3'],
      volume: 0.3,
      loop: true,
      preload: true,
    });
    bgmSoundRef.current = bgm;
    return () => {
      bgm.unload();
      bgmSoundRef.current = null;
    };
  }, []);

  useEffect(() => {
    if (graphicsRef.current) {
      graphicsRef.current.pivot.set(25, 25);
    }
  }, []);

  const handleMouseEnter = (elementRef: React.RefObject<any>) => {
    startSpinning(elementRef);
    if (audioEnabled) {
      const sound = hoverSoundRef.current;
      if (sound) {
        if (sound.playing()) {
          sound.stop();
        }
        sound.play();
      }
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

  const toggleAudio = () => {
    const newAudioState = !audioEnabled;
    setAudioEnabled(newAudioState);
    
    const bgm = bgmSoundRef.current;
    if (bgm) {
      if (newAudioState) {
        bgm.play();
      } else {
        bgm.stop();
      }
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

      {audioTexture && (
        <pixiSprite
          ref={audioSpriteRef}
          texture={audioTexture}
          x={window.innerWidth - 100}
          y={100}
          anchor={{ x: 0.5, y: 0.5 }}
          width={100}
          height={100}
          eventMode='static'
          onPointerDown={toggleAudio}
        />
      )}

      <pixiText
        ref={audioTextRef}
        text={audioEnabled ? 'click to disable audio' : 'click to enable audio'}
        x={window.innerWidth - 170}
        y={50}
        anchor={{ x: 0.5, y: 0.5 }}
        style={{
          fontSize: 24,
          fill: '#ffffff',
          fontFamily: 'Arial',
        }}
      />

      {/* Dice Roll Button */}
      <pixiGraphics
        x={100}
        y={200}
        draw={(g) => {
          g.clear();
          g.fill(0x4a90e2);
          g.rect(0, 0, 120, 40);
          g.fill();
          g.stroke({ color: 0xffffff, width: 2 });
          g.rect(0, 0, 120, 40);
          g.stroke();
        }}
        eventMode='static'
        onPointerDown={rollDice}
        cursor='pointer'
      />

      <pixiText
        text={diceState.isRolling ? 'Rolling...' : 'Roll Dice'}
        x={160}
        y={220}
        anchor={{ x: 0.5, y: 0.5 }}
        style={{
          fontSize: 16,
          fill: '#ffffff',
          fontFamily: 'Arial',
        }}
      />

      {/* Dice Results Display */}
      {diceState.dice && (
        <>
          <pixiText
            text={`Dice 1: ${diceState.dice[0]}`}
            x={100}
            y={280}
            anchor={{ x: 0, y: 0.5 }}
            style={{
              fontSize: 20,
              fill: '#ffffff',
              fontFamily: 'Arial',
            }}
          />
          <pixiText
            text={`Dice 2: ${diceState.dice[1]}`}
            x={100}
            y={310}
            anchor={{ x: 0, y: 0.5 }}
            style={{
              fontSize: 20,
              fill: '#ffffff',
              fontFamily: 'Arial',
            }}
          />
          <pixiText
            text={`Total: ${diceState.dice[0] + diceState.dice[1]}`}
            x={100}
            y={340}
            anchor={{ x: 0, y: 0.5 }}
            style={{
              fontSize: 24,
              fill: '#ffff00',
              fontFamily: 'Arial',
            }}
          />
        </>
      )}

      {/* Mode Indicator */}
      <pixiText
        text={`Mode: ${isMockMode ? 'Mock (Local)' : 'Backend'}`}
        x={100}
        y={50}
        anchor={{ x: 0, y: 0.5 }}
        style={{
          fontSize: 18,
          fill: isMockMode ? '#00ff00' : '#ff6b6b',
          fontFamily: 'Arial',
        }}
      />
    </pixiContainer>
  );
}

export default Scene;
