import React, { useRef, useEffect, useState } from 'react';
import { Texture, Assets } from 'pixi.js';
import { gsap } from 'gsap';

interface DiceDisplayProps {
  displayDice: [number, number] | null;
  isSpinning: boolean;
  onDiceTexturesLoaded: (textures: Record<number, Texture>) => void;
}

const DiceDisplay: React.FC<DiceDisplayProps> = ({ 
  displayDice, 
  isSpinning, 
  onDiceTexturesLoaded 
}) => {
  const [diceTextures, setDiceTextures] = useState<Record<number, Texture> | null>(null);
  const dice1Ref = useRef<any>(null);
  const dice2Ref = useRef<any>(null);
  const diceTweensRef = useRef<{ t1: gsap.core.Tween | null; t2: gsap.core.Tween | null }>({ t1: null, t2: null });
  const texturesLoadedRef = useRef<boolean>(false);

  // Map dice face to asset path
  const diceTextureFor = (n: number) => {
    if (!diceTextures) return null;
    return diceTextures[n];
  };

  useEffect(() => {
    // Only load textures once
    if (texturesLoadedRef.current) return;
    
    let mounted = true;
    const paths: Record<number, string> = {
      1: '/assets/main/dice/iaqe.png',
      2: '/assets/main/dice/du.png',
      3: '/assets/main/dice/se.png',
      4: '/assets/main/dice/chari.png',
      5: '/assets/main/dice/fanji.png',
      6: '/assets/main/dice/shashi.png',
    };
    
    Promise.all(Object.values(paths).map((p) => Assets.load(p))).then(() => {
      if (!mounted || texturesLoadedRef.current) return;
      
      const map: Record<number, Texture> = {
        1: Texture.from(paths[1]),
        2: Texture.from(paths[2]),
        3: Texture.from(paths[3]),
        4: Texture.from(paths[4]),
        5: Texture.from(paths[5]),
        6: Texture.from(paths[6]),
      };
      
      texturesLoadedRef.current = true;
      setDiceTextures(map);
      onDiceTexturesLoaded(map);
    });
    
    return () => {
      mounted = false;
    };
  }, []); // Empty dependency array - only run once

  // Handle spinning animation
  useEffect(() => {
    if (isSpinning) {
      // start rotation tweens
      if (dice1Ref.current && dice2Ref.current) {
        diceTweensRef.current.t1 = gsap.to(dice1Ref.current, { 
          rotation: '+=6.283', 
          duration: 0.4, 
          repeat: -1, 
          ease: 'none' 
        });
        diceTweensRef.current.t2 = gsap.to(dice2Ref.current, { 
          rotation: '+=6.283', 
          duration: 0.45, 
          repeat: -1, 
          ease: 'none' 
        });
      }
    } else {
      // stop rotation tweens
      if (diceTweensRef.current.t1) {
        diceTweensRef.current.t1.kill();
        diceTweensRef.current.t1 = null;
      }
      if (diceTweensRef.current.t2) {
        diceTweensRef.current.t2.kill();
        diceTweensRef.current.t2 = null;
      }
    }
  }, [isSpinning]);

  if (!diceTextures || !displayDice) {
    return null;
  }

  return (
    <>
      <pixiSprite
        ref={dice1Ref}
        texture={diceTextureFor(displayDice[0])!}
        x={200}
        y={460}
        anchor={{ x: 0.5, y: 0.5 }}
        width={56}
        height={56}
      />
      <pixiSprite
        ref={dice2Ref}
        texture={diceTextureFor(displayDice[1])!}
        x={280}
        y={460}
        anchor={{ x: 0.5, y: 0.5 }}
        width={56}
        height={56}
      />
    </>
  );
};

export default DiceDisplay;
