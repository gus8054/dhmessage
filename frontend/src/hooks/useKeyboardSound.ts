// // audio setup
// // 1. 이 배열이 HTML 기본 오디오 요소들을 담고 있다고 타입스크립트에게 알려줍니다.
// const keyStrokeSounds: HTMLAudioElement[] = [
//   new Audio("/sounds/keystroke1.mp3"),
//   new Audio("/sounds/keystroke2.mp3"),
//   new Audio("/sounds/keystroke3.mp3"),
//   new Audio("/sounds/keystroke4.mp3"),
// ];

// function useKeyboardSound() {
//   // 2. 이 함수는 반환값이 없으므로 void 타입을 지정해 줍니다.
//   const playRandomKeyStrokeSound = (): void => {
//     const randomSound =
//       keyStrokeSounds[Math.floor(Math.random() * keyStrokeSounds.length)];

//     randomSound.currentTime = 0; // this is for a better UX, def add this

//     // 3. catch 블록의 error는 기본적으로 어떤 타입이 들어올지 모르기 때문에 unknown으로 지정합니다.
//     randomSound
//       .play()
//       .catch((error: unknown) => console.log("Audio play failed:", error));
//   };

//   return { playRandomKeyStrokeSound };
// }

// export default useKeyboardSound;
