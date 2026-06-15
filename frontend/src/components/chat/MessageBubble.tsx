// import { withTransform } from "../../lib/imagekit";
// import { MessageVideo } from "./MessageVideo";

// // Compress + size images for the bubble (q-auto works for images; f-auto picks WebP/AVIF).
// const IMAGE_TRANSFORM = "q-auto,w-640,f-auto";

// // 1. message 객체의 구조를 정의합니다.
// // 이미지가 없는 텍스트 메시지도 있고, 텍스트가 없는 미디어 메시지도 있으므로 적절히 선택적(?) 속성으로 지정합니다.
// export interface MessageData {
//   role: string;
//   imageUrl?: string | null; // null 허용!
//   videoUrl?: string | null; // null 허용!
//   text?: string | null; // null 허용!
//   time: string;
// }

// export interface MessageBubbleProps {
//   message: MessageData;
// }

// export function MessageBubble({ message }: MessageBubbleProps) {
//   const isOwnMessage = message.role === "me";
//   const hasImage = Boolean(message.imageUrl);
//   const hasVideo = Boolean(message.videoUrl);

//   return (
//     <div
//       className={`flex w-full ${isOwnMessage ? "justify-end" : "justify-start"}`}
//     >
//       <div
//         className={`max-w-[min(90%,28rem)] rounded-2xl px-3 py-2 text-[15px] leading-snug sm:max-w-[min(75%,28rem)] sm:px-3.5 ${
//           isOwnMessage
//             ? "rounded-br-md bg-accent text-accent-foreground"
//             : "rounded-bl-md bg-surface"
//         }`}
//       >
//         {/* 타입스크립트가 imageUrl이 존재함을 확실히 알 수 있도록 && 연산자 또는 직접적인 값 확인을 사용합니다. */}
//         {hasImage && message.imageUrl ? (
//           <img
//             src={withTransform(message.imageUrl, IMAGE_TRANSFORM) || ""}
//             alt=""
//             className="mb-1.5 max-h-40 max-w-full rounded-lg object-cover sm:max-h-52 sm:rounded-xl"
//           />
//         ) : null}

//         {hasVideo && message.videoUrl ? (
//           <MessageVideo src={message.videoUrl} />
//         ) : null}

//         {message.text ? (
//           <p className="whitespace-pre-wrap wrap-break-word">{message.text}</p>
//         ) : null}

//         <p
//           className={`mt-1 text-[11px] tabular-nums ${
//             isOwnMessage ? "text-accent-foreground/75" : "text-muted"
//           }`}
//         >
//           {message.time}
//         </p>
//       </div>
//     </div>
//   );
// }
