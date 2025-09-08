// GSAP animation utilities for the Monopoly game
import { gsap } from 'gsap';

export interface AnimationTarget {
  element: any;
  properties: Record<string, any>;
}

// Button animations
export const animateButtonHover = (element: any, isHovering: boolean) => {
  if (isHovering) {
    gsap.to(element, {
      scale: 1.05,
      duration: 0.3,
      ease: 'power2.out',
    });
  } else {
    gsap.to(element, {
      scale: 1,
      duration: 0.3,
      ease: 'power2.out',
    });
  }
};

export const animateButtonClick = (element: any) => {
  gsap.to(element, {
    scale: 0.95,
    duration: 0.1,
    ease: 'power2.inOut',
    yoyo: true,
    repeat: 1,
  });
};

// Text animations
export const animateTextColorChange = (element: any, colors: string[]) => {
  const tl = gsap.timeline({ repeat: -1 });
  
  colors.forEach((color, index) => {
    tl.to(element, {
      fill: color,
      duration: 2,
      ease: 'power2.inOut',
    });
  });
  
  return tl;
};

export const animateTextPulse = (element: any) => {
  return gsap.to(element, {
    scale: 1.1,
    duration: 1.5,
    ease: 'power2.inOut',
    yoyo: true,
    repeat: -1,
  });
};

export const animateTextBounce = (element: any) => {
  return gsap.to(element, {
    y: -10,
    duration: 0.3,
    ease: 'back.out(1.7)',
    yoyo: true,
    repeat: 1,
  });
};

// Dice animations
export const animateDiceRoll = (element: any) => {
  return gsap.to(element, {
    rotation: '+=360',
    duration: 1,
    ease: 'power2.out',
  });
};

export const animateDiceBounce = (element: any) => {
  return gsap.to(element, {
    y: -20,
    duration: 0.3,
    ease: 'back.out(1.7)',
    yoyo: true,
    repeat: 1,
  });
};

// Balance change animations
export const animateBalanceChange = (element: any, isPositive: boolean) => {
  const color = isPositive ? '#00e676' : '#ff6b6b';
  const scale = isPositive ? 1.2 : 0.8;
  
  return gsap.timeline()
    .to(element, {
      scale: scale,
      fill: color,
      duration: 0.4,
      ease: 'back.out(1.7)',
    })
    .to(element, {
      scale: 1,
      duration: 0.4,
      ease: 'power2.out',
    });
};

// Cell animations
export const animateCellHighlight = (element: any) => {
  return gsap.to(element, {
    scale: 1.1,
    duration: 0.5,
    ease: 'power2.out',
    yoyo: true,
    repeat: 1,
  });
};

export const animateCellGlow = (element: any) => {
  return gsap.to(element, {
    alpha: 0.7,
    duration: 0.5,
    ease: 'power2.inOut',
    yoyo: true,
    repeat: -1,
  });
};

// Popup animations
export const animatePopupShow = (element: any) => {
  gsap.set(element, { scale: 0, alpha: 0 });
  return gsap.to(element, {
    scale: 1,
    alpha: 1,
    duration: 0.4,
    ease: 'back.out(1.7)',
  });
};

export const animatePopupHide = (element: any) => {
  return gsap.to(element, {
    scale: 0,
    alpha: 0,
    duration: 0.3,
    ease: 'power2.in',
  });
};

// Board animations
export const animateBoardRotate = (element: any) => {
  return gsap.to(element, {
    rotation: '+=5',
    duration: 2,
    ease: 'power2.inOut',
    yoyo: true,
    repeat: -1,
  });
};

export const animateBoardPulse = (element: any) => {
  return gsap.to(element, {
    scale: 1.02,
    duration: 2,
    ease: 'power2.inOut',
    yoyo: true,
    repeat: -1,
  });
};

// Particle effects
export const createParticleEffect = (x: number, y: number, color: number = 0xffffff) => {
  // This would create particle effects around a position
  // For now, we'll create a simple glow effect
  const particles = [];
  
  for (let i = 0; i < 10; i++) {
    const particle = {
      x: x + (Math.random() - 0.5) * 100,
      y: y + (Math.random() - 0.5) * 100,
      scale: Math.random() * 0.5 + 0.5,
      alpha: 1,
    };
    
    gsap.to(particle, {
      y: particle.y - 50,
      alpha: 0,
      scale: 0,
      duration: 1,
      ease: 'power2.out',
      delay: Math.random() * 0.5,
    });
    
    particles.push(particle);
  }
  
  return particles;
};

// Screen shake effect
export const animateScreenShake = (element: any, intensity: number = 10) => {
  return gsap.to(element, {
    x: `+=${intensity}`,
    duration: 0.1,
    ease: 'power2.inOut',
    yoyo: true,
    repeat: 5,
  });
};

// Win celebration
export const animateWinCelebration = (elements: any[]) => {
  const tl = gsap.timeline();
  
  elements.forEach((element, index) => {
    tl.to(element, {
      scale: 1.5,
      rotation: '+=360',
      duration: 0.5,
      ease: 'back.out(1.7)',
    }, index * 0.1);
  });
  
  return tl;
};

// Utility to stop all animations on an element
export const stopAllAnimations = (element: any) => {
  gsap.killTweensOf(element);
};

// Utility to create a sequence of animations
export const createAnimationSequence = (animations: (() => any)[]) => {
  const tl = gsap.timeline();
  
  animations.forEach((animation, index) => {
    tl.add(animation(), index * 0.2);
  });
  
  return tl;
};
